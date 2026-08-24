/** חוט · start-campaign — פתיחת קמפיין-חיוג: דדופ + סינון-falsy, הסדר נשמר.
 *  חוזה: start-campaign.contract.md
 *  חולץ כלשונו מ-maor/src/lib/dialer.ts:25-36; החותמת iso מוזרקת (אין שעון
 *  בתוך האטום — חוק-5), אפס import פנימי (חוק-1). */
export function startCampaign(name, ids, iso) {
  const seen = new Set();
  const queue = [];
  for (const id of ids) {
    if (!id || seen.has(id)) continue;
    seen.add(id);
    queue.push(id);
  }
  return { name, startedAt: iso, queue, total: queue.length, log: [] };
}
