/** חוט · plan-label-of — תווית-המסלול בשורת-תלמיד/ה (הקפאה/סיום/חיסורים/חוב).
 *  חוזה: plan-label-of.contract.md · שקעים: planWord, payBal
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts (קריאות-השכן שוקעו). */
export function planLabelOf(e, planWord, payBal, T) {
  let s = e.plan === T.k1 ? T.k2 + e.purchased : planWord(e.plan);
  if (e.status === T.k3) s += T.k4;
  else if (e.status === T.k5) s += T.k6;
  if (e.absences.length) s += ' · ' + e.absences.length + T.k7;
  const bal = payBal(e);
  if (bal > 0) s += ' · 💳 ₪' + bal;
  return s;
}
