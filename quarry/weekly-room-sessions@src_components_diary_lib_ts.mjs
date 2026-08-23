/** 🪨 טיוטת-חוט (דרגת-מחצבה) · weeklyRoomSessions — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/diary/lib.ts:237-243 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): weeklyRoomSessions, sessionsOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function weeklyRoomSessions(db, roomId, iso) {
    return db.courses
        .filter((c) => c.roomId === roomId && (!c.end || iso <= c.end))
        .reduce((a, c) => a + sessionsOf(c).length, 0);
}
/** חוגים (שלא הסתיימו) המשויכים לחדר לא פעיל או לחדר שאינו קיים. */
