// הצורף בוחר לעצמו אסטרטגיה: מה כל אחת מ-4 הליבות עושה (אילו חלקים, כמה דרכים ביחד, כמה להקשיב ל«חם/קר»).
// A = כל החלקים · S = רק חלקים קטנים · Z = בלי חלקים (מאטומים). המספר = כפול מ«כמה דרכים» הבסיסי. L = נקודות «חם/קר» משלה.
import fs from 'fs'; import { loadShelf, placements } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; import { partTables } from './tzoref-tables.mjs'; import { pool } from './tzoref-fast.mjs'; import { rankParts, rankPartsNet } from './tzoref-pick.mjs';
const G=goals(); const LISTC=[0,1,8,9,10,11,12,13,14,15]; const CAP=20000; const REPS=+process.env.REPS||3;
const CFG=JSON.parse(fs.readFileSync('tzoref-config.json','utf8'));
const TASKS=['לא (מספר)','לא-וגם (מספרים)','חיבור מספרים','קח מהכתובת שבתא','דלג אם לא-אפס (תא0 אפס ⇒ העתק תא1)','קבוע 1','כפול 2','זוגי?',
  'אם (תא0 לא-אפס ⇒ תא1, אחרת תא3)','הקטן מבין שלושה','הגדול מבין שלושה','הפרש מוחלט','ועוד 3'];
const MIXES=process.env.PICK==='2'?{
  'היום (A1 S10 Z100 Z400)':        [['A',1],['S',10],['Z',100],['Z',400]],
  'קטנים + 300 גדולים נבחרים':      [['B',1,undefined,300],['S',10],['Z',100],['Z',400]],
  'קטנים + 800 גדולים נבחרים':      [['B',1,undefined,800],['S',10],['Z',100],['Z',400]],
  'קטנים+300 · וגם הכל':             [['B',1,undefined,300],['A',1],['Z',100],['Z',400]],
}:process.env.PICK?{
  'היום (A1 S10 Z100 Z400)':        [['A',1],['S',10],['Z',100],['Z',400]],
  'נבחרים 600 במקום הכל':           [['T',1,undefined,600],['S',10],['Z',100],['Z',400]],
  'נבחרים 300 + הכל':               [['T',1,undefined,300],['A',1],['Z',100],['Z',400]],
  'נבחרים 300 + נבחרים 1500 רחב':   [['T',1,undefined,300],['T',3,undefined,1500],['Z',100],['Z',400]],
  'נבחרים 1000 + הכל':              [['T',1,undefined,1000],['A',1],['Z',100],['Z',400]],
}:{
  'היום (A1 S10 Z100 A40)':          [['A',1],['S',10],['Z',100],['A',40]],
  'בלי אטומים (A1 A3 S10 A40)':      [['A',1],['A',3],['S',10],['A',40]],
  'הרבה קטנים (A1 S3 S10 S30)':      [['A',1],['S',3],['S',10],['S',30]],
  'צעדים (A1 A3 A10 A40)':           [['A',1],['A',3],['A',10],['A',40]],
  'רמזים שונים (A1 L8 · A1 L16 · A1 L32 · A10)': [['A',1,8],['A',1,16],['A',1,32],['A',10]],
  'רמזים+גודל (A1 L32 · A3 L16 · S10 · A40)':   [['A',1,32],['A',3,16],['S',10],['A',40]],
  'שני אטומים (A1 S10 Z100 Z400)':   [['A',1],['S',10],['Z',100],['Z',400]],
};
const sh=loadShelf(); const P=pool(4);
function partsFor(name){ const g=G[name]; const pref=[...(g.ins||[0,1]),4,5,6,7,2].filter((c,i,a)=>a.indexOf(c)===i); const small=[], big=[];
  for(const b of sh.named){ if(b.name===name||b.bad||!(b.ins||[]).length||/רשימה|ספור|בלי|אמצע|וקטן/.test(b.name)||b.prog.length>60) continue;
    const Q=b.movable===false?[{name:b.name,prog:b.prog,out:b.out??2}]:placements(b,b.prog.length<=20?400:CFG.BIG,pref); (b.prog.length<=20?small:big).push(...Q); }
  return {small,all:[...small,...big]}; }
async function evalMix(mix){ let total=0, fails=0; const per={};
  for(let r=0;r<REPS;r++) for(const name of TASKS){ const g=G[name]; const {small,all}=partsFor(name); const tables=partTables(sh.named.filter(b=>!b.bad)).filter(t=>t.name!==name);
    const t0=Date.now(); const needT=mix.some(x=>x[0]==='T'||x[0]==='B'); const smallSet=new Set(small); const ranked=needT?(process.env.USENET==='1'?await rankPartsNet(goalFor(name,{ins:g.ins},G),all):rankParts(goalFor(name,{ins:g.ins},G),all)).map(r=>r.p):null;
    const jobs=mix.map(([k,m,l,K],i)=>({pieces:k==='A'?all:k==='S'?small:k==='T'?ranked.slice(0,K||600):k==='B'?[...small,...ranked.filter(q=>!smallSet.has(q)).slice(0,K||300)]:[],width:CFG.W0*m,lab:l,slice:(i===0&&process.env.SL==='1')?(CFG.SLICE||0):0}));
    const res=await P.build(name,{ms:CAP,N:8,tables,ins:g.ins??LISTC,lab:CFG.LAB,rules:CFG.RULES,jobs});
    const dt=Date.now()-t0; const cost=res.prog?dt:CAP*3; if(!res.prog) fails++; total+=cost; per[name]=(per[name]||0)+cost/REPS; }
  return {total:total/REPS,fails:fails/REPS,per}; }
const R={}; for(const [nm,mix] of Object.entries(process.env.ONLY?{[process.env.ONLY]:CFG.MIX}:MIXES)){ R[nm]=await evalMix(mix); console.log(`  ${nm.padEnd(46)} ⇒ ${(R[nm].total/1000).toFixed(1).padStart(6)} שנ׳ · כישלונות ${R[nm].fails.toFixed(2)}`); }
const best=Object.keys(R).sort((a,b)=>R[a].total-R[b].total)[0]; const base=R[Object.keys(R)[0]];
if(!process.env.ONLY) fs.writeFileSync('tzoref-config.json',JSON.stringify({...CFG,MIX:MIXES[best]}));
console.log(`\nסוף: היום ${(base.total/1000).toFixed(1)} שנ׳ ⇒ הצורף בחר «${best}» ${(R[best].total/1000).toFixed(1)} שנ׳ · פי ${(base.total/R[best].total).toFixed(2)}`);
for(const n of TASKS) console.log(`  ${n.slice(0,22).padEnd(22)} ${(base.per[n]/1000).toFixed(2).padStart(6)} ⇒ ${(R[best].per[n]/1000).toFixed(2).padStart(6)}`);
P.close(); process.exit(0);
