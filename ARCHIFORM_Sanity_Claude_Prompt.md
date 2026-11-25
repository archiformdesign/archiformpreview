# Claude Code Prompt --- Complete ARCHIFORM Sanity CMS Integration

You are working inside the existing ARCHIFORM Next.js website
repository. Act as a careful senior Next.js/Sanity engineer. Finish the
Sanity CMS integration without redesigning the website, changing
production, or introducing unnecessary dependencies.

## Working rules

1.  Work only on the existing `client-preview` branch. Check the current
    branch and working tree before editing. Do not switch branches.
2.  **Do not touch `main`, Hostinger production, DNS, domain settings,
    Vercel production settings, or deployment configuration.** Do not
    deploy or push.
3.  Preserve the current website's design, copy, responsive behaviour,
    animations, routes, SEO metadata, and user experience unless a
    change is essential for CMS integration.
4.  Do not replace components wholesale when a small data-layer change
    will work.
5.  Do not install packages unless genuinely required. Reuse the
    installed Sanity and Next.js packages.
6.  Do not run `npm audit fix`, `npm audit fix --force`, broad upgrades,
    or dependency downgrades.
7.  Never print, expose, commit, or modify the contents of `.env.local`.
    Never expose API tokens. The write token is server-side only and
    must never use a `NEXT_PUBLIC_` variable.
8.  Do not invent missing website copy, URLs, media, business details,
    or CMS content. Keep existing local content as the source of truth
    where Sanity content is not yet migrated.
9.  Make changes incrementally, verify each route, and report exact
    files changed and commands/results. If a key assumption is unclear,
    inspect the code first rather than guessing.
10. Avoid destructive operations. Do not delete local content files;
    keep them as fallback/reference until the integration is verified.

## Project context

-   Website: ARCHIFORM Design Studio, Dubai.
-   Domain: `https://archiformdesign.me` (the previous placeholder
    `https://www.archiform.com` has been corrected in
    `content/site.js`).
-   Stack: Next.js 16 App Router, React 19, JavaScript, GSAP, Lenis.
-   Sanity project ID: `d41h1npy`
-   Dataset: `production`
-   Sanity Studio is embedded at `/studio`.
-   Existing Sanity client: `sanity/lib/client.js`
-   Environment exports: `sanity/env.js`
-   GROQ queries: `sanity/lib/queries.js`
-   Sanity schemas: `sanity/schemaTypes/`
-   Sanity image helper: `sanity/lib/image.js`
-   Website uses local data in `content/*.js` today; the goal is to move
    page data reads to Sanity while preserving the existing
    presentation.
-   The site has an existing `SiteShell` arrangement that hides the
    public Header/Footer on `/studio`. Do not regress it.
-   The Studio navigation has About Us, Portfolio (Projects nested
    inside), Journal, Services, Contact Us.
-   Work locally and verify. Hostinger production is intentionally in
    maintenance mode. The complete site is on `client-preview`; do not
    change `main`.

## Completed CMS content migration

The following Sanity documents/assets have already been imported into
the `production` dataset:

-   7 `project` documents, with 25 unique project images uploaded.
-   1 `journal` document (the Gulf News / She Means Business feature).
-   5 `service` documents, with their images.
-   1 `aboutPage` singleton, including founder portrait, approach image,
    introduction, four pillars and studio copy.
-   1 `contactPage` singleton.

A read-only API check returned **15 documents** across these five
document types. A Studio screenshot confirmed the seven project records
and their images. Do not re-import these documents or upload duplicate
assets unless you first establish that a specific asset/document is
missing.

Stable IDs used by the import scripts: - Projects: `project-${slug}` -
Journal: `journal-she-means-business-roula-jbour` - About singleton:
`aboutPage` - Contact singleton: `contactPage` - Service IDs:
`service-${slug}`

Import scripts currently exist under `scripts/`: -
`import-projects.mjs` - `import-journal.mjs` - `import-services.mjs` -
`import-pages.mjs`

These scripts were run successfully. Do not run them again unless
necessary.

## Important existing content and field mapping

### Projects

Local source: `content/projects.js`

Existing source fields include: - `slug` - `category` - `name` - `sub` -
`type` - `location` - `did` - `cover` - `intro` - `text` - `images[]`
with `src`, `alt`, optional `wide`, `full`, `kind`

Sanity `project` fields: - `title` - `slug` - `category` - `subtitle` -
`projectType` - `location` - `servicesProvided` - `introduction` -
`description` - `coverImage` - `gallery[]` - `featured`

The original category values include `Dining & Kitchen`, `Outdoor`,
`Bedrooms`, `Details`, `Bathrooms`. Preserve these exact categories. Do
not invent new categories.

Image `kind` values distinguish `visualisation` from photographs.
Preserve that distinction and the optional `wide` / `full` flags and
gallery order.

### Services

Local source: `content/services.js`

Five services, each with: - `name` - `rail` - `tagline` - `text` -
`image` - `alt` - optional `ratio` - optional `pos`

Sanity `service` fields: - `title` - `slug` - `rail` - `tagline` -
`description` - `image` (with nested `alt`) - `imageRatio` -
`imagePosition` - `order`

### Journal

Existing source: `app/journal/page.js`

There is currently one feature: - Publication: She Means Business -
Publisher: Gulf News - Date: 30 October 2026 - Title: "Roula Jbour on
homes that are beautiful, functional and supportive of healthier
living." - Introductory copy is in the page source. - Feature image:
`/m/she-means-business-p14.jpg` - External URL:
`https://features.gulfnews.com/books/oknx/?maxwidthtosmallmode=0&maxheighttosmallmode=0` -
The page includes `PressClip` (`app/journal/PressClip.jsx`) as a video
component. No video URL was provided in the content source; do not
invent one or remove the existing video component.

Sanity `journal` fields: - `title` - `slug` - `publication` -
`publisher` - `publishedAt` - `excerpt` - `coverImage` - `externalUrl` -
`videoUrl` (optional; currently not populated)

### About Us

Existing source: `app/founder/FounderContent.jsx`, route `/founder`.

Sanity singleton fields: - `title` - `founderName` - `founderRole` -
`founderImage` - `introduction` (Portable Text) - `approachHeading` -
`approachText` - `approachImage` - `pillars[]` (`title`, `text`) -
`studioHeading` - `studioDescription` (Portable Text)

Existing founder image: `/m/roula.jpg` Existing approach image:
`/m/approach-skyline.jpg`

Keep the current copy exactly. Four pillars: 1.
`01. Wellbeing by Design` ---
`Light, airflow and materials that feel good to live with.` 2.
`02. Function with Purpose` ---
`Intuitive layouts that work around everyday life.` 3.
`03. Timeless Aesthetics` ---
`Authentic materials and proportions beyond trends.` 4.
`04. Personal Connection` ---
`Your home should tell your story, not ours.`

### Contact Us and shared site details

Local source: `content/site.js`

-   Name: ARCHIFORM Design Studio
-   Short name: ARCHIFORM
-   Tagline: Thoughtful Interiors. Healthy Living.
-   Title tail: Interior design in Dubai
-   Description: Dubai interior design studio for villas and apartments.
    Interior design, renovation, bespoke joinery and project management,
    with healthy living built in.
-   URL:
    `process.env.NEXT_PUBLIC_SITE_URL || 'https://archiformdesign.me'`
-   Email: `hello@archiformdesign.me`
-   Phone: `+971 50 182 1581`
-   WhatsApp: `971501821581`
-   Instagram handle: `archiform_design_studio`
-   City: Dubai
-   Country: United Arab Emirates
-   Street: empty (do not invent)
-   Hours: By appointment only
-   Founder: Roula Jbour

Sanity `contactPage` fields: - `eyebrow` - `heading` - `introduction` -
`email` - `phones[]` - `whatsapp` - `instagram` - `address` (`street`,
`city`, `country`) - `hours`

The current import used `heading: 'Get in touch'` and
`introduction: 'Tell us about your project. We would love to hear from you.'`
as starter copy because the local source did not define these. Check the
actual contact page before deciding whether to keep or replace these
values.

## Current frontend integration status

### Existing Sanity client

`sanity/lib/client.js` currently imports `createClient` from
`next-sanity` and `apiVersion`, `dataset`, `projectId` from
`sanity/env.js`. It was changed to `useCdn: false` for fresh local
integration testing.

`sanity/env.js` reads: - `NEXT_PUBLIC_SANITY_API_VERSION` (fallback
`2026-11-21`) - `NEXT_PUBLIC_SANITY_DATASET` -
`NEXT_PUBLIC_SANITY_PROJECT_ID`

### GROQ queries

`sanity/lib/queries.js` was created and exports: - `PROJECTS_QUERY` -
`PROJECT_QUERY` - `SERVICES_QUERY` - `JOURNAL_QUERY` -
`ABOUT_PAGE_QUERY` - `CONTACT_PAGE_QUERY`

Inspect the exact query file before relying on it. Keep queries aligned
with the actual schemas.

### Portfolio integration is in progress and currently broken

The following changes were made:

1.  `sanity/lib/image.js` was first created using
    `createImageUrlBuilder` from `next-sanity`, but the installed
    `next-sanity` version does not export that symbol.

2.  It was then replaced with a manual helper that parses Sanity image
    asset references:

    ``` js
    import {projectId, dataset} from '../env'

    export function urlFor(source) {
      const ref = source?.asset?._ref
      if (!ref) throw new Error('Sanity image asset reference is missing.')
      const match = ref.match(/^image-(.+)-(\d+x\d+)-([a-z]+)$/)
      if (!match) throw new Error(`Invalid Sanity image reference: ${ref}`)
      const [, id, dimensions, format] = match
      let width
      return {
        width(value) { width = value; return this },
        url() {
          const base = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`
          return width ? `${base}?w=${width}&auto=format` : `${base}?auto=format`
        },
      }
    }
    ```

    This helper currently throws
    `Sanity image asset reference is missing.` in the Portfolio page,
    even though the raw API data shows valid refs. Do not assume why.
    Inspect the actual runtime object passed to it and trace the
    mismatch.

3.  `app/portfolio/ProjectGrid.jsx` was rewritten to use Sanity fields:

    -   `p.title`
    -   `p.subtitle`
    -   `p.slug`
    -   `p.category`
    -   `p.coverImage`
    -   `urlFor(cover).width(1200).url()` It retains the filter tabs and
        styling classes.

4.  `app/portfolio/page.js` was changed to an async Server Component
    that fetches:

    ``` js
    const projects = await client.fetch(PROJECTS_QUERY)
    ```

    and passes the result to `ProjectGrid`.

5.  Raw API inspection command confirmed all seven projects have valid
    `coverImage.asset._ref` values:

    ``` js
    [
      {title:"Bespoke Joinery", coverImage:{asset:{_ref:"image-...-1448x1086-jpg"}}},
      ...
    ]
    ```

    Therefore, the issue is likely a data-shape/field access mismatch in
    the client component/helper, not missing imported assets. Inspect
    `ProjectGrid.jsx` exact line numbers and the GROQ result shape
    before changing.

6.  User previously had a case-sensitive filename mismatch: actual file
    is `app/portfolio/ProjectGrid.jsx` (capital P and G). Use the
    correct path.

7.  `content/images.js` contains local image dimensions, but it should
    no longer be required for Sanity images once the new integration is
    correct.

## Remaining tasks

Finish the integration in this order, verifying each route:

1.  **Fix Portfolio integration** (diagnose current
    `coverImage.asset._ref` runtime mismatch first). Verify all seven
    cards, image URLs, filters, and links.
2.  **Project detail pages**: inspect `app/portfolio/[slug]/page.js` and
    related components. Fetch the matching document using
    `PROJECT_QUERY`; preserve existing gallery order, `alt`, `wide`,
    `full`, `kind`, location, project type, services and descriptive
    copy. Ensure image URLs use the Sanity image helper correctly.
    Preserve route metadata and 404 behaviour.
3.  **Services page**: inspect `app/services/page.js` and child
    components. Fetch `SERVICES_QUERY`; preserve original order, images,
    alt text, ratio and position, rail labels, taglines, and
    descriptions.
4.  **Journal page**: fetch `JOURNAL_QUERY`; preserve existing page
    design, publication details, external Gulf News link, feature image
    and `PressClip` component. Do not invent a video URL.
5.  **About Us page**: route is `/founder`. Inspect
    `app/founder/page.js` and `FounderContent.jsx`; fetch
    `ABOUT_PAGE_QUERY`; render Portable Text correctly (check if a
    Portable Text renderer is already installed before adding anything).
    Preserve exact founder copy, images, design principles, and studio
    copy.
6.  **Contact page**: inspect `app/contact/page.js` and child
    components; fetch `CONTACT_PAGE_QUERY` and keep form submission
    working, including the existing Resend integration and
    `hello@archiformdesign.me` recipient. CMS must not expose secrets or
    break the contact API.
7.  **Shared site settings**: inspect all imports of `content/site.js`.
    Keep SEO, header, footer, metadata, social links and contact details
    correct. The site domain must remain `https://archiformdesign.me`.
    Do not blindly move shared settings into CMS if static
    build/metadata constraints make that unsafe.
8.  Check the home page only if it is explicitly in scope and the
    required Sanity schema/content exists. There is no migrated home
    page document currently; do not invent one. It is acceptable to keep
    home page content local for now.
9.  Run `npm run build` after the full integration. Fix only actual
    integration errors. Check all relevant routes locally.
10. Report all changed files and any remaining local-only content. Do
    not deploy, push, alter Hostinger, or touch `main`.

## Technical requirements

-   Use Next.js App Router conventions correctly.
-   Server Components should fetch Sanity data server-side.
-   Keep interactive components (`ProjectGrid`, sliders, tabs,
    animations) as Client Components only where necessary.
-   Use `notFound()` for missing project detail records.
-   For Sanity image URLs, prefer a supported installed Sanity image URL
    builder if available; inspect package exports/version first. Do not
    assume `createImageUrlBuilder` is exported by `next-sanity`. A
    simple safe URL builder may be used if it correctly handles Sanity
    asset refs and query parameters.
-   Next.js `Image` remote host configuration must be checked if using
    remote Sanity CDN URLs. Add only the required `cdn.sanity.io` host
    configuration if needed, preserving existing image config.
-   Portable Text: inspect installed dependencies and existing project
    patterns before installing.
-   Keep image `alt` text and image crop/focus handling where
    applicable.
-   Ensure the public website never needs the Sanity write token. Public
    read queries can use the dataset's configured public read access.
-   Do not expose token values in logs or client bundles.

## Completion report format

At the end, report: - Pages connected to Sanity. - Pages intentionally
still using local content. - Files changed. - Build result. - Local
route checks performed. - Any remaining issue or manual CMS entry
needed. - Explicitly confirm: no deployment, no push, no
production/Hostinger/main changes.
