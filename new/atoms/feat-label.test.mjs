import { featLabel } from './feat-label.mjs';
let f = 0;
const eq = (a, b, msg) => { if (a !== b) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };

// 1) מונח-ארגון גובר
eq(featLabel({}, () => 'פרויקטים'), 'פרויקטים', 'מונח-הארגון לא גבר');

// 2) נפילה לברירת-המחדל
const termOf = (c, k, fb) => c.terms?.[k] ?? fb;
eq(featLabel({}, termOf), 'מעקב טיפול', 'ברירת-המחדל שגויה');

// 3) השקע נקרא פעם אחת עם (cfg, 'nav.ayin', 'מעקב טיפול')
const cfg = { tag: 'cfg' };
let calls = 0, got = null;
featLabel(cfg, (...args) => { calls++; got = args; return 'x'; });
if (calls !== 1 || got[0] !== cfg || got[1] !== 'nav.ayin' || got[2] !== 'מעקב טיפול') {
  console.error(`✗ קריאת-השקע שגויה ⇒ ${JSON.stringify(got)}`); f = 1;
}

if (f) process.exit(1);
console.log('✓ feat-label: 3 דוגמאות-חוזה — ירוק');
