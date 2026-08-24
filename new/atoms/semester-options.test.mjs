import { SEMESTER_OPTIONS as S } from './semester-options.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(S.length === 2, 'אורך ' + S.length + ' ≠ 2');
ok(S[0] === 'שנתי', "[0] ≠ 'שנתי'");
ok(S[1] === 'חצי שנתי', "[1] ≠ 'חצי שנתי'");
ok(new Set(S).size === S.length, 'כפילות ברשימה');
if (f) process.exit(1);
console.log('✓ semester-options: 4 דוגמאות-חוזה — ירוק');
