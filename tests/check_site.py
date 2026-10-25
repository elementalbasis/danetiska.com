"""Audit a built Jekyll site using only the Python standard library."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import sys


class PageAudit(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.assets = []
        self.references = []
        self.counts = {}
        self.redirect = False

    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        self.counts[tag] = self.counts.get(tag, 0) + 1
        if "id" in attributes:
            self.ids.append(attributes["id"])
        if tag == "meta" and attributes.get("http-equiv", "").lower() == "refresh":
            self.redirect = True
        if tag in ("script", "img", "link"):
            url = attributes.get("href" if tag == "link" else "src")
            if url and url.startswith("/"):
                self.assets.append(url)
        for attribute in ("aria-labelledby", "aria-controls"):
            self.references.extend(attributes.get(attribute, "").split())


def check_pages(output):
    failures = []
    checked = 0
    for file in sorted(output.rglob("*.html")):
        relative = file.relative_to(output)
        # Lexicons are HTML datasets, not standalone website documents.
        if "assets" in relative.parts or relative.as_posix() == "samiru/lexicon.html":
            continue
        audit = PageAudit()
        audit.feed(file.read_text())
        if audit.redirect:
            continue
        checked += 1
        issues = []
        for tag in ("main", "h1"):
            if audit.counts.get(tag) != 1:
                issues.append(f"Expected one {tag}, found {audit.counts.get(tag, 0)}")
        if len(audit.ids) != len(set(audit.ids)):
            issues.append("Duplicate IDs")
        missing_ids = set(audit.references) - set(audit.ids)
        if missing_ids:
            issues.append(f"Missing ID references: {sorted(missing_ids)}")
        for url in audit.assets:
            target = output / unquote(urlsplit(url).path).lstrip("/")
            if not target.exists():
                issues.append(f"Missing local asset: {url}")
        if issues:
            failures.append((str(relative), "; ".join(issues)))
    return checked, failures


def check_styles(source):
    failures = []
    files = sorted((source / "assets/css").rglob("*.css"))
    stylesheet = "\n".join(file.read_text() for file in files)
    declared = set(re.findall(r"(--[\w-]+)\s*:", stylesheet))
    used = set(re.findall(r"var\((--[\w-]+)", stylesheet))
    if used - declared:
        failures.append(("CSS", f"Undefined tokens: {sorted(used - declared)}"))
    for file in files:
        text = file.read_text()
        if file.name != "theme.css":
            if re.search(r"#[0-9a-fA-F]{3,8}\b|(?:rgb|hsl)a?\(", text):
                failures.append((str(file), "Palette outside theme.css"))
            for value in re.findall(r"border-radius:\s*([^;]+);", text):
                if value not in ("0", "var(--radius)", "inherit"):
                    failures.append((str(file), f"Independent corner radius: {value}"))
            if re.search(r"font-size:\s*\d", text):
                failures.append((str(file), "Font size outside the shared type scale"))
        for url in re.findall(r"@import(?:\s+url\()?\s*[\"']([^\"']+)", text):
            target = source / url.lstrip("/") if url.startswith("/") else file.parent / url
            if not target.is_file():
                failures.append((str(file), f"Missing import: {url}"))
    return failures


if __name__ == "__main__":
    output = Path(sys.argv[1] if len(sys.argv) > 1 else "_site")
    if not output.is_dir():
        raise SystemExit("Build first: jekyll build --config _config.yaml")
    source = Path(__file__).resolve().parents[1]
    checked, failures = check_pages(output)
    failures.extend(check_styles(source))
    if checked == 0:
        failures.append((str(output), "No generated website pages found"))
    for location, issue in failures:
        print(f"{location}: {issue}")
    if failures:
        raise SystemExit(1)
    print(f"Passed: {checked} generated pages; assets, landmarks, IDs, and CSS tokens.")
