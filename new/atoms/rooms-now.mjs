/** חוט · rooms-now — מצב-החדרים ברגע נתון (חדר-פעיל תפוס/פנוי + החוג התופס).
 *  חוזה: rooms-now.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:120-147; השכן sessionsOf
 *  (המפגשים-בפועל של חוג) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function roomsNow(db, now, sessionsOf, T) {
  const day = now.getDay();
  const mins = now.getHours() * T.k1 + now.getMinutes();
  const toMin = (t) => {
    const [h, m] = t.split(':').map(Number);
    return (h || 0) * T.k1 + (m || 0);
  };
  return db.rooms
    .filter((r) => r.active)
    .map((room) => {
      let busyWith;
      for (const c of db.courses) {
        if (c.roomId !== room.id) continue;
        for (const s of sessionsOf(c)) {
          if (s.day !== day || !s.time) continue;
          const start = toMin(s.time);
          if (mins >= start && mins < start + (room.slot || 60)) {
            busyWith = c;
            break;
          }
        }
        if (busyWith) break;
      }
      return { room, busyWith };
    });
}
