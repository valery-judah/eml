import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../theme.js', import.meta.url), 'utf8');

function setup({ stored = null, dark = false, blocked = false, readyState = 'loading' } = {}) {
  const windowEvents = new Map();
  const documentEvents = new Map();
  const selectEvents = new Map();
  const root = { dataset: {} };
  const meta = { content: '', setAttribute(name, value) { this[name] = value; } };
  const select = { value: 'system', addEventListener(name, fn) { selectEvents.set(name, fn); } };
  const control = { hidden: true };
  const system = { matches: dark, addEventListener(name, fn) { this.change = fn; } };
  let saved = stored;
  const localStorage = {
    getItem() { if (blocked) throw new Error('Storage blocked'); return saved; },
    setItem(key, value) { if (blocked) throw new Error('Storage blocked'); saved = value; },
    removeItem() { if (blocked) throw new Error('Storage blocked'); saved = null; }
  };
  const document = {
    documentElement: root,
    readyState,
    querySelector: () => meta,
    querySelectorAll: selector => readyState === 'loading' ? [] : selector === '[data-theme-select]' ? [select] : [control],
    addEventListener: (name, fn) => documentEvents.set(name, fn)
  };
  const window = {
    localStorage,
    matchMedia: () => system,
    addEventListener: (name, fn) => windowEvents.set(name, fn)
  };
  vm.runInNewContext(source, {
    document, window,
    getComputedStyle: () => ({ getPropertyValue: () => root.dataset.theme === 'dark' ? '#171c18' : '#f6f4ee' })
  });
  return {
    root, meta, select, control,
    get saved() { return saved; },
    ready() { readyState = 'complete'; documentEvents.get('DOMContentLoaded')?.(); },
    choose(value) { select.value = value; selectEvents.get('change')(); },
    systemChange(dark) { system.matches = dark; system.change(); },
    storage(value, key = 'eml-color-theme') { saved = value; windowEvents.get('storage')({ key, newValue: value }); },
    restore(value) { saved = value; windowEvents.get('pageshow')(); }
  };
}

test('device appearance is selected before controls exist and stays live in Auto mode', () => {
  const page = setup({ dark: true });
  assert.equal(page.root.dataset.theme, 'dark', 'the body must not paint in the wrong theme first');
  assert.equal(page.meta.content, '#171c18');
  assert.equal(page.control.hidden, true);
  page.ready();
  assert.equal(page.control.hidden, false);
  assert.equal(page.select.value, 'system');
  page.systemChange(false);
  assert.equal(page.root.dataset.theme, 'light');
  assert.equal(page.meta.content, '#f6f4ee');
});

test('explicit choice persists across loads and Auto resumes device appearance', () => {
  const page = setup({ dark: true });
  page.ready();
  page.choose('light');
  assert.equal(page.saved, 'light');
  assert.equal(page.root.dataset.theme, 'light');
  page.systemChange(true);
  assert.equal(page.root.dataset.theme, 'light', 'device changes must not override a saved choice');
  const nextPage = setup({ stored: page.saved, dark: true });
  assert.equal(nextPage.root.dataset.theme, 'light');
  nextPage.ready();
  assert.equal(nextPage.select.value, 'light');
  nextPage.choose('system');
  assert.equal(nextPage.saved, null);
  assert.equal(nextPage.root.dataset.theme, 'dark');
});

test('cross-tab changes, storage clearing, and restored pages update the theme and selector', () => {
  const page = setup({ stored: 'light' });
  page.ready();
  page.storage('dark');
  assert.equal(page.root.dataset.theme, 'dark');
  assert.equal(page.select.value, 'dark');
  page.storage('light', 'unrelated-setting');
  assert.equal(page.root.dataset.theme, 'dark');
  page.storage(null, null);
  assert.equal(page.root.dataset.theme, 'light');
  assert.equal(page.select.value, 'system');
  page.restore('dark');
  assert.equal(page.root.dataset.theme, 'dark');
  assert.equal(page.select.value, 'dark');
});

test('blocked storage and invalid stored values preserve a usable theme control', () => {
  const invalid = setup({ stored: 'unexpected-value', dark: true, readyState: 'complete' });
  assert.equal(invalid.root.dataset.theme, 'dark');
  assert.equal(invalid.select.value, 'system');
  assert.equal(invalid.control.hidden, false);
  const page = setup({ blocked: true });
  page.ready();
  page.choose('dark');
  assert.equal(page.root.dataset.theme, 'dark');
  page.restore(null);
  assert.equal(page.root.dataset.theme, 'dark', 'a failed storage read must not discard an in-page choice');
  page.choose('system');
  assert.equal(page.root.dataset.theme, 'light');
});

test('dark palette keeps text and interactive foreground/background pairs readable', async () => {
  const css = await readFile(new URL('../theme.css', import.meta.url), 'utf8');
  const dark = css.match(/:root\[data-theme="dark"\]\s*\{([^}]+)\}/)[1];
  const colors = Object.fromEntries([...dark.matchAll(/(--[\w-]+):\s*(#[\da-f]{6});/g)].map(([, name, value]) => [name, value]));
  function luminance(color) {
    assert.ok(color, 'contrast checks require explicit dark theme colors');
    const channels = [1, 3, 5].map(offset => parseInt(color.slice(offset, offset + 2), 16) / 255)
      .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return channels.reduce((sum, channel, index) => sum + channel * [.2126, .7152, .0722][index], 0);
  }
  const pairs = [
    ['text', 'bg'], ['text-secondary', 'surface-emphasis'], ['text-muted', 'surface-emphasis'],
    ['text-soft', 'field-bg'], ['text-reading', 'bg'], ['accent', 'surface-emphasis'],
    ['on-accent', 'accent'], ['on-accent', 'accent-hover'], ['on-selected', 'selected-bg'],
    ['feature-soft', 'feature-bg'], ['feature-secondary', 'feature-hover'], ['code-text', 'code-bg']
  ];
  for (const [foreground, background] of pairs) {
    const [low, high] = [luminance(colors[`--color-${foreground}`]), luminance(colors[`--color-${background}`])].sort((a, b) => a - b);
    const contrast = (high + .05) / (low + .05);
    assert.ok(contrast >= 4.5, `${foreground} on ${background}: ${contrast.toFixed(2)}:1 is below 4.5:1`);
  }
});
