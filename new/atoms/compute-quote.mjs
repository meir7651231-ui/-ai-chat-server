/** חוט · compute-quote — מנוע הצעת-מחיר מטבלת-מחירים נתונה. חוזה: compute-quote.contract.md
 *  חולץ כלשונו מ-maor/src/lib/pricing.ts:152-187; השכן ALL_MODULES הוזרק
 *  כשקע allModules (חוק-1 — אפס import פנימי). */
export function computeQuote(cfg, size, prices, nameOf, allModules, addons = [], mode = 'subscription', T) {
    const onModules = allModules.filter((m) => cfg.modules?.[m] !== false);
    const all = onModules.map((m) => ({ key: m, label: nameOf(m), price: prices.modules[m] ?? 0, kind: T.k1 }));
    const addonLines = addons.map((a) => ({ key: a.key, label: a.label, price: prices.integrations[a.key] ?? 0, kind: T.k2 }));
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
