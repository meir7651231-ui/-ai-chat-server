import { planAddName } from './plan-add-name.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const normName = (s) => s.replace(/\s/g, '');
const isoToday = () => '2026-08-24';
const mkA = () => ({
  names: [{ id: 'n1', name: 'משה לוי', eyes: 3, done: false }],
  log: [{ date: '2026-08-01', eyes: 3, name: 'משה לוי' }],
});
// שם ריק:
const r1 = planAddName(mkA(), '  ', '', 'n2', normName, isoToday);
ok(JSON.stringify(r1) === JSON.stringify({ ok: false, error: 'הקלידו שם לפני ההוספה' }), 'שם ריק: ' + JSON.stringify(r1));
// dedup מנורמל (רווחים שונים — אותו מפתח):
const r2 = planAddName(mkA(), 'משה  לוי', '', 'n2', normName, isoToday);
ok(r2.ok === false && r2.error === 'השם "משה  לוי" כבר ברשימה', 'dedup: ' + JSON.stringify(r2));
// הוספה בלי מונה — בלי log:
const a3 = mkA();
const r3 = planAddName(a3, ' דוד ', '', 'n2', normName, isoToday);
ok(r3.ok === true && r3.names.length === 2, 'ok + names.length=2');
ok(JSON.stringify(r3.names[1]) === JSON.stringify({ id: 'n2', name: 'דוד', eyes: '', done: false }), 'names[1]: ' + JSON.stringify(r3.names[1]));
ok(!('log' in r3), "eyes='' ⇒ אין מפתח log");
ok(a3.names.length === 1, 'a המקורי לא שונה (אימוטביליות)');
// הוספה עם מונה — log בראש:
const r4 = planAddName(mkA(), 'רות', 5, 'n3', normName, isoToday);
ok(r4.ok === true && r4.log.length === 2, 'eyes=5 ⇒ log.length=2');
ok(JSON.stringify(r4.log[0]) === JSON.stringify({ date: '2026-08-24', eyes: 5, name: 'רות' }), 'log[0]: ' + JSON.stringify(r4.log[0]));
ok(r4.log[1].name === 'משה לוי', 'הרשומה הישנה אחרי החדשה');
// eyes=0 — מונה שסופק:
const r5 = planAddName(mkA(), 'חנה', 0, 'n4', normName, isoToday);
ok(r5.ok === true && r5.log && r5.log[0].eyes === 0, 'eyes=0 ⇒ log עם eyes=0');
if (f) process.exit(1);
console.log('✓ plan-add-name: 10 דוגמאות-חוזה — ירוק');
