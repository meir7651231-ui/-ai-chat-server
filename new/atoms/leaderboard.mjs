/** חוט · leaderboard — לוח-המובילים של רכזי-הקופות (גיימיפיקציה).
 *  חוזה: leaderboard.contract.md
 *  חולץ כלשונו מ-maor/src/components/tzedaka/lib.ts:142-148 (תורגם TS→JS);
 *  השכנים coordinatorTotal+coordinatorBoxes הוזרקו כשקעים
 *  (חוק-1 — אפס import פנימי). */
export function leaderboard(coordinators, boxes, coordinatorTotal, coordinatorBoxes) {
    return coordinators
        .filter((c) => c.active)
        .map((c) => ({ coordinator: c, total: coordinatorTotal(boxes, c.id), boxCount: coordinatorBoxes(boxes, c.id).length }))
        .sort((a, b) => b.coordinator.score - a.coordinator.score || b.total - a.total);
}
