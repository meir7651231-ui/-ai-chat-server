/** חוט · cockpit-feed — Golden. חוזה: cockpit-feed.contract.md
 * מוצא: cockpit.ts:299 (cockpitFeed). חוק-4 verbatim. N אירועים אחרונים, מהחדש לישן.
 * שקע: orgCalEntries (אטום-Genesis).
 */
export function cockpitFeed(supporters, limit = 8, { orgCalEntries }) {
  return orgCalEntries(supporters)
    .filter((e) => e.date)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, limit)
    .map((e, i) => {
      const money = e.amount > 0 ? (e.cur === '$' ? '$' + e.amount.toLocaleString('en-US') : '₪' + e.amount.toLocaleString('he-IL')) : '';
      return { id: (e.spId ?? 'x') + ':' + e.date + ':' + i, date: e.date, who: e.name ?? '', what: money ? 'תרם/ה ' + money : e.src || '', spId: e.spId };
    });
}
