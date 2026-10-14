// «מיפוי-מקומות» (permmap.mjs, KEY=perm): רשימה ⇒ רשימה שבה האיבר במקום i של הפלט הוא האיבר שבמקום p(n,i) של הקלט
//   (n = אורך הקלט). החלפת זוגות, היפוך כל חצי, שזירת חצאים, החלפת הקצוות, היפוך שלושת הראשונים, העמוד האחרון, החצי הראשון…
// המכונה מסיקה מהדוגמאות בלבד (הערכים שונים ⇒ המקום של כל איבר-פלט בקלט יחיד):
//   m(n)   = אורך הפלט לכל אורך-קלט (חייב להיות פונקציה של n),
//   p(n,i) = המקום בקלט של האיבר ה-i בפלט (חייב להיות פונקציה של n ו-i).
// החריצים — מתמלאים מהדוגמאות, בלי שום דבר מהמשימה בקוד:
//   m: «אותו אורך» (m=n, ברירת-המסגרת) · כלי חד-מקומי מהמדף שהטבלה שלו מתאימה · בונה-הערכים (valueBuild) על טבלת m שנלמדה.
//   p: כלי מהמדף (קלט אחד או שניים, מוזן מ-n ומ-i) שהטבלה שלו מתאימה · בונה-הערכים עם שני קלטים על טבלת p שנלמדה.
// המסגרת (שלד שכתבנו): אורך n ⇒ m=M(n) ⇒ לכל i<m: p=P(n,i), הולכים p חוליות מהראש, דוחפים את האיבר למחסנית (הרשימה לא משתנה
//   בשלב הזה) ⇒ מחברים מחדש מהסוף להתחלה (שולפים, «הבא» = מה שנשלף קודם) ⇒ הראש = הראשון. רשימה ריקה ⇒ ריקה.
//   מצב המסגרת נשמר במחסנית סביב כל כלי (ראש, n, i, m, ותאי-רשימה שהכלי נוגע בהם).
// רמה 1 (אם רמה 0 לא עקבית): צעד בטוח-לשרשרת מהמדף לפני המיפוי (הכלים של רצף-מקום: מיין, הפוך…) — רק אם הפלט תמיד
//   תת-קבוצה של הקלט ואורכו פונקציה של n (מסנן זול; אחרת המשפחה לא מתאימה והשלב חוזר תוך פחות משנייה).
import fs from 'fs'; import { run } from './machine3s.mjs'; import { makeChecker } from './tzoref.mjs'; import { valueBuild, show } from './tzoref-value.mjs';
import { runFastG, encodeG, walk, walkA, Z, shift, relocate } from './chainsafe.mjs'; import { assemble } from './posframes.mjs'; import { stepTools, pickExamplesFor, seqProg } from './poscompose.mjs';
import { deepRelocOk, repairJumps } from './jumpfix.mjs';
const R=k=>Math.floor(Math.random()*k); const J=JSON.stringify; const NMAX=8, PADN=14;
const usedC=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]));
// עזרי-מסגרת (כמו ב-posframes/pickat): T = דחוף תא, P = שים בתא, AT = לך לכתובת שבתא, GOTO = קפיצה תמיד, JNE = קפוץ אם a≠b (תא 6 = עזר)
const T=c=>[['WHERE',c],['GO'],['TAKE']], P=c=>[['WHERE',c],['GO'],['PUT']], AT=c=>[...T(c),['WHERE@'],['GO']];
const PUSH15=[...T(4),['TAKE'],['CALC'],['TAKE'],['CALC']], PUSH1=[...PUSH15,['SHR'],['SHR'],['SHR']], PUSH0=[...PUSH15,...PUSH15,['CALC']];
const GOTO=l=>[...PUSH15,['J',l]];
const JNE=(a,b,l)=>[...T(a),...T(b),['CALC'],...P(6),...T(a),...T(6),['CALC'],...T(b),...T(6),['CALC'],['CALC'],['J',l]];
// תאים: 1 = ראש · 3 = n · 4 = i · 7 = m · 5 = מצביע · 6 = מונה/עזר · 0, 2 = קלט/תשובה של הכלים
const FR={n:3,i:4};
// קריאה לכלי: שומרים במחסנית את מצב המסגרת (1,3,4,7) ואת תאי-הרשימה שהכלי נוגע בהם (כולם אם «לאן מהמחסנית»);
//   מעתיקים את הארגומנטים (n / i) לתאי-הקלט של הכלי, מריצים, מחזירים. התשובה בתא 2.
function callTool(tool,ins,args,fr=FR){ const u=usedC(tool), any=tool.some(x=>x[0]==='WHERE@');
  const save=[...new Set([1,3,4,7,...[8,9,10,11,12,13,14,15].filter(c=>any||u.has(c))])].sort((a,b)=>a-b);
  return [...save.flatMap(c=>T(c)), ...args.flatMap(a=>T(fr[a])), ...[...ins].reverse().flatMap(c=>P(c)), {code:Z}, {code:tool}, ...[...save].reverse().flatMap(c=>P(c))]; }
// «מהסוף» (כמו בסינון-לפי-מקום): vi ⇒ הכלי מקבל את המקום-בפלט מהסוף, j = m-1-i (בתא 5) · vo ⇒ הכלי עונה מקום-בקלט מהסוף, p = n-1-q.
//   חיסור בלי כלי: a-1-b = a + לא(b) (לא = לא-וגם של b עם עצמו).
const NOTPLUS=(a,b)=>[...T(a),...T(b),...T(b),['CALC'],['ADD']];
// המסגרת. p = {prog,ins,args}; m = null (m=n) או {prog,ins,args}
export function permFrame(p,m){ const vi=!!p.vi, vo=!!p.vo; return assemble([
    ...PUSH0,                                                     // סמן-תחתית מתחת לאיברי-הפלט
    ...PUSH0,...P(3), ...T(1),...P(5),
    'LEN', ...T(5),['J','LN'], ...GOTO('LEND'),
    'LN', ...T(3),...PUSH1,['ADD'],...P(3), ...AT(5),['TAKE'],...P(5), ...GOTO('LEN'),
    'LEND', ...(m?[...callTool(m.prog,m.ins,m.args),...T(2),...P(7)]:[...T(3),...P(7)]),
    ...PUSH0,...P(4),
    'LOOP', ...JNE(4,7,'BODY'), ...GOTO('LINK'),
    'BODY', ...(vi?[...NOTPLUS(7,4),...P(5)]:[]), ...callTool(p.prog,p.ins,p.args,vi?{n:3,i:5}:FR), ...(vo?[...NOTPLUS(3,2),...P(6)]:[...T(2),...P(6)]), ...T(1),...P(5),
    'WALK', ...T(6),['J','W1'], ...GOTO('WEND'),
    'W1', ...T(5),['J','W2'], ...GOTO('WEND'),
    'W2', ...AT(5),['TAKE'],...P(5), ...T(6),...PUSH15,['ADD'],...P(6), ...GOTO('WALK'),
    'WEND', ...T(5),['J','KEEP'], ...GOTO('LINK'),                // מעבר לסוף (0) ⇒ מפסיקים לקרוא
    'KEEP', ...T(5), ...T(4),...PUSH1,['ADD'],...P(4), ...GOTO('LOOP'),
    'LINK', ...PUSH0,...P(5),
    'L1', ...P(7), ...T(7),['J','L2'], ...GOTO('LDONE'),
    'L2', ...T(5),...AT(7),['PUT'], ...T(7),...P(5), ...GOTO('L1'),
    'LDONE', ...T(5),...P(1) ]); }

// הסקת הטבלאות מזוגות (רשימה, פלט). null = לא מהמשפחה.
export function inferTables(lists,outs){ const M=Array(NMAX+1).fill(null), Pt=Array.from({length:NMAX+1},()=>Array(NMAX+1).fill(null));
  for(let k=0;k<lists.length;k++){ const l=lists[k], o=outs[k], n=l.length; if(n>NMAX||o.length>n||new Set(o).size!==o.length) return null;   // איברי-פלט שונים זה מזה (אחרת אין רשימה מקושרת)
    if(M[n]===null) M[n]=o.length; else if(M[n]!==o.length) return null;
    for(let i=0;i<o.length;i++){ const p=l.indexOf(o[i]); if(p<0) return null; if(Pt[n][i]===null) Pt[n][i]=p; else if(Pt[n][i]!==p) return null; } }
  if(!M.some((m,n)=>m!==null&&m>0)) return null; return {M,Pt}; }
// מסנן זול לרמה 1: הפלט תמיד מאיברי הקלט, ואורכו נקבע רק לפי n
function subsetByLen(lists,outs){ const M=Array(NMAX+1).fill(null); for(let k=0;k<lists.length;k++){ const l=lists[k], o=outs[k], n=l.length; if(n>NMAX) return false; if(M[n]===null) M[n]=o.length; else if(M[n]!==o.length) return false; if(o.some(x=>!l.includes(x))) return false; } return true; }
const tabKey=(t,which)=>which==='m'?'m:'+t.M.join(','):'p:'+t.Pt.map((r,n)=>r.slice(0,t.M[n]??0).join('.')).join('|');
const permDomain=t=>{ const d=[]; for(let n=0;n<=NMAX;n++) for(let i=0;i<(t.M[n]??0);i++) if(t.Pt[n][i]!==null) d.push([n,i]); return d; };

// כלים מהמדף: קלט אחד או שניים (תאים 0..7), תשובה בתא 2, נייד (relocate). הטבלה נבדקת רק על הנקודות שנדרשות.
function shelfTools(sh){ const out=[]; for(const b of sh.named){ if(b.bad||(b.out??2)!==2) continue; const ins=b.ins||[]; if(!ins.length||ins.length>2||ins.some(c=>c>7)||b.prog.length>400) continue;
    const prog=relocate(b.prog); if(!prog) continue; out.push({name:b.name,prog,ins,code:encodeG([...Z,...shift(prog,Z.length)])}); }
  return out.sort((a,b)=>a.prog.length-b.prog.length); }
// האם הכלי (עם מיפוי-ארגומנטים) נותן את הערך הנדרש בכל נקודה; 2 ניסיונות עם זיכרון אקראי
function fitsTool(t,args,pts){ for(const [vals,w] of pts) for(let k=0;k<2;k++){ const m=Array.from({length:16},()=>R(16)); t.ins.forEach((c,j)=>{ m[c]=vals[args[j]]; }); const r=runFastG(t.code,m,0,20000); if(!r||(r[2]&15)!==w) return false; } return true; }
const ARGS={1:[['i'],['n']],2:[['n','i'],['i','n']]};
function shelfFind(tools,pts,argSets){ for(const t of tools) for(const args of (argSets||ARGS[t.ins.length])) if(fitsTool(t,args,pts)) return {name:t.name,prog:t.prog,ins:t.ins,args}; return null; }

// בונה-הערכים על טבלה שנלמדה (קלט: תא 0 = n, תא 1 = i). מחזיר {prog,ins,args,name} או null.
function learnTable(pts,ins,args,name,ms,say){ const gen=()=>{ const [vals,w]=pts[R(pts.length)]; const mem=Array.from({length:16},()=>R(16)); ins.forEach((c,j)=>{ mem[c]=vals[args[j]]; }); const keep=ins.map(c=>mem[c]); return {mem,want:w,ok:r=>r[2]===w&&ins.every((c,j)=>r[c]===keep[j])}; };
  say(`  לומד ${name} (בונה-ערכים, ${pts.length} נקודות)…`); const v=valueBuild(gen,{name,ins,out:2,ms}); if(!v.prog) return null; const prog=relocate(v.prog); if(!prog) return null;
  // בדיקה ישירה על כל הנקודות
  const code=encodeG([...Z,...shift(prog,Z.length)]); for(const [vals,w] of pts) for(let k=0;k<3;k++){ const m=Array.from({length:16},()=>R(16)); ins.forEach((c,j)=>{ m[c]=vals[args[j]]; }); const r=runFastG(code,m,0,40000); if(!r||(r[2]&15)!==w) return null; }
  return {name:`${name}=${show(v.expr)}`,prog,ins,args}; }

export async function permCompose(gen,{ms=+process.env.PERMMS||150000,steps=true,say=()=>{}}={}){ const T0=Date.now(), DEAD=T0+ms;
  const EX=Array.from({length:2500},()=>gen()); const outs=EX.map(e=>JSON.parse(e.want)); const lists0=EX.map(e=>walk(e.mem));
  if(!outs.every(o=>Array.isArray(o))) return {prog:null,why:'הפלט אינו רשימה'};
  if(lists0.every((l,i)=>J(l)===J(outs[i]))) return {prog:null,why:'אין שינוי'};
  const cands=[]; const t0=inferTables(lists0,outs); if(t0) cands.push({chain:[],tabs:t0});
  if(!t0&&steps&&subsetByLen(lists0,outs)){   // רמה 1: צעד מהמדף ואז מיפוי
    const ex=pickExamplesFor(gen,5); const {tools}=stepTools(ex,{say}); const N=700;
    for(const t of tools){ if(Date.now()>DEAD-20000) break; const lists=[]; let ok=true; for(let k=0;k<N;k++){ const m=runFastG(t.P,EX[k].mem,PADN,300000); if(!m){ ok=false; break; } lists.push(walkA(m)); } if(!ok) continue;
      const tb=inferTables(lists,outs.slice(0,N)); if(tb) cands.push({chain:[t],tabs:tb}); }
    say(`  רמה 1: ${tools.length} צעדים ⇒ ${cands.length} מיפויים עקביים`); }
  if(!cands.length) return {prog:null,why:'לא מיפוי-מקומות'};
  const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const tools=shelfTools(sh); const chk=makeChecker(gen,300,600000); const more=Array.from({length:300},()=>gen());
  const verify=p=>{ for(const e of more){ const r=run(p,e.mem,{maxSteps:600000}); if(!r||r.st.length||!e.ok(r.mem)) return null; } if(!chk(p)) return null;
    if(deepRelocOk(p,gen)) return p; const f=repairJumps(p,gen); return f&&deepRelocOk(f,gen)&&chk(f)?f:null; };
  const cache=new Map(); let nLearn=0;
  const slotM=async tb=>{ if(tb.M.every((m,n)=>m===null||m===n)) return {same:true}; const key=tabKey(tb,'m'); if(cache.has(key)) return cache.get(key);
    const pts=tb.M.map((m,n)=>m===null?null:[{n},m]).filter(Boolean); let s=shelfFind(tools.filter(t=>t.ins.length===1),pts,[['n']]);
    if(!s&&Date.now()<DEAD-5000&&nLearn<6){ nLearn++; s=learnTable(pts,[0],['n'],'אורך-פלט לפי אורך',Math.min(60000,DEAD-Date.now()-3000),say); }
    cache.set(key,s); return s; };
  // p: ארבע «קואורדינטות» (מההתחלה/מהסוף, בפלט ובקלט) — קודם המדף בכולן, אחר כך בונה-הערכים בכל אחת (תקציב מתחלק)
  const VARS=process.env.PERMVARS?JSON.parse(process.env.PERMVARS):[[0,0],[1,1],[0,1],[1,0]];   // PERMVARS: לבדיקות בלבד
  const slotP=async tb=>{ const key=tabKey(tb,'p'); if(cache.has(key)) return cache.get(key); const dom=permDomain(tb);
    const ptsOf=([vi,vo])=>dom.map(([n,i])=>[{n,i:vi?tb.M[n]-1-i:i},vo?n-1-tb.Pt[n][i]:tb.Pt[n][i]]);
    let s=null; for(const v of VARS){ s=shelfFind(tools,ptsOf(v)); if(s){ s={...s,vi:v[0],vo:v[1]}; break; } }
    for(let k=0;!s&&k<VARS.length;k++){ if(Date.now()>DEAD-5000||nLearn>=8) break; nLearn++; const v=VARS[k]; const left=DEAD-Date.now()-3000;
      s=learnTable(ptsOf(v),[0,1],["n","i"],`מקום${v[1]?"-מהסוף":""} לפי אורך ומקום${v[0]?"-מהסוף":""}`,Math.min(+process.env.PERMVMS||45000,left/(VARS.length-k)),say); if(s) s={...s,vi:v[0],vo:v[1]}; }
    cache.set(key,s); return s; };
  for(const c of cands){ if(Date.now()>DEAD) return {prog:null,timeout:true,cands:cands.length};
    const m=await slotM(c.tabs); if(!m) continue; const p=await slotP(c.tabs); if(!p) continue;
    const fr=permFrame(p,m.same?null:m); const pre=seqProg(c.chain); const prog=pre.length?[...pre,...Z,...shift(fr,pre.length+Z.length)]:fr;
    const ok=verify(prog); if(!ok){ say('  נכשל באימות: '+[...c.chain.map(s=>s.name),p.name].join(' ⇒ ')); continue; }
    const how=[...c.chain.map(s=>s.name),`מיפוי-מקומות [אורך: ${m.same?'כמו הקלט':m.name}] [מקום: ${p.name}${p.args?' ('+p.args.join(',')+')':''}${p.vi?' · i מהסוף':''}${p.vo?' · p מהסוף':''}]`].join(' ⇒ ');
    return {prog:ok,how,cands:cands.length,ms:Date.now()-T0}; }
  return {prog:null,cands:cands.length,ms:Date.now()-T0}; }

if((process.argv[1]||'').endsWith('permmap.mjs')){ const { llGen }=await import('./listlist.mjs'); const { finalCheck }=await import('./tzoref.mjs');
  const file=process.argv[2]; const only=process.argv[3]?new Set(process.argv[3].split('|')):null; const S=[];
  for(const f of file.split(',')) for(const t of JSON.parse(fs.readFileSync(f,'utf8')).tasks) if(t.kind==='list2list'&&(!only||only.has(t.name))) S.push(t);
  let ok=0; for(const t of S){ const gen=llGen(new Function('return ('+t.src+')')()); const t0=Date.now(); const r=await permCompose(gen,{say:process.env.V?console.log:()=>{}}); const sec=(Date.now()-t0)/1000;
    let fc=null, dr=null; if(r.prog){ fc=finalCheck(r.prog,gen,20000).bad; dr=deepRelocOk(r.prog,gen,{n:200}); } const good=!!r.prog&&fc===0&&dr; if(good) ok++;
    console.log(`${good?'✓':'✗'} ${t.name}: ${r.prog?`${r.prog.length} פקודות · ${r.how} · בדיקה-סופית ${fc}/20000 · נייד ${dr}`:'לא נמצא'+(r.why?' ('+r.why+')':'')} · ${sec.toFixed(1)} שנ׳`); }
  console.log(`סך: ${ok}/${S.length}`); process.exit(0); }
