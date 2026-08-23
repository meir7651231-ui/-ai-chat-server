/** 🪨 טיוטת-חוט (דרגת-מחצבה) · validateHebMonthNames — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/hebdate.ts:125-144 (20 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): validateHebMonthNames, hebYearNow, hebParts, warn
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function validateHebMonthNames(hebYear = hebYearNow()) {
    const known = KNOWN_MONTHS_EN;
    const unknown = [];
    const seen = new Set();
    const gy = hebYear - 3761;
    for (let i = 0; i < 440; i++) {
        const p = hebParts(new Date(gy, 7, 1 + i, 12));
        if (p.year !== hebYear || seen.has(p.month))
            continue;
        seen.add(p.month);
        if (!known.has(p.month))
            unknown.push(p.month);
    }
    return unknown;
}
// שער-ריצה זול (O(1)): שם-החודש של היום חייב להיות מוכר. שינוי CLDR ⇒ אזהרה
// רועשת בקונסולה במקום המרות-תאריך שגויות בשקט. אין throw — לא מפילים את האפליקציה.
if (!KNOWN_MONTHS_EN.has(hebParts(new Date()).month)) {
    console.warn('⚠ שם חודש עברי לא-צפוי מ-Intl — ייתכן שינוי CLDR שישבור המרות תאריך. הריצו validateHebMonthNames().');
}
