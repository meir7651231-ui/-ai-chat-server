import { mergeSupporterRow } from './merge-supporter-row.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

// שקעים כלשון-החוזה (מקומיים לבדיקה — מייבאת רק את האטום שלה)
let phoneCalls = 0;
const fixPhone = (p) => { phoneCalls++; return p.length === 10 ? p.slice(0, 3) + '-' + p.slice(3) : p; };
let histCalls = 0;
const mergeHist = (existing, incoming) => {
  histCalls++;
  const key = (h) => h.d + '|' + h.a + '|' + (h.c ?? '₪');
  const seen = new Set(existing.map(key));
  return [...existing, ...incoming.filter((h) => !seen.has(key(h)))];
};
const sp0 = (o) => ({
  id: 's1', name: 'דנה', phone: '', email: '', idNum: '', address: '', cat: '',
  forWho: '', donations: [], count: 0, ils: 0, ...o,
});
const row0 = (o) => ({ name: '', phone: '', email: '', idNum: '', address: '', cat: '', forWho: '', ...o });

// דוגמה 1 — לא-ריק דורס (עם גזימה)
{
  const out = mergeSupporterRow(sp0({}), row0({ name: ' דנה לוי ' }), mergeHist, fixPhone);
  chk('1 דריסה-גזומה', out.name === 'דנה לוי');
}
// דוגמה 2 — רווחים = ריק ⇒ הקיים נשמר
{
  const out = mergeSupporterRow(sp0({ email: 'd@x.co' }), row0({ email: '   ' }), mergeHist, fixPhone);
  chk('2 ריק-נשמר', out.email === 'd@x.co');
}
// דוגמה 3 — טלפון דרך השקע; ריק ⇒ השקע לא נקרא
{
  phoneCalls = 0;
  const out = mergeSupporterRow(sp0({}), row0({ phone: ' 0501234567 ' }), mergeHist, fixPhone);
  chk('3 עוצב', out.phone === '050-1234567');
  chk('3 שקע-נקרא', phoneCalls === 1);
  phoneCalls = 0;
  const kept = mergeSupporterRow(sp0({ phone: '050-9998877' }), row0({ phone: '' }), mergeHist, fixPhone);
  chk('3 ריק-נשמר', kept.phone === '050-9998877');
  chk('3 שקע-לא-נקרא', phoneCalls === 0);
}
// דוגמה 4 — hist ממוזג אידמפוטנטית; row בלי hist ⇒ לא נקרא
{
  histCalls = 0;
  const h1 = { d: '2026-01-01', a: 100 };
  const out = mergeSupporterRow(
    sp0({ hist: [h1] }),
    row0({ hist: [{ ...h1 }, { d: '2026-02-01', a: 50 }] }),
    mergeHist, fixPhone,
  );
  chk('4 אורך-2', out.hist.length === 2);
  chk('4 שקע-נקרא', histCalls === 1);
  histCalls = 0;
  const kept = mergeSupporterRow(sp0({ hist: [h1] }), row0({}), mergeHist, fixPhone);
  chk('4 hist-נשמר', kept.hist.length === 1 && kept.hist[0].a === 100);
  chk('4 שקע-לא-נקרא', histCalls === 0);
}
// דוגמה 5 — הכסף לא זז
{
  const sp = sp0({ donations: [{ date: '2026-01-01', amount: 100, cur: '₪' }], count: 1, ils: 100 });
  const out = mergeSupporterRow(sp, row0({ name: 'אחר', cat: 'VIP' }), mergeHist, fixPhone);
  chk('5 donations', out.donations.length === 1 && out.donations[0].amount === 100);
  chk('5 מונים', out.count === 1 && out.ils === 100);
}
if (f) process.exit(1);
console.log('✓ merge-supporter-row: 5 דוגמאות-חוזה — ירוק');
