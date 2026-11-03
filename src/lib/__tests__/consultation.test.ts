import { describe, expect, it } from 'vitest';
import { consultationEmail } from '../consultation';

describe('static consultation email', () => {
  it('encodes the request for an explicit mail-client handoff', () => {
    const data = new FormData();
    data.set('first-name', 'Alex & Sam');
    data.set('last-name', 'Buyer');
    data.set('loan-type', 'Purchase a home');
    data.set('phone', '(786) 555-0100');
    data.set('email', 'alex@example.com');
    const url = new URL(consultationEmail(data));
    expect(url.protocol).toBe('mailto:');
    expect(url.pathname).toBe('info@mortgagecamp.pro');
    expect(url.searchParams.get('body')).toContain('Name: Alex & Sam Buyer');
    expect(url.searchParams.get('body')).toContain('Goal: Purchase a home');
    expect(url.searchParams.get('body')).toContain('Email: alex@example.com');
  });
});
