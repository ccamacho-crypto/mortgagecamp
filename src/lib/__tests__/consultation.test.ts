import { describe, expect, it } from 'vitest';
import { CONSULTATION_EMAIL, CONSULTATION_ENDPOINT, CONSULTATION_SUBJECT } from '../consultation';

describe('consultation delivery routing', () => {
  it('posts over HTTPS to the requested recipient without credentials', () => {
    const url = new URL(CONSULTATION_ENDPOINT);
    expect(CONSULTATION_EMAIL).toBe('ceo@mortgagecamp.net');
    expect(url.protocol).toBe('https:');
    expect(url.hostname).toBe('formsubmit.co');
    expect(url.pathname).toBe('/ceo@mortgagecamp.net');
    expect(url.username).toBe('');
    expect(url.password).toBe('');
    expect(url.search).toBe('');
    expect(CONSULTATION_SUBJECT).toContain('Mortgage Camp');
  });
});
