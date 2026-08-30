import { buildSlots as __pure_buildSlots } from './build-slots.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_buildSlots_BUILD_SLOTS_T = {
  k1: "clean",
  k2: "cleaning",
  k3: "ניקיון יומי (15:00–16:00)",
  k4: "#eceae2",
  k5: "course",
  k6: "entity.course",
  k7: "חוג",
  k8: "#fdf1d4",
  k9: "event",
  k10: "אירוע: ",
  k11: "#e7edf5",
  k12: "blk",
  k13: "blocked",
  k14: "חסום — ",
  k15: "#fdeaea",
  k16: "free",
  k17: "פנוי",
  k18: " · מחוץ לשעות הפעילות של החדר",
  k19: "crs|",
  k20: "out|",
  k21: 60,
  k22: 20,
  k23: 96,
  k24: 900,
  k25: 960,
};
const buildSlots = (...a) => __pure_buildSlots(...a, ...Array(Math.max(0, 7 - a.length)).fill(undefined), __d_buildSlots_BUILD_SLOTS_T);

// שקעי-הבדיקה — הסמנטיקה של השכנים במקור (diary/lib.ts + courses/lib.ts + config.ts)
const pad2 = (n) => String(n).padStart(2, '0');
const S = {
  timeToMin: (t) => { const m = /^(\d{1,2}):(\d{2})$/.exec(String(t || '').trim()); return m ? +m[1] * 60 + +m[2] : NaN; },
  minToHM: (min) => pad2(Math.floor(min / 60)) + ':' + pad2(min % 60),
  sessionsOf: (c) => (c.sessions && c.sessions.length ? c.sessions : [{ day: c.weekday, time: c.time, label: '' }]),
  courseOnDate: (c, iso) => (!c.start || iso >= c.start) && (!c.end || iso <= c.end),
  termOf: (cfg, key, fb) => { const v = cfg?.terms?.[key]; return typeof v === 'string' && v.trim() ? v.trim() : fb; },
};

const ISO = '2026-08-24'; // יום שני, wd=1
const db = {
  courses: [
    { id: 'c1', name: 'ציור', roomId: 'r1', sessions: [{ day: 1, time: '10:00', label: '' }] },
    { id: 'c2', name: 'שחייה', roomId: 'r1', sessions: [{ day: 1, time: '21:30', label: '' }] },
  ],
  events: [{ id: 'ev1', title: 'פגישה', roomId: 'r1', date: ISO, time: '11:15', done: false }],
};
const r1 = { id: 'r1', from: '09:00', to: '12:00', slot: 60 };

let f = 0;
const eq = (n, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g !== w) { console.error(`✗ דוגמה ${n}: ${g} ≠ ${w}`); f = 1; }
};

// 1 · חדר עם חוג + אירוע + מפגש-מחוץ-לשעות
const a = buildSlots(db, r1, ISO, null, {}, S);
eq('1-keys', a.map((s) => s.key), ['free09:00', 'crs|10:00|c1|0', 'ev|11:00|ev1', 'out|c2|0']);
eq('1-labels', a.map((s) => s.label), ['פנוי', 'חוג: ציור', 'אירוע: פגישה', 'חוג: שחייה · מחוץ לשעות הפעילות של החדר']);
eq('1-times', [a[1].bg, a[2].time, a[3].time, a[3].outOfHours, a[3].kind], ['#fdf1d4', '11:15', '21:30', true, 'course']);
// 2 · חסימה — רק הפנוי הופך חסום
const b = buildSlots(db, r1, ISO, 'שבת', {}, S);
eq('2', [b[0].key, b[0].kind, b[0].label, b[1].key, b[2].key], ['blk09:00', 'blocked', 'חסום — שבת', 'crs|10:00|c1|0', 'ev|11:00|ev1']);
// 3 · ניקיון-יומי 15:00 + כיבוי הדגל
const r2 = { id: 'r2', from: '14:00', to: '16:00', slot: 60 };
const c = buildSlots(db, r2, ISO, null, {}, S);
eq('3a', c.map((s) => [s.kind, s.time]), [['free', '14:00'], ['cleaning', '15:00']]);
eq('3a-label', c[1].label, 'ניקיון יומי (15:00–16:00)');
eq('3b', buildSlots(db, r2, ISO, null, {}, S, false).map((s) => s.kind), ['free', 'free']);
// 4 · ברירות-מחדל לשעות/צעד לא-תקינים — 08:00–20:00/60
const d = buildSlots({ courses: [], events: [] }, { id: 'r3', from: '', to: '', slot: 0 }, ISO, null, {}, S);
eq('4', [d.length, d[0].time, d[7].kind, d.filter((s) => s.kind === 'free').length], [12, '08:00', 'cleaning', 11]);
// 5 · מונח דרך termOf
const e = buildSlots(db, r1, ISO, null, { terms: { 'entity.course': 'שיעור' } }, S);
eq('5', e[1].label, 'שיעור: ציור');

if (f) process.exit(1);
console.log('✓ build-slots: 9 בדיקות מ-5 דוגמאות-חוזה — ירוק');
