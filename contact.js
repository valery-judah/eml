export const contactTopics = [
  { id: 'direction', title: 'Find the right direction', description: 'An AI opportunity, a product decision, or a second opinion.', email: 'hello@eml.systems' },
  { id: 'architecture', title: 'Design the system', description: 'Architecture, integrations, data, and the path to production.', email: 'architecture@eml.systems' },
  { id: 'engineering', title: 'Build or improve it', description: 'Implementation, evaluation, or a system that needs to work better.', email: 'engineering@eml.systems' }
];

export function createEnquiry(values) {
  const topic = contactTopics.find(item => item.id === values.topic) || contactTopics[0];
  const clean = (value, length) => String(value || '').trim().slice(0, length);
  const context = clean(values.context, 240).replace(/[\r\n]+/g, ' ');
  const subject = `EML Systems — ${context || topic.title}`;
  const body = [
    'Hi EML Systems,', '', clean(values.message, 3000), '',
    `Starting point: ${topic.title}`,
    ...(context ? [`About: ${context}`] : []),
    ...(clean(values.company, 160) ? [`Company / website: ${clean(values.company, 160)}`] : []),
    ...(clean(values.timing, 80) ? [`Timing: ${clean(values.timing, 80)}`] : []),
    '', clean(values.name, 120), clean(values.email, 254)
  ].join('\n');
  return {
    email: topic.email, subject, body,
    text: `To: ${topic.email}\nSubject: ${subject}\n\n${body}`,
    href: `mailto:${topic.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  };
}

export function setupContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const context = document.querySelector('[data-contact-context]');
  const params = new URLSearchParams(window.location.search);
  const topic = contactTopics.find(item => item.id === params.get('route'));
  if (topic) form.elements.topic.value = topic.id;
  const source = (params.get('topic') || '').trim().slice(0, 240).replace(/[\r\n]+/g, ' ');
  if (source) {
    context.hidden = false;
    context.querySelector('span').textContent = source;
  }
  const draft = document.querySelector('[data-contact-draft]');
  const recipient = document.querySelector('[data-contact-recipient]');
  const copy = document.querySelector('[data-contact-copy]');
  const status = document.querySelector('[data-contact-status]');
  const preview = document.querySelector('[data-contact-preview]');
  let prepared;

  function update() {
    const selected = contactTopics.find(item => item.id === form.elements.topic.value) || contactTopics[0];
    recipient.textContent = selected.email;
    draft.hidden = true;
    prepared = null;
    status.textContent = '';
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    prepared = createEnquiry({ ...Object.fromEntries(new FormData(form)), context: source });
    draft.querySelector('[data-contact-open]').href = prepared.href;
    preview.value = prepared.text;
    draft.hidden = false;
    draft.querySelector('h3').focus();
  });
  copy.addEventListener('click', async () => {
    if (!prepared) return;
    try {
      await navigator.clipboard.writeText(prepared.text);
      status.textContent = 'Email copied. Paste it into your email service, then review and send it.';
    } catch {
      preview.focus();
      preview.select();
      status.textContent = 'Select and copy the email below, then paste it into your email service.';
    }
  });
  update();
  form.hidden = false;
}

if (typeof document !== 'undefined') setupContactForm();
