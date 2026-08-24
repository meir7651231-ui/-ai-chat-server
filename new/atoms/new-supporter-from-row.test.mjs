import { newSupporterFromRow } from './new-supporter-from-row.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקעי-בדיקה: fixPhone מוסיף '0' בראש (מדגים חיתוך-ואז-שקע); mergeHist=שרשור
const fixPhone = (s) => (s ? '0' + s : s);
const mergeHist = (a, b) => [...a, ...b];
const row = (over = {}) => ({
  name: ' דוד לוי ', phone: ' 501234567 ', email: 'a@b.c', idNum: '12345',
  address: 'חיפה', cat: 'ידיד', forWho: 'ישיבה', ...over,
});
// 1) שורה בסיסית — חיתוך, שקע-טלפון, איפוסים, בלי hist
{
  const out = newSupporterFromRow('s1', row(), fixPhone, mergeHist);
  ok(out.id === 's1' && out.name === 'דוד לוי' && out.phone === '0501234567'
    && out.email === 'a@b.c' && out.idNum === '12345' && out.address === 'חיפה'
    && out.cat === 'ידיד' && out.forWho === 'ישיבה', 'דוגמה 1: שדות — ' + JSON.stringify(out));
  ok(out.notes === '' && out.count === 0 && out.ils === 0 && out.usd === 0
    && out.first === '' && out.last === '' && out.nextDate === ''
    && Array.isArray(out.donations) && out.donations.length === 0, 'דוגמה 1: איפוסים');
  ok(!('hist' in out), 'דוגמה 1: מפתח hist קיים בלי row.hist');
}
// 2) hist קיים ⇒ דרך mergeHist על בסיס ריק
{
  const h = [{ d: '2026-01-01', ils: 100 }];
  const out = newSupporterFromRow('s2', row({ hist: h }), fixPhone, mergeHist);
  ok(JSON.stringify(out.hist) === JSON.stringify([{ d: '2026-01-01', ils: 100 }]),
    'דוגמה 2: hist — ' + JSON.stringify(out.hist));
}
// 3) hist ריק ⇒ אין מפתח כלל (ריק ≠ קיים)
{
  const out = newSupporterFromRow('s3', row({ hist: [] }), fixPhone, mergeHist);
  ok(!('hist' in out), 'דוגמה 3: hist=[] יצר מפתח');
}
// 4) רווחים-בלבד ⇒ מחרוזות ריקות; המונים מאופסים
{
  const out = newSupporterFromRow('s4',
    row({ name: '  ', phone: '  ', email: ' ', idNum: ' ', address: ' ', cat: ' ', forWho: ' ' }),
    fixPhone, mergeHist);
  ok(out.name === '' && out.phone === fixPhone('') && out.email === '' && out.idNum === ''
    && out.address === '' && out.cat === '' && out.forWho === '' && out.count === 0,
    'דוגמה 4: רווחים-בלבד — ' + JSON.stringify(out));
}
if (f) process.exit(1);
console.log('✓ new-supporter-from-row: 4 דוגמאות-חוזה — ירוק');
