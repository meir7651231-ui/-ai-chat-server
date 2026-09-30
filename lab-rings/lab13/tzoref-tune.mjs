// הצורף מכוון את עצמו: מנסה הגדרות שונות על משימות שכבר פתר, מודד זמן כולל, ושומר את הטובה ביותר.
// כפתורים: W0 (כמה שומרים בשלב — ושאר הליבות פי 10/100/40 ממנו) · LAB (כמה נקודות ל«חלק אחד מהתשובה») · BIG (שיבוצים לחלק גדול) · RULES (רשימה שחורה).
// כישלון = עונש (פי 3 מהזמן המקסימלי). כל הגדרה נמדדת פעמיים (הדוגמאות אקראיות) — לוקחים את הממוצע.
import fs from 'fs'; import { loadShelf, placements, movable } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; import { partTables } from './tzoref-tables.mjs'; import { pool } from './tzoref-fast.mjs';
const G=goals(); const LISTC=[0,1,8,9,10,11,12,13,14,15]; const CAP=20000;
const TASKS=['לא (מספר)','לא-וגם (מספרים)','חיבור מספרים','קח מהכתובת שבתא','דלג אם לא-אפס (תא0 אפס ⇒ העתק תא1)','קבוע 1','כפול 2','זוגי?',
  'אם (תא0 לא-אפס ⇒ תא1, אחרת תא3)','הקטן מבין שלושה','הגדול מבין שלושה','הפרש מוחלט','ועוד 3'];
const sh=loadShelf(); const P=pool(4);
function partsFor(name,BIG){ const g=G[name]; const pref=[...(g.ins||[0,1]),4,5,6,7,2].filter((c,i,a)=>a.indexOf(c)===i); const small=[], big=[];
  for(const b of sh.named){ if(b.name===name||b.bad||!(b.ins||[]).length||/רשימה|ספור|בלי|אמצע|וקטן/.test(b.name)||b.prog.length>60) continue;
    // «בלי רמאות»: לא נותנים ללבנה חלקים שנבנו ממנה עצמה (כמו «הגדול מבין שלושה» ⇒ לא מקבל את עצמו)
    const P=b.movable===false?[{name:b.name,prog:b.prog}]:placements(b,b.prog.length<=20?400:BIG,pref); (b.prog.length<=20?small:big).push(...P); }
  return {small,all:[...small,...big]}; }
const REPS=+process.env.REPS||2;
async function evalCfg(cfg,reps=REPS){ let total=0, fails=0; const per={};
  for(let r=0;r<reps;r++) for(const name of TASKS){ const g=G[name]; const {small,all}=partsFor(name,cfg.BIG); const tables=partTables(sh.named.filter(b=>!b.bad)).filter(t=>t.name!==name);
    const t0=Date.now(); const res=await P.build(name,{ms:CAP,N:8,tables,ins:g.ins??LISTC,lab:cfg.LAB,rules:cfg.RULES,
      jobs:[{pieces:all,width:cfg.W0},{pieces:small,width:cfg.W0*10},{pieces:[],width:cfg.W0*100},{pieces:all,width:cfg.W0*40}]});
    const dt=Date.now()-t0; const cost=res.prog?dt:CAP*3; if(!res.prog) fails++; total+=cost; per[name]=(per[name]||0)+cost/reps; }
  return {total:total/reps,fails:fails/reps,per}; }
const ROUND2=process.env.ROUND2==='1';
const knobs=ROUND2?{LAB:[6,8,10,12,16],W0:[100,150,200,300],BIG:[120,200,300]}:{W0:[200,500,1000,2000],LAB:[3,5,8],BIG:[60,200],RULES:[true,false]};
const START=ROUND2?JSON.parse(fs.readFileSync('tzoref-config.json','utf8')):{W0:500,LAB:5,BIG:200,RULES:true};
let best={...START}; const tried=new Map(); const key=c=>JSON.stringify(c);
const score=async(c)=>{ if(!tried.has(key(c))){ const r=await evalCfg(c); tried.set(key(c),r); console.log(`  ${key(c)} ⇒ ${(r.total/1000).toFixed(1)} שנ׳ · כישלונות ${r.fails}`); } return tried.get(key(c)); };
console.log('נקודת התחלה (ההגדרות שלי):'); let bestR=await score(best);
for(const [k,vals] of Object.entries(knobs)){ console.log(`כפתור ${k}:`); for(const v of vals){ const c={...best,[k]:v}; const r=await score(c); if(r.total<bestR.total){ best=c; bestR=r; } } console.log(`  ⇒ הכי טוב עד עכשיו: ${key(best)} (${(bestR.total/1000).toFixed(1)} שנ׳)`); }
const base=tried.get(key(START));
if(ROUND2){ console.log('בדיקת השוואה — ההגדרות הישנות (שלי) באותם סיבובים:'); const old=await score({W0:500,LAB:5,BIG:200,RULES:true}); console.log(`  ישן ${(old.total/1000).toFixed(1)} ⇒ חדש ${(bestR.total/1000).toFixed(1)} שנ׳ · פי ${(old.total/bestR.total).toFixed(2)}`); }
fs.writeFileSync('tzoref-config.json',JSON.stringify(best));
console.log(`\nסוף: ההגדרות שלי ${(base.total/1000).toFixed(1)} שנ׳ ⇒ מה שהצורף בחר ${(bestR.total/1000).toFixed(1)} שנ׳ · פי ${(base.total/bestR.total).toFixed(2)}`);
console.log('לכל משימה (לפני ⇒ אחרי, שנ׳):'); for(const n of TASKS) console.log(`  ${n.slice(0,22).padEnd(22)} ${(base.per[n]/1000).toFixed(2).padStart(6)} ⇒ ${(bestR.per[n]/1000).toFixed(2).padStart(6)}`);
P.close(); process.exit(0);
