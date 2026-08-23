/** 🪨 טיוטת-חוט (דרגת-מחצבה) · cloudCfgCacheKey — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/config.ts:773-777 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): cloudCfgCacheKey
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function cloudCfgCacheKey(slug) {
    return 'maor_cloudcfg:' + slug;
}
/** קריאת מטמון הקונפיג-מהענן — לעליית-מהירה/offline; null כשאין/פגום. */
