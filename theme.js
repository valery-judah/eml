// A classic head script: the preference is applied before body content paints.
(() => {
  const root = document.documentElement;
  const storageKey = 'eml-color-theme';
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const normalize = value => value === 'light' || value === 'dark' ? value : 'system';
  let preference = 'system';

  function readPreference() {
    try { return normalize(window.localStorage.getItem(storageKey)); }
    catch { return preference; }
  }

  function applyTheme() {
    root.dataset.theme = preference === 'system' ? (system.matches ? 'dark' : 'light') : preference;
    document.querySelectorAll('[data-theme-select]').forEach(select => { select.value = preference; });
    const background = getComputedStyle(root).getPropertyValue('--color-bg').trim();
    if (background) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', background);
  }

  function chooseTheme(value) {
    preference = normalize(value);
    try {
      if (preference === 'system') window.localStorage.removeItem(storageKey);
      else window.localStorage.setItem(storageKey, preference);
    } catch { /* The selected theme still works when storage is unavailable. */ }
    applyTheme();
  }

  preference = readPreference();
  applyTheme();

  function initializeControls() {
    document.querySelectorAll('[data-theme-select]').forEach(select => {
      select.value = preference;
      select.addEventListener('change', () => chooseTheme(select.value));
    });
    document.querySelectorAll('[data-theme-control]').forEach(control => { control.hidden = false; });
    applyTheme();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeControls, { once: true });
  else initializeControls();

  system.addEventListener('change', () => { if (preference === 'system') applyTheme(); });
  window.addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return;
    preference = normalize(event.newValue);
    applyTheme();
  });
  window.addEventListener('pageshow', () => {
    preference = readPreference();
    applyTheme();
  });
})();
