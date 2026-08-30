import { termLabel as __pure_termLabel } from './term-label.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_termLabel_TERM_LABEL_T = {
  k1: "months",
  k2: " חודשים",
};
const termLabel = (...a) => __pure_termLabel(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_termLabel_TERM_LABEL_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(a === b, msg + ` ⇒ ${JSON.stringify(a)}`);

const TERMS = [{ v: 'once', t: 'חד-פעמי' }, { v: 'monthly', t: 'חודשי' }, { v: 'year', t: 'שנתי' }];

// 1) תווית מהרשימה
eq(termLabel('monthly', undefined, TERMS), 'חודשי', 'תווית-חודשי שגויה');

// 2) months לא משפיע כש-term אינו 'months'
eq(termLabel('year', 5, TERMS), 'שנתי', 'months השפיע שלא-כדין');

// 3) 'months' עם מספר
eq(termLabel('months', 3, TERMS), '3 חודשים', 'מספר-חודשים שגוי');

// 4) 'months' בלי מספר ⇒ 1
eq(termLabel('months', undefined, TERMS), '1 חודשים', 'חסר לא נפל ל-1');

// 5) 'months' עם אפס ⇒ 1
eq(termLabel('months', 0, TERMS), '1 חודשים', 'אפס לא נפל ל-1');

// 6) term לא-מוכר ⇒ ''
eq(termLabel('daily', undefined, TERMS), '', 'לא-מוכר לא החזיר ריק');

if (f) process.exit(1);
console.log('✓ term-label: 6 דוגמאות-חוזה — ירוק');
