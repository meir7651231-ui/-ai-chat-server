import { sameLoc } from './same-loc.mjs';
const loc = (view, selFamilyId, selCourseId, extra = {}) => ({ view, selFamilyId, selCourseId, ...extra });
const C = [
  ['1 עותק-זהה ⇒ true', loc('families', 'f1', null), loc('families', 'f1', null), true],
  ['2 view שונה ⇒ false', loc('families', 'f1', null), loc('courses', 'f1', null), false],
  ['3א selFamilyId שונה ⇒ false', loc('families', 'f1', null), loc('families', 'f2', null), false],
  ['3ב null מול f1 ⇒ false', loc('families', null, null), loc('families', 'f1', null), false],
  ['4 selCourseId שונה ⇒ false', loc('courses', null, null), loc('courses', null, 'c1'), false],
  ['5 שדות-נוספים לא משפיעים ⇒ true', loc('home', null, null, { scroll: 99 }), loc('home', null, null, { scroll: 0 }), true],
];
let f = 0;
for (const [name, a, b, want] of C) {
  if (sameLoc(a, b) !== want) { console.error('✗ ' + name); f = 1; }
}
if (f) process.exit(1);
console.log('✓ same-loc: 5 דוגמאות-חוזה (6 בדיקות) — ירוק');
