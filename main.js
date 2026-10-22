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
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

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

const dialog = document.querySelector('#enquiry-dialog');
const interest = document.querySelector('#enquiry-interest');
const status = document.querySelector('#enquiry-status');

function openEnquiry(topic) {
  if (!dialog) return;
  if (status) status.textContent = '';
  if (topic && interest) interest.value = topic;
  dialog.showModal();
  document.body.classList.add('dialog-open');
}

document.querySelectorAll('[data-open-enquiry], [data-enquiry]').forEach(button => {
  button.addEventListener('click', event => {
    if (!dialog) return;
    event.preventDefault();
    openEnquiry(button.dataset.enquiry);
  });
});

document.querySelector('[data-close-enquiry]')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('close', () => document.body.classList.remove('dialog-open'));
dialog?.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});

document.querySelector('#enquiry-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = `EML Systems enquiry — ${data.get('interest')}`;
  const body = `Hi EML Systems,\n\n${data.get('message')}\n\nInterested in: ${data.get('interest')}\n\n${data.get('name')}\n${data.get('email')}`;
  const href = `mailto:hello@eml.systems?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
  status.replaceChildren(document.createTextNode('Your email draft is ready. If your email app didn’t open, '));
  const fallback = document.createElement('a');
  fallback.href = href;
  fallback.textContent = 'open the draft here';
  status.append(fallback, document.createTextNode(' or email hello@eml.systems directly.'));
});

document.querySelectorAll('[data-year]').forEach(item => { item.textContent = new Date().getFullYear(); });

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      nav?.querySelectorAll('a').forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
