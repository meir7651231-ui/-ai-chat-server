/** חוט · write-org-cloud-doc — עדכון חלקי (merge) של מסמך-הארגון platformOrgs/{slug}.
 *  חוזה: write-org-cloud-doc.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:120-123 (תורגם TS→JS); ‏cloudDb
 *  וערכת-Firestore (doc/setDoc) הוזרקו כאובייקט-שקעים fs (חוק-1 — אפס import פנימי).
 *  עיקור-JSON לפני הכתיבה: מפיל undefined/פונקציות ומנתק הפניה מה-state. */
export async function writeOrgCloudDoc(slug, data, fs) {
  const { db, doc, setDoc } = fs;
  await setDoc(doc(db, 'platformOrgs', slug), JSON.parse(JSON.stringify(data)), { merge: true });
}
