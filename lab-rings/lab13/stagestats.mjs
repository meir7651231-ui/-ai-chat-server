// המכונה לומדת כמה זמן לתת לכל שיטת-חיפוש — מהניסיון של עצמה (stage-stats.jsonl: שלב, הצליח?, שניות).
//   שלב שהצליח (5 פעמים ויותר): תקציב = פי 2 מהזמן הארוך ביותר שבו הצליח אי-פעם (+5 שנ׳), לא פחות מדקה ולא יותר מברירת-המחדל.
//   שלב שלא הצליח אף פעם (אחרי 15 ניסיונות ויותר): 20 שנ׳ — עדיין מנסים, אבל לא שורפים דקות. פחות מ-5 הצלחות ⇒ ברירת-המחדל. STAGEOFF=1 מכבה.
import fs from 'fs';
const FILE='stage-stats.jsonl';
export const STAGE_ENV={'בונה-ערכים':'VMS','מסגרת-לולאה':'LOOPMS','פיצול-מקרים':'CASEMS','קיפול+מיפוי':'POMS','סריקה-עם-זיכרון':'SCANMS','סינון-נסתר':'HFMS','בחירה-במקום':'PICKMS','מצב-רחב':'WIDEMS',
  'רצף-מקום':'POSMS','אם-רשימה':'IFPMS','מסגרות-סריקה':'CUTMS','מסגרות-החלטה':'IFMS','מיון-לפי-מפתח':'KSMS','אם-אחרת':'IFEMS','חלונות':'WINMS','סידור-מקומי':'REARRMS','חמדני':'GREEDYMS','מצב-רחב-2':'WIDE2MS','סינון-סטטיסטי':'SSMS','זוגות':'PAIRMS','רצפים-וקטעים':'RUNSMS','הליכה-בצעד':'WALKMS','שותפים-וצירופים':'TUPMS','דירוג-ומחלקות':'RANKMS'};   // fam-judge: שלבים חדשים (מיפוי-מקומות במכוון לא רשום ⇒ תמיד 150 שנ׳)
export const STAGE_DEFAULT={RUNSMS:120000,WALKMS:120000,TUPMS:150000,RANKMS:180000,WINMS:120000,REARRMS:150000,GREEDYMS:120000,VMS:90000,LOOPMS:60000,CASEMS:280000,POMS:150000,SCANMS:150000,HFMS:300000,PICKMS:150000,WIDEMS:120000,POSMS:200000,IFPMS:150000,CUTMS:150000,IFMS:240000,KSMS:240000,IFEMS:285000,WIDE2MS:120000,SSMS:150000,PAIRMS:120000};
let H=null; const load=()=>{ if(H) return H; H={}; try{ for(const l of fs.readFileSync(FILE,'utf8').split('\n')){ if(!l) continue; const r=JSON.parse(l); (H[r.stage]=H[r.stage]||[]).push(r); } }catch{} return H; };
export function learnedBudget(stage){ if(process.env.STAGEOFF) return null; const obs=load()[stage]; if(!obs) return null;
  const wins=obs.filter(o=>o.ok).map(o=>o.sec); if(!wins.length) return obs.length>=15?20000:null;   // לא הצליח אף פעם ב-15 ניסיונות ⇒ 20 שנ׳
  if(wins.length<5) return null;   // מעט מדי הצלחות כדי ללמוד מהן ⇒ ברירת-המחדל
  return Math.max(60000,Math.ceil(2*Math.max(...wins)+5)*1000); }   // לפחות דקה: לשלבים יש שוליים פנימיים (בדיקה סופית)
export function record(stage,ok,sec,kind){ try{ fs.appendFileSync(FILE,JSON.stringify({stage,ok,sec,kind})+'\n'); (load()[stage]=load()[stage]||[]).push({stage,ok,sec,kind}); }catch{} }
// זריעה מהיסטוריית ריצות קודמות (שדה tried של שורות-מבחן)
if((process.argv[1]||'').endsWith('stagestats.mjs')){ const out=[]; for(const f of process.argv.slice(2)) for(const l of fs.readFileSync(f,'utf8').trim().split('\n')){ const r=JSON.parse(l); for(const t of r.tried||[]){ const m=t.match(/^(.+?)([✓✗])\((\d+)s\)/); if(m) out.push(JSON.stringify({stage:m[1],ok:m[2]==='✓',sec:+m[3],kind:r.kind})); } }
  fs.writeFileSync(FILE,out.join('\n')+'\n'); H=null; const h=load(); for(const [s,o] of Object.entries(h)) console.log(s.padEnd(18),'n',o.length,'wins',o.filter(x=>x.ok).length,'budget',learnedBudget(s)); }
