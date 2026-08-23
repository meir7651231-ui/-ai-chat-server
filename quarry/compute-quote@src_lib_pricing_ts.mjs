/** 🪨 טיוטת-חוט (דרגת-מחצבה) · computeQuote — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/pricing.ts:152-187 (36 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): computeQuote, nameOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function computeQuote(cfg, size, prices, nameOf, addons = [], mode = 'subscription') {
    const onModules = ALL_MODULES.filter((m) => cfg.modules?.[m] !== false);
    const all = onModules.map((m) => ({ key: m, label: nameOf(m), price: prices.modules[m] ?? 0, kind: 'module' }));
    const addonLines = addons.map((a) => ({ key: a.key, label: a.label, price: prices.integrations[a.key] ?? 0, kind: 'integration' }));
    const lines = [...all.filter((l) => l.price > 0), ...addonLines.filter((l) => l.price > 0)];
    const included = all.filter((l) => l.price === 0);
    const modulesSubtotal = lines.reduce((s, l) => s + l.price, 0);
    const sizeMult = prices.sizeMult[size] ?? 1;
    const monthly = Math.round((prices.base + modulesSubtotal) * sizeMult);
    const setup = prices.setup ?? 0;
    return {
        lines,
        included,
        base: prices.base,
        modulesSubtotal,
        size,
        sizeMult,
        monthly,
        setup,
        firstPayment: monthly + setup,
        yearly: monthly * 12,
        yearlyDiscounted: monthly * 10,
        mode,
        enterpriseOneTime: prices.enterprise.oneTime,
        enterpriseAnnual: prices.enterprise.annualMaintenance,
    };
}
/** עיצוב מחיר בשקלים — שלם, מפריד-אלפים עברי. */
