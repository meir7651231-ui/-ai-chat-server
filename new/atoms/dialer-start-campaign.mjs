/** חוט · dialer-start-campaign — Golden. חוזה: dialer-start-campaign.contract.md
 * מוצא: maor-system/src/lib/dialer.ts:25 (startCampaign). חוק-4 verbatim. פתיחת-קמפיין (דדופ+סינון-ריקים, סדר נשמר). טהור.
 */
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
