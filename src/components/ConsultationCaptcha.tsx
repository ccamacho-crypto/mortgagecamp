import { useEffect, useRef } from 'react';

interface HCaptchaApi {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  reset(id: string): void;
  remove(id: string): void;
}
declare global { interface Window { hcaptcha?: HCaptchaApi } }

const scriptId = 'mortgagecamp-hcaptcha';
const sitekey = '50b2fe65-b00b-4b9e-ad62-3ba471098be2'; // Web3Forms documented free-plan sitekey.

export default function ConsultationCaptcha({ onVerify, onError, resetCount }: {
  onVerify: (token: string) => void;
  onError: () => void;
  resetCount: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const callbacks = useRef({ onVerify, onError });
  callbacks.current = { onVerify, onError };

  useEffect(() => {
    let disposed = false;
    function renderWidget() {
      if (disposed || !container.current || !window.hcaptcha || widget.current !== null) return;
      try {
        widget.current = window.hcaptcha.render(container.current, {
          sitekey, theme: 'dark', size: 'compact',
          callback: (token: string) => callbacks.current.onVerify(token),
          'expired-callback': () => callbacks.current.onVerify(''),
          'error-callback': () => { callbacks.current.onVerify(''); callbacks.current.onError(); },
        });
      } catch { callbacks.current.onError(); }
    }
    function failed() { if (!disposed) callbacks.current.onError(); }
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit&recaptchacompat=off';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', renderWidget);
    script.addEventListener('error', failed);
    renderWidget();
    return () => {
      disposed = true;
      script?.removeEventListener('load', renderWidget);
      script?.removeEventListener('error', failed);
      if (widget.current !== null) window.hcaptcha?.remove(widget.current);
      widget.current = null;
    };
  }, []);

  useEffect(() => {
    if (widget.current !== null) window.hcaptcha?.reset(widget.current);
  }, [resetCount]);

  return <div className="flex justify-center" aria-label="Spam protection"><div ref={container} /></div>;
}
