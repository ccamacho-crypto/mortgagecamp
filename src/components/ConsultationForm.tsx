import { CONSULTATION_EMAIL, CONSULTATION_ENDPOINT, CONSULTATION_SUBJECT } from '@/lib/consultation';

// Native POST keeps provider CAPTCHA and validation intact. FormSubmit owns the
// result page; this component never claims that a request reached the inbox.
export default function ConsultationForm() {
  return (
    <form
      action={CONSULTATION_ENDPOINT}
      method="POST"
      aria-label="Free mortgage consultation"
      aria-describedby="consultation-privacy"
      className="flex flex-col gap-4"
    >
      {/* Explicit source URL lets FormSubmit validate this form while the site's
          same-origin referrer policy keeps cross-site Referer headers private. */}
      <input type="hidden" name="_url" value="https://mortgagecamp.pro/" />
      <input type="hidden" name="_subject" value={CONSULTATION_SUBJECT} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="true" />
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: 'none' }} />
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
      <button type="submit" className="w-full py-3 rounded-xl font-bold text-base bg-gold-metallic hover:-translate-y-0.5 transition-all duration-200 mt-1">
        Schedule My Free Call →
      </button>
      <p id="consultation-privacy" className="text-xs text-muted-foreground text-center">
        By submitting, you ask Mortgage Camp to contact you about your inquiry. FormSubmit processes these details and emails them to our team. You may be asked to complete a spam check. Do not include Social Security numbers, account details, or financial documents.
      </p>
      <p className="text-xs text-muted-foreground text-center">
        Prefer email or having trouble?{' '}
        <a className="text-primary underline" href={`mailto:${CONSULTATION_EMAIL}?subject=${encodeURIComponent(CONSULTATION_SUBJECT)}`}>{CONSULTATION_EMAIL}</a>
        {' '}or call <a className="underline" href="tel:+17863974552">(786) 397-4552</a>. A consultation time is not booked until confirmed by our team.
      </p>
    </form>
  );
}
