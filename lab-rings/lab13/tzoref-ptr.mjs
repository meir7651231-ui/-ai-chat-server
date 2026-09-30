// «בונה-חצים»: משימות שמשנות רשימה (הפוך…). הצורף מקבל 4 פעולות קטנות על תאים:
//   העתק (תא א ⇐ תא ב) · עקוב (תא א ⇐ החץ של האיבר שבתא ב) · שנה-חץ (החץ של האיבר שבתא א ⇐ תא ב) · אפס (תא א ⇐ 0)
// ומחפש: פעולה לפני הלולאה, 1–4 פעולות בכל סיבוב («כל עוד תא ג לא אפס»), ופעולה בסוף. בודק כל צירוף ישר על הדוגמאות.
import { makeChecker } from './tzoref.mjs';
const REGS=[1,2,3];
const OPS=[]; for(const i of REGS){ OPS.push({t:'zero',i}); for(const j of REGS){ if(i!==j) OPS.push({t:'copy',i,j}); OPS.push({t:'load',i,j}); if(i!==j) OPS.push({t:'store',i,j}); } }
const name=o=>o.t==='zero'?`תא${o.i}⇐0`:o.t==='copy'?`תא${o.i}⇐תא${o.j}`:o.t==='load'?`תא${o.i}⇐חץ(תא${o.j})`:`חץ(תא${o.i})⇐תא${o.j}`;
function exec(ops,m){ for(const o of ops){ if(o.t==='zero') m[o.i]=0; else if(o.t==='copy') m[o.i]=m[o.j]; else if(o.t==='load') m[o.i]=m[m[o.j]&15]; else m[m[o.i]&15]=m[o.j]; } }
function simulate(init,body,cond,fin,mem){ const m=mem.slice(); exec(init,m); let k=0; while(m[cond]!==0){ if(++k>12) return null; exec(body,m); } exec(fin,m); return m; }
export function ptrBuild(gen,{maxBody=4,N=24,ms=60000}={}){ const t0=Date.now(); const ex=Array.from({length:N},()=>gen());
  const INITS=[[],...OPS.filter(o=>o.t==='zero'||o.t==='copy').map(o=>[o])]; const FINS=[[],...OPS.filter(o=>o.t==='copy'&&o.i===1).map(o=>[o])];
  const V=Array.from({length:400},()=>gen()); const verify=(init,body,cond,fin)=>V.every(e=>{ const r=simulate(init,body,cond,fin,e.mem); return r&&e.ok(r); });   // עובר במקרה על 24? — בודקים על 400 חדשות
  let tried=0; const ok=(init,body,cond,fin)=>{ for(const e of ex){ tried++; const r=simulate(init,body,cond,fin,e.mem); if(!r||!e.ok(r)) return false; } return true; };
  for(let L=1;L<=maxBody;L++){ const idx=new Array(L).fill(0);
    while(true){ const body=idx.map(k=>OPS[k]);
      // גיזום: בכל סיבוב חייבים לעקוב אחרי חץ, ולשנות את תא-התנאי
      if(body.some(o=>o.t==='load')) for(const cond of REGS){ if(!body.some(o=>o.t!=='store'&&o.i===cond)) continue;
        for(const init of INITS) for(const fin of FINS){ if(ok(init,body,cond,fin)&&verify(init,body,cond,fin)) return {init,body,cond,fin,tried,ms:Date.now()-t0}; } }
      if(Date.now()-t0>ms) return {tried,ms:Date.now()-t0};
      let p=L-1; while(p>=0&&++idx[p]===OPS.length){ idx[p]=0; p--; } if(p<0) break; } }
  return {tried,ms:Date.now()-t0}; }
// הפיכה לתוכנית במכונה
const P=s=>s.split(';').map(x=>x.trim()).filter(Boolean).map(x=>{ const [o,a]=x.split(' '); return a==null?[o]:[o,+a]; });
const code=o=>P(o.t==='zero'?`WHERE ${o.i}; GO; TAKE; TAKE; CALC; TAKE; CALC; PUT; TAKE; TAKE; CALC; PUT`:o.t==='copy'?`WHERE ${o.j}; GO; TAKE; WHERE ${o.i}; GO; PUT`:
  o.t==='load'?`WHERE ${o.j}; GO; TAKE; WHERE@; GO; TAKE; WHERE ${o.i}; GO; PUT`:`WHERE ${o.j}; GO; TAKE; WHERE ${o.i}; GO; TAKE; WHERE@; GO; PUT`);
export function ptrCompile(r){ const init=r.init.flatMap(code), body=r.body.flatMap(code), fin=r.fin.flatMap(code);
  // התחלה · קפוץ לבדיקה · גוף · בדיקה: אם תא-התנאי לא אפס ⇒ לגוף · סוף
  const pre=[...init,...P('TAKE; TAKE; CALC; TAKE; CALC')]; const bodyAt=pre.length+2, testAt=bodyAt+body.length;
  return [...pre,['WHERE',testAt,'code'],['JUMP'],...body,...P(`WHERE ${r.cond}; GO; TAKE`),['WHERE',bodyAt,'code'],['JUMP'],...fin]; }
export const showP=r=>`לפני: ${r.init.map(name).join(', ')||'-'} · כל עוד תא${r.cond}≠0: ${r.body.map(name).join(', ')} · בסוף: ${r.fin.map(name).join(', ')||'-'}`;
if(import.meta.url==='file://'+process.argv[1]){ const { goals, goalFor }=await import('./tzoref-goals.mjs'); const G=goals();
  for(const nm of process.argv.slice(2)){ const gen=goalFor(nm,{},G); const r=ptrBuild(gen); if(!r.body){ console.log(`✗ ${nm}: לא נמצא (${(r.tried/1e6).toFixed(1)} מיליון בדיקות, ${(r.ms/1000).toFixed(1)} שנ׳)`); continue; }
    const prog=ptrCompile(r); const pass=makeChecker(gen,300)(prog);
    console.log(`${pass?'✓':'✗'} ${nm}: ${showP(r)} · ${prog.length} פקודות · ${(r.tried/1e6).toFixed(1)} מיליון בדיקות · ${(r.ms/1000).toFixed(1)} שנ׳`); } }
