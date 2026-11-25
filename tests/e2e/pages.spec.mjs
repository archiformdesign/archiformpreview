import { test, expect } from '@playwright/test';
import { PAGES, VIEWPORTS, installClsObserver, isBenignFailure, scrollThrough, scrollByGestures, overflowX } from './site.mjs';

/* "No glitches" pass: every page at every screen size, in every browser project. A test fails on
   - any console error or uncaught exception,
   - any failed request or HTTP error response (4xx/5xx) other than the 404 page's own document,
   - sideways overflow (the page wider than the screen),
   - CLS above 0.05 while loading and scrolling through the page (Chrome only: the other engines don't report it).
   Screenshots go to audit/screens/<SHOTS or "latest">/<browser>/ for the before/after comparison (npm run test:compare). */
const SHOTS = process.env.SHOTS || 'latest';
const CLS_LIMIT = 0.05;

for (const [width, height] of VIEWPORTS) {
  const touch = width <= 1024;
  test.describe(`${width}x${height}`, () => {
    test.use({ viewport: { width, height }, hasTouch: touch });

    for (const pg of PAGES) {
      test(`${pg.name}`, async ({ page, browserName }, info) => {
        const problems = [];
        page.on('console', (m) => {
          if (m.type() !== 'error') return;
          // The browser logs the 404 page's own (expected) 404 status as a console error
          if (pg.status === 404 && /status of 404/.test(m.text()) && m.location()?.url?.endsWith(pg.path)) return;
          // Chrome pauses media downloads it does not need yet (a benign, self-inflicted network error)
          if (/ERR_NETWORK_IO_SUSPENDED/.test(m.text())) return;
          problems.push(`console error: ${m.text().slice(0, 300)}`);
        });
        page.on('pageerror', (e) => problems.push(`uncaught exception: ${e.message.slice(0, 300)}`));
        page.on('requestfailed', (r) => { if (!isBenignFailure(r)) problems.push(`request failed: ${r.url()} (${r.failure()?.errorText})`); });
        page.on('response', (r) => {
          const expected404 = pg.status === 404 && r.request().isNavigationRequest();
          if (r.status() >= 400 && !expected404) problems.push(`HTTP ${r.status()}: ${r.url()}`);
        });
        await page.addInitScript(installClsObserver);

        const res = await page.goto(pg.path, { waitUntil: 'load' });
        expect(res.status(), 'document status').toBe(pg.status || 200);
        await page.evaluate(() => document.fonts.ready);

        const dir = `audit/screens/${SHOTS}/${info.project.name}`;
        const shot = { animations: 'disabled', mask: [page.locator('video')], maskColor: '#888' };

        if (pg.name === 'home') {
          // The logo loader lifts once the walk-in film is ready (or after its safety timeout)
          await page.locator('#loader.gone').waitFor({ state: 'attached', timeout: 30_000 });
          await page.waitForTimeout(2200);
          await page.screenshot({ ...shot, path: `${dir}/home-${width}x${height}-top.png` });
          expect.soft(await overflowX(page), 'no sideways overflow at the gate').toEqual(expect.objectContaining({ scrollWidth: width }));
          if (browserName === 'chromium') expect.soft(await scrollByGestures(page, { touch }), 'scrolled to the foot of the page').toBeGreaterThan(0.97);
          else await scrollThrough(page);
          await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
          await page.waitForTimeout(2000);
          await page.screenshot({ ...shot, path: `${dir}/home-${width}x${height}-bottom.png` });
        } else {
          if (browserName === 'chromium') expect.soft(await scrollByGestures(page, { touch }), 'scrolled to the foot of the page').toBeGreaterThan(0.97);
          else await scrollThrough(page, { pause: 80 });
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
          await page.waitForTimeout(400);
          await page.screenshot({ ...shot, fullPage: true, path: `${dir}/${pg.name}-${width}x${height}.png` });
        }

        const ov = await overflowX(page);
        expect.soft(ov.scrollWidth, `page is ${ov.scrollWidth}px wide on a ${ov.innerWidth}px screen`).toBeLessThanOrEqual(ov.innerWidth);

        const cls = await page.evaluate(() => window.__cls);
        if (cls.supported) {
          info.annotations.push({ type: 'cls', description: cls.value.toFixed(4) });
          expect.soft(cls.value, `CLS ${cls.value.toFixed(4)}; shifts: ${JSON.stringify(cls.shifts.slice(0, 6))}`).toBeLessThanOrEqual(CLS_LIMIT);
        }
        expect.soft(problems, problems.join('\n')).toEqual([]);
      });
    }
  });
}
