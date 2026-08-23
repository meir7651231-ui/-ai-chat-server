/** 🪨 טיוטת-חוט (דרגת-מחצבה) · stageLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:30-34 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): stageLabel, termOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function stageLabel(cfg, stage) {
    return termOf(cfg, 'ayin.stage.' + stage, STAGE_FALLBACK[stage]);
}
/** שם הפיצ'ר (כותרת הלוח/הכרטיס). */
