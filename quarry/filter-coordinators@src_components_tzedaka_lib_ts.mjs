/** 🪨 טיוטת-חוט (דרגת-מחצבה) · filterCoordinators — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/tzedaka/lib.ts:174-202 (29 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): filterCoordinators, smartFilter, coordinatorTotal, coordinatorLastCollection
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function filterCoordinators(coords, boxes, q, onlyActive, sort) {
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
/** מבט "כל הקופות" — כל הקופות עם שם הרכז והמשפחה, חיפוש/סינון/מיון. */
