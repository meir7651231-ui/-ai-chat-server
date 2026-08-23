/** 🪨 טיוטת-חוט (דרגת-מחצבה) · industryLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/signupWizard.ts:88-90 (3 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): industryLabel
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function industryLabel(id) {
    return WIZARD_INDUSTRIES.find((i) => i.id === id)?.label ?? id ?? '—';
}
