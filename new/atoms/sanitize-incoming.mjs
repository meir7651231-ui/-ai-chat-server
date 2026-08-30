/** חוט · sanitize-incoming — חיזוק מסמך-ישות מרוחק: שדות-רשימה תמיד מערכים.
 *  חוזה: sanitize-incoming.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud-merge.ts:18-40; טבלת LIST_FIELDS —
 *  קבוע-מנגנון מקובץ-המקור — מוטבעת כלשונה. אפס שקעים. */

export function sanitizeIncoming(col, item, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  const LIST_FIELDS = {
    families: [T.k1, T.k2],
    enrollments: [T.k3, T.k4],
    supporters: [T.k5],
    // קופות צדקה — ריקונים ולוג ניקוד (BUILD-ORDER-TZEDAKA)
    tzBoxes: [T.k6],
    tzCoordinators: [T.k7],
    // חנות — רכיבי מוצר, מימושים וקריטריונים (BUILD-ORDER-SHOP)
    shopProducts: [T.k8],
    shopAssignments: [T.k9, T.k10],
    // רשימת ההמתנה על הפריט (SHOP6 חנות 27)
    shopItems: [T.k11],
  };

  const fields = LIST_FIELDS[col];
  if (!fields) return item;
  let out = item;
  for (const f of fields) {
    if (!Array.isArray(out[f])) out = { ...out, [f]: [] };
  }
  return out;
}
