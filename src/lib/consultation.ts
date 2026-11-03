// Static hosting has no lead-processing backend. Preparing a mail draft is
// explicit: no network request, no browser storage, and no false confirmation.
export function consultationEmail(data: FormData): string {
  const value = (key: string) => String(data.get(key) ?? '').trim();
  const body = [
    'I would like to schedule a free mortgage consultation.',
    '',
    `Goal: ${value('loan-type')}`,
    `Name: ${value('first-name')} ${value('last-name')}`,
    `Phone: ${value('phone')}`,
    `Email: ${value('email')}`,
    '',
    'Please contact me to arrange a time.',
  ].join('\n');
  return `mailto:info@mortgagecamp.pro?subject=${encodeURIComponent('Free mortgage consultation request')}&body=${encodeURIComponent(body)}`;
}
