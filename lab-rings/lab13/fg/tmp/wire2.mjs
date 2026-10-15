import fs from 'fs';
import { solveAny } from '../../brain-all.mjs';
const B = '/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad/';
const t = JSON.parse(fs.readFileSync(B + 'fails/s5-fails-after-r5.json', 'utf8')).find((x) => x.name === process.argv[2]);
const T0 = Date.now();
const r = await solveAny({ name: t.name, kind: t.kind, src: t.src }, { say: (s) => console.log(((Date.now() - T0) / 1000).toFixed(1) + 's', s) });
console.log(JSON.stringify({ ok: r.ok, stage: r.stage, how: r.how, len: r.len, bad: r.bad, ms: r.ms }));
