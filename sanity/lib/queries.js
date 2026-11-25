import {defineQuery} from 'next-sanity'

// Projects are listed in the order they were created in the CMS. The import created them in the site's original
// curated grid order, so this keeps that order, and a project added later in the Studio joins the end of the grid.
export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(_createdAt asc) {
    _id,
    title,
    "slug": slug.current,
    category,
    subtitle,
    coverImage,
    "coverAlt": gallery[asset._ref == ^.coverImage.asset._ref][0].alt
  }
`)

export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(_createdAt asc).slug.current
`)

// "next" is the following project in grid order, wrapping round to the first after the last
export const PROJECT_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    category,
    subtitle,
    projectType,
    location,
    servicesProvided,
    introduction,
    description,
    coverImage,
    "coverAlt": gallery[asset._ref == ^.coverImage.asset._ref][0].alt,
    gallery[] {
      _key,
      asset,
      crop,
      hotspot,
      alt,
      wide,
      full,
      kind
    },
    featured,
    "next": coalesce(
      *[_type == "project" && defined(slug.current) && _createdAt > ^._createdAt] | order(_createdAt asc)[0] {title, "slug": slug.current},
      *[_type == "project" && defined(slug.current)] | order(_createdAt asc)[0] {title, "slug": slug.current}
    )
  }
`)

export const SERVICES_QUERY = defineQuery(`
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    rail,
    tagline,
    description,
    image,
    imageRatio,
    imagePosition,
    order
  }
`)

export const JOURNAL_QUERY = defineQuery(`
  *[_type == "journal"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publication,
    publisher,
    publishedAt,
    pageReference,
    excerpt,
    coverImage,
    externalUrl,
    videoUrl
  }
`)

export const ABOUT_PAGE_QUERY = defineQuery(`
  *[_type == "aboutPage"][0] {
    title,
    founderName,
    founderRole,
    founderImage,
    introduction,
    approachHeading,
    approachText,
    approachImage,
    pillars,
    studioHeading,
    studioDescription
  }
`)

export const CONTACT_PAGE_QUERY = defineQuery(`
  *[_type == "contactPage"][0] {
    eyebrow,
    heading,
    introduction,
    email,
    phones,
    whatsapp,
    instagram,
    address,
    hours
  }
`)

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage"][0] {
    heroIntro,
    heroValues,
    walkInLabel,
    walkInHeading,
    walkInText,
    panels[] {title, text},
    holisticLabel,
    holisticHeading,
    holisticText,
    detailsLabel,
    detailsHeading,
    detailsText,
    detailCards[] {image, title, subtitle, points},
    featuredSubtitle,
    featuredText,
    featuredQuote,
    processHeading,
    processSteps[] {title, text},
    founderLabel,
    founderHeading,
    founderText,
    founderQuote,
    founderSignature,
    founderImage,
    journeyHeading,
    journey[] {label, image},
    closeLabel,
    closeHeading,
    closeParagraphs,
    closeCta
  }
`)

// The project with "Featured Project" ticked (the most recently edited, if several are), else the default project
export const FEATURED_PROJECT_QUERY = defineQuery(`
  coalesce(
    *[_type == "project" && featured == true && defined(slug.current)] | order(_updatedAt desc)[0],
    *[_type == "project" && slug.current == $fallbackSlug][0]
  ) {
    title,
    "slug": slug.current,
    location,
    projectType,
    servicesProvided
  }
`)
