import test from 'node:test';
import assert from 'node:assert/strict';
import { createEnquiry } from '../contact.js';

test('an architecture enquiry preserves a prospect’s text in a correctly addressed email draft', () => {
  const message = 'We need retrieval & evaluation.\nCan we review “quality” before launch?\n<example> + 20%';
  const enquiry = createEnquiry({
    topic: 'architecture', name: 'Alex García', email: 'alex+ai@example.com',
    company: 'Example & Co', timing: 'In the next 1–3 months',
    context: 'AI product assessment: scope and fee', message
  });
  const url = new URL(enquiry.href);
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, 'architecture@eml.systems');
  assert.equal(url.searchParams.get('subject'), 'EML Systems — AI product assessment: scope and fee');
  assert.equal(url.searchParams.get('body'), enquiry.body);
  for (const value of [message, 'Alex García', 'alex+ai@example.com', 'Example & Co', 'In the next 1–3 months']) assert.ok(enquiry.body.includes(value));
  assert.ok(enquiry.text.includes(`Subject: ${enquiry.subject}`), 'the copy fallback must retain the subject');
  assert.ok(enquiry.text.includes(enquiry.body), 'the copy fallback must retain the full message');
});

test('unknown routes cannot address arbitrary recipients and URL context cannot add mail headers', () => {
  const enquiry = createEnquiry({ topic: 'stranger@example.com', context: 'A project\r\nBcc: stranger@example.com', message: 'Hello' });
  assert.equal(new URL(enquiry.href).pathname, 'hello@eml.systems');
  assert.ok(!/[\r\n]/.test(enquiry.subject));
  assert.equal(new URL(enquiry.href).searchParams.get('bcc'), null);
  assert.equal(createEnquiry({ topic: 'engineering' }).email, 'engineering@eml.systems');
  assert.ok(!enquiry.body.includes('Company / website:'), 'optional context should remain optional');
});
