/** 🪨 טיוטת-חוט (דרגת-מחצבה) · distributionListLines — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:627-655 (29 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): distributionListLines, repeat, itemOf, beneficiaryLabel
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function distributionListLines(db, productId, config) {
    const product = db.shopProducts.find((p) => p.id === productId);
    const lines = ['רשימת חלוקה — ' + (product?.name ?? ''), '='.repeat(30)];
    const active = db.shopAssignments.filter((a) => a.productId === productId && a.status === 'active');
    for (const a of active) {
        const fam = db.families.find((f) => f.id === a.famId);
        const comps = (product?.components ?? []).map((c) => itemOf(db, c).name).filter(Boolean).join(' + ');
        lines.push([
            beneficiaryLabel(db, a, config),
            fam ? [fam.address, fam.city].filter(Boolean).join(', ') : '',
            fam?.phone ?? '',
            comps,
            '☐ נמסר',
        ]
            .filter(Boolean)
            .join(' · '));
    }
    if (active.length === 0)
        lines.push('אין שיוכים פעילים לחבילה');
    return lines;
}
/* ---------- ייצוא (CONNECT חיבור 6) ---------- */
/**
 * שורות CSV של כל המימושים — תאריך, מוטב, פריט, חבילה, שולם, שווי, אישור,
 * מבוטל. **מבוטל מסומן ולא מוסתר** — שקיפות מלאה בייצוא.
 */
