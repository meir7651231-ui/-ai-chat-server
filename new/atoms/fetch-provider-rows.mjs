/** חוט · fetch-provider-rows — רשומות-הספק המלאות (כל הסטטוסים) מ-incomingPayments הסקופי.
 *  חוזה: fetch-provider-rows.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:678-682 (תורגם TS→JS); ‏requireDb ⇒ שקע db,
 *  ‏scopedCol ⇒ שקע, ערכת-Firestore (getDocs/query/collection/where) ⇒ שקע fs (חוק-1). */
export async function fetchProviderRows(provider, db, scopedCol, fs) {
  const snap = await fs.getDocs(fs.query(fs.collection(db, scopedCol('incomingPayments')), fs.where('provider', '==', provider)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
