import { buildCustomExport as __pure_buildCustomExport } from './build-custom-export.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_buildCustomExport_BUILD_CUSTOM_EXPORT_T = {
  k1: "courses",
  k2: "יום ",
  k3: "punch",
  k4: "כרטיסייה",
  k5: "half_year",
  k6: "מנוי חצי-שנתי",
  k7: "year",
  k8: "מנוי שנתי",
  k9: "מנוי חודשי",
  k10: " · יתרה ₪",
  k11: " תשלומים · ₪",
  k12: " חיסורים",
  k13: "events",
  k14: "כן",
  k15: "לא",
  k16: "supporters.ayin",
  k17: "entity.donations",
  k18: "תרומות",
};
const buildCustomExport = (...a) => __pure_buildCustomExport(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_buildCustomExport_BUILD_CUSTOM_EXPORT_T);

/* ---------- אובייקט-השקעים לבדיקה (מתועד בחוזה) ---------- */
const COURSE_DEFS = ['name', 'teacher', 'grade', 'room', 'schedule', 'model', 'occ', 'students', 'studentsFull', 'pays', 'revenue', 'abs'];
const EVENT_DEFS = ['title', 'type', 'hdate', 'gdate', 'time', 'fam', 'done'];
const SUP_DEFS = ['name', 'dons', 'donsAll', 'tier', 'stage', 'names', 'eyesTotal', 'paid', 'answers', 'next'];
const s = {
  expFieldDefs: (cfg, target) =>
    (target === 'courses' ? COURSE_DEFS : target === 'events' ? EVENT_DEFS : SUP_DEFS).map((k) => ({ key: k, label: 'ת:' + k })),
  featureOn: (cfg, k) => cfg.features?.[k] !== false,
  termOf: (cfg, k, fb) => fb,
  sessionsOf: (c) => (c.sessions && c.sessions.length ? c.sessions : [{ day: c.weekday, time: c.time, label: '' }]),
  enrollCount: () => 1,
  hebParts: (d) => ({ day: d.getDate(), month: String(d.getMonth()), year: d.getFullYear() }), // לוח-מדומה לועזי
  hebAnnualEq: (a, q) => a.day === q.day && a.month === q.month,
  hebDateFull: (iso) => 'ע:' + iso,
  supCount: (sp) => sp.donations.length,
  supIls: (sp) => sp.donations.filter((d) => d.cur !== '$').reduce((x, d) => x + (+d.amount || 0), 0),
  supUsd: (sp) => sp.donations.filter((d) => d.cur === '$').reduce((x, d) => x + (+d.amount || 0), 0),
  supScore: (sp) => sp.donations.length * 10,
  supTier: (sc) => ({ label: sc >= 30 ? 'זהב' : 'רגיל' }),
  stageLabel: (cfg, st) => 'ש:' + st,
  EV_META: { org: { label: 'אירוע' }, memorial: { label: 'אזכרה' } },
  HEBREW_RECURRING: new Set(['memorial', 'anniversary', 'bday']),
  DAY_NAMES: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
};
const cfg = { features: {} };
const AUG = { from: '2026-08-01', to: '2026-08-31' };

let f = 0;
const eq = (name, got, want) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) { console.error(`✗ ${name}:\n  ${JSON.stringify(got)}\n≠ ${JSON.stringify(want)}`); f = 1; }
};

// 1 — אפס שדות
eq('1 · selectedKeys ריק', buildCustomExport(cfg, { courses: [] }, 'courses', AUG, [], s), [[]]);

// 2 — courses
const dbC = {
  courses: [{ id: 'c1', name: 'ציור', teacherId: 't1', roomId: 'r1', model: 'punch', price: 120, maxStudents: 10, weekday: 0, time: '16:00', gradeMin: 'ג', gradeMax: 'ה' }],
  teachers: [{ id: 't1', name: 'הדס', phone: '050' }],
  rooms: [{ id: 'r1', name: 'אולם' }],
  families: [{ id: 'f1', name: 'פרץ', phone: '03', members: [{ id: 'm1', first: 'רות', phone: '' }] }],
  enrollments: [{ courseId: 'c1', memberId: 'm1', totalDue: 300, payments: [{ amount: 100, date: '2026-08-05' }, { amount: 50, date: '2026-05-01' }], absences: [{ date: '2026-08-10' }, { date: '2026-01-01' }] }],
};
const r2 = buildCustomExport(cfg, dbC, 'courses', AUG, COURSE_DEFS, s);
eq('2 · כותרות', r2[0], COURSE_DEFS.map((k) => 'ת:' + k));
eq('2 · שורת-החוג', r2[1], ['ציור', 'הדס 050', 'ג–ה', 'אולם', 'יום ראשון 16:00', 'כרטיסייה · ₪120', '1/10',
  'רות', 'רות 03 · יתרה ₪150', '1 תשלומים · ₪100', '₪150', '1 חיסורים']);

// 3 — events רגיל: הכללה-בטווח, customType, מיון
const dbE = {
  families: [{ id: 'f1', name: 'פרץ' }],
  events: [
    { type: 'org', title: 'ישיבה', date: '2026-08-20', time: '10:00', famId: 'f1', done: true },
    { type: 'custom', customType: 'מסיבה', title: 'חגיגה', date: '2026-08-10', done: false },
    { type: 'org', title: 'ישן', date: '2025-01-01' },
  ],
};
const r3 = buildCustomExport(cfg, dbE, 'events', AUG, EVENT_DEFS, s);
eq('3 · שתי שורות ממוינות', r3.length, 3);
eq('3 · חגיגה (customType דורס)', r3[1], ['חגיגה', 'מסיבה', 'ע:2026-08-10', '10/08/2026', '', '', 'לא']);
eq('3 · ישיבה', r3[2], ['ישיבה', 'אירוע', 'ע:2026-08-20', '20/08/2026', '10:00', 'פרץ', 'כן']);

// 4 — events חוזר (הלוח-המדומה)
const memA = { type: 'memorial', title: 'אזכרה-א', date: '2025-08-20' };
const r4a = buildCustomExport(cfg, { families: [], events: [memA] }, 'events', AUG, ['title', 'gdate'], s);
eq('4 · מופע שנתי בטווח החסום', r4a.slice(1), [['אזכרה-א', '20/08/2026']]);
const memB = { type: 'memorial', title: 'אזכרה-ב', date: '2026-08-25' };
const r4b = buildCustomExport(cfg, { families: [], events: [memB] }, 'events', { from: '2025-08-01', to: '2026-08-31' }, ['title', 'gdate'], s);
eq('4 · חסם iso≥ev.date — אין רפאים ב-2025', r4b.slice(1), [['אזכרה-ב', '25/08/2026']]);
const r4c = buildCustomExport(cfg, { families: [], events: [memA] }, 'events', { from: '', to: '' }, ['title', 'gdate'], s);
eq('4 · טווח ריק ⇒ החוזר בתאריך-המקור בלבד', r4c.slice(1), [['אזכרה-א', '20/08/2025']]);

// 5 — supporters: סינון-נגיעה + סכומי-מטבע
const sp1 = { name: 'שרה', donations: [{ date: '2026-08-05', amount: 100, cur: '₪' }, { date: '2026-08-06', amount: '20', cur: '$' }, { date: '2025-01-01', amount: 999, cur: '₪' }] };
const sp0 = { name: 'רחל', donations: [{ date: '2025-01-01', amount: 5, cur: '₪' }] };
const r5 = buildCustomExport(cfg, { usdRate: 3.7, supporters: [sp0, sp1] }, 'supporters', AUG, SUP_DEFS, s);
eq('5 · רחל מוחרגת', r5.length, 2);
eq('5 · שורת שרה', r5[1], ['שרה', '2 תרומות · ₪100 + $20', '3 תרומות · ₪1099 + $20', 'זהב', '', '', '', '', '', '']);

// 6 — supporters עם ayin דלוק (חסר-דגל = דלוק)
const sp2 = {
  name: 'לאה', donations: [],
  ayin: { stage: 'eyes', lastTouch: '2026-08-15', log: [], paid: true, nextTalk: '2026-09-01', nextTalkTime: '10:30',
    names: [{ name: 'משה', eyes: 4, done: true }, { name: 'רות', eyes: '' }],
    answers: [{ date: '2026-08-10', note: 'א' }, { date: '2025-01-01', note: 'ישן' }] },
};
const r6 = buildCustomExport(cfg, { usdRate: 3.7, supporters: [sp2] }, 'supporters', AUG, SUP_DEFS, s);
eq('6 · שורת לאה', r6[1], ['לאה', '0 תרומות · ₪0', '0 תרומות · ₪0', 'רגיל', 'ש:eyes', 'משה ·4 ✓ · רות', '4', 'כן', 'א', '01/09/2026 10:30']);

// 7 — ayin כבוי: מגע-בלבד מוחרג; תשובה-בטווח נשארת אך עמודות-ayin ריקות
const sp3 = { name: 'מרים', donations: [], ayin: { stage: 'new', lastTouch: '2026-08-15', log: [], names: [], answers: [] } };
const cfgOff = { features: { 'supporters.ayin': false } };
const r7 = buildCustomExport(cfgOff, { usdRate: 3.7, supporters: [sp3, sp2] }, 'supporters', AUG, SUP_DEFS, s);
eq('7 · רק לאה (מרים מוחרגת)', r7.slice(1).map((r) => r[0]), ['לאה']);
eq('7 · עמודות-ayin ריקות', r7[1].slice(4), ['', '', '', '', '', '']);

if (f) process.exit(1);
console.log('✓ build-custom-export: 7 דוגמאות-חוזה — ירוק');
