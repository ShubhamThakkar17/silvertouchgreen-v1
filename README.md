# Silver Touch Green RE: landing page

Single-page marketing site for Silver Touch Green RE Pvt Ltd. It is static HTML, CSS and JS with no build step.

## Run locally

```bash
npx http-server -p 8080 .
# or: python3 -m http.server 8080
```

Open http://localhost:8080.

## Structure

```
index.html              Page markup, including the hand-drawn inline SVG illustrations
assets/css/styles.css   Design tokens, layout, illustration system and keyframes
assets/js/main.js       Diagram builders, scroll scenes, accordion, counters and form
assets/js/vendor/       GSAP 3.12.5 + ScrollTrigger (vendored, no CDN dependency)
assets/img/             SilverTouch Green logo (mark, stacked lockup, horizontal lockup) and favicon
```

## Brand

Aligned to the SilverTouch Green identity (logo kit and stationery):

- **Logo:** the leaf-S mark and "SilverTouch / GREEN" wordmark, vectorised from the supplied artwork. They are inline SVG symbols in `index.html` (`#logo-shape`, `#logo-h`, `#logo-stack`, `#logo-word`), and standalone files are in `assets/img/`.
- **Colours:** forest green `#0B4026`, deep green `#07361D` (dark bands, footer), lime `#C4DC66` (calls to action and highlights).
- **Type:** Plus Jakarta Sans ExtraBold for headings (closest Google Font to the wordmark), Geist for body, Geist Mono for labels.
- **Details from the stationery:** lime highlighter strokes under key words, a faded mark watermark and a lime/forest strip on the enquiry card, and the "Ideas · People · Solutions" tagline in the footer.

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

Animations pause while off-screen and respect `prefers-reduced-motion`.

## Before launch

- **Form endpoint:** the form currently shows a success state without sending anything. Add `data-endpoint="https://…"` to `<form id="enquiry-form">` (for example a Formspree or Getform URL, or your own API). The form then POSTs `FormData` to it.
- **Contact details:** add verified email, phone and address details to the contact section and footer.
- **"Learn more" links:** these point to `#contact` until the individual solution pages exist.
