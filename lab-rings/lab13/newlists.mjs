// לבנים חדשות לגמרי — רק ממתכונים: שלד-לולאה + לבנות מהמדף. אף אחת מהן לא נכתבה ביד כתוכנית שלמה.
import fs from 'fs'; import { expand } from './recipes.mjs'; import { checker, shrink, anneal } from './tools2.mjs';
let s=77; const rnd=(k)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%k; };
const shuffled=()=>{ const p=[8,9,10,11,12,13,14,15]; for(let i=7;i>0;i--){ const j=rnd(i+1); [p[i],p[j]]=[p[j],p[i]]; } return p; };
const LIST=[0,1,8,9,10,11,12,13,14,15];
const gen=(f,key)=>()=>{ const m=new Array(16).fill(0); const l=shuffled().slice(0,rnd(9)); m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; }); if(key) m[0]=8+rnd(8);
  const w=f(l,m); const mem=m.map((v,k)=>LIST.includes(k)?v:rnd(16)); const bf=mem.slice(); return {mem,ok:r=>r[2]===w&&[0,1,8,9,10,11,12,13,14,15].every(c=>r[c]===bf[c])}; };
const F15='TAKE; TAKE; CALC; TAKE; CALC';
const HEAD='WHERE 1; GO; TAKE; WHERE 3; GO; PUT';
const TEST='LOOP: WHERE 3; GO; TAKE; WHERE @BODY; JUMP; WHERE 3; GO; TAKE; TAKE; CALC; WHERE @END; JUMP';
const STEP='WHERE 3; GO; TAKE; WHERE@; GO; TAKE; WHERE 3; GO; PUT';
const R={
 'הקטן ברשימה': ['WHERE 2; GO; '+F15+'; PUT',HEAD,TEST,'BODY: WHERE 3; GO; TAKE',{call:'מינימום',map:{0:2,1:3,2:5},free:[7,6,4]},'WHERE 5; GO; TAKE; WHERE 2; GO; PUT',STEP,'WHERE @LOOP; JUMP; END:'],
 'ספור גדולים מ-X': ['WHERE 2; GO; '+F15+'; PUT; TAKE; TAKE; CALC; PUT',HEAD,TEST,'BODY: WHERE 3; GO; TAKE',{call:'גדול מ-',map:{0:3,1:0,2:5},free:[7,6,4]},
   'WHERE 5; GO; TAKE; WHERE @INC; JUMP; WHERE 3; GO; TAKE; WHERE @NEXT; JUMP; INC: WHERE 2',{call:'ועוד 1 באותו תא',map:{2:2},free:[7,6,4,5]},'NEXT: '+STEP,'WHERE @LOOP; JUMP; END:'],
};
const SPEC={'הקטן ברשימה':gen(l=>l.length?Math.min(...l):15),'ספור גדולים מ-X':gen((l,m)=>l.filter(x=>x>m[0]).length,true)};
const file=JSON.parse(fs.readFileSync('shelf.json','utf8')); const shelf=new Map(file.named.map(b=>[b.name,b]));
for(const [name,rec] of Object.entries(R)){ const g=SPEC[name]; const fast=checker(g,40,60000), full=checker(g,300,60000), fresh=checker(g,3000,60000); const ok=p=>fast(p)&&full(p);
  let raw; try{ raw=expand(rec,shelf); }catch(e){ console.log(`✗ ${name}: ${e.message}`); continue; } if(!fresh(raw)){ console.log(`✗ ${name}: לא עובדת (${raw.length})`); continue; }
  const t=Date.now(); const p=anneal(shrink(raw,ok),ok,+process.argv[2]||8000,4,3); const best=fresh(p)?p:raw;
  console.log(`✓ ${name}: הורכבה ${raw.length} ⇐ קוצרה ${best.length} · עוברת 3000 רשימות חדשות · ${((Date.now()-t)/1000).toFixed(0)}s`);
  shelf.set(name,{name,ins:[0,1],out:2,prog:best,recipe:rec,by:'ממתכון (חדשה)'}); fs.writeFileSync('shelf.json',JSON.stringify({...file,named:[...shelf.values()]})); }
fs.writeFileSync('shelf.json',JSON.stringify({...file,named:[...shelf.values()]}));
