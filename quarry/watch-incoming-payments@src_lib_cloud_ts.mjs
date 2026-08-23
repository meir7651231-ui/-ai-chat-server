/** 🪨 טיוטת-חוט (דרגת-מחצבה) · watchIncomingPayments — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:738-751 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): watchIncomingPayments, query, collection, requireDb, scopedCol, where, onSnapshot, data
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function watchIncomingPayments(cb) {
    try {
        const q = query(collection(requireDb(), scopedCol('incomingPayments')), where('status', '==', 'pending'));
        return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), () => { });
    }
    catch {
        return () => { };
    }
}
/** הכנסת SMS לתור-השליחה (הרחבת sms — נשלח ע"י ה-Function כל דקה). */
