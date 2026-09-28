import fs from 'node:fs'; import { run } from './machine2.mjs';
const lib = JSON.parse(fs.readFileSync('lib2.json', 'utf8')); const P = lib.find((m) => m.name === 'ועוד 1 באותו תא');
console.log(P.prog.map((p) => p.join(' ')).join(' | '));
for (const pre of [0, 1]) for (const v of [0, 3, 7, 15]) { const m = new Array(16).fill(0); m[2] = v; m[9] = 5;
  const pr = [...(pre ? [['WHERE', 9], ['GO'], ['TAKE']] : []), ...P.prog]; const r = run(pr, m); console.log('stack-before', pre, 'v', v, '->', r && r.mem[2], 'stack-after', r && JSON.stringify(r.st)); }
