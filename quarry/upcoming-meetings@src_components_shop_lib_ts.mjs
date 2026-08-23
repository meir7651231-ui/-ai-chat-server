/** 🪨 טיוטת-חוט (דרגת-מחצבה) · upcomingMeetings — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:406-432 (27 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): upcomingMeetings, setDate, getDate, isoOf, beneficiaryLabel
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function upcomingMeetings(db, todayIso, days = 2, config) {
    const end = new Date(todayIso + 'T12:00:00');
    end.setDate(end.getDate() + days - 1);
    const endIso = isoOf(end);
    return db.shopEvents
        .filter((e) => e.kind === 'meeting' && !e.done && e.date >= todayIso && e.date <= endIso)
        .sort((x, y) => (x.date + '·' + (x.time || '99:99')).localeCompare(y.date + '·' + (y.time || '99:99')))
        .map((ev) => {
        const a = db.shopAssignments.find((x) => x.id === ev.assignmentId);
        return {
            ev,
            who: a ? beneficiaryLabel(db, a, config) : ev.title,
            roomName: ev.roomId ? (db.rooms.find((r) => r.id === ev.roomId)?.name ?? '') : '',
        };
    });
}
/* ---------- סכומים ---------- */
/** Σ השווי שנמסר בפועל (value של המימושים החיים — מבוטלים מוחרגים). */
