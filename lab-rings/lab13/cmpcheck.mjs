// השוואה על עריכות אמיתיות של תוכנית 142: הבודק המהיר והרגיל על אותן דוגמאות — חייבים להסכים תמיד. ומדידת מהירות.
import fs from 'fs'; import { checker, checkerF, ALPHA } from './tools3f.mjs';
const src=fs.readFileSync('seamwin.mjs','utf8'); // לוקחים את מחולל הדוגמאות של «כמה מעל האמצע» מאותו מקום
import { makeSpecs } from './specs.mjs';
const shuf=()=>{ const q=[8,9,10,11,12,13,14,15]; for(let i=7;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [q[i],q[j]]=[q[j],q[i]]; } return q; };
const LG=(f)=>()=>{ const m=new Array(16).fill(0); const l=shuf().slice(0,Math.floor(Math.random()*9)); m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; }); const w=f(l,m); const LL=[0,1,8,9,10,11,12,13,14,15]; const mem=m.map((v,k)=>LL.includes(k)?v:Math.floor(Math.random()*16)); const b=mem.slice(); return {mem,ok:r=>r[2]===w&&LL.every(c=>r[c]===b[c])}; };
const g=LG(l=>{ const a=l.length?Math.max(...l):0, b=l.length?Math.min(...l):15, mid=(b+(((a-b)&15)>>1))&15; return l.filter(x=>x>mid).length; });
const F=checkerF(g,300,20000); const ex=F.ex;
// בודק רגיל על אותן דוגמאות: משכפלים את checker עם ex קבועות
import { run } from './machine3s.mjs';
const S=(p)=>{ for(let idx=0;idx<ex.length;idx++){ const e=ex[idx]; for(const sc of [0,e.sc]){ const pa=(idx*5+(sc?7:0))&15, aa=((idx>>4)*3+(sc?11:0)+idx)&15; const q=[['WHERE',pa],['GO'],['WHERE',aa],...p.map(([o,k,c])=>o==='WHERE'?['WHERE',c?k+3:k]:[o])]; const r=run(q,e.mem,{maxSteps:20000,scramble:sc}); if(!r||r.st.length||!e.ok(r.mem)) return false; } } return true; };
const p=JSON.parse(fs.readFileSync('lm-mid.json','utf8')); const cands=[p];
for(let i=0;i<p.length;i++){ const q=p.slice(); q.splice(i,1); cands.push(q.map(x=>x[2]==='code'&&x[1]>i?['WHERE',x[1]-1,'code']:x)); for(const a of ALPHA){ if(p[i][2]||p[i][0]==='JUMP') continue; const r=p.slice(); r[i]=a; cands.push(r); } }
let t=Date.now(); const rs=cands.map(S); const ts=Date.now()-t; t=Date.now(); const rf=cands.map(F); const tf=Date.now()-t;
let dis=0, acc=0; rs.forEach((v,i)=>{ if(v!==rf[i]) dis++; if(v) acc++; });
console.log(`${cands.length} עריכות אמיתיות · עוברות: ${acc} · אי-הסכמות: ${dis}`); console.log(`רגיל: ${ts} אלפיות · מהיר: ${tf} אלפיות · פי ${(ts/tf).toFixed(0)}`);
