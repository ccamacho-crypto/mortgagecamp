// Run against the built GitHub Pages bundle. Playwright is a local QA tool;
// set PLAYWRIGHT_MODULE to its absolute index.mjs path if not installed here.
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
const base = process.env.TEST_URL || 'http://127.0.0.1:5173/';
const output = process.env.QA_OUTPUT || 'verification';
await mkdir(output, { recursive: true });
const result = { routes: [], errors: [], failedLocalRequests: [], checks: [] };
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => result.errors.push(e.message));
  page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) result.failedLocalRequests.push({ url: r.url(), status: r.status() }); });
  await page.goto(base);
  await page.getByRole('heading', { name: /Your mortgage,/ }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${output}/desktop.png` });
  await page.getByRole('button', { name: 'Decline', exact: true }).click();
  const logo = page.locator('header img');
  assert(await logo.evaluate(i => i.complete && i.naturalWidth > 0), 'Logo must load locally');
  const heroUrl = await page.locator('#home > div').first().evaluate(e => getComputedStyle(e).backgroundImage);
  assert(heroUrl.includes(new URL('assets/mortgagecamp-hero.jpg', base).href));
  assert((await page.request.get(new URL('assets/mortgagecamp-hero.jpg', base).href)).ok());
  result.checks.push('local logo and hero image load');
  for (const path of ['rates', 'loans', 'why', 'calculators', 'process', 'reviews']) {
    await page.goto(`${base}#/${path}`);
    await page.locator('main h1').first().waitFor();
    await page.waitForFunction(() => document.title !== 'Mortgage Camp | Your mortgage, your terms.');
    result.routes.push({ path, title: await page.title(), h1: await page.locator('main h1').first().textContent() });
    assert(!(await page.locator('body').innerText()).includes('Unexpected Application Error'));
  }
  await page.goto(`${base}#/calculators`);
  const rate = page.getByRole('spinbutton', { name: 'Interest Rate', exact: true }).first();
  await rate.fill('0');
  await page.getByText('$1,388.89', { exact: true }).waitFor();
  result.checks.push('mortgage calculator updates to $1,388.89 at 0% interest');
  await page.getByRole('link', { name: /Schedule a Free Call/ }).last().click();
  await page.locator('#schedule').waitFor();
  assert(page.url().includes('#/'));
  result.checks.push('cross-page consultation CTA works at the configured deployment base');
  await page.locator('#first-name').fill('Test');
  await page.locator('#last-name').fill('Buyer');
  await page.locator('#phone').fill('(786) 555-0100');
  await page.locator('#email').fill('test@example.com');
  const form = page.getByRole('form', { name: 'Free mortgage consultation' });
  assert.equal(await form.getAttribute('method'), 'POST');
  assert.equal(await form.getAttribute('action'), 'https://formsubmit.co/ceo@mortgagecamp.net');
  assert.equal(await form.locator('[name="_captcha"]').inputValue(), 'true');
  const mail = await form.getByRole('link', { name: 'ceo@mortgagecamp.net' }).getAttribute('href');
  assert(mail.startsWith('mailto:ceo@mortgagecamp.net?'));
  // Capture the real browser POST without sending a test lead or triggering
  // provider CAPTCHA. This proves wiring, not provider or inbox delivery.
  let submitted = null;
  await page.route('https://formsubmit.co/ceo@mortgagecamp.net', async route => {
    submitted = { method: route.request().method(), body: route.request().postData() };
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>QA intercepted form submission</h1>' });
  });
  await page.getByRole('button', { name: /Schedule My Free Call/ }).click();
  await page.getByRole('heading', { name: 'QA intercepted form submission' }).waitFor();
  assert.equal(submitted.method, 'POST');
  const fields = new URLSearchParams(submitted.body);
  assert.equal(fields.get('email'), 'test@example.com');
  assert.equal(fields.get('first-name'), 'Test');
  assert.equal(fields.get('last-name'), 'Buyer');
  assert.equal(fields.get('phone'), '(786) 555-0100');
  assert.equal(fields.get('loan-type'), 'Purchase a home');
  assert.equal(fields.get('_captcha'), 'true');
  assert.equal(fields.get('_honey'), '');
  assert.equal(fields.get('_subject'), 'Mortgage Camp — free consultation request');
  result.checks.push('native POST contains all lead fields and routes to ceo@mortgagecamp.net (intercepted; inbox delivery not asserted)');
  await page.unroute('https://formsubmit.co/ceo@mortgagecamp.net');
  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(base);
    await page.getByRole('heading', { name: /Your mortgage,/ }).waitFor();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}`);
    result.checks.push(`no horizontal overflow at ${width}px`);
    if (width === 390) {
      // Motion mounts at opacity zero. Capture only after the actual headline
      // finishes its entrance, rather than mistaking DOM presence for visibility.
      await page.waitForFunction(() => Number(getComputedStyle(document.getElementById('hero-heading')).opacity) > 0.99);
      await page.screenshot({ path: `${output}/mobile.png` });
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.getByRole('link', { name: 'Calculators', exact: true }).first().click();
      await page.getByRole('heading', { name: /Mortgage.*calculators/i }).first().waitFor();
      assert(await page.getByRole('button', { name: 'Open menu' }).isVisible());
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Calculator mobile overflow');
      result.checks.push('mobile menu opens, navigates and closes');
    }
  }
  assert.equal(result.errors.length, 0, 'No uncaught JavaScript errors');
  assert.equal(result.failedLocalRequests.length, 0, 'No failed local asset requests');
} finally {
  await writeFile(`${output}/browser-results.json`, JSON.stringify(result, null, 2));
  await browser.close();
}
console.log(JSON.stringify(result, null, 2));
