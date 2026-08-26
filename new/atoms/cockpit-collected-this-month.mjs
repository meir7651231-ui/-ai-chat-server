/** חוט · cockpit-collected-this-month — Golden. חוזה: cockpit-collected-this-month.contract.md
 * מוצא: cockpit.ts:199 (cockpitCollectedThisMonth). טהור. חוק-4 verbatim.
 * סכום שנגבה החודש (ש״ח-שקול) — קבלות (donations) + hist בחודש-הנוכחי; $⇒*rate; מעוגל.
 */
export function cockpitCollectedThisMonth(supporters, todayIso, rate = 3.7) {
  const month = todayIso.slice(0, 7);
  let sum = 0;
  for (const sp of supporters) {
    for (const d of sp.donations) {
      if (!d.date.startsWith(month)) continue;
      sum += (d.cur || '₪') === '$' ? d.amount * rate : d.amount;
    }
    for (const h of sp.hist ?? []) {
      if (!(h.d || '').startsWith(month)) continue;
      sum += (h.c || '₪') === '$' ? h.a * rate : h.a;
    }
  }
  return Math.round(sum);
}
