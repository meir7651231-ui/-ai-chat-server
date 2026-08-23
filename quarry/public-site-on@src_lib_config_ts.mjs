/** 🪨 טיוטת-חוט (דרגת-מחצבה) · publicSiteOn — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/config.ts:637-649 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): publicSiteOn, featureOn
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function publicSiteOn(cfg) {
    return featureOn(cfg, 'shell.publicsite') && !!cfg.site && cfg.site.enabled !== false;
}
/**
 * תפקיד המשתמש לפי המייל המחובר: ב-adminEmails ⇒ admin; במפת roles.teachers
 * ⇒ teacher; אחרת staff. בלי מייל (ענן כבוי) ⇒ staff — התנהגות של היום.
 * ההשוואות case-insensitive.
 */
