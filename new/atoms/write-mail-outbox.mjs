/** חוט · write-mail-outbox — תיוק מייל לתור-השליחה (mailOutbox, status='pending').
 *  חוזה: write-mail-outbox.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:762-771 (תורגם TS→JS); ‏requireDb ⇒ db,
 *  ‏scopedCol, ערכת-Firestore (addDoc/collection) ⇒ fs — כולם שקעים (חוק-1). */
export async function writeMailOutbox(to, subject, text, db, scopedCol, fs) {
    await fs.addDoc(fs.collection(db, scopedCol('mailOutbox')), {
        to,
        subject,
        text,
        status: 'pending',
        at: new Date().toISOString(),
    });
}
