// תוכניות אמיתיות מהמדף: מדביקים לבנים (עם תאים ממופים), בודקים במכונה הקפדנית, ואז המנוע מקצר את כל התוכנית כיחידה אחת.
import fs from 'fs'; import { expand } from './recipes.mjs'; import { checker, shrink, anneal } from './tools3.mjs';
let s=91; const rnd=(k)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%k; };
const shuffled=()=>{ const p=[8,9,10,11,12,13,14,15]; for(let i=7;i>0;i--){ const j=rnd(i+1); [p[i],p[j]]=[p[j],p[i]]; } return p; };
const LIST=[0,1,8,9,10,11,12,13,14,15];
const gen=(f)=>()=>{ const m=new Array(16).fill(0); const l=shuffled().slice(0,rnd(9)); m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; });
  const w=f(l)&15; const mem=m.map((v,k)=>LIST.includes(k)?v:rnd(16)); const bf=mem.slice(); return {mem,ok:r=>r[2]===w&&LIST.every(c=>r[c]===bf[c])}; };
const mx=l=>l.length?Math.max(...l):0, mn=l=>l.length?Math.min(...l):15, sum=l=>l.reduce((a,b)=>a+b,0);
const P={
 'טווח הרשימה (גדול פחות קטן)': { f:l=>mx(l)-mn(l), rec:[
   {call:'הגדול ברשימה',map:{1:1,2:6},free:[3,4,5]},
   {call:'הקטן ברשימה',map:{1:1,2:7},avoid:[6],free:[3,4,5]},
   {call:'חיסור',map:{0:6,1:7,2:2}} ] },
 'סכום בלי הגדול': { f:l=>sum(l)-mx(l), rec:[
   {call:'סכום רשימה',map:{0:0,1:1,2:6},free:[3,4,5]},
   {call:'הגדול ברשימה',map:{1:1,2:7},avoid:[6],free:[3,4,5]},
   {call:'חיסור',map:{0:6,1:7,2:2}} ] },
};
const file=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const shelf=new Map(file.named.map(b=>[b.name,b]));
const only=process.argv[3]; const out={};
for(const [name,{f,rec}] of Object.entries(P)){ if(only&&name!==only) continue; const g=gen(f);
  const fast=checker(g,40,200000), full=checker(g,300,200000), fresh=checker(g,3000,200000); const ok=p=>fast(p)&&full(p);
  const parts=rec.map(r=>`${r.call} (${shelf.get(r.call).prog.length})`).join(' + '); const sumParts=rec.reduce((a,r)=>a+shelf.get(r.call).prog.length,0);
  let raw; try{ raw=expand(rec,shelf); }catch(e){ console.log(`✗ ${name}: ${e.message}`); continue; }
  if(!fresh(raw)){ console.log(`✗ ${name}: ההדבקה לא עובדת (${raw.length})`); continue; }
  const t=Date.now(); const p=anneal(shrink(raw,ok),ok,+process.argv[2]||8000,4,3); const best=fresh(p)?p:raw;
  console.log(`✓ ${name}\n   לבנים: ${parts} = ${sumParts}\n   אחרי הדבקה: ${raw.length} · אחרי שהמנוע קיצר את הכל ביחד: ${best.length} · ${((Date.now()-t)/1000).toFixed(0)} שניות`);
  out[name]={raw,best,rec}; }
fs.writeFileSync('compose-out.json',JSON.stringify(out));
