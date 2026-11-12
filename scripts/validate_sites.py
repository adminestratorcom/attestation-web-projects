from pathlib import Path
from html.parser import HTMLParser
import sys
import xml.etree.ElementTree as ET

PROJECTS = [
    "01_finance", "02_cafe", "03_transport", "04_social", "05_education",
    "06_health", "07_culture", "08_sport", "09_shop", "10_service", "11_portfolio"
]
BASE = "https://adminestratorcom.github.io/attestation-web-projects/"
errors = []

class PageParser(HTMLParser):
    def __init__(self, page):
        super().__init__()
        self.page = page
        self.title = False
        self.description = False
        self.canonical = False
        self.jsonld = False
        self.assets = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title":
            self.title = True
        if tag == "meta" and attrs.get("name", "").lower() == "description" and attrs.get("content", "").strip():
            self.description = True
        if tag == "link" and attrs.get("rel", "").lower() == "canonical":
            self.canonical = True
        if tag == "script" and attrs.get("type", "").lower() == "application/ld+json":
            self.jsonld = True
        for key in ("href", "src"):
            value = attrs.get(key, "")
            if value and key == "href" and value.lower().split("?", 1)[0].endswith(".css"):
                self.assets.append(value)
            if value and key == "src" and value.lower().split("?", 1)[0].endswith(".js"):
                self.assets.append(value)

pages = [Path("index.html")]
for project in PROJECTS:
    pages.extend(Path(project) / name for name in ("index.html", "about.html", "contacts.html"))

for page in pages:
    if not page.is_file():
        errors.append(f"Missing HTML: {page}")
        continue
    parser = PageParser(page)
    parser.feed(page.read_text(encoding="utf-8"))
    for ok, label in ((parser.title, "title"), (parser.description, "meta description"),
                      (parser.canonical, "canonical"), (parser.jsonld, "JSON-LD")):
        if not ok:
            errors.append(f"{page}: missing {label}")
    for asset in parser.assets:
        if asset.startswith(("http://", "https://", "//")):
            continue
        local = (page.parent / asset.split("#", 1)[0].split("?", 1)[0])
        if not local.is_file():
            errors.append(f"{page}: missing local asset {asset}")

def read_sitemap(path):
    root = ET.parse(path).getroot()
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    return {node.text for node in root.findall(".//sm:loc", ns)}

try:
    expected = {BASE}
    for project in PROJECTS:
        expected.update(BASE + project + "/" + name for name in ("index.html", "about.html", "contacts.html"))
    actual = read_sitemap(Path("sitemap.xml"))
    if actual != expected:
        errors.append(f"Root sitemap mismatch: expected {len(expected)} URLs, found {len(actual)}")
except Exception as exc:
    errors.append(f"Root sitemap.xml invalid: {exc}")

for project in PROJECTS:
    try:
        expected = {BASE + project + "/" + name for name in ("index.html", "about.html", "contacts.html")}
        actual = read_sitemap(Path(project) / "sitemap.xml")
        if actual != expected:
            errors.append(f"{project}/sitemap.xml mismatch: expected 3 URLs, found {len(actual)}")
    except Exception as exc:
        errors.append(f"{project}/sitemap.xml invalid: {exc}")
    robots = Path(project) / "robots.txt"
    if not robots.is_file() or f"/{project}/sitemap.xml" not in robots.read_text(encoding="utf-8"):
        errors.append(f"{project}/robots.txt missing or sitemap reference incorrect")

root_robots = Path("robots.txt")
if not root_robots.is_file() or "/attestation-web-projects/sitemap.xml" not in root_robots.read_text(encoding="utf-8"):
    errors.append("Root robots.txt missing or sitemap reference incorrect")

print(f"Checked {len(pages)} expected HTML pages.")
if errors:
    print("\n".join("ERROR: " + error for error in errors))
    sys.exit(1)
print("PASS: page metadata, local CSS/JS references, robots.txt and all sitemaps.")
