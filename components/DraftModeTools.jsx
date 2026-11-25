'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useIsPresentationTool } from 'next-sanity/hooks';
import { VisualEditing } from 'next-sanity/visual-editing';

/* Rendered by the root layout only while Draft Mode is on. VisualEditing draws the click-to-edit overlays and re-renders
   the page as the editor types in the Studio. Outside the Studio (a preview opened in its own tab) a small banner shows
   that drafts are visible, with a way back to the published site. */
export default function DraftModeTools() {
  const router = useRouter();
  const pathname = usePathname();
  const inStudio = useIsPresentationTool();

  // The site fetches on the server, so each edit in the Studio re-requests the page; Draft Mode skips every cache
  const refresh = (payload) => {
    if (payload.source !== 'manual' && payload.source !== 'mutation') return false;
    router.refresh();
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <>
      <VisualEditing refresh={refresh} />
      {inStudio === false ? (
        <form method="post" action={`/api/draft-mode/disable?to=${encodeURIComponent(pathname || '/')}`} className="draft-bar">
          <span>Preview: showing unpublished changes</span>
          <button type="submit">Exit preview</button>
        </form>
      ) : null}
    </>
  );
}
