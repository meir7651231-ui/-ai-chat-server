import fs from 'node:fs'; import { run } from './machine2.mjs';
const e = JSON.parse(fs.readFileSync(new URL('./lib2.json', import.meta.url))).find((m) => m.name.startsWith('אם'));
let ok = 0, n = 0; for (let c = 0; c < 16; c++) for (let x = 1; x < 16; x++) for (let y = 1; y < 16; y += 3) { const m = new Array(16).fill(0); m[0] = c; m[1] = x; m[3] = y; const r = run(e.prog, m); n++; if (r && r.mem[2] === (c ? x : y)) ok++; }
console.log('«אם» מהזיכרון:', ok, '/', n);
