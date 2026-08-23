/** 🪨 טיוטת-חוט (דרגת-מחצבה) · boxesOverview — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/tzedaka/lib.ts:203-232 (30 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): boxesOverview, lastCollectionIso, boxTotal, smartFilter, parseInt
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function boxesOverview(db, q, status, sort) {
    let rows = db.tzBoxes.map((box) => ({
        box,
        coordName: db.tzCoordinators.find((c) => c.id === box.coordinatorId)?.name ?? '',
        famName: db.families.find((f) => f.id === box.famId)?.name ?? '',
        last: lastCollectionIso(box),
        total: boxTotal(box),
    }));
    if (status)
        rows = rows.filter((r) => r.box.status === status);
    rows = smartFilter(q, rows, (r) => [
        '#' + r.box.num,
        r.box.num,
        r.coordName,
        ...r.coordName.split(/\s+/),
        r.famName,
    ]);
    const cmp = {
        num: (a, b) => (parseInt(a.box.num, 10) || 0) - (parseInt(b.box.num, 10) || 0),
        lastCollection: (a, b) => a.last.localeCompare(b.last), // ישן/מעולם-לא ראשון — לרדיפה
        total: (a, b) => b.total - a.total,
    };
    return [...rows].sort(cmp[sort]);
}
/** סינון היסטוריית ריקונים — טווח תאריכים (כוללני, dateInRange המשותף) + מבצע. */
