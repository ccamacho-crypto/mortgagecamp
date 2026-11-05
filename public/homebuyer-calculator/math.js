/* Browser-local planning math. Kept equivalent to calculator.py; no IO/storage. */
(function (root) {
  'use strict';
  function number(data, name, fallback, low = 0, high = 100000000) {
    const value = data[name] === undefined ? fallback : data[name];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < low || value > high) {
      throw new Error(`${name} must be a number between ${low} and ${high}.`);
    }
    return value;
  }
  function calculate(data = {}) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('A scenario object is required.');
    const price = number(data, 'price', 525000, 1);
    const downPct = number(data, 'down_percent', 3.5, 3.5, 100);
    const rate = number(data, 'rate', 7.24, 0, 25);
    const years = number(data, 'term_years', 30, 1, 50);
    if (!Number.isInteger(years * 12)) throw new Error('Loan term must represent whole months.');
    const tax = number(data, 'tax_annual', 4800);
    const insurance = number(data, 'insurance_annual', 3000);
    const hoa = number(data, 'hoa_monthly', 0);
    const extra = number(data, 'extra_monthly', 0);
    const miRate = number(data, 'mi_rate', 0.50, 0, 10);
    const upfrontPct = number(data, 'upfront_percent', 0, 0, 10);
    const finance = data.finance_upfront === undefined ? true : data.finance_upfront;
    if (typeof finance !== 'boolean') throw new Error('Financed upfront premium must be true or false.');
    const override = data.mi_monthly_override == null ? null : number(data, 'mi_monthly_override', 0, 0, 1000000);
    const borrowers = data.borrowers === undefined ? [{ income_annual: 0, debt_monthly: 1100 }] : data.borrowers;
    if (!Array.isArray(borrowers) || borrowers.length < 1 || borrowers.length > 8) throw new Error('Include one to eight borrowers.');
    let income = 0;
    let debt = 0;
    for (const borrower of borrowers) {
      if (!borrower || typeof borrower !== 'object' || Array.isArray(borrower)) throw new Error('Each borrower must be an object.');
      income += number(borrower, 'income_annual', 0);
      debt += number(borrower, 'debt_monthly', 0);
    }
    const down = price * downPct / 100;
    const base = price - down;
    const upfront = base * upfrontPct / 100;
    const loan = base + (finance ? upfront : 0);
    const months = Math.round(years * 12);
    const r = rate / 1200;
    const payment = r ? loan * r / -Math.expm1(-months * Math.log1p(r)) : loan / months;
    const mi = base ? (override === null ? base * miRate / 1200 : override) : 0;
    const housing = payment + mi + tax / 12 + insurance / 12 + hoa + extra;
    const frontRequired = housing / 0.45 * 12;
    const backRequired = (housing + debt) / 0.5699 * 12;
    const required = Math.max(frontRequired, backRequired);
    const monthlyIncome = income / 12;
    const warnings = [
      'Planning estimate only, not loan approval or a personalized rate quote.',
      '45% / 56.99% are selected scenario ceilings, not universal lender rules.',
      'MI uses the initial base loan; future amortization and cancellation are not modeled.',
      'Closing costs, reserves, flood/wind coverage and special assessments are not included unless entered separately.',
      'Co-borrower income and debt must be lender-eligible; family membership alone does not establish eligibility.'
    ];
    if (!upfrontPct && base > 0) warnings.push('No upfront mortgage-insurance fee is included. A 3.5% down scenario is not a complete FHA quote; actual premiums and program limits vary.');
    if (!base) warnings.push('Cash-purchase scenario: no principal/interest or MI. DTI comparison remains a planning exercise for ongoing housing costs.');
    return {
      base_loan: base, loan, down_payment: down, upfront_fee: upfront,
      cash_down_and_upfront: down + (finance ? 0 : upfront), principal_interest: payment,
      mi_monthly: mi, tax_monthly: tax / 12, insurance_monthly: insurance / 12,
      hoa_monthly: hoa, extra_monthly: extra, housing_monthly: housing,
      debt_monthly: debt, income_annual: income, required_annual: required,
      front_required_annual: frontRequired, back_required_annual: backRequired,
      income_gap_annual: Math.max(0, required - income),
      front_dti: monthlyIncome ? housing / monthlyIncome : null,
      back_dti: monthlyIncome ? (housing + debt) / monthlyIncome : null,
      meets_dti: monthlyIncome > 0 && income + 1e-8 >= required,
      limiting_constraint: frontRequired >= backRequired ? 'front' : 'back', warnings
    };
  }
  root.MortgageCampMath = Object.freeze({ calculate });
})(globalThis);
