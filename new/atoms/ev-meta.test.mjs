import { EV_META as M } from './ev-meta.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(Object.keys(M).length === 8, 'מספר סוגים ' + Object.keys(M).length + ' ≠ 8');
for (const k of ['reminder','call','wedding','memorial','anniversary','bday','org','custom'])
  ok(k in M, 'חסר סוג ' + k);
ok(M.reminder.label === 'תזכורת' && M.reminder.bg === '#efe7f3' && M.reminder.c === '#7c3aed', 'reminder שבור');
ok(M.call.label === 'טלפון' && M.call.c === '#0f766e', 'call שבור');
ok(M.wedding.bg === '#fdeee0', 'wedding.bg שבור');
ok(M.bday.bg === M.anniversary.bg && M.bday.c === M.anniversary.c, 'bday/anniversary — פיגמנטים אמורים להיות זהים');
ok(M.bday.label === 'יום הולדת' && M.anniversary.label === 'יום נישואים', 'תוויות bday/anniversary');
ok(M.org.label === 'אירוע' && M.custom.label === 'אירוע' && M.org.bg === M.custom.bg && M.org.c === M.custom.c && M.org.bg === '#e7edf5' && M.org.c === '#3a5a86', 'org/custom אמורים להיות זהים');
for (const [k, v] of Object.entries(M)) {
  ok(/^#[0-9a-f]{6}$/.test(v.bg), k + '.bg אינו hex-7');
  ok(/^#[0-9a-f]{6}$/.test(v.c), k + '.c אינו hex-7');
}
if (f) process.exit(1);
console.log('✓ ev-meta: 8 סוגים, כל דוגמאות-החוזה — ירוק');
