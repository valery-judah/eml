import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pricing, pricingRoute, offerRoute, validatePrice, validatePricing, formatPrice } from '../content/pricing.mjs';
import { workingTogether } from '../content/engagements.mjs';
import { projectRoot, renderOffer, servicePages } from '../scripts/render.mjs';
import { publicPath, site } from '../site.config.mjs';

const quote = { model: 'quote', currency: null, amount: null, minimum: null, maximum: null, unit: 'engagement', note: 'Scoped for this work.' };
const fixed = { ...quote, model: 'fixed', currency: 'USD', amount: 2500 };
const fileFor = route => path.join(projectRoot, 'dist', route, 'index.html');
const htmlFor = route => readFile(fileFor(route), 'utf8');
const plain = html => html.replace(/<[^>]*>/g, '').replaceAll('&amp;', '&').replaceAll('&#39;', "'");

test('pricing distinguishes scoped fees, fixed amounts, starting prices, ranges, indicative prices, and recurring rates', () => {
  assert.equal(formatPrice(quote), 'Scoped after discussion');
  assert.equal(formatPrice(fixed), 'USD 2,500 / engagement');
  assert.equal(formatPrice({ ...fixed, amount: 0 }), 'USD 0 / engagement', 'zero is an explicit price, not missing data');
  assert.equal(formatPrice({ ...fixed, amount: 2500.5 }), 'USD 2,500.50 / engagement');
  assert.equal(formatPrice({ ...fixed, model: 'from', unit: 'project' }), 'From USD 2,500 / project');
  assert.equal(formatPrice({ ...fixed, model: 'indicative', unit: 'hour' }), 'Approx. USD 2,500 / hour');
  assert.equal(formatPrice({ ...fixed, model: 'range', amount: null, minimum: 2500, maximum: 5000 }), 'USD 2,500–USD 5,000 / engagement');
  for (const unit of ['hour', 'day', 'month']) assert.equal(formatPrice({ ...fixed, unit }), `USD 2,500 / ${unit}`);
  assert.equal(formatPrice({ ...fixed, currency: 'JPY', amount: 2500 }), 'JPY 2,500 / engagement');
  assert.equal(formatPrice({ ...fixed, currency: 'KWD', amount: 25.125 }), 'KWD 25.125 / engagement');
});

test('the public catalogue rejects internal estimating records', () => {
  const data = structuredClone(pricing);
  data.referenceRate = fixed;
  assert.throws(() => validatePricing(data), /root\.referenceRate is not a supported field/);
});

test('invalid or ambiguous monetary records fail with an actionable field name', () => {
  for (const [value, field] of [
    [{ ...quote, amount: 0 }, 'amount'],
    [{ ...quote, currency: 'USD' }, 'currency'],
    [{ ...fixed, amount: null }, 'amount'],
    [{ ...fixed, amount: -1 }, 'amount'],
    [{ ...fixed, amount: Infinity }, 'amount'],
    [{ ...fixed, amount: '2500' }, 'amount'],
    [{ ...fixed, amount: 1.001 }, 'amount'],
    [{ ...fixed, amount: 0.000000001 }, 'amount'],
    [{ ...fixed, amount: 1.1, currency: 'JPY' }, 'amount'],
    [{ ...fixed, currency: 'ZZZ' }, 'currency'],
    [{ ...fixed, currency: 'usd' }, 'currency'],
    [{ ...fixed, minimum: 100 }, 'minimum'],
    [{ ...fixed, unit: 'year' }, 'unit'],
    [{ ...fixed, model: 'estimate' }, 'model'],
    [{ ...fixed, amount: null, model: 'range', minimum: 5000, maximum: 2500 }, 'maximum'],
    [{ ...fixed, amount: null, model: 'range', minimum: 2500, maximum: null }, 'maximum'],
    [{ ...fixed, ammount: 2000 }, 'ammount']
  ]) assert.throws(() => validatePrice(value), error => error.message.includes(`price.${field}`), `accepted malformed ${field}`);
});

test('catalogue validation rejects duplicate routes, unresolved groups, missing content, and misspelled fields', () => {
  assert.equal(validatePricing(pricing), pricing);
  for (const change of [
    data => { data.offers[1].id = data.offers[0].id; },
    data => { data.offers[0].id = '../private'; },
    data => { data.offers[0].group = 'missing'; },
    data => { data.offers[0].includes = []; },
    data => { data.offers[0].price.amount = 0; },
    data => { data.offers[0].summery = 'typo'; },
    data => { data.offers[0].journeyIds.push(data.offers[0].journeyIds[0]); },
    data => { data.groups.push({ id: 'empty', title: 'Empty', description: 'No offers' }); },
    data => { data.schemaVersion = 2; }
  ]) {
    const data = structuredClone(pricing);
    change(data);
    assert.throws(() => validatePricing(data), /Pricing catalogue:/);
  }
});

test('JSON offers stay consistent across homepage, working-together, complete pages, and sitemap', async () => {
  const home = await htmlFor('/');
  const working = await htmlFor(workingTogether.route);
  const overview = await htmlFor(pricingRoute);
  const sitemap = await readFile(path.join(projectRoot, 'dist/sitemap.xml'), 'utf8');
  assert.deepEqual(workingTogether.formats.map(format => format.id), pricing.offers.map(offer => offer.id));
  for (const offer of pricing.offers) {
    const route = offerRoute(offer);
    assert.ok(servicePages.some(page => page.route === route));
    for (const html of [home, working, overview]) {
      assert.ok(html.includes(`href="${publicPath(route)}"`), `${route} needs a discoverable entry point`);
      assert.ok(plain(html).includes(offer.title));
      assert.ok(plain(html).includes(formatPrice(offer.price)));
    }
    const detail = await htmlFor(route);
    assert.ok(plain(detail).includes(formatPrice(offer.price)));
    assert.equal((detail.match(/<h1\b/g) || []).length, 1);
    for (const value of [offer.title, offer.summary, offer.bestFor, offer.outcome, offer.completion, offer.price.note, ...offer.includes, ...offer.excludes, ...offer.clientInputs]) assert.ok(plain(detail).includes(value), `${route} lost scope or fee information`);
    for (const id of offer.journeyIds) assert.ok(detail.includes(`href="${publicPath(`${workingTogether.route}#${id}`)}"`));
    assert.ok(detail.includes(`href="${site.root}${route}"`));
    assert.ok(sitemap.includes(`<loc>${site.root}${route}</loc>`));
    assert.ok(detail.includes(`href="${publicPath(`/contact/?topic=${encodeURIComponent(`${offer.title}: scope and fee`)}`)}"`), 'enquiries must carry the engagement into the contact brief');
  }
});

test('numeric pricing renders from the same model and content is escaped in offer pages', async () => {
  const source = pricing.offers[0];
  const html = await renderOffer({ ...source, price: { ...fixed, model: 'from', note: 'Example rendering fixture only.' } });
  assert.ok(plain(html).includes('From USD 2,500 / engagement'));
  const unsafe = '</p><img data-injected="true"><script>alert(1)</script> & price';
  const escaped = await renderOffer({ ...source, title: unsafe, summary: unsafe, bestFor: unsafe, outcome: unsafe, includes: [unsafe], excludes: [unsafe], clientInputs: [unsafe], completion: unsafe, price: { ...quote, note: unsafe } });
  assert.ok(!escaped.includes('<img data-injected='));
  assert.ok(!escaped.includes('<script>alert(1)</script>'));
  assert.ok(escaped.includes('&lt;img data-injected=&quot;true&quot;&gt;'));
});
