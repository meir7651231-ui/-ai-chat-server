// «סינון נסתר + פעולה-אחרי» (postop): התשובה = מיפוי( קיפול( רק האיברים שבקבוצה נסתרת S ) ).
//   קיפול = הולכים על הרשימה בלי לשנות אותה (מצביע בתא 3, איבר בתא 4, צובר בתא 5/6):
//           צובר ⇐ התחלה (0 או 15); לכל איבר x שעובר את התנאי: צובר ⇐ OP(צובר, x)  או  צובר ⇐ U(צובר).
//   OP / U — כלים מהמדף (לפי לוח-הכפל שלהם). התנאי — מהמדף (בשני הכיוונים) או נלמד. המיפוי-אחרי — זהות / מהמדף / שניים מהמדף / נלמד
//   (הטבלה שלו עולה מהדוגמאות: אם התשובה היא פונקציה של ערך-הקיפול — זו הטבלה). כך גם «ריקה ⇒ 0» במקום «ריקה ⇒ 15».
//   ועוד: שני קיפולים (על שתי קבוצות) מחוברים בפעולה מהמדף — למשל ספירה על א פחות ספירה על ב.
// המכונה בוחרת הכל מהדוגמאות; כאן כתובים רק המסגרת והחיפוש.
import fs from 'fs'; import { run } from './machine3s.mjs'; import { makeChecker, shorten, movable, placements } from './tzoref.mjs';
import { partTables } from './tzoref-tables.mjs'; import { valueBuild } from './tzoref-value.mjs'; import { filterFrame } from './filtcomp.mjs';
const R=k=>Math.floor(Math.random()*k); const walk=m=>{ const o=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ o.push(a); a=m[a]; } return o; };
const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
const usedC=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]));
const T=c=>[['WHERE',c],['GO'],['TAKE']], P=c=>[['WHERE',c],['GO'],['PUT']], Z=[['WHERE',0],['GO']];
const PUSH15=[...T(0),['TAKE'],['CALC'],['TAKE'],['CALC']], PUSH0=[...T(0),['SHR'],['SHR'],['SHR'],['SHR']], PUSH1=[...PUSH15,['SHR'],['SHR'],['SHR']];
const pc8=S=>{ let c=0; for(let b=0;b<8;b++) if(S>>b&1) c++; return c; }; const setOf=S=>[8,9,10,11,12,13,14,15].filter(x=>S>>(x-8)&1);
const say=(...a)=>{ if(!process.env.POQUIET) console.log(...a); };
// הרכבה עם תוויות (כמו במסגרת-הסינון): מחרוזת = תווית, ['J',תווית] = קפוץ-אם-לא-אפס
function assemble(parts){ const out=[], lab={}, fix=[]; for(const x of parts){ if(typeof x==='string'){ lab[x]=out.length; continue; } if(x.code){ out.push(...shift(x.code,out.length)); continue; } if(x[0]==='J'){ fix.push([out.length,x[1]]); out.push(null,['JUMP']); continue; } out.push(x); }
  for(const [i,l] of fix) out[i]=['WHERE',lab[l],'code']; return out; }
// לוחות-כפל של המדף — פעם אחת לכל כלי (נשמר בזיכרון; כלי חדש ⇒ רק הוא מחושב)
const TBC=new Map(); const tkey=b=>b.name+'|'+b.prog.length;
function tablesOf(sh){ const need=sh.named.filter(b=>!b.bad&&!TBC.has(tkey(b))); if(need.length){ const got=partTables(need); for(const b of need) TBC.set(tkey(b),got.find(t=>t.name===b.name)||null); }
  return sh.named.filter(b=>!b.bad).map(b=>{ const t=TBC.get(tkey(b)); return t&&!t.partial?{...t,len:b.prog.length,at:b.prog.some(x=>x[0]==='WHERE@')}:null; }).filter(Boolean); }
// שיבוץ כלי בתאים נתונים; מבין השיבוצים — זה שנוגע הכי מעט בתאים «חיים»
function place(b,ins,out,live=[]){ let best=null, bs=1e9; for(const q of placements(b,6000)){ if(q.ins.join()!==ins.join()||q.out!==out) continue; const U=usedC(q.prog); if([...U].some(c=>c>=8)) continue;
    const s=live.filter(c=>U.has(c)&&!ins.includes(c)&&c!==out).length; if(s<bs){ bs=s; best=q.prog; if(!s) break; } } return best; }
const saveAround=(q,ins,live)=>{ const U=usedC(q); const s=live.filter(c=>U.has(c)&&!ins.includes(c)&&c!==2); return [s.flatMap(c=>T(c)),[...s].reverse().flatMap(c=>P(c))]; };
// מסגרת-הקיפול: לא משנה את הרשימה. cond = תנאי משובץ (קלט 4 ⇒ 2) או null; keep = «עובר» כשהתנאי לא-אפס
function foldParts(id,{cond,keep=true,op,k,c,A,extra=[]}){ const live=[1,3,4,A,...extra], L=s=>id+s;
  const parts=[...(c?PUSH15:PUSH0),...P(A),...PUSH1,...P(3),
    L('LOOP'),...T(3),['WHERE@'],['GO'],['TAKE'],...P(4),   // x ⇐ mem[p]
    ...T(4),['J',L('BODY')],...PUSH15,['J',L('EXIT')], L('BODY')];
  if(cond){ const [pre,post]=saveAround(cond,[4],live); parts.push(...pre,{code:Z},{code:cond},...post,...T(2),['J',keep?L('DO'):L('ADV')],...PUSH15,['J',keep?L('ADV'):L('DO')]); }
  const ins=k===2?[A,4]:[A]; const [pre,post]=saveAround(op,ins,live);
  parts.push(L('DO'),...pre,{code:Z},{code:op},...post,...T(2),...P(A),   // צובר ⇐ OP(צובר, x)
    L('ADV'),...T(4),...P(3),...PUSH15,['J',L('LOOP')], L('EXIT'));   // p ⇐ x
  return parts; }
// ערך-הקיפול בדוגמה (לפי לוח-הכפל של הכלי)
const foldVal=(F,S,l)=>{ let a=F.c; for(const x of l) if(S>>(x-8)&1) a=F.k===2?F.T[a*16+x]:F.T[a]; return a; };
// תנאי לקבוצה S: כלי מהמדף שעל 8..15 «לא-אפס» בדיוק ב-S (keep) או בדיוק מחוץ ל-S (skip)
function condFromShelf(S,TB){ let best=null; for(const t of TB){ if(t.k!==1) continue; let m=0; for(let x=8;x<16;x++) if(t.T[x]) m|=1<<(x-8); if(m!==S&&m!==(~S&255)) continue; if(!best||t.at<best.at||(t.at===best.at&&t.len<best.len)) best={name:t.name,keep:m===S,len:t.len,at:t.at}; } return best; }
// מיפוי-אחרי: זהות / כלי אחד מהמדף / שניים ברצף
function postFromShelf(map,TB){ const dom=[...Array(16).keys()].filter(v=>map[v]>=0); if(dom.every(v=>map[v]===v)) return {kind:'id'};
  const U=TB.filter(t=>t.k===1).sort((a,b)=>(a.at-b.at)||(a.len-b.len)); for(const t of U) if(dom.every(v=>t.T[v]===map[v])) return {kind:'one',a:t.name};
  for(const a of U) for(const b of U) if(dom.every(v=>b.T[a.T[v]]===map[v])) return {kind:'two',a:a.name,b:b.name}; return null; }
const mapName=map=>'מיפוי: '+[...Array(16).keys()].filter(v=>map[v]>=0).map(v=>v+'→'+map[v]).join(',');
// לימוד כלי חדש עם קלט אחד (תא 0 ⇒ תא 2) מטבלה; נשמר במדף + מטרה (כמו התנאים של הסינון הנסתר)
const FAILED=new Set(), LOCAL=new Map(); let DEADLINE=Infinity;   // DEADLINE: סוף הזמן של הבנייה הנוכחית — לימוד לא מתחיל בלי מספיק זמן   // LOCAL: כלי שנלמד ועבד, אבל לא נכנס למדף (מחוץ לתחום הוא תלוי בזבל) — משמש רק כאן
function learnTool(name,dom,f,{ms=90000,by}){ if(FAILED.has(name)) return null; if(LOCAL.has(name)) return LOCAL.get(name); const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const old=sh.named.find(b=>b.name===name); if(old) return old;
  const gen=()=>{ const mem=Array.from({length:16},()=>R(16)); mem[0]=dom[R(dom.length)]; const w=f(mem[0]); const k=mem[0]; return {mem,want:w,ok:r=>r[2]===w&&r[0]===k}; };
  const left=DEADLINE-Date.now()-20000; if(left<25000){ say(`    … אין זמן ללמוד: ${name}`); return null; }
  const t0=Date.now(); const v=valueBuild(gen,{name,ins:[0],out:2,ms:Math.min(ms,left)}); if(!v.prog){ FAILED.add(name); say(`    ✗ לא נלמד: ${name} (${((Date.now()-t0)/1000).toFixed(0)}s)`); return null; }
  let s=v.prog; try{ s=shorten(v.prog,gen,{minutes:Math.min(+process.env.POSHORT||0.5,Math.max(0.05,(DEADLINE-Date.now()-15000)/60000)),quiet:9}).prog; }catch{}
  // הטבלה המלאה (16 קלטים) — בתחום: מהדוגמאות; מחוץ לתחום: מה שהכלי עושה (נרשם, כדי שהביקורת תבדוק אותו)
  const tt=[]; for(let x=0;x<16;x++){ let y=null; for(let t=0;t<4;t++){ const m=Array.from({length:16},()=>R(16)); m[0]=x; const r=run(s,m,{maxSteps:20000}); const o=r&&!r.st.length&&r.mem[0]===x?r.mem[2]:-1; if(y==null) y=o; else if(y!==o) y=-1; } tt.push(y); }
  const b={name,prog:s,ins:[0],out:2,by}; if(tt.every(y=>y>=0)&&dom.every(x=>tt[x]===f(x))){ const S2=JSON.parse(fs.readFileSync('shelf3.json','utf8')); b.movable=movable(s,gen); S2.named.push(b); fs.writeFileSync('shelf3.json',JSON.stringify(S2));
    const G=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); G[name]={ins:[0],tt,dom}; fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(G)); } else LOCAL.set(name,b);
  say(`    ✓ נלמד: ${name} · ${s.length} פקודות (${((Date.now()-t0)/1000).toFixed(0)}s)`); return b; }
const condTT=S=>Array.from({length:16},(_,x)=>x>=8&&(S>>(x-8)&1)?15:0);
function getCond(S,TB){ const c=condFromShelf(S,TB); if(c) return c; const name='תנאי: '+setOf(S).join(','); const tt=condTT(S);
  const b=learnTool(name,[...Array(16).keys()],x=>tt[x],{ms:90000,by:'נלמד: פעולה-אחרי (תנאי)'}); return b?{name,keep:true,len:b.prog.length}:null; }
function getPost(map,TB){ const s=postFromShelf(map,TB); if(s) return s; const dom=[...Array(16).keys()].filter(v=>map[v]>=0); const name=mapName(map);
  const b=learnTool(name,dom,x=>map[x],{ms:60000,by:'נלמד: פעולה-אחרי (מיפוי)'}); return b?{kind:'one',a:name}:null; }
const shelfB=name=>LOCAL.get(name)||JSON.parse(fs.readFileSync('shelf3.json','utf8')).named.find(b=>b.name===name);
function postParts(post,A){ if(post.kind==='id') return [...T(A),...P(2)];
  const pa=place(shelfB(post.a),[A],2); if(!pa) return null; if(post.kind==='one') return [{code:Z},{code:pa}];
  const pb=place(shelfB(post.b),[3],2); if(!pb) return null; return [{code:Z},{code:pa},...T(2),...P(3),{code:Z},{code:pb}]; }
function oneFold(id,S,F,cond,A,extra,opName=F.name){ const op=place(shelfB(opName),F.k===2?[A,4]:[A],2,[1,3,4,A,...extra]); if(!op) return null;
  let cq=null; if(cond){ cq=place(shelfB(cond.name),[4],2,[1,3,4,A,...extra]); if(!cq) return null; } return foldParts(id,{cond:cq,keep:cond?cond.keep:true,op,k:F.k,c:F.c,A,extra}); }
export async function postOpCompose(gen,{N=240,NB=3000,ms=+process.env.POMS||200000,combos=true,stage3=!process.env.PONO3}={}){ const t0=Date.now(), DEAD=t0+ms; DEADLINE=DEAD;
  const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const TB=tablesOf(sh).sort((a,b)=>(a.at-b.at)||(a.len-b.len));   // כלי עם «לאן מהמחסנית» (כתובת מחושבת) — אחרון: בשיבוץ לתאים אחרים הוא נשבר
  const ex=Array.from({length:N},()=>gen()), Ls=ex.map(e=>walk(e.mem)), want=ex.map(e=>e.want&15);
  // משפחת-הקיפולים: כל כלי עם 2 קלטים (OP) ועם קלט אחד שאינו קבוע (U), התחלה 0 או 15; כפילויות (אותו לוח) — פעם אחת
  const folds=[], sig=new Map(); for(const t of TB){ if(t.k===1&&new Set(t.T).size===1) continue; for(const c of [0,15]){ const k=t.k+':'+t.T.join(',')+':'+c; if(sig.has(k)){ sig.get(k).alts.push(t.name); continue; } const F={k:t.k,T:t.T,name:t.name,c,len:t.len,alts:[t.name]}; sig.set(k,F); folds.push(F); } }
  // «מחיר»: מה צריך ללמוד. תנאי חדש = טבלה של 8 כן/לא; מיפוי חדש = טבלה של d ערכים (כל ערך 4 ביטים) — יקר יותר ככל שהתחום גדול
  const condCost=S=>S===255?0:condFromShelf(S,TB)?1:5;
  const postCost=map=>{ const p=postFromShelf(map,TB); const d=map.filter(x=>x>=0).length; return p?{id:0,one:1,two:2}[p.kind]+0.01*d:2+1.2*d; };
  const cands=[];
  // שלב 1: קבוצה × קיפול — האם התשובה היא פונקציה של ערך-הקיפול?
  for(let S=1;S<256;S++) for(const F of folds){ const map=new Int8Array(16).fill(-1); let ok=true; for(let i=0;i<N;i++){ const v=foldVal(F,S,Ls[i]); if(map[v]<0) map[v]=want[i]; else if(map[v]!==want[i]){ ok=false; break; } } if(!ok) continue;
    if(map.filter(x=>x>=0).length<2) continue;   // ערך-קיפול קבוע — לא מסביר כלום
    cands.push({kind:1,S,F,map:Array.from(map),cost:condCost(S)+postCost(Array.from(map))+0.5+(F.c?0.1:0)+F.len/1000+pc8(S)/1000}); }
  // שלב 2: שני קיפולים ⇒ פעולה מהמדף. מילון של כל וקטורי-הקיפול, ו«פתרון לאחור»: לכל וקטור א ופעולה — איזה וקטור ב חייב להיות
  if(combos&&Date.now()<DEAD){ const dict=new Map(); const vecs=[];
    for(let S=1;S<256;S++){ const cc=condCost(S); for(const F of folds){ const v=new Uint8Array(N); for(let i=0;i<N;i++) v[i]=foldVal(F,S,Ls[i]); if(v.every(x=>x===v[0])) continue; const key=Buffer.from(v).toString('latin1'); const cost=cc+0.5+(F.c?0.1:0)+F.len/1000+pc8(S)/1000;
      const o=dict.get(key); if(!o){ const r={S,F,v,cost}; dict.set(key,r); vecs.push(r); } else if(cost<o.cost) Object.assign(o,{S,F,cost}); } }
    const B2=TB.filter(t=>t.k===2); const need=new Uint8Array(N);
    for(const op of B2){ if(Date.now()>DEAD) break; const I=new Int16Array(512).fill(-1); for(let x=0;x<16;x++) for(let w=0;w<16;w++){ let y=-1,n=0; for(let c=0;c<16;c++) if(op.T[x*16+c]===w){ y=c; n++; } I[x*16+w]=n===1?y:-1; let y2=-1,n2=0; for(let c=0;c<16;c++) if(op.T[c*16+x]===w){ y2=c; n2++; } I[256+x*16+w]=n2===1?y2:-1; }
      for(const a of vecs) for(const side of [0,1]){ let ok=true; for(let i=0;i<N;i++){ const y=I[side*256+a.v[i]*16+want[i]]; if(y<0){ ok=false; break; } need[i]=y; } if(!ok) continue;
        const b=dict.get(Buffer.from(need).toString('latin1')); if(!b||b===a) continue;
        // side 0: תשובה = op(א, ב) ; side 1: תשובה = op(ב, א)
        const [f1,f2]=side?[b,a]:[a,b]; cands.push({kind:2,f1:{S:f1.S,F:f1.F},f2:{S:f2.S,F:f2.F},op:op.name,cost:f1.cost+f2.cost-(f1.S===f2.S?condCost(f1.S):0)+1+op.len/1000}); } } }   // אותה קבוצה פעמיים = תנאי אחד
  cands.sort((a,b)=>a.cost-b.cost); say(`  מועמדים: ${cands.filter(c=>c.kind===1).length} קיפול+מיפוי · ${cands.filter(c=>c.kind===2).length} שני-קיפולים · ${((Date.now()-t0)/1000).toFixed(1)}s`);
  // אישור על הרבה דוגמאות חדשות (בלי להריץ את המכונה) — ואז בונים: תנאים / מיפוי (מהמדף או נלמדים), מרכיבים, ובודקים
  const big=Array.from({length:NB},()=>gen()), BL=big.map(e=>walk(e.mem)); const chk=makeChecker(gen,300,600000); const tried=new Set();
  const tryCand=cd=>{ const key=cd.kind===1?`1|${cd.S}|${cd.F.name}|${cd.F.c}`:cd.kind===2?`2|${cd.f1.S}|${cd.f1.F.name}|${cd.f1.F.c}|${cd.f2.S}|${cd.f2.F.name}|${cd.f2.F.c}|${cd.op}`:`3|${cd.S}|${cd.v.name}`; if(tried.has(key)) return null; tried.add(key);
    let p=null, how='';
    if(cd.kind===3){ const r=V3.build(cd,chk); if(r) return r; }
    else if(cd.kind===1){ const map=cd.map.slice(); let ok=true; for(let i=0;i<NB&&ok;i++){ const v=foldVal(cd.F,cd.S,BL[i]), w=big[i].want&15; if(map[v]<0) map[v]=w; else if(map[v]!==w) ok=false; } if(!ok) return null;
      const cond=cd.S===255?null:getCond(cd.S,TB); if(cd.S!==255&&!cond) return null; const post=getPost(map,tablesOf(JSON.parse(fs.readFileSync('shelf3.json','utf8')))); if(!post) return null;
      const pp=postParts(post,5); if(!pp) return null; let opn=cd.F.name;
      for(const alt of cd.F.alts.slice(0,4)){ const fp=oneFold('A',cd.S,cd.F,cond,5,[],alt); if(!fp) continue; const q=assemble([...fp,...pp]); if(chk(q)){ p=q; opn=alt; break; } }   // אותו לוח, כלי אחר — אם הראשון נשבר בשיבוץ
      how=`קיפול [${opn}, התחלה ${cd.F.c}] על ${cd.S===255?'כל האיברים':`[${cond.keep?'':'לא '}${cond.name}]`} ⇒ ${post.kind==='id'?'כמו שהוא':post.kind==='one'?post.a:post.a+' ⇒ '+post.b}`; }
    else { const op=TB.find(t=>t.name===cd.op); let ok=true; for(let i=0;i<NB&&ok;i++){ const a=foldVal(cd.f1.F,cd.f1.S,BL[i]), b=foldVal(cd.f2.F,cd.f2.S,BL[i]); if(op.T[a*16+b]!==(big[i].want&15)) ok=false; } if(!ok) return null;
      const c1=cd.f1.S===255?null:getCond(cd.f1.S,TB); if(cd.f1.S!==255&&!c1) return null; const c2=cd.f2.S===255?null:getCond(cd.f2.S,TB); if(cd.f2.S!==255&&!c2) return null;
      const o=place(shelfB(cd.op),[5,6],2); if(!o) return null; const used={};
      outer: for(const n1 of cd.f1.F.alts.slice(0,3)) for(const n2 of cd.f2.F.alts.slice(0,3)){ const a=oneFold('A',cd.f1.S,cd.f1.F,c1,5,[],n1), b=oneFold('B',cd.f2.S,cd.f2.F,c2,6,[5],n2); if(!a||!b) continue; const q=assemble([...a,...b,{code:Z},{code:o}]); if(chk(q)){ p=q; used[1]=n1; used[2]=n2; break outer; } }
      const nm=(f,c,i)=>`[${used[i]||f.F.name}, התחלה ${f.F.c}] על ${f.S===255?'הכל':`[${c.keep?'':'לא '}${c.name}]`}`; how=`${cd.op}( קיפול ${nm(cd.f1,c1,1)} , קיפול ${nm(cd.f2,c2,2)} )`; }
    if(p) return {prog:p,how}; say(`    ✗ הורכב ונכשל בבודק: ${key}`); return null; };
  // שלב 3: כלי-מספר מהמדף (V, לא קיפול) על הרשימה המסוננת — מסגרת-הסינון של הסינון הנסתר, ואחריו מיפוי.
  //   הגילוי שלו מריץ את המכונה (יקר) — לכן הוא נכנס לאותו תור-מחירים רק כשהזול ביותר בשלבים 1–2 דורש ללמוד משהו (מחיר ≥ 5), ואחרת רק בסוף
  let V3=null; const disc3=()=>{ if(V3||!stage3||Date.now()>DEAD) return []; V3=shelfVDiscover(gen,TB,Math.min(DEAD,Date.now()+(+process.env.POV3MS||60000))); return V3.cands.map(c=>({...c,kind:3})); };
  const run1=list=>{ for(const cd of list){ if(Date.now()>DEAD) return {prog:null,timeout:true}; const r=tryCand(cd); if(r) return {...r,via:`עלות ${cd.cost.toFixed(2)}`,ms:Date.now()-t0}; } return null; };
  if(!cands.length||cands[0].cost>=5){ cands.push(...disc3()); cands.sort((a,b)=>a.cost-b.cost); }
  let r=run1(cands); if(r) return r; r=run1(disc3()); if(r) return r;
  return {prog:null,ms:Date.now()-t0}; }
const relink=(m,l)=>{ const q=m.slice(); for(let c=8;c<16;c++) q[c]=0; q[1]=l[0]||0; l.forEach((a,i)=>{ q[a]=l[i+1]||0; }); return q; };
function shelfVDiscover(gen,TB,DEAD,{N=80,NB=400}={}){ const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8'));
  const V=sh.named.filter(b=>!b.bad&&b.prog.some(x=>x[0]==='WHERE@')&&b.prog.length<=200&&!/^(בלי|רק) |הפוך|מיין/.test(b.name));
  const ex=Array.from({length:N+NB},()=>gen()), Ls=ex.map(e=>walk(e.mem)); const cache=new Map();
  const val=(v,i,S)=>{ const l=Ls[i].filter(x=>S>>(x-8)&1); const k=v.name+'|'+l.join(','); if(cache.has(k)) return cache.get(k); const r=run(v.prog,relink(ex[i].mem,l),{maxSteps:600000}); const y=r&&!r.st.length?r.mem[2]&15:-1; cache.set(k,y); return y; };
  const consistent=(v,S,from,to,map)=>{ for(let i=from;i<to;i++){ const y=val(v,i,S); if(y<0) return false; const w=ex[i].want&15; if(map[y]<0) map[y]=w; else if(map[y]!==w) return false; } return true; };
  const cands=[]; for(let S=1;S<255;S++){ if(Date.now()>DEAD) break; for(const v of V){ const map=new Int8Array(16).fill(-1); if(!consistent(v,S,0,N,map)) continue; if(map.filter(x=>x>=0).length<2) continue;
      const pf=postFromShelf(Array.from(map),TB); cands.push({S,v,map:Array.from(map),cost:(condFromShelf(S,TB)?1:5)+(pf?{id:0,one:1,two:2}[pf.kind]:2+1.2*map.filter(x=>x>=0).length)+0.5+v.prog.length/1000}); } }
  say(`  שלב 3 (כלי-מדף על רשימה מסוננת): ${cands.length} מועמדים`);
  const build=(cd,chk)=>{ const map=Int8Array.from(cd.map); if(!consistent(cd.v,cd.S,N,N+NB,map)) return null;
    const cond=getCond(cd.S,TB); if(!cond) return null; const post=getPost(Array.from(map),tablesOf(JSON.parse(fs.readFileSync('shelf3.json','utf8')))); if(!post) return null;
    const cq=place(shelfB(cond.name),[4],2,[0,1,3,4]); if(!cq) return null; const ff=filterFrame(cq,!cond.keep); let p=[...ff,...Z,...shift(cd.v.prog,ff.length+2)];
    if(post.kind!=='id'){ const pp=postParts(post,3); if(!pp) return null; p=assemble([{code:p},...T(2),...P(3),...pp]); }
    return chk(p)?{prog:p,how:`סנן: השאר רק [${cond.keep?'':'לא '}${cond.name}] ⇒ ${cd.v.name} ⇒ ${post.kind==='id'?'כמו שהוא':post.kind==='one'?post.a:post.a+' ⇒ '+post.b}`}:null; };
  return {cands,build}; }
