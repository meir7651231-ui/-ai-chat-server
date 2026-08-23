/** 🪨 טיוטת-חוט (דרגת-מחצבה) · filterVolunteers — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop7/lib.ts:149-154 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): filterVolunteers, smartFilter
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function filterVolunteers(vols, q) {
    if (!q.trim())
        return vols;
    return smartFilter(q, vols, (v) => [v.name, v.phone, v.area ?? '']);
}
/** סינון מסירות (שם-משפחה/סטטוס) — familyName נגזר ב-caller ומוזרק. */
