/** 🪨 טיוטת-חוט (דרגת-מחצבה) · canGrantedAction — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/config.ts:687-696 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): canGrantedAction, isAdminUser
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function canGrantedAction(config, email, isManager, key) {
    return isManager || isAdminUser(config, email) || config.features?.[key] === true;
}
/** דריסת הריצה השמורה בדפדפן, אם קיימת ותקינה. */
