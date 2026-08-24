import { weightedQuote } from './weighted-quote.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// 1) העברת-ארגומנטים מדויקת לשני השקעים
const c = { id: 'course1', lessonPrice: 80 };
const priceCalls = [];
const termCalls = [];
weightedQuote(
  c,
  { freq: 1, unit: 'week', term: 'monthly', months: 3, tier: '2' },
  (...a) => { priceCalls.push(a); return 80; },
  (...a) => { termCalls.push(a); return 1; },
);
chk('1 ארגומנטים לשקעים',
  priceCalls.length === 1 && priceCalls[0][0] === c && priceCalls[0][1] === '2' &&
  termCalls.length === 1 && eq(termCalls[0], [1, 'week', 'monthly', 3]));

// 2) raw=13/3, perLesson=80 ⇒ lessons=4.5 · total=347
chk('2 שבועי-לחודש 80₪ ⇒ 4.5 שיעורים · 347₪',
  eq(weightedQuote(c, { tier: '' }, () => 80, () => 13 / 3), { lessons: 4.5, perLesson: 80, total: 347 }));

// 3) raw=1, perLesson=100 ⇒ 1 · 100
chk('3 חד-פעמי ⇒ {1,100,100}',
  eq(weightedQuote(c, { tier: '' }, () => 100, () => 1), { lessons: 1, perLesson: 100, total: 100 }));

// 4) raw=26/3, perLesson=45 ⇒ lessons=8.5 · total=390 (עיגול על ה-raw)
chk('4 פעמיים-בשבוע 45₪ ⇒ 8.5 · 390',
  eq(weightedQuote(c, { tier: '1' }, () => 45, () => 26 / 3), { lessons: 8.5, perLesson: 45, total: 390 }));

// 5) raw=0 ⇒ אפס שיעורים, אפס סכום
chk('5 תדירות-אפס ⇒ {0,200,0}',
  eq(weightedQuote(c, { tier: '' }, () => 200, () => 0), { lessons: 0, perLesson: 200, total: 0 }));

if (f) process.exit(1);
console.log('✓ weighted-quote: 5 דוגמאות-חוזה (ארגומנטים+עיגול-חצי/שקל+אפס) — ירוק');
