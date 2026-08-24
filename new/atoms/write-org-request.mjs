/** חוט · write-org-request — בקשת-הרשמה ממתינה ⇒ platformRequests/{uid} (כתיבה מלאה).
 *  חוזה: write-org-request.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:172-175 (תורגם TS→JS); ‏cloudDb
 *  וערכת-Firestore (doc/setDoc) הוזרקו כאובייקט-שקעים fs (חוק-1 — אפס import פנימי).
 *  המסמך היחיד שנרשם-חדש רשאי לכתוב (Rules v2 — האכיפה בענן). */
export async function writeOrgRequest(uid, req, fs) {
  const { db, doc, setDoc } = fs;
  await setDoc(doc(db, 'platformRequests', uid), JSON.parse(JSON.stringify(req)));
}
