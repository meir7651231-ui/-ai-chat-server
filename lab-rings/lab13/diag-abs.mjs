import fs from 'fs'; import { loadShelf, placements } from './tzoref.mjs'; import { goals } from './tzoref-goals.mjs'; import { partTables } from './tzoref-tables.mjs'; import { pool } from './tzoref-fast.mjs';
const G=goals(), CFG=JSON.parse(fs.readFileSync('tzoref-config.json','utf8')); const name=process.argv[2]||'הפרש מוחלט'; const RUNS=+process.argv[3]||10; const CAP=+process.argv[4]||20000;
const sh=loadShelf(); const P=pool(4); const g=G[name]; const pref=[...(g.ins||[0,1]),4,5,6,7,2].filter((c,i,a)=>a.indexOf(c)===i); const small=[],big=[];
for(const b of sh.named){ if(b.name===name||b.bad||!(b.ins||[]).length||/רשימה|ספור|בלי|אמצע|וקטן/.test(b.name)||b.prog.length>60) continue;
  const Q=b.movable===false?[{name:b.name,prog:b.prog}]:placements(b,b.prog.length<=20?400:CFG.BIG,pref); (b.prog.length<=20?small:big).push(...Q); }
const all=[...small,...big]; const tables=partTables(sh.named.filter(b=>!b.bad)).filter(t=>t.name!==name);
console.log('חלקים: קטנים',small.length,'· כולם',all.length,'· שמות:',[...new Set(all.map(p=>p.name))].join(' | '));
const mixes=process.env.SOLO?CFG.MIX.map(m=>[m]):[CFG.MIX];
for(const mix of mixes){ const SL=+process.env.SLICE||0; const jobs=mix.map(([k,m,l],i)=>({pieces:k==='A'?all:k==='S'?small:[],width:CFG.W0*m,lab:l,slice:i===0?SL:0})); let ok=0,T=[];
  for(let r=0;r<RUNS;r++){ const res=await P.build(name,{ms:CAP,N:8,tables,ins:g.ins,lab:CFG.LAB,rules:CFG.RULES,jobs});
    if(res.prog){ ok++; T.push(res.ms); } console.log(`  ${JSON.stringify(mix)} סיבוב ${r+1}: ${res.prog?`✓ ${res.ms}ms · רוחב ${res.width} · אורך ${res.prog.length}${res.used?' · חלקים '+res.used:''}`:`✗ ${res.ms}ms`} · ניסיונות ${res.tries}${res.restarts?" · התחלות-מחדש "+res.restarts:""}`); }
  console.log(`  ⇒ ${JSON.stringify(mix)}: הצליח ${ok}/${RUNS}`); }
P.close(); process.exit(0);
