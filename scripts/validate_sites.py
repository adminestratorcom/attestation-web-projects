from pathlib import Path
from html.parser import HTMLParser
import sys
import xml.etree.ElementTree as ET

PROJECTS = ["01_finance","02_cafe","03_transport","04_social","05_education","06_health","07_culture","08_sport","09_shop","10_service","11_portfolio"]
BASE = "https://adminestratorcom.github.io/attestation-web-projects/"
errors = []

class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = self.description = self.canonical = self.jsonld = False
        self.assets = []
        self.in_title = False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title": self.in_title = True
        if tag == "meta" and a.get("name","").lower() == "description" and a.get("content","").strip(): self.description = True
        if tag == "link" and a.get("rel","").lower() == "canonical": self.canonical = True
        if tag == "script" and a.get("type","").lower() == "application/ld+json": self.jsonld = True
        for key in ("href","src"):
            value = a.get(key,"")
            if key == "href" and value.lower().split("?")[0].endswith(".css"): self.assets.append(value)
            if key == "src" and value.lower().split("?")[0].endswith(".js"): self.assets.append(value)
    def handle_endtag(self, tag):
        if tag == "title": self.in_title = False
    def handle_data(self, data):
        if self.in_title and data.strip(): self.title = True

pages = [Path("index.html")]
for project in PROJECTS:
    pages.extend(Path(project) / name for name in ("index.html","about.html","contacts.html"))

for page in pages:
    if not page.is_file():
        errors.append(f"Missing HTML: {page}")
        continue
    parser = Parser()
    parser.feed(page.read_text(encoding="utf-8"))
    for ok,label in ((parser.title,"title"),(parser.description,"meta description"),(parser.canonical,"canonical"),(parser.jsonld,"JSON-LD")):
        if not ok: errors.append(f"{page}: missing {label}")
    for asset in parser.assets:
        if asset.startswith(("http://","https://","//")): continue
        local = page.parent / asset.split("#")[0].split("?")[0]
        if not local.is_file(): errors.append(f"{page}: missing local asset {asset}")

def sitemap(path):
    root = ET.parse(path).getroot()
    ns = {"s":"http://www.sitemaps.org/schemas/sitemap/0.9"}
    return {x.text for x in root.findall(".//s:loc",ns)}

expected = {BASE}
for project in PROJECTS:
    expected.update(BASE + project + "/" + name for name in ("index.html","about.html","contacts.html"))
try:
    actual = sitemap(Path("sitemap.xml"))
    if actual != expected: errors.append(f"Root sitemap mismatch: expected {len(expected)}, found {len(actual)}")
except Exception as exc: errors.append(f"Root sitemap invalid: {exc}")

for project in PROJECTS:
    wanted = {BASE + project + "/" + name for name in ("index.html","about.html","contacts.html")}
    try:
        actual = sitemap(Path(project)/"sitemap.xml")
        if actual != wanted: errors.append(f"{project}/sitemap.xml mismatch: expected 3, found {len(actual)}")
    except Exception as exc: errors.append(f"{project}/sitemap.xml invalid: {exc}")
    robots = Path(project)/"robots.txt"
    if not robots.is_file() or f"/{project}/sitemap.xml" not in robots.read_text(encoding="utf-8"):
        errors.append(f"{project}/robots.txt missing or sitemap reference incorrect")

robots = Path("robots.txt")
if not robots.is_file() or "/attestation-web-projects/sitemap.xml" not in robots.read_text(encoding="utf-8"):
    errors.append("Root robots.txt missing or sitemap reference incorrect")

print(f"Checked {len(pages)} expected HTML pages.")
if errors:
    print("\n".join("ERROR: " + e for e in errors))
    sys.exit(1)
print("PASS: metadata, local CSS/JS references, robots.txt and all sitemaps.")
