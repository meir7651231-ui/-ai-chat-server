/** 🪨 טיוטת-חוט (דרגת-מחצבה) · nextStage — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:56-61 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): nextStage, stageIndex
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function nextStage(stage) {
    const i = stageIndex(stage);
    return i < AYIN_STAGES.length - 1 ? AYIN_STAGES[i + 1] : null;
}
/** patch לחזרה לשלב קודם — חזרה לפני שלב המסירה מבטלת את דגל הדחיפה. */
