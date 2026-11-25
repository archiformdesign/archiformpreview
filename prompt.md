# Final Optimization & QA Before Client Handover: archiformdesign.me

## Role
You are a senior front-end performance engineer and QA lead working inside this repository.
Your goal: make https://archiformdesign.me (an architecture/design studio portfolio) **very fast,
visually stable, glitch-free on every device, and fully polished for client handover**.

## Hard rules
1. **Do not change the visual design.** Layout, copy, branding, colors, and the look of animations stay
   exactly as they are. You optimize how things load and run, not how they look. If a fix would change
   anything visible, stop and ask me first.
2. **No regressions.** After each group of changes, rebuild and re-test the affected pages on desktop and mobile.
3. **Small, reversible steps.** Work on a new branch `perf/final-handover`. Make one commit per logical
   change with a clear message. Never force-push and never commit secrets or `.env` files.
4. **Measure before and after.** Every claimed improvement needs a number.
5. **Never remove** a page, feature, form, or tracking/analytics script without asking.
6. **Plan first.** Use a todo list to track every step below, and keep it updated as you work.
7. If something is ambiguous or needs a decision from me, ask. Don't guess on anything that's hard to undo.

---

## Step 0: Discovery (report back before changing anything)
- Find out the stack from the repo: framework (Next.js / React / Vite / Astro / plain HTML / WordPress theme),
  package manager, build command, and the hosting/deploy config (Vercel, Netlify, Cloudflare, cPanel…).
- **If this site is built in Framer or Webflow and has no editable code here:** audit the live URL only,
  then give me exact click-by-click instructions for each fix in the platform editor instead of editing files.
- Inventory: every route/page, CMS collection, form, embed, video, font, and third-party script
  (analytics, pixels, chat, maps, Instagram feeds, etc.).
- Install the tools as dev dependencies or run them with `npx`:
  ```bash
  npx lighthouse https://archiformdesign.me --preset=perf --form-factor=mobile --output=json --output=html --output-path=./audit/before-home
  npx unlighthouse --site https://archiformdesign.me          # whole-site Lighthouse scan
  npx linkinator https://archiformdesign.me --recurse          # broken links / 404 assets
  npx @axe-core/cli https://archiformdesign.me                 # accessibility
  ```
- Run the build locally and record the bundle sizes (JS/CSS per route) and the largest assets in the repo:
  ```bash
  find . -path ./node_modules -prune -o -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.mp4" -o -name "*.gif" \) -size +300k -print
  ```
- Save every baseline result in `./audit/before/`.
- **Deliver:** a short discovery report plus a prioritized issue list (Critical / High / Medium / Low).
  Wait for my "go" before starting Step 1.

## Targets (mobile, 4G, 75th percentile)
| Metric | Target |
|---|---|
| LCP | ≤ 2.0 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0.05 |
| TBT | ≤ 150 ms |
| TTFB | ≤ 600 ms |
| Lighthouse Performance | ≥ 90 mobile / ≥ 98 desktop |
| Accessibility, Best Practices, SEO | ≥ 95 |
| Home page first-load transfer | ≤ 1.5 MB (excluding background video) |
| Console errors / broken links / 404 assets | **0** |

---

## Step 1: Images (usually the biggest win on portfolio sites)
- Convert to AVIF/WebP (use `sharp` in a script; keep originals in git history, not in the build output).
  Quality around 70–80, with no visible loss. Check this by comparing before/after screenshots.
- Serve responsive sizes (`srcset`/`sizes`, or `next/image` / `astro:assets` / the framework's equivalent).
  Never send a 4000px image to a 400px slot.
- Set explicit `width`/`height` or `aspect-ratio` on every image and media container.
- LCP/hero image: no lazy-loading, `fetchpriority="high"`, preload if needed.
- Everything below the fold: `loading="lazy"` and `decoding="async"`.
- Add a blurred or dominant-color placeholder for large project photos so nothing pops in.
- Delete unused images (grep the codebase for references before deleting anything).

## Step 2: Video & heavy embeds
- Hero/background video: re-encode with ffmpeg (H.264 + WebM, preset `veryfast`) to ≤ 3–5 MB, `muted`,
  `playsinline`, `autoplay`, `loop`, a `poster` image, and `preload="metadata"`. Serve the poster or a lighter file on small screens.
- YouTube/Vimeo/Google Maps: replace with a click-to-load facade.

## Step 3: Fonts
- Self-host as WOFF2 only, subset to the characters/languages used, and keep only the weights actually used.
- Preload only the 1–2 critical font files.
- Use `font-display: swap` with a size-adjusted fallback (`size-adjust`, `ascent-override`) so swapping causes no layout shift.

## Step 4: JS, CSS & third-party scripts
- Remove unused dependencies (`npx depcheck`), dead code, and duplicate libraries (two slider libs, two GSAP versions, etc.).
- Code-split by route; dynamically import heavy components (galleries, lightboxes, 3D, maps).
- Defer/async non-critical scripts; inline only the critical CSS for the first screen.
- Load analytics, pixels, and chat after the page is interactive or on first user interaction.
- Find and break up main-thread tasks over 50 ms that hurt INP (menu, filters, sliders, lightbox open).
- Minify, tree-shake, and confirm the production build has no source maps exposed (unless intended).

## Step 5: Server, caching & delivery
- HTTPS everywhere, HTTP/2 or HTTP/3, Brotli compression.
- Hashed static assets: `Cache-Control: public, max-age=31536000, immutable`. HTML: short cache or revalidate.
- One canonical domain (www vs non-www) with a single 301, so there are no redirect chains.
- `preconnect` only to third-party origins that are actually required.
- Add the security headers in the host config: HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, and a CSP that doesn't break anything (test it in report-only mode first).

---

## Step 6: "Strictly no glitches" QA pass
Write a **Playwright** test suite (`npx playwright install`) that loads every page in Chromium, WebKit,
and Firefox at the viewports below, takes full-page screenshots, and fails the run if it finds:
- any console error, failed request, or 404,
- horizontal overflow (`document.documentElement.scrollWidth > window.innerWidth`),
- a CLS above 0.05 (measure with a `PerformanceObserver` for `layout-shift`).

**Viewports:** 360×800, 390×844, 430×932 (mobile) · 768×1024, 1024×768 (tablet) · 1280×800, 1440×900, 1920×1080, 2560×1440.

Then check and fix every instance of:
- **Layout shift:** images, fonts, cookie bars, banners, or embeds pushing content around while loading.
- **Flashes:** unstyled content (FOUC), white flashes between pages, animations flickering on load.
- **Animation jank:** animate only `transform` and `opacity`, never top/left/width/height. Keep a steady 60 fps
  on scroll. Respect `prefers-reduced-motion`. Elements must never stay invisible if JS loads late or fails.
- **iOS Safari:** `100vh` jumps (use `dvh`/`svh`), sticky/fixed header bugs, video autoplay, input zoom
  (inputs ≥ 16px), and rubber-band scroll under fixed elements.
- **Touch:** no hover-only interactions; tap targets ≥ 44×44 px.
- **Navigation:** menu open/close, scroll lock, anchor links, back/forward, active states, page transitions.
- **Sliders, galleries, lightboxes, filters:** swipe, keyboard, rapid clicks, and resizing mid-interaction.
- **Stacking:** z-index conflicts, overlapping elements, and custom-cursor bugs.
- **Forms:** validation, success and error states, spam protection. Confirm the submission actually arrives
  (ask me to check the inbox).
- **Edge cases:** orientation change, browser zoom to 200%, slow-3G throttling, and JS disabled (content still visible).
- **Leftovers:** placeholder/template text, lorem ipsum, demo images, TODOs, `console.log`s, test routes.

Compare before/after screenshots side by side and confirm that **nothing changed visually** except bug fixes.

## Step 7: Accessibility (WCAG 2.1 AA)
- Meaningful `alt` text on every project image; `alt=""` on decorative images.
- Contrast ≥ 4.5:1 for body text, visible focus states, full keyboard navigation, a skip link.
- One `<h1>` per page, logical heading order, labeled form fields, `lang` attribute set.
- The axe scan must show 0 serious or critical issues.

## Step 8: SEO & handover essentials
- A unique `<title>` (≤ 60 chars) and meta description (≤ 155 chars) on every page.
- Open Graph and Twitter card tags with a 1200×630 share image on every page.
- Full favicon set (ICO, SVG, apple-touch-icon, web manifest).
- `sitemap.xml`, `robots.txt` (**make sure any staging `noindex` / `Disallow: /` is removed**), canonical tags.
- JSON-LD structured data: Organization / LocalBusiness (ArchitecturalService if appropriate) + BreadcrumbList.
- A branded 404 page; clean URLs; correct copyright year; Privacy Policy and Terms linked in the footer.
- Analytics working; Google Search Console ready for verification; cookie consent if required for the client's region.

---

## Step 9: Final verification & deliverables
1. Re-run every Step 0 audit and save the results to `./audit/after/`. Run the full Playwright suite; it must pass with 0 failures.
2. Create **`HANDOVER_REPORT.md`** in the repo root containing:
   - a **before/after table** per tested page: Lighthouse scores, LCP, INP, CLS, TBT, page weight, and request count,
   - every change made, grouped by category, with any trade-offs,
   - anything you could **not** fix and why (platform limits, third-party scripts), with recommendations,
   - the Step 6 QA checklist and test matrix, each item marked ✅ pass / ❌ fail,
   - a **client maintenance guide**: recommended image sizes and formats for new projects, how to add a project
     without hurting speed, what not to embed, and how to run the audit and test scripts again.
3. Add npm scripts so the checks can be re-run: `audit`, `test:e2e`, `check:links`, `check:a11y`.
4. Give me a short final summary: the headline numbers, the branch name, and anything I need to do manually
   (DNS, host settings, Search Console verification, form inbox check).

**Start with Step 0. Send me the discovery report and the prioritized issue list, then wait for my go-ahead.**
