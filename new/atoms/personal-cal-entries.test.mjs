import { personalCalEntries } from './personal-cal-entries.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const donEvents = () => [{ date: '2026-08-01', amount: 180, cur: '₪', src: 'קבלה D-7', rid: 'D-7' }];
const sp = {
  nextDate: '2026-09-01',
  ayin: {
    log: [{ date: '2026-08-10', eyes: 4, name: 'משה' }, { date: '2026-08-09', eyes: 2 }],
    answers: [{ date: '2026-08-12', note: 'התקבלה' }],
    nextTalk: '2026-08-20',
  },
};
const r = personalCalEntries(sp, donEvents);
ok(r.length === 6, 'אורך=6, בפועל ' + r.length);
ok(JSON.stringify(r[0]) === JSON.stringify({ date: '2026-08-01', amount: 180, cur: '₪', src: 'קבלה D-7' }), '[0] הקרנה בלי rid: ' + JSON.stringify(r[0]));
ok(r[1].src === '🎯 תאריך יעד לקשר הבא' && r[1].date === '2026-09-01' && r[1].amount === 0 && r[1].cur === '', '[1] תאריך-יעד: ' + JSON.stringify(r[1]));
ok(r[2].src === '🧿 4 — משה', "[2]='🧿 4 — משה', בפועל " + r[2].src);
ok(r[3].src === '🧿 2', "[3]='🧿 2' (log בלי name), בפועל " + r[3].src);
ok(r[4].src === '📞 תשובה: התקבלה' && r[4].date === '2026-08-12', '[4] תשובה: ' + JSON.stringify(r[4]));
ok(JSON.stringify(r[5]) === JSON.stringify({ date: '2026-08-20', amount: 0, cur: '', src: '🔁 לדבר שוב' }), '[5] לדבר-שוב: ' + JSON.stringify(r[5]));
// בלי ayin/nextDate והשקע ריק ⇒ []:
ok(personalCalEntries({}, () => []).length === 0, 'תומך ריק ⇒ []');
// רשומת-log עם date='' מסוננת:
const r2 = personalCalEntries({ ayin: { log: [{ date: '', eyes: 7 }], answers: [] } }, () => []);
ok(r2.length === 0, "log עם date='' ⇒ מסונן");
if (f) process.exit(1);
console.log('✓ personal-cal-entries: 9 דוגמאות-חוזה — ירוק');
