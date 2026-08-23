/** 🪨 טיוטת-חוט (דרגת-מחצבה) · writeSmsOutbox — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:752-761 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): writeSmsOutbox, addDoc, collection, requireDb, scopedCol, toISOString
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function writeSmsOutbox(to, text) {
    await addDoc(collection(requireDb(), scopedCol('smsOutbox')), {
        to,
        text,
        status: 'pending',
        at: new Date().toISOString(),
    });
}
/** הכנסת מייל לתור-השליחה (הרחבת mail, ROADMAP-100 ‏#1 — נשלח ע"י mailOutbox בענן). */
