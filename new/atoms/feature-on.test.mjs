import { featureOn } from './feature-on.mjs';
let f = 0;
const eq = (a, b, msg) => { if (a !== b) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };
const NAV = ['families', 'courses'];
const on = () => true;

// 1) מפתח חסר = פעיל
eq(featureOn({ features: {} }, 'families.x', NAV, on), true, 'מפתח חסר לא פעיל');

// 2) הדגל עצמו כבוי
eq(featureOn({ features: { 'families.x': false } }, 'families.x', NAV, on), false, 'דגל כבוי לא כיבה');

// 3) שרשור-אבות: שורש כבוי + אב-ביניים כבוי
eq(featureOn({ features: { families: false } }, 'families.x.y', NAV, on), false, 'אב-שורש כבוי לא שורשר');
eq(featureOn({ features: { 'a.b': false } }, 'a.b.c', NAV, on), false, 'אב-ביניים כבוי לא שורשר');

// 4) מודול-ניווט כבוי מכבה הכול
eq(featureOn({ features: {} }, 'families.x', NAV, () => false), false, 'מודול כבוי לא כיבה');

// 5) קידומת שאינה מודול-ניווט — moduleOn לא נשאל
let asked = 0;
eq(featureOn({ features: {} }, 'core.export', NAV, () => { asked++; return false; }), true, 'core כובה בטעות');
eq(asked, 0, 'moduleOn נשאל על קידומת שאינה מודול');

// 6) cfg בלי features בכלל — סלחני
eq(featureOn({}, 'families.x', NAV, on), true, 'cfg ריק קרס/שגוי');

// 7) true מפורש אינו שונה מחסר
eq(featureOn({ features: { 'families.x': true } }, 'families.x.y', NAV, on), true, 'true מפורש כיבה בטעות');

if (f) process.exit(1);
console.log('✓ feature-on: 7 דוגמאות-חוזה — ירוק');
