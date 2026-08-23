/** 🪨 טיוטת-חוט (דרגת-מחצבה) · inactiveRoomCourses — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/diary/lib.ts:244-260 (17 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): inactiveRoomCourses, termOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function inactiveRoomCourses(db, iso, config) {
    const out = [];
    for (const c of db.courses) {
        if (c.end && iso > c.end)
            continue;
        if (!c.roomId)
            continue;
        const room = db.rooms.find((r) => r.id === c.roomId);
        if (!room)
            out.push({ course: c, roomName: termOf(config, 'entity.room', 'חדר') + ' לא קיים' });
        else if (!room.active)
            out.push({ course: c, roomName: room.name });
    }
    return out;
}
/** תווית מסלול קצרה לשורת תלמיד/ה ביומן — עקבי עם מודול הקורסים (planWord). */
