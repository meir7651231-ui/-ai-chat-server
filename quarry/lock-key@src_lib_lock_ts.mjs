/** 🪨 טיוטת-חוט (דרגת-מחצבה) · lockKey — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/lock.ts:40-43 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): lockKey, nsLsKey
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function lockKey() {
    return nsLsKey(LOCK_BASE);
}
