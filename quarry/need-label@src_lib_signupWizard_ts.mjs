/** 🪨 טיוטת-חוט (דרגת-מחצבה) · needLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/signupWizard.ts:94-97 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): needLabel
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function needLabel(id) {
    return ORG_NEEDS.find((n) => n.id === id)?.label ?? id;
}
