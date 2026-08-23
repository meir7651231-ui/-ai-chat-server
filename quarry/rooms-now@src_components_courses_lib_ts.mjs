/** 🪨 טיוטת-חוט (דרגת-מחצבה) · roomsNow — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:120-147 (28 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): roomsNow, getDay, getHours, getMinutes, sessionsOf, toMin
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function roomsNow(db, now) {
    const day = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    const toMin = (t) => {
        const [h, m] = t.split(':').map(Number);
        return (h || 0) * 60 + (m || 0);
    };
    return db.rooms
        .filter((r) => r.active)
        .map((room) => {
        let busyWith;
        for (const c of db.courses) {
            if (c.roomId !== room.id)
                continue;
            for (const s of sessionsOf(c)) {
                if (s.day !== day || !s.time)
                    continue;
                const start = toMin(s.time);
                if (mins >= start && mins < start + (room.slot || 60)) {
                    busyWith = c;
                    break;
                }
            }
            if (busyWith)
                break;
        }
        return { room, busyWith };
    });
}
/** תווית קבוצה — label או "קבוצה N" לפי המיקום. */
