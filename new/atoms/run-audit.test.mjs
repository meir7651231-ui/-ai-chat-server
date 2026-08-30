import { runAudit as __pure_runAudit } from './run-audit.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_runAudit_RUN_AUDIT_T = {
  k1: "כפילות",
  k2: "שם + שם האם זהים: \"",
  k3: " רשומות",
  k4: "טלפון ",
  k5: " משותף ל-",
  k6: "nav.families",
  k7: "משפחות",
  k8: "ת\"ז ",
  k9: " מופיעה ב-",
  k10: "אב",
  k11: "אם",
  k12: "ת\"ז",
  k13: "entity.familyOf",
  k14: "משפחת",
  k15: ": ת\"ז ",
  k16: " לא עוברת ספרת ביקורת (",
  k17: "טלפון",
  k18: "אימייל",
  k19: ": אימייל לא תקין (",
  k20: "inactive",
  k21: "כתובת",
  k22: ": חסרה עיר",
  k23: ": יש עיר אבל חסרה כתובת",
  k24: "אלמן/ה",
  k25: "גרושים",
  k26: "פרודים",
  k27: "לוגיקה",
  k28: ": מסומנת \"",
  k29: "\" — אמורה להיות בלי בן/בת זוג, אבל רשומים שניים (",
  k30: "\" אבל רשומות שתי תעודות זהות של בני זוג",
  k31: "נשואים",
  k32: "active",
  k33: ": מסומנת נשואים אבל לא רשום אף בן זוג",
  k34: "קשר",
  k35: ": אין שום פרט קשר (טלפון או אימייל)",
  k36: ": ת\"ז של ",
  k37: " (הורה) לא תקינה",
  k38: "ילדים",
  k39: ": ל",
  k40: " אין תאריך לידה",
  k41: ": גיל חריג ל",
  k42: " לא תקינה",
  k43: ": טלפון של ",
  k44: ": הילד/ה ",
  k45: " מופיע/ה פעמיים",
  k46: ": שולם ₪",
  k47: " — יותר מסה\"כ העסקה (₪",
  k48: "). בדקו החזר או עדכנו את הסכום",
  k49: "תומכ/ת ",
  k50: ": ת\"ז לא תקינה (",
  k51: ": הסכום המצטבר הרשום (₪",
  k52: "entity.donations",
  k53: "תרומות",
  k54: ") לא תואם את פירוט ה",
  k55: "עבר יעד הקשר של \"",
  k56: "entity.donation",
  k57: "תרומה",
  k58: " בסכום ",
  k59: " אצל \"",
  k60: "תומכ/ת בשם \"",
  k61: "\" מופיע/ה ",
  k62: " פעמים",
};
const runAudit = (...a) => __pure_runAudit(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_runAudit_RUN_AUDIT_T);
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

// שקעי-בדיקה (כמתועד בחוזה)
const validIsraeliId = (x) => {
  const d = String(x).padStart(9, '0');
  if (String(x).length > 9 || !String(x).length) return false;
  let s = 0;
  for (let i = 0; i < 9; i++) { const n = +d[i] * ((i % 2) + 1); s += n > 9 ? n - 9 : n; }
  return s % 10 === 0;
};
const deps = {
  termOf: (config, k, fb) => (k === 'nav.families' ? 'בתי-אב' : fb),
  normName: (s) => (s || '').trim().toLowerCase(),
  validIsraeliId,
  phoneIssue: (p) => (p === '052' ? 'קצר מדי: 052' : null),
  ageOf: (birth) => (birth === '2030-01-01' ? -4 : 10),
  supporterAggregates: () => ({ ils: 100, usd: 0, count: 1 }),
};

// משפחה "נקייה" — לא מייצרת שום ממצא
const fam = (id, over = {}) => ({
  id, name: 'לוי-' + id, mother: 'רחל', phone: '05299900' + id.slice(-2),
  city: 'צפת', address: 'רח 1', status: 'active', members: [], ...over,
});
// תומך "נקי" — תואם את מצבור-השקע {ils:100,usd:0,count:1}
const sup = (id, over = {}) => ({
  id, name: 'תורם-' + id, ils: 100, usd: 0, count: 1,
  donations: [{ amount: 100, rid: 'R-' + id }], ...over,
});
const emptyDb = { families: [], enrollments: [], supporters: [] };

// 1) שם+אם זהים ⇒ ממצא-כפילות יחיד
const r1 = runAudit({ ...emptyDb, families: [
  fam('f01', { name: 'כהן', mother: 'שרה' }),
  fam('f02', { name: 'כהן', mother: 'שרה' }),
] }, '', true, undefined, deps);
chk('1 כפילות שם+אם',
  r1.length === 1 && r1[0].cat === 'כפילות' &&
  r1[0].title === 'שם + שם האם זהים: "כהן" — 2 רשומות' && r1[0].famId === 'f01');

// 2) טלפון משותף — פעם אחת לזוג; termOf מחליף 'משפחות'
const dbPhone = { ...emptyDb, families: [
  fam('f11', { name: 'א', phone: '0521111111' }),
  fam('f12', { name: 'ב', phone: '0521111111', phone2: '0521111111' }),
] };
const r2 = runAudit(dbPhone, '', true, undefined, deps);
chk('2א טלפון משותף — ממצא יחיד בנוסח ברירת-המחדל',
  r2.length === 1 && r2[0].cat === 'כפילות' &&
  r2[0].title === 'טלפון 0521111111 משותף ל-2 משפחות: א, ב');
const r2b = runAudit(dbPhone, '', true, {}, deps);
chk('2ב עם config ⇒ מונח termOf "בתי-אב"',
  r2b[0].title === 'טלפון 0521111111 משותף ל-2 בתי-אב: א, ב');

// 3) ת"ז אב עם ספרת-ביקורת שגויה; תקינה ⇒ נקי
const r3 = runAudit({ ...emptyDb, families: [fam('f21', { fatherId: '123456789' })] }, '', true, undefined, deps);
chk('3א ת"ז אב שגויה',
  r3.length === 1 && r3[0].cat === 'ת"ז' &&
  r3[0].title === 'משפחת לוי-f21: ת"ז אב לא עוברת ספרת ביקורת (123456789)');
const r3b = runAudit({ ...emptyDb, families: [fam('f22', { fatherId: '123456782' })] }, '', true, undefined, deps);
chk('3ב ת"ז תקינה ⇒ אפס ממצאים', r3b.length === 0);

// 4) פעילה בלי עיר ⇒ 'כתובת'; inactive ⇒ מדולגת
const r4 = runAudit({ ...emptyDb, families: [fam('f31', { city: '' })] }, '', true, undefined, deps);
chk('4א חסרה עיר',
  r4.length === 1 && r4[0].cat === 'כתובת' && r4[0].title === 'משפחת לוי-f31: חסרה עיר');
const r4b = runAudit({ ...emptyDb, families: [fam('f32', { city: '', status: 'inactive' })] }, '', true, undefined, deps);
chk('4ב ‏inactive לא נבדקת', r4b.length === 0);

// 5) תשלום-יתר בשיבוץ ⇒ 'לוגיקה' עם famId של משפחת-החבר
const r5 = runAudit({
  families: [fam('f41', { members: [{ id: 'm1', isParent: true }] })],
  enrollments: [{ memberId: 'm1', totalDue: 200, payments: [{ amount: 120 }, { amount: 180 }] }],
  supporters: [],
}, '', true, undefined, deps);
chk('5 תשלום-יתר ₪300 > ₪200',
  r5.length === 1 && r5[0].cat === 'לוגיקה' && r5[0].famId === 'f41' &&
  r5[0].title === 'משפחת לוי-f41: שולם ₪300 — יותר מסה"כ העסקה (₪200). בדקו החזר או עדכנו את הסכום');

// 6) אי-התאמת מצבור/פירוט אצל תומך; תואם ⇒ נקי
const r6 = runAudit({ ...emptyDb, supporters: [sup('s01', { ils: 50 })] }, '', true, undefined, deps);
chk('6א מצבור 50 מול נגזר 100 ⇒ לוגיקה',
  r6.length === 1 && r6[0].cat === 'לוגיקה' && r6[0].spId === 's01' &&
  r6[0].title.includes('הסכום המצטבר הרשום (₪50') && r6[0].title.includes('(₪100'));
chk('6ב מצבור תואם ⇒ אפס ממצאים',
  runAudit({ ...emptyDb, supporters: [sup('s02')] }, '', true, undefined, deps).length === 0);

// 7) יעד-קשר שעבר — רק ב-extra=true
const dbNext = { ...emptyDb, supporters: [sup('s03', { nextDate: '2026-08-01' })] };
const r7 = runAudit(dbNext, '2026-08-24', true, undefined, deps);
chk('7א ‏extra=true ⇒ ממצא-קשר',
  r7.length === 1 && r7[0].cat === 'קשר' &&
  r7[0].title === 'עבר יעד הקשר של "תורם-s03" (2026-08-01)');
chk('7ב ‏extra=false ⇒ כבוי',
  runAudit(dbNext, '2026-08-24', false, undefined, deps).length === 0);

if (f) process.exit(1);
console.log('✓ run-audit: 7 דוגמאות-חוזה (12 בדיקות) — ירוק');
