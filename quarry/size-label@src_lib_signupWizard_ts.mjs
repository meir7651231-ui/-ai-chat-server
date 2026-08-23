/** 🪨 טיוטת-חוט (דרגת-מחצבה) · sizeLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/signupWizard.ts:91-93 (3 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): sizeLabel
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function sizeLabel(id) {
    return ORG_SIZES.find((s) => s.id === id)?.label ?? id ?? '—';
}
