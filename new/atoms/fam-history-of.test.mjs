import { famHistoryOf as __pure_famHistoryOf } from './fam-history-of.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_famHistoryOf_FAM_HISTORY_OF_T = {
  k1: "הצטרפות",
  k2: "#e7edf5",
  k3: "ה",
  k4: "entity.family",
  k5: "משפחה",
  k6: " הצטרפה",
  k7: "אירוע",
  k8: "#efe7f3",
  k9: "#7c3aed",
  k10: " · ✓ בוצע",
  k11: "entity.cred",
  k12: "אמינות",
  k13: "#f6ead1",
  k14: " נק׳)",
  k15: "מסמך",
  k16: "#eceae2",
  k17: "מסמך נוסף: ",
  k18: "entity.enrollment",
  k19: "שיבוץ",
  k20: "#eef7e6",
  k21: "נרשמ/ה ",
  k22: " ל",
  k23: "wait",
  k24: " · ברשימת-המתנה",
  k25: "תשלום",
  k26: "תשלום ₪",
  k27: "No-Show",
  k28: "היעדרות",
  k29: "#fdeaea",
  k30: "היעדרות — ",
  k31: " · זכאי/ת השלמה",
  k32: 40,
};
const famHistoryOf = (...a) => __pure_famHistoryOf(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_famHistoryOf_FAM_HISTORY_OF_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
// השקע האמיתי של termOf (מילון-הארגון או נסיגה)
const termOf = (cfg, key, fallback) => {
  const v = cfg.terms?.[key];
  if (typeof v === 'string') { const t = v.trim(); if (t) return t; }
  return fallback;
};
const emptyDb = { events: [], enrollments: [], courses: [] };
const minFam = { id: 'f1', createdAt: '2026-01-05', members: [], docs: [] };
// 1) משפחה מינימלית — רשומת-הצטרפות יחידה
const r1 = famHistoryOf(emptyDb, minFam, {}, termOf);
ok(eq(r1, [{ date: '2026-01-05', tag: 'הצטרפות', bg: '#e7edf5', c: '#3a5a86', text: 'המשפחה הצטרפה' }]), 'רשומת-ההצטרפות שגויה');
// 2) מילון-הארגון
const r2 = famHistoryOf(emptyDb, minFam, { terms: { 'entity.family': 'לקוחה' } }, termOf);
ok(r2[0].text === 'הלקוחה הצטרפה', 'termOf לא הוחל על entity.family');
// 3) אירוע-לוח — שלי נכנס (עם time+done), זר בחוץ, בלי-date נדלג
const db3 = { ...emptyDb, events: [
  { famId: 'f1', date: '2026-02-01', title: 'ביקור-בית', time: '10:00', done: true },
  { famId: 'f2', date: '2026-02-02', title: 'זר' },
  { famId: 'f1', date: '', title: 'בלי-תאריך' },
] };
const r3 = famHistoryOf(db3, { ...minFam, createdAt: '' }, {}, termOf);
ok(r3.length === 1 && r3[0].tag === 'אירוע' && r3[0].text === 'ביקור-בית · 10:00 · ✓ בוצע', 'אירוע-הלוח שגוי/דלף');
// 4) לוג-אמינות — סימן + רק לחיובי
const fam4 = { ...minFam, createdAt: '', cred: { log: [
  { date: '2026-04-01', reason: 'נוכחות', delta: 5 },
  { date: '2026-04-02', reason: 'No-Show', delta: -10 },
] } };
const r4 = famHistoryOf(emptyDb, fam4, {}, termOf);
ok(r4.length === 2 && r4[1].tag === 'אמינות' && r4[1].text === 'נוכחות (+5 נק׳)', 'לוג-אמינות חיובי שגוי');
ok(r4[0].text === 'No-Show (-10 נק׳)', 'דלתא שלילית קיבלה +');
// 5) שיבוץ-wait + תשלום + No-Show
const db5 = { events: [], courses: [{ id: 'c1', name: 'ציור' }], enrollments: [{
  memberId: 'm1', courseId: 'c1', enrolledAt: '2026-03-01', status: 'wait',
  payments: [{ date: '2026-03-02', amount: 120, method: 'מזומן', rid: 'R-1' }],
  absences: [{ date: '2026-03-09', noshow: true }],
}] };
const fam5 = { id: 'f1', createdAt: '', members: [{ id: 'm1', first: 'דנה' }], docs: [] };
const r5 = famHistoryOf(db5, fam5, {}, termOf);
ok(eq(r5.map((x) => [x.tag, x.text]), [
  ['No-Show', 'היעדרות — ציור'],
  ['תשלום', 'תשלום ₪120 (מזומן) — ציור · R-1'],
  ['שיבוץ', 'נרשמ/ה דנה לציור · ברשימת-המתנה'],
]), 'שלישיית שיבוץ/תשלום/היעדרות שגויה');
// 5ב) בלי noshow ⇒ tag='היעדרות'
const db5b = { ...db5, enrollments: [{ ...db5.enrollments[0], payments: [], absences: [{ date: '2026-03-09', reason: 'מחלה', makeup: true }] }] };
const r5b = famHistoryOf(db5b, fam5, {}, termOf);
ok(r5b[0].tag === 'היעדרות' && r5b[0].text === 'היעדרות — ציור · מחלה · זכאי/ת השלמה', 'היעדרות-רגילה שגויה');
// 6) מסמך
const r6 = famHistoryOf(emptyDb, { ...minFam, createdAt: '', docs: [{ addedAt: '2026-05-01', name: 'ספח' }] }, {}, termOf);
ok(r6.length === 1 && r6[0].tag === 'מסמך' && r6[0].text === 'מסמך נוסף: ספח', 'רשומת-המסמך שגויה');
// 7) מיון יורד + קציצה ל-40
const evs = Array.from({ length: 45 }, (_, i) => ({ famId: 'f1', date: '2026-06-' + String(i + 1).padStart(2, '0'), title: 'e' + (i + 1) }));
const r7 = famHistoryOf({ ...emptyDb, events: evs }, { ...minFam, createdAt: '' }, {}, termOf);
ok(r7.length === 40, 'הקציצה ל-40 נכשלה (אורך ' + r7.length + ')');
ok(r7[0].date === '2026-06-45' && r7[39].date === '2026-06-06', 'המיון-היורד/הקצה שגויים');
if (f) process.exit(1);
console.log('✓ fam-history-of: 7 דוגמאות-חוזה — ירוק');
