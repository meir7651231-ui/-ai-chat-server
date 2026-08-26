import { cockpitProgress as f } from './cockpit-progress.mjs';
const Q = { tasks: [{ id: 'call:1' }, { id: 'thanks:2' }, { id: 'hok:3' }], total: 3 };
const mk = (arr) => new Set(arr);
const CASES = [
  [mk(['call:1', 'hok:3']), '{"done":2,"total":3}'],
  [mk([]), '{"done":0,"total":3}'],
  [mk(['call:1', 'thanks:2', 'hok:3', 'x']), '{"done":3,"total":3}'],
];
let e = 0;
for (const [done, want] of CASES) { const got = JSON.stringify(f(Q, done)); if (got !== want) { console.error('✗', got, '≠', want); e = 1; } }
if (e) process.exit(1);
console.log('✓ cockpit-progress: ' + CASES.length + ' Golden — ירוק');
