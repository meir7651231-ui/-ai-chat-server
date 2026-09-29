// סבב על כל המדף במכונה עם «הזז ימינה»: המנוע מנסה לקצר כל לבנה (מקצר + חישול). נכנס רק אם קצר יותר ועובר את כל הכללים.
import fs from 'fs'; import { makeSpecs } from './specs.mjs'; import { checker, shrink, anneal } from './tools3.mjs';
const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const {S}=makeSpecs(2027); const MSN=+process.argv[2]||6000, MSL=+process.argv[3]||500;
const M=(f)=>()=>{ const m=Array.from({length:16},()=>Math.floor(Math.random()*16)); if(Math.random()<0.25) m[1]=m[0]; const w=f(m[0],m[1]); return {mem:m,ok:r=>r[2]===w}; };
const shuf=()=>{ const p=[8,9,10,11,12,13,14,15]; for(let i=7;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [p[i],p[j]]=[p[j],p[i]]; } return p; };
const LG=(f,key)=>()=>{ const m=new Array(16).fill(0); const l=shuf().slice(0,Math.floor(Math.random()*9)); m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; }); if(key) m[0]=8+Math.floor(Math.random()*8); const w=f(l,m); const L=[0,1,8,9,10,11,12,13,14,15]; const mem=m.map((v,k)=>L.includes(k)?v:Math.floor(Math.random()*16)); return {mem,ok:r=>r[2]===w}; };
Object.assign(S,{'חיסור':M((a,b)=>(a-b)&15),'ועוד 2':M(a=>(a+2)&15),'קטן מ-':M((a,b)=>a<b?15:0),'גדול מ-':M((a,b)=>a>b?15:0),'מינימום':M((a,b)=>Math.min(a,b)),'מקסימום':M((a,b)=>Math.max(a,b)),'הקטן ברשימה':LG(l=>l.length?Math.min(...l):15),'ספור גדולים מ-X':LG((l,m)=>l.filter(x=>x>m[0]).length,true)});
const guard=(b)=>{ const list=/רשימה|ספור/.test(b.name), ch=/הפוך|מיין/.test(b.name); const cells=list?(ch?[]:[0,1,8,9,10,11,12,13,14,15]):/כתוב לכתובת/.test(b.name)?[]:(b.ins||[]).filter(c=>c!==2);
  return ()=>{ const e=S[b.name](); const bf=e.mem.slice(); return {mem:e.mem,ok:r=>e.ok(r)&&cells.every(c=>r[c]===bf[c])}; }; };
let n0=0,n1=0; const log=[];
for(const b of sh.named){ const g=guard(b); const fast=checker(g,40,200000), full=checker(g,300,200000), fresh=checker(g,3000,200000); const ok=p=>fast(p)&&full(p);
  const p=anneal(shrink(b.prog,ok),ok,MSN,4,b.prog.length); n0+=b.prog.length; if(p.length<b.prog.length&&fresh(p)){ log.push(`${b.name}: ${b.prog.length} → ${p.length}`); b.prog=p; } n1+=b.prog.length;
  fs.writeFileSync('shelf3.json',JSON.stringify(sh)); }
console.log('עם שם:',n0,'→',n1); console.log(log.join('\n')||'(אף אחת לא ירדה)');
const tt=(t)=>()=>{ const m=Array.from({length:16},()=>Math.floor(Math.random()*16)); const a=m[0],bb=m[1],c=m[3]; let w=0; for(let k=0;k<4;k++){ const idx=(((a>>k)&1)<<2)|(((bb>>k)&1)<<1)|((c>>k)&1); w|=((t>>idx)&1)<<k; } return {mem:m,ok:r=>r[2]===w}; };
const kp=(gen)=>()=>{ const e=gen(); const bf=e.mem.slice(); return {mem:e.mem,ok:r=>e.ok(r)&&[0,1,3].every(c=>r[c]===bf[c])}; };
let l0=0,l1=0,lw=0; for(const b of sh.logic){ const g=kp(tt(b.tt)); const fast=checker(g,40), full=checker(g,300), fresh=checker(g,1500); const ok=p=>fast(p)&&full(p);
  const p=anneal(shrink(b.prog,ok),ok,MSL,3,b.tt+5); l0+=b.prog.length; if(p.length<b.prog.length&&fresh(p)){ b.prog=p; lw++; } l1+=b.prog.length; }
console.log(`לוגיות: ${l0} → ${l1} · השתפרו ${lw}`); fs.writeFileSync('shelf3.json',JSON.stringify(sh));
