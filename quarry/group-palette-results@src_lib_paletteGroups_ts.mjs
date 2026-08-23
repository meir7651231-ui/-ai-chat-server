/** 🪨 טיוטת-חוט (דרגת-מחצבה) · groupPaletteResults — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/paletteGroups.ts:51-65 (15 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): buckets, bucketOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function groupPaletteResults(items, config) {
    const B = buckets(config);
    const indexed = items.map((it, i) => ({ it, i, b: bucketOf(it.key) }));
    indexed.sort((a, b) => a.b - b.b || a.i - b.i);
    const out = [];
    let lastLabel = '';
    for (const { it, b } of indexed) {
        const label = b < B.length ? B[b][1] : '';
        // שני דליים חולקים כותרת ('nav-'/'act-') — הכותרת לא מוכפלת
        out.push({ ...it, section: label && label !== lastLabel ? label : undefined });
        if (label)
            lastLabel = label;
    }
    return out;
}
