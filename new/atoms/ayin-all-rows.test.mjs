import { ayinAllRows as __pure_ayinAllRows } from './ayin-all-rows.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_ayinAllRows_AYIN_ALL_ROWS_T = {
  k1: "תורם/ת",
  k2: "טלפון",
  k3: "שם",
  k4: "הערה",
  k5: "סטטוס",
  k6: "שלב",
  k7: "טופל ✓",
  k8: "ממתין",
};
const ayinAllRows = (...a) => __pure_ayinAllRows(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_ayinAllRows_AYIN_ALL_ROWS_T);
// מימושי-שקע לבדיקה — נאמנים למקור (ayin.ts / domain.ts):
const unitLabel = () => 'כמות';
const emptyAyin = () => ({ stage: 'new', note: '', answeredNote: '', answerPushed: false, nextTalk: '', nextTalkTime: '', lastTouch: '', names: [], answers: [], log: [], time: [], mat: [] });
const FALLBACK = { new: 'חדש', lead: 'בהכנה', eyes: 'רישום', answer: 'מסירה', done: 'הושלם' };
const stageLabel = (cfg, st) => FALLBACK[st];
const supporters = [
  { name: 'דוד', phone: '050', ayin: { stage: 'eyes', names: [
    { name: 'משה', eyes: 3, note: 'דחוף', done: true },
    { name: '  ', eyes: 5 },
    { name: 'רות', eyes: '' },
    { name: 'חנה', eyes: 0 },
  ] } },
  { name: 'בלי-ayin' },
];
const rows = ayinAllRows({}, supporters, unitLabel, emptyAyin, stageLabel);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ': ' + JSON.stringify(a));
ok(rows.length === 4, 'אורך ' + rows.length + ' ≠ 4 (שם-רווחים + בלי-ayin מדולגים)');
eq(rows[0], ['תורם/ת', 'טלפון', 'שם', 'כמות', 'הערה', 'סטטוס', 'שלב'], 'כותרות');
eq(rows[1], ['דוד', '050', 'משה', 3, 'דחוף', 'טופל ✓', 'רישום'], 'שורת משה');
eq(rows[2], ['דוד', '050', 'רות', '', '', 'ממתין', 'רישום'], "eyes:'' ⇒ ''");
eq(rows[3], ['דוד', '050', 'חנה', 0, '', 'ממתין', 'רישום'], 'eyes:0 נשמר');
if (f) process.exit(1);
console.log('✓ ayin-all-rows: 5 דוגמאות-חוזה — ירוק');
