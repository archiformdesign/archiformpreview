import { test, expect } from '@playwright/test';

/* Interactions, in all three browsers: the phone menu, the portfolio filters and the contact form.
   The contact form's server is replaced by a stand-in (page.route), so these tests never send a real enquiry. */

test.describe('phone menu', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });
  test('opens, locks the page, closes with Escape and the close button, returns focus', async ({ page }) => {
    await page.goto('/founder');
    const btn = page.getByRole('button', { name: 'Open menu' });
    await btn.click();
    const menu = page.getByRole('dialog', { name: 'Menu' });
    await expect(menu).toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
    await expect(btn).toBeFocused();
    // rapid open/close does not leave it stuck open or the page locked
    for (let i = 0; i < 4; i++) { await btn.click(); await page.getByRole('button', { name: 'Close menu' }).click(); }
    await expect(menu).toBeHidden();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
    // a link in the menu navigates and closes it
    await btn.click();
    await menu.getByRole('link', { name: 'Portfolio' }).click();
    await expect(page).toHaveURL(/\/portfolio$/);
    await expect(menu).toBeHidden();
  });
});

test.describe('portfolio filters', () => {
  test.use({ viewport: { width: 1280, height: 800 } });
  test('every tab shows its projects, rapid clicks settle on the last one', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/portfolio');
    const tabs = page.locator('.pf-tabs button');
    const n = await tabs.count();
    expect(n).toBeGreaterThan(1);
    const all = await page.locator('#projects > a').count();
    for (let i = 0; i < n; i++) {
      await tabs.nth(i).click();
      await expect(tabs.nth(i)).toHaveAttribute('aria-pressed', 'true');
      const shown = await page.locator('#projects > a').count();
      expect(shown).toBeGreaterThan(0);
      expect(shown).toBeLessThanOrEqual(all);
      await expect(page.locator('.pf-tabs + p[role="status"]')).toContainText(String(shown));
    }
    for (let k = 0; k < 12; k++) await tabs.nth(k % n).click({ delay: 0 });
    await expect(tabs.nth(11 % n)).toHaveAttribute('aria-pressed', 'true');
    expect(errors).toEqual([]);
  });
});

test.describe('contact form', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  async function fill(page) {
    await page.getByLabel('Name').fill('Test Visitor');
    await page.getByLabel('Email').fill('visitor@example.com');
    await page.getByLabel('Phone number').fill('+971 50 000 0000');
    await page.getByLabel('Property').selectOption({ index: 1 });
    await page.getByLabel(/on your mind/).fill('Automated QA test: please ignore.');
  }

  test('empty submit shows field errors and focuses the first one', async ({ page }) => {
    let called = false;
    await page.route('**/api/contact', (r) => { called = true; r.fulfill({ json: { ok: true } }); });
    await page.goto('/contact');
    await page.getByRole('button', { name: /book an initial consultation/i }).click();
    await expect(page.locator('#enquiry .err').first()).toBeVisible();
    await expect(page.getByLabel('Name')).toBeFocused();
    await expect(page.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true');
    expect(called).toBe(false);
  });

  test('a successful send shows the thank-you message (server stubbed)', async ({ page }) => {
    let body = null;
    await page.route('**/api/contact', async (r) => { body = r.request().postDataJSON(); await r.fulfill({ json: { ok: true } }); });
    await page.goto('/contact');
    await fill(page);
    await page.getByRole('button', { name: /book an initial consultation/i }).click();
    await expect(page.getByText('Thank you, Test.')).toBeVisible();
    expect(body).toMatchObject({ name: 'Test Visitor', email: 'visitor@example.com', company: '' });
    expect(body.submissionId).toBeTruthy();
  });

  test('a server error keeps the message and offers the email address (server stubbed)', async ({ page }) => {
    await page.route('**/api/contact', (r) => r.fulfill({ status: 500, json: { error: 'We couldn’t send your enquiry just now.' } }));
    await page.goto('/contact');
    await fill(page);
    await page.getByRole('button', { name: /book an initial consultation/i }).click();
    await expect(page.getByText(/couldn’t send your enquiry/)).toBeVisible();
    await expect(page.locator('#enquiry [role="alert"]')).toContainText('hello@archiformdesign.me');
    await expect(page.getByLabel(/on your mind/)).toHaveValue('Automated QA test: please ignore.');
  });
});
