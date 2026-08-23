/** 🪨 טיוטת-חוט (דרגת-מחצבה) · stepScale — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/a11y.ts:44-48 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): stepScale, clampScale
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function stepScale(v, dir) {
    return clampScale(Math.round((clampScale(v) + dir * SCALE_STEP) * 10) / 10);
}
/** ניתוח JSON ההעדפות — קלט פגום/חלקי מתקבל בשקט כברירות מחדל. */
