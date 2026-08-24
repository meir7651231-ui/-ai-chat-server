/** חוט · filter-coordinators — סינון+מיון רכזי-הקופות (שם/ציון/סך/ישן).
 *  חוזה: filter-coordinators.contract.md
 *  חולץ כלשונו מ-maor/src/components/tzedaka/lib.ts:174-202 (תורגם TS→JS);
 *  שקעים: smartFilter · coordinatorTotal · coordinatorLastCollection (חוק-1). */
export function filterCoordinators(coords, boxes, q, onlyActive, sort, smartFilter, coordinatorTotal, coordinatorLastCollection) {
    const base = onlyActive ? coords.filter((c) => c.active) : [...coords];
    // גם מילות השם בנפרד — כדי ששגיאת-כתיב במילה אחת תיתפס (levenshtein פר-מילה)
    const list = smartFilter(q, base, (c) => [c.name, ...c.name.split(/\s+/)]);
    const cmp = {
        name: (a, b) => a.name.localeCompare(b.name, 'he'),
        score: (a, b) => b.score - a.score,
        total: (a, b) => coordinatorTotal(boxes, b.id) - coordinatorTotal(boxes, a.id),
        stale: (a, b) => coordinatorLastCollection(boxes, a.id).localeCompare(coordinatorLastCollection(boxes, b.id)),
    };
    return [...list].sort(cmp[sort]);
}
