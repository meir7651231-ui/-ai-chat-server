import { explainOne } from './explain-one.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const anchor = () => '2026-08-24';
// 1+2) אימות נכשל ⇒ הודעה מרוכזת; explainCall/anchorToday לא נקראים
let simCalls = 0, anchorCalls = 0;
const r1 = explainOne({}, 'מאור', 't1', { num: '025000000' },
  () => ({ raw: true }),
  () => ({ ok: false, errors: ['אין שלוחות', 'חסר מספר'] }),
  () => { simCalls++; return {}; },
  () => { anchorCalls++; return anchor(); });
ok(eq(r1, { summary: '⚠️ תצורה לא-תקינה: אין שלוחות · חסר מספר', outcome: 'invalid', reason: '' }), 'הודעת-הכשל שגויה');
ok(simCalls === 0 && anchorCalls === 0, 'נכשל אך הסימולטור/העוגן נקראו');
// 3+4+5) אימות עבר ⇒ העברה 1:1 + פרמטרים מדויקים
const tc = { ext: 1 }, call = { num: '025000000', when: '2026-08-24T10:00' };
const raw = { built: 'raw' }, tenant = { built: 'tenant' };
let seen = null, rawSeen = null, t2tArgs = null;
const r2 = explainOne(tc, 'מאור', 't1', call,
  (a, b, c) => { t2tArgs = [a, b, c]; return raw; },
  (r) => { rawSeen = r; return { ok: true, errors: [], tenant }; },
  (tn, cl, opts) => { seen = { tn, cl, opts }; return { summary: 'ניתוב לשלוחה 1', outcome: 'route', reason: 'שעות-פעילות', extra: 'לא-יעבור' }; },
  anchor);
ok(eq(r2, { summary: 'ניתוב לשלוחה 1', outcome: 'route', reason: 'שעות-פעילות' }), 'העברה 1:1 נכשלה (או שדה-עודף דלף)');
ok(seen.tn === tenant && seen.cl === call, 'explainCall לא קיבל את v.tenant/call המקוריים');
ok(eq(seen.opts, { anchorDate: '2026-08-24', calendarWindow: 400 }), 'opts שגוי (עוגן/חלון-400)');
ok(rawSeen === raw, 'ה-raw לא הועבר ל-validateTenant בזהות-הפניה');
ok(t2tArgs[0] === tc && t2tArgs[1] === 'מאור' && t2tArgs[2] === 't1', 'telephonyToTenant קיבל ארגומנטים שגויים');
if (f) process.exit(1);
console.log('✓ explain-one: 5 דוגמאות-חוזה — ירוק');
