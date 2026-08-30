import { buildReenrollRows as __pure_buildReenrollRows } from './build-reenroll-rows.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_buildReenrollRows_BUILD_REENROLL_ROWS_T = {
  k1: "undecided",
};
const buildReenrollRows = (...a) => __pure_buildReenrollRows(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_buildReenrollRows_BUILD_REENROLL_ROWS_T);

// שקעי-הבדיקה — הסמנטיקה של השכנים במקור (reenroll-lib.ts)
const S = {
  isRenewed: (e) => !!e.renewedToId,
  renewOf: (e) => e.renew ?? '',
  enrollSummary: (e) => ({ presents: (e.presents ?? []).length }),
  findMember: (db, id) => {
    for (const f of db.families) {
      const m = f.members.find((x) => x.id === id);
      if (m) return { member: m, family: f.name || '' };
    }
    return { member: null, family: '' };
  },
};

const db = {
  families: [
    { name: 'כהן', members: [{ id: 'm1', first: 'אבי' }, { id: 'm2', first: 'גילה' }] },
    { name: 'לוי', members: [{ id: 'm3', first: 'בני' }] },
  ],
  courses: [{ id: 'c1', name: 'ציור' }, { id: 'c2', name: 'שחייה' }],
  enrollments: [
    { id: 'e1', courseId: 'c1', memberId: 'm1', renew: 'yes' },
    { id: 'e2', courseId: 'c1', memberId: 'm2', renew: '' },
    { id: 'e3', courseId: 'c2', memberId: 'm3', renew: 'no', renewedToId: 'x9' },
    { id: 'e4', courseId: 'c2', memberId: 'm404' },
  ],
};

let f = 0;
const eq = (n, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g !== w) { console.error(`✗ דוגמה ${n}: ${g} ≠ ${w}`); f = 1; }
};

// 1 · בלי פילטר — 4 שורות, מיון עברי (member חסר ⇒ '' ראשון)
const all = buildReenrollRows(db, {}, S);
eq('1', all.map((r) => r.memberName), ['', 'אבי', 'בני', 'גילה']);
// 2 · צמצום לחוג c1
eq('2', buildReenrollRows(db, { courseId: 'c1' }, S).map((r) => r.e.id), ['e1', 'e2']);
// 3 · טרם-הוחלט — e4 (בלי renew) + e2
eq('3', buildReenrollRows(db, { decision: 'undecided' }, S).map((r) => r.e.id).sort(), ['e2', 'e4']);
// 4 · בלי מי-שכבר-נרשם — e3 נשמט
eq('4', buildReenrollRows(db, { includeRenewed: false }, S).length, 3);
// 5 · חיפוש רב-מילתי + חיפוש בשם-משפחה
eq('5a', buildReenrollRows(db, { q: 'אבי ציור' }, S).map((r) => r.e.id), ['e1']);
eq('5b', buildReenrollRows(db, { q: 'כהן' }, S).map((r) => r.e.id).sort(), ['e1', 'e2']);
// 6 · צורת-השורה של e1
const r1 = all.find((r) => r.e.id === 'e1');
eq('6', [r1.memberName, r1.familyName, r1.courseName, r1.decision, r1.renewed, r1.summary],
       ['אבי', 'כהן', 'ציור', 'yes', false, { presents: 0 }]);

if (f) process.exit(1);
console.log('✓ build-reenroll-rows: 7 בדיקות מ-6 דוגמאות-חוזה — ירוק');
