/** חוט · fetch-nedarim-donors — רשימת-התורמים מנדרים (nedarimDonors הסקופי).
 *  חוזה: fetch-nedarim-donors.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:663-669 (תורגם TS→JS); ‏requireDb ⇒ שקע db,
 *  ‏scopedCol ⇒ שקע, ערכת-Firestore (getDocs/collection) ⇒ שקע fs (חוק-1). */
export async function fetchNedarimDonors(db, scopedCol, fs) {
  const snap = await fs.getDocs(fs.collection(db, scopedCol('nedarimDonors')));
  return snap.docs.map((d) => ({ toremId: d.id, ...d.data() }));
}
