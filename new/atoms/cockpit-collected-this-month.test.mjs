import { cockpitCollectedThisMonth as f } from './cockpit-collected-this-month.mjs';
const S = [
  { donations: [{ date: '2026-08-05', amount: 100, cur: '₪' }, { date: '2026-07-30', amount: 50, cur: '₪' }], hist: [{ d: '2026-08-10', a: 20, c: '$' }] },
  { donations: [{ date: '2026-08-20', amount: 200, cur: '$' }], hist: [] },
  { donations: [{ date: '2026-06-01', amount: 999, cur: '₪' }] },
];
// חודש-נוכחי 2026-08: 100(₪) + 20*3.7($) + 200*3.7($) = 914. rate=4 ⇒ 980. חודש-עבר/אחר מסונן.
const CASES = [[[S, '2026-08-26'], 914], [[[], '2026-08-26'], 0], [[S, '2026-08-26', 4], 980]];
let e = 0;
for (const [args, want] of CASES) { const got = f(...args); if (got !== want) { console.error('✗', JSON.stringify(args.slice(1)), got, '≠', want); e = 1; } }
if (e) process.exit(1);
console.log('✓ cockpit-collected-this-month: ' + CASES.length + ' Golden — ירוק');
