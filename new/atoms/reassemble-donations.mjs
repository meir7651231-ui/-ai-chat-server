/** חוט · reassemble-donations — הרכבת תומך חזרה ממסמכי-תרומה בענן (מסלול-B, טהור).
 *  חוזה: reassemble-donations.contract.md
 *  חולץ כלשונו מ-maor/src/lib/donationPartition.ts:66-102, כולל המיון הפרטי
 *  byDateThenRid (חלק מהיחידה — דטרמיניזם חוצה-מכשירים). אפס import (חוק-1). */

/** מיון-תרומות דטרמיניסטי: תאריך ואז rid — יציב חוצה-מכשירים
 *  (מסמכי-ענן נמשכים ללא-סדר). */
function byDateThenRid(a, b) {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  if (a.rid !== b.rid) return a.rid < b.rid ? -1 : 1;
  return 0;
}

export function reassembleDonations(base, docs) {
  const donations = docs
    .filter((x) => x.supporterId === base.id)
    .map((x) => x.donation)
    .sort(byDateThenRid);
  return { ...base, donations };
}
