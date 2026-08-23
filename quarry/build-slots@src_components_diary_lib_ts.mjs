/** 🪨 טיוטת-חוט (דרגת-מחצבה) · buildSlots — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/diary/lib.ts:139-227 (89 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): buildSlots, isNaN, timeToMin, getDay, courseOnDate, minToHM, sessionsOf, termOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function buildSlots(db, room, iso, blocked, config, 
/** דגל diary.cleaning — false ⇒ אין משבצת ניקיון יומי (המשבצות נשארות רגילות). */
cleaningOn = true) {
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
            slots.push({ key: 'clean' + hh, time: hh, kind: 'cleaning', label: 'ניקיון יומי (15:00–16:00)', bg: '#eceae2', c: '#4d463c' });
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
                        key: `crs|${hh}|${c.id}|${i}`,
                        time: ss[i].time || hh,
                        kind: 'course',
                        label: termOf(config, 'entity.course', 'חוג') + ': ' + c.name,
                        bg: '#fdf1d4',
                        c: '#9a6414',
                        course: c,
                        session: ss[i],
                        sessionIndex: i,
                    });
                }
            }
        }
        if (occupied)
            continue;
        const oe = db.events.find((ev) => {
            if (ev.done || ev.roomId !== room.id || ev.date !== iso)
                return false;
            const tm = timeToMin(ev.time || '');
            return !Number.isNaN(tm) && tm >= t && tm < t + step;
        });
        if (oe) {
            slots.push({ key: 'ev|' + hh + '|' + oe.id, time: oe.time || hh, kind: 'event', label: 'אירוע: ' + oe.title, bg: '#e7edf5', c: '#3a5a86', event: oe });
        }
        else if (blocked) {
            slots.push({ key: 'blk' + hh, time: hh, kind: 'blocked', label: 'חסום — ' + blocked, bg: '#fdeaea', c: '#b91c1c' });
        }
        else {
            slots.push({ key: 'free' + hh, time: hh, kind: 'free', label: 'פנוי', bg: '#e4f5ea', c: '#12803c' });
        }
    }
    // מפגשים של היום שנופלים מחוץ לשעות הפעילות של החדר — עדיין מוצגים לרישום נוכחות
    for (const c of dayCourses) {
        const ss = sessionsOf(c);
        for (let i = 0; i < ss.length; i++) {
            if (ss[i].day !== wd)
                continue;
            if (covered.some((x) => x.c.id === c.id && x.i === i))
                continue;
            slots.push({
                key: `out|${c.id}|${i}`,
                time: ss[i].time || '—',
                kind: 'course',
                label: termOf(config, 'entity.course', 'חוג') + ': ' + c.name + ' · מחוץ לשעות הפעילות של החדר',
                bg: '#fdf1d4',
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
/**
 * המשובצים למפגש: כל שיבוצי הקורס; כשיש כמה קבוצות — רק מי ששויך/ה לקבוצה
 * של המפגש הזה, בתוספת מי שעדיין ללא שיוך קבוצה (כדי שלא ייעלמו מהיומן).
 */
