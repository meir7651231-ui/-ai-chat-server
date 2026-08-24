/** חוט · guard-export — שער יציאת-מידע: מותר ⇒ true; חסום ⇒ מריץ התרעה ומחזיר false.
 *  חוזה: guard-export.contract.md
 *  חולץ כלשונו מ-maor/src/lib/exportGate.ts:33-39; מצב-המודול (blocked/notify,
 *  שנקבע שם ב-setExportBlocked) הוזרק כשקעים (חוק-1 + חוק-5 — אפס מצב-חבוי). */
export function guardExport(blocked, notify) {
  if (blocked) {
    notify?.();
    return false;
  }
  return true;
}
