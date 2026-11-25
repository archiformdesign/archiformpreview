# ARCHIFORM website — performance & QA handover report

**Site:** https://archiformdesign.me · **Branch:** `perf/final-handover` (from `main` @ 9779663) · **Date:** 25 November 2026
**Stack:** Next.js 16.4 (App Router), React 19, GSAP + Lenis, Sanity CMS, Resend · **Host:** Hostinger (Node.js app + Hostinger CDN)

The brief was to make the site faster and glitch-free **without changing anything visible**: no colour, layout, copy or
animation was changed. Everything below is about how the site loads and behaves, plus the checks that keep it that way.

---

## 1. Headline results

| | Before | After |
|---|---|---|
| JavaScript downloaded per page (gzip, Lighthouse) | 463–473 KB | **219–230 KB (−52%)** |
| Mobile Performance score, About / Portfolio / Journal | 80 / 82 / 80 | **88 / 89 / 88** |
| Mobile LCP, About / Portfolio / Journal | 5.35 / 5.04 / 5.42 s | **3.92 / 3.77 / 4.00 s** |
| Home page LCP, mobile / desktop | 8.12 / 1.53 s | **6.84 / 1.29 s** |
| Home first-load weight excluding films, mobile | 1.42 MB | **1.16 MB** (target ≤ 1.5 MB ✅) |
| Home page with JavaScript off or failing | **blank (stuck on the logo)** | **readable** |
| Layout shift (CLS), worst of 72 Chrome page loads in the QA run | 0.025 (0.069 seen on Journal at 390 px in an earlier run) | **0.015** |
| QA suite: 216 page tests (8 pages × 9 sizes × 3 browsers) + 15 interaction tests | not available before | **231 / 231 pass** |
| Screenshots identical before vs after (243 compared) | — | **241 identical; 2 differ by 13 px and 1 px of photo-decoding noise** |
| Broken links / missing files (live crawl) | 0 of 138 | 0 |

### How these were measured
- **Lighthouse 13.6** on the production build run locally (`next start`), with Lighthouse's standard simulated mobile (slow 4G,
  4× slower CPU) and desktop profiles. The live URL could not be used: **Hostinger's bot protection answers headless Chrome
  with HTTP 403**, so Lighthouse, Unlighthouse and the PageSpeed Insights API cannot load it (see §4). The same code is
  measured both times, so the before/after difference is reliable; absolute numbers on the live site also depend on the CDN.
- Live delivery (TTFB, compression, caching, redirects) was checked directly with `curl`: HTML TTFB is 0.10–0.20 s.
- INP cannot be measured in a lab; Total Blocking Time (its lab stand-in) is ≤ 90 ms on every page, ≤ 6 ms off the home page.
- No real-user (CrUX) data exists yet for the domain; Google Search Console will show it about 28 days after enough visits.

---

## 2. Before / after per page (Lighthouse)

Weight excludes video (the films stream as the visitor scrolls). Accessibility / Best Practices / SEO were 96 / 100 / 100
before and after on every page (the 96 is the footer label contrast, §4).

| Page | Device | Performance | LCP (s) | TBT (ms) | CLS | JS (KB) | Weight excl. video (KB) | Requests | A11y / BP / SEO |
|---|---|---|---|---|---|---|---|---|---|
| Home | mobile | 73 → **74** | 8.12 → **6.84** | 85 → **87** | 0.001 → **0.000** | 463 → **219** | 1420 → **1164** | 50 → **42** | 96 / 100 / 100 |
| Home | desktop | 95 → **97** | 1.53 → **1.29** | 0 → **1** | 0.002 → **0.001** | 473 → **230** | 1330 → **1074** | 65 → **57** | 96 / 100 / 100 |
| About Us | mobile | 80 → **88** | 5.35 → **3.92** | 1 → **6** | 0.000 | 464 → **221** | 806 → **550** | 40 → **32** | 96 / 100 / 100 |
| About Us | desktop | 98 → **99** | 1.13 → **0.94** | 0 | 0.000 | 473 → **230** | 835 → **579** | 54 → **46** | 96 / 100 / 100 |
| Portfolio | mobile | 82 → **89** | 5.04 → **3.77** | 0 → **6** | 0.000 | 466 → **223** | 949 → **715** | 44 → **37** | 96 / 100 / 100 |
| Portfolio | desktop | 100 | 0.24 → **0.20** | 0 | 0.000 | 473 → **230** | 942 → **708** | 62 → **55** | 96 / 100 / 100 |
| Project page | mobile | 100 | 0.90 → **0.75** | 0 → **3** | 0.000 | 464 → **221** | 683 → **428** | 39 → **31** | 96 / 100 / 100 |
| Project page | desktop | 98 → **99** | 1.06 → **0.86** | 0 | 0.000 | 473 → **230** | 808 → **552** | 53 → **45** | 96 / 100 / 100 |
| Services | mobile | 100 | 0.91 → **0.75** | 3 | 0.000 | 465 → **221** | 858 → **602** | 42 → **34** | 96 / 100 / 100 |
| Services | desktop | 100 | 0.24 → **0.20** | 0 | 0.000 | 473 → **230** | 847 → **591** | 56 → **48** | 96 / 100 / 100 |
| Journal | mobile | 80 → **88** | 5.42 → **4.00** | 0 → **3** | 0.000 | 464 → **221** | 760 → **515** | 41 → **34** | 96 / 100 / 100 |
| Journal | desktop | 95 → **99** | 1.54 → **0.96** | 0 | 0.000 | 473 → **230** | 861 → **598** | 54 → **47** | 96 / 100 / 100 |
| Contact | mobile | 100 | 0.91 → **0.75** | 1 → **2** | 0.000 | 466 → **223** | 599 → **366** | 34 → **27** | 96 / 100 / 100 |
| Contact | desktop | 100 | 0.24 → **0.20** | 0 | 0.000 | 473 → **230** | 633 → **399** | 48 → **41** | 96 / 100 / 100 |

Notes:
- **Journal mobile** downloads up to 2.3 MB in total in the "after" run: the press clip (a looping, autoplaying film, unchanged)
  now starts streaming inside Lighthouse's measuring window because the page is ready sooner. It is excluded above like all video.
- Small TBT increases (0 → 3–6 ms) are run-to-run noise; Lighthouse varies ±0.2 s in LCP between identical runs.

---

## 3. Changes made, by category (one commit each)

### JavaScript
- **Sanity editing code is no longer sent to visitors** (`components/DraftModeToolsLazy.jsx`, `app/layout.js`). The click-to-edit
  overlay for editors (Sanity UI, styled-components, an animation library: ~620 KB uncompressed) was imported straight into the
  root layout, and Next.js does not code-split a Server Component's import, so every visitor downloaded it on every page.
  It now loads only when an editor turns on Draft Mode. **This halved the JavaScript on every page.**
  *Trade-off:* none for visitors; an editor's preview overlay appears a moment after the page.

### Images & loading order
- **Home: the walk-in film's poster is attached while the HTML is read** (`app/page.js`), instead of after all scripts had run.
  It is the same poster the scroll story picks (portrait cut on phones). *Trade-off:* none visible: it sits under the logo loader.
- **Preconnect to Sanity's image CDN** (`app/layout.js`), which serves the large photos on About, Portfolio, Journal and project pages.
- Already in place and kept: AVIF/WebP at the right size for every screen (`next/image` and Sanity's CDN), `fetchpriority="high"`
  on each page's main photo, lazy loading below the fold, width/height on every image (CLS 0 on all inner pages).

### Fonts
- **The three Cormorant faces used on first screens (300, 400, 500) are preloaded** (served from `public/fonts`, same files as
  before), so text is usually set in the real font from the first paint instead of re-wrapping when it arrives.
- **Fallback font metrics retuned** (`size-adjust` 96.6% → 95%) after comparing line breaks with the font blocked vs loaded on every
  page at 19 widths: fewer headings re-wrap if the font is slow (it fixed the 33 px Journal jump on iPhones).
- Already in place: self-hosted WOFF2, Latin subset only, `font-display: swap`. *Trade-off:* 3 preloads (67 KB) start with the
  HTML; no measurable LCP cost.

### Glitches & resilience
- **The home page can no longer stay stuck on the logo loader** (`app/globals.css`, `lib/home-story.js`). With scripts off the
  loader is never shown; if scripts haven't started after 12 s it fades and the static layout shows; if they arrive later still,
  the intro is skipped so the loader never comes back. Verified with scripts disabled, blocked, and delayed 14 s.
  *Trade-off:* on connections so slow that scripts take over 12 s, the visitor gets the static layout first, then the story.

### SEO & handover essentials
- Meta descriptions capped at 155 characters (`lib/seo.js`); Services (171) and project pages (~164, from CMS text) were over.
- Full icon set: `/favicon.ico` (was a 404), 180 px Apple touch icon, web app manifest (`app/manifest.js`), built from the existing
  icon by `npm run icons`. No SVG icon: there is no vector original of the mark.
- Already correct and verified: unique titles ≤ 60 characters, canonical URLs, Open Graph + Twitter cards with a 1200×630 image,
  `sitemap.xml`, `robots.txt` (no staging blocks; Studio and 404 are `noindex`), JSON-LD (InteriorDesigner, a LocalBusiness type;
  BreadcrumbList on project pages), branded 404, clean URLs, automatic copyright year, one `<h1>` per page, `lang="en"`.

### Housekeeping & docs
- Removed two unused images (420 KB) and a stale "TODO before launch" note.
- README: hosting is Hostinger (it described Vercel); the "replace a file under the same name" advice was wrong on Hostinger.
- New checks: Playwright suite, axe scan, Lighthouse and link-check scripts (§7).

---

## 4. Not fixed, and why (with recommendations)

### Needs your decision (would change something visible)
1. **Footer labels "Instagram" / "Email" fail contrast** (3.8:1; AA needs 4.5:1). Colour changes were ruled out.
   Recommendation: `#cbc2b8` instead of `#b7aca0` (4.8:1), a barely visible change. Until then Accessibility scores 96, not 100.
   The small "01 / 02 / 03" numbers in the home journey captions (`#968778` on linen) are 2.75:1; walnut would pass.
2. **Reduced-motion layout: the four room panels are hard to read.** Visitors who turn off animations (and, since this round,
   anyone whose scripts fail) see the static layout, where the panels' cream text sits on the pale linen band (~1.6:1).
   In the scroll story they sit over the dark room films and read well. Recommendation: walnut text for `.pane` in the static
   layout only (`html:not(.story) .pane{color:var(--walnut)}`).
3. **Home page mobile score (74) is below the 90 target.** The first screen intentionally loads a 4000 px gate photo (259 KB),
   the walk-in poster (116 KB) and the logo intro; on Lighthouse's slow-4G phone these share ~1.6 Mbit/s, so LCP is ~6.8 s
   simulated (0.3 s on a fast connection). Reaching 90 needs a lighter first screen on phones, e.g. a 2400 px AVIF gate photo
   and a lighter poster. That changes image sharpness, so it needs visual sign-off.
4. **Inner pages on mobile are 88–89, just under 90.** What is left is Next.js/React itself (~220 KB, the floor for this stack)
   and each page's main photo from Sanity at quality 75. Quality 65 would likely pass 90 but softens the photos.
5. **Films:** the brief's "re-encode to 3–5 MB with `veryfast`" was deliberately not applied. These films are scrubbed frame by
   frame with the scroll and are already encoded for it (dense keyframes, VMAF-matched quality, phone cuts). Recompressing them
   would visibly soften the picture and make scrubbing choppier.

### Host settings (Hostinger; can't be done from the code)
6. **Caching of `public/` files.** Hostinger serves `/m/*.webp`, `/fonts/*` and every film in `/v/` with **no Cache-Control
   header** (and they miss the CDN cache), while `.jpg` files get a 1-year cache. Returning visitors re-check or re-download
   films (each 1–9 MB). → *Ask Hostinger to cache* `/m/*`, `/v/*`, `/fonts/*` *at the CDN and send* `Cache-Control: public,
   max-age=2592000` (30 days). Always rename a replaced file (README).
7. **www and non-www both answer 200.** → In hPanel add a **301 redirect from `www.archiformdesign.me` to `https://archiformdesign.me`**
   (Websites → Manage → Domains/Redirects), so search engines see one site. Canonical tags already point to the bare domain.
8. **Brotli:** Hostinger serves gzip when a browser accepts both (Brotli is ~15–20% smaller). → Ask support to prefer Brotli.
9. **Bot protection blocks Lighthouse/PageSpeed** (HTTP 403 for headless Chrome). Real Googlebot is not affected (it is verified by
   IP), but you can't run speed tests on the live site. → Ask support to allow PageSpeed Insights / Lighthouse, or check
   https://pagespeed.web.dev from a browser after each deploy; if it shows 403, raise it with Hostinger.

Suggested message to Hostinger support:
> Please (1) cache /m/\*, /v/\* and /fonts/\* on the CDN with Cache-Control "public, max-age=2592000"; (2) 301-redirect
> www.archiformdesign.me to https://archiformdesign.me; (3) prefer Brotli over gzip; (4) let Google PageSpeed Insights and
> Lighthouse load the site (they currently receive 403 from the bot protection).

### Other open items
10. **No analytics** is installed (none was there before; the brief says not to add tracking without asking). If wanted,
    Plausible or Vercel-style cookieless analytics avoid a cookie banner; Google Analytics 4 needs consent handling.
11. **No Privacy Policy / Terms pages.** The contact form collects name, email and phone, so a privacy notice is advisable
    (UAE PDPL). Needs text from the studio; the footer can then link to it.
12. **Public GitHub repository.** `archiformdesign/archiformpreview` is public and contains `Dubai ROULA.docx` and ~210 MB of raw
    source films (repo 816 MB, which also slows deploys). Recommendation: make the repository private. Removing the files from
    history needs a force-push, which this round was not allowed to do.
13. **One remaining font re-wrap:** if Cormorant arrives after the first paint, one Contact paragraph at 360 px and a few headings at
    375–384 px still re-wrap (no single fallback size matches every width). The preload makes this rare.
14. **Process → founder hand-off** animates the picture's width/height while scrolling (a layout per frame). It runs smoothly in
    testing; it is the one animation not limited to transform/opacity, so watch it on older phones.

---

## 5. QA checklist (Step 6) and test matrix

### Test matrix: `npm run test:e2e` (216 tests, all ✅)
Every page loaded in **Chrome, Firefox and WebKit (Safari's engine)** at **360×800, 390×844, 430×932, 768×1024, 1024×768,
1280×800, 1440×900, 1920×1080 and 2560×1440**, scrolled to the bottom (in Chrome with real touch/wheel gestures), with a
screenshot. Each test fails on a console error, an uncaught exception, a failed request or 4xx/5xx, sideways overflow, or
(Chrome) CLS above 0.05.

| Page | Chrome (9 sizes) | Firefox (9 sizes) | WebKit (9 sizes) | Worst CLS (Chrome) |
|---|---|---|---|---|
| Home | ✅ 9/9 | ✅ 9/9 | ✅ 9/9 | 0.0023 |
| About Us | ✅ 9/9 | ✅ 9/9 | ✅ 9/9 | 0.0005 |
| Portfolio | ✅ 9/9 | ✅ 9/9 | ✅ 9/9 | 0.0004 |
| Project page | ✅ 9/9 | ✅ 9/9 | ✅ 9/9 | 0.0001 |
| Services | ✅ 9/9 | ✅ 9/9 | ✅ 9/9 | 0.0001 |
| Journal | ✅ 9/9 | ✅ 9/9 | ✅ 9/9 | 0.0003 |
| Contact | ✅ 9/9 | ✅ 9/9 | ✅ 9/9 | 0.0151 |
| 404 | ✅ 9/9 | ✅ 9/9 | ✅ 9/9 | 0.0002 |

Interactions (`tests/e2e/interactions.spec.mjs`, all three browsers, 15/15 ✅): phone menu (opens, locks scrolling, focus moves
in and returns, Escape and rapid open/close, menu links navigate and close it); portfolio filters (every tab, result count
announced, 12 rapid clicks settle correctly); contact form (empty submit shows errors and focuses the first field; success
and server-error states with the server stubbed, so no real email was sent).

### Step 6 checklist
| Item | Result |
|---|---|
| Console errors / failed requests / 404 assets | ✅ none on any page, browser or size; live crawl 0 broken links |
| Horizontal overflow | ✅ none at any of the 9 sizes |
| Layout shift: images, fonts, banners, embeds | ✅ CLS ≤ 0.015 everywhere (target 0.05); fonts preloaded and fallback retuned; all images sized |
| Flashes / FOUC / white flash between pages | ✅ CSS in the head, page transitions cross-fade (View Transitions); loader logo animates from the first paint |
| Elements never stay invisible if JS is late or fails | ✅ fixed this round (loader failsafe); verified with JS off, blocked and delayed 14 s |
| Animation: transform/opacity only, 60 fps, reduced motion | ✅ reduced motion respected; ⚠️ one hand-off animates width/height (§4 item 14) |
| iOS Safari: 100vh, sticky header, video autoplay, input zoom | ✅ `svh` with `vh` fallback; header fixed; films muted + `playsinline`; inputs 18 px. WebKit engine tested, **not a real iPhone**: check on a device |
| Touch: no hover-only interactions | ✅ hover only adds underlines; every action is a link or button |
| Tap targets ≥ 44×44 px | ⚠️ not measured on every element; nav links have 10 px vertical padding on 11 px text, so check the phone menu on a device |
| Navigation: menu, scroll lock, back/forward, active states, page transitions | ✅ menu tested; `aria-current` on the active link; back/forward return to the same scroll position (existing scroll memory) |
| Sliders, galleries, filters: rapid clicks, resizing | ✅ portfolio filters; the home story rebuilds on resize (not orientation-tested on a device) |
| Stacking / z-index / overlaps | ✅ no overlap seen in the 243 screenshots |
| Forms: validation, success, error, spam protection | ✅ validation and states tested; honeypot, per-IP rate limit and duplicate-submit guard (unit tests pass, 15/15). **Real delivery not tested: send one enquiry from the live site** |
| Edge cases: orientation, 200% zoom, slow 3G, JS off | ✅ JS off; ✅ slow scripts; 200% zoom ≈ the 640–768 px layouts (768 tested); orientation: not device-tested |
| Leftovers: placeholder text, lorem, TODOs, `console.log`, test routes | ✅ none (one TODO removed); `/studio` is the CMS editor, `noindex` |
| Before/after screenshots show no visual change | ✅ 241/243 identical; 2 differ by 13 px and 1 px of photo-decoding noise |


---

## 6. Accessibility (WCAG 2.1 AA)

| Check | Result |
|---|---|
| axe scan, every page, phone + desktop (`npm run check:a11y`) | ✅ 16/16 pass with the listed exceptions: decorative lettering (exempt); **open:** footer labels, reduced-motion room panels, journey caption numbers (§4 items 1–2) |
| Meaningful `alt` on project images, `alt=""` on decorative ones | ✅ every image has alt (checked on every page) |
| Contrast ≥ 4.5:1 | ❌ footer labels (3.8:1), home journey caption numbers (2.75:1) and reduced-motion room panels (~1.6:1): §4 items 1–2. Decorative lettering is exempt |
| Visible focus, keyboard navigation, skip link | ✅ `:focus-visible` outlines, skip link, menu traps focus and returns it |
| One `<h1>` per page, heading order, `lang` | ✅ |
| Labelled form fields, errors announced | ✅ labels, `aria-invalid` + `aria-describedby`, status messages |
| Reduced motion respected | ✅ static layout, no scroll story, no autoplay of the press clip |

---

## 7. Client maintenance guide

### Adding a project (in the Studio at /studio)
- **Photos:** upload the original JPG (or PNG) at **2000–2500 px on the long side, under ~1.5 MB**. Sanity and the site make the
  smaller AVIF/WebP versions automatically: never upload pre-shrunk thumbnails, and never upload 6000 px camera originals.
- Set the **hotspot** (the circle in the image editor) on the important part of each photo; the site crops around it.
- Fill in the **alt text** for every photo: a short description of what it shows ("Kitchen with cream cabinets and oak table").
- **Cover image** first: it is the largest picture on the Portfolio page and loads first.
- Up to ~12 gallery photos per project keeps project pages light; more is fine (they load as the visitor scrolls).
- Published changes appear on the live site within about a minute (the pages refresh every 60 s).

### Replacing a photo or film that lives in the code (`public/m`, `public/v`)
- Give the new file a **new name** (e.g. `kitchen-2.jpg`) and update the reference. Hostinger lets browsers keep old files.
- Films: H.264 MP4, no audio, "fast start". Scroll-scrubbed films need a keyframe every 4–8 frames (see `content/media.js` notes).
  Keep each under ~5 MB, and provide a portrait cut for phones.

### What not to embed
- No YouTube/Vimeo/Instagram/Google Maps embeds or chat widgets pasted into pages: each adds 0.5–1.5 MB of scripts and cookies.
  Link out instead, or ask a developer for a click-to-load version. The security policy (CSP) blocks unknown scripts anyway.
- Don't upload GIFs; use a short MP4.

### Running the checks again
```bash
npm install && npx playwright install firefox webkit     # once per computer
npm run build                                             # every check runs against the production build
npm run test:e2e        # all pages × Chrome/Firefox/WebKit × 9 screen sizes (about 45 min)
npx playwright test tests/e2e/interactions.spec.mjs       # menu, filters, contact form (form server stubbed)
npm run check:a11y      # axe accessibility scan
npm run audit           # Lighthouse table for every page (audit/latest/)
npm run check:links     # broken links on the live site
SHOTS=after npm run test:e2e && npm run test:compare      # pixel comparison with audit/screens/before/
npm test                # contact form unit tests
```
Results from this handover are in `audit/before/` and `audit/after/` (Lighthouse JSON, Playwright results).

---

## 8. Things to do manually
- [ ] Review and merge `perf/final-handover` (not pushed; pushing to `main` deploys the live site).
- [ ] After deploying, open https://pagespeed.web.dev for the home and portfolio pages (or note the 403, §4 item 9).
- [ ] Send one real enquiry from the live contact form and confirm it arrives in the studio inbox.
- [ ] Send the Hostinger support message in §4.
- [ ] Google Search Console: verify the domain (DNS TXT record) and submit `https://archiformdesign.me/sitemap.xml`.
- [ ] Decide on §4 items 1–4 (contrast, reduced-motion panels, home/inner image weight) and 10–12 (analytics, privacy page, repository).
