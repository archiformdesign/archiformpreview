'use client';

import dynamic from 'next/dynamic';

/* The Sanity click-to-edit overlay (DraftModeTools) pulls in about 600 KB of editor code (Sanity UI, styled-components, an
   animation library). Imported straight into the root layout, Next.js shipped it to every visitor on every page, although it
   only ever renders for an editor previewing drafts. A Server Component's dynamic import is not code-split, so this small
   Client Component does the lazy import: the editor code now downloads only when Draft Mode is on. */
const DraftModeTools = dynamic(() => import('./DraftModeTools'), { ssr: false });

export default function DraftModeToolsLazy() {
  return <DraftModeTools />;
}
