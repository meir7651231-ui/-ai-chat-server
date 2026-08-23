/** 🪨 טיוטת-חוט (דרגת-מחצבה) · writeMailOutbox — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:762-771 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): writeMailOutbox, addDoc, collection, requireDb, scopedCol, toISOString
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function writeMailOutbox(to, subject, text) {
    await addDoc(collection(requireDb(), scopedCol('mailOutbox')), {
        to,
        subject,
        text,
        status: 'pending',
        at: new Date().toISOString(),
    });
}
