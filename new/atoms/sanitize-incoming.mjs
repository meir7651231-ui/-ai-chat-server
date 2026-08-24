/** חוט · sanitize-incoming — חיזוק מסמך-ישות מרוחק: שדות-רשימה תמיד מערכים.
 *  חוזה: sanitize-incoming.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud-merge.ts:18-40; טבלת LIST_FIELDS —
 *  קבוע-מנגנון מקובץ-המקור — מוטבעת כלשונה. אפס שקעים. */
const LIST_FIELDS = {
  families: ['members', 'docs'],
  enrollments: ['payments', 'absences'],
  supporters: ['donations'],
  // קופות צדקה — ריקונים ולוג ניקוד (BUILD-ORDER-TZEDAKA)
  tzBoxes: ['collections'],
  tzCoordinators: ['scoreLog'],
  // חנות — רכיבי מוצר, מימושים וקריטריונים (BUILD-ORDER-SHOP)
  shopProducts: ['components'],
  shopAssignments: ['redemptions', 'criterionIds'],
  // רשימת ההמתנה על הפריט (SHOP6 חנות 27)
  shopItems: ['waits'],
};

export function sanitizeIncoming(col, item) {
  const fields = LIST_FIELDS[col];
  if (!fields) return item;
  let out = item;
  for (const f of fields) {
    if (!Array.isArray(out[f])) out = { ...out, [f]: [] };
  }
  return out;
}
