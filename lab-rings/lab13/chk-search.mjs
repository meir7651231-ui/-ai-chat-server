import fs from 'fs'; import { makeSpecs } from './specs.mjs'; import { checker } from './tools3.mjs';
const {S}=makeSpecs(7070); const n='חפש ברשימה';
const mk=(L)=>()=>{ const e=S[n](); const b=e.mem.slice(); return {mem:e.mem,ok:r=>e.ok(r)&&L.every(c=>r[c]===b[c])}; };
for(const f of ['shelf3.json','shelf.before-less2.json','shelf3.before-strict.json']){ const j=JSON.parse(fs.readFileSync(f,'utf8')); const p=j.named.find(x=>x.name===n).prog;
  const noKeep=checker(mk([]),3000,200000)(p), keep=checker(mk([0,1,8,9,10,11,12,13,14,15]),3000,200000)(p);
  const cells=[0,1,8,9,10,11,12,13,14,15].filter(c=>!checker(mk([c]),3000,200000)(p));
  console.log(f,p.length,'תשובה נכונה:',noKeep,'· שומר קלט:',keep, cells.length?'· דורס תאים: '+cells:''); }
