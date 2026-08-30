/** חוט · sup12m — מונה "תרמו ב-12 החודשים": כמה תורמים שתאריך-התרומה-האחרונה שלהם
 *  (כולל היסטוריה) בתוך 365 הימים שקדמו להיום-המוזרק (כולל יום-הסף עצמו).
 *  חוזה: sup12m.contract.md · חולץ כלשונו מ-maor/src/components/supporters/lib.ts:198-211;
 *  השכן supLast הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function sup12m(supporters, todayIso, supLast, T) {
  const d = new Date(todayIso + 'T12:00:00');
  d.setDate(d.getDate() - T.k1);
  const p2 = (n) => String(n).padStart(2, '0');
  const cut = `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
  let n = 0;
  for (const sp of supporters) {
    const last = supLast(sp);
    if (last && last >= cut) n++;
  }
  return n;
}
