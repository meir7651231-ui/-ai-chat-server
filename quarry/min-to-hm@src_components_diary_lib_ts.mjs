/** 🪨 טיוטת-חוט (דרגת-מחצבה) · minToHM — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/diary/lib.ts:45-50 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): minToHM, pad2
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function minToHM(min) {
    return pad2(Math.floor(min / 60)) + ':' + pad2(min % 60);
}
/** תווית קבוצה — label או "קבוצה N" לפי המיקום (כמו במודול הקורסים). */
