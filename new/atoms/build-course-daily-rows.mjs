/** חוט · build-course-daily-rows — דו"ח נוכחות יומי מפורט לחוג, מפגש-מפגש.
 *  חוזה: build-course-daily-rows.contract.md · שקעים: termOf, hebDateFull
 *  חולץ כלשונו מ-maor/src/lib/courseDaily.ts:23-92; העוזרים הפרטיים של הקובץ
 *  (DAY_NAMES · isoOf · fmtD) נשארו בקובץ — עוזר-פנימי, לא import. */




export function buildCourseDailyRows(c, db, config, termOf, hebDateFull, DAY_NAMES, T2) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  function isoOf(d) {
      const p2 = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
  }
  function fmtD(iso) {
      const [y, m, d] = iso.split('-');
      return `${d}/${m}/${y}`;
  }

    const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
    const rows = [
        [T2.k1, T2.k2, T2.k3, T2.k4, T2.k5, T2.k6, T(T2.k7, T2.k8), T2.k9],
    ];
    if (!c.start || !c.end)
        return { rows, days: 0 };
    // אינדקס בן-משפחה → שם פרטי + שם משפחה
    const memberFam = new Map();
    for (const f of db.families)
        for (const m of f.members)
            memberFam.set(m.id, { first: m.first, famName: f.name });
    const enrolls = db.enrollments.filter((e) => e.courseId === c.id);
    const sessions = c.sessions && c.sessions.length ? c.sessions : [{ day: c.weekday, time: c.time, label: '' }];
    const start = new Date(c.start + 'T12:00:00');
    const end = new Date(c.end + 'T12:00:00');
    // תקרת בטיחות: קורס לגיטימי הוא שנתי/דו-שנתי (עד ~100 ימי מפגש). טווח ענק
    // (טעות הקלדה בשנת הסיום, למשל 2202) היה מייצר עשרות אלפי שורות עם hebDateFull
    // (Intl) יקר לכל שורה — הקפאה של הדפדפן. עוצרים ומסמנים קטיעה.
    const MAX_DAYS = 500;
    let days = 0;
    let truncated = false;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const iso = isoOf(d);
        const dow = d.getDay();
        const sess = sessions.filter((ss) => ss.day === dow);
        if (!sess.length)
            continue;
        if (days >= MAX_DAYS) {
            truncated = true;
            break;
        }
        days++;
        for (const ss of sess) {
            const slot = (ss.label || T2.k10) + ' · ' + (ss.time || '');
            // תלמידה "פעילה" במפגש — שובצה עד היום ושייכת לקבוצת המפגש. שיבוץ שהסתיים
            // (#8) עדיין כלול במפגשים שקדמו לתאריך-הסיום שלו, כדי שלא ייעלם רטרואקטיבית
            // מהדוח ההיסטורי; שיבוץ-ישן שהסתיים בלי endedAt נשאר מוחרג (אין תאריך אמין).
            const active = enrolls.filter((e) => e.status !== T2.k11 && // רשימת-המתנה לא בדוח-הנוכחות (עדיין לא לומד/ת)
                (!e.enrolledAt || e.enrolledAt <= iso) &&
                (!ss.label || !e.group || e.group === ss.label) &&
                (e.status !== T2.k12 || (!!e.endedAt && iso < e.endedAt)));
            if (!active.length) {
                rows.push([hebDateFull(iso), fmtD(iso), DAY_NAMES[dow], slot, T2.k13, '', '', '']);
                continue;
            }
            for (const e of active) {
                const mf = memberFam.get(e.memberId);
                const abs = e.absences.find((a) => a.date === iso);
                const dayStatus = e.status === T2.k14 ? T2.k15 : T2.k16;
                const attend = e.status === T2.k14
                    ? T2.k15
                    : abs
                        ? abs.noshow
                            ? T2.k17
                            : T2.k18 + (abs.reason ? ' · ' + abs.reason : '')
                        : T2.k19;
                rows.push([hebDateFull(iso), fmtD(iso), DAY_NAMES[dow], slot, dayStatus, mf?.first || '', mf?.famName || '', attend]);
            }
        }
    }
    if (truncated) {
        rows.push(['—', '—', '—', '—', `הדוח נקטע ב-${MAX_DAYS} ימי מפגש — בדקו את תאריך הסיום של ה${T('entity.course', 'חוג')}`, '', '', '']);
    }
    return { rows, days };
}
