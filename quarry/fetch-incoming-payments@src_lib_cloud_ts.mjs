/** 🪨 טיוטת-חוט (דרגת-מחצבה) · fetchIncomingPayments — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:670-677 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): fetchIncomingPayments, getDocs, query, collection, requireDb, scopedCol, where, data
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function fetchIncomingPayments() {
    const snap = await getDocs(query(collection(requireDb(), scopedCol('incomingPayments')), where('status', '==', 'pending')));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
/** רשומות-הספק המלאות — **כל** הסטטוסים (גם handled). 🐛 (23.8, "זה לא נכנס
 *  במקום הנכון" + "שם יכנס לשם, טלפון לטלפון"): הריפוי בכרטיסים צריך גם את
 *  מזהי-העסקאות (תיקון-תווית) וגם את פרטי-הקשר (מילוי-אם-ריק בכרטיס). */
