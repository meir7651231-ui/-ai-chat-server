/** חוט · cockpit-thanks — Golden. חוזה: cockpit-thanks.contract.md
 * מוצא: cockpit.ts:150 (cockpitThanks) + latestDonation:133 (inline) + COCKPIT_THANK_DAYS=3 (inline). חוק-4 verbatim.
 * תודות ממתינות = תרומה ב-windowDays האחרונים. מהחדש לישן. שקע: daysSince (אח).
 */
export function cockpitThanks(supporters, todayIso, windowDays = 3, { daysSince }, T) {
  const latestDonation = (sp) => {
    let best = null;
    for (const d of sp.donations) { if (!d.date) continue; if (!best || d.date > best.date) best = { date: d.date, amount: d.amount, cur: d.cur || '₪' }; }
    for (const h of sp.hist ?? []) { if (!h.d) continue; if (!best || h.d > best.date) best = { date: h.d, amount: h.a, cur: h.c || '₪' }; }
    return best;
  };
  const tasks = [];
  for (const sp of supporters) {
    const last = latestDonation(sp);
    if (!last) continue;
    const ago = daysSince(last.date, todayIso);
    if (ago < 0 || ago > windowDays) continue;
    const money = last.cur === '$' ? '$' + last.amount.toLocaleString('en-US') : '₪' + last.amount.toLocaleString('he-IL');
    tasks.push({ id: T.k1 + sp.id, kind: T.k2, supId: sp.id, name: sp.name, phone: sp.phone || '', email: sp.email || '', reason: T.k3 + money + ' · ' + (ago <= 0 ? T.k4 : T.k5 + ago + T.k6), severity: T.k7, sort: windowDays - ago });
  }
  return tasks.sort((a, b) => b.sort - a.sort);
}
