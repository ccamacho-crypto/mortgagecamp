import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ConsultationForm from './ConsultationForm';

afterEach(cleanup);

describe('consultation form', () => {
  it('uses a native POST to the requested email service, with spam protection', () => {
    render(<ConsultationForm />);
    const form = screen.getByRole('form', { name: 'Free mortgage consultation' }) as HTMLFormElement;
    expect(form).toHaveAttribute('action', 'https://formsubmit.co/ceo@mortgagecamp.net');
    expect(form).toHaveAttribute('method', 'POST');
    const data = new FormData(form);
    expect(data.get('_captcha')).toBe('true');
    expect(data.get('_honey')).toBe('');
    expect(data.get('_template')).toBe('table');
    expect(data.get('_subject')).toContain('Mortgage Camp');
    expect(data.get('_cc')).toBeNull();
    expect(data.get('_next')).toBeNull();
    expect(data.get('loan-type')).toBe('Purchase a home');
  });

  it('validates required contact fields and sends the visitor email as reply-to', () => {
    render(<ConsultationForm />);
    const form = screen.getByRole('form') as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    for (const [label, value] of [
      ['First Name', 'Alex'], ['Last Name', 'Buyer'],
      ['Phone Number', '(786) 555-0100'], ['Email Address', 'alex@example.com'],
    ]) {
      const input = screen.getByLabelText(label) as HTMLInputElement;
      expect(input).toBeRequired();
      input.value = value;
    }
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).get('email')).toBe('alex@example.com');
    (screen.getByLabelText('Email Address') as HTMLInputElement).value = 'invalid';
    expect(form.checkValidity()).toBe(false);
  });

  it('discloses the processor, warns against sensitive data, and provides a fallback', () => {
    render(<ConsultationForm />);
    expect(screen.getByText(/FormSubmit processes these details/)).toHaveTextContent(/Do not include Social Security numbers/);
    expect(screen.getByRole('link', { name: 'ceo@mortgagecamp.net' })).toHaveAttribute('href', expect.stringContaining('mailto:ceo@mortgagecamp.net?'));
    expect(screen.getByText(/A consultation time is not booked until confirmed/)).toBeInTheDocument();
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByRole('form').querySelector('input[type="file"]')).toBeNull();
  });
});
