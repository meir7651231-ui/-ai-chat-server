// duty-governor, page side: one timer for every periodic job. Run: node tests/beat.test.js
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'liba/src/01-beat.js'), 'utf8');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
let now = 0; const timers = []; const faults = [];
const fakeSet = (fn, ms) => { const t = { fn, at: now + ms, id: timers.length + 1 }; timers.push(t); return t; };
const fakeClear = t => { const i = timers.indexOf(t); if (i >= 0) timers.splice(i, 1); };
const B = new Function('Date', 'setTimeout', 'clearTimeout', 'fail', 'window', src + '\nreturn {every, beatRun, beatGear};')(
  { now: () => now }, fakeSet, fakeClear, (c, e, n) => faults.push(n), {});
const ran = [];
function advance(to) { while (true) { timers.sort((a, b) => a.at - b.at); const t = timers[0]; if (!t || t.at > to) break; timers.shift(); now = t.at; t.fn(); } now = to; }
B.every('outbox', 8000, () => ran.push('outbox@' + now));
B.every('mirror', 15000, () => ran.push('mirror@' + now));
B.every('bad', 10000, () => { throw new Error('x'); });
ok(timers.length === 1, 'one timer pending for three jobs: ' + timers.length);
advance(60000);
ok(ran.filter(x => x.startsWith('outbox')).length === 7 && ran.includes('outbox@8000') && ran.includes('outbox@56000'), 'outbox every 8s, exactly: ' + ran.filter(x => x.startsWith('outbox')).join(','));
ok(ran.filter(x => x.startsWith('mirror')).length === 4 && ran.includes('mirror@15000'), 'mirror every 15s');
ok(faults.length === 6 && faults.every(n => n === 'bad'), 'a job that throws is a fault with its name, the others still run: ' + faults.length);
ok(timers.length === 1, 'still one timer: ' + timers.length);
ran.length = 0; B.beatGear(2); advance(120000);
ok(ran.filter(x => x.startsWith('outbox')).length === 3 || ran.filter(x => x.startsWith('outbox')).length === 4, 'a slower gear stretches the periods (outbox every 16s over 60s): ' + ran.filter(x => x.startsWith('outbox')).length);
const page = fs.readdirSync(path.join(__dirname, '..', 'liba/src')).filter(f => f.endsWith('.js')).map(f => fs.readFileSync(path.join(__dirname, '..', 'liba/src', f), 'utf8')).join('\n');
ok(!/setInterval\((?!ringOnce)/.test(page), 'no setInterval left on the page except the ring (2.2s, while ringing only)');
console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
