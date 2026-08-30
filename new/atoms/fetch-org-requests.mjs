/** חוט · fetch-org-requests — בקשות-ההרשמה הממתינות מ-platformRequests (לוח-הבקרה).
 *  חוזה: fetch-org-requests.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:178-189 (תורגם TS→JS); ‏cloudDb ⇒ שקע db,
 *  ערכת-Firestore (getDocs/collection) ⇒ שקע fs (חוק-1). */
export async function fetchOrgRequests(db, fs, T) {
  const snap = await fs.getDocs(fs.collection(db, T.k1));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}
