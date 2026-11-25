# ARCHIFORM Design Studio – website

Production website for ARCHIFORM, a Dubai interior design studio focused on healthy living.
Built with **Next.js 16 (App Router)**, **GSAP ScrollTrigger** and **Lenis** smooth scrolling.
Contact-form enquiries are emailed with **Resend**.

## Requirements
- Node.js **20.9 or newer** (`node -v`)
- A free [Resend](https://resend.com) account for the contact form

## Run locally
```bash
npm install
cp .env.example .env.local     # then fill in your Resend key and emails
npm run dev                    # http://localhost:3000
```

Production build, run locally:
```bash
npm run build
npm start                      # http://localhost:3000
```

## Hosting (Hostinger)
The live site (https://archiformdesign.me) runs on **Hostinger** as a Node.js app (`npm run build`, then `npm start`),
behind Hostinger's CDN. `vercel.json` is only used if the project is ever deployed to Vercel instead.
- Environment variables (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL`,
  `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, optional `SANITY_API_READ_TOKEN`) are set in hPanel for the app.
- Hostinger serves `public/` itself, so the `/m` and `/v` cache headers in `next.config.mjs` do not reach visitors there;
  caching, the www redirect and compression are set in hPanel (see `HANDOVER_REPORT.md`, "Host settings").
- Hostinger converts `.jpg` files in `public/` to WebP on the fly and lets browsers cache them for a year. **To replace a
  photo or film, give the new file a new name** (e.g. `kitchen-2.jpg`) and update the reference, or returning visitors keep the old one.

## Contact form (Resend)
1. Create an API key at resend.com → API Keys.
2. Verify your domain at resend.com → Domains (adds a few DNS records).
3. Set `CONTACT_FROM_EMAIL` to an address on that domain, e.g. `ARCHIFORM Website <website@archiform.com>`.
   Before verifying, `ARCHIFORM <onboarding@resend.dev>` works but only delivers to your Resend sign-up email.
Replies to an enquiry email go straight to the visitor (reply-to is set to their address).

## Where to edit things
| What | File |
|---|---|
| Email, phone, WhatsApp, Instagram, address, domain | `content/site.js` |
| Portfolio projects (text + photos) | `content/projects.js` |
| Photo sizes (needed for responsive images) | `content/images.js` |
| Home page films: sources, descriptions, origin and rights | `content/media.js` |
| Services | `content/services.js` |
| Founder page | `app/founder/FounderContent.jsx` |
| FAQ | `app/services/Faq.jsx` |
| Home page text | `components/HomeMarkup.jsx` |
| Home scroll animation | `lib/home-story.js` |
| Colours, type, layout | `app/globals.css` (tokens at the top of `:root`) |
| Images / videos | `public/m/` and `public/v/` – replace a file with one of the same name |

To add a project: copy one entry in `content/projects.js`, give it a new `slug`, put its photos in `public/m/` and add
each photo's pixel size to `content/images.js`. The page `/portfolio/<slug>` and the sitemap entry are created automatically.

### Real work, visualisations and AI
- A portfolio image that is a render, AI image or design drawing gets `kind: 'visualisation'` in `content/projects.js`;
  the portfolio does not label these at present, but `kind` keeps the record. Leave `kind` out only for photographs of completed work.
- Every home page film is listed in `content/media.js` with its `origin` (`ai`, `google-flow`, `pinterest`, `mixed`,
  `unconfirmed`), `source` and `rights`.
- Do not publish Pinterest downloads without the creator's licence.

### Images, video and caching
- Photos are served through Next.js image optimisation (`next/image`): AVIF or WebP at the size each screen needs.
- Films are already web-ready H.264 with no audio track and the index at the front (fast start). The scroll-scrubbed
  films (the room films `h-light/air/green/flow-*` and `feature-*`) have a keyframe every 4 frames and no B-frames so
  scrubbing stays smooth; keep that if you re-encode them. The 40s walk-in tour (`h-tour-s*`) uses a keyframe every 8
  frames to keep its size down. Films with a portrait `-m` cut use it on phones; the rest crop.
- On Hostinger, files in `public/` are cached by its CDN rules, not by `next.config.mjs` (see Hosting above): always use a
  new file name when replacing an image or film.

## Project structure
```
app/                 routes: / founder portfolio portfolio/[slug] services journal contact studio
  api/contact/       server endpoint that emails enquiries via Resend
  layout.js          fonts, header, footer, SEO metadata, structured data
  sitemap.js robots.js not-found.js
components/          Header, Footer, HomeStory (+ HomeMarkup), ContactForm, SvgSprites, Arrow
content/             site details, projects, services, image sizes, film registry
lib/home-story.js    the home page scroll story (starts on mount, fully cleaned up on leave)
lib/seo.js           page metadata helper (canonical URL + Open Graph tags)
public/              images (m/), videos (v/), fonts/, og-archiform.jpg link preview image
```

## Checks (performance, QA, accessibility, links)
```bash
npm run build                 # the checks run against the production build
npm run test:e2e              # every page in Chrome, Firefox and WebKit at 9 screen sizes: console errors, failed
                              # requests, sideways overflow, layout shift (CLS); screenshots in audit/screens/latest/
npm run check:a11y            # axe accessibility scan (WCAG 2.1 AA), phone and desktop
npm run audit                 # Lighthouse for every page, phone and desktop, with a summary table (audit/latest/)
npm run check:links           # broken links and missing files on the live site
SHOTS=after npm run test:e2e && npm run test:compare   # pixel comparison against audit/screens/before/
```
First time on a computer: `npx playwright install firefox webkit` (Chrome tests use the installed Google Chrome).
See `HANDOVER_REPORT.md` for the results at handover and the guide to adding content without slowing the site.

## Before launch checklist
- [ ] Replace placeholders in `content/site.js` (email, phone, WhatsApp, Instagram, address, domain)
- [ ] Set the environment variables in Hostinger (hPanel) and send a test enquiry
- [ ] Replace stock / AI imagery and the ocean clips with licensed or ARCHIFORM-owned media
- [ ] Replace the AI-generated portfolio images with real project photos, removing `kind: 'visualisation'` from each one replaced
- [ ] Save the original Pinterest link and the creator's free-to-use terms for each room film in `content/media.js`
- [ ] Point the domain at Hostinger and set `NEXT_PUBLIC_SITE_URL` to it
- [ ] Submit `https://yourdomain/sitemap.xml` in Google Search Console
