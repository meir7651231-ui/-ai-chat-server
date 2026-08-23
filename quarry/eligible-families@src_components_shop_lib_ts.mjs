/** 🪨 טיוטת-חוט (דרגת-מחצבה) · eligibleFamilies — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:610-626 (17 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): eligibleFamilies, flatMap
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function eligibleFamilies(db, criterionIds, excludeProductId) {
    return db.families
        .filter((f) => f.status === 'active')
        .filter((f) => {
        const theirs = db.shopAssignments.filter((a) => a.famId === f.id);
        if (theirs.some((a) => a.productId === excludeProductId && a.status === 'active'))
            return false;
        if (criterionIds.length === 0)
            return true;
        const held = new Set(theirs.flatMap((a) => a.criterionIds));
        return criterionIds.every((c) => held.has(c));
    })
        .map((f) => ({ famId: f.id, name: f.name, memberIds: f.members.map((m) => m.id) }));
}
/**
 * רשימת חלוקה מודפסת לחבילה — משפחה, כתובת, טלפון, רכיבים, עמודת "☐ נמסר".
 * שיוכים active בלבד; דפוס תדפיס-הרכז מ-CONNECT (downloadText ב-UI).
 */
