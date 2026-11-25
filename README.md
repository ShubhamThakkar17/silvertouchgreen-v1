# Silver Touch Green RE: website

Multipage marketing site for Silver Touch Green RE Pvt Ltd: home, about, and five solution pages. It is static HTML, CSS and JS. A small Python script assembles the pages from shared partials.

## Build

```bash
python3 tools/build_site.py      # src/partials + src/pages  ->  *.html in the repo root
```

Edit pages in `src/pages/` and shared chrome (head, nav, contact, footer) in `src/partials/`, then rebuild. Each page starts with a JSON front-matter comment (`<!--page {...} -->`) giving its title, description, slug and contact-section copy. The generated root `*.html` files are committed, so the site deploys as plain static files.

To stage a shareable preview (the main page plus every other page and asset at the same relative paths): `python3 tools/build_preview.py . <out_dir>`.

## Run locally

```bash
npx http-server -p 8080 .
# or: python3 -m http.server 8080
```

Open http://localhost:8080.

## Structure

```
index.html, about.html, commercial-industrial-solar.html, battery-storage.html,
floating-solar.html, hybrid-solar-wind.html, public-infrastructure.html
                        Generated pages (do not edit directly)
src/pages/              Page sources with hand-drawn inline SVG illustrations
src/partials/           head, header (nav, logo symbols, transition curtain), contact, footer
tools/build_site.py     Page assembler
assets/css/styles.css   Design tokens, layout, illustration system and keyframes
assets/css/pages.css    Inner pages: sub-hero, scroll stories, charts, roadmap, page transitions
assets/js/main.js       Diagram builders, scroll scenes, accordion, counters, form, nav and page transitions
assets/js/pages.js      Charts (SVG, hover tooltips, tab morphing), scroll stories, word reveals
assets/js/vendor/       GSAP 3.12.5 + ScrollTrigger (vendored, no CDN dependency)
assets/img/brand/       Silver Touch Green RE logo kit: symbol, horizontal and stacked, each in full colour, black and white (SVG)
assets/img/             Favicon, Apple touch icon, share image and raster logo
assets/fonts/           Plus Jakarta Sans variable font (self-hosted, SIL Open Font License)
```

## Brand

Follows the Silver Touch brand guidelines (v1.0, November 2026). Silver Touch Green RE is a sub-brand of the Silver Touch group: the group's open hand, holding a recycling loop with an amber bolt.

- **Logo:** the official Green RE kit, copied unchanged into `assets/img/brand/` (symbol, horizontal and stacked; full colour, black and white). The header partial inlines the same paths once as shared SVG: `#logo-mark` (symbol), `#logo-h` (horizontal), `#logo-stack` (stacked), `#logo-hand` (the hand alone, for watermarks) and `#logo-word` (the "Silver Touch" lettering). Recolour with `--lg-mark`, `--lg-bolt` and `--lg-word`; they default to full colour.
- **Which version where:** full colour on white or cream (nav, cards, diagrams); all white on the dark green bands, footer and page transition, as the guidelines direct for dark grounds. The horizontal lockup in the nav is 167px wide (guideline minimum on screen: 120px).
- **Colours:** brand green `#298D22` (marks, illustration fills, large highlighted words) and amber `#FFB100` (the bolt: calls to action, highlighter strokes, highlights on dark), black type on cream `#F5F1E8` and white. Buttons and small green text use `#1C6A17`, the same green deepened to pass WCAG AA. Dark bands use the guidelines' Green RE gradient (`#072410` to `#11501A`). Gold `#FFC400` is the sun. As a sub-brand, Green RE never uses the green-to-orange group gradient.
- **Type:** Plus Jakarta Sans throughout, self-hosted as one variable file (`assets/fonts/`). Headings Bold, body Regular, Medium for emphasis; labels are uppercase with wide tracking, as in the guidelines.
- **Details:** amber highlighter strokes under key words, the open hand as a faint cropped watermark (as on the guidelines' dark slides), a green/amber strip on the enquiry card, and the "Ideas · People · Solutions" tagline in the footer.

## Sections and their motion graphics

| # | Section | Visual |
|---|---------|--------|
| 01 | Hero | Centred headline over an animated sky with drifting clouds. Below it, a landscape rises into place on load: the sun comes up, panels lay down and turbines spin. Every asset is one of the five solutions (factory rooftop solar, battery storage, solar farm with wind turbines, government building, reservoir with floating panels), and its label pin opens that solution further down the page. Layers move at different speeds on scroll. |
| 02 | Core strengths | Factory with a rooftop array and load meter; civic building with a ground-mount array; delivery stages lighting up in sequence; a technology selector cycling through solar, wind and battery. |
| 03 | About | Scroll-revealed statement, plus a site plan where the underutilised rooftop and the available land fill with modules as you scroll. |
| 04 | Solutions | Five-panel accordion that opens on hover (desktop) or tap, and auto-advances until someone interacts: C&I solar (sun arc against a grid/solar supply mix), public sector (compliance stamps), BESS (day charging, night-shift discharging), hybrid (solar, wind and combined curves) and floating solar (bobbing arrays on water). |
| 05 | Focus areas | Two active focus cards and three "in development" capabilities. |
| 06 | Why us | Pinned scroll scene in which a tangle of six contractors resolves into one accountable hub, followed by six animated value cards. |
| 07 | Process | Five stages joined by a progress line that draws as you scroll. |
| 08 | Global vision | Dotted world map (Natural Earth land mask) with routes from India to the UK and Asia-Pacific. |
| 09 | Contact | Enquiry form with name, company, email, phone, location, energy requirement and facility type. |

## Inner pages

| Page | Highlights |
|------|------------|
| About | Orbit of the five in-house stages around the mark; a contractor tangle vs. one accountable pipeline; mission and vision reveals; a five-step expansion roadmap that fills as you scroll. |
| C&I solar EPC | Plant with a sawtooth rooftop array, open-ground array and a live grid/solar supply mix; a chart of a production-shift load against rooftop solar; the five-step pathway from consumption audit to grid connection. Copy is drawn from the homepage and About documents. |
| Public infrastructure | Civic campus with a ticking compliance checklist and rotating clarifiers; a 24-hour chart of a treatment plant's load against solar; a five-step delivery story. |
| Battery storage | Day/night BESS cycle; animated outage, voltage-sag and tariff-peak threat cards; a chart with three tabs (peak shaving, backup during an outage, solar self-consumption); a five-step engineering story. |
| Hybrid solar + wind | Sun arc, gusts and turbines feeding an output meter; a chart that morphs between calm, windy and mixed days; a four-step planning story. |
| Floating solar | Reservoir cross-section with floats, moorings and an underwater cable; heat, cooling and evaporation cards; a five-step process story built on the cross-section. |

## Watt's Up (news & PR)

`watts-up.html` is the news hub: our own announcements as a featured card, then industry stories with filter chips. Each card has an animated SVG (`data-vis`, built by `assets/js/news.js`, styled in `assets/css/news.css`). The three newest stories also appear on the home page (`#watts-up`).

To add a story, add an entry to `src/data/news.json` and run the build. Write the headline and summary in our own words and link the source. `vis` picks the motion graphic: `dholera`, `tender`, `colocated`, `policy`, `bars`, `hybrid`, `openaccess`, `floating` or `record`. The build also writes the RSS feed `watts-up.xml`.

## SEO

The build adds a canonical URL, Open Graph and Twitter tags, and JSON-LD to every page (Organization and WebSite on the home page, BreadcrumbList on inner pages, CollectionPage on Watt's Up). It also writes `sitemap.xml` and `robots.txt`. The canonical host is `https://www.silvertouchgreen.com` (`SITE` in `tools/build_site.py`). The share image `assets/img/og-image.png`, `assets/img/logo-512.png` and `assets/img/apple-touch-icon.png` are rendered by `node tools/render_og.js` (the share card from `tools/og/og.html`). After going live, submit the sitemap in Google Search Console.

## BESS assembly launch (Dholera, Gujarat, 2027)

`assets/js/launch.js` and `assets/css/launch.css` carry the launch announcement:

- **Hero sunset:** about four seconds after the landscape builds (once per browser session), the sun sets behind the hills, night falls, the battery containers light up and power the factory and civic building, and a launch card pops out of the spot where the sun went down. "Back to daylight", the close button or Esc restores the day. The moon pill under the hero buttons replays it at any time and links to the plan without JavaScript. With `prefers-reduced-motion` there is no automatic sunset; the pill switches straight to night.
- **Dholera motion graphic** (`<svg data-dholera>`): Gujarat map with Dholera pinned, a zoom into the site, then an isometric BESS container that opens up (shell, a rack pulled out into modules and cells, then BMS, HVAC, fire suppression and PCS) and closes again with an "Assembled in Dholera" stamp. `data-dholera="loop"` autoplays (home launch band); `data-dholera="scroll"` is scrubbed by a scroll story (battery storage page, `#dholera`).
- **Other BESS mentions** link to it: the battery panel in Solutions, the focus-area card, the battery page hero pill and the About roadmap.

The Gujarat outline comes from [@svg-maps/india](https://github.com/VictorCazanave/svg-maps) (CC BY 4.0), simplified. Only Gujarat and neighbouring Indian states are drawn, so no international boundary appears.

**Scroll stories:** the illustration stays pinned while the steps scroll past, and each step adds its layer to the drawing.

**Charts:** these are illustrative profiles, labelled as such. They are rendered at real pixel size with a legend, direct labels, a hover/tap crosshair tooltip and a screen-reader table. The series colours were validated for colour-vision deficiency.

**Page transitions:** clicking an internal link drops a forest-green curtain carrying the mark and the destination page's name. The next page opens behind the curtain, which then lifts once fonts are ready. Pages are prefetched on hover (Speculation Rules). The transition is skipped under `prefers-reduced-motion` and is cleared on back/forward cache restores.

Animations pause while off-screen and respect `prefers-reduced-motion`.

## Before launch

- **Form endpoint:** enquiries go to a Google Sheet, and each one emails shubham.thakkar@silvertouchgreen.com, through a small Google Apps Script. Follow [integrations/google-sheets/README.md](integrations/google-sheets/README.md) (about 5 minutes), then paste the web app URL into `data-endpoint` on `<form id="enquiry-form">`. Until then the form validates and shows its thank-you message but sends nothing. Any endpoint that accepts a URL-encoded POST (Formspree, for example) also works.
- **Contact details:** add verified email, phone and address details to the contact section and footer.
- **Copy review:** the inner-page copy comes straight from the copywriter's documents and still needs sign-off. See the content flags in the review notes (claims such as "10 to 15%" and "guaranteed / risk-free" wording).
