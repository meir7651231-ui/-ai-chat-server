/** חוט · intel-donor-scan — Golden. חוזה: intel-donor-scan.contract.md
 * מוצא: intel.ts:49 (donorScan) + monthsBefore:25 (inline) + MS_DAY (לא נחוץ כאן). חוק-4 verbatim.
 * מעבר-יחיד על אירועי-הנתינה: count/ils/first/last + סדרה-חודשית (ישן→חדש). טהור.
 */
export function donorScan(sp, todayIso, rate = 3.7, months = 12) {
  const monthsBefore = (iso) => {
    const y = +iso.slice(0, 4), m = +iso.slice(5, 7);
    const ty = +todayIso.slice(0, 4), tm = +todayIso.slice(5, 7);
    if (!y || !m || !ty || !tm) return -1;
    return ty * 12 + tm - (y * 12 + m);
  };
  const monthly = new Array(months).fill(0);
  let count = 0, ils = 0, first = '', last = '';
  const take = (date, amount, cur) => {
    if (!date) return;
    count++;
    const v = (cur || '₪') === '$' ? amount * rate : amount;
    ils += v;
    if (!first || date < first) first = date;
    if (!last || date > last) last = date;
    const mb = monthsBefore(date);
    if (mb >= 0 && mb < months) monthly[months - 1 - mb] += v;
  };
  const dons = sp.donations;
  for (let i = 0; i < dons.length; i++) take(dons[i].date, dons[i].amount, dons[i].cur);
  const hist = sp.hist;
  if (hist) for (let i = 0; i < hist.length; i++) take(hist[i].d, hist[i].a, hist[i].c);
  return { count, ils, first, last, monthly };
}
