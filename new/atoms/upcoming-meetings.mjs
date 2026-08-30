/** חוט · upcoming-meetings — פגישות-קרובות פתוחות בטווח ימים, ממוינות תאריך+שעה.
 *  חוזה: upcoming-meetings.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:406-426 (תורגם TS→JS);
 *  השכנים isoOf/beneficiaryLabel הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function upcomingMeetings(db, todayIso, days = 2, config, isoOf, beneficiaryLabel, T) {
    const end = new Date(todayIso + 'T12:00:00');
    end.setDate(end.getDate() + days - 1);
    const endIso = isoOf(end);
    return db.shopEvents
        .filter((e) => e.kind === T.k1 && !e.done && e.date >= todayIso && e.date <= endIso)
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
