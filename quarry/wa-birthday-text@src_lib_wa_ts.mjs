/** 🪨 טיוטת-חוט (דרגת-מחצבה) · waBirthdayText — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/wa.ts:66-69 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): waBirthdayText, renderTemplate, orgOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function waBirthdayText(orgName, firstName, cfg) {
    return renderTemplate(cfg, 'wa.birthday', { first: firstName, org: orgOf(orgName) });
}
