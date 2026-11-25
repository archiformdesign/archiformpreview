/* Shared lists and helpers for the QA suite */

export const PAGES = [
  { name: 'home', path: '/' },
  { name: 'founder', path: '/founder' },
  { name: 'portfolio', path: '/portfolio' },
  { name: 'project', path: '/portfolio/emirates-living-villa' },
  { name: 'services', path: '/services' },
  { name: 'journal', path: '/journal' },
  { name: 'contact', path: '/contact' },
  { name: '404', path: '/this-page-does-not-exist', status: 404 },
];

export const VIEWPORTS = [
  [360, 800], [390, 844], [430, 932],   // phones
  [768, 1024], [1024, 768],             // tablets
  [1280, 800], [1440, 900], [1920, 1080], [2560, 1440], // desktops
];

/* Runs in the page before any of its scripts: records layout shifts (Chromium only; Firefox and Safari have no
   layout-shift entries) and computes CLS the way Chrome reports it, as the worst 5s session window. */
export function installClsObserver() {
  window.__cls = { value: 0, supported: false, shifts: [] };
  if (!('PerformanceObserver' in window) || !PerformanceObserver.supportedEntryTypes?.includes('layout-shift')) return;
  window.__cls.supported = true;
  let session = 0, first = 0, last = 0;
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      if (e.hadRecentInput) continue;
      if (session && e.startTime - last < 1000 && e.startTime - first < 5000) session += e.value;
      else { session = e.value; first = e.startTime; }
      last = e.startTime;
      window.__cls.value = Math.max(window.__cls.value, session);
      if (e.value > 0.001) {
        window.__cls.shifts.push({
          t: Math.round(e.startTime), v: +e.value.toFixed(4), y: Math.round(window.scrollY),
          nodes: (e.sources || []).map((s) => s.node && (s.node.id ? '#' + s.node.id : s.node.nodeName + '.' + (s.node.className?.baseVal ?? s.node.className))).filter(Boolean).slice(0, 3),
        });
      }
    }
  }).observe({ type: 'layout-shift', buffered: true });
}

/* Media requests the browser cancels itself (a video's range request superseded by the next one, or dropped on navigation)
   are normal and not failures */
export function isBenignFailure(req) {
  const err = req.failure()?.errorText || '';
  const type = req.resourceType();
  if (/ERR_ABORTED|ERR_NETWORK_IO_SUSPENDED|NS_BINDING_ABORTED|cancelled|Load request cancelled/i.test(err) && (type === 'media' || type === 'fetch' || /\/v\/.+\.mp4/.test(req.url()))) return true;
  // WebKit cancels a blob: film URL when it swaps the video source; the film itself is already in memory
  if (req.url().startsWith('blob:') && /cancel/i.test(err)) return true;
  // Next.js prefetches routes in the background and drops them on navigation
  if (/ERR_ABORTED|NS_BINDING_ABORTED|cancelled/i.test(err) && /_rsc=|\?_rsc|\.txt\?/.test(req.url())) return true;
  return false;
}

/* Scrolls from top to bottom in steps of three-quarters of a screen, as a reader would, then back to the top.
   The home page grows as its pinned scenes are laid out, so the height is re-read every step. */
export async function scrollThrough(page, { pause = 120 } = {}) {
  let y = 0;
  for (let i = 0; i < 400; i++) {
    const { max, step } = await page.evaluate(() => ({
      max: document.documentElement.scrollHeight - window.innerHeight,
      step: Math.round(window.innerHeight * 0.75),
    }));
    if (y >= max) break;
    y = Math.min(max, y + step);
    await page.evaluate((to) => window.scrollTo(0, to), y);
    await page.waitForTimeout(pause);
  }
  await page.waitForTimeout(600);
}

/* Chrome only: scrolls to the bottom with real input gestures (a finger swipe on touch screens, the mouse wheel on desktop,
   where Lenis smooths it), at a reading pace. Programmatic jumps of most of a screen exaggerate how far a pinned section
   moves before it is caught, so CLS is measured with these instead. */
export async function scrollByGestures(page, { touch }) {
  const cdp = await page.context().newCDPSession(page);
  const { width, height } = page.viewportSize();
  let stuck = 0, last = -1;
  for (let i = 0; i < 300 && stuck < 3; i++) {
    await cdp.send('Input.synthesizeScrollGesture', {
      x: Math.round(width / 2), y: Math.round(height * 0.7), yDistance: -Math.round(height * 0.5),
      speed: 1200, gestureSourceType: touch ? 'touch' : 'mouse', preventFling: true,
    });
    const y = await page.evaluate(() => window.scrollY);
    stuck = y <= last + 1 ? stuck + 1 : 0;
    last = y;
  }
  await page.waitForTimeout(800);
  await cdp.detach();
  // How far the gestures got, so a test can tell a real scroll-through from one that stalled
  return page.evaluate(() => { const max = document.documentElement.scrollHeight - window.innerHeight; return max <= 1 ? 1 : window.scrollY / max; });
}

export async function overflowX(page) {
  return page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth }));
}
