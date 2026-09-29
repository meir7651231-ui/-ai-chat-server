import fs from 'fs'; import { run as run2 } from './machine2.mjs'; import { run as run3 } from './machine3.mjs'; import { expand } from './recipes.mjs'; import { checker, shrink } from './tools3.mjs';
const A=JSON.parse(fs.readFileSync('shelf.json','utf8')), B=JSON.parse(fs.readFileSync('shelf3.json','utf8'));
const plain=p=>p.map(([o,k])=>o==='WHERE'?['WHERE',k]:[o]); const rnd=()=>Math.floor(Math.random()*16);
const steps=(p,run)=>{ let t=0,mx=0; for(let i=0;i<400;i++){ const r=run(plain(p),Array.from({length:16},rnd),{maxSteps:200000}); t+=r.steps; mx=Math.max(mx,r.steps);} return `${Math.round(t/400)}/${mx}`; };
console.log('לבנה | מכונה נוכחית: אורך · צעדים (ממוצע/מקס) | עם «הזז ימינה»: אורך · צעדים');
for(const n of ['קטן מ-','גדול מ-','מינימום','מקסימום']){ const a=A.named.find(b=>b.name===n), b=B.named.find(x=>x.name===n);
  console.log(`${n} | ${a.prog.length} · ${steps(a.prog,run2)} | ${b.prog.length} · ${steps(b.prog,run3)}`); }
// הגדול ברשימה ממתכון, במכונה החדשה
const shelf=new Map(B.named.map(b=>[b.name,b])); const F15='TAKE; TAKE; CALC; TAKE; CALC';
const rec=['WHERE 2; GO; '+F15+'; PUT; TAKE; TAKE; CALC; PUT','WHERE 1; GO; TAKE; WHERE 3; GO; PUT','LOOP: WHERE 3; GO; TAKE; WHERE @BODY; JUMP; WHERE 3; GO; TAKE; TAKE; CALC; WHERE @END; JUMP','BODY: WHERE 3; GO; TAKE',{call:'מקסימום',map:{0:2,1:3,2:7},free:[6,5,4]},'WHERE 7; GO; TAKE; WHERE 2; GO; PUT','WHERE 3; GO; TAKE; WHERE@; GO; TAKE; WHERE 3; GO; PUT','WHERE @LOOP; JUMP; END:'];
const shuffled=()=>{ const p=[8,9,10,11,12,13,14,15]; for(let i=7;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [p[i],p[j]]=[p[j],p[i]]; } return p; };
const LIST=[0,1,8,9,10,11,12,13,14,15];
const gen=()=>{ const m=new Array(16).fill(0); const l=shuffled().slice(0,Math.floor(Math.random()*9)); m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; }); const w=l.length?Math.max(...l):0; const mem=m.map((v,k)=>LIST.includes(k)?v:rnd()); const bf=mem.slice(); return {mem,ok:r=>r[2]===w&&LIST.every(c=>r[c]===bf[c])}; };
const raw=expand(rec,shelf); const ok=checker(gen,200,200000); const p=ok(raw)?shrink(raw,ok):null; const hand=A.named.find(b=>b.name==='הגדול ברשימה').prog;
const lsteps=(q,run)=>{ let t=0,mx=0; for(let i=0;i<300;i++){ const e=gen(); const r=run(plain(q),e.mem,{maxSteps:200000}); t+=r.steps; mx=Math.max(mx,r.steps);} return `${Math.round(t/300)}/${mx}`; };
console.log(`הגדול ברשימה | ${hand.length} · ${lsteps(hand,run2)} (נגר) | ${p?p.length+' · '+lsteps(p,run3)+' (ממתכון, בלי יד)':'לא עבד'} · בדיקה על 2000: ${p&&checker(gen,2000,200000)(p)}`);
