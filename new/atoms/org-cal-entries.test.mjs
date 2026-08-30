import { orgCalEntries as __pure_orgCalEntries } from './org-cal-entries.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_orgCalEntries_ORG_CAL_ENTRIES_T = {
  k1: "📞 תשובה: ",
  k2: "🔁 לדבר שוב",
};
const orgCalEntries = (...a) => __pure_orgCalEntries(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_orgCalEntries_ORG_CAL_ENTRIES_T);

// מימוש-שקע לבדיקה: אירוע-תרומה אחד ל-s1 בלבד, [] לכל השאר.
const supDonEvents = (sp) => (sp.id === 's1' ? [{ date: '2026-01-05', amount: 100, cur: '₪', src: 'תרומה' }] : []);

let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// תומכת עם אירוע-תרומה בלבד — name+spId מוצמדים
const sp1 = { id: 's1', name: 'רות' };
const r1 = orgCalEntries([sp1], supDonEvents);
ok(JSON.stringify(r1) === JSON.stringify([{ date: '2026-01-05', amount: 100, cur: '₪', src: 'תרומה', name: 'רות', spId: 's1' }]),
  'אירוע-תרומה עם name+spId: ' + JSON.stringify(r1));

// תומכת עם ayin מלא — 3 שורות בסדר: 🧿, 📞, 🔁
const sp2 = {
  id: 's2', name: 'דנה',
  ayin: { log: [{ date: '2026-02-01', eyes: 'ה.כ', name: 'רות' }], answers: [{ date: '2026-03-01', note: 'יחזור' }], nextTalk: '2026-04-01' },
};
const r2 = orgCalEntries([sp2], supDonEvents);
ok(r2.length === 3, '3 שורות ayin: ' + r2.length);
ok(r2[0].src === '🧿 ה.כ — רות' && r2[0].date === '2026-02-01', 'שורת 🧿 עם name: ' + JSON.stringify(r2[0]));
ok(r2[1].src === '📞 תשובה: יחזור' && r2[1].date === '2026-03-01', 'שורת 📞: ' + JSON.stringify(r2[1]));
ok(r2[2].src === '🔁 לדבר שוב' && r2[2].date === '2026-04-01', 'שורת 🔁: ' + JSON.stringify(r2[2]));
ok(r2.every((e) => e.amount === 0 && e.cur === '' && e.name === 'דנה' && e.spId === 's2'),
  'אירועי-לא-תרומה: amount=0, cur=ריק, name+spId: ' + JSON.stringify(r2));

// רישום-עיניים בלי name — בלי מקף
const sp3 = { id: 's3', name: 'לאה', ayin: { log: [{ date: '2026-02-02', eyes: 'ב.ל' }] } };
const r3 = orgCalEntries([sp3], supDonEvents);
ok(r3.length === 1 && r3[0].src === '🧿 ב.ל', 'רישום בלי name ⇒ בלי מקף: ' + JSON.stringify(r3));

// רישום עם date ריק — מסונן
const sp4 = { id: 's4', name: 'שרה', ayin: { log: [{ date: '', eyes: 'ג.ד' }] } };
ok(orgCalEntries([sp4], supDonEvents).length === 0, "date:'' מסונן");

// ריקים
ok(orgCalEntries([], supDonEvents).length === 0, 'supporters=[] ⇒ []');
ok(orgCalEntries([{ id: 's5', name: 'חנה' }], supDonEvents).length === 0, 'בלי ayin ובלי תרומות ⇒ אפס שורות');

if (f) process.exit(1);
console.log('✓ org-cal-entries: 10 דוגמאות-חוזה — ירוק');
