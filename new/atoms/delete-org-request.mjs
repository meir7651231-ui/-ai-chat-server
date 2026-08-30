/** חוט · delete-org-request — מחיקת בקשת-הרשמה מלוח-הבקרה. חוזה: delete-org-request.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:168-172; שכני firebase/firestore
 *  (cloudDb·doc·deleteDoc) הוזרקו כאובייקט-שקעים fs (חוק-1 — אפס import פנימי). */
export async function deleteOrgRequest(uid, fs, T) {
  const { db, doc, deleteDoc } = fs;
  await deleteDoc(doc(db, T.k1, uid));
}
