// ביקורת: כל לבנה במדף — עושה את מה שצריך, לא נוגעת בקלט, ועובדת באמצע תוכנית (לאן/איפה אקראיים). 3000 דוגמאות לכל אחת.
import fs from 'fs'; import { makeSpecs } from './specs.mjs'; import { checker } from './tools3.mjs';
const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const {S}=makeSpecs(909);
const M=(f)=>()=>{ const m=Array.from({length:16},()=>Math.floor(Math.random()*16)); if(Math.random()<0.25) m[1]=m[0]; const w=f(m[0],m[1]); return {mem:m,ok:r=>r[2]===w}; };
Object.assign(S,{'חיסור':M((a,b)=>(a-b)&15),'ועוד 2':M(a=>(a+2)&15),'קטן מ-':M((a,b)=>a<b?15:0),'גדול מ-':M((a,b)=>a>b?15:0),'מינימום':M((a,b)=>Math.min(a,b)),'מקסימום':M((a,b)=>Math.max(a,b))});
const shuf=()=>{ const p=[8,9,10,11,12,13,14,15]; for(let i=7;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [p[i],p[j]]=[p[j],p[i]]; } return p; };
const LG=(f,key)=>()=>{ const m=new Array(16).fill(0); const l=shuf().slice(0,Math.floor(Math.random()*9)); m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; }); if(key) m[0]=8+Math.floor(Math.random()*8); const w=f(l,m); const L=[0,1,8,9,10,11,12,13,14,15]; const mem=m.map((v,k)=>L.includes(k)?v:Math.floor(Math.random()*16)); return {mem,ok:r=>r[2]===w}; };
Object.assign(S,{'הקטן ברשימה':LG(l=>l.length?Math.min(...l):15),'ספור גדולים מ-X':LG((l,m)=>l.filter(x=>x>m[0]).length,true)});
const keep=(gen,ins)=>()=>{ const e=gen(); const b=e.mem.slice(); return {mem:e.mem,ok:r=>e.ok(r)&&ins.every(c=>r[c]===b[c])}; };
let bad=[], tot=0; for(const b of sh.named){ const ins=/רשימה|כתוב לכתובת/.test(b.name)?[]:(b.ins||[]).filter(c=>c!==2); const ok=checker(keep(S[b.name],ins),3000,200000)(b.prog); if(!ok) bad.push(b.name); tot+=b.prog.length; }
const tt=(t)=>()=>{ const m=Array.from({length:16},()=>Math.floor(Math.random()*16)); const a=m[0],bb=m[1],c=m[3]; let w=0; for(let k=0;k<4;k++){ const idx=(((a>>k)&1)<<2)|(((bb>>k)&1)<<1)|((c>>k)&1); w|=((t>>idx)&1)<<k; } return {mem:m,ok:r=>r[2]===w}; };
let badL=0, totL=0; for(const b of sh.logic){ if(!checker(keep(tt(b.tt),[0,1,3]),1500)(b.prog)) badL++; totL+=b.prog.length; }
console.log(`עם שם: ${sh.named.length} · נכשלו ${bad.length} ${bad.join(', ')} · סך ${tot}`); console.log(`לוגיות: 256 · נכשלו ${badL} · סך ${totL}`);
