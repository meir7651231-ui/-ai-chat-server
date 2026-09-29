// שני כלים חדשים למנוע: (א) לגעת גם ליד קפיצות — כתובות-הקפיצה מתוקנות אוטומטית; (ב) «גזור והדבק» של קטע שלם.
// כל שינוי: בונים מפה «מקום ישן ⇒ מקום חדש», ומעדכנים כל כתובת-קפיצה לפיה.
import fs from 'fs'; import { makeSpecs } from './specs.mjs'; import { checker, shrink, ALPHA } from './tools3.mjs';
function rebuild(p,order,ins){ // order: רשימת אינדקסים ישנים (או null לפעולה חדשה מ-ins) לפי הסדר החדש
  const newPos=new Map(); order.forEach((o,i)=>{ if(o!=null&&!newPos.has(o)) newPos.set(o,i); });
  const L=order.length; const mapT=(t)=>{ if(t>=p.length) return L; for(let x=t;x<p.length;x++) if(newPos.has(x)) return newPos.get(x); return L; };
  return order.map((o,i)=>{ const x=o==null?ins[i]:p[o]; return x[2]==='code'?['WHERE',mapT(x[1]),'code']:x; }); }
const idx=(n)=>Array.from({length:n},(_,i)=>i);
export function bigAnneal(p0,ok,ms,seed=1){ let s=seed; const R=(n)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%n; }, U=()=>R(1e6)/1e6, A=()=>ALPHA[R(ALPHA.length)];
  let cur=p0, best=p0; const t0=Date.now();
  while(Date.now()-t0<ms){ const T=1.5*(1-(Date.now()-t0)/ms)+0.05; const L=cur.length, m=R(7); let c=null; const o=idx(L); const ins={};
    if(m===0){ const i=R(L); o.splice(i,1); c=rebuild(cur,o,ins); }                                   // מחיקה (גם קפיצה/כתובת)
    else if(m===1){ const i=R(L); if(cur[i][2]||cur[i][0]==='JUMP') continue; const k=R(L+1); const q=o.slice(); q.splice(k,0,null); const insA={}; insA[k]=A(); c=rebuild(cur,q,insA); }
    else if(m===2){ const i=R(L); if(cur[i][2]) continue; const q=o.slice(); q[i]=null; const insA={}; insA[i]=A(); c=rebuild(cur,q,insA); }  // החלפה
    else if(m===3||m===4){ const w=1+R(8), i=R(L); if(i+w>L) continue; const seg=o.slice(i,i+w); const rest=[...o.slice(0,i),...o.slice(i+w)]; const k=R(rest.length+1); rest.splice(k,0,...seg); c=rebuild(cur,rest,{}); } // גזור והדבק
    else if(m===5){ const i=R(L), j=R(L); const q=o.slice(); [q[i],q[j]]=[q[j],q[i]]; c=rebuild(cur,q,{}); }  // החלפת מקומות
    else { const i=R(L), w=2+R(4); if(i+w>L) continue; const q=[...o.slice(0,i),...o.slice(i+w)]; c=rebuild(cur,q,{}); }
    if(!c) continue; const d=c.length-cur.length; if(d>0&&U()>Math.exp(-d/T)) continue; if(c.length>best.length+10||!ok(c)) continue; cur=c; if(cur.length<best.length){ best=cur; } }
  return best; }
if(import.meta.url==='file://'+process.argv[1]){ const {S}=makeSpecs(99); const name='אורך רשימה (לולאה + ספירה)'; const L=[0,1,8,9,10,11,12,13,14,15];
  const g=()=>{ const e=S[name](); const b=e.mem.slice(); return {mem:e.mem,ok:r=>e.ok(r)&&L.every(c=>r[c]===b[c])}; };
  const fast=checker(g,40,20000), full=checker(g,300,20000), fresh=checker(g,3000,20000); const ok=p=>fast(p)&&full(p);
  let best=JSON.parse(fs.readFileSync('hoist.json','utf8')); console.log('התחלה (מתכון):',best.length);
  for(let r=1;r<=+process.argv[3]||4;r++){ const b=bigAnneal(best,ok,+process.argv[2]||60000,r*17); const b2=shrink(b,ok); if(b2.length<best.length&&fresh(b2)) best=b2; console.log(`סבב ${r}: ${best.length} (ביד: 39)`); fs.writeFileSync('bigmoves.json',JSON.stringify(best)); } }
