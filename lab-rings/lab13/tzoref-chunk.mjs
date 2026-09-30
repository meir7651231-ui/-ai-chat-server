// הצורף ממציא חלקים חדשים: אוסף פתרונות, מוצא צירופי-חלקים שחוזרים, מקצר כל צירוף כיחידה אחת,
// ומחזיר את המקוצר לתוך הפתרונות. כל פתרון חדש עובר בדיקה סופית (20,000 דוגמאות) — ורק אם הוא קצר מהמדף, נכנס.
import fs from 'fs'; import { loadShelf, placements, makeChecker, finalCheck, shorten } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
import { partTables } from './tzoref-tables.mjs'; import { pool } from './tzoref-fast.mjs'; import { rankParts } from './tzoref-pick.mjs'; import { run as runSlow } from './machine3s.mjs';
const G=goals(), CFG=JSON.parse(fs.readFileSync('tzoref-config.json','utf8')); const sh=loadShelf(); const LISTC=[0,1,8,9,10,11,12,13,14,15];
const TASKS=(process.env.TASKS||'הפרש מוחלט,הגדול מבין שלושה,הקטן מבין שלושה,גדול או שווה,זוגי?,מקסימום נייד,ועוד 3,סכום שלושה,כפול 2,פחות 1,חצי,אפס?').split(',');
const RUNS=+process.env.RUNS||3, MIN=+process.env.MIN||2;
const P=pool(4); const sols=[];
function partsFor(name){ const g=G[name]; const pref=[...(g.ins||[0,1]),4,5,6,7,2].filter((c,i,a)=>a.indexOf(c)===i); const small=[],big=[];
  for(const b of sh.named){ if(b.name===name||b.bad||!(b.ins||[]).length||/רשימה|ספור|בלי|אמצע|וקטן/.test(b.name)||b.prog.length>60) continue;
    const Q=b.movable===false?[{name:b.name,prog:b.prog,out:b.out??2}]:placements(b,b.prog.length<=20?400:CFG.BIG,pref); (b.prog.length<=20?small:big).push(...Q); }
  return {small,all:[...small,...big]}; }
// שלב 1: פתרונות (עם מיקום כל חלק בתוכם)
for(const name of TASKS){ const g=G[name]; if(!g) continue; const gen=goalFor(name,{ins:g.ins},G); const {small,all}=partsFor(name); const tables=partTables(sh.named.filter(b=>!b.bad)).filter(t=>t.name!==name);
  const ranked=rankParts(gen,all).map(r=>r.p); const smallSet=new Set(small);
  for(let r=0;r<RUNS;r++){ const jobs=CFG.MIX.map(([k,m,l,K],i)=>({pieces:k==='A'?all:k==='S'?small:k==='T'?ranked.slice(0,K||600):k==='B'?[...small,...ranked.filter(q=>!smallSet.has(q)).slice(0,K||300)]:[],width:CFG.W0*m,lab:l??undefined,slice:i===0?CFG.SLICE:0}));
    const res=await P.build(name,{ms:20000,N:8,tables,ins:g.ins??LISTC,lab:CFG.LAB,rules:CFG.RULES,jobs}); if(res.prog&&res.segs) sols.push({name,prog:res.prog,segs:res.segs}); } }
P.close(); console.log(`שלב 1: ${sols.length} פתרונות מ-${TASKS.length} משימות`);
// שלב 2: צירופים — שני חלקים רצופים (עם מה שביניהם), בלי קפיצות שיוצאות מהקטע
const key=p=>p.map(x=>x.join(' ')).join(';'); const combos=new Map();
for(const s of sols){ const named=s.segs.map((g,i)=>({...g,i})).filter(g=>g.name);
  for(let a=0;a+1<named.length;a++){ const A=named[a], B=named[a+1]; const st=A.start, en=B.end; const slice=s.prog.slice(st,en);
    if(slice.some(x=>x[2]==='code'&&(x[1]<st||x[1]>en))) continue; const loc=slice.map(x=>x[2]==='code'?['WHERE',x[1]-st,'code']:x);
    const k=key(loc); const c=combos.get(k)||{prog:loc,names:[A.name,B.name],seen:[]}; c.seen.push({sol:s,st,en}); combos.set(k,c); } }
const common=[...combos.values()].filter(c=>c.seen.length>=MIN).sort((a,b)=>b.seen.length-a.seen.length);
console.log(`שלב 2: ${combos.size} צירופים שונים · ${common.length} חוזרים (${MIN}+ פעמים)`);
// שלב 3: לקצר כל צירוף חוזר כיחידה אחת. «מה הוא צריך לעשות» = אותו זיכרון בסוף, חוץ מתאי-עבודה שהפתרון לא קורא אחר כך
const R16=()=>Array.from({length:16},()=>Math.floor(Math.random()*16));
const pre=(p,pa,aa)=>[['WHERE',pa],['GO'],['WHERE',aa],...p.map(([o,k,c])=>o==='WHERE'?['WHERE',c?k+3:k]:[o])];
const refRun=(p,mem)=>{ const r=runSlow(pre(p,0,0),mem,{maxSteps:20000}); return r&&!r.st.length?r.mem:null; };
function scratchOf(c){ const {sol,st,en}=c.seen[0]; const gen=goalFor(sol.name,{ins:G[sol.name].ins},G); const chk=makeChecker(gen,200); const written=new Set();
  for(let t=0;t<50;t++){ const m=R16(); const o=refRun(c.prog,m); if(o) o.forEach((v,i)=>{ if(v!==m[i]) written.add(i); }); }
  const scratch=[]; for(const cell of written){ let dead=true; for(const d of [(cell+5)&15,(cell+11)&15]){   // «לקלקל» את התא אחרי הצירוף — אם הפתרון עדיין עובר, התא הוא תא-עבודה
      const pert=[['WHERE',d],['GO'],['TAKE'],['WHERE',cell],['GO'],['PUT']]; const q=[...sol.prog.slice(0,en),...pert,...sol.prog.slice(en)].map(x=>x[2]==='code'&&x[1]>en?['WHERE',x[1]+pert.length,'code']:x);
      if(!chk(q)){ dead=false; break; } } if(dead) scratch.push(cell); }
  return scratch; }
const out=[]; for(const c of common.slice(0,+process.env.TOP||6)){ const scratch=scratchOf(c);
  const gen=()=>{ const mem=R16(); const want=refRun(c.prog,mem); return {mem,want:want?want[2]:0,ok:r=>want&&r.every((v,i)=>scratch.includes(i)||v===want[i])}; };
  const chk=makeChecker(gen,300); if(!chk(c.prog)){ console.log(`  ✗ ${c.names.join(' + ')}: הצירוף תלוי במה שקרה לפניו — מדלגים`); continue; }
  let s2; try{ s2=shorten(c.prog,gen,{minutes:+process.env.SHM||1,quiet:1}); }catch(e){ console.log(`  ✗ ${c.names.join(' + ')}: ${e.message}`); continue; }
  console.log(`  ✓ חלק חדש «${c.names.join(' + ')}» (נראה ${c.seen.length} פעמים · תאי-עבודה ${scratch.join(',')||'-'}): ${c.prog.length} ⇒ ${s2.prog.length}`);
  out.push({names:c.names,from:c.prog.length,prog:s2.prog,orig:c.prog,scratch,seen:c.seen.length,uses:c.seen}); }
// שלב 4: להחזיר את החלק המקוצר לתוך הפתרונות, ולבדוק אם יצא קצר מהמדף
const best={}; for(const o of out){ if(o.prog.length>=o.from) continue; for(const u of o.uses){ const {sol,st,en}=u; const d=o.prog.length-(en-st);
    const q=[...sol.prog.slice(0,st).map(x=>x[2]==='code'&&x[1]>=en?['WHERE',x[1]+d,'code']:x),...o.prog.map(x=>x[2]==='code'?['WHERE',x[1]+st,'code']:x),...sol.prog.slice(en).map(x=>x[2]==='code'?['WHERE',x[1]+d,'code']:x)];
    const gen=goalFor(sol.name,{ins:G[sol.name].ins},G); if(!makeChecker(gen,300)(q)) continue; if(!best[sol.name]||q.length<best[sol.name].length) best[sol.name]=q; } }
const shelf=loadShelf(); const report=[];
for(const [name,q] of Object.entries(best)){ const gen=goalFor(name,{ins:G[name].ins},G); let s3; try{ s3=shorten(q,gen,{minutes:+process.env.SHM2||1,quiet:1}).prog; }catch{ s3=q; }
  const fc=finalCheck(s3,gen); const cur=shelf.named.find(b=>b.name===name); report.push(`  ${name}: במדף ${cur?.prog.length} · עם החלק החדש ${s3.length} · בדיקה ${fc.n-fc.bad}/${fc.n}`);
  if(!fc.bad&&cur&&s3.length<cur.prog.length&&process.env.SAVE==='1'){ cur.prog=s3; cur.by='הצורף · עם חלק שהמציא'; } }
console.log('שלב 4:'); report.forEach(l=>console.log(l));
fs.writeFileSync('tzoref-chunks.json',JSON.stringify(out.map(o=>({names:o.names,from:o.from,prog:o.prog,scratch:o.scratch,seen:o.seen}))));
if(process.env.SAVE==='1'){ fs.copyFileSync('shelf3.json','shelf3.before-chunk.json'); fs.writeFileSync('shelf3.json',JSON.stringify(shelf)); }
process.exit(0);
