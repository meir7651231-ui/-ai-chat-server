/** 🪨 טיוטת-חוט (דרגת-מחצבה) · fetchProviderRows — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:678-686 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): fetchProviderRows, getDocs, query, collection, requireDb, scopedCol, where, data
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function fetchProviderRows(provider) {
    const snap = await getDocs(query(collection(requireDb(), scopedCol('incomingPayments')), where('provider', '==', provider)));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
/** 🔄 משיכת-נדרים **בקליק** (ייעול 20.8) — קורא ל-Function `nedarimPull?full=1` עם
 *  **טוקן-הכניסה** של המשתמש (Authorization: Bearer) במקום סוד-בדפדפן; השרת מאמת
 *  מייל-על/מנהל. מושך תורמים+עסקאות. `pullUrl` = כתובת-הפונקציה מהקונפיג (https בלבד).
 *  זורק בכשל (רשת/הרשאה/שרת). org נגזר מהתחום הנוכחי (שורש⇒'root', אחרת ה-slug). */
