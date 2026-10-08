// מסגרת «סנן לפי [תנאי על מספר]»: הולכים על הרשימה עם מצביע (תא 3 = כתובת ה«חוליה» הנוכחית, תא 4 = האיבר),
// ולכל איבר מריצים תנאי-מספר מהמדף: אם מתקיים — מוציאים את האיבר מהשרשרת, אחרת מתקדמים. המכונה בוחרת את התנאי ואת הכיוון (הוצא/השאר).
import fs from 'fs'; import { run } from './machine3s.mjs'; import { placements, makeChecker } from './tzoref.mjs'; import { llGen } from './listlist.mjs';
const walk=m=>{ const o=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ o.push(a); a=m[a]; } return o; };
const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
const usedC=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]));
// הרכבה עם תוויות: מחרוזות 'L:שם' הן תוויות, ['J','שם'] = קפיצה-אם-לא-אפס לתווית
function assemble(parts){ const out=[], lab={}, fix=[]; for(const x of parts){ if(typeof x==='string'){ lab[x]=out.length; continue; } if(x.code){ out.push(...shift(x.code,out.length)); continue; } if(x[0]==='J'){ fix.push([out.length,x[1]]); out.push(null,['JUMP']); continue; } out.push(x); }
  for(const [i,l] of fix) out[i]=['WHERE',lab[l],'code']; return out; }
const T=(c)=>[['WHERE',c],['GO'],['TAKE']], P=(c)=>[['WHERE',c],['GO'],['PUT']];
const PUSH15=[...T(4),['TAKE'],['CALC'],['TAKE'],['CALC']];   // NAND(NAND(x,x),x)=15 — «תמיד»
export function filterFrame(cond,remove){ return assemble([
  ...T(4),['TAKE'],['CALC'],['TAKE'],['CALC'],['SHR'],['SHR'],['SHR'],...P(3),   // תא3 ⇐ 1 (החוליה של ראש-הרשימה)
  'LOOP', ...T(3),['WHERE@'],['GO'],['TAKE'],...P(4),   // x ⇐ mem[p]
  ...T(4),['J','BODY'], ...PUSH15,['J','EXIT'],
  'BODY', {code:[['WHERE',0],['GO']]}, {code:cond}, ...T(2),['J',remove?'UNLINK':'ADV'], ...PUSH15,['J',remove?'ADV':'UNLINK'],
  'ADV', ...T(4),...P(3), ...PUSH15,['J','LOOP'],   // p ⇐ x
  'UNLINK', ...T(4),['WHERE@'],['GO'],['TAKE'], ...T(3),['WHERE@'],['GO'],['PUT'], ...PUSH15,['J','LOOP'],   // mem[p] ⇐ mem[x]
  'EXIT' ]); }
export function filterCompose(gen){ const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const chk=makeChecker(gen,300,600000); const ex=Array.from({length:100},()=>gen());
  const okOn=p=>ex.every(e=>{ const r=run(p,e.mem,{maxSteps:600000}); return r&&!r.st.length&&e.ok(r.mem); });
  const conds=[]; for(const b of sh.named){ if((b.ins||[]).length!==1||b.prog.length>80||b.prog.some(x=>x[0]==='WHERE@')) continue; for(const q of placements(b,6000)){ if(q.ins.join()!=='4'||q.out!==2) continue; const U=usedC(q.prog); if([...U].some(c=>![2,4,5,6,7].includes(c))) continue; conds.push({name:b.name,prog:q.prog}); break; } }
  for(const c of conds) for(const remove of [true,false]){ const p=filterFrame(c.prog,remove); if(okOn(p)&&chk(p)) return {prog:p,how:`סנן: ${remove?'הוצא':'השאר רק'} איברים ש[${c.name}]`,nc:conds.length}; }
  return {prog:null,nc:conds.length}; }
if((process.argv[1]||'').endsWith('filtcomp.mjs')){
  const TASKS=[['בלי הזוגיים',l=>l.filter(x=>x%2)],['רק הזוגיים',l=>l.filter(x=>x%2===0)],['בלי הגדולים מ-12',l=>l.filter(x=>x<=12)],['רק הגדולים מ-12',l=>l.filter(x=>x>12)],['בלי ה-8 וה-15',l=>l.filter(x=>x!==8&&x!==15)]];
  for(const [name,f] of TASKS){ const gen=llGen(f); const t0=Date.now(); const r=filterCompose(gen); let bad=null; if(r.prog){ bad=0; for(let k=0;k<20000;k++){ const e=gen(); const z=run(r.prog,e.mem,{maxSteps:600000}); if(!z||z.st.length||!e.ok(z.mem)) bad++; } }
    console.log(`${r.prog&&!bad?'✓':'✗'} ${name}: ${r.prog?r.prog.length+' פקודות · '+r.how+' · בדיקה-עצמאית '+bad+' שגויים מ-20000':'לא נמצא'} · תנאים ${r.nc} · ${((Date.now()-t0)/1000).toFixed(0)} שנ׳`); }
  process.exit(0); }
