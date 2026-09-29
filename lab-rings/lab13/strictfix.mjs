// תיקון לבנה שנוגעת בתא שלא קיים: מנסה להכניס «WHERE k» (או להחליף פקודה ב-WHERE k) בכל מקום, ובודק במכונה הקפדנית.
import fs from 'fs'; import { makeSpecs } from './specs.mjs'; import { checker } from './tools3s.mjs';
const {S}=makeSpecs(909); const src=fs.readFileSync('audit3s.mjs','utf8'); eval(src.split('\n').slice(3,8).join('\n'));
const n=process.argv[2]; const sh=JSON.parse(fs.readFileSync(process.argv[3]||'shelf3.json','utf8')); const b=sh.named.find(x=>x.name===n); const p=b.prog;
const ins=/רשימה|כתוב לכתובת/.test(n)?[]:(b.ins||[]).filter(c=>c!==2);
const keep=(gen)=>()=>{ const e=gen(); const bb=e.mem.slice(); return {mem:e.mem,ok:r=>e.ok(r)&&ins.every(c=>r[c]===bb[c])}; };
const fast=checker(keep(S[n]),60,200000), full=checker(keep(S[n]),3000,200000);
const shiftIns=(i)=>p.map(([o,k,c])=>o==='WHERE'&&c==='code'&&k>=i?[o,k+1,c]:(c?[o,k,c]:(k===undefined?[o]:[o,k])));
const best=[];
for(let i=0;i<=p.length;i++) for(let k=0;k<16;k++){ const q=shiftIns(i); q.splice(i,0,['WHERE',k]); if(fast(q)&&full(q)){ best.push([q.length,'הוספה',i,k,q]); } }
for(let i=0;i<p.length;i++) for(let k=0;k<16;k++){ if(p[i][2]==='code') continue; const q=p.map(x=>x.slice()); q[i]=['WHERE',k]; if(fast(q)&&full(q)) best.push([q.length,'החלפה',i,k,q]); }
best.sort((a,b)=>a[0]-b[0]);
console.log(n,'היה',p.length, best.length?`→ תוקן: ${best[0][0]} (${best[0][1]} WHERE ${best[0][3]} בשורה ${best[0][2]})`:'→ לא נמצא תיקון של פקודה אחת');
if(best.length) fs.writeFileSync('strict-'+n.replace(/[ ()]/g,'_')+'.json',JSON.stringify(best[0][4]));
