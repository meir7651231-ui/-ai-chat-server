/** חוט · push-donations — דחיפת diff אוסף-התרומות (מסלול-B) באצוות ≤400.
 *  חוזה: push-donations.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:175-200 (תורגם TS→JS); ‏requireDb ⇒ db,
 *  ‏scopedDonations, ערכת-Firestore (doc/writeBatch) ⇒ fs, ‏encryptDoc —
 *  כולם שקעים (חוק-1). ‏pkey נשמר plaintext מחוץ למעטפה (where-pkey-in + Rules). */
export async function pushDonations(diff, dek, db, scopedDonations, fs, encryptDoc) {
  const ops = [];
  for (const d of diff.sets) {
    // pkey נשמר plaintext (מחוץ למעטפה) כדי ש-where-pkey-in + Rules יעבדו גם בארגון-מוצפן.
    const payload = { supporterId: d.supporterId, ...d.donation };
    const body = dek ? { pkey: d.pkey, ...(await encryptDoc(payload, dek)) } : { pkey: d.pkey, ...payload };
    ops.push((b) => b.set(fs.doc(db, scopedDonations(), d.id), body));
  }
  for (const id of diff.deletes) {
    ops.push((b) => b.delete(fs.doc(db, scopedDonations(), id)));
  }
  for (let i = 0; i < ops.length; i += 400) {
    const batch = fs.writeBatch(db);
    for (const op of ops.slice(i, i + 400)) op(batch);
    await batch.commit();
  }
}
