/** 🪨 טיוטת-חוט (דרגת-מחצבה) · finderMatches — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/families/lib.ts:119-128 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): finderMatches, finderAxisValue
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function finderMatches(db, locks) {
    return db.families.filter((f) => Object.entries(locks).every(([k, v]) => finderAxisValue(db, f, k) === v));
}
/**
 * התאמת מספר לתחביר סינון עמודות — "3" בדיוק, "3+" לפחות, "2-4" טווח.
 * קלט לא-מספרי אינו מסנן (מחזיר true), כמו במקור.
 */
