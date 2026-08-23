/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supCount — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:118-122 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supCount
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supCount(sp) {
    return (sp.count || 0) + (sp.hist ?? []).filter((h) => (h.a || 0) > 0).length;
}
/** התרומה האחרונה — המאוחר מבין הקבלות וההיסטוריה ('' כשאין). */
