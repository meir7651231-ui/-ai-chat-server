/** חוט · phone-issue — אבחון תקינות מספר-טלפון (null=תקין).
 *  חוזה: phone-issue.contract.md · טהור, אפס-שקעים.
 *  חולץ כלשונו מ-maor/src/lib/audit.ts (כולל העוזר-הפרטי digits). */
const digits = (x) => (x || '').replace(/\D/g, '');

export function phoneIssue(p) {
  if (!p || p === '-') return null;
  const d = digits(p);
  if ((d.length === 9 || d.length === 10) && d[0] === '0') return null;
  if (d.length === 8) return 'כנראה חסרה ספרת 0 מובילה: ' + p;
  if (d.length < 7) return 'קצר מדי: ' + p;
  if (d[0] !== '0') return 'לא מתחיל ב-0: ' + p;
  return 'אורך חריג (' + d.length + ' ספרות): ' + p;
}
