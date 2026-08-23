/** 🪨 טיוטת-חוט (דרגת-מחצבה) · setEmployeeOverride — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/platform/lib.ts:256-265 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): setEmployeeOverride, normEmail
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function setEmployeeOverride(org, email, override) {
    const e = normEmail(email);
    return { memberConfigs: { ...org.memberConfigs, [e]: override } };
}
/** הסרת עובד/ת (טהור) — מוציא מ-members ומ-memberConfigs. מנהל לא ניתן להסרה כאן. */
