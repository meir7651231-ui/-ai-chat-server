import { mergeSupporterInto } from './merge-supporter-into.mjs';
// שקע-mergeHist בסמנטיקת-maor המתועדת בחוזה (מקומי לבדיקה — מייבאת רק את האטום שלה):
// מפתח d|a|c, אידמפוטנטי — רשומה נכנסת שכבר קיימת לא מוכפלת.
const mergeHist = (existing, incoming) => {
  const key = (h) => h.d + '|' + h.a + '|' + (h.c ?? '₪');
  const seen = new Set(existing.map(key));
  return [...existing, ...incoming.filter((h) => !seen.has(key(h)))];
};
const PHOTO_MAX = 5; // ערך-ההצבה של maor (photoGallery.ts:8)
const sup = (o) => ({
  id: 'x', name: '', phone: '', email: '', address: '', city: '', idNum: '',
  cat: '', forWho: '', notes: '', donations: [], count: 0, ils: 0, usd: 0,
  first: '', last: '', ...o,
});
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

// דוגמה 1 — כסף: צבירה מחושבת-מחדש, מיון-תאריך
{
  const keep = sup({ id: 'a', name: 'ראובן', donations: [{ date: '2026-01-01', amount: 100, cur: '₪' }], count: 1, ils: 100, first: '2026-01-01', last: '2026-01-01' });
  const drop = sup({ id: 'b', donations: [{ date: '2025-12-01', amount: 50, cur: '$' }], count: 1, usd: 50 });
  const out = mergeSupporterInto(keep, drop, mergeHist, PHOTO_MAX);
  chk('1 מיון-תאריך', out.donations[0].date === '2025-12-01' && out.donations[1].date === '2026-01-01');
  chk('1 צבירה', out.count === 2 && out.ils === 100 && out.usd === 50);
  chk('1 first/last', out.first === '2025-12-01' && out.last === '2026-01-01');
  chk('1 לא-משנה-קלט', keep.donations.length === 1 && keep.ils === 100);
}
// דוגמה 2 — שדות-קשר: השומר גובר, ריק ⇒ של הנמחק
{
  const out = mergeSupporterInto(
    sup({ phone: '', city: 'ירושלים' }),
    sup({ phone: '050-1112222', city: 'חיפה' }),
    mergeHist, PHOTO_MAX,
  );
  chk('2 טלפון-מהנמחק', out.phone === '050-1112222');
  chk('2 עיר-השומר', out.city === 'ירושלים');
}
// דוגמה 3 — הערות מובחנות
{
  const same = mergeSupporterInto(sup({ notes: 'ותיק' }), sup({ notes: 'ותיק' }), mergeHist, PHOTO_MAX);
  chk('3 בלי-כפל', same.notes === 'ותיק');
  const two = mergeSupporterInto(sup({ notes: 'ותיק' }), sup({ notes: 'מהייבוא' }), mergeHist, PHOTO_MAX);
  chk('3 איחוד', two.notes === 'ותיק · מהייבוא');
}
// דוגמה 4 — hist דרך השקע האידמפוטנטי; ריק ⇒ אין מפתח
{
  const h = { d: '2026-01-01', a: 200 };
  const out = mergeSupporterInto(sup({ hist: [h] }), sup({ hist: [{ ...h }] }), mergeHist, PHOTO_MAX);
  chk('4 hist-ממוזג-פעם-אחת', out.hist.length === 1);
  const none = mergeSupporterInto(sup({}), sup({}), mergeHist, PHOTO_MAX);
  chk('4 hist-ריק-לא-נכתב', !('hist' in none));
}
// דוגמה 5 — photos: איחוד ייחודי, השומר קודם, תקרה
{
  const out = mergeSupporterInto(
    sup({ photos: ['p1', 'p2'] }),
    sup({ photos: ['p2', 'p3', 'p4', 'p5', 'p6'] }),
    mergeHist, PHOTO_MAX,
  );
  chk('5 תקרה', eq(out.photos, ['p1', 'p2', 'p3', 'p4', 'p5']));
  const none = mergeSupporterInto(sup({}), sup({}), mergeHist, PHOTO_MAX);
  chk('5 photos-ריק-לא-נכתב', !('photos' in none));
}
// דוגמה 6 — nextNote מהנמחק כשריק; nextEventId של השומר בלבד
{
  const out = mergeSupporterInto(
    sup({ nextNote: '' }),
    sup({ nextNote: 'להתקשר', nextEventId: 'ev9' }),
    mergeHist, PHOTO_MAX,
  );
  chk('6 nextNote', out.nextNote === 'להתקשר');
  chk('6 nextEventId-לא-עובר', out.nextEventId === undefined);
}
// דוגמה 7 — hok מהנמחק; אפס-תרומות ⇒ צבירת-אפס ו-first/last ריקים
{
  const out = mergeSupporterInto(sup({ first: '' }), sup({ hok: { amount: 180, day: 1 } }), mergeHist, PHOTO_MAX);
  chk('7 hok', out.hok && out.hok.amount === 180 && out.hok.day === 1);
  chk('7 אפס-תרומות', out.count === 0 && out.ils === 0 && out.usd === 0 && out.first === '' && out.last === '');
}
if (f) process.exit(1);
console.log('✓ merge-supporter-into: 7 דוגמאות-חוזה — ירוק');
