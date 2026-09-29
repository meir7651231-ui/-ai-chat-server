// step req-spine: 100,000 ids in the same millisecond - 0 collisions, strictly ordered.
// mintId() is taken from the page source itself, not copied, so this tests what ships.
const fs = require('fs'), path = require('path'), vm = require('vm')
const src = fs.readFileSync(path.join(__dirname, '..', 'liba/src/00-paths.js'), 'utf8')
const fn = src.slice(src.indexOf('let mintLast='), src.indexOf('\n', src.indexOf("return t.toString(36)")) + 1)
let now = 1790000000000
const ctx = { Date: { now: () => now }, crypto: require('crypto').webcrypto, Math }
vm.createContext(ctx); vm.runInContext(fn, ctx)
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ }
const a = []; for (let i = 0; i < 100000; i++) a.push(ctx.mintId())             // all in ONE millisecond
ok(new Set(a).size === a.length, `100,000 ids in one millisecond: ${a.length - new Set(a).size} collisions`)
ok(a.every((x, i) => i === 0 || a[i - 1] < x), 'strictly increasing within the millisecond')
now++; const next = ctx.mintId()
ok(next > a[a.length - 1], 'the next millisecond sorts after all of them')
ok(/^[0-9a-z]{20}$/.test(next), 'fixed length, lowercase base36: ' + next)
process.exit(fails ? 1 : 0)
