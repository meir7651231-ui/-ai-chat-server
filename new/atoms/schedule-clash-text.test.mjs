import { scheduleClashText as __pure_scheduleClashText } from './schedule-clash-text.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_schedule_clash_text_T = {
  k1: "ended",
  k2: "⚠ התנגשות לו\"ז: כבר משובצ/ת ל\"",
  k3: "\" — יום ",
};
const __d_schedule_clash_text_dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];
const scheduleClashText = (...a) => __pure_scheduleClashText(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_schedule_clash_text_dayNames, __d_schedule_clash_text_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקע-מפגשים = סמנטיקת-המוצא (sessionsOf)
const sessionsOf = (c) => (c.sessions && c.sessions.length ? c.sessions : [{ day: c.weekday, time: c.time, label: '' }]);

const piano = { id: 'c1', name: 'פסנתר', weekday: 2, time: '17:00' };
const paint = { id: 'c2', name: 'ציור', weekday: 2, time: '17:00' };
const db = (courses, enrollments) => ({ courses, enrollments });

// 1) התנגשות מלאה — נוסח מדויק
ok(
  scheduleClashText(db([paint], [{ memberId: 'm1', courseId: 'c2', status: 'active' }]), 'm1', piano, sessionsOf) ===
    '⚠ התנגשות לו"ז: כבר משובצ/ת ל"ציור" — יום שלישי 17:00',
  'דוגמה 1: נוסח-האזהרה',
);
// 2) אותו יום, שעה שונה ⇒ null
ok(
  scheduleClashText(db([{ ...paint, time: '18:00' }], [{ memberId: 'm1', courseId: 'c2', status: 'active' }]), 'm1', piano, sessionsOf) === null,
  'דוגמה 2: שעה שונה',
);
// 3) שיבוץ שהסתיים ⇒ null
ok(
  scheduleClashText(db([paint], [{ memberId: 'm1', courseId: 'c2', status: 'ended' }]), 'm1', piano, sessionsOf) === null,
  'דוגמה 3: ended מוחרג',
);
// 4) שיבוץ לחוג-היעד עצמו ⇒ null
ok(
  scheduleClashText(db([piano], [{ memberId: 'm1', courseId: 'c1', status: 'active' }]), 'm1', piano, sessionsOf) === null,
  'דוגמה 4: חוג-היעד עצמו',
);
// 5) שעות ריקות ⇒ null
ok(
  scheduleClashText(
    db([{ ...paint, time: '' }], [{ memberId: 'm1', courseId: 'c2', status: 'active' }]),
    'm1', { ...piano, time: '' }, sessionsOf,
  ) === null,
  'דוגמה 5: שעה ריקה לא מתנגשת',
);
// 6) ילד אחר ⇒ null
ok(
  scheduleClashText(db([paint], [{ memberId: 'm2', courseId: 'c2', status: 'active' }]), 'm1', piano, sessionsOf) === null,
  'דוגמה 6: ילד אחר',
);
// 7) חוג שנמחק ⇒ null
ok(
  scheduleClashText(db([], [{ memberId: 'm1', courseId: 'c2', status: 'active' }]), 'm1', piano, sessionsOf) === null,
  'דוגמה 7: חוג חסר מדולג',
);
// 8) התנגשות דרך מערך-sessions מרובה (יום 4 = חמישי)
const multiTarget = { id: 'c1', name: 'פסנתר', sessions: [{ day: 2, time: '17:00', label: '' }, { day: 4, time: '16:30', label: '' }] };
const thursday = { id: 'c3', name: 'תפירה', weekday: 4, time: '16:30' };
ok(
  scheduleClashText(db([thursday], [{ memberId: 'm1', courseId: 'c3', status: 'active' }]), 'm1', multiTarget, sessionsOf) ===
    '⚠ התנגשות לו"ז: כבר משובצ/ת ל"תפירה" — יום חמישי 16:30',
  'דוגמה 8: sessions מרובים',
);

if (f) process.exit(1);
console.log('✓ schedule-clash-text: 8 דוגמאות-חוזה (שקעי sessionsOf/dayNames) — ירוק');
