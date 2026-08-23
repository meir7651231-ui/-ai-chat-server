/** 🪨 טיוטת-חוט (דרגת-מחצבה) · stageIndex — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:50-55 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): stageIndex
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function stageIndex(stage) {
    const i = AYIN_STAGES.indexOf(stage);
    return i < 0 ? 0 : i;
}
/** השלב הבא, או null בשלב האחרון. */
