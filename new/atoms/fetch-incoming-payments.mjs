/** חוט · fetch-incoming-payments — התשלומים הממתינים מ-incomingPayments הסקופי.
 *  חוזה: fetch-incoming-payments.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:670-677 (תורגם TS→JS); ‏requireDb ⇒ שקע db,
 *  ‏scopedCol ⇒ שקע, ערכת-Firestore (getDocs/query/collection/where) ⇒ שקע fs (חוק-1). */
export async function fetchIncomingPayments(db, scopedCol, fs, T) {
  const snap = await fs.getDocs(fs.query(fs.collection(db, scopedCol(T.k1)), fs.where(T.k2, '==', T.k3)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
