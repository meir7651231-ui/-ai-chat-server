/** 🪨 טיוטת-חוט (דרגת-מחצבה) · unitLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:45-49 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): unitLabel, termOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function unitLabel(cfg) {
    return termOf(cfg, 'entity.ayinUnit', 'כמות');
}
/** מיקום השלב בסדר (0..4). */
