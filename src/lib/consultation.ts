// Web3Forms form keys are designed for public browser use, not private API tokens.
// This form's sole recipient was verified in the provider dashboard before deploy.
export const CONSULTATION_EMAIL = 'ceo@mortgagecamp.net';
export const CONSULTATION_ENDPOINT = 'https://api.web3forms.com/submit';
export const CONSULTATION_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() || '43315625-8689-4c28-8eef-0cee8755ab0a';
export const CONSULTATION_SUBJECT = 'Mortgage Camp — free consultation request';
export const CONSULTATION_TIMEOUT_MS = 15_000;

export function isConsultationConfigured(key: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key);
}
