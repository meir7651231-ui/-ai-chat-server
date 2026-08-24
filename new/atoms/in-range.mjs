/** חוט · in-range — האם תאריך-ISO בתוך טווח {from,to} (השוואה לקסיקוגרפית, גבולות כוללים).
 *  חוזה: in-range.contract.md · חולץ כלשונו מ-maor/src/components/reports/lib.ts:25-30. */
export function inRange(iso, r) {
  if (!iso) return false;
  if (r.from && iso < r.from) return false;
  if (r.to && iso > r.to) return false;
  return true;
}
