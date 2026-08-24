import { supDonEvents } from './sup-don-events.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1) תרומה-עם-קבלה: cur חסר ⇒ '₪', src='קבלה R-N', rid נשמר
{
  const r = supDonEvents({ donations: [{ date: '2026-01-05', amount: 100, rid: 'R-3' }] });
  ok(r.length === 1, 'תרומה יחידה ⇒ שורה אחת');
  ok(r[0].date === '2026-01-05' && r[0].amount === 100, 'תאריך וסכום עוברים כמות-שהם');
  ok(r[0].cur === '₪', "cur חסר ⇒ '₪'");
  ok(r[0].src === 'קבלה R-3' && r[0].rid === 'R-3', "src='קבלה R-3' + rid");
}
// 2) hist עם clearer ⇒ "תרומה" + מטא-דאטת-סליקה מופרדת ' · '
{
  const r = supDonEvents({ hist: [{ d: '2026-02-01', a: 250, c: '$', clearer: 'נדרים', last4: '1234', pays: 3 }] });
  ok(r.length === 1, 'שורת-hist אחת');
  ok(r[0].amount === 250 && r[0].cur === '$', 'סכום 250 ומטבע $');
  ok(r[0].src === 'תרומה · •1234 · נדרים · 3 תשלומים', 'clearer ⇒ תרומה + מטא בסדר-המקור: ' + r[0].src);
}
// 3) hist בלי clearer ובלי מטא ⇒ 'מהקובץ ההיסטורי', cur ברירת-מחדל ₪, בלי rid
{
  const r = supDonEvents({ hist: [{ d: '2026-03-01', a: 80 }] });
  ok(r[0].src === 'מהקובץ ההיסטורי', 'בלי clearer ⇒ מהקובץ ההיסטורי');
  ok(r[0].cur === '₪' && r[0].rid === undefined, "c חסר ⇒ '₪'; אין rid");
}
// 4) אפס donations/hist + first/last ⇒ 2 שורות-אפס ממוינות מהחדש לישן
{
  const r = supDonEvents({ first: '2025-01-01', last: '2025-06-01' });
  ok(r.length === 2, 'first+last ⇒ 2 שורות');
  ok(r[0].date === '2025-06-01' && r[0].src === 'תרומה אחרונה (מהקובץ)', 'האחרונה ראשונה (מיון desc)');
  ok(r[1].date === '2025-01-01' && r[1].src === 'תרומה ראשונה (מהקובץ)', 'הראשונה שנייה');
  ok(r[0].amount === 0 && r[0].cur === '' && r[1].amount === 0 && r[1].cur === '', 'סכום 0 ומטבע ריק');
}
// 5) first שתאריכו כבר מכוסה בתרומה ⇒ אין כפל-שורה
{
  const r = supDonEvents({ donations: [{ date: '2025-01-01', amount: 10, rid: 'R-1' }], first: '2025-01-01' });
  ok(r.length === 1 && r[0].src === 'קבלה R-1', 'תאריך-first שנראה כבר לא מוסיף שורה');
}
// 6) יש hist ⇒ שורות first/last לא נוצרות כלל
{
  const r = supDonEvents({ hist: [{ d: '2026-02-01', a: 5 }], first: '2020-01-01' });
  ok(r.length === 1 && r[0].src === 'מהקובץ ההיסטורי', 'hist קיים ⇒ בלי שורות מהקובץ-first/last');
}
// 7) שקע-מונחים מוזרק + pays:1 לא מציג "תשלומים"
{
  const term = (k, fb) => (k === 'entity.donation' ? 'נדבה' : fb);
  const r = supDonEvents({ hist: [{ d: '2026-02-01', a: 250, clearer: 'נדרים', pays: 1 }] }, term);
  ok(r[0].src === 'נדבה · נדרים', 'שקע-המונחים מחליף את התווית; pays=1 מושמט: ' + r[0].src);
}
if (f) process.exit(1);
console.log('✓ sup-don-events: 7 דוגמאות-חוזה — ירוק (termOf=שקע; מיון desc)');
