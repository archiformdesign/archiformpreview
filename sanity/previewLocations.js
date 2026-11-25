import { defineDocuments, defineLocations } from 'sanity/presentation'

/* Tells the Studio's Presentation tool which page shows which document:
   - mainDocuments: opening a page in the preview opens its document in the editor beside it
   - locations: each document lists the pages it appears on ("Used on N pages"), one click to preview them */

export const mainDocuments = defineDocuments([
  { route: '/', filter: `_type == "homePage"` },
  { route: '/founder', filter: `_type == "aboutPage"` },
  { route: '/contact', filter: `_type == "contactPage"` },
  { route: '/portfolio/:slug', filter: `_type == "project" && slug.current == $slug` },
])

const page = (title, href) => ({ title, href })

export const locations = {
  homePage: defineLocations({ message: 'This document is the home page', locations: [page('Home', '/')] }),
  aboutPage: defineLocations({ locations: [page('About Us', '/founder')] }),
  contactPage: defineLocations({ locations: [page('Contact', '/contact')] }),
  project: defineLocations({
    select: { title: 'title', slug: 'slug.current', featured: 'featured' },
    resolve: (doc) => ({
      locations: [
        doc?.slug && page(doc.title || 'Untitled project', `/portfolio/${doc.slug}`),
        page('Portfolio', '/portfolio'),
        doc?.featured && page('Home (featured project)', '/'),
      ].filter(Boolean),
    }),
  }),
  service: defineLocations({ locations: [page('Services', '/services')] }),
  journal: defineLocations({ locations: [page('Journal', '/journal')] }),
}
