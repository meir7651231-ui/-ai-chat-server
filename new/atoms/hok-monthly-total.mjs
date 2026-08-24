/** חוט · hok-monthly-total — סה"כ הו"ק חודשי פעיל בש"ח-שקול. חוזה: hok-monthly-total.contract.md
 *  שקע: hokEffectivelyActive (חוק-1 — קריאה-לשכן הוזרקה כפרמטר; נקרא רק כש-todayIso סופק).
 *  חולץ כלשונו מ-maor/src/components/supporters/lib.ts:734-742. */
export function hokMonthlyTotal(supporters, usdRate, todayIso, hokEffectivelyActive) {
  const active = (sp) => (todayIso ? hokEffectivelyActive(sp, todayIso) : !!sp.hok?.active);
  return Math.round(supporters.reduce((a, sp) => {
    if (!active(sp) || !sp.hok) return a;
    return a + (sp.hok.cur === '$' ? sp.hok.amount * usdRate : sp.hok.amount);
  }, 0));
}
