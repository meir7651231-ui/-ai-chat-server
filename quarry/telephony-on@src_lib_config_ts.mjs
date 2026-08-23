/** 🪨 טיוטת-חוט (דרגת-מחצבה) · telephonyOn — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/config.ts:90-94 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): telephonyOn
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function telephonyOn(cfg) {
    return cfg.telephony?.enabled === true;
}
/** הגדרת-הרחבה (גל ג׳): מחרוזת מה-allowlist אחרי trim, אחרת ''. */
