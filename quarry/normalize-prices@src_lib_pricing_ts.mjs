/** 🪨 טיוטת-חוט (דרגת-מחצבה) · normalizePrices — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/pricing.ts:122-151 (30 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): normalizePrices, isFinite
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function normalizePrices(raw) {
    const base = raw && typeof raw === 'object' ? raw : {};
    const num = (v, fb) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : fb);
    const modules = {};
    for (const m of ALL_MODULES)
        modules[m] = num(base.modules?.[m], DEFAULT_PRICES.modules[m] ?? 0);
    const integrations = {};
    for (const k of Object.keys(DEFAULT_INTEGRATION_PRICES)) {
        integrations[k] = num(base.integrations?.[k], DEFAULT_INTEGRATION_PRICES[k]);
    }
    return {
        base: num(base.base, DEFAULT_PRICES.base),
        modules,
        integrations,
        sizeMult: {
            small: num(base.sizeMult?.small, DEFAULT_PRICES.sizeMult.small),
            medium: num(base.sizeMult?.medium, DEFAULT_PRICES.sizeMult.medium),
            large: num(base.sizeMult?.large, DEFAULT_PRICES.sizeMult.large),
        },
        setup: num(base.setup, DEFAULT_PRICES.setup),
        enterprise: {
            oneTime: num(base.enterprise?.oneTime, DEFAULT_PRICES.enterprise.oneTime),
            annualMaintenance: num(base.enterprise?.annualMaintenance, DEFAULT_PRICES.enterprise.annualMaintenance),
        },
    };
}
/**
 * חישוב הצעת-מחיר — טהור. מקבל קונפיג (אילו מודולים דלוקים), גודל, טבלת-מחירים,
 * ופונקציית-שם (nameOf — כדי לכבד דריסות-מונח termOf של הלקוח). מחזיר פירוט מלא.
 */
