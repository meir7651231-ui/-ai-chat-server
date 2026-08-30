/** חוט · write-org-lead — ליד "נחזור אליכם" ⇒ platformLeads (addDoc, מזהה-אוטומטי).
 *  חוזה: write-org-lead.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:317-324 (תורגם TS→JS); ‏cloudDb
 *  וערכת-Firestore (collection/addDoc) הוזרקו כאובייקט-שקעים fs (חוק-1 — אפס
 *  import פנימי). create-only ציבורי — הקריאה למיילי-על בלבד (Rules, לא כאן). */
export async function writeOrgLead(lead, fs, T) {
  const { db, collection, addDoc } = fs;
  await addDoc(collection(db, T.k1), JSON.parse(JSON.stringify(lead)));
}
