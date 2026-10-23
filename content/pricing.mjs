import { createRequire } from 'node:module';

const models = ['quote', 'fixed', 'from', 'range', 'indicative'];
const units = ['engagement', 'project', 'hour', 'day', 'month'];
const currencies = new Set(Intl.supportedValuesOf('currency'));
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const fail = (field, message) => { throw new Error(`Pricing catalogue: ${field} ${message}`); };
const object = (value, field) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(field, 'must be an object');
};
const text = (value, field) => {
  if (typeof value !== 'string' || !value.trim()) fail(field, 'must be non-empty text');
};
const list = (value, field) => {
  if (!Array.isArray(value) || !value.length) fail(field, 'must be a non-empty array');
};
const only = (value, keys, field) => {
  for (const key of Object.keys(value)) if (!keys.includes(key)) fail(`${field}.${key}`, 'is not a supported field');
};

export function validatePrice(price, field = 'price') {
  object(price, field);
  only(price, ['model', 'currency', 'amount', 'minimum', 'maximum', 'unit', 'note'], field);
  if (!models.includes(price.model)) fail(`${field}.model`, `must be one of ${models.join(', ')}`);
  if (!units.includes(price.unit)) fail(`${field}.unit`, `must be one of ${units.join(', ')}`);
  text(price.note, `${field}.note`);
  if (price.model === 'quote') {
    for (const key of ['currency', 'amount', 'minimum', 'maximum']) if (price[key] !== null) fail(`${field}.${key}`, 'must be null for a quote');
    return price;
  }
  if (!currencies.has(price.currency)) fail(`${field}.currency`, 'must be a supported uppercase currency code');
  const digits = new Intl.NumberFormat('en', { style: 'currency', currency: price.currency }).resolvedOptions().maximumFractionDigits;
  const money = key => {
    const amount = price[key];
    const scaled = amount * 10 ** digits;
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0 || scaled > Number.MAX_SAFE_INTEGER || Number(amount.toFixed(digits)) !== amount) fail(`${field}.${key}`, `must be a non-negative amount with at most ${digits} decimal places`);
  };
  if (price.model === 'range') {
    if (price.amount !== null) fail(`${field}.amount`, 'must be null for a range');
    money('minimum');
    money('maximum');
    if (price.maximum <= price.minimum) fail(`${field}.maximum`, 'must exceed minimum');
  } else {
    money('amount');
    for (const key of ['minimum', 'maximum']) if (price[key] !== null) fail(`${field}.${key}`, 'must be null for a fixed, starting, or indicative price');
  }
  return price;
}

export function validatePricing(data) {
  object(data, 'root');
  only(data, ['$schema', 'schemaVersion', 'page', 'groups', 'commercialNotes', 'offers'], 'root');
  if (data.schemaVersion !== 1) fail('schemaVersion', 'must be 1');
  object(data.page, 'page');
  const pageKeys = ['title', 'description', 'headline', 'emphasis', 'intro'];
  only(data.page, pageKeys, 'page');
  for (const key of pageKeys) text(data.page[key], `page.${key}`);
  const groups = new Set();
  list(data.groups, 'groups');
  for (const [index, group] of data.groups.entries()) {
    const field = `groups[${index}]`;
    object(group, field);
    only(group, ['id', 'title', 'description'], field);
    if (typeof group.id !== 'string' || !slug.test(group.id) || groups.has(group.id)) fail(`${field}.id`, 'must be a unique lowercase slug');
    groups.add(group.id);
    for (const key of ['title', 'description']) text(group[key], `${field}.${key}`);
  }
  list(data.commercialNotes, 'commercialNotes');
  data.commercialNotes.forEach((note, index) => {
    const field = `commercialNotes[${index}]`;
    object(note, field);
    only(note, ['title', 'text'], field);
    for (const key of ['title', 'text']) text(note[key], `${field}.${key}`);
  });
  list(data.offers, 'offers');
  const ids = new Set();
  data.offers.forEach((offer, index) => {
    const field = `offers[${index}]`;
    object(offer, field);
    only(offer, ['id', 'group', 'title', 'summary', 'bestFor', 'outcome', 'includes', 'excludes', 'clientInputs', 'completion', 'journeyIds', 'price'], field);
    if (typeof offer.id !== 'string' || !slug.test(offer.id) || ids.has(offer.id)) fail(`${field}.id`, 'must be a unique lowercase slug');
    ids.add(offer.id);
    if (!groups.has(offer.group)) fail(`${field}.group`, 'must reference a defined group');
    for (const key of ['title', 'summary', 'bestFor', 'outcome', 'completion']) text(offer[key], `${field}.${key}`);
    for (const key of ['includes', 'excludes', 'clientInputs', 'journeyIds']) {
      list(offer[key], `${field}.${key}`);
      offer[key].forEach((value, position) => text(value, `${field}.${key}[${position}]`));
    }
    if (offer.journeyIds.some(id => !slug.test(id)) || new Set(offer.journeyIds).size !== offer.journeyIds.length) fail(`${field}.journeyIds`, 'must contain distinct journey slugs');
    validatePrice(offer.price, `${field}.price`);
  });
  for (const group of groups) if (!data.offers.some(offer => offer.group === group)) fail('groups', `contains an empty group: ${group}`);
  return data;
}

// Loading JSON through Node's module loader also makes it a dependency of --watch.
const require = createRequire(import.meta.url);
export const pricing = validatePricing(require('./pricing.json'));
export const pricingRoute = '/pricing/';
export const offerRoute = offer => `${pricingRoute}${offer.id}/`;

export function formatPrice(price) {
  validatePrice(price);
  if (price.model === 'quote') return 'Scoped after discussion';
  const digits = new Intl.NumberFormat('en', { style: 'currency', currency: price.currency }).resolvedOptions().maximumFractionDigits;
  const money = value => new Intl.NumberFormat('en', { style: 'currency', currency: price.currency, currencyDisplay: 'code', minimumFractionDigits: Number.isInteger(value) ? 0 : digits, maximumFractionDigits: digits }).format(value).replaceAll('\u00a0', ' ');
  const amount = price.model === 'range' ? `${money(price.minimum)}–${money(price.maximum)}` : `${price.model === 'from' ? 'From ' : price.model === 'indicative' ? 'Approx. ' : ''}${money(price.amount)}`;
  return `${amount} / ${price.unit}`;
}

