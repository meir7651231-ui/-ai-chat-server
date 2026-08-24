/** חוט · fetch-org-leads — כל לידי "נחזור אליכם" מ-platformLeads (לוח-הבקרה).
 *  חוזה: fetch-org-leads.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:327-334 (תורגם TS→JS); ‏cloudDb ⇒ שקע db,
 *  ערכת-Firestore (getDocs/collection) ⇒ שקע fs (חוק-1). */
export async function fetchOrgLeads(db, fs) {
  const snap = await fs.getDocs(fs.collection(db, 'platformLeads'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
