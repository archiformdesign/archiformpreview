'use client';

import { useLayoutEffect } from 'react';
import HomeMarkup from './HomeMarkup';
import { initHomeStory } from '@/lib/home-story';

// content: the home page copy and photos (Sanity over content/home.js), prepared by app/page.js
export default function HomeStory({ content }) {
  // Layout effect: the story sets up before the first paint, so there is no flash of the static layout.
  useLayoutEffect(() => initHomeStory(), []);
  return <HomeMarkup content={content} />;
}
