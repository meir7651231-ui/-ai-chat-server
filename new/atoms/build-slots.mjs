/** חוט · build-slots — משבצות-היום של חדר ביומן. חוזה: build-slots.contract.md
 *  חולץ כלשונו מ-maor/src/components/diary/lib.ts:139-227; חמשת השכנים
 *  (timeToMin · minToHM · sessionsOf · courseOnDate · termOf) הוזרקו כשקעים (חוק-1). */
export function buildSlots(db, room, iso, blocked, config,
  { timeToMin, minToHM, sessionsOf, courseOnDate, termOf },
  /** דגל diary.cleaning — false ⇒ אין משבצת ניקיון יומי (המשבצות נשארות רגילות). */
  cleaningOn = true, T) {
  const from = Number.isNaN(timeToMin(room.from)) ? 8 * 60 : timeToMin(room.from);
  const to = Number.isNaN(timeToMin(room.to)) ? 20 * 60 : timeToMin(room.to);
  const step = room.slot > 0 ? room.slot : 60;
  const wd = new Date(iso + 'T12:00:00').getDay();
  const slots = [];
  const covered = [];
  const dayCourses = db.courses.filter((c) => c.roomId === room.id && courseOnDate(c, iso));
  for (let t = from, guard = 0; t < to && guard < 96; t += step, guard++) {
    const hh = minToHM(t);
    // ניקיון יומי 15:00–16:00 — קבוע בכל החדרים (כמו במקור); מגודר diary.cleaning
    if (cleaningOn && t >= 900 && t < 960) {
      slots.push({ key: T.k1 + hh, time: hh, kind: T.k2, label: T.k3, bg: T.k4, c: '#4d463c' });
      continue;
    }
    let occupied = false;
    for (const c of dayCourses) {
      const ss = sessionsOf(c);
      for (let i = 0; i < ss.length; i++) {
        const tm = timeToMin(ss[i].time || '');
        if (ss[i].day === wd && !Number.isNaN(tm) && tm >= t && tm < t + step) {
          occupied = true;
          covered.push({ c, i });
          slots.push({
            key: `${T.k19}${hh}|${c.id}|${i}`,
            time: ss[i].time || hh,
            kind: T.k5,
            label: termOf(config, T.k6, T.k7) + ': ' + c.name,
            bg: T.k8,
            c: '#9a6414',
            course: c,
            session: ss[i],
            sessionIndex: i,
          });
        }
      }
    }
    if (occupied) continue;
    const oe = db.events.find((ev) => {
      if (ev.done || ev.roomId !== room.id || ev.date !== iso) return false;
      const tm = timeToMin(ev.time || '');
      return !Number.isNaN(tm) && tm >= t && tm < t + step;
    });
    if (oe) {
      slots.push({ key: 'ev|' + hh + '|' + oe.id, time: oe.time || hh, kind: T.k9, label: T.k10 + oe.title, bg: T.k11, c: '#3a5a86', event: oe });
    } else if (blocked) {
      slots.push({ key: T.k12 + hh, time: hh, kind: T.k13, label: T.k14 + blocked, bg: T.k15, c: '#b91c1c' });
    } else {
      slots.push({ key: T.k16 + hh, time: hh, kind: T.k16, label: T.k17, bg: '#e4f5ea', c: '#12803c' });
    }
  }
  // מפגשים של היום שנופלים מחוץ לשעות הפעילות של החדר — עדיין מוצגים לרישום נוכחות
  for (const c of dayCourses) {
    const ss = sessionsOf(c);
    for (let i = 0; i < ss.length; i++) {
      if (ss[i].day !== wd) continue;
      if (covered.some((x) => x.c.id === c.id && x.i === i)) continue;
      slots.push({
        key: `${T.k20}${c.id}|${i}`,
        time: ss[i].time || '—',
        kind: T.k5,
        label: termOf(config, T.k6, T.k7) + ': ' + c.name + T.k18,
        bg: T.k8,
        c: '#9a6414',
        course: c,
        session: ss[i],
        sessionIndex: i,
        outOfHours: true,
      });
    }
  }
  return slots;
}
