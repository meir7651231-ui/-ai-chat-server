// step core-machine: the shared state table itself. The page and the bubble are generated from it, so a hole here
// is a hole on both sides. Run: node tests/machine.test.js
const P = require('../protocol/protocol.json'); const S = P.states, M = S.moves, N = Object.keys(M)
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ }
ok(N.includes(S.initial), 'the initial state exists: ' + S.initial)
const unknown = N.flatMap(a => M[a].filter(b => !N.includes(b)).map(b => a + '>' + b))
ok(!unknown.length, 'every move lands on a known state' + (unknown.length ? ': ' + unknown : ''))
const reach = from => { const seen = new Set([from]), q = [from]; while (q.length) for (const b of M[q.shift()] || []) if (!seen.has(b)) { seen.add(b); q.push(b) } return seen }
const fromStart = reach(S.initial)
ok(N.every(n => fromStart.has(n)), 'every state is reachable from ' + S.initial + ' (no orphan): ' + N.filter(n => !fromStart.has(n)))
ok(N.every(n => reach(n).has('IDLE')), 'from every state there is a way back to IDLE (no trap)')
ok(N.every(n => n === 'OFFLINE' || M[n].includes('OFFLINE')), 'every state can drop to OFFLINE - a disconnect is always legal')
// 500 random event sequences: a random walk of 60 steps each over legal moves never leaves the table
let bad = 0, seed = 7; const rnd = n => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n }
for (let r = 0; r < 500; r++) { let s = S.initial; for (let i = 0; i < 60; i++) { const opts = M[s]; if (!opts || !opts.length) { bad++; break } s = opts[rnd(opts.length)]; if (!N.includes(s)) { bad++; break } } }
ok(bad === 0, '500 random sequences of 60 moves: 0 illegal, 0 dead ends')
process.exit(fails ? 1 : 0)
