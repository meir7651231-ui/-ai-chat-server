import fs from 'node:fs'; import { run } from './machine2.mjs';
const e = JSON.parse(fs.readFileSync(new URL('./lib2.json', import.meta.url))).find((m) => m.name === 'שונה (מספרים)');
let ok = 0; for (let a = 0; a < 16; a++) for (let b = 0; b < 16; b++) { const m = new Array(16).fill(0); m[0] = a; m[1] = b; const r = run(e.prog, m); if (r && r.mem[2] === (a ^ b)) ok++; }
console.log('בדיקה מהזיכרון: כל 256 הצירופים:', ok, '/ 256');
