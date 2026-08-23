/** 🪨 טיוטת-חוט (דרגת-מחצבה) · stripAuditMeta — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/supporterPartition.ts:82-88 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): —
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function stripAuditMeta(meta) {
    if (!('audit' in meta))
        return meta;
    const { audit: _a, ...rest } = meta;
    void _a;
    return rest;
}
