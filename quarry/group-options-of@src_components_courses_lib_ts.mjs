/** 🪨 טיוטת-חוט (דרגת-מחצבה) · groupOptionsOf — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:174-183 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): groupOptionsOf, sessionsOf, groupLabelOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function groupOptionsOf(c) {
    const ss = sessionsOf(c);
    if (ss.length <= 1)
        return [];
    return ss.map((s, i) => {
        const v = groupLabelOf(s, i);
        return { v, t: `${v} · יום ${DAY_NAMES[s.day]} ${s.time || ''}`.trim() };
    });
}
/** שם המסלול (יחיד) — פורט מ-planWord באב-הטיפוס. */
