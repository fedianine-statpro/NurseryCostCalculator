// @ts-check
/**
 * Nursery Cost Calculator — Refactored
 * - No jQuery dependency
 * - Strict parsing & validation
 * - Accessible, live-updating results
 * - Funding averaged over 12 months (38 funded weeks/year)
 * - Caps savings so you never subtract more than your bill
 * - Friendly currency formatting using Intl.NumberFormat
 */

(function () {
  /** @type {HTMLFormElement} */
  const form = /** @type {any} */(document.getElementById('calcForm'));
  const resultEl = document.getElementById('result');
  const weeklyHoursEl = /** @type {HTMLInputElement} */(document.getElementById('weeklyHours'));
  const weeklyFundedEl = /** @type {HTMLSelectElement} */(document.getElementById('weeklyFundedHours'));
  const govRateEl = /** @type {HTMLInputElement} */(document.getElementById('governmentRate'));
  const rateMonthlyEl = /** @type {HTMLInputElement} */(document.getElementById('rateMonthly'));
  const rateHourlyEl = /** @type {HTMLInputElement} */(document.getElementById('rateHourly'));
  const monthlyGroup = document.getElementById('monthlyRateGroup');
  const hourlyGroup = document.getElementById('hourlyRateGroup');
  const monthlyRateEl = /** @type {HTMLInputElement} */(document.getElementById('monthlyRate'));
  const hourlyRateEl = /** @type {HTMLInputElement} */(document.getElementById('hourlyRate'));
  const capNoticeEl = document.getElementById('capNotice');
  const resetBtn = /** @type {HTMLButtonElement} */(document.getElementById('resetBtn'));

  /** Constants */
  const WEEKS_PER_YEAR = 52;
  const FUNDED_WEEKS_PER_YEAR = 38;
  const MONTHS_PER_YEAR = 12;

  /** GBP currency formatter */
  const GBP = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

  /**
   * Parse a numeric input safely.
   * @param {HTMLInputElement} el
   * @returns {number|null}
   */
  function readNumber(el) {
    const v = el.value.trim();
    if (v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  /** Show/hide rate groups */
  function syncRateType() {
    const monthly = rateMonthlyEl.checked;
    monthlyGroup?.classList.toggle('d-none', !monthly);
    hourlyGroup?.classList.toggle('d-none', monthly);
    // toggle required
    monthlyRateEl.required = monthly;
    hourlyRateEl.required = !monthly;
  }

  /**
   * Core calculation — returns a robust breakdown
   * @param {Object} p
   * @param {'monthly'|'hourly'} p.rateType
   * @param {number|null} p.monthlyRate
   * @param {number|null} p.hourlyRate
   * @param {number} p.weeklyHours
   * @param {number} p.weeklyFundedHours
   * @param {number} p.govRate
   */
  function calculate(p) {
    // Base monthly cost (without funding)
    let monthlyBase;
    if (p.rateType === 'monthly') {
      if (p.monthlyRate == null) throw new Error('Monthly rate is required.');
      monthlyBase = p.monthlyRate;
    } else {
      if (p.hourlyRate == null) throw new Error('Hourly rate is required.');
      const weeklyCost = p.weeklyHours * p.hourlyRate;
      monthlyBase = weeklyCost * (WEEKS_PER_YEAR / MONTHS_PER_YEAR);
    }

    // Cap funded hours to actual attendance
    const fundedHoursUsed = Math.min(p.weeklyFundedHours, p.weeklyHours);
    const weeklyFunding = fundedHoursUsed * p.govRate;
    const monthlyFundingAvg = weeklyFunding * (FUNDED_WEEKS_PER_YEAR / MONTHS_PER_YEAR);

    // You can never save more than you pay
    const monthlySavings = Math.min(monthlyBase, monthlyFundingAvg);
    const monthlyAfterFunding = Math.max(0, monthlyBase - monthlySavings);

    // Effective hourly rate calculations
    const monthlyHoursAttended = p.weeklyHours * (WEEKS_PER_YEAR / MONTHS_PER_YEAR);
    const effectiveHourlyBefore = monthlyBase / (monthlyHoursAttended || 1);
    const effectiveHourlyAfter = monthlyAfterFunding / (monthlyHoursAttended || 1);

    return {
      monthlyBase,
      monthlyFundingAvg,
      monthlySavings,
      monthlyAfterFunding,
      fundedHoursUsed,
      monthlyHoursAttended,
      effectiveHourlyBefore,
      effectiveHourlyAfter
    };
  }

  /** Render the result breakdown as HTML */
  function renderResult(model) {
    if (!resultEl) return;
    const rows = [
      ['Monthly cost (before funding)', GBP.format(model.monthlyBase)],
      ['Average monthly funding applied', '− ' + GBP.format(model.monthlyFundingAvg)],
      ['Monthly cost (after funding)', GBP.format(model.monthlyAfterFunding)],
      ['Monthly savings from funding', GBP.format(model.monthlySavings)],
      ['Funded hours used per week', model.fundedHoursUsed.toFixed(1) + ' h'],
      ['Avg hours attended per month', model.monthlyHoursAttended.toFixed(1) + ' h'],
      ['Effective hourly (before)', GBP.format(model.effectiveHourlyBefore) + '/h'],
      ['Effective hourly (after)', GBP.format(model.effectiveHourlyAfter) + '/h']
    ];

    resultEl.innerHTML = [
      '<ul class="list-group mb-3">',
      ...rows.map(([k, v]) => `<li class="list-group-item"><span class="result-key">${k}</span><strong class="result-val">${v}</strong></li>`),
      '</ul>'
    ].join('');
  }

  /** Validate inputs; return a message if invalid, else null */
  function validate() {
    const weeklyHours = readNumber(weeklyHoursEl);
    const govRate = readNumber(govRateEl);
    const rateType = rateMonthlyEl.checked ? 'monthly' : 'hourly';
    const monthlyRate = readNumber(monthlyRateEl);
    const hourlyRate = readNumber(hourlyRateEl);

    if (!weeklyHours || weeklyHours <= 0) return 'Please enter total hours attended per week.';
    if (!govRate || govRate < 0) return 'Please enter a non‑negative government rate per hour.';
    if (rateType === 'monthly' && (monthlyRate == null || monthlyRate < 0)) return 'Please enter a non‑negative monthly rate.';
    if (rateType === 'hourly' && (hourlyRate == null || hourlyRate < 0)) return 'Please enter a non‑negative hourly rate.';

    return null;
  }

  /** Handle submit */
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const vErr = validate();
    if (vErr) {
      if (resultEl) resultEl.innerHTML = `<div class="alert alert-warning" role="alert">${vErr}</div>`;
      return;
    }

    const weeklyHours = /** @type {number} */(readNumber(weeklyHoursEl));
    const weeklyFundedHours = Number(weeklyFundedEl.value);
    const govRate = /** @type {number} */(readNumber(govRateEl));
    const rateType = rateMonthlyEl.checked ? 'monthly' : 'hourly';
    const monthlyRate = readNumber(monthlyRateEl);
    const hourlyRate = readNumber(hourlyRateEl);

    // Show cap notice if applicable
    const capped = weeklyFundedHours > weeklyHours;
    capNoticeEl?.classList.toggle('d-none', !capped);
    if (capped) {
      if (capNoticeEl) capNoticeEl.textContent = `Note: funded hours were capped to ${weeklyHours} h/week (cannot exceed attendance).`;
    }

    const model = calculate({
      rateType,
      monthlyRate,
      hourlyRate,
      weeklyHours,
      weeklyFundedHours,
      govRate
    });

    renderResult(model);
  });

  /** Toggle rate type UI */
  [rateMonthlyEl, rateHourlyEl].forEach(el =>
    el.addEventListener('change', () => {
      syncRateType();
      if (resultEl) resultEl.innerHTML = '';
    })
  );

  /** Reset form */
  resetBtn?.addEventListener('click', () => {
    form.reset();
    syncRateType();
    if (resultEl) resultEl.innerHTML = '';
    capNoticeEl?.classList.add('d-none');
  });

  // Initial state
  syncRateType();
})();