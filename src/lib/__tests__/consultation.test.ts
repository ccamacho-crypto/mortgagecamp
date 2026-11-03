import { describe, expect, it } from 'vitest';
import { CONSULTATION_EMAIL, CONSULTATION_ENDPOINT, CONSULTATION_SUBJECT, isConsultationConfigured } from '../consultation';

describe('consultation delivery routing', () => {
  it('posts over HTTPS to Web3Forms without credentials in the URL', () => {
    const url = new URL(CONSULTATION_ENDPOINT);
    expect(CONSULTATION_EMAIL).toBe('ceo@mortgagecamp.net');
    expect(url.protocol).toBe('https:');
    expect(url.hostname).toBe('api.web3forms.com');
    expect(url.pathname).toBe('/submit');
    expect(url.username).toBe('');
    expect(url.password).toBe('');
    expect(url.search).toBe('');
    expect(CONSULTATION_SUBJECT).toContain('Mortgage Camp');
  });

  it('rejects missing and placeholder routing keys', () => {
    expect(isConsultationConfigured('')).toBe(false);
    expect(isConsultationConfigured('YOUR_ACCESS_KEY_HERE')).toBe(false);
    expect(isConsultationConfigured('00000000-0000-4000-8000-000000000001')).toBe(true);
  });
});
