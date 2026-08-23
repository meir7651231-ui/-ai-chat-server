/** 🪨 טיוטת-חוט (דרגת-מחצבה) · itemLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:40-44 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): itemLabel, termOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function itemLabel(cfg) {
    return termOf(cfg, 'entity.ayinItem', 'שם לטיפול');
}
/** שם מונה הפריט. */
