import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../public/homebuyer-calculator/math.js', import.meta.url), 'utf8');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(source, sandbox);
const calculate = sandbox.MortgageCampMath.calculate;
const baseline = calculate({});
assert.equal(Math.ceil(baseline.required_annual), 115033);
assert.equal(baseline.base_loan, 506625);
assert.equal(baseline.mi_monthly, 211.09375);
assert.equal(baseline.front_dti, null);
assert.equal(calculate({ rate: 0 }).principal_interest, 506625 / 360);
assert.ok(Math.abs(calculate({ rate: 1e-10 }).principal_interest - 506625 / 360) < 1e-5);
assert.equal(calculate({ down_percent: 100, mi_monthly_override: 500 }).mi_monthly, 0);
assert.equal(calculate({ down_percent: 100 }).principal_interest, 0);
assert.equal(calculate({ mi_monthly_override: 0 }).mi_monthly, 0);
assert.equal(calculate({ mi_monthly_override: 123.45 }).mi_monthly, 123.45);
assert.equal(calculate({ upfront_percent: 1.75 }).loan, 515490.9375);
assert.equal(calculate({ upfront_percent: 1.75, finance_upfront: false }).cash_down_and_upfront, 27240.9375);
const household = calculate({ borrowers: [{ income_annual: 70000, debt_monthly: 1100 }, { income_annual: 50000, debt_monthly: 900 }] });
assert.equal(household.income_annual, 120000);
assert.equal(household.debt_monthly, 2000);
assert.equal(household.meets_dti, false);
for (const rate of [0, 6.5, 7.24, 12]) {
  const required = calculate({ rate }).required_annual;
  const result = calculate({ rate, borrowers: [{ income_annual: required, debt_monthly: 1100 }] });
  assert.equal(result.meets_dti, true);
  assert.ok(result.front_dti <= 0.45 + 1e-12);
  assert.ok(result.back_dti <= 0.5699 + 1e-12);
  assert.equal(calculate({ rate, borrowers: [{ income_annual: required - 0.01, debt_monthly: 1100 }] }).meets_dti, false);
}
const invalid = [null, [], { price: 0 }, { price: Infinity }, { rate: NaN }, { rate: true }, { rate: '7.24' }, { rate: 26 }, { down_percent: 3.49 }, { down_percent: 101 }, { tax_annual: -1 }, { insurance_annual: -1 }, { mi_monthly_override: -1 }, { term_years: 1.01 }, { term_years: 0 }, { finance_upfront: 'yes' }, { borrowers: [] }, { borrowers: Array(9).fill({}) }, { borrowers: [null] }, { borrowers: [{ debt_monthly: '1100' }] }];
for (const input of invalid) assert.throws(() => calculate(input));
const fixturesPath = process.env.PARITY_FIXTURES;
let parity = 0;
if (fixturesPath) {
  const fixtures = JSON.parse(await readFile(fixturesPath, 'utf8'));
  for (const { input, expected } of fixtures) {
    const actual = calculate(input);
    for (const [key, value] of Object.entries(expected)) {
      if (key === 'warnings') continue;
      if (typeof value === 'number') assert.ok(Math.abs(actual[key] - value) <= 1e-8 * Math.max(1, Math.abs(value)), `${key} parity failed`);
      else assert.equal(actual[key], value, key);
    }
    parity += 1;
  }
}
console.log(`PASS: default scenario, near-zero/zero rates, cash purchase, upfront/MI modes, co-borrowers, 4 DTI boundaries, ${invalid.length} invalid inputs, ${parity} Python parity scenarios.`);
