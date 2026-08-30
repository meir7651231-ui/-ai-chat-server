import { ayinDailyRows as __pure_ayinDailyRows } from './ayin-daily-rows.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_ayinDailyRows_AYIN_DAILY_ROWS_T = {
  k1: "שם",
  k2: "טלפון",
  k3: "שלב",
  k4: "מתי לדבר שוב",
  k5: "הערה",
  k6: " היום",
};
const ayinDailyRows = (...a) => __pure_ayinDailyRows(...a, ...Array(Math.max(0, 8 - a.length)).fill(undefined), __d_ayinDailyRows_AYIN_DAILY_ROWS_T);
// מימושי-שקע לבדיקה — נאמנים למקור (ayin.ts / domain.ts):
const unitLabel = () => 'כמות';
const itemLabel = () => 'שם לטיפול';
const emptyAyin = () => ({ stage: 'new', note: '', answeredNote: '', answerPushed: false, nextTalk: '', nextTalkTime: '', lastTouch: '', names: [], answers: [], log: [], time: [], mat: [] });
const eyesTotal = (a) => a.names.reduce((t, x) => t + (+x.eyes || 0), 0);
const FALLBACK = { new: 'חדש', lead: 'בהכנה', eyes: 'רישום', answer: 'מסירה', done: 'הושלם' };
const stageLabel = (cfg, st) => FALLBACK[st];
const today = '2026-08-24';
const supporters = [
  { name: 'דוד', phone: '050', ayin: { stage: 'eyes', lastTouch: '2026-08-20',
    log: [{ date: '2026-08-24', eyes: '3' }, { date: '2026-08-24', eyes: 2 }, { date: '2026-08-23', eyes: 9 }],
    names: [{ name: 'משה', eyes: 4, done: true }, { name: 'רות', eyes: '' }],
    answers: [], note: 'הערה כללית', nextTalk: '2026-09-01' } },
  { name: 'לאה', ayin: { stage: 'new', lastTouch: '2026-08-24',
    names: [{ name: 'יעל', eyes: 2 }], answers: [{ note: 'א' }, { note: 'ב' }] } }, // חלקי — בלי log
  { name: 'נח', ayin: { stage: 'lead', lastTouch: '2026-08-24' } }, // חלקי לגמרי
  { name: 'גד', ayin: { stage: 'eyes', lastTouch: '2026-08-20' } }, // לא-נגע היום
  { name: 'בלי-ayin' },
];
const rows = ayinDailyRows({}, supporters, today, unitLabel, itemLabel, emptyAyin, eyesTotal, stageLabel);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ': ' + JSON.stringify(a));
ok(rows.length === 4, 'אורך ' + rows.length + ' ≠ 4 (לא-נגע-היום + בלי-ayin לא-בדוח)');
eq(rows[0], ['שם', 'טלפון', 'כמות היום', 'שלב', 'שם לטיפול', 'מתי לדבר שוב', 'הערה'], 'כותרות');
eq(rows[1], ['דוד', '050', 5, 'רישום', 'משה ·4 ✓ · רות', '01/09/2026', 'הערה כללית'], 'שורת דוד (log-היום 3+2)');
eq(rows[2], ['לאה', '', 2, 'חדש', 'יעל ·2', '', 'א | ב'], 'שורת לאה (ayin חלקי — eyesTotal + answers)');
eq(rows[3], ['נח', '', '', 'בהכנה', '', '', ''], "שורת נח (חלקי לגמרי — eyesTotal=0 ⇒ '')");
if (f) process.exit(1);
console.log('✓ ayin-daily-rows: 5 דוגמאות-חוזה — ירוק');
