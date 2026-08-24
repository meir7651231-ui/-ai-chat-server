/** חוט · plan-label-of — תווית-המסלול בשורת-תלמיד/ה (הקפאה/סיום/חיסורים/חוב).
 *  חוזה: plan-label-of.contract.md · שקעים: planWord, payBal
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts (קריאות-השכן שוקעו). */
export function planLabelOf(e, planWord, payBal) {
  let s = e.plan === 'punch' ? 'כרטיסייה · ' + e.purchased : planWord(e.plan);
  if (e.status === 'paused') s += ' · מוקפא ⏸';
  else if (e.status === 'ended') s += ' · הסתיים';
  if (e.absences.length) s += ' · ' + e.absences.length + ' חיס׳';
  const bal = payBal(e);
  if (bal > 0) s += ' · 💳 ₪' + bal;
  return s;
}
