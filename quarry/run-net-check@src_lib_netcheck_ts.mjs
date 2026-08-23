/** 🪨 טיוטת-חוט (דרגת-מחצבה) · runNetCheck — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/netcheck.ts:100-104 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): runNetCheck, checkOne
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function runNetCheck(targets, timeoutMs = 8000) {
    return Promise.all(targets.map((t) => checkOne(t, timeoutMs)));
}
/** הטקסט להקראה/שליחה למוקד חברת-הסינון — רק על סמך מה שנחסם בפועל. */
