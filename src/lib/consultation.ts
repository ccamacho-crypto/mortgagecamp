// Public form routing, not a secret. The mailbox owner must activate FormSubmit
// before delivery; no SMTP credentials or private API keys belong in this app.
export const CONSULTATION_EMAIL = 'ceo@mortgagecamp.net';
export const CONSULTATION_ENDPOINT = `https://formsubmit.co/${CONSULTATION_EMAIL}`;
export const CONSULTATION_SUBJECT = 'Mortgage Camp — free consultation request';
