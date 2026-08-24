/** חוט · time-cost-total — עלות-העבודה: סכום (שעות × תעריף) של רשומות-השעתון.
 *  חוזה: time-cost-total.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:109-113. */
export function timeCostTotal(a) {
  return (a.time || []).reduce((t, e) => t + (+e.hours || 0) * (e.rate || 0), 0);
}
