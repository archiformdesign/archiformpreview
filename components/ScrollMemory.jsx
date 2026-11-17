'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { startScrollMemory, setCurrent, takeRestore } from '@/lib/scroll-memory';

/* Back and forward return the visitor to the place they left (lib/scroll-memory.js). The home page's scroll story (the
   .story class on <html>) restores itself once it is built, so it is left alone here. */
export default function ScrollMemory() {
  const pathname = usePathname();
  useEffect(() => {
    startScrollMemory();
    setCurrent(pathname);
    const y = document.documentElement.classList.contains('story') ? null : takeRestore(pathname);
    if (y == null) return undefined;
    /* Waits until the page is tall enough to scroll there (a client-rendered grid can fill in a frame or two late), for up to
       about a second, then goes as far as it can */
    let frame = 0, raf = 0;
    const go = () => {
      const room = document.documentElement.scrollHeight - window.innerHeight;
      if (room >= y || frame++ > 60) { window.scrollTo(0, Math.min(y, room)); return; }
      raf = requestAnimationFrame(go);
    };
    raf = requestAnimationFrame(go);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);
  return null;
}
