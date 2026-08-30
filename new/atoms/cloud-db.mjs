/** חוט · cloud-db — שער-ידית Firestore: מחזיר את הידית או זורק בעברית כשהענן לא אותחל.
 *  חוזה: cloud-db.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:266-275 (cloudDb + העוזר הפרטי requireDb
 *  אוחד פנימה); משתנה-המודול fsDb הוזרק כשקע-קלט (חוק-1 — אפס import פנימי;
 *  חוק-6 — החזקת-הידית היא חיווט-הצבה של הקופסה). */
export function cloudDb(fsDb, T) {
  if (!fsDb) throw new Error(T.k1);
  return fsDb;
}
