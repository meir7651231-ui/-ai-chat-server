/** 🪨 טיוטת-חוט (דרגת-מחצבה) · parseAcc — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/a11y.ts:49-59 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): parseAcc
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function parseAcc(raw) {
    const off = { contrast: false, noanim: false, links: false, spacing: false };
    if (!raw)
        return off;
    try {
        const a = JSON.parse(raw);
        return { contrast: !!a?.contrast, noanim: !!a?.noanim, links: !!a?.links, spacing: !!a?.spacing };
    }
    catch {
        return off;
    }
}
