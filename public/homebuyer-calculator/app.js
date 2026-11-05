/* Mortgage Camp planning frontend. No storage, dependencies or client-side quotes.
 * All financial arithmetic runs in-browser. Only ZIP goes to external providers.
 */
(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const form = $('calculator-form');
  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
  const annualCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const percent = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 });
  const allowedSourceHosts = new Set([
    'freddiemac.com', 'www.freddiemac.com', 'fred.stlouisfed.org',
    'census.gov', 'www.census.gov', 'api.census.gov', 'data.census.gov', 'api.censusreporter.org',
    'treasury.gov', 'home.treasury.gov', 'data.treasury.gov',
    'naic.org', 'content.naic.org', 'www.naic.org',
    'floir.com', 'www.floir.com', 'hud.gov', 'www.hud.gov',
    'miamidade.gov', 'www.miamidade.gov', 'floridarevenue.com', 'www.floridarevenue.com',
    'api.zippopotam.us', 'www.zippopotam.us', 'zippopotam.us'
  ]);
  const state = {
    calculationVersion: 0, calculationController: null, calculationTimer: null,
    rateVersion: 0, rateController: null, benchmark: null,
    estimateVersion: 0, estimateController: null, estimateTimer: null, estimate: null,
    borrowerSequence: 0,
    printedDetails: null
  };

  function setStatus(id, message, error = false) {
    $(id).textContent = message;
    $(id).classList.toggle('error', error);
  }

  function sourceUrl(value) {
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || url.username || url.password || url.port || !allowedSourceHosts.has(url.hostname)) return null;
      return url.href;
    } catch { return null; }
  }

  function appendSource(container, label, value) {
    const paragraph = document.createElement('p');
    paragraph.textContent = `${label}: `;
    const safe = sourceUrl(value);
    if (safe) {
      const link = document.createElement('a');
      link.href = safe;
      link.textContent = value;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      paragraph.append(link);
    } else {
      const text = document.createElement('span');
      text.textContent = typeof value === 'string' ? `${value} (unlinked source)` : 'Not supplied';
      paragraph.append(text);
    }
    container.append(paragraph);
  }

  function addText(container, message) {
    const p = document.createElement('p');
    p.textContent = message;
    container.append(p);
  }

  function showWarnings(id, warnings) {
    const list = $(id);
    list.replaceChildren();
    if (Array.isArray(warnings)) {
      warnings.filter((value) => typeof value === 'string').forEach((message) => {
        const item = document.createElement('li');
        item.textContent = message;
        list.append(item);
      });
    }
    list.hidden = list.childElementCount === 0;
  }


  function finite(value) { return typeof value === 'number' && Number.isFinite(value); }
  function numberValue(id) { return $(id).valueAsNumber; }
  function lookupKey() { return `${$('zip').value.trim()}|${$('price').value}`; }
  function validLookup() { return /^[0-9]{5}$/.test($('zip').value.trim()) && $('price').checkValidity(); }
  function currentEstimate() { return state.estimate && state.estimate.key === lookupKey(); }

  function clearResult(message, error = false) {
    $('result-content').hidden = true;
    $('result-empty').hidden = false;
    $('print-report').disabled = true;
    // Remove stale values from the DOM as well as hiding the result container.
    document.querySelectorAll('#result-content dd, #result-content .summary-pair strong, #result-content .constraint-ratio strong').forEach((element) => { element.textContent = '—'; });
    ['required-annual', 'required-monthly', 'housing-monthly', 'front-required', 'back-required'].forEach((id) => { $(id).textContent = '—'; });
    $('result-rate').textContent = '';
    $('result-costs').textContent = '';
    showWarnings('calculation-warnings', []);
    setStatus('calculation-status', message, error);
  }

  function invalidateCalculation(message = 'Updating your scenario…') {
    state.calculationVersion += 1;
    clearTimeout(state.calculationTimer);
    state.calculationController?.abort();
    $('results-panel').setAttribute('aria-busy', 'false');
    clearResult(message);
  }

  function validateField(input) {
    if (input.disabled || input.type === 'checkbox' || !input.willValidate) return true;
    const valid = input.checkValidity();
    input.setAttribute('aria-invalid', String(!valid));
    const output = $(`${input.id}-error`);
    if (output) {
      output.hidden = valid;
      if (!valid) {
        let message = 'Enter a valid value.';
        if (input.validity.valueMissing || input.validity.badInput) message = 'Enter a number to continue.';
        else if (input.id === 'zip') message = 'Enter a five-digit U.S. ZIP code.';
        else if (input.validity.rangeUnderflow) message = `Enter ${input.min} or more.`;
        else if (input.validity.rangeOverflow) message = `Enter ${input.max} or less.`;
        output.textContent = message;
      }
    }
    return valid;
  }

  function validateScenario(focusFirst = false) {
    let first = null;
    form.querySelectorAll('input, select').forEach((input) => {
      if (!validateField(input) && !first) first = input;
    });
    if (first && focusFirst) {
      const details = first.closest('details');
      if (details) details.open = true;
      first.focus();
    }
    return !first;
  }

  function payload() {
    return {
      price: numberValue('price'), down_percent: numberValue('down_percent'),
      rate: state.benchmark.rate, term_years: Number($('term_years').value),
      tax_annual: state.estimate.data.tax_annual, insurance_annual: state.estimate.data.insurance_annual,
      hoa_monthly: numberValue('hoa_monthly'), extra_monthly: numberValue('extra_monthly'),
      // Preserve the editable annual rate even when its control is disabled in fixed mode.
      mi_rate: numberValue('mi_rate'),
      mi_monthly_override: $('mi_mode').value === 'fixed' ? numberValue('mi_monthly_override') : null,
      upfront_percent: numberValue('upfront_percent'), finance_upfront: $('finance_upfront').checked,
      borrowers: [...$('borrowers').querySelectorAll('.borrower')].map((row) => ({
        income_annual: row.querySelector('[data-kind="income"]').valueAsNumber,
        debt_monthly: row.querySelector('[data-kind="debt"]').valueAsNumber
      }))
    };
  }

  function validateResult(data) {
    const fields = ['base_loan', 'loan', 'down_payment', 'upfront_fee', 'cash_down_and_upfront',
      'principal_interest', 'mi_monthly', 'tax_monthly', 'insurance_monthly', 'hoa_monthly',
      'extra_monthly', 'housing_monthly', 'debt_monthly', 'income_annual', 'required_annual',
      'front_required_annual', 'back_required_annual'];
    if (fields.some((key) => !finite(data[key]) || data[key] < 0) ||
      !finite(data.income_gap_annual) ||
      !['front', 'back'].includes(data.limiting_constraint) || typeof data.meets_dti !== 'boolean' ||
      [data.front_dti, data.back_dti].some((value) => value !== null && (!finite(value) || value < 0))) {
      throw new Error('The calculation response was incomplete. No prior result is being shown.');
    }
  }

  function renderResult(data) {
    validateResult(data);
    $('result-rate').textContent = `Estimate only · ${state.benchmark.rate.toFixed(2)}% annual public benchmark · Freddie Mac PMMS 30-year fixed · ${state.benchmark.date} · ${state.benchmark.status === 'snapshot' ? 'saved snapshot' : 'public observation'}. Applied to the selected term; not a personalized lender quote or rate lock.`;
    const costs = state.estimate.data;
    $('result-costs').textContent = `Automatic costs · ZIP ${costs.zip} (${costs.location}) · home price ${currency.format(numberValue('price'))}. Tax: ${costs.tax.status} (${costs.tax.vintage}); hazard: ${costs.insurance.status} (${costs.insurance.vintage}). Planning estimates only, not a property tax bill or insurance quote.`;
    $('required-annual').textContent = annualCurrency.format(Math.ceil(data.required_annual));
    $('required-monthly').textContent = currency.format(data.required_annual / 12);
    $('household-income').textContent = annualCurrency.format(data.income_annual);
    $('income-gap').textContent = annualCurrency.format(Math.ceil(Math.max(0, data.income_gap_annual)));
    const map = {
      'housing-monthly': 'housing_monthly', 'principal-interest': 'principal_interest',
      'tax-monthly': 'tax_monthly', 'insurance-monthly': 'insurance_monthly', 'mi-monthly': 'mi_monthly',
      'hoa-monthly': 'hoa_monthly', 'extra-monthly': 'extra_monthly', 'debt-monthly': 'debt_monthly',
      'down-payment': 'down_payment', 'base-loan': 'base_loan', 'upfront-fee': 'upfront_fee',
      'loan-total': 'loan', 'cash-needed': 'cash_down_and_upfront'
    };
    Object.entries(map).forEach(([id, key]) => { $(id).textContent = currency.format(data[key]); });
    $('front-required').textContent = annualCurrency.format(Math.ceil(data.front_required_annual));
    $('back-required').textContent = annualCurrency.format(Math.ceil(data.back_required_annual));
    $('front-dti').textContent = data.front_dti === null ? 'Not available — no income' : percent.format(data.front_dti);
    $('back-dti').textContent = data.back_dti === null ? 'Not available — no income' : percent.format(data.back_dti);
    const hasIncome = data.income_annual > 0;
    $('qualification-status').classList.toggle('within', hasIncome && data.meets_dti);
    $('qualification-copy').textContent = !hasIncome ? 'Add household income to compare with these limits.' : data.meets_dti ? 'Within selected DTI limits' : 'Above selected DTI limits at the entered income';
    $('front-constraint').classList.toggle('limiting', data.limiting_constraint === 'front');
    $('back-constraint').classList.toggle('limiting', data.limiting_constraint === 'back');
    $('limiting-copy').textContent = `${data.limiting_constraint === 'front' ? 'The housing-only (45%)' : 'The housing + liabilities (56.99%)'} limit sets the higher income requirement. Both limits must be met. Annual targets are rounded up to the next dollar.`;
    showWarnings('calculation-warnings', [...(data.warnings || []), ...(costs.warnings || [])]);
    $('result-content').hidden = false;
    $('result-empty').hidden = true;
    $('print-report').disabled = false;
    setStatus('calculation-status', 'Updated from your current inputs. All amounts in USD.');
  }

  async function calculate(focusFirst = false) {
    invalidateCalculation();
    if (!state.benchmark) {
      clearResult('A valid public rate benchmark is required for this estimate. Wait for loading or refresh the benchmark to retry.', true);
      return;
    }
    if (!validateScenario(focusFirst)) {
      clearResult('Check the highlighted fields to calculate a current result.', true);
      return;
    }
    if (!currentEstimate()) {
      clearResult('Current ZIP and home-price tax / insurance estimates are required. Wait for lookup or refresh to retry.', true);
      return;
    }
    const version = state.calculationVersion;
    const controller = new AbortController();
    state.calculationController = controller;
    $('results-panel').setAttribute('aria-busy', 'true');
    setStatus('calculation-status', 'Calculating your income plan…');
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const data = globalThis.MortgageCampMath.calculate(payload());
      if (version !== state.calculationVersion) return;
      renderResult(data);
    } catch (error) {
      if (version !== state.calculationVersion) return;
      clearResult(`${error.message} Update the plan to retry.`, true);
    } finally {
      clearTimeout(timeout);
      if (version === state.calculationVersion) $('results-panel').setAttribute('aria-busy', 'false');
    }
  }

  function scheduleCalculation() {
    invalidateCalculation();
    if (!validateScenario()) {
      clearResult('Check the highlighted fields to calculate a current result.', true);
      return;
    }
    state.calculationTimer = setTimeout(() => calculate(), 320);
  }

  async function loadRates() {
    state.rateController?.abort();
    const version = ++state.rateVersion;
    const controller = new AbortController();
    state.rateController = controller;
    state.benchmark = null;
    invalidateCalculation('Loading the public benchmark before estimating…');
    $('rate-source').hidden = true;
    $('rate-warning').hidden = true;
    $('rate-methodology').textContent = 'Refreshing the public benchmark. Estimates are paused until it is available.';
    setStatus('rate-status', 'Loading the public benchmark for your estimate…');
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const data = await globalThis.MortgageCampData.rates(controller.signal);
      if (version !== state.rateVersion) return;
      if (!finite(data.rate) || data.rate < 0 || data.rate > 25 || !['live', 'snapshot'].includes(data.status) || !/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !sourceUrl(data.source)) {
        throw new Error('Benchmark response was incomplete.');
      }
      state.benchmark = data;
      setStatus('rate-status', `${data.rate.toFixed(2)}% · ${data.date} · ${data.status === 'live' ? 'Public observation' : 'Saved snapshot'} · Applied automatically for estimate only`);
      $('rate-warning').hidden = !data.warning;
      $('rate-warning').textContent = typeof data.warning === 'string' ? data.warning : '';
      const safe = sourceUrl(data.source);
      $('rate-source').hidden = !safe;
      if (safe) $('rate-source').href = safe;
      $('rate-methodology').replaceChildren();
      addText($('rate-methodology'), `Benchmark: ${data.rate}% • observation date: ${data.date} • status: ${data.status} • fetched: ${data.fetched_at ?? 'not supplied'}.`);
      appendSource($('rate-methodology'), 'Rate source', data.source);
      if (data.warning) addText($('rate-methodology'), String(data.warning));
      calculate();
    } catch (error) {
      if (version !== state.rateVersion) return;
      setStatus('rate-status', error.name === 'AbortError' ? 'Benchmark lookup timed out. Refresh to retry; no estimate is shown.' : `Benchmark unavailable: ${error.message} Refresh to retry; no estimate is shown.`, true);
      $('rate-methodology').textContent = 'Benchmark unavailable. No manual or default interest rate is substituted. Refresh the benchmark to retry.';
      clearResult('Public rate benchmark unavailable. Refresh the benchmark to calculate an estimate.', true);
    } finally { clearTimeout(timeout); }
  }

  function invalidateEstimate() {
    state.estimateVersion += 1;
    state.estimateController?.abort();
    clearTimeout(state.estimateTimer);
    state.estimate = null;
    invalidateCalculation('Updating automatic tax and insurance estimates…');
    $('estimate-values').hidden = true;
    $('suggested-tax').textContent = '—';
    $('suggested-insurance').textContent = '—';
    $('estimate-methodology').textContent = 'Waiting for source details for the current ZIP and home price.';
    $('applied-estimate-record').textContent = 'No current automatic tax or hazard estimates. Final calculation is paused until lookup completes.';
    showWarnings('estimate-warnings', []);
  }

  function queueEstimate() {
    invalidateEstimate();
    $('estimate-methodology').textContent = 'Lookup inputs changed. Source details will appear after the new lookup.';
    $('location').textContent = /^[0-9]{5}$/.test($('zip').value.trim()) ? `ZIP ${$('zip').value.trim()} — location pending` : 'Enter a valid ZIP';
    if (!validLookup()) {
      setStatus('estimate-status', 'Enter a valid five-digit ZIP and positive home price to look up estimates.', true);
      return;
    }
    setStatus('estimate-status', 'Preparing automatic ZIP and home-price estimates… Final calculation paused.');
    state.estimateTimer = setTimeout(loadEstimates, 550);
  }

  function renderEstimateSources(data) {
    $('estimate-methodology').replaceChildren();
    ['tax', 'insurance'].forEach((kind) => {
      const record = data[kind];
      addText($('estimate-methodology'), `${kind === 'tax' ? 'Property tax' : 'Hazard insurance'} • method: ${record.method ?? 'not supplied'} • vintage: ${record.vintage ?? 'not supplied'} • status: ${record.status ?? 'not supplied'}.`);
      appendSource($('estimate-methodology'), `${kind === 'tax' ? 'Tax' : 'Insurance'} source`, record.source);
    });
  }

  async function loadEstimates() {
    invalidateEstimate();
    validateField($('zip'));
    if (!validLookup()) {
      setStatus('estimate-status', 'Enter a valid five-digit ZIP and positive home price before lookup.', true);
      return;
    }
    const version = state.estimateVersion;
    const key = lookupKey();
    const controller = new AbortController();
    state.estimateController = controller;
    setStatus('estimate-status', 'Loading automatic tax and insurance estimates… Final calculation paused.');
    const timeout = setTimeout(() => controller.abort(), 35000);
    try {
      const data = await globalThis.MortgageCampData.estimate($('zip').value.trim(), numberValue('price'), controller.signal);
      if (version !== state.estimateVersion || key !== lookupKey()) return;
      if (!finite(data.tax_annual) || data.tax_annual < 0 || !finite(data.insurance_annual) || data.insurance_annual < 0 ||
        String(data.zip) !== $('zip').value.trim() || typeof data.location !== 'string' || !data.tax || !data.insurance) {
        throw new Error('ZIP estimate response was incomplete.');
      }
      state.estimate = { key, data };
      $('location').textContent = data.location;
      $('suggested-tax').textContent = currency.format(data.tax_annual);
      $('suggested-insurance').textContent = currency.format(data.insurance_annual);
      $('estimate-values').hidden = false;
      setStatus('estimate-status', `${data.location} · Applied automatically. Tax: ${data.tax.status} (${data.tax.vintage}). Hazard: ${data.insurance.status} (${data.insurance.vintage}).`);
      showWarnings('estimate-warnings', data.warnings);
      renderEstimateSources(data);
      $('applied-estimate-record').textContent = `Automatic planning estimates for ${data.location}, ZIP ${data.zip}, home price ${currency.format(numberValue('price'))}: annual tax ${currency.format(data.tax_annual)}; annual hazard ${currency.format(data.insurance_annual)}. Tax method: ${data.tax.method}; vintage: ${data.tax.vintage}; status: ${data.tax.status}. Hazard method: ${data.insurance.method}; vintage: ${data.insurance.vintage}; status: ${data.insurance.status}. Not a property tax bill or insurance quote.`;
      calculate();
    } catch (error) {
      if (version !== state.estimateVersion) return;
      setStatus('estimate-status', error.name === 'AbortError' ? 'ZIP lookup timed out. Refresh to retry; no final estimate is shown.' : `ZIP lookup unavailable: ${error.message} Refresh to retry; no final estimate is shown.`, true);
      $('location').textContent = 'Location not verified';
      $('estimate-methodology').textContent = 'No current ZIP estimate available. Refresh lookup to retry; no stale or manual costs are substituted.';
      clearResult('Automatic tax / insurance lookup unavailable. Refresh lookup to calculate a current estimate.', true);
    } finally { clearTimeout(timeout); }
  }

  function borrowerField(row, id, kind, labelText, value) {
    const field = document.createElement('div');
    field.className = 'field';
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = labelText;
    const suffix = document.createElement('span');
    suffix.textContent = kind === 'income' ? 'gross per year' : 'per month';
    label.append(suffix);
    const wrap = document.createElement('div');
    wrap.className = 'input-wrap';
    const dollar = document.createElement('span');
    dollar.setAttribute('aria-hidden', 'true');
    dollar.textContent = '$';
    const input = document.createElement('input');
    Object.assign(input, { id, name: id, type: 'number', min: '0', max: '100000000', step: 'any', value: String(value), required: true });
    input.setAttribute('inputmode', 'decimal');
    input.dataset.kind = kind;
    input.setAttribute('aria-describedby', `${id}-error`);
    const error = document.createElement('p');
    error.className = 'field-error';
    error.id = `${id}-error`;
    error.hidden = true;
    wrap.append(dollar, input);
    field.append(label, wrap, error);
    row.append(field);
  }

  function updateBorrowerLabels() {
    const rows = [...$('borrowers').querySelectorAll('.borrower')];
    rows.forEach((row, index) => {
      row.querySelector('legend').textContent = index === 0 ? 'Primary borrower' : `Co-borrower ${index}`;
      const remove = row.querySelector('.remove-borrower');
      if (remove) remove.setAttribute('aria-label', `Remove co-borrower ${index}`);
    });
    $('borrower-count').textContent = `${rows.length} of 8 borrowers`;
    $('add-borrower').disabled = rows.length >= 8;
  }

  function addBorrower(primary = false) {
    if ($('borrowers').children.length >= 8) return;
    const id = ++state.borrowerSequence;
    const row = document.createElement('fieldset');
    row.className = 'borrower';
    row.dataset.borrowerId = String(id);
    const legend = document.createElement('legend');
    const grid = document.createElement('div');
    grid.className = 'field-grid';
    borrowerField(grid, primary ? 'income_annual' : `borrower-${id}-income`, 'income', 'Income ', 0);
    borrowerField(grid, primary ? 'debt_monthly' : `borrower-${id}-debt`, 'debt', 'Monthly liabilities ', primary ? 1100 : 0);
    row.append(legend, grid);
    if (!primary) {
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'text-button remove-borrower';
      remove.textContent = 'Remove co-borrower';
      remove.addEventListener('click', () => {
        row.remove();
        updateBorrowerLabels();
        $('add-borrower').focus();
        $('borrower-announcement').textContent = 'Co-borrower removed. Their income and liabilities are excluded.';
        scheduleCalculation();
      });
      row.append(remove);
    }
    $('borrowers').append(row);
    updateBorrowerLabels();
    if (!primary) {
      row.querySelector('input').focus();
      $('borrower-announcement').textContent = 'Co-borrower added. Enter both income and monthly liabilities.';
      scheduleCalculation();
    }
  }

  function syncMIMode() {
    const fixed = $('mi_mode').value === 'fixed';
    $('mi-rate-field').hidden = fixed;
    $('mi-fixed-field').hidden = !fixed;
    $('mi_rate').disabled = fixed;
    $('mi_monthly_override').disabled = !fixed;
    $('mi_monthly_override').required = fixed;
    // A hidden annual field still goes in the contract; keep it finite if the user
    // switched away while editing an empty/invalid annual value.
    if (fixed && !finite(numberValue('mi_rate'))) $('mi_rate').value = '0.50';
  }

  form.addEventListener('submit', (event) => { event.preventDefault(); calculate(true); });
  form.addEventListener('input', (event) => {
    const id = event.target.id;

    if (id === 'price' || id === 'zip') queueEstimate();
    scheduleCalculation();
  });
  form.addEventListener('change', (event) => {
    // Some browsers dispatch only change for select / checkbox activation.
    if (event.target.id === 'mi_mode') syncMIMode();
    if (event.target.matches('select, input[type="checkbox"]')) scheduleCalculation();
  });
  $('add-borrower').addEventListener('click', () => addBorrower());
  $('refresh-rates').addEventListener('click', loadRates);
  $('refresh-estimates').addEventListener('click', loadEstimates);


  $('print-report').addEventListener('click', () => window.print());
  window.addEventListener('beforeprint', () => {
    $('report-time').textContent = `Planning report printed ${new Date().toLocaleString('en-US')}. Required annual targets rounded up to whole dollars. Not a lender approval.`;
    state.printedDetails = [...document.querySelectorAll('details')].map((element) => [element, element.open]);
    state.printedDetails.forEach(([element]) => { element.open = true; });
  });
  window.addEventListener('afterprint', () => {
    state.printedDetails?.forEach(([element, open]) => { element.open = open; });
    state.printedDetails = null;
  });

  const logo = $('brand-logo');
  const showLogo = () => logo.closest('.brand').classList.toggle('has-logo', logo.naturalWidth > 0);
  logo.addEventListener('load', showLogo);
  logo.addEventListener('error', () => logo.closest('.brand').classList.remove('has-logo'));
  if (logo.complete) showLogo();

  addBorrower(true);
  syncMIMode();
  calculate();
  loadRates();
  loadEstimates();
})();
