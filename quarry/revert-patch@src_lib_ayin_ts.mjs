/** 🪨 טיוטת-חוט (דרגת-מחצבה) · revertPatch — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:62-68 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): revertPatch, stageIndex
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function revertPatch(stage) {
    const patch = { stage };
    if (stageIndex(stage) < stageIndex('answer'))
        patch.answerPushed = false;
    return patch;
}
/** נרמול שם להשוואת כפילויות — נרמול חיפוש עברי + הסרת רווחים (כמו normName במקור). */
