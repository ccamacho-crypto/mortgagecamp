import { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, AnimatePresence } from 'motion/react';
import { PageHero, CtaBanner, fadeUp } from '@/components/PageShell';

const siteUrl = 'https://www.mortgagecamp.pro';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}
function fmtD(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}
function pct(n: number) {
  return n.toFixed(3) + '%';
}

function monthlyPayment(principal: number, annualRate: number, years: number): number {
  if (annualRate === 0) return principal / (years * 12);
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Field({
  label, prefix, suffix, value, onChange, min = 0, max, step = 1,
}: {
  label: string; prefix?: string; suffix?: string; value: string;
  onChange: (v: string) => void; min?: number; max?: number; step?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      <div className="flex items-center rounded-lg border border-border bg-muted overflow-hidden focus-within:border-primary transition-colors">
        {prefix && <span className="px-3 py-2.5 text-sm text-muted-foreground border-r border-border bg-card">{prefix}</span>}
        <input
          type="number" aria-label={label} value={value} min={min} max={max} step={step}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 w-full flex-1 px-3 py-2.5 text-sm text-foreground bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {suffix && <span className="px-3 py-2.5 text-sm text-muted-foreground border-l border-border bg-card">{suffix}</span>}
      </div>
    </div>
  );
}

function ResultRow({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-bold ${gold ? 'text-gold-metallic' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}

function CalcCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <motion.div variants={fadeUp} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl" aria-hidden="true">{icon}</span>
        <h3 className="text-base font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

// ─── Calculators ──────────────────────────────────────────────────────────────

function MortgagePaymentCalc() {
  const [price, setPrice] = useState('400000');
  const [down, setDown] = useState('80000');
  const [rate, setRate] = useState('6.875');
  const [years, setYears] = useState('30');
  const [tax, setTax] = useState('4800');
  const [insurance, setInsurance] = useState('1200');

  const principal = Math.max(0, Number(price) - Number(down));
  const pi = monthlyPayment(principal, Number(rate), Number(years));
  const monthlyTax = Number(tax) / 12;
  const monthlyIns = Number(insurance) / 12;
  const total = pi + monthlyTax + monthlyIns;
  const totalInterest = pi * Number(years) * 12 - principal;

  return (
    <CalcCard title="Mortgage Payment Calculator" icon="🏠">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Field label="Home Price" prefix="$" value={price} onChange={setPrice} step={1000} />
        <Field label="Down Payment" prefix="$" value={down} onChange={setDown} step={1000} />
        <Field label="Interest Rate" suffix="%" value={rate} onChange={setRate} max={30} step={0.125} />
        <Field label="Loan Term" suffix="yrs" value={years} onChange={setYears} min={1} max={30} />
        <Field label="Annual Property Tax" prefix="$" value={tax} onChange={setTax} step={100} />
        <Field label="Annual Insurance" prefix="$" value={insurance} onChange={setInsurance} step={100} />
      </div>
      <div className="rounded-xl p-4" style={{ background: 'hsl(var(--noir-surface))' }}>
        <ResultRow label="Principal & Interest" value={fmtD(pi)} />
        <ResultRow label="Property Tax" value={fmtD(monthlyTax)} />
        <ResultRow label="Insurance" value={fmtD(monthlyIns)} />
        <ResultRow label="Total Monthly Payment" value={fmtD(total)} gold />
        <ResultRow label="Loan Amount" value={fmt(principal)} />
        <ResultRow label="Total Interest Paid" value={fmt(totalInterest)} />
      </div>
    </CalcCard>
  );
}

function AffordabilityCalc() {
  const [income, setIncome] = useState('8000');
  const [debts, setDebts] = useState('500');
  const [rate, setRate] = useState('6.875');
  const [years, setYears] = useState('30');
  const [downPct, setDownPct] = useState('20');

  const maxPITI = Number(income) * 0.28;
  const maxTotal = Number(income) * 0.36 - Number(debts);
  const maxMonthly = Math.min(maxPITI, maxTotal);
  const r = Number(rate) / 100 / 12;
  const n = Number(years) * 12;
  const maxLoan = maxMonthly > 0 && r > 0 ? (maxMonthly * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n)) : 0;
  const maxPrice = maxLoan / (1 - Number(downPct) / 100);
  const downAmt = maxPrice * (Number(downPct) / 100);

  return (
    <CalcCard title="Affordability Calculator" icon="💰">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Field label="Monthly Gross Income" prefix="$" value={income} onChange={setIncome} step={500} />
        <Field label="Monthly Debt Payments" prefix="$" value={debts} onChange={setDebts} step={100} />
        <Field label="Interest Rate" suffix="%" value={rate} onChange={setRate} max={30} step={0.125} />
        <Field label="Loan Term" suffix="yrs" value={years} onChange={setYears} min={1} max={30} />
        <Field label="Down Payment" suffix="%" value={downPct} onChange={setDownPct} max={100} step={1} />
      </div>
      <div className="rounded-xl p-4" style={{ background: 'hsl(var(--noir-surface))' }}>
        <ResultRow label="Max Monthly Payment" value={fmtD(maxMonthly)} />
        <ResultRow label="Max Loan Amount" value={fmt(maxLoan)} />
        <ResultRow label="Down Payment Needed" value={fmt(downAmt)} />
        <ResultRow label="Max Home Price" value={fmt(maxPrice)} gold />
      </div>
    </CalcCard>
  );
}

function DownPaymentCalc() {
  const [price, setPrice] = useState('400000');
  const [downPct, setDownPct] = useState('20');
  const [savings, setSavings] = useState('2000');

  const downAmt = Number(price) * (Number(downPct) / 100);
  const loan = Number(price) - downAmt;
  const monthsNeeded = downAmt / Math.max(1, Number(savings));

  return (
    <CalcCard title="Down Payment Calculator" icon="📊">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Field label="Home Price" prefix="$" value={price} onChange={setPrice} step={1000} />
        <Field label="Down Payment %" suffix="%" value={downPct} onChange={setDownPct} max={100} step={1} />
        <Field label="Monthly Savings" prefix="$" value={savings} onChange={setSavings} min={1} step={100} />
      </div>
      <div className="rounded-xl p-4" style={{ background: 'hsl(var(--noir-surface))' }}>
        <ResultRow label="Down Payment Amount" value={fmt(downAmt)} gold />
        <ResultRow label="Loan Amount" value={fmt(loan)} />
        <ResultRow label="Months to Save" value={Math.ceil(monthsNeeded).toLocaleString()} />
        <ResultRow label="Years to Save" value={(monthsNeeded / 12).toFixed(1)} />
      </div>
    </CalcCard>
  );
}

function ClosingCostCalc() {
  const [price, setPrice] = useState('400000');
  const [loan, setLoan] = useState('320000');
  const [state, setState] = useState('FL');

  const docStamps = state === 'FL' ? Number(loan) * 0.0035 : Number(loan) * 0.002;
  const intangibleTax = state === 'FL' ? Number(loan) * 0.002 : 0;
  const titleIns = Number(price) * 0.00575;
  const origination = Number(loan) * 0.01;
  const prepaid = Number(loan) * 0.015;
  const fixed = 350 + 550 + 75 + 250;
  const total = docStamps + intangibleTax + titleIns + origination + prepaid + fixed;

  return (
    <CalcCard title="Closing Cost Estimator" icon="🔑">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Field label="Purchase Price" prefix="$" value={price} onChange={setPrice} step={1000} />
        <Field label="Loan Amount" prefix="$" value={loan} onChange={setLoan} step={1000} />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">State</label>
          <select value={state} onChange={(e) => setState(e.target.value)}
            className="rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors">
            <option value="FL">Florida</option>
            <option value="OTHER">Other State</option>
          </select>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: 'hsl(var(--noir-surface))' }}>
        <ResultRow label="Doc Stamps / Transfer Tax" value={fmtD(docStamps)} />
        {state === 'FL' && <ResultRow label="Intangible Tax (FL)" value={fmtD(intangibleTax)} />}
        <ResultRow label="Title Search & Insurance" value={fmtD(350 + titleIns)} />
        <ResultRow label="Origination Fee (1%)" value={fmtD(origination)} />
        <ResultRow label="Appraisal + Credit Report" value={fmtD(625)} />
        <ResultRow label="Recording Fees" value={fmtD(250)} />
        <ResultRow label="Prepaids (est.)" value={fmtD(prepaid)} />
        <ResultRow label="Estimated Total Closing Costs" value={fmt(total)} gold />
      </div>
    </CalcCard>
  );
}

function RefiBreakEvenCalc() {
  const [currentRate, setCurrentRate] = useState('7.5');
  const [newRate, setNewRate] = useState('6.875');
  const [balance, setBalance] = useState('300000');
  const [years, setYears] = useState('25');
  const [closingCosts, setClosingCosts] = useState('6000');

  const oldPayment = monthlyPayment(Number(balance), Number(currentRate), Number(years));
  const newPayment = monthlyPayment(Number(balance), Number(newRate), Number(years));
  const monthlySavings = oldPayment - newPayment;
  const breakEvenMonths = monthlySavings > 0 ? Number(closingCosts) / monthlySavings : Infinity;
  const fiveYearSavings = monthlySavings * 60 - Number(closingCosts);

  return (
    <CalcCard title="Refinance Break-Even" icon="🔄">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Field label="Current Rate" suffix="%" value={currentRate} onChange={setCurrentRate} max={30} step={0.125} />
        <Field label="New Rate" suffix="%" value={newRate} onChange={setNewRate} max={30} step={0.125} />
        <Field label="Remaining Balance" prefix="$" value={balance} onChange={setBalance} step={1000} />
        <Field label="Remaining Term" suffix="yrs" value={years} onChange={setYears} min={1} max={30} />
        <Field label="Closing Costs" prefix="$" value={closingCosts} onChange={setClosingCosts} step={500} />
      </div>
      <div className="rounded-xl p-4" style={{ background: 'hsl(var(--noir-surface))' }}>
        <ResultRow label="Current Payment" value={fmtD(oldPayment)} />
        <ResultRow label="New Payment" value={fmtD(newPayment)} />
        <ResultRow label="Monthly Savings" value={fmtD(monthlySavings)} gold />
        <ResultRow label="Break-Even Point" value={isFinite(breakEvenMonths) ? `${Math.ceil(breakEvenMonths)} months (${(breakEvenMonths / 12).toFixed(1)} yrs)` : 'N/A'} />
        <ResultRow label="5-Year Net Savings" value={fmtD(fiveYearSavings)} />
      </div>
    </CalcCard>
  );
}

function CashOutCalc() {
  const [homeValue, setHomeValue] = useState('500000');
  const [currentBalance, setCurrentBalance] = useState('250000');
  const [cashOut, setCashOut] = useState('50000');
  const [rate, setRate] = useState('6.875');
  const [years, setYears] = useState('30');

  const maxCashOut = Math.max(0, Number(homeValue) * 0.80 - Number(currentBalance));
  const newLoan = Number(currentBalance) + Number(cashOut);
  const newLTV = (newLoan / Number(homeValue)) * 100;
  const newPayment = monthlyPayment(newLoan, Number(rate), Number(years));
  const eligible = Number(cashOut) <= maxCashOut;

  return (
    <CalcCard title="Cash-Out Refinance" icon="📉">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Field label="Home Value" prefix="$" value={homeValue} onChange={setHomeValue} step={1000} />
        <Field label="Current Balance" prefix="$" value={currentBalance} onChange={setCurrentBalance} step={1000} />
        <Field label="Cash-Out Amount" prefix="$" value={cashOut} onChange={setCashOut} step={1000} />
        <Field label="New Rate" suffix="%" value={rate} onChange={setRate} max={30} step={0.125} />
        <Field label="New Term" suffix="yrs" value={years} onChange={setYears} min={1} max={30} />
      </div>
      <div className="rounded-xl p-4" style={{ background: 'hsl(var(--noir-surface))' }}>
        <ResultRow label="Max Cash-Out (80% LTV)" value={fmt(maxCashOut)} />
        <ResultRow label="New Loan Amount" value={fmt(newLoan)} />
        <ResultRow label="New LTV" value={newLTV.toFixed(1) + '%'} />
        <ResultRow label="New Monthly Payment" value={fmtD(newPayment)} gold />
        {!eligible && (
          <p className="text-xs mt-2" style={{ color: 'hsl(var(--destructive))' }}>
            ⚠ Exceeds 80% LTV limit. Max available: {fmt(maxCashOut)}.
          </p>
        )}
      </div>
    </CalcCard>
  );
}

function AmortizationCalc() {
  const [principal, setPrincipal] = useState('320000');
  const [rate, setRate] = useState('6.875');
  const [years, setYears] = useState('30');
  const [showAll, setShowAll] = useState(false);

  const payment = monthlyPayment(Number(principal), Number(rate), Number(years));
  const totalPaid = payment * Number(years) * 12;
  const totalInterest = totalPaid - Number(principal);
  const r = Number(rate) / 100 / 12;
  const totalMonths = Number(years) * 12;
  const displayMonths = showAll ? totalMonths : Math.min(24, totalMonths);

  const rows: { month: number; principal: number; interest: number; balance: number }[] = [];
  let bal = Number(principal);
  for (let i = 1; i <= displayMonths; i++) {
    const int = bal * r;
    const prin = payment - int;
    bal = Math.max(0, bal - prin);
    rows.push({ month: i, principal: prin, interest: int, balance: bal });
  }

  return (
    <CalcCard title="Amortization Schedule" icon="📅">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <Field label="Loan Amount" prefix="$" value={principal} onChange={setPrincipal} step={1000} />
        <Field label="Interest Rate" suffix="%" value={rate} onChange={setRate} max={30} step={0.125} />
        <Field label="Loan Term" suffix="yrs" value={years} onChange={setYears} min={1} max={30} />
      </div>
      <div className="rounded-xl p-4 mb-4" style={{ background: 'hsl(var(--noir-surface))' }}>
        <ResultRow label="Monthly Payment" value={fmtD(payment)} gold />
        <ResultRow label="Total Paid" value={fmt(totalPaid)} />
        <ResultRow label="Total Interest" value={fmt(totalInterest)} />
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: 'hsl(var(--noir-surface))' }}>
              {['Mo.', 'Payment', 'Principal', 'Interest', 'Balance'].map((h) => (
                <th key={h} className="px-3 py-2.5 text-left font-semibold text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.month} className="border-t border-border hover:bg-muted/40 transition-colors">
                <td className="px-3 py-2 text-muted-foreground">{row.month}</td>
                <td className="px-3 py-2">{fmtD(payment)}</td>
                <td className="px-3 py-2 text-gold-metallic">{fmtD(row.principal)}</td>
                <td className="px-3 py-2">{fmtD(row.interest)}</td>
                <td className="px-3 py-2">{fmt(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => setShowAll((v) => !v)}
        className="mt-3 text-xs font-semibold text-gold-metallic hover:opacity-80 transition-opacity">
        {showAll ? '▲ Show fewer rows' : `▼ Show all ${totalMonths} months`}
      </button>
    </CalcCard>
  );
}

function PMICalc() {
  const [price, setPrice] = useState('400000');
  const [down, setDown] = useState('40000');
  const [rate, setRate] = useState('6.875');
  const [years, setYears] = useState('30');

  const loan = Math.max(0, Number(price) - Number(down));
  const ltv = (loan / Number(price)) * 100;
  const needsPMI = ltv > 80;
  const pmiRate = ltv > 95 ? 0.012 : ltv > 90 ? 0.009 : ltv > 85 ? 0.007 : 0.005;
  const monthlyPMI = needsPMI ? (loan * pmiRate) / 12 : 0;
  const pi = monthlyPayment(loan, Number(rate), Number(years));
  const r = Number(rate) / 100 / 12;
  let bal = loan;
  let monthsTo80 = 0;
  const target80 = Number(price) * 0.80;
  while (bal > target80 && monthsTo80 < 360) {
    bal -= (pi - bal * r);
    monthsTo80++;
  }

  return (
    <CalcCard title="PMI Calculator" icon="📋">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Field label="Home Price" prefix="$" value={price} onChange={setPrice} step={1000} />
        <Field label="Down Payment" prefix="$" value={down} onChange={setDown} step={1000} />
        <Field label="Interest Rate" suffix="%" value={rate} onChange={setRate} max={30} step={0.125} />
        <Field label="Loan Term" suffix="yrs" value={years} onChange={setYears} min={1} max={30} />
      </div>
      <div className="rounded-xl p-4" style={{ background: 'hsl(var(--noir-surface))' }}>
        <ResultRow label="LTV Ratio" value={ltv.toFixed(1) + '%'} />
        <ResultRow label="PMI Required" value={needsPMI ? 'Yes' : 'No'} />
        {needsPMI && <ResultRow label="Monthly PMI" value={fmtD(monthlyPMI)} gold />}
        <ResultRow label="P&I Payment" value={fmtD(pi)} />
        <ResultRow label="Total Monthly (P&I + PMI)" value={fmtD(pi + monthlyPMI)} />
        {needsPMI && <ResultRow label="Months Until PMI Drops" value={`~${monthsTo80} months`} />}
      </div>
    </CalcCard>
  );
}

function APRCalc() {
  const [loan, setLoan] = useState('320000');
  const [rate, setRate] = useState('6.875');
  const [years, setYears] = useState('30');
  const [points, setPoints] = useState('1');
  const [fees, setFees] = useState('3500');

  const loanAmt = Number(loan);
  const totalFees = loanAmt * (Number(points) / 100) + Number(fees);
  const netProceeds = loanAmt - totalFees;
  const payment = monthlyPayment(loanAmt, Number(rate), Number(years));
  const n = Number(years) * 12;
  let aprGuess = Number(rate) / 100 / 12;
  for (let i = 0; i < 100; i++) {
    const pv = (payment * (1 - Math.pow(1 + aprGuess, -n))) / aprGuess;
    const dpv = (-payment * (Math.pow(1 + aprGuess, -n) * n)) / (aprGuess * (1 + aprGuess)) +
      (payment * (1 - Math.pow(1 + aprGuess, -n))) / (aprGuess * aprGuess);
    const next = aprGuess - (pv - netProceeds) / dpv;
    if (Math.abs(next - aprGuess) < 1e-10) break;
    aprGuess = next;
  }
  const apr = aprGuess * 12 * 100;

  return (
    <CalcCard title="APR Calculator" icon="📈">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Field label="Loan Amount" prefix="$" value={loan} onChange={setLoan} step={1000} />
        <Field label="Interest Rate" suffix="%" value={rate} onChange={setRate} max={30} step={0.125} />
        <Field label="Loan Term" suffix="yrs" value={years} onChange={setYears} min={1} max={30} />
        <Field label="Points" suffix="pts" value={points} onChange={setPoints} max={10} step={0.125} />
        <Field label="Other Fees" prefix="$" value={fees} onChange={setFees} step={100} />
      </div>
      <div className="rounded-xl p-4" style={{ background: 'hsl(var(--noir-surface))' }}>
        <ResultRow label="Note Rate" value={pct(Number(rate))} />
        <ResultRow label="Total Fees & Points" value={fmt(totalFees)} />
        <ResultRow label="Monthly Payment" value={fmtD(payment)} />
        <ResultRow label="APR" value={pct(apr)} gold />
      </div>
    </CalcCard>
  );
}

function PointsCalc() {
  const [loan, setLoan] = useState('320000');
  const [baseRate, setBaseRate] = useState('7.0');
  const [buydownRate, setBuydownRate] = useState('6.625');
  const [years, setYears] = useState('30');
  const [pointsCost, setPointsCost] = useState('3200');

  const oldPayment = monthlyPayment(Number(loan), Number(baseRate), Number(years));
  const newPayment = monthlyPayment(Number(loan), Number(buydownRate), Number(years));
  const monthlySavings = oldPayment - newPayment;
  const breakEven = monthlySavings > 0 ? Number(pointsCost) / monthlySavings : Infinity;

  return (
    <CalcCard title="Points Buy-Down Calculator" icon="🏦">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Field label="Loan Amount" prefix="$" value={loan} onChange={setLoan} step={1000} />
        <Field label="Base Rate (no points)" suffix="%" value={baseRate} onChange={setBaseRate} max={30} step={0.125} />
        <Field label="Bought-Down Rate" suffix="%" value={buydownRate} onChange={setBuydownRate} max={30} step={0.125} />
        <Field label="Loan Term" suffix="yrs" value={years} onChange={setYears} min={1} max={30} />
        <Field label="Cost of Points" prefix="$" value={pointsCost} onChange={setPointsCost} step={100} />
      </div>
      <div className="rounded-xl p-4" style={{ background: 'hsl(var(--noir-surface))' }}>
        <ResultRow label="Payment Without Points" value={fmtD(oldPayment)} />
        <ResultRow label="Payment With Points" value={fmtD(newPayment)} />
        <ResultRow label="Monthly Savings" value={fmtD(monthlySavings)} gold />
        <ResultRow label="Break-Even" value={isFinite(breakEven) ? `${Math.ceil(breakEven)} months` : 'N/A'} />
        <ResultRow label="5-Year Net Savings" value={fmtD(monthlySavings * 60 - Number(pointsCost))} />
      </div>
    </CalcCard>
  );
}

function HELOCCalc() {
  const [homeValue, setHomeValue] = useState('500000');
  const [mortgage, setMortgage] = useState('250000');
  const [drawAmt, setDrawAmt] = useState('50000');
  const [helocRate, setHelocRate] = useState('8.5');

  const maxHELOC = Math.max(0, Number(homeValue) * 0.85 - Number(mortgage));
  const monthlyInterest = (Number(drawAmt) * (Number(helocRate) / 100)) / 12;
  const eligible = Number(drawAmt) <= maxHELOC;

  return (
    <CalcCard title="HELOC Calculator" icon="🏗️">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Field label="Home Value" prefix="$" value={homeValue} onChange={setHomeValue} step={1000} />
        <Field label="Mortgage Balance" prefix="$" value={mortgage} onChange={setMortgage} step={1000} />
        <Field label="Draw Amount" prefix="$" value={drawAmt} onChange={setDrawAmt} step={1000} />
        <Field label="HELOC Rate" suffix="%" value={helocRate} onChange={setHelocRate} max={30} step={0.25} />
      </div>
      <div className="rounded-xl p-4" style={{ background: 'hsl(var(--noir-surface))' }}>
        <ResultRow label="Max HELOC (85% LTV)" value={fmt(maxHELOC)} gold />
        <ResultRow label="Available Equity" value={fmt(Number(homeValue) - Number(mortgage))} />
        <ResultRow label="Interest-Only Payment" value={fmtD(monthlyInterest)} />
        {!eligible && (
          <p className="text-xs mt-2" style={{ color: 'hsl(var(--destructive))' }}>
            ⚠ Draw exceeds max HELOC limit of {fmt(maxHELOC)}.
          </p>
        )}
      </div>
    </CalcCard>
  );
}

function LTVCalc() {
  const [price, setPrice] = useState('400000');
  const [loan, setLoan] = useState('320000');

  const ltv = (Number(loan) / Number(price)) * 100;
  const equity = Number(price) - Number(loan);
  const needsPMI = ltv > 80;
  const toRemovePMI = Math.max(0, Number(loan) - Number(price) * 0.80);

  return (
    <CalcCard title="LTV Calculator" icon="📐">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Field label="Property Value" prefix="$" value={price} onChange={setPrice} step={1000} />
        <Field label="Loan Amount" prefix="$" value={loan} onChange={setLoan} step={1000} />
      </div>
      <div className="rounded-xl p-4" style={{ background: 'hsl(var(--noir-surface))' }}>
        <ResultRow label="LTV Ratio" value={ltv.toFixed(2) + '%'} gold />
        <ResultRow label="Equity" value={fmt(equity)} />
        <ResultRow label="PMI Required" value={needsPMI ? 'Yes' : 'No'} />
        {needsPMI && <ResultRow label="Pay Down to Remove PMI" value={fmt(toRemovePMI)} />}
      </div>
    </CalcCard>
  );
}

function RentVsBuyCalc() {
  const [rent, setRent] = useState('2500');
  const [price, setPrice] = useState('400000');
  const [down, setDown] = useState('80000');
  const [rate, setRate] = useState('6.875');
  const [horizon, setHorizon] = useState('5');
  const [appreciation, setAppreciation] = useState('3');

  const loan = Number(price) - Number(down);
  const pi = monthlyPayment(loan, Number(rate), 30);
  const tax = (Number(price) * 0.012) / 12;
  const ins = (Number(price) * 0.003) / 12;
  const totalBuyCost = (pi + tax + ins) * Number(horizon) * 12 + Number(down);
  const totalRentCost = Number(rent) * Number(horizon) * 12;
  const futureValue = Number(price) * Math.pow(1 + Number(appreciation) / 100, Number(horizon));
  const equity = futureValue - loan;
  const netBuyCost = totalBuyCost - equity;

  return (
    <CalcCard title="Rent vs. Buy Calculator" icon="🏡">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Field label="Monthly Rent" prefix="$" value={rent} onChange={setRent} step={100} />
        <Field label="Home Price" prefix="$" value={price} onChange={setPrice} step={1000} />
        <Field label="Down Payment" prefix="$" value={down} onChange={setDown} step={1000} />
        <Field label="Mortgage Rate" suffix="%" value={rate} onChange={setRate} max={30} step={0.125} />
        <Field label="Time Horizon" suffix="yrs" value={horizon} onChange={setHorizon} min={1} max={30} />
        <Field label="Annual Appreciation" suffix="%" value={appreciation} onChange={setAppreciation} max={20} step={0.5} />
      </div>
      <div className="rounded-xl p-4" style={{ background: 'hsl(var(--noir-surface))' }}>
        <ResultRow label={`Total Rent Cost (${horizon} yrs)`} value={fmt(totalRentCost)} />
        <ResultRow label={`Total Buy Cost (${horizon} yrs)`} value={fmt(totalBuyCost)} />
        <ResultRow label="Future Home Value" value={fmt(futureValue)} />
        <ResultRow label="Equity Built" value={fmt(equity)} />
        <ResultRow label="Net Cost to Buy" value={fmt(netBuyCost)} gold />
        <p className="text-xs text-muted-foreground mt-2">
          {netBuyCost < totalRentCost
            ? '✅ Buying appears more cost-effective over this period.'
            : '📊 Renting may be more cost-effective — consider your timeline.'}
        </p>
      </div>
    </CalcCard>
  );
}

function VALoanCalc() {
  const [price, setPrice] = useState('400000');
  const [down, setDown] = useState('0');
  const [rate, setRate] = useState('6.5');
  const [years, setYears] = useState('30');
  const [firstUse, setFirstUse] = useState(true);

  const loan = Math.max(0, Number(price) - Number(down));
  const downRatio = Number(down) / Number(price);
  const fundingFeePct = downRatio >= 0.10 ? 1.25 : downRatio >= 0.05 ? 1.50 : firstUse ? 2.15 : 3.30;
  const fundingFee = loan * (fundingFeePct / 100);
  const totalLoan = loan + fundingFee;
  const payment = monthlyPayment(totalLoan, Number(rate), Number(years));

  return (
    <CalcCard title="VA Loan Calculator" icon="🎖️">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Field label="Purchase Price" prefix="$" value={price} onChange={setPrice} step={1000} />
        <Field label="Down Payment" prefix="$" value={down} onChange={setDown} step={1000} />
        <Field label="Interest Rate" suffix="%" value={rate} onChange={setRate} max={30} step={0.125} />
        <Field label="Loan Term" suffix="yrs" value={years} onChange={setYears} min={1} max={30} />
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">First VA Loan Use?</label>
          <div className="flex gap-3">
            {([true, false] as const).map((v) => (
              <button key={String(v)} onClick={() => setFirstUse(v)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${firstUse === v ? 'border-primary text-white' : 'border-border text-muted-foreground'}`}
                style={firstUse === v ? { background: 'hsl(var(--gold-glow) / 0.1)' } : {}}>
                {v ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: 'hsl(var(--noir-surface))' }}>
        <ResultRow label="Base Loan Amount" value={fmt(loan)} />
        <ResultRow label={`VA Funding Fee (${fundingFeePct}%)`} value={fmtD(fundingFee)} />
        <ResultRow label="Total Loan with Fee" value={fmt(totalLoan)} />
        <ResultRow label="Monthly Payment" value={fmtD(payment)} gold />
        <ResultRow label="No PMI Required" value="✅ $0/mo" />
      </div>
    </CalcCard>
  );
}

function FHACalc() {
  const [price, setPrice] = useState('400000');
  const [down, setDown] = useState('14000');
  const [rate, setRate] = useState('6.75');
  const [years, setYears] = useState('30');

  const loan = Math.max(0, Number(price) - Number(down));
  const downPct = Number(down) / Number(price);
  const ufmip = loan * 0.0175;
  const totalLoan = loan + ufmip;
  const payment = monthlyPayment(totalLoan, Number(rate), Number(years));
  const annualMIPRate = downPct < 0.10 ? 0.0055 : 0.005;
  const monthlyMIP = (totalLoan * annualMIPRate) / 12;

  return (
    <CalcCard title="FHA Loan Calculator" icon="🏦">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Field label="Purchase Price" prefix="$" value={price} onChange={setPrice} step={1000} />
        <Field label="Down Payment" prefix="$" value={down} onChange={setDown} step={1000} />
        <Field label="Interest Rate" suffix="%" value={rate} onChange={setRate} max={30} step={0.125} />
        <Field label="Loan Term" suffix="yrs" value={years} onChange={setYears} min={1} max={30} />
      </div>
      <div className="rounded-xl p-4" style={{ background: 'hsl(var(--noir-surface))' }}>
        <ResultRow label="Down Payment %" value={(downPct * 100).toFixed(1) + '%'} />
        <ResultRow label="UFMIP (1.75%)" value={fmtD(ufmip)} />
        <ResultRow label="Total Loan Amount" value={fmt(totalLoan)} />
        <ResultRow label="P&I Payment" value={fmtD(payment)} />
        <ResultRow label="Monthly MIP" value={fmtD(monthlyMIP)} />
        <ResultRow label="Total Monthly Payment" value={fmtD(payment + monthlyMIP)} gold />
        <ResultRow label="MIP Duration" value={downPct < 0.10 ? 'Life of loan' : '11 years'} />
      </div>
    </CalcCard>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const tabs = [
  {
    id: 'purchase',
    label: 'Purchase',
    icon: '🏠',
    calcs: [<MortgagePaymentCalc key="mp" />, <AffordabilityCalc key="aff" />, <DownPaymentCalc key="dp" />, <ClosingCostCalc key="cc" />],
  },
  {
    id: 'refinance',
    label: 'Refinance',
    icon: '🔄',
    calcs: [<RefiBreakEvenCalc key="rbe" />, <CashOutCalc key="co" />, <AmortizationCalc key="am" />],
  },
  {
    id: 'rates',
    label: 'Rates & Costs',
    icon: '📈',
    calcs: [<PMICalc key="pmi" />, <APRCalc key="apr" />, <PointsCalc key="pts" />],
  },
  {
    id: 'equity',
    label: 'Equity & Investing',
    icon: '🏗️',
    calcs: [<HELOCCalc key="heloc" />, <LTVCalc key="ltv" />, <RentVsBuyCalc key="rvb" />],
  },
  {
    id: 'vafha',
    label: 'VA & FHA',
    icon: '🎖️',
    calcs: [<VALoanCalc key="va" />, <FHACalc key="fha" />],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState('purchase');
  const active = tabs.find((t) => t.id === activeTab)!;

  return (
    <>
      <Helmet>
        <title>Mortgage Calculators | Mortgage Camp</title>
        <meta name="description" content="Free interactive mortgage calculators — payment, affordability, refinance, PMI, APR, VA, FHA, HELOC, and more. Run the numbers right here." />
        <link rel="canonical" href={siteUrl + '/calculators'} />
        <meta property="og:title" content="Mortgage Calculators | Mortgage Camp" />
        <meta property="og:url" content={siteUrl + '/calculators'} />
        <meta property="og:type" content="website" />
      </Helmet>
      <main>
        <h1 className="sr-only">Mortgage Calculators</h1>
        <PageHero
          eyebrow="Free Tools"
          title="Run the numbers"
          highlight="yourself."
          subtitle="13 fully interactive mortgage calculators — no links, no redirects. Everything you need to plan your mortgage right here."
        />

        <section className="py-16 px-6 bg-background">
          <div className="max-w-6xl mx-auto">
            {/* Tab bar */}
            <div role="tablist" aria-label="Calculator categories" className="flex flex-wrap gap-2 mb-10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`tabpanel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-white border-primary'
                      : 'text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                  }`}
                  style={activeTab === tab.id ? { background: 'hsl(var(--gold-glow) / 0.10)' } : {}}
                >
                  <span aria-hidden="true">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Calculator panels */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                id={`tabpanel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`tab-${activeTab}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {active.calcs}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <CtaBanner />
      </main>
    </>
  );
}
