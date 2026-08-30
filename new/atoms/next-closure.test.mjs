import { nextClosure as __pure_nextClosure } from './next-closure.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_nextClosure_NEXT_CLOSURE_T = {
  k1: "default",
  k2: "Asia/Jerusalem",
};
const nextClosure = (...a) => __pure_nextClosure(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_nextClosure_NEXT_CLOSURE_T);
// שקעי-דמה מקומיים לבדיקה — הבדיקה מייבאת רק את האטום שלה (חוק-4).
const CITIES = {
  jerusalem: { he: 'ירושלים', lat: 31.778, lon: 35.235, candle: 40 },
  telaviv: { he: 'תל אביב', lat: 32.083, lon: 34.8, candle: 18 },
};
const WIN = { reason: 'שבת', kind: 'shabbat', startIso: '2026-08-28', startTime: '18:42', endIso: '2026-08-29', endTime: '19:53', days: 1 };
let f = 0;
const eq = (name, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g !== w) { console.error(`✗ ${name}: ${g} ≠ ${w}`); f = 1; }
};

// 1. בלי telephony ⇒ null והשקע לא נקרא
let called = 0;
eq('דוגמה 1 (בלי telephony)', nextClosure({}, '2026-08-24', () => { called++; return [WIN]; }, CITIES), null);
if (called !== 0) { console.error('✗ דוגמה 1: השקע נקרא למרות שאין telephony'); f = 1; }

// 2+6. עיר מוכרת + מיפוי-שדות + אימות ארגומנטים-לשקע
let gotArgs = null;
const hcw2 = (...args) => { gotArgs = args; return [WIN]; };
eq('דוגמה 2 (תל אביב)', nextClosure({ telephony: { city: 'telaviv' } }, '2026-08-24', hcw2, CITIES),
  { reason: 'שבת', kind: 'shabbat', startIso: '2026-08-28', candle: '18:42', endIso: '2026-08-29', tzeis: '19:53', cityHe: 'תל אביב' });
eq('דוגמה 6 (ארגומנטים-לשקע)', gotArgs, ['2026-08-24', 10, { city: 'telaviv', timezone: 'Asia/Jerusalem' }, {}]);

// 3. אין חלונות ⇒ null
eq('דוגמה 3 (אין חלון)', nextClosure({ telephony: { city: 'telaviv' } }, '2026-08-24', () => [], CITIES), null);

// 4. בלי city ⇒ tenant.city='default' + נפילת-ירושלים
let gotArgs4 = null;
const r4 = nextClosure({ telephony: {} }, '2026-08-24', (...a) => { gotArgs4 = a; return [WIN]; }, CITIES);
eq('דוגמה 4 (tenant default)', gotArgs4[2], { city: 'default', timezone: 'Asia/Jerusalem' });
eq('דוגמה 4 (cityHe ירושלים)', r4.cityHe, 'ירושלים');

// 5. עיר לא-מוכרת ⇒ tenant שומר אותה, cityHe נופל לירושלים
let gotArgs5 = null;
const r5 = nextClosure({ telephony: { city: 'nowhere' } }, '2026-08-24', (...a) => { gotArgs5 = a; return [WIN]; }, CITIES);
eq('דוגמה 5 (tenant nowhere)', gotArgs5[2].city, 'nowhere');
eq('דוגמה 5 (cityHe ירושלים)', r5.cityHe, 'ירושלים');

if (f) process.exit(1);
console.log('✓ next-closure: 6 דוגמאות-חוזה — ירוק');
