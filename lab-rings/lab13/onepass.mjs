// «סכום בלי הגדול» במעבר אחד על הרשימה: בכל איבר — מעדכנים גם סכום (תא 6) וגם מקסימום (תא 7). בסוף: חיסור.
import fs from 'fs'; import { expand } from './recipes.mjs'; import { checker, shrink, anneal } from './tools3.mjs';
let s=91; const rnd=(k)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%k; };
const shuffled=()=>{ const p=[8,9,10,11,12,13,14,15]; for(let i=7;i>0;i--){ const j=rnd(i+1); [p[i],p[j]]=[p[j],p[i]]; } return p; };
const LIST=[0,1,8,9,10,11,12,13,14,15];
const g=()=>{ const m=new Array(16).fill(0); const l=shuffled().slice(0,rnd(9)); m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; });
  const w=(l.reduce((a,b)=>a+b,0)-(l.length?Math.max(...l):0))&15; const mem=m.map((v,k)=>LIST.includes(k)?v:rnd(16)); const bf=mem.slice(); return {mem,ok:r=>r[2]===w&&LIST.every(c=>r[c]===bf[c])}; };
const F15='TAKE; TAKE; CALC; TAKE; CALC', Z=(c)=>`WHERE ${c}; GO; ${F15}; PUT; TAKE; TAKE; CALC; PUT`;
// «מקסימום» קבוע לתאים 0/1 (הכתובת מחושבת) ⇒ מביאים אליו: מצביע בתא 4, סכום 6, מקס 7, ראש-הרשימה שמור בתא 5. תא 0 = 0 לפי כללי המבחן.
const HEAD='WHERE 1; GO; TAKE; WHERE 5; GO; PUT; WHERE 5; GO; TAKE; WHERE 4; GO; PUT';
const TEST='LOOP: WHERE 4; GO; TAKE; WHERE @BODY; JUMP; WHERE 4; GO; TAKE; TAKE; CALC; WHERE @END; JUMP';
const STEP='WHERE 4; GO; TAKE; WHERE@; GO; TAKE; WHERE 4; GO; PUT';
const rec=[Z(6),Z(7),HEAD,TEST,'BODY: WHERE 4; GO; TAKE',
  'WHERE 7; GO; TAKE; WHERE 0; GO; PUT; WHERE 4; GO; TAKE; WHERE 1; GO; PUT',
  {call:'מקסימום',map:{0:0,1:1,2:2,3:3}},
  'WHERE 2; GO; TAKE; WHERE 7; GO; PUT',
  'WHERE 6; GO; TAKE; WHERE 4; GO; TAKE; ADD; WHERE 6; GO; PUT',STEP,'WHERE @LOOP; JUMP; END:',
  'WHERE 5; GO; TAKE; WHERE 1; GO; PUT', Z(0),
  {call:'חיסור',map:{0:6,1:7,2:2},free:[4,5,3]}];
const file=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const shelf=new Map(file.named.map(b=>[b.name,b]));
const fast=checker(g,40,200000), full=checker(g,300,200000), fresh=checker(g,3000,200000); const ok=p=>fast(p)&&full(p);
const raw=expand(rec,shelf); console.log('מעבר אחד — אחרי הדבקה:',raw.length,'· עובדת:',fresh(raw));
if(fresh(raw)&&process.argv[2]!=="dbg"){ const p=anneal(shrink(raw,ok),ok,3000,4,3); const best=fresh(p)?p:raw; console.log('אחרי קיצור מהיר:',best.length); fs.writeFileSync('onepass.json',JSON.stringify(best)); }
if(process.argv[2]==='dbg'){ const { run } = await import('./machine3s.mjs');
 for(const l of [[],[9],[9,12],[12,9],[8,9,10]]){ const m=new Array(16).fill(0); m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; });
  const r=run(raw,m,{maxSteps:200000}); console.log(JSON.stringify(l),'רוצה',(l.reduce((a,b)=>a+b,0)-(l.length?Math.max(...l):0))&15,'קיבל',r?r.mem[2]:'נתקע','מחסנית',r?r.st.length:'-','תא6',r?.mem[6],'תא7',r?.mem[7]); } }
