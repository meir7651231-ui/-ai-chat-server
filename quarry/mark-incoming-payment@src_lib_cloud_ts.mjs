/** 🪨 טיוטת-חוט (דרגת-מחצבה) · markIncomingPayment — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:726-737 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): markIncomingPayment, updateDoc, requireDb, scopedCol, toISOString
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function markIncomingPayment(id) {
    await updateDoc(doc(requireDb(), scopedCol('incomingPayments'), id), {
        status: 'handled',
        handledAt: new Date().toISOString(),
    });
}
/**
 * 🔴 האזנה-חיה לתשלומים-הנכנסים הממתינים — לחיבור-אוטומטי-לייב לכרטיס. כל חיוב
 * חדש שה-webhook כותב מפעיל את ה-callback מיד (event-driven, בלי polling). כשל-רך
 * ⇒ מחזיר no-op-unsub (בלי Firestore/הרשאות). ה-caller מסמן handled אחרי חיבור.
 */
