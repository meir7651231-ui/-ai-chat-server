/** 🪨 טיוטת-חוט (דרגת-מחצבה) · cooldownForFails — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/lock.ts:167-170 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): cooldownForFails
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function cooldownForFails(fails) {
    return fails >= 5 ? 30000 : fails >= 4 ? 15000 : fails >= 3 ? 5000 : 0;
}
