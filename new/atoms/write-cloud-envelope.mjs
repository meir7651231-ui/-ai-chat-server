/** חוט · write-cloud-envelope — כתיבת ה-envelope (הפעלת הצפנה, פעולת-בעלים); כשל=זריקה.
 *  חוזה: write-cloud-envelope.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:471-473 (תורגם TS→JS); ‏requireDb ⇒ db,
 *  ‏scopedEnv, ערכת-Firestore (setDoc/doc) ⇒ fs — כולם שקעים (חוק-1). */
export async function writeCloudEnvelope(env, db, scopedEnv, fs) {
    await fs.setDoc(fs.doc(db, scopedEnv()), env);
}
