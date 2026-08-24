/** חוט · write-org-join-request — בקשת-הצטרפות של עובד/ת ⇒ platformOrgs/{slug}/joinRequests/{uid}.
 *  חוזה: write-org-join-request.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:211-214 (תורגם TS→JS); ‏cloudDb
 *  וערכת-Firestore (doc/setDoc) הוזרקו כאובייקט-שקעים fs (חוק-1 — אפס import פנימי).
 *  כתיבה מלאה בלי merge — שליחה-חוזרת מחליפה את הבקשה הקודמת. */
export async function writeOrgJoinRequest(slug, uid, req, fs) {
  const { db, doc, setDoc } = fs;
  await setDoc(doc(db, 'platformOrgs', slug, 'joinRequests', uid), JSON.parse(JSON.stringify(req)));
}
