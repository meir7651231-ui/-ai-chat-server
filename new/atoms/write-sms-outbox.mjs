/** חוט · write-sms-outbox — תיוק SMS לתור-השליחה (smsOutbox, status='pending').
 *  חוזה: write-sms-outbox.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:752-759 (תורגם TS→JS); ‏requireDb ⇒ db,
 *  ‏scopedCol, ערכת-Firestore (addDoc/collection) ⇒ fs — כולם שקעים (חוק-1). */
export async function writeSmsOutbox(to, text, db, scopedCol, fs, T) {
    await fs.addDoc(fs.collection(db, scopedCol(T.k1)), {
        to,
        text,
        status: T.k2,
        at: new Date().toISOString(),
    });
}
