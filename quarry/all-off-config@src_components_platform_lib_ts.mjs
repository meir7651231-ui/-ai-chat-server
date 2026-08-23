/** 🪨 טיוטת-חוט (דרגת-מחצבה) · allOffConfig — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/platform/lib.ts:58-64 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): allOffConfig
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function allOffConfig(slug, orgName) {
    const modules = {};
    for (const m of ALL_MODULES)
        modules[m] = false;
    return { ...DEFAULT_CONFIG, slug, orgName, modules, features: {}, terms: {} };
}
/** קישור הלקוח — ‏{origin}{base}?org={slug} (לכפתור "📋 העתק קישור"). */
