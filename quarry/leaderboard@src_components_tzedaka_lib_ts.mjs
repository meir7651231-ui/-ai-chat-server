/** 🪨 טיוטת-חוט (דרגת-מחצבה) · leaderboard — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/tzedaka/lib.ts:142-148 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): leaderboard, coordinatorTotal, coordinatorBoxes
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function leaderboard(coordinators, boxes) {
    return coordinators
        .filter((c) => c.active)
        .map((c) => ({ coordinator: c, total: coordinatorTotal(boxes, c.id), boxCount: coordinatorBoxes(boxes, c.id).length }))
        .sort((a, b) => b.coordinator.score - a.coordinator.score || b.total - a.total);
}
