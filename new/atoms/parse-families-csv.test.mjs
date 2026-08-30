import { deepStrictEqual, strictEqual } from 'node:assert';
import { parseFamiliesCsv as __pure_parseFamiliesCsv } from './parse-families-csv.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_parseFamiliesCsv_PARSE_FAMILIES_CSV_T = {
  k1: "שם פרטי שם משפחה",
  k2: "#NAME?",
  k3: "רגיל",
  k4: "ביתר",
  k5: "ביתר עלית",
  k6: "ביתר עילית",
  k7: "לא פעיל",
  k8: "inactive",
  k9: "active",
  k10: "אלמנ",
  k11: "אלמן",
  k12: "אלמן/ה",
  k13: "גרוש",
  k14: "גרושים",
  k15: "נשואים",
  k16: "עברית",
  k17: "חסידי",
  k18: "השתתפה ביריד חנוכה תשפ\"ו",
  k19: 12,
  k20: 10,
};
const parseFamiliesCsv = (...a) => __pure_parseFamiliesCsv(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_parseFamiliesCsv_PARSE_FAMILIES_CSV_T);

// מימושי-שקע לבדיקה — בדיוק הגדרות-המקור (familiesImport.ts).
const clean = (x) => (x ?? '').replace(/\s+/g, ' ').trim();
const normName = (s) => String(s).toLowerCase().replace(/\s/g, '');
const digits = (x) => (x || '').replace(/\D/g, '');

const HDR = ['שם', 'ת"ז אב', 'טלפון', 'שם האם', 'ת"ז אם', 'טלפון2', 'עיר', 'כתובת', 'מס', 'רמז', 'קהילה', '', 'הערות'];
const run = (dataRows, existing = []) => parseFamiliesCsv([HDR, ...dataRows], existing, clean, normName, digits);

// 1. שורה מלאה — כל הניקויים
const r1 = ['כהן ישראל', '123', '052-111', 'לאה', '456', '-', 'ביתר', "רח' הרצל", '5', '', 'גור', '', ''];
deepStrictEqual(run([r1]), {
  news: [{
    name: 'כהן ישראל', father: '', mother: 'לאה', fatherId: '123', motherId: '456',
    phone: '052-111', phone2: '', email: '', address: "רח' הרצל 5", city: 'ביתר עילית',
    status: 'active', maritalStatus: 'נשואים', language: 'עברית', community: 'גור', notes: '',
  }],
  upds: [],
});

// 2. יריד חנוכה — הסרה מהשם + notes קבוע
const g2 = run([['לוי שרה - יריד חנוכה תשפ"ו', '', '', '', '', '', '', '', '', '', '', '', '']]);
strictEqual(g2.news[0].name, 'לוי שרה');
strictEqual(g2.news[0].notes, 'השתתפה ביריד חנוכה תשפ"ו');

// 3. סטטוס מההערות ⇒ inactive, מצב-משפחתי ברירת-מחדל
const g3 = run([['כהן', '', '', '', '', '', '', '', '', '', '', '', 'סטטוס: לא פעיל']]);
strictEqual(g3.news[0].status, 'inactive');
strictEqual(g3.news[0].maritalStatus, 'נשואים');

// 4. 'גרוש' מההערות ⇒ גרושים; עמודה-9 'אלמן' גוברת ⇒ אלמן/ה
const g4a = run([['כהן', '', '', '', '', '', '', '', '', '', '', '', 'סטטוס: גרושה']]);
strictEqual(g4a.news[0].maritalStatus, 'גרושים');
const g4b = run([['כהן', '', '', '', '', '', '', '', '', 'אלמן', '', '', 'סטטוס: גרושה']]);
strictEqual(g4b.news[0].maritalStatus, 'אלמן/ה');

// 5. עיר 'רגיל' ⇒ ריקה · קהילה ריקה ⇒ 'חסידי'
const g5 = run([['כהן', '', '', '', '', '', 'רגיל', '', '', '', '', '', '']]);
strictEqual(g5.news[0].city, '');
strictEqual(g5.news[0].community, 'חסידי');

// 6. שורות מדולגות: כותרת-משנה + '#NAME?' שמתרוקן
const g6 = run([
  ['שם פרטי שם משפחה', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['#NAME?', '', '', '', '', '', '', '', '', '', '', '', ''],
]);
deepStrictEqual(g6, { news: [], upds: [] });

// 7. התאמה-לקיימת: digits שווים ⇒ upds · שונים ⇒ news · צד ריק ⇒ upds
const row7 = ['כהן ישראל', '', '052-111', '', '', '', '', '', '', '', '', '', ''];
const g7a = run([row7], [{ id: 'f1', name: 'כהן  ישראל', phone: '052 111' }]);
strictEqual(g7a.upds.length, 1);
strictEqual(g7a.upds[0].id, 'f1');
strictEqual(g7a.news.length, 0);
const g7b = run([row7], [{ id: 'f1', name: 'כהן ישראל', phone: '053-999' }]);
strictEqual(g7b.upds.length, 0);
strictEqual(g7b.news.length, 1);
const g7c = run([row7], [{ id: 'f1', name: 'כהן ישראל', phone: '' }]);
strictEqual(g7c.upds.length, 1);

console.log('✓ parse-families-csv: 7 דוגמאות-חוזה (שקעים clean/normName/digits) — ירוק');
