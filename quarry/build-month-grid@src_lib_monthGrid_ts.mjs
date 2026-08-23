/** 🪨 טיוטת-חוט (דרגת-מחצבה) · buildMonthGrid — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/monthGrid.ts:54-114 (61 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): getFullYear, getMonth, getDay, getDate, cellOf, format, isoOf, hpOf, gemYear
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function buildMonthGrid(events, anchorIso, hebMode) {
    const byDate = new Map();
    for (const ev of events) {
        if (!ev.date)
            continue;
        const arr = byDate.get(ev.date) ?? [];
        arr.push(ev);
        byDate.set(ev.date, arr);
    }
    const anchor = new Date(anchorIso + 'T12:00:00');
    if (!hebMode) {
        const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
        const start = new Date(first.getFullYear(), first.getMonth(), 1 - first.getDay());
        const cells = [];
        for (let i = 0; i < 42; i++) {
            const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
            cells.push(cellOf(d, d.getMonth() === anchor.getMonth(), false, byDate));
        }
        return {
            cells,
            label: fmtMonthYear.format(first),
            subLabel: fmtHebMonth.format(first) + '–' + fmtHebMonth.format(new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0)),
            prevIso: isoOf(new Date(first.getFullYear(), first.getMonth() - 1, 15)),
            nextIso: isoOf(new Date(first.getFullYear(), first.getMonth() + 1, 15)),
        };
    }
    // עברי: אחורה עד א׳ בחודש, ואז קדימה עד סוף החודש העברי
    let d = new Date(anchor);
    while (hpOf(isoOf(d), d).day !== 1)
        d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
    const first = d;
    const monthName = hpOf(isoOf(first), first).month;
    const days = [];
    let cur = first;
    while (hpOf(isoOf(cur), cur).month === monthName && days.length < 31) {
        days.push(cur);
        cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1);
    }
    const last = days[days.length - 1];
    // ריפוד לתחילת השבוע (ראשון) — תאים מחוץ לחודש
    const cells = [];
    for (let i = first.getDay(); i > 0; i--)
        cells.push(cellOf(new Date(first.getFullYear(), first.getMonth(), first.getDate() - i), false, true, byDate));
    for (const day of days)
        cells.push(cellOf(day, true, true, byDate));
    while (cells.length % 7 !== 0) {
        const lastCell = new Date(cells[cells.length - 1].iso + 'T12:00:00');
        cells.push(cellOf(new Date(lastCell.getFullYear(), lastCell.getMonth(), lastCell.getDate() + 1), false, true, byDate));
    }
    return {
        cells,
        label: monthName + ' ' + gemYear(fmtHebYear.format(first)),
        subLabel: fmtMonthYear.format(first) + ' – ' + fmtMonthYear.format(last),
        prevIso: isoOf(new Date(first.getFullYear(), first.getMonth(), first.getDate() - 1)),
        nextIso: isoOf(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1)),
    };
}
