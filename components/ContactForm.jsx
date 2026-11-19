'use client';

import { useRef, useState } from 'react';
import Arrow from './Arrow';
import { site } from '@/content/site';

import { CONTACT_TYPES as TYPES, normalizeContact, validateContact } from '@/lib/contact-validation';

export default function ContactForm() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [firstName, setFirstName] = useState('');
  const sending = useRef(false); // blocks a second submit before the button re-renders as disabled
  const submissionId = useRef(null);

  function fieldProps(name) {
    const bad = Boolean(fieldErrors[name]);
    return { 'aria-invalid': bad || undefined, 'aria-describedby': bad ? `f-${name}-err` : undefined };
  }
  const fieldError = (name) => (fieldErrors[name] ? <p className="err" id={`f-${name}-err`}>{fieldErrors[name]}</p> : null);

  async function onSubmit(e) {
    e.preventDefault();
    if (sending.current) return;
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const data = normalizeContact(raw);
    const errs = validateContact(data);
    setFieldErrors(errs);
    if (Object.keys(errs).length) {
      setStatus('error');
      setError('Please check the highlighted fields.');
      form.querySelector(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    submissionId.current ||= crypto.randomUUID();
    data.submissionId = submissionId.current;
    data.company = raw.company;
    sending.current = true;
    setStatus('sending');
    setError('');
    try {
      let res;
      try {
        res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch {
        throw new Error('We couldn’t reach our server. Check your connection and try again.');
      }
      const json = await res.json().catch(() => ({}));
      if (json.fieldErrors) setFieldErrors(json.fieldErrors);
      if (!res.ok || json.ok !== true) throw new Error(json.error || 'We couldn’t send your enquiry just now. Please try again in a few minutes.');
      submissionId.current = null;
      setFirstName(data.name.split(' ')[0]);
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(`${err.message} You can also email us at ${site.email}.`);
    } finally {
      sending.current = false;
    }
  }

  if (status === 'sent') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} role="status">
        <p className="h2">Thank you, {firstName}.</p>
        <p className="body">Your enquiry has been sent. We’ll reply by email to arrange a first conversation.</p>
        <button className="go" type="button" onClick={() => setStatus('idle')} style={{ alignSelf: 'flex-start' }}>
          Send another enquiry <Arrow />
        </button>
      </div>
    );
  }

  return (
    <form id="enquiry" noValidate onSubmit={onSubmit} aria-busy={status === 'sending'}>
      <p className="note">All fields are required unless marked optional.</p>
      <div className="two">
        <div className="field"><label htmlFor="f-name">Name</label><input id="f-name" name="name" autoComplete="name" required maxLength={120} {...fieldProps('name')} />{fieldError('name')}</div>
        <div className="field"><label htmlFor="f-email">Email</label><input id="f-email" name="email" type="email" autoComplete="email" required maxLength={200} {...fieldProps('email')} />{fieldError('email')}</div>
      </div>
      <div className="two">
        <div className="field"><label htmlFor="f-phone">Phone number</label><input id="f-phone" name="phone" type="tel" autoComplete="tel" required maxLength={40} {...fieldProps('phone')} />{fieldError('phone')}</div>
        <div className="field">
          <label htmlFor="f-type">Property</label>
          <select id="f-type" name="type" defaultValue={TYPES[0]} required {...fieldProps('type')}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>{fieldError('type')}
        </div>
      </div>
      <div className="field"><label htmlFor="f-msg">What&rsquo;s on your mind</label><textarea id="f-msg" name="message" rows={4} required maxLength={4000} {...fieldProps('message')} />{fieldError('message')}</div>
      {/* Spam trap: hidden from people, bots tend to fill it in. */}
      <div className="hp" aria-hidden="true"><label htmlFor="f-company">Company</label><input id="f-company" name="company" tabIndex={-1} autoComplete="off" /></div>
      <div role="alert">{status === 'error' ? <p className="err">{error}</p> : null}</div>
      <button className="btn" type="submit" disabled={status === 'sending'} style={{ alignSelf: 'flex-start' }}>
        {status === 'sending' ? 'Sending…' : 'BOOK AN INITIAL CONSULTATION'} <Arrow />
      </button>
    </form>
  );
}
