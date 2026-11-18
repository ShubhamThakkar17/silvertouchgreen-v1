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
import datetime
import html
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
SITE = "https://www.silvertouchgreen.com"
ORG_NAME = "Silver Touch Green RE Pvt Ltd"

# Which nav item each page highlights
ACTIVE_KEYS = ["home", "about", "solutions", "ci", "public", "bess", "hybrid", "fpv", "news"]
SOLUTION_PAGES = {"ci", "public", "bess", "hybrid", "fpv"}

# Breadcrumb names (solution pages sit under "Solutions")
CRUMBS = {
    "about.html": "About us",
    "commercial-industrial-solar.html": "C&I solar EPC",
    "public-infrastructure.html": "Public infrastructure",
    "battery-storage.html": "Battery storage",
    "hybrid-solar-wind.html": "Hybrid solar + wind",
    "floating-solar.html": "Floating solar",
    "watts-up.html": "Watt's Up",
}

# ---------------------------------------------------------------- Watt's Up
TAGS = {
    "storage": "Storage szn",
    "solar": "Solar",
    "policy": "Policy tea",
    "floating": "Float on",
    "ci": "C&I",
    "hybrid": "Hybrid era",
}


def esc(s):
    return html.escape(s, quote=True)


def nice_date(iso):
    d = datetime.date.fromisoformat(iso)
    return f"{d.day} {d.strftime('%b %Y')}"


def load_news():
    data = json.loads((SRC / "data" / "news.json").read_text())
    return sorted(data["items"], key=lambda i: i["date"], reverse=True)


def news_card(item, featured=False):
    ours = item["kind"] == "ours"
    ext = "" if ours else ' target="_blank" rel="noopener"'
    cta = "Read the announcement" if ours else f"Read on {esc(item['source'])}"
    arrow = '<svg aria-hidden="true"><use href="#i-arrow" /></svg>' if ours else '<svg class="ext" viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2h6v6M10 2 3 9" /></svg>'
    tag = "Our news" if ours else TAGS.get(item["tag"], item["tag"])
    stat = item.get("stat") or {}
    stat_html = ""
    if stat:
        stat_html = (f'<div class="wu-stat"><b data-count="{esc(stat["value"])}">{esc(stat["value"])}</b>'
                     f'<small>{esc(stat.get("unit", ""))}</small><span>{esc(stat["label"])}</span></div>')
    cls = "wu-card" + (" wu-card--ours" if ours else "") + (" wu-card--featured" if featured else "")
    return (
        f'<article class="{cls}" data-tag="{esc(item["tag"])}" data-kind="{esc(item["kind"])}" data-reveal>'
        f'<div class="wu-vis" data-vis="{esc(item["vis"])}" aria-hidden="true"></div>'
        f'<div class="wu-body">'
        f'<div class="wu-meta mono"><span class="wu-tag">{esc(tag)}</span><span class="wu-src">{esc(item["source"])}</span>'
        f'<time datetime="{item["date"]}">{nice_date(item["date"])}</time></div>'
        f'<h3><a class="wu-link" href="{esc(item["url"])}"{ext}>{esc(item["title"])}</a></h3>'
        f'<p class="wu-tldr"><b>TL;DR</b> {esc(item["tldr"])}</p>'
        f'<p class="wu-sowhat"><b>So what?</b> {esc(item["sowhat"])}</p>'
        f'{stat_html}'
        f'<span class="wu-cta">{cta}{arrow}</span>'
        f"</div></article>"
    )


def news_blocks(items):
    ours = [i for i in items if i["kind"] == "ours"]
    rest = [i for i in items if i["kind"] != "ours"]
    featured = news_card(ours[0], featured=True) if ours else ""
    cards = "".join(news_card(i) for i in (ours[1:] + rest))
    latest = "".join(news_card(i) for i in items[:3])
    ticker = "".join(
        f'<span><b>{esc(i["stat"]["value"])}{(" " + esc(i["stat"]["unit"])) if i["stat"].get("unit") else ""}</b> {esc(i["stat"]["label"])}</span>'
        for i in items if i.get("stat")
    )
    filters = ['<button type="button" class="wu-chip" aria-pressed="true" data-filter="all">All the tea</button>']
    used = []
    for i in rest:
        if i["tag"] not in used:
            used.append(i["tag"])
    filters += [f'<button type="button" class="wu-chip" aria-pressed="false" data-filter="{t}">{esc(TAGS[t])}</button>' for t in used]
    return {
        "news_featured": featured,
        "news_cards": cards,
        "news_latest": latest,
        "news_ticker": ticker + ticker,
        "news_filters": "".join(filters),
    }


# ---------------------------------------------------------------- SEO
def page_url(file):
    return SITE + "/" if file == "index.html" else f"{SITE}/{file}"


def jsonld(meta, news):
    file = meta["file"]
    graph = []
    org = {
        "@type": "Organization",
        "@id": SITE + "/#org",
        "name": ORG_NAME,
        "alternateName": "SilverTouch Green",
        "url": SITE + "/",
        "logo": SITE + "/assets/img/logo-512.png",
        "description": "Renewable energy EPC for industrial, commercial and government facilities in India: C&I solar, public infrastructure, battery storage, hybrid solar-wind and floating solar.",
        "areaServed": "IN",
        "slogan": "Ideas. People. Solutions.",
    }
    if file == "index.html":
        graph += [org, {"@type": "WebSite", "@id": SITE + "/#website", "url": SITE + "/", "name": "Silver Touch Green RE", "publisher": {"@id": SITE + "/#org"}}]
    else:
        crumbs = [{"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"}]
        if meta.get("active") in SOLUTION_PAGES:
            crumbs.append({"@type": "ListItem", "position": 2, "name": "Solutions", "item": SITE + "/#solutions"})
        crumbs.append({"@type": "ListItem", "position": len(crumbs) + 1, "name": CRUMBS.get(file, meta["title"]), "item": page_url(file)})
        graph.append({"@type": "BreadcrumbList", "itemListElement": crumbs})
    if file == "watts-up.html":
        graph.append({
            "@type": "CollectionPage",
            "name": "Watt's Up: renewable energy news",
            "url": page_url(file),
            "publisher": {"@id": SITE + "/#org"},
            "mainEntity": {
                "@type": "ItemList",
                "itemListElement": [
                    {"@type": "ListItem", "position": n + 1, "name": i["title"],
                     "url": i["url"] if i["url"].startswith("http") else SITE + "/" + i["url"]}
                    for n, i in enumerate(news)
                ],
            },
        })
    blob = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, separators=(",", ":"))
    return '<script type="application/ld+json">' + blob.replace("</", "<\\/") + "</script>"


def write_seo_files(metas):
    today = datetime.date.today().isoformat()
    urls = "".join(
        f"  <url><loc>{page_url(m['file'])}</loc><lastmod>{today}</lastmod><priority>{'1.0' if m['file'] == 'index.html' else '0.8'}</priority></url>\n"
        for m in sorted(metas, key=lambda m: (m["file"] != "index.html", m["file"]))
    )
    (ROOT / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "</urlset>\n")
    (ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")


def write_rss(news):
    def rfc822(iso):
        d = datetime.datetime.fromisoformat(iso + "T09:00:00+05:30")
        return d.strftime("%a, %d %b %Y %H:%M:%S %z")
    items = "".join(
        "  <item>\n"
        f"    <title>{esc(i['title'])}</title>\n"
        f"    <link>{esc(i['url'] if i['url'].startswith('http') else SITE + '/' + i['url'])}</link>\n"
        f"    <guid isPermaLink=\"false\">stg-{esc(i['id'])}</guid>\n"
        f"    <pubDate>{rfc822(i['date'])}</pubDate>\n"
        f"    <category>{esc('Our news' if i['kind'] == 'ours' else TAGS.get(i['tag'], i['tag']))}</category>\n"
        f"    <description>{esc(i['tldr'] + ' So what? ' + i['sowhat'] + ' (Source: ' + i['source'] + ')')}</description>\n"
        "  </item>\n"
        for i in news
    )
    (ROOT / "watts-up.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n'
        f"  <title>Watt's Up by Silver Touch Green RE</title>\n  <link>{SITE}/watts-up.html</link>\n"
        f'  <atom:link href="{SITE}/watts-up.xml" rel="self" type="application/rss+xml" />\n'
        "  <description>Renewable energy news from India, no cap: storage, solar, policy and projects, summarised.</description>\n"
        "  <language>en-in</language>\n" + items + "</channel>\n</rss>\n"
    )


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
    news = load_news()
    blocks = news_blocks(news)
    built = []
    metas = []
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
            "canonical": page_url(meta["file"]),
            "og_image": SITE + "/assets/img/og-image.png",
            "jsonld": jsonld(meta, news),
        }
        values.update(blocks)
        metas.append(meta)
        for key in ACTIVE_KEYS:
            on = key == active or (key == "solutions" and active in SOLUTION_PAGES)
            values["act_" + key] = "is-active" if on else ""

        values["related"] = related_html(active)
        values["contact"] = render(partials["contact"], values)
        page = "".join([
            render(partials["head"], values),
            render(partials["header"], values),
            render(body, values),
            render(partials["footer"], values),
        ])
        (ROOT / meta["file"]).write_text(page)
        built.append(meta["file"])
    write_seo_files(metas)
    write_rss(news)
    built += ["sitemap.xml", "robots.txt", "watts-up.xml"]
    return built


if __name__ == "__main__":
    for f in build():
        print("built", f)
