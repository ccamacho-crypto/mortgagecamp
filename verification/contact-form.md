# Mortgage Camp contact-form connection

Requested recipient: **ceo@mortgagecamp.net**.

## Implementation
- Native HTTPS POST to `https://formsubmit.co/ceo@mortgagecamp.net`, replacing the previous draft-only handler.
- Basic callback fields only: first name, last name, phone, email and loan purpose. Visitor email is the documented Reply-To field.
- CAPTCHA remains enabled; empty hidden honeypot, no CC/webhook/autoresponse, no financial-document uploads, no SMTP credentials.
- Disclosure names FormSubmit and warns against sensitive financial information. The site does not claim inbox receipt or a booked appointment.
- Direct email and phone fallback remain available; footer uses the requested recipient.

## Mailbox-owner activation — required before relying on delivery
1. Open https://mortgagecamp.pro/ and submit one test inquiry using your own contact details. Complete the provider spam check if shown.
2. Check **ceo@mortgagecamp.net**, including spam/junk, for FormSubmit's activation email. Click its confirmation link. Do not share the private activation link publicly.
3. Submit a second test inquiry after activation and confirm receipt, all five fields, and Reply-To.

The first submission triggers activation according to the provider. Wiring, HTTP acceptance, or a thank-you page alone do not prove mailbox delivery. No inbox receipt is claimed here. The site is a callback form, not a secure mortgage application or document portal. FormSubmit documents retaining submissions for 30 days.

Sources: https://formsubmit.co/ and https://formsubmit.co/documentation

## Local verification
- TypeScript: passed.
- Vitest: **142 tests passed in 16 suites** (the same three omitted Airo-editor-only suites remain excluded).
- Pages build: passed; pre-existing large-chunk warning remains.
- Browser verification and deployment evidence will be appended after publication.

## Changed source and checks
`src/components/ConsultationForm.tsx`, `src/components/ConsultationForm.test.tsx`, `src/lib/consultation.ts`, `src/lib/__tests__/consultation.test.ts`, `src/pages/index.tsx`, `src/layouts/parts/Footer.tsx`, `scripts/browser-check.mjs`.
