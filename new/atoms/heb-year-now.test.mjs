// בדיקת-חוזה · heb-year-now — מוכיחה את 5 דוגמאות-החוזה. מייבאת רק את האטום-שלה.
// השקע hebParts ממומש כאן ביט-זהה למקור (maor/src/lib/hebrew.ts:124-129).
import { hebYearNow } from './heb-year-now.mjs';

const fmtParts = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' });
function hebParts(d) {
  if (isNaN(d.getTime())) return { day: 0, month: '', year: 0 };
  const parts = fmtParts.formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value ?? '';
  return { day: +get('day'), month: get('month'), year: +get('year') };
}
const at = (iso) => hebYearNow(hebParts, new Date(iso + 'T12:00:00'));

let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

ok(at('2026-08-24') === 5786, '2026-08-24 ≠ 5786');                       // 1
ok(at('2026-09-11') === 5786, '2026-09-11 (ערב ר״ה) ≠ 5786');             // 2
ok(at('2026-09-12') === 5787, '2026-09-12 (א׳ תשרי) ≠ 5787');             // 3
ok(at('2026-01-01') === 5786, '2026-01-01 ≠ 5786 (שנה אזרחית ≠ עברית)');  // 4
ok(hebYearNow(hebParts, new Date('שבור')) === 0, 'Date שבור ≠ 0');         // 5

if (f) process.exit(1);
console.log('✓ heb-year-now: 5 דוגמאות-חוזה — ירוק');
