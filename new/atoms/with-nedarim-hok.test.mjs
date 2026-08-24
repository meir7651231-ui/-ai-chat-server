import { withNedarimHok } from './with-nedarim-hok.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// שקעים מזויפים לפי החוזה
const curOf = (ch) => (ch.currency === '$' ? '$' : '₪');
const hokDayFromDate = (iso) => Number(iso.slice(8, 10)) || 1;

// 1) amount≤0 ⇒ אותה הפניה
const sp0 = { id: 's0' };
chk('1 זיכוי/ביטול ⇒ sp כלשונו',
  withNedarimHok(sp0, { amount: 0, kevaId: 'K1' }, curOf, hokDayFromDate) === sp0 &&
  withNedarimHok(sp0, { amount: -50, kevaId: 'K1' }, curOf, hokDayFromDate) === sp0);

// 2) בלי kevaId (גם רווחים) ⇒ אותה הפניה
chk('2 בלי kevaId ⇒ sp כלשונו',
  withNedarimHok(sp0, { amount: 180 }, curOf, hokDayFromDate) === sp0 &&
  withNedarimHok(sp0, { amount: 180, kevaId: '  ' }, curOf, hokDayFromDate) === sp0);

// 3) הו"ק ידני (בלי kevaId) — לא נדרס
const spManual = { id: 's1', hok: { amount: 100, active: true } };
chk('3 הו"ק ידני לא נדרס',
  withNedarimHok(spManual, { amount: 180, kevaId: 'K7', d: '2026-08-15' }, curOf, hokDayFromDate) === spManual);

// 4) מילוי מלא + טוהר (sp המקורי לא השתנה)
const sp1 = { id: 's1', name: 'לוי' };
const out4 = withNedarimHok(sp1, { amount: 180, kevaId: 'K7', d: '2026-08-15' }, curOf, hokDayFromDate);
chk('4 מילוי מלא',
  out4.id === 's1' && out4.name === 'לוי' &&
  eq(out4.hok, {
    amount: 180, cur: '₪', day: 15, method: 'card',
    note: 'הו״ק נדרים · K7', active: true, startedAt: '2026-08-15', kevaId: 'K7',
  }) && sp1.hok === undefined);

// 5) startedAt מוקדם נשמר; הסכום מתעדכן
const sp5 = { id: 's5', hok: { kevaId: 'K7', amount: 100, startedAt: '2026-05-01' } };
const out5 = withNedarimHok(sp5, { amount: 220, kevaId: 'K7', d: '2026-08-15' }, curOf, hokDayFromDate);
chk('5 שימור-התחלה מוקדמת', out5.hok.startedAt === '2026-05-01' && out5.hok.amount === 220);

// 6) prevStart מאוחר מהעסקה ⇒ תאריך-העסקה מנצח
const sp6 = { id: 's6', hok: { kevaId: 'K7', amount: 100, startedAt: '2026-09-01' } };
const out6 = withNedarimHok(sp6, { amount: 220, kevaId: 'K7', d: '2026-08-15' }, curOf, hokDayFromDate);
chk('6 העסקה המוקדמת מנצחת', out6.hok.startedAt === '2026-08-15');

// 7) בלי d — נופל ל-at (10 תווים ראשונים)
const out7 = withNedarimHok({ id: 's7' }, { amount: 50, kevaId: 'K9', at: '2026-08-20T10:30:00' }, curOf, hokDayFromDate);
chk('7 נפילה ל-at', out7.hok.startedAt === '2026-08-20' && out7.hok.day === 20);

if (f) process.exit(1);
console.log('✓ with-nedarim-hok: 7 דוגמאות-חוזה (שערי-אי-נגיעה+מילוי+שימור-התחלה) — ירוק');
