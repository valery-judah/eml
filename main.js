const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');

function closeMenu() {
  menu?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('is-open');
}

menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav?.classList.toggle('is-open', open);
});

nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 1001px)').addEventListener('change', closeMenu);

document.querySelectorAll('.process-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const shouldOpen = trigger.getAttribute('aria-expanded') !== 'true';
    document.querySelectorAll('.process-trigger').forEach(item => {
      const active = item === trigger && shouldOpen;
      item.setAttribute('aria-expanded', String(active));
      item.querySelector('.process-toggle').textContent = active ? '−' : '+';
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
    });
  });
});

document.querySelectorAll('[data-year]').forEach(item => { item.textContent = new Date().getFullYear(); });

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      nav?.querySelectorAll('a').forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        if (active) link.setAttribute('aria-current', 'location');
        else if (link.getAttribute('aria-current') !== 'page') link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}

const library = document.querySelector('[data-library]');
if (library) {
  const cards = [...library.querySelectorAll('[data-publication]')];
  const filters = [...library.querySelectorAll('[data-filter]')];
  const search = library.querySelector('#library-query');
  const clear = library.querySelector('[data-clear-search]');
  const count = library.querySelector('[data-result-count]');
  const empty = library.querySelector('[data-empty-state]');
  const noun = library.dataset.noun || 'article';
  let selected = 'all';

  function applyFilters(updateUrl = true) {
    const query = search.value.trim().toLocaleLowerCase();
    const terms = query.split(/\s+/).filter(Boolean);
    let visible = 0;
    cards.forEach(card => {
      const matches = (selected === 'all' || card.dataset.category === selected) && terms.every(term => card.dataset.search.toLocaleLowerCase().includes(term));
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === selected)));
    count.textContent = `${visible === cards.length ? visible : `${visible} of ${cards.length}`} ${visible === 1 && cards.length === 1 ? noun : `${noun}s`}`;
    empty.hidden = visible !== 0;
    clear.hidden = search.value.length === 0;
    if (updateUrl) {
      const url = new URL(window.location.href);
      if (query) url.searchParams.set('q', search.value.trim());
      else url.searchParams.delete('q');
      if (selected !== 'all') url.searchParams.set('topic', selected);
      else url.searchParams.delete('topic');
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    }
  }

  function loadFilters() {
    const params = new URLSearchParams(window.location.search);
    search.value = (params.get('q') || '').slice(0, 200);
    selected = filters.some(button => button.dataset.filter === params.get('topic')) ? params.get('topic') : 'all';
    applyFilters(false);
  }

  filters.forEach(button => button.addEventListener('click', () => { selected = button.dataset.filter; applyFilters(); }));
  search.addEventListener('input', () => applyFilters());
  library.querySelector('.library-search').addEventListener('submit', event => { event.preventDefault(); applyFilters(); });
  clear.addEventListener('click', () => { search.value = ''; applyFilters(); search.focus(); });
  library.querySelector('[data-reset-filters]').addEventListener('click', () => { selected = 'all'; search.value = ''; applyFilters(); search.focus(); });
  window.addEventListener('popstate', loadFilters);
  loadFilters();
}

const printArticle = document.querySelector('[data-print-article]');
if (printArticle) {
  printArticle.hidden = false;
  printArticle.addEventListener('click', () => window.print());
}

document.querySelectorAll('[data-copy-record]').forEach(button => {
  const record = document.getElementById(button.dataset.copyRecord);
  const announcement = button.closest('.working-record')?.querySelector('[role="status"]');
  if (!record || !announcement || !navigator.clipboard?.writeText) return;
  button.hidden = false;
  button.addEventListener('click', async () => {
    button.disabled = true;
    try {
      await navigator.clipboard.writeText(record.textContent);
      announcement.textContent = 'Working record copied. Paste it into your project.';
    } catch {
      announcement.textContent = 'Copy was unavailable. Select and copy the record below.';
    } finally {
      button.disabled = false;
    }
  });
});

let recordsOpenedForPrint = null;
window.addEventListener('beforeprint', () => {
  if (recordsOpenedForPrint) return;
  recordsOpenedForPrint = [...document.querySelectorAll('.working-record:not([open])')];
  recordsOpenedForPrint.forEach(record => { record.open = true; });
});
window.addEventListener('afterprint', () => {
  recordsOpenedForPrint?.forEach(record => { record.open = false; });
  recordsOpenedForPrint = null;
});
