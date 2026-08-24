/** חוט · inactive-room-courses — חוגים חיים שמשויכים לחדר לא-פעיל / לא-קיים.
 *  חוזה: inactive-room-courses.contract.md
 *  חולץ כלשונו מ-maor/src/components/diary/lib.ts:244-258; השכן termOf
 *  (מונח פר-ארגון מהקונפיג) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function inactiveRoomCourses(db, iso, config, termOf) {
  const out = [];
  for (const c of db.courses) {
    if (c.end && iso > c.end) continue;
    if (!c.roomId) continue;
    const room = db.rooms.find((r) => r.id === c.roomId);
    if (!room) out.push({ course: c, roomName: termOf(config, 'entity.room', 'חדר') + ' לא קיים' });
    else if (!room.active) out.push({ course: c, roomName: room.name });
  }
  return out;
}
