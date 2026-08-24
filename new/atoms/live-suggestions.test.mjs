import { liveSuggestions } from './live-suggestions.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const sug = () => [{ key: 'a' }, { key: 'b' }, { key: 'c' }];
// 1) 'a' טופל ומוחרג
const r1 = liveSuggestions({ attnDone: { a: 1 } }, '2026-08-24', undefined, sug);
ok(r1.length === 2 && r1[0].key === 'b' && r1[1].key === 'c', 'דוגמה 1 נשברה');
// 2) אין attnDone ⇒ שלושתן
ok(liveSuggestions({}, '2026-08-24', undefined, sug).length === 3, 'דוגמה 2 נשברה');
// 3) הכול טופל ⇒ ריק
ok(liveSuggestions({ attnDone: { a: 1, b: '2026-08-24', c: true } }, '2026-08-24', undefined, sug).length === 0, 'דוגמה 3 נשברה');
// 4) ערך falsy אינו "טופל"
ok(liveSuggestions({ attnDone: { b: 0 } }, '2026-08-24', undefined, sug).length === 3, 'דוגמה 4 נשברה');
// 5) פס-העברה שקוף — השקע מקבל בדיוק את (db,todayIso,config)
const db5 = { attnDone: {} }, cfg5 = { features: {} };
let seen = null;
liveSuggestions(db5, '2026-01-01', cfg5, (d, t, c) => { seen = [d, t, c]; return []; });
ok(seen && seen[0] === db5 && seen[1] === '2026-01-01' && seen[2] === cfg5, 'דוגמה 5 נשברה — הארגומנטים לא הועברו כמו-שהם');
// 6) שקע ריק ⇒ ריק
ok(liveSuggestions({}, '2026-08-24', undefined, () => []).length === 0, 'דוגמה 6 נשברה');
if (f) process.exit(1);
console.log('✓ live-suggestions: 6 דוגמאות-חוזה — ירוק');
