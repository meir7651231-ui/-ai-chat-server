/** חוט · fetch-org-join-requests — בקשות-ההצטרפות של עובדות: platformOrgs/{slug}/joinRequests.
 *  חוזה: fetch-org-join-requests.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:217-222 (תורגם TS→JS); ‏cloudDb ⇒ שקע db,
 *  ערכת-Firestore (getDocs/collection) ⇒ שקע fs (חוק-1). */
export async function fetchOrgJoinRequests(slug, db, fs, T) {
  const snap = await fs.getDocs(fs.collection(db, T.k1, slug, T.k2));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}
