import HomeStory from '@/components/HomeStory';
import { pageMeta } from '@/lib/seo';
import { site } from '@/content/site';
import { home } from '@/content/home';
import { getProject } from '@/content/projects';
import { sanityFetch } from '@/sanity/lib/fetch';
import { FEATURED_PROJECT_QUERY, HOME_PAGE_QUERY } from '@/sanity/lib/queries';
import { imageDimensions, imagePosition, urlFor } from '@/sanity/lib/image';

// Rebuild the page in the background at most once a minute, so Studio edits appear without a redeploy
export const revalidate = 60;

// No title: the home page uses the root layout's default, "ARCHIFORM Design Studio | Interior design in Dubai"
export const metadata = pageMeta({ description: site.description, path: '/' });

/* The Home Page document in Sanity, field by field over the local copy in content/home.js. A field left empty in the CMS,
   or a list without the number of items the scroll story is timed to, keeps the local value. */
const text = (value, fallback) => (typeof value === 'string' && value.trim() ? value : fallback);
const list = (value, fallback, valid, count) =>
  Array.isArray(value) && value.length && (!count || value.length === count) && value.every(valid) ? value : fallback;
const hasText = (v) => typeof v === 'string' && v.trim() !== '';
const hasTitle = (v) => hasText(v?.title);

// A Sanity image in the shape the home page uses ({ src, w, h, alt, pos }), or the local fallback when it has no asset
function image(source, fallback) {
  if (!source?.asset?._ref) return fallback;
  const [w, h] = imageDimensions(source);
  return { src: urlFor(source).url(), w, h, alt: source.alt ?? fallback?.alt ?? '', pos: imagePosition(source) };
}

function homeContent(cms, project) {
  const c = cms || {};
  const local = getProject(home.featuredSlug);
  return {
    heroIntro: text(c.heroIntro, home.heroIntro),
    heroValues: list(c.heroValues, home.heroValues, hasText, 3),
    walkInLabel: text(c.walkInLabel, home.walkInLabel),
    walkInHeading: text(c.walkInHeading, home.walkInHeading),
    walkInText: text(c.walkInText, home.walkInText),
    panels: list(c.panels, home.panels, hasTitle, 4),
    holisticLabel: text(c.holisticLabel, home.holisticLabel),
    holisticHeading: text(c.holisticHeading, home.holisticHeading),
    holisticText: text(c.holisticText, home.holisticText),
    detailsLabel: text(c.detailsLabel, home.detailsLabel),
    detailsHeading: text(c.detailsHeading, home.detailsHeading),
    detailsText: text(c.detailsText, home.detailsText),
    detailCards: list(c.detailCards, home.detailCards, (card) => hasTitle(card) && card.image?.asset)
      .map((card) => (card.image?.asset ? { ...card, points: card.points || [], image: image(card.image) } : card)),
    featured: project
      ? { name: project.title, slug: project.slug, location: project.location, type: project.projectType, did: project.servicesProvided }
      : { name: local.name, slug: local.slug, location: local.location, type: local.type, did: local.did },
    featuredSubtitle: text(c.featuredSubtitle, home.featuredSubtitle),
    featuredText: text(c.featuredText, home.featuredText),
    featuredQuote: text(c.featuredQuote, home.featuredQuote),
    processHeading: text(c.processHeading, home.processHeading),
    processSteps: list(c.processSteps, home.processSteps, hasTitle, 4),
    founderLabel: text(c.founderLabel, home.founderLabel),
    founderHeading: text(c.founderHeading, home.founderHeading),
    founderText: text(c.founderText, home.founderText),
    founderQuote: text(c.founderQuote, home.founderQuote),
    founderSignature: text(c.founderSignature, home.founderSignature),
    founderImage: image(c.founderImage, home.founderImage),
    journeyHeading: text(c.journeyHeading, home.journeyHeading),
    journey: list(c.journey, home.journey, (j) => hasText(j?.label) && j.image?.asset, 3)
      .map((j) => (j.image?.asset ? { label: j.label, image: image(j.image) } : j)),
    closeLabel: text(c.closeLabel, home.closeLabel),
    closeHeading: text(c.closeHeading, home.closeHeading),
    closeParagraphs: list(c.closeParagraphs, home.closeParagraphs, hasText),
    closeCta: text(c.closeCta, home.closeCta),
  };
}

export default async function HomePage() {
  const [cms, project] = await Promise.all([
    sanityFetch(HOME_PAGE_QUERY),
    sanityFetch(FEATURED_PROJECT_QUERY, { fallbackSlug: home.featuredSlug }),
  ]);
  return <HomeStory content={homeContent(cms, project)} />;
}
