/** חוט · delete-org-join-request — מחיקת בקשת-הצטרפות של עובד/ת. חוזה: delete-org-join-request.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:223-232; שכני firebase/firestore
 *  (cloudDb·doc·deleteDoc) הוזרקו כאובייקט-שקעים fs (חוק-1 — אפס import פנימי). */
export async function deleteOrgJoinRequest(slug, uid, fs, T) {
  const { db, doc, deleteDoc } = fs;
  await deleteDoc(doc(db, T.k1, slug, T.k2, uid));
}
