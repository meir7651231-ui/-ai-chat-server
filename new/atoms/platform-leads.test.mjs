import { PLATFORM_LEADS as V } from './platform-leads.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(V === 'platformLeads', 'ערך ' + JSON.stringify(V) + " ≠ 'platformLeads'");
ok(typeof V === 'string', 'טיפוס ' + typeof V + ' ≠ string');
ok(V.length === 13, 'אורך ' + V.length + ' ≠ 13');
ok(!V.includes('/'), "מכיל '/' — לא מקטע-נתיב יחיד");
if (f) process.exit(1);
console.log('✓ platform-leads: 4 דוגמאות-חוזה — ירוק');
