/** חוט · encrypt-existing-cloud — מיגרציית-הצפנה: כל ה-DB נדחף מחדש מוצפן.
 *  חוזה: encrypt-existing-cloud.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:481-489; השכנים pushDiff·fullDbDiff·supKeyMapOf
 *  הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export async function encryptExistingCloud(db, dek, pushDiff, fullDbDiff, supKeyMapOf) {
  // אכיפת-נתונים: אם דלוקה, גם מיגרציית-ההצפנה שומרת skey על אוספים-נאכפים.
  await pushDiff(fullDbDiff(db), dek, supKeyMapOf(db.supporters));
}
