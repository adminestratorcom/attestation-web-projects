from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(".")
PROJECTS = [
    "01_finance", "02_cafe", "03_transport", "04_social", "05_education",
    "06_health", "07_culture", "08_sport", "09_shop", "10_service", "11_portfolio"
]
errors = []
checked = 0

def fail(message):
    errors.append(message)

html_files = [ROOT / "index.html"]
for project in PROJECTS:
    html_files.extend(ROOT / project / page for page in ("index.html", "about.html", "contacts.html"))

for path in html_files:
    if not path.is_file():
        fail(f"Missing HTML: {path}")
        continue
    checked += 1
    content = path.read_text(encoding="utf-8")
    rel = path.as_posix()
    for pattern, label in [
        (r"<title[^>]*>\\s*.+?\\s*</title>", "title"),
        (r'<meta[^>]+name=["\\']description["\\'][^>]+content=["\\'][^"\\']+["\\']', "meta description"),
        (r'<link[^>]+rel=["\\']canonical["\\']', "canonical"),
    ]:
        if not re.search(pattern, content, re.I | re.S):
            fail(f"{rel}: missing {label}")
    if "application/ld+json" not in content.lower():
        fail(f"{rel}: missing JSON-LD")
    for attr, label in (("href", "CSS"), ("src", "JS")):
        for raw in re.findall(rf'{attr}=["\\']([^"\\']+)["\\']', content, re.I):
            if raw.startswith(("http://", "https://", "mailto:", "tel:", "#", "data:")):
                continue
            target = (path.parent / raw.split("#", 1)[0].split("?", 1)[0]).resolve()
            if not target.is_file():
                fail(f"{rel}: missing local {label} reference {raw}")

# Root sitemap must contain the catalog and all 33 project pages.
try:
    root = ET.parse(ROOT / "sitemap.xml").getroot()
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = {node.text for node in root.findall(".//sm:loc", ns)}
    base = "https://adminestratorcom.github.io/attestation-web-projects/"
    expected = {base}
    for project in PROJECTS:
        expected.update(base + project + "/" + page for page in ("index.html", "about.html", "contacts.html"))
    missing = sorted(expected - urls)
    extra = sorted(urls - expected)
    if missing:
        fail(f"Root sitemap missing {len(missing)} expected URL(s): {missing}")
    if extra:
        fail(f"Root sitemap has {len(extra)} unexpected URL(s): {extra}")
except Exception as exc:
    fail(f"Root sitemap.xml invalid: {exc}")

for project in PROJECTS:
    folder = ROOT / project
    try:
        tree = ET.parse(folder / "sitemap.xml").getroot()
        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        urls = {node.text for node in tree.findall(".//sm:loc", ns)}
        expected = {f"https://adminestratorcom.github.io/attestation-web-projects/{project}/{page}" for page in ("index.html", "about.html", "contacts.html")}
        if urls != expected:
            fail(f"{project}/sitemap.xml: expected 3 project URLs, found {len(urls)}")
    except Exception as exc:
        fail(f"{project}/sitemap.xml invalid: {exc}")
    robots = folder / "robots.txt"
    if not robots.is_file() or f"/{project}/sitemap.xml" not in robots.read_text(encoding="utf-8"):
        fail(f"{project}/robots.txt missing or does not reference its sitemap")

root_robots = ROOT / "robots.txt"
if not root_robots.is_file() or "/attestation-web-projects/sitemap.xml" not in root_robots.read_text(encoding="utf-8"):
    fail("Root robots.txt missing or does not reference root sitemap")

print(f"Checked {checked}/{len(html_files)} HTML pages.")
if errors:
    print("\\n".join(f"ERROR: {item}" for item in errors))
    sys.exit(1)
print("PASS: HTML metadata, local CSS/JS references, robots.txt and all sitemaps.")
