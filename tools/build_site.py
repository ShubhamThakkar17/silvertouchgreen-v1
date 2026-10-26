#!/usr/bin/env python3
"""Assemble the static site from src/ into the repository root.

Each page in src/pages/ starts with a JSON front-matter comment:

    <!--page
    { "file": "about.html", "slug": "about", "title": "...", "description": "...",
      "active": "about", "contact_num": "08", "contact_title": "...", "contact_text": "..." }
    -->

followed by the page's <main> markup, which can include {{contact}} for the shared
enquiry section. Shared head, header and footer come from src/partials/.

Usage:  python3 tools/build_site.py
Output: index.html, about.html, ... in the repository root (commit these; hosting
needs no build step).
"""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

# Which nav item each page highlights
ACTIVE_KEYS = ["home", "about", "solutions", "ci", "public", "bess", "hybrid", "fpv"]
SOLUTION_PAGES = {"ci", "public", "bess", "hybrid", "fpv"}


RELATED = [
    ("ci", "commercial-industrial-solar.html", "C&amp;I solar EPC", "Rooftop and ground-mount systems for plants and commercial sites",
     '<path d="M2 18V9l4 2.5V9l4 2.5V9l4 2.5V5h3v13Z" /><path d="M5 6.5l3-1.5M10 6.5l3-1.5" />'),
    ("public", "public-infrastructure.html", "Public infrastructure", "Compliant systems for government buildings and utilities",
     '<path d="M2 8 10 3.5 18 8ZM3.5 17.5h13M4.5 9.5v6M8 9.5v6M12 9.5v6M15.5 9.5v6" />'),
    ("bess", "battery-storage.html", "Battery storage", "Peak shaving, backup power and solar shifting",
     '<rect x="2.5" y="5.5" width="13" height="10" rx="1.5" /><path d="M15.5 8.5h2v4h-2M5.5 8.5v4M8.5 8.5v4M11.5 8.5v4" />'),
    ("hybrid", "hybrid-solar-wind.html", "Hybrid solar + wind", "Two resources, planned around your site",
     '<path d="M13 18V8M13 8V2.5M13 8l4.5 2.6M13 8l-4.5 2.6M2 18h16" /><path d="M2.5 15.5 8 13.5" />'),
    ("fpv", "floating-solar.html", "Floating solar", "Generation on reservoirs and industrial water bodies",
     '<path d="M4 10.5 15 8.5M2 14q2-1.6 4 0t4 0 4 0 4 0M2 17.5q2-1.6 4 0t4 0 4 0 4 0" />'),
]


def related_html(active):
    cards = []
    for key, href, title, text, icon in RELATED:
        if key == active:
            continue
        cards.append(
            f'<a href="{href}" data-reveal><svg class="nm-ico" viewBox="0 0 20 20" aria-hidden="true">{icon}</svg>'
            f'<b>{title}</b><small>{text}</small>'
            f'<span class="go">Explore<svg><use href="#i-arrow" /></svg></span></a>'
        )
    return '<div class="related">' + "".join(cards[:4]) + "</div>"


def render(template, values):
    def sub(m):
        key = m.group(1)
        if key not in values:
            raise KeyError(f"Missing template value: {key}")
        return values[key]
    return re.sub(r"\{\{(\w+)\}\}", sub, template)


def build():
    partials = {p.stem: p.read_text() for p in (SRC / "partials").glob("*.html")}
    built = []
    for page_path in sorted((SRC / "pages").glob("*.html")):
        text = page_path.read_text()
        m = re.match(r"\s*<!--page\s*(\{.*?\})\s*-->\s*", text, re.S)
        if not m:
            raise ValueError(f"{page_path.name}: missing <!--page {{...}} --> front matter")
        meta = json.loads(m.group(1))
        body = text[m.end():]
        is_home = meta["file"] == "index.html"
        active = meta.get("active", "")

        values = {
            "title": meta["title"],
            "description": meta["description"],
            "slug": meta["slug"],
            "home": "" if is_home else "index.html",
            "home_link": "#top" if is_home else "index.html",
            "contact_num": meta.get("contact_num", ""),
            "contact_title": meta.get("contact_title", ""),
            "contact_text": meta.get("contact_text", ""),
        }
        for key in ACTIVE_KEYS:
            on = key == active or (key == "solutions" and active in SOLUTION_PAGES)
            values["act_" + key] = "is-active" if on else ""

        values["related"] = related_html(active)
        values["contact"] = render(partials["contact"], values)
        html = "".join([
            render(partials["head"], values),
            render(partials["header"], values),
            render(body, values),
            render(partials["footer"], values),
        ])
        (ROOT / meta["file"]).write_text(html)
        built.append(meta["file"])
    return built


if __name__ == "__main__":
    for f in build():
        print("built", f)
