import { enrollmentQuote } from './enrollment-quote.mjs';
// שקע-לבדיקה: מחזיר תוצאה קבועה ומתעד את הקריאה (הבדיקה מייבאת רק את האטום שלה)
let calls = [];
const wq = (c, opts) => { calls.push([c, opts]); return { lessons: 8, perLesson: 50, total: 400 }; };
let f = 0;
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const chk = (name, cond) => { if (!cond) { console.error(`✗ ${name}`); f = 1; } };

// 1 — לא פר-שיעור ⇒ null, אפס קריאות-שקע
calls = [];
chk('דוגמה 1: null', enrollmentQuote({ perLesson: false, lessonPrice: 50 }, { freq: 2, freqUnit: 'week', term: 'monthly' }, wq) === null);
chk('דוגמה 1: השקע לא נקרא', calls.length === 0);
// 2 — בלי freq ⇒ null
chk('דוגמה 2: null', enrollmentQuote({ perLesson: true }, { freqUnit: 'week', term: 'monthly' }, wq) === null);
// 3 — בלי term ⇒ null
chk('דוגמה 3: null', enrollmentQuote({ perLesson: true }, { freq: 2, freqUnit: 'week' }, wq) === null);
// 4 — מלא ⇒ תוצאת-השקע + נירמול-הארגומנטים
calls = [];
const c4 = { perLesson: true };
const r4 = enrollmentQuote(c4, { freq: 2, freqUnit: 'week', term: 'months', termMonths: 3, tier: '1' }, wq);
chk('דוגמה 4: תוצאה', eq(r4, { lessons: 8, perLesson: 50, total: 400 }));
chk('דוגמה 4: קריאה אחת', calls.length === 1 && calls[0][0] === c4);
chk('דוגמה 4: ארגומנטים', eq(calls[0][1], { freq: 2, unit: 'week', term: 'months', months: 3, tier: '1' }));
// 5 — בלי tier ⇒ tier:'' · בלי termMonths ⇒ months:undefined
calls = [];
enrollmentQuote({ perLesson: true }, { freq: 1, freqUnit: 'month', term: 'year' }, wq);
chk('דוגמה 5: tier ריק', calls[0][1].tier === '' && calls[0][1].months === undefined);
if (f) process.exit(1);
console.log('✓ enrollment-quote: 5 דוגמאות-חוזה — ירוק');
