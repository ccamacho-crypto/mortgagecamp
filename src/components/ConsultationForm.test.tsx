import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ConsultationForm from './ConsultationForm';
import { CONSULTATION_ENDPOINT, CONSULTATION_TIMEOUT_MS } from '@/lib/consultation';

const testKey = '00000000-0000-4000-8000-000000000001'; // Synthetic, never sent to provider.
vi.mock('./ConsultationCaptcha', () => ({ default: ({ onVerify }: { onVerify: (token: string) => void }) =>
  <button type="button" onClick={() => onVerify('mock-captcha-token')}>Complete test CAPTCHA</button>,
}));
function fill() {
  for (const [label, value] of [
    ['First Name', 'Alex'], ['Last Name', 'Buyer'],
    ['Phone Number', '(786) 555-0100'], ['Email Address', 'alex@example.com'],
  ]) fireEvent.change(screen.getByLabelText(label), { target: { value } });
  fireEvent.click(screen.getByRole('button', { name: 'Complete test CAPTCHA' }));
  return screen.getByRole('form') as HTMLFormElement;
}
function mockResponse(success: unknown, ok = true) {
  const fetchMock = vi.fn().mockResolvedValue({ ok, json: async () => ({ success }) });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.useRealTimers(); });

describe('consultation form', () => {
  it('routes to Web3Forms with public form key, honeypot and no old provider options', () => {
    render(<ConsultationForm accessKey={testKey} />);
    const form = screen.getByRole('form');
    expect(form).toHaveAttribute('action', CONSULTATION_ENDPOINT);
    expect(form).toHaveAttribute('method', 'POST');
    const data = new FormData(form as HTMLFormElement);
    expect(data.get('access_key')).toBe(testKey);
    expect(data.get('subject')).toContain('Mortgage Camp');
    expect(data.get('from_name')).toBe('Mortgage Camp website');
    expect(data.get('botcheck')).toBeNull();
    expect(form.querySelector('[name="botcheck"]')).toHaveAttribute('type', 'checkbox');
    expect(data.get('_captcha')).toBeNull();
    expect(data.get('ccemail')).toBeNull();
    expect(data.get('redirect')).toBeNull();
    expect(data.get('loan-type')).toBe('Purchase a home');
  });

  it('validates required contact fields before sending', () => {
    const fetchMock = mockResponse(true);
    render(<ConsultationForm accessKey={testKey} />);
    const form = screen.getByRole('form') as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    fireEvent.submit(form);
    expect(fetchMock).not.toHaveBeenCalled();
    fill();
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).get('email')).toBe('alex@example.com');
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'invalid' } });
    expect(form.checkValidity()).toBe(false);
  });

  it('keeps visitors on site and shows success only after provider acceptance', async () => {
    let resolve!: (value: unknown) => void;
    const fetchMock = vi.fn().mockImplementation(() => new Promise(r => { resolve = r; }));
    vi.stubGlobal('fetch', fetchMock);
    render(<ConsultationForm accessKey={testKey} />);
    const form = fill();
    fireEvent.submit(form);
    expect(screen.getByRole('status')).toHaveTextContent('Sending your request');
    expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled();
    fireEvent.submit(form);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(CONSULTATION_ENDPOINT);
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toMatchObject({ access_key: testKey, email: 'alex@example.com', 'first-name': 'Alex', 'last-name': 'Buyer', phone: '(786) 555-0100', 'loan-type': 'Purchase a home' });
    expect(JSON.parse(options.body)['h-captcha-response']).toBe('mock-captcha-token');
    await act(async () => resolve({ ok: true, json: async () => ({ success: true }) }));
    expect(screen.getByRole('status')).toHaveTextContent('Request sent successfully');
    expect(screen.getByLabelText('Email Address')).toHaveValue('');
    expect(screen.getByRole('button', { name: /Schedule My Free Call/ })).not.toBeDisabled();
  });

  it.each([[false, true], [true, false], ['true', true], [undefined, true]])('rejects non-success responses (%s, %s) and retains inputs', async (success, ok) => {
    mockResponse(success, ok);
    render(<ConsultationForm accessKey={testKey} />);
    fireEvent.submit(fill());
    expect(await screen.findByRole('alert')).toHaveTextContent('could not confirm');
    expect(screen.getByLabelText('Email Address')).toHaveValue('alex@example.com');
    expect(screen.getByRole('status')).not.toHaveTextContent('successfully');
    expect(screen.getByRole('button', { name: /Schedule My Free Call/ })).not.toBeDisabled();
  });

  it('handles malformed provider responses without rendering remote error text', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => { throw new Error('Invalid JSON'); } }));
    render(<ConsultationForm accessKey={testKey} />);
    fireEvent.submit(fill());
    expect(await screen.findByRole('alert')).toHaveTextContent('could not confirm');
    expect(screen.getByLabelText('First Name')).toHaveValue('Alex');
  });

  it('allows retry after a network failure', async () => {
    const fetchMock = vi.fn().mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });
    vi.stubGlobal('fetch', fetchMock);
    render(<ConsultationForm accessKey={testKey} />);
    const form = fill();
    fireEvent.submit(form);
    await screen.findByRole('alert');
    fireEvent.click(screen.getByRole('button', { name: 'Complete test CAPTCHA' }));
    fireEvent.submit(form);
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Request sent successfully'));
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('times out with an honest uncertain-delivery warning and preserves inputs', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn().mockImplementation((_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    })));
    render(<ConsultationForm accessKey={testKey} />);
    fireEvent.submit(fill());
    await act(async () => { await vi.advanceTimersByTimeAsync(CONSULTATION_TIMEOUT_MS); });
    expect(screen.getByRole('alert')).toHaveTextContent('cannot confirm whether it was accepted');
    expect(screen.getByRole('alert')).toHaveTextContent('avoid a duplicate');
    expect(screen.getByLabelText('Email Address')).toHaveValue('alex@example.com');
    expect(screen.getByRole('button', { name: /Schedule My Free Call/ })).not.toBeDisabled();
  });

  it.each(['', 'YOUR_ACCESS_KEY_HERE'])('blocks missing or placeholder form keys (%s)', async accessKey => {
    const fetchMock = mockResponse(true);
    render(<ConsultationForm accessKey={accessKey} />);
    fireEvent.submit(fill());
    expect(screen.getByRole('alert')).toHaveTextContent('temporarily unavailable');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not report honeypot submissions as sent', () => {
    const fetchMock = mockResponse(true);
    render(<ConsultationForm accessKey={testKey} />);
    const form = fill();
    fireEvent.click(form.querySelector('[name="botcheck"]')!);
    fireEvent.submit(form);
    expect(screen.getByRole('alert')).toHaveTextContent('could not submit');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks submission until CAPTCHA has been completed', () => {
    const fetchMock = mockResponse(true);
    render(<ConsultationForm accessKey={testKey} />);
    for (const [label, value] of [['First Name', 'Alex'], ['Last Name', 'Buyer'], ['Phone Number', '5550100'], ['Email Address', 'alex@example.com']]) {
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    }
    fireEvent.submit(screen.getByRole('form'));
    expect(screen.getByRole('alert')).toHaveTextContent('complete the spam-protection check');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('discloses processing/storage, warns against sensitive data and provides fallback', () => {
    render(<ConsultationForm accessKey={testKey} />);
    expect(screen.getByText(/Web3Forms processes and stores/)).toHaveTextContent(/Do not include Social Security numbers/);
    expect(screen.getByRole('link', { name: 'ceo@mortgagecamp.net' })).toHaveAttribute('href', expect.stringContaining('mailto:ceo@mortgagecamp.net?'));
    expect(screen.getByText(/A consultation time is not booked until confirmed/)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(screen.getByRole('form').querySelector('input[type="file"]')).toBeNull();
  });
});
