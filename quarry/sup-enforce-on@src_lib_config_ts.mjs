/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supEnforceOn — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/config.ts:73-81 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supEnforceOn
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supEnforceOn(cfg) {
    return cfg.supporterEnforce === true;
}
/**
 * האם הרחבה (integration) פעילה — **הפוך מחוזה-הדגלים במכוון**: הרחבה היא
 * מוצר-נמכר (opt-in), לכן מפתח חסר = כבוי; רק enabled:true מפורש מדליק.
 * (דגל-פיצ'ר: חסר = דלוק; רק false מכבה. אל תבלבלו — ratchet אוכף.)
 */
