/** 🪨 טיוטת-חוט (דרגת-מחצבה) · renderTemplate — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/templates.ts:57-67 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): renderTemplate
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function renderTemplate(cfg, key, vars) {
    const def = TEMPLATE_DEFS.find((d) => d.key === key)?.def ?? '';
    let t = (cfg?.templates?.[key] ?? '').trim() || def;
    for (const [k, v] of Object.entries(vars))
        t = t.split('{' + k + '}').join(v);
    return t;
}
