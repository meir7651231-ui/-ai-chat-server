import { holidayNames as __pure_holidayNames } from './holiday-names.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_holiday_names_T = {
  k1: 400,
};
const holidayNames = (...a) => __pure_holidayNames(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_holiday_names_T);
let f = 0;
const chk = (name, got, want) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) { console.error(`✗ ${name} ⇒ ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1; }
};
// 1. אין חגים
chk('1 ריק', holidayNames(() => null), []);
// 2. דדופ — אותו שם 400 פעם ⇒ פעם אחת
chk('2 דדופ', holidayNames(() => 'חנוכה'), ['חנוכה']);
// 3. בדיוק 400 קריאות
let calls = 0;
holidayNames(() => { calls++; return null; });
chk('3 ‏400-קריאות', calls, 400);
// 4. סדר-הופעה, העוגן הוא 2026-01-01
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
chk('4 סדר-הופעה', holidayNames((d) => (iso(d) === '2026-01-01' ? 'א' : iso(d) === '2026-03-03' ? 'ב' : null)), ['א', 'ב']);
// 5. ‏12 חודשים בסדר ינו→דצמ (400 יום מכסים את כל 2026)
const M = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'];
chk('5 ‏12-חודשים', holidayNames((d) => M[d.getMonth()]), M);
if (f) process.exit(1);
console.log('✓ holiday-names: 5 דוגמאות-חוזה — ירוק');
