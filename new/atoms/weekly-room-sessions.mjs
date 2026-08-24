/** חוט · weekly-room-sessions — ניצולת שבועית של חדר: סכום המפגשים-השבועיים
 *  של החוגים המשויכים לחדר שלא הסתיימו נכון ל-iso.
 *  חוזה: weekly-room-sessions.contract.md
 *  חולץ כלשונו מ-maor/src/components/diary/lib.ts:237-243; השכן sessionsOf
 *  (המפגשים-בפועל של חוג) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function weeklyRoomSessions(db, roomId, iso, sessionsOf) {
  return db.courses
    .filter((c) => c.roomId === roomId && (!c.end || iso <= c.end))
    .reduce((a, c) => a + sessionsOf(c).length, 0);
}
