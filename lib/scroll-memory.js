/**
 * Back and forward return to the place the visitor left. The scroll position of a page is saved the moment the visitor
 * leaves it (a link click, the back or forward button, or a full page unload) under its path in sessionStorage, and when
 * the visitor comes back to that page through history its position is handed back once.
 *
 * Pages with ordinary layouts are restored by components/ScrollMemory.jsx. The home page builds its scroll story first
 * (pinned sections that set the page height), so lib/home-story.js takes its position with takeRestore('/') and scrolls
 * there itself once the story is laid out.
 */

const KEY = 'archiform:scroll:';
let current = null;   // the path whose scroll the window shows now
let pending = null;   // the path reached through back or forward, until the next navigation
let lastY = 0;        // the scroll position the visitor last saw, kept by a scroll listener

function pathOf(url) {
  try { const u = new URL(url, window.location.href); return u.origin === window.location.origin ? u.pathname : null; } catch { return null; }
}

function savePosition(y, path = current) {
  if (!path) return;
  try { sessionStorage.setItem(KEY + path, String(Math.round(y))); } catch { /* storage blocked: nothing to restore */ }
}

/** The saved position for path if the visitor arrived there through back or forward, otherwise null. It stays readable until
    the next navigation, as React runs a page's effects twice in development and both runs must restore */
export function takeRestore(path) {
  if (pending !== path) return null;
  try {
    const y = parseInt(sessionStorage.getItem(KEY + path), 10);
    return Number.isFinite(y) && y > 0 ? y : null;
  } catch { return null; }
}

/** Called by ScrollMemory on every route: the window now shows this path. */
export function setCurrent(path) { current = path; lastY = window.scrollY; if (pending !== path) pending = null; }

let started = false;
/** Installs the listeners once per page load. */
export function startScrollMemory() {
  if (started || typeof window === 'undefined') return;
  started = true;
  current = window.location.pathname;
  lastY = window.scrollY;
  window.addEventListener('scroll', () => { lastY = window.scrollY; }, { passive: true });
  /* A full page load reached through back or forward (after a reload, or from another site) restores too */
  const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  if (nav && nav.type === 'back_forward') pending = current;

  /* Saved before Next swaps the page, while the window still shows the page being left. Capture phase, so it runs before
     the Link's own handler starts the navigation */
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || (a.target && a.target !== '_self')) return;
    const to = pathOf(a.href);
    if (!to) return;
    pending = null;
    if (to !== current) savePosition(window.scrollY);
  }, true);
  /* The URL has already changed when popstate fires, but the old page is still on screen, so it is saved under the path
     tracked here rather than the one in the address bar. The browser may already have moved the scroll for the entry it is
     going to, so the position saved is the last one the visitor saw (scroll events arrive a frame later) */
  window.addEventListener('popstate', () => {
    savePosition(lastY);
    pending = window.location.pathname;
  });
  window.addEventListener('pagehide', () => savePosition(window.scrollY));
}
