/** חוט · read-cloud-envelope — קריאת מעטפת-ההצפנה מ-_enc/envelope, failure-safe.
 *  חוזה: read-cloud-envelope.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:458-470 (תורגם TS→JS); ‏requireDb ⇒ db,
 *  ‏scopedEnv, ערכת-Firestore (getDoc/doc) ⇒ fs — כולם שקעים (חוק-1).
 *  כל שגיאה ⇒ null (הקורא ממשיך plaintext — לא שובר את הלקוח החי). */
export async function readCloudEnvelope(db, scopedEnv, fs) {
  try {
    const snap = await fs.getDoc(fs.doc(db, scopedEnv()));
    if (!snap.exists()) return null;
    const d = snap.data();
    // ולידציה רזה — envelope תקין בלבד; פורמט זר ⇒ מתעלמים (null).
    return d && typeof d === 'object' && d.$enc === 2 ? d : null;
  } catch {
    return null;
  }
}
