import { useEffect, useRef, useState, type FormEvent } from 'react';
import ConsultationCaptcha from './ConsultationCaptcha';
import { CONSULTATION_ACCESS_KEY, CONSULTATION_EMAIL, CONSULTATION_ENDPOINT, CONSULTATION_SUBJECT, CONSULTATION_TIMEOUT_MS, isConsultationConfigured } from '@/lib/consultation';

export default function ConsultationForm({ accessKey = CONSULTATION_ACCESS_KEY }: { accessKey?: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaReset, setCaptchaReset] = useState(0);
  const pending = useRef(false);
  const activeRequest = useRef<AbortController | null>(null);
  useEffect(() => () => activeRequest.current?.abort(), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (!isConsultationConfigured(accessKey)) {
      setError('Online requests are temporarily unavailable. Please email or call us using the details below.');
      setStatus('error');
      return;
    }
    const data = new FormData(form);
    if (data.get('botcheck')) {
      setError('We could not submit this request. Please email or call us.');
      setStatus('error');
      return;
    }
    if (!captchaToken) {
      setError('Please complete the spam-protection check before sending your request.');
      setStatus('error');
      return;
    }
    data.set('h-captcha-response', captchaToken);
    pending.current = true;
    setStatus('sending');
    setError('');
    const controller = new AbortController();
    activeRequest.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), CONSULTATION_TIMEOUT_MS);
    try {
      const response = await fetch(CONSULTATION_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(data)),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || result?.success !== true) throw new Error('Request not accepted');
      setStatus('success');
      form.reset();
    } catch {
      setError(controller.signal.aborted
        ? 'The request timed out. We cannot confirm whether it was accepted. Your details are still here; please email or call before retrying to avoid a duplicate.'
        : 'We could not confirm your request was sent. Your details are still here. Please try again, or email or call us below.');
      setStatus('error');
    } finally {
      window.clearTimeout(timeout);
      activeRequest.current = null;
      pending.current = false;
      setCaptchaToken('');
      setCaptchaReset(count => count + 1);
    }
  }

  return (
    <form
      action={CONSULTATION_ENDPOINT}
      method="POST"
      onSubmit={submit}
      aria-busy={status === 'sending'}
      aria-label="Free mortgage consultation"
      aria-describedby="consultation-privacy"
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="access_key" value={accessKey} />
      <input type="hidden" name="subject" value={CONSULTATION_SUBJECT} />
      <input type="hidden" name="from_name" value="Mortgage Camp website" />
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: 'none' }} />
      <noscript>Online requests require JavaScript. Please email ceo@mortgagecamp.net or call (786) 397-4552.</noscript>
      <fieldset disabled={status === 'sending'} className="flex flex-col gap-4 min-w-0">
      <div>
        <label htmlFor="loan-type" className="block text-xs font-semibold text-muted-foreground mb-1.5">
          I'm looking to…
        </label>
        <select id="loan-type" name="loan-type" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
          <option>Purchase a home</option>
          <option>Refinance my mortgage</option>
          <option>Access my home equity</option>
          <option>Invest in property</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="first-name" className="block text-xs font-semibold text-muted-foreground mb-1.5">First Name</label>
          <input id="first-name" name="first-name" autoComplete="given-name" required maxLength={80} type="text" placeholder="John" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="last-name" className="block text-xs font-semibold text-muted-foreground mb-1.5">Last Name</label>
          <input id="last-name" name="last-name" autoComplete="family-name" required maxLength={80} type="text" placeholder="Smith" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="block text-xs font-semibold text-muted-foreground mb-1.5">Phone Number</label>
        <input id="phone" name="phone" autoComplete="tel" required maxLength={30} type="tel" placeholder="(305) 000-0000" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div>
        <label htmlFor="email" className="block text-xs font-semibold text-muted-foreground mb-1.5">Email Address</label>
        <input id="email" name="email" autoComplete="email" required maxLength={254} type="email" placeholder="john@email.com" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <ConsultationCaptcha
        onVerify={setCaptchaToken}
        onError={() => { setError('The spam-protection check could not load. Please reload, or email or call us below.'); setStatus('error'); }}
        resetCount={captchaReset}
      />
      <button type="submit" disabled={status === 'sending'} className="w-full py-3 rounded-xl font-bold text-base bg-gold-metallic hover:-translate-y-0.5 transition-all duration-200 mt-1 disabled:opacity-60 disabled:cursor-wait">
        {status === 'sending' ? 'Sending…' : 'Schedule My Free Call →'}
      </button>
      </fieldset>
      <div role="status" aria-live="polite" aria-atomic="true" className="text-sm text-center">
        {status === 'sending' && 'Sending your request…'}
        {status === 'success' && 'Request sent successfully. Our form service accepted your inquiry for delivery to Mortgage Camp. Our team will contact you to confirm a consultation time.'}
      </div>
      {status === 'error' && <p role="alert" className="text-sm text-center text-destructive">{error}</p>}
      <p id="consultation-privacy" className="text-xs text-muted-foreground text-center">
        By submitting, you ask Mortgage Camp to contact you about your inquiry. Web3Forms processes and stores these details to deliver your request to our team; hCaptcha checks for spam. Do not include Social Security numbers, account details, or financial documents. See the <a href="https://web3forms.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">form service privacy policy</a> and <a href="https://www.hcaptcha.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">hCaptcha privacy policy</a>.
      </p>
      <p className="text-xs text-muted-foreground text-center">
        Prefer email or having trouble?{' '}
        <a className="text-primary underline" href={`mailto:${CONSULTATION_EMAIL}?subject=${encodeURIComponent(CONSULTATION_SUBJECT)}`}>{CONSULTATION_EMAIL}</a>
        {' '}or call <a className="underline" href="tel:+17863974552">(786) 397-4552</a>. A consultation time is not booked until confirmed by our team.
      </p>
    </form>
  );
}
