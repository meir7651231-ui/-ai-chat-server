/** 🪨 טיוטת-חוט (דרגת-מחצבה) · parseJoinFullCode — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/platform/lib.ts:113-123 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): parseJoinFullCode, isValidSlug
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function parseJoinFullCode(full) {
    const t = full.trim();
    const dot = t.indexOf('.');
    if (dot <= 0)
        return null;
    const slug = t.slice(0, dot).trim().toLowerCase();
    const code = t.slice(dot + 1).trim();
    if (!isValidSlug(slug) || !code)
        return null;
    return { slug, code };
}
/** האם המייל הוא מנהל-הארגון (מואצל)? השוואה מנורמלת. */
