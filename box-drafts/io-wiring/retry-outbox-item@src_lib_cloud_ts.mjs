/** 🪨 טיוטת-חוט (דרגת-מחצבה) · retryOutboxItem — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:805-809 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): retryOutboxItem, updateDoc, requireDb, scopedCol, deleteField
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function retryOutboxItem(box, id) {
    const colName = box === 'sms' ? 'smsOutbox' : 'mailOutbox';
    await updateDoc(doc(requireDb(), scopedCol(colName), id), { status: 'pending', error: deleteField() });
}
