/** 🪨 טיוטת-חוט (דרגת-מחצבה) · integrationSetting — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/config.ts:95-103 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): integrationSetting
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function integrationSetting(cfg, key, field) {
    const v = cfg.integrations?.[key]?.[field];
    return typeof v === 'string' ? v.trim() : '';
}
/**
 * ‏URL בטוח מהקונפיג — https בלבד (הקונפיג מגיע מהענן; בלי חיטוי, מסמך-ענן
 * עוין היה מזריק javascript: לתוך href). לא-תקין/לא-https ⇒ null.
 */
