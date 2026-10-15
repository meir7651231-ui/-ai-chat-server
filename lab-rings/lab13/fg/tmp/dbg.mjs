import fs from 'fs';
import { solveLists } from '../search.mjs'; import { loadIndex } from '../index.mjs';
const row = fs.readFileSync('bench3-list2num.jsonl','utf8').split('\n').filter(Boolean).map(JSON.parse).find(r=>r.name===process.argv[2]);
const f = new Function('return ('+row.src+')')();
const ix = loadIndex('fg/index.bin'); const prior = JSON.parse(fs.readFileSync('fg/prior/upto5.json','utf8'));
const t=Date.now(); const r = solveLists('list2num', l=>f(l)&15, {ms:60000, index:ix, prior, live: process.argv[3]||'auto', say:console.log});
console.log((Date.now()-t), JSON.stringify(r).slice(0,600));
