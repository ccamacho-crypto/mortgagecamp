/* Public ZIP-only lookups; financial arithmetic and price scaling stay in browser. */
(() => {
  'use strict';
  const taxPrefix = 'https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25103,B25077&geo_ids=';
  const insuranceSource = 'https://home.treasury.gov/news/press-releases/jy2791';
  const positive = value => typeof value === 'number' && Number.isFinite(value) && value > 0;
  async function read(url, signal) {
    const response = await fetch(url, { signal, credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store' });
    if (!response.ok) throw new Error(`Data source returned ${response.status}.`);
    const data = await response.json();
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid source response.');
    return data;
  }
  function rethrowAbort(error, signal) {
    if (signal?.aborted || error.name === 'AbortError') throw error;
  }
  async function rates(signal) {
    const data = await read('./data/rates.json', signal);
    if (!positive(data.rate) || data.rate > 25 || !/^\d{4}-\d{2}-\d{2}$/.test(data.date) || data.status !== 'snapshot') throw new Error('Invalid saved benchmark.');
    const age = Math.floor((Date.now() - Date.parse(`${data.date}T00:00:00Z`)) / 86400000);
    data.warning = `Deployment-time benchmark snapshot (${age} days since observation), automatically used for estimates only; not a live rate or lender quote. Refresh reloads this saved file, not a current market feed.`;
    return data;
  }
  async function estimate(zip, price, signal) {
    if (!/^[0-9]{5}$/.test(zip)) throw new Error('Enter a five-digit U.S. ZIP.');
    if (!positive(price) || price > 100000000) throw new Error('Enter a positive home price up to $100,000,000.');
    const warnings = [];
    let location;
    try {
      const data = await read(`https://api.zippopotam.us/us/${zip}`, signal);
      const place = data.places?.[0];
      if (!place || typeof place['place name'] !== 'string' || typeof place['state abbreviation'] !== 'string') throw new Error('Missing ZIP location.');
      location = `${place['place name']}, ${place['state abbreviation']}`;
    } catch (error) {
      rethrowAbort(error, signal);
      if (zip !== '33130') throw new Error('ZIP not found or location lookup unavailable. Manual costs retained.');
      location = 'Miami, FL';
      warnings.push('Location lookup unavailable; bundled Miami mapping used.');
    }
    let taxAnnual;
    let tax;
    function parseTax(data, status) {
      const record = data.data?.[`86000US${zip}`];
      const medianTax = record?.B25103?.estimate?.B25103001;
      const medianValue = record?.B25077?.estimate?.B25077001;
      const ratio = medianTax / medianValue;
      if (!positive(medianTax) || !positive(medianValue) || ratio < 0.0001 || ratio > 0.15 || typeof data.release?.name !== 'string') throw new Error('ZIP survey medians unavailable.');
      return [Math.ceil(price * ratio * 1.25), {
        method: `ZIP/ZCTA median annual tax ($${medianTax}) ÷ median home value ($${medianValue}) × purchase price × 1.25 planning buffer. Ratio of survey medians, not an assessed rate.`,
        source: taxPrefix + '86000US' + zip, vintage: data.release.name, status,
        median_tax: medianTax, median_home_value: medianValue, effective_ratio: ratio, buffer: 1.25
      }];
    }
    try {
      [taxAnnual, tax] = parseTax(await read(taxPrefix + '86000US' + zip, signal), 'live retrieval / historical survey');
    } catch (error) {
      rethrowAbort(error, signal);
      if (zip === '33130') {
        [taxAnnual, tax] = parseTax({ data: { '86000US33130': {
          B25103: { estimate: { B25103001: 5459 } }, B25077: { estimate: { B25077001: 517300 } }
        } }, release: { name: 'ACS 2024 5-year (2020–2024)' } }, 'bundled historical ZIP snapshot');
      } else {
        taxAnnual = Math.ceil(price * 0.015);
        tax = { method: 'No usable ZIP survey data. Annual planning fallback: 1.50% of purchase price; not an observed tax rate or guaranteed upper bound.', source: '', vintage: 'Assumption, no data vintage', status: 'fallback assumption' };
      }
      warnings.push('Live ZIP tax lookup unavailable or suppressed; fallback used. Confirm purchase reassessment and exemptions with the local assessor.');
    }
    let insuranceAnnual = Math.ceil(Math.max(3000, price * 0.0075));
    let insurance = {
      method: `No published Treasury premium for ZIP ${zip}, or dataset unavailable. Planning fallback: max($3,000/year, 0.75% of purchase price). Designer-selected assumption, not a measured premium or validated conservative bound.`,
      source: insuranceSource, vintage: 'No ZIP observation; fallback assumption', status: 'fallback assumption'
    };
    try {
      const dataset = await read('./data/insurance_zips.json', signal);
      const premium = dataset.premiums?.[zip];
      if (positive(premium)) {
        insuranceAnnual = Math.ceil(Math.max(3000, premium * 1.50 * Math.max(1, price / 500000)));
        insurance = {
          method: `Treasury FIO ZIP ${zip} historical premium per policy ($${premium.toFixed(2)}) × 1.50 planning buffer × max(1, price ÷ $500,000), minimum $3,000/year. Designer-selected price scaling/buffer, not a quote or validated conservative bound. ZIP anomalies may be material.`,
          source: dataset.source_page, vintage: String(dataset.year), status: 'bundled historical ZIP estimate', historical_premium: premium
        };
      }
    } catch (error) {
      rethrowAbort(error, signal);
      warnings.push('Bundled insurance dataset unavailable; explicit price-based fallback used.');
    }
    warnings.push('Tax statistics are historical; reassessment, exemptions, levies and assessments can materially change actual taxes.',
      'Insurance uses 2022 ZIP history or an explicit fallback, not a property-specific live quote. Treasury excludes residual/E&S markets and flood. Obtain coverage quotes for flood/wind/fire risks.',
      'Planning buffers are not guaranteed sufficient amounts.');
    return { zip, location, tax_annual: taxAnnual, insurance_annual: insuranceAnnual, tax, insurance, warnings, fetched_at: new Date().toISOString() };
  }
  globalThis.MortgageCampData = Object.freeze({ rates, estimate });
})();
