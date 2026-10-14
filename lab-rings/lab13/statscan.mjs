// «סינון-סטטיסטי» (statscan.mjs, KEY=statfilt): רשימה ⇒ רשימה — מסגרות שהחריצים שלהן מתמלאים מהדוגמאות בלבד.
//   הקשר לכל איבר x: x · הבא · הקודם (המקורי) · זה-שלפניו · המקום · סטטיסטיקות של כל הרשימה (כלי רשימה⇒מספר מהמדף, מחושבים פעם אחת לפני ההליכה)
//     · «ערך-רשימה של x» (כלי מהמדף שמקבל מספר ואת הרשימה, למשל «ספור גדולים מ-X»).
//   מסגרות (אני כותב רק את השלד): סנן · קח-כל-עוד · דלג-כל-עוד · פרוסה-בין-סמנים (מהסמן הראשון עד הסמן הבא) ·
//     זוגות (לכל זוג סמוך: להשאיר את הראשון? את השני?) · «יש-קודם» (הוצא x אם יש לפניו איבר שנשאר שעומד ביחס R איתו) ·
//     «הזוג-הראשון» (הזוג הראשון y לפני x שעומד ביחס R ⇒ [y, x]).
//   החיפוש: מהדוגמאות — מה קרה לכל איבר (תוויות), ואז צירוף של עד 3 ערכי-הקשר שהתווית היא פונקציה שלהם (עקבית וסגורה);
//     התנאי — כלי מהמדף (חד/דו/תלת-מקומי, בכל סדר, ישר או הפוך), ואם אין — הטבלה נבנית ע"י בונה-הערכים ונשמרת במדף (רק אם הפתרון כולו עבר).
//   ביחס R (יש-קודם / הזוג-הראשון) התוויות לא ישירות: «הוצא» = יש לפחות אחד — המכונה מסיקה מאפסים ודאיים ומ«מועמד יחיד».
import fs from 'fs'; import crypto from 'crypto'; import { run } from './machine3s.mjs'; import { makeChecker, finalCheck, movable } from './tzoref.mjs';
import { valueBuild, show as showExpr } from './tzoref-value.mjs'; import { runFastG, encodeG, walk, walkA, shift, chainSafeLN } from './chainsafe.mjs';
import { assemble } from './posframes.mjs'; import { codeNum } from './wideframes.mjs'; import { scanTools, dataCells, remap } from './scan-tools.mjs'; import { pickExamplesFor } from './poscompose.mjs'; import { lenOk } from './ladder-order.mjs';
const R=k=>Math.floor(Math.random()*k); const J=JSON.stringify;
const T=c=>[['WHERE',c],['GO'],['TAKE']], P=c=>[['WHERE',c],['GO'],['PUT']], MV=(a,b)=>[...T(a),...P(b)], AT=c=>[...T(c),['WHERE@'],['GO']];
const PUSH15=[...T(4),['TAKE'],['CALC'],['TAKE'],['CALC']], PUSH1=[...PUSH15,['SHR'],['SHR'],['SHR']], PUSH0=[...PUSH15,...PUSH15,['CALC']];
const GOTO=l=>[...PUSH15,['J',l]]; const ZC={code:[['WHERE',0],['GO']]};
const usedC=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]));
const LISTV=[8,9,10,11,12,13,14,15];
let UID=0;
// ─── 1. אבני-השלד ────────────────────────────────────────────────────────────
// קריאה לכלי: שומרים במחסנית את תאי-המסגרת (ותאי-הרשימה) שהכלי נוגע בהם, מעתיקים את הקלטים לתאי-הקלט שלו, מריצים; התשובה ⇒ תא 2; משחזרים.
export function callTool(tool,args,frame){ const any=tool.prog.some(x=>x[0]==='WHERE@'), u=usedC(tool.prog); const save=[...frame,...LISTV].filter(c=>c!==2&&(any||u.has(c)));
  return [...save.flatMap(T), ...args.flatMap(c=>T(c)), ...[...tool.ins].reverse().flatMap(c=>P(c)), ZC,{code:tool.prog}, ...((tool.out??2)!==2?MV(tool.out,2):[]), ...[...save].reverse().flatMap(P)]; }
const ZERO=c=>[...PUSH0,...P(c)];
const INC=c=>[...T(c),...PUSH1,['ADD'],...P(c)];
// ערכי-הקשר: x בתא 4, השאר בתאים 5,6,7 (מצב / סטטיסטיקה / זמני)
const FR=[1,3,4,5,6,7];
function alloc(feats){ const need=[]; const add=k=>{ if(!need.includes(k)) need.push(k); };
  for(const f of feats){ if(f.kind==='x') continue; if(f.kind==='p2') add('p1'); add(f.key); }
  if(need.length>3) return null; const cell={x:4}; need.forEach((k,i)=>{ cell[k]=5+i; }); return cell; }
// קוד-ההכנה: סטטיסטיקות (כל אחת: הכלי ⇒ תא 2 ⇒ מחסנית; בסוף — לתאים), מצבים ⇐ 0
//   סטטיסטיקה נגזרת (dstat): סטטיסטיקות-המקור ⇒ תאים 5.. ⇒ פעולה (מהמדף או נלמדת) ⇒ מחסנית
export function statCode(f){ if(f.kind==='stat') return [ZC,{code:f.prog},...T(2)];
  const cs=f.subs.map((_,j)=>5+j); return [...f.subs.flatMap(statCode), ...[...cs].reverse().flatMap(c=>P(c)), ...callTool(f.op,cs,[1]), ...T(2)]; }
const statLike=f=>f.kind==='stat'||f.kind==='dstat';
function prelude(feats,cell){ const st=feats.filter(statLike); const code=[];
  for(const s of st) code.push(...statCode(s)); for(const s of [...st].reverse()) code.push(...P(cell[s.key]));
  for(const k of ['p1','p2','i']) if(cell[k]!=null) code.push(...ZERO(cell[k]));
  return code; }
// לכל איבר: ערכים זמניים (הבא, ערך-רשימה של x), התנאי ⇒ תא 2, ואז עדכון המצבים
function bodyCode(feats,cell,cond){ const code=[];
  for(const f of feats){ if(f.kind==='nx') code.push(...AT(4),['TAKE'],...P(cell.nx)); else if(f.kind==='perx') code.push(...callTool({prog:f.prog,ins:f.ins,out:f.out},f.args.map(a=>a==='x'?4:a),FR),...MV(2,cell[f.key])); }
  code.push(...callTool(cond,feats.map(f=>cell[f.kind==='x'?'x':f.key]),FR));
  if(cell.p2!=null) code.push(...MV(cell.p1,cell.p2)); if(cell.p1!=null) code.push(...MV(4,cell.p1)); if(cell.i!=null) code.push(...INC(cell.i));
  return code; }
const XLOAD=[...AT(3),['TAKE'],...P(4)];                                       // x ⇐ mem[p]
const ADV=[...MV(4,3)];                                                          // p ⇐ x
const UNLINK=[...AT(4),['TAKE'],...AT(3),['PUT']];                               // mem[p] ⇐ mem[x]
const CUTP=[...PUSH0,...AT(3),['PUT']];                                          // mem[p] ⇐ 0
const CUTX=[...PUSH0,...AT(4),['PUT']];                                          // mem[x] ⇐ 0
// מסגרות סריקה: filter / take / drop / slice. neg: התנאי «מתקיים» כשהתשובה 0.
export function scanFrame({mode,feats,cond,neg=false,sl={a:1,b:1}}){ const cell=alloc(feats); if(!cell) return null; const u=++UID; const L=s=>s+u;
  const parts=[...prelude(feats,cell), ...PUSH1,...P(3)];
  const branch=(tT,tF)=>[...T(2),['J',neg?tF:tT],...GOTO(neg?tT:tF)];
  if(mode==='slice'){
    parts.push(L('LOOP0'),...XLOAD,...T(4),['J',L('B0')],...GOTO(L('EXIT')), L('B0'),...bodyCode(feats,cell,cond),...branch(L('START'),L('UN0')),
      L('UN0'),...UNLINK,...GOTO(L('LOOP0')),
      L('START'),...(sl.a?ADV:UNLINK),
      L('LOOP1'),...XLOAD,...T(4),['J',L('B1')],...GOTO(L('EXIT')), L('B1'),...bodyCode(feats,cell,cond),...branch(L('END'),L('ADV1')),
      L('ADV1'),...ADV,...GOTO(L('LOOP1')),
      L('END'),...(sl.b?CUTX:CUTP),
      L('EXIT')); return assemble(parts); }
  const tgt={filter:['UN','AD'],take:['CUT','AD'],drop:['UN','EXIT']}[mode];
  parts.push(L('LOOP'),...XLOAD,...T(4),['J',L('BODY')],...GOTO(L('EXIT')), L('BODY'),...bodyCode(feats,cell,cond),...branch(L(tgt[0]),L(tgt[1])),
    L('AD'),...ADV,...GOTO(L('LOOP')),
    L('UN'),...UNLINK,...GOTO(L('LOOP')));
  if(mode==='take') parts.push(L('CUT'),...CUTP);
  parts.push(L('EXIT')); return assemble(parts); }
// זוגות: a = mem[p] (תא 4), b = mem[a] (תא 5). condA(a,b) ⇒ הוצא את a; condB(a,b) ⇒ הוצא את b. אין b ⇒ b=0 (רק condA)
export function pairFrame({cA,cB,negA=false,negB=false}){ const u=++UID; const L=s=>s+u; const F=[1,3,4,5];
  const br=(c,neg,tT,tF)=>[...callTool(c,[4,5].slice(0,c.ins.length),F),...T(2),['J',neg?tF:tT],...GOTO(neg?tT:tF)];
  return assemble([...PUSH1,...P(3),
    L('LOOP'),...XLOAD,...T(4),['J',L('BODY')],...GOTO(L('EXIT')),
    L('BODY'),...AT(4),['TAKE'],...P(5), ...br(cA,negA,L('RA'),L('KA')),
    L('RA'),...T(5),...AT(3),['PUT'],...GOTO(L('B')),
    L('KA'),...ADV,
    L('B'),...T(5),['J',L('BB')],...GOTO(L('EXIT')),
    L('BB'),...br(cB,negB,L('RB'),L('KB')),
    L('RB'),...AT(5),['TAKE'],...AT(3),['PUT'],...GOTO(L('LOOP')),
    L('KB'),...MV(5,3),...GOTO(L('LOOP')),
    L('EXIT')]); }
// קפוץ אם תא a ≠ תא b (תא 7 = עזר): XOR מלא-וגם
const JNE=(a,b,l)=>[...T(a),...T(b),['CALC'],...P(7),...T(a),...T(7),['CALC'],...T(b),...T(7),['CALC'],['CALC'],['J',l]];
// «יש-קודם»: לכל x — y הולך מראש הרשימה (שכבר סוננה) עד x; R(y,x) ⇒ הוצא את x. first: «הזוג-הראשון» ⇒ [y, x] ועצור (אין ⇒ ריקה).
export function relFrame({rel,neg=false,order='yx',first=false}){ const u=++UID; const L=s=>s+u; const F=[1,3,4,5]; const args=order==='yx'?[5,4]:[4,5];
  const parts=[...PUSH1,...P(3),
    L('LOOP'),...XLOAD,...T(4),['J',L('BODY')],...GOTO(first?L('NONE'):L('EXIT')),
    L('BODY'),...T(1),...P(5),
    L('IN'),...JNE(5,4,L('TEST')),...GOTO(L('KEEP')),
    L('TEST'),...callTool(rel,args,F),...T(2),['J',neg?L('NX'):L('HIT')],...GOTO(neg?L('HIT'):L('NX')),
    L('NX'),...AT(5),['TAKE'],...P(5),...GOTO(L('IN')),
    L('KEEP'),...ADV,...GOTO(L('LOOP'))];
  if(first) parts.push(L('HIT'),...T(5),...P(1),...T(4),...AT(5),['PUT'],...CUTX,...GOTO(L('EXIT')), L('NONE'),...PUSH0,...P(1));
  else parts.push(L('HIT'),...UNLINK,...GOTO(L('LOOP')));
  parts.push(L('EXIT')); return assemble(parts); }

// «מיון-במקום של קבוצה»: איברי הקבוצה C (תנאי חד-מקומי) ממוינים לפי cmp ביניהם, ושאר האיברים נשארים במקומם.
//   מיון-בחירה על הרשימה המקושרת: לכל חוליה u שב-C — מחפשים בהמשך את ה«טוב» ביותר מ-C (cmp(s,best) ⇒ s לפני best), ומחליפים את שתי החוליות.
//   תאים: 3 = p (החוליה שלפני u), 4 = u, 5 = best, 6 = pb (החוליה שלפני best), 7 = q, 0 = s. בהחלפה: 7 = הבא-של-u, 0 = הבא-של-best.
export function classSortFrame({C,negC=false,cmp,negCmp=false}){ const u=++UID; const L=s=>s+u; const F=[0,1,3,4,5,6,7];
  const ifC=(cell,yes,no)=>[...callTool(C,[cell],F),...T(2),['J',negC?no:yes],...GOTO(negC?yes:no)];
  return assemble([...PUSH1,...P(3),
    L('OUT'),...XLOAD,...T(4),['J',L('U1')],...GOTO(L('EXIT')),
    L('U1'),...ifC(4,L('SEL'),L('NEXT')),
    L('NEXT'),...ADV,...GOTO(L('OUT')),
    L('SEL'),...MV(4,5),...MV(3,6),...MV(4,7),
    L('IN'),...AT(7),['TAKE'],...P(0),...T(0),['J',L('IN1')],...GOTO(L('DONE')),
    L('IN1'),...ifC(0,L('IN2'),L('ADVQ')),
    L('IN2'),...callTool(cmp,[0,5],F),...T(2),['J',negCmp?L('ADVQ'):L('BEST')],...GOTO(negCmp?L('BEST'):L('ADVQ')),
    L('BEST'),...MV(0,5),...MV(7,6),
    L('ADVQ'),...MV(0,7),...GOTO(L('IN')),
    L('DONE'),...JNE(5,4,L('SWAP')),...GOTO(L('NEXT')),
    L('SWAP'),...JNE(6,4,L('FAR')),
      ...AT(5),['TAKE'],...P(0), ...T(5),...AT(3),['PUT'], ...T(4),...AT(5),['PUT'], ...T(0),...AT(4),['PUT'], ...MV(5,3),...GOTO(L('OUT')),   // שכנים: mem[p]=best, mem[best]=u, mem[u]=הבא-של-best
    L('FAR'),...AT(4),['TAKE'],...P(7), ...AT(5),['TAKE'],...P(0), ...T(5),...AT(3),['PUT'], ...T(7),...AT(5),['PUT'], ...T(4),...AT(6),['PUT'], ...T(0),...AT(4),['PUT'], ...MV(5,3),...GOTO(L('OUT')),
    L('EXIT')]); }
// הסקה: הפלט = אותם איברים; מי שזז אי-פעם ⇒ ב-C; איברים שלא ב-C נשארים במקומם; סדר איברי-C בפלט ⇒ סדר מלא עקבי ⇒ טבלת cmp
function classSortInfer(lists,wants){ const moved=new Uint8Array(16), seenV=new Uint8Array(16);
  for(let e=0;e<lists.length;e++){ const l=lists[e], w=wants[e]; if(l.length!==w.length||J([...l].sort())!==J([...w].sort())) return null; l.forEach((x,i)=>{ seenV[x]=1; if(w[i]!==x) moved[x]=1; }); }
  if(!moved.some(x=>x)) return null;
  const before=new Set(); for(let e=0;e<lists.length;e++){ const l=lists[e], w=wants[e]; for(let i=0;i<l.length;i++){ if(!moved[l[i]]&&w[i]!==l[i]) return null; if(moved[l[i]]!==moved[w[i]]) return null; }
    const cs=w.filter(x=>moved[x]); for(let i=0;i<cs.length;i++) for(let j=i+1;j<cs.length;j++){ if(before.has(cs[j]*16+cs[i])) return null; before.add(cs[i]*16+cs[j]); } }
  const Cv=[...Array(16).keys()].filter(v=>moved[v]); const cmp=new Map(); for(const a of Cv) for(const b of Cv){ if(a===b) continue; if(before.has(a*16+b)) cmp.set(a*16+b,true); else if(before.has(b*16+a)) cmp.set(a*16+b,false); }
  const C=new Map(); for(let v=0;v<16;v++) if(seenV[v]) C.set(v,!!moved[v]); return {C,cmp}; }

// ─── 2. המדף: סטטיסטיקות, ערכי-רשימה של x, פעולות (לוחות) ──────────────────
const listGenId=()=>()=>{ const m=new Array(16).fill(0); const p=[8,9,10,11,12,13,14,15]; for(let i=7;i>0;i--){ const j=R(i+1); [p[i],p[j]]=[p[j],p[i]]; } const l=p.slice(0,R(9)); m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; }); return {mem:m.map((v,k)=>[0,1,...LISTV].includes(k)?v:R(16))}; };
const dirtyM=m=>{ const q=m.slice(), inl=new Set(walk(m)); for(let c=0;c<16;c++) if(c!==1&&!inl.has(c)) q[c]=R(16); return q; };
let SHC=null;
export function shelfParts(sh){ const sig=sh.named.map(b=>b.name+':'+b.prog.length).join('|'); if(SHC&&SHC.sig===sig) return SHC;
  const g=listGenId(); const ex=[]; for(let n=0;n<=8;n++) for(let k=0;k<6;k++){ let e; do{ e=g(); }while(walk(e.mem).length!==n); ex.push(e); }
  const stats=[], perx=[], ops={1:[],2:[],3:[]}; const sigS=new Set(), sigP=new Set();
  for(const b of sh.named){ if(b.bad||!lenOk(b,300)) continue; const bc=encodeG(b.prog);
    // סטטיסטיקה: הרשימה נשארת, המחסנית ריקה, התשובה משתנה בין רשימות ⇒ גרסה בטוחה-לשרשרת
    { let ok=true; const v=[]; for(const e of ex){ const r=runFastG(bc,e.mem,0,200000); if(!r||r[1]!==e.mem[1]||walk(e.mem).some(x=>r[x]!==e.mem[x])){ ok=false; break; } v.push(r[2]&15); }
      if(ok&&!v.every(x=>x===v[0])){ const s=chainSafeLN(b.prog,ex); if(s){ const k=J(s.v); if(!sigS.has(k)){ sigS.add(k); stats.push({name:b.name,prog:s.prog,cost:1+s.prog.length/150}); } } } }
    // ערך-רשימה של x: כלי עם שני קלטים, אחד מהם תא 1 (ראש הרשימה); x נכנס לקלט השני
    const ins=b.ins||[]; if(ins.length===2&&ins.includes(1)&&(b.out??2)<8){ const c=ins.find(z=>z!==1); if(c<8){ let ok=true; const v=[];
      for(const e of ex){ for(const x of walk(e.mem)){ let y=null; for(let t=0;t<2&&ok;t++){ const m=dirtyM(e.mem); m[c]=x; const r=runFastG(bc,m,0,200000); if(!r||r[1]!==m[1]||walk(e.mem).some(z=>r[z]!==m[z])){ ok=false; break; } const yy=r[b.out??2]&15; if(y===null) y=yy; else if(y!==yy) ok=false; } if(!ok) break; v.push(y); } if(!ok) break; }
      if(ok&&v.length&&!v.every(x=>x===v[0])){ const k=J(v); if(!sigP.has(k)){ sigP.add(k); perx.push({name:b.name,prog:b.prog,ins:[c,1],out:b.out??2,args:['x',1],cost:2+b.prog.length/150}); } } } }
    // פעולה (לוח מלא): קלטים בתאים <8 בלי תא 1 כרשימה, תשובה תלויה רק בקלטים
    if(ins.length>=1&&ins.length<=3&&ins.every(c=>c<8)&&(b.out??2)<8&&b.prog.length<=260&&![...usedC(b.prog)].some(c=>c>7)){ const k=ins.length, N=1<<(4*k), Tb=new Uint8Array(N); let ok=true;
      for(let x=0;x<N&&ok;x++){ let v=null; for(let t=0;t<2;t++){ const m=Array.from({length:16},()=>R(16)); for(let j=0;j<k;j++) m[ins[j]]=(x>>(4*(k-1-j)))&15; const r=runFastG(bc,m,0,20000); if(!r||LISTV.some(c=>r[c]!==m[c])){ ok=false; break; } const y=r[b.out??2]&15; if(v===null) v=y; else if(v!==y){ ok=false; break; } } Tb[x]=v??0; }
      if(ok) ops[k].push({name:b.name,prog:b.prog,ins,out:b.out??2,T:Tb}); } }
  SHC={sig,stats,perx,ops}; return SHC; }

// ─── 3. ערכי-ההקשר על הדוגמאות ───────────────────────────────────────────────
// נקודה = (דוגמה, מקום). ערך-הקשר = מערך על כל הנקודות.
function contextFeatures(ALL,lists,parts,{say=()=>{}}={}){ const off=[]; let n=0; lists.forEach(l=>{ off.push(n); n+=l.length; }); const NP=n;
  const F=[]; const mk=(key,kind,cost,fill,extra={})=>{ const v=new Uint8Array(NP); lists.forEach((l,e)=>l.forEach((x,i)=>{ v[off[e]+i]=fill(l,i,e); })); F.push({key,kind,cost,v,...extra}); };
  mk('x','x',0,(l,i)=>l[i],{name:'x'}); mk('nx','nx',1,(l,i)=>l[i+1]||0,{name:'הבא'}); mk('p1','p1',1,(l,i)=>i>0?l[i-1]:0,{name:'הקודם'}); mk('p2','p2',1.6,(l,i)=>i>1?l[i-2]:0,{name:'זה-שלפני-הקודם'}); mk('i','i',1.5,(l,i)=>i,{name:'המקום'});
  const sigs=new Set(F.map(f=>Buffer.from(f.v).toString('latin1')));
  parts.stats.forEach((s,k)=>{ const C=encodeG(s.prog); const val=[]; for(const e of ALL){ const r=runFastG(C,e.mem,0,300000); if(!r){ val.length=0; break; } val.push(r[2]&15); } if(!val.length) return;
    const f={key:'s'+k,kind:'stat',cost:s.cost,name:s.name,prog:s.prog,v:new Uint8Array(NP)}; lists.forEach((l,e)=>l.forEach((x,i)=>{ f.v[off[e]+i]=val[e]; })); f.ev=val;
    const sg=Buffer.from(f.v).toString('latin1'); if(sigs.has(sg)) return; sigs.add(sg); F.push(f); });
  parts.perx.forEach((t,k)=>{ const C=encodeG(t.prog); const v=new Uint8Array(NP); let ok=true; const c=t.ins[0];
    lists.forEach((l,e)=>{ if(!ok) return; l.forEach((x,i)=>{ if(!ok) return; const m=ALL[e].mem.slice(); m[c]=x; const r=runFastG(C,m,0,300000); if(!r){ ok=false; return; } v[off[e]+i]=r[t.out]&15; }); });
    if(!ok) return; const sg=Buffer.from(v).toString('latin1'); if(sigs.has(sg)) return; sigs.add(sg); F.push({key:'k'+k,kind:'perx',cost:t.cost,name:`${t.name}(x)`,prog:t.prog,ins:t.ins,out:t.out,args:t.args,v}); });
  return {F,off,NP,sigs}; }

// ─── 4. תוויות לפי מסגרת ──────────────────────────────────────────────────────
const isSubseq=(l,w)=>{ let j=0; for(const x of l) if(j<w.length&&w[j]===x) j++; return j===w.length; };
// מחזיר {pts:[נקודה גלובלית], lab:[0/1]} או null. 1 = הוצא / חתוך / דלג / סמן
function labelsFor(mode,lists,wants,off){ const pts=[], lab=[];
  for(let e=0;e<lists.length;e++){ const l=lists[e], w=wants[e], o=off[e];
    if(mode==='filter'){ if(!isSubseq(l,w)) return null; const k=new Set(w); l.forEach((x,i)=>{ pts.push(o+i); lab.push(k.has(x)?0:1); }); }
    else if(mode==='take'){ const k=w.length; if(k>l.length||J(l.slice(0,k))!==J(w)) return null; for(let i=0;i<=Math.min(k,l.length-1);i++){ pts.push(o+i); lab.push(i<k?0:1); } }
    else if(mode==='drop'){ const d=l.length-w.length; if(d<0||J(l.slice(d))!==J(w)) return null; for(let i=0;i<=Math.min(d,l.length-1);i++){ pts.push(o+i); lab.push(i<d?1:0); } }
    else if(mode==='slice'){ if(!w.length){ l.forEach((x,i)=>{ pts.push(o+i); lab.push(0); }); continue; } const a=l.indexOf(w[0]); if(a<0) return null; const b=a+w.length-1; if(b>=l.length||J(l.slice(a,b+1))!==J(w)) return null;
      for(let i=0;i<a;i++){ pts.push(o+i); lab.push(0); } pts.push(o+a); lab.push(1); for(let i=a+1;i<b;i++){ pts.push(o+i); lab.push(0); } if(b>a&&b<l.length-1){ pts.push(o+b); lab.push(1); } else if(b===a&&b<l.length-1) return null; } }
  if(!lab.some(x=>x)||!lab.some(x=>!x)) return null; return {pts,lab}; }

// ─── 5. צירוף עקבי וסגור ──────────────────────────────────────────────────────
// לכל צירוף של 1–3 ערכי-הקשר: התווית פונקציה שלו? (אף מפתח לא מקבל שתי תוויות) · סגור: כמעט אין מפתחות שנראו פעם אחת (אחרת זה שינון)
//   ערך «רחב»/נגזר (f.wide) — לכל היותר אחד בצירוף, ורק בצירוף של עד wideK ערכים
const TBs=new Int16Array(4096), STAMP=new Int32Array(4096), CNs=new Uint16Array(4096); let STAMPN=0;
function tableTest(A,lab,NP,{closed=0.005,value=false}={}){ const k=A.length; const id=++STAMPN; const keys=[];
  for(let j=0;j<NP;j++){ const key=k===1?A[0][j]:k===2?A[0][j]*16+A[1][j]:A[0][j]*256+A[1][j]*16+A[2][j];
    if(STAMP[key]!==id){ STAMP[key]=id; TBs[key]=lab[j]; CNs[key]=1; keys.push(key); } else { if(TBs[key]!==lab[j]) return null; CNs[key]++; } }
  let singles=0; for(const key of keys) if(CNs[key]===1) singles++; if(singles>Math.max(1,closed*NP)) return null;
  const tab=new Map(); for(const key of keys) tab.set(key,value?TBs[key]:TBs[key]===1); return tab; }
function consistentTuples(F,L,{maxK=3,limit=400,maxWide=2}={}){ const NP=L.pts.length, out=[]; const vals=F.map(f=>{ const a=new Uint8Array(NP); for(let j=0;j<NP;j++) a[j]=f.v[L.pts[j]]; return a; });
  const lab=Int16Array.from(L.lab);
  const test=idx=>{ const tab=tableTest(idx.map(i=>vals[i]),lab,NP); if(!tab) return null; const v=[...tab.values()]; if(!v.some(x=>x)||!v.some(x=>!x)) return null; return tab; };
  const n=F.length; const combos=[]; const W=F.map(f=>f.wide?1:0);
  for(let a=0;a<n;a++){ combos.push([a]); for(let b=a+1;b<n;b++){ if(W[a]+W[b]>maxWide) continue; combos.push([a,b]); if(maxK>=3) for(let c=b+1;c<n;c++){ if(W[a]+W[b]+W[c]>maxWide) continue; combos.push([a,b,c]); } } }
  const cost=idx=>idx.length*2+idx.reduce((s,i)=>s+F[i].cost,0);
  combos.sort((x,y)=>x.length-y.length||cost(x)-cost(y));
  for(const idx of combos){ if(!alloc(idx.map(i=>F[i]))) continue;
    if(out.some(o=>o.idx.every(i=>idx.includes(i)))) continue;   // צירוף שמכיל צירוף-עקבי קטן ממנו — מיותר
    const tab=test(idx); if(!tab) continue;
    out.push({idx,feats:idx.map(i=>F[i]),tab,cost:cost(idx)}); if(out.length>=limit) break; }
  return out; }

// ─── 5ב. ממוצע-רחב: floor(Σ g(x) / n) — g = x / כלי חד-מקומי מהמדף / הרכבה של שניים. הקוד: מסגרת «צובר» של wideframes.mjs (codeNum) ───
let GOPT=null;
function composeU(u1,u2){ const m1={}; m1[u1.ins[0]]=0; m1[u1.out]=6; const f1=[3,4,5,7]; for(const c of dataCells(u1.prog)) if(m1[c]==null){ const f=f1.shift(); if(f==null) return null; m1[c]=f; }
  const m2={}; m2[u2.ins[0]]=6; m2[u2.out]=2; const f2=[3,4,5,7]; for(const c of dataCells(u2.prog)) if(m2[c]==null){ const f=f2.shift(); if(f==null) return null; m2[c]=f; }
  const p1=[['WHERE',0],['GO'],...shift(remap(u1.prog,m1),2)]; const p2=[['WHERE',0],['GO'],...shift(remap(u2.prog,m2),p1.length+2)]; const prog=[...p1,...p2];
  for(let x=0;x<16;x++) for(let t=0;t<3;t++){ const m=Array.from({length:16},()=>R(16)); m[0]=x; const r=run(prog,m,{maxSteps:20000}); const a=u1.T[x]; const w=a<0?-1:u2.T[a]; if(w<0) continue; if(!r||r.st.length||r.mem[2]!==w||r.mem[0]!==x||LISTV.some(c=>r.mem[c]!==m[c])) return null; }
  return {ins:[0],out:2,prog}; }
function gOptions(){ let sig=''; try{ sig=String(fs.statSync('shelf3.json').mtimeMs); }catch{} if(GOPT&&GOPT.sig===sig) return GOPT.G;
  const {U}=scanTools(); const V8=f=>LISTV.map(f); const seen=new Set(); const G=[];
  const add=(name,f,g,cost)=>{ const v=V8(f); if(v.some(x=>x<0||x>15)) return; const k=v.join(); if(seen.has(k)||v.every(x=>x===v[0])) return; seen.add(k); G.push({name,f,g,cost,v}); };
  add('x',x=>x,{kind:'x'},0);
  for(const u of U) add(u.name,x=>u.T[x],{kind:'tool',tool:{ins:u.ins,out:u.out,prog:u.prog}},1);
  for(const u1 of U) for(const u2 of U){ const f=x=>{ const a=u1.T[x]; return a<0?-1:u2.T[a]; }; const v=V8(f); if(v.some(x=>x<0)||seen.has(v.join())||v.every(x=>x===v[0])) continue; const t=composeU(u1,u2); if(!t) continue; add(`${u2.name}∘${u1.name}`,f,{kind:'tool',tool:t},2); }
  GOPT={sig,G}; return G; }
function wideFeatures(lists,off,NP,sigs){ const G=gOptions(); const out=[];
  G.forEach((g,k)=>{ const ev=lists.map(l=>l.length?Math.floor(l.reduce((a,x)=>a+g.f(x),0)/l.length)&15:0); if(ev.every(x=>x===ev[0])) return; const v=new Uint8Array(NP); lists.forEach((l,e)=>l.forEach((x,i)=>{ v[off[e]+i]=ev[e]; }));
    const sg=Buffer.from(v).toString('latin1'); if(sigs.has(sg)) return; sigs.add(sg);
    let prog=null; try{ prog=codeNum({mode:'up',g:g.g,out:'div',d:'n',post:{kind:'id'}}); }catch{ return; }
    out.push({key:'w'+k,kind:'stat',wide:true,cost:3+g.cost,name:`ממוצע-רחב[${g.name}]`,prog,v,ev}); });
  return out; }
const pointsOf=(ev,lists,off,NP)=>{ const v=new Uint8Array(NP); lists.forEach((l,e)=>l.forEach((x,i)=>{ v[off[e]+i]=ev[e]; })); return v; };

// ─── 5ג. סף נלמד: הנשארים = הערכים שבין A ל-B (A/B = סטטיסטיקה, או פעולה חד-מקומית עליה — מהמדף או נלמדת) ───
// לכל דוגמה — הטווח שבו A (או B) חייב להיות; לכל ערך של הסטטיסטיקה — חיתוך הטווחים. עקבי ⇒ מפה v ⇒ A.
function intervalCands(lists,wants,SF,ops1){ const NE=lists.length; const mk=nm=>({nm,lo:new Int16Array(NE).fill(-99),hi:new Int16Array(NE).fill(99),dc:new Uint8Array(NE)});
  const V={Ai:mk('≥'),As:mk('>'),Bi:mk('≤'),Bs:mk('<')}; let needA=false, needB=false; const empty=new Uint8Array(NE);
  for(let e=0;e<NE;e++){ const l=lists[e], w=wants[e]; if(!isSubseq(l,w)) return []; const K=new Set(w); const s=[...l].sort((a,b)=>a-b);
    if(!l.length){ for(const k in V) V[k].dc[e]=1; continue; }
    let f=-1,g=-1; s.forEach((x,i)=>{ if(K.has(x)){ if(f<0) f=i; g=i; } });
    if(f<0){ empty[e]=1; const mx=s.at(-1), mn=s[0]; V.Ai.lo[e]=mx+1; V.As.lo[e]=mx; V.Bi.hi[e]=mn-1; V.Bs.hi[e]=mn; continue; }
    for(let i=f;i<=g;i++) if(!K.has(s[i])) return [];
    if(f>0) needA=true; if(g<s.length-1) needB=true;
    V.Ai.lo[e]=f>0?s[f-1]+1:-99; V.Ai.hi[e]=s[f]; V.As.lo[e]=f>0?s[f-1]:-99; V.As.hi[e]=s[f]-1;
    V.Bi.lo[e]=s[g]; V.Bi.hi[e]=g<s.length-1?s[g+1]-1:99; V.Bs.lo[e]=s[g]+1; V.Bs.hi[e]=g<s.length-1?s[g+1]:99; }
  if(!needA&&!needB) return [];
  if(needA&&needB) for(let e=0;e<NE;e++) if(empty[e]) for(const k in V) V[k].dc[e]=1;   // שני צדדים: רשימה שאיש לא נשאר בה — לא קובעת (הבדיקה תכריע)
  const out=[]; const vars=[...(needA?['Ai','As']:[]),...(needB?['Bi','Bs']:[])];
  for(const vk of vars){ const Vr=V[vk]; let nGood=0;
    for(const S of SF){ const lo=new Int16Array(16).fill(-99), hi=new Int16Array(16).fill(99), seen=new Uint8Array(16); let ok=true;
      for(let e=0;e<NE;e++){ if(Vr.dc[e]) continue; const v=S.ev[e]; seen[v]=1; if(Vr.lo[e]>lo[v]) lo[v]=Vr.lo[e]; if(Vr.hi[e]<hi[v]) hi[v]=Vr.hi[e]; }
      const L=[], H=[]; for(let v=0;v<16;v++){ if(!seen[v]) continue; const a=Math.max(0,lo[v]), b=Math.min(15,hi[v]); if(a>b){ ok=false; break; } L[v]=a; H[v]=b; } if(!ok) continue;
      const vs=[...Array(16).keys()].filter(v=>seen[v]); if(vs.length<2) continue;
      if(vs.every(v=>L[v]<=v&&v<=H[v])){ out.push({vk,S,map:'id',cost:S.cost}); nGood++; continue; }
      const op=ops1.find(o=>vs.every(v=>L[v]<=o.T[v]&&o.T[v]<=H[v])); if(op){ out.push({vk,S,map:op,cost:S.cost+1+op.prog.length/100}); nGood++; continue; }
      out.push({vk,S,map:'learn',L,H,vs,cost:S.cost+5+vs.filter(v=>L[v]!==H[v]).length*0.1}); }
  }
  return out.sort((a,b)=>a.cost-b.cost); }

// מפה חד-מקומית «בתוך טווחים»: חיפוש לרוחב על צירופים של כלי-מספר מהמדף (חד- ודו-מקומיים, עד 3 פעולות) — הצירוף הקטן ביותר
//   שערכו על כל v שנראה נופל בטווח [L[v],H[v]]. מחזיר את הערכים (יעד מדויק לבונה-הערכים), או null.
function rangeMap(L,H,vs,{maxSize=4,cap=400000,ms=12000}={}){ const {U,B}=scanTools(); const DL=Date.now()+ms; const key=v=>{ let s=''; for(const i of vs) s+=String.fromCharCode(v[i]+1); return s; };
  const ok=v=>{ for(const i of vs) if(v[i]<L[i]||v[i]>H[i]) return false; return true; }; const seen=new Set(); const bySize=[[]]; const id=Int8Array.from({length:16},(_,i)=>i);
  const res=v=>new Map(vs.map(i=>[i,v[i]]));
  const add=(v,s,store)=>{ for(const i of vs) if(v[i]<0) return null; if(store){ const k=key(v); if(seen.has(k)) return null; seen.add(k); (bySize[s]||(bySize[s]=[])).push(v); } return ok(v)?v:null; };
  if(add(id,0,true)) return res(id); const w=new Int8Array(16);
  for(let s=1;s<=maxSize;s++){ const store=s<maxSize&&seen.size<cap; bySize[s]=[];   // הרמה האחרונה: רק בודקים, לא שומרים
    for(const a of bySize[s-1]) for(const u of U){ for(let i=0;i<16;i++) w[i]=a[i]<0?-1:u.T[a[i]]; const r=add(store?Int8Array.from(w):w,s,store); if(r) return res(r); }
    for(let sa=0;sa<=s-1;sa++){ const sb=s-1-sa; for(const a of bySize[sa]||[]){ if(Date.now()>DL) return null; for(const b of bySize[sb]||[]) for(const t of B){ for(let i=0;i<16;i++) w[i]=a[i]<0||b[i]<0?-1:t.T[a[i]*16+b[i]]; const r=add(store?Int8Array.from(w):w,s,store); if(r) return res(r); } } }
    if(Date.now()>DL) return null; }
  return null; }

// ─── 5ד. ציר נלמד: בכל דוגמה הוצא בדיוק איבר אחד (או נשאר בדיוק אחד) ⇒ «הציר» = פונקציה של 1–3 סטטיסטיקות ───
function pivotTargets(lists,wants){ const res=[]; for(const kind of ['rm','kp']){ const Tg=new Int16Array(lists.length).fill(-1); let ok=true;
    for(let e=0;e<lists.length&&ok;e++){ const l=lists[e], w=wants[e]; if(!l.length) continue; if(!isSubseq(l,w)){ ok=false; break; } const K=new Set(w); const c=kind==='rm'?l.filter(x=>!K.has(x)):w; if(c.length!==1){ ok=false; break; } Tg[e]=c[0]; }
    if(ok) res.push({kind,Tg}); } return res; }
function pivotTuples(Tg,SF,{limit=12}={}){ const E=[]; for(let e=0;e<Tg.length;e++) if(Tg[e]>=0) E.push(e); const NP=E.length; const lab=Int16Array.from(E.map(e=>Tg[e]));
  const vals=SF.map(S=>Uint8Array.from(E.map(e=>S.ev[e]))); const W=SF.map(f=>f.wide?1:0); const out=[];
  const cost=idx=>idx.length*2+idx.reduce((s,i)=>s+SF[i].cost,0); const combos=[]; const n=SF.length;
  for(let a=0;a<n;a++){ combos.push([a]); for(let b=a+1;b<n;b++){ if(W[a]+W[b]>1) continue; combos.push([a,b]); for(let c=b+1;c<n;c++){ if(W[a]+W[b]+W[c]>1) continue; combos.push([a,b,c]); } } }
  combos.sort((x,y)=>x.length-y.length||cost(x)-cost(y));
  for(const idx of combos){ if(out.some(o=>o.idx.every(i=>idx.includes(i)))) continue; const tab=tableTest(idx.map(i=>vals[i]),lab,NP,{closed:0.01,value:true}); if(!tab) continue;
    if(idx.length===1&&[...tab].every(([k,v])=>k===v)) continue;   // הציר הוא הסטטיסטיקה עצמה — הצירוף הרגיל ימצא
    out.push({idx,subs:idx.map(i=>SF[i]),tab,cost:cost(idx)}); if(out.length>=limit) break; }
  return out; }
function shelfValueOp(tab,k,ops){ const dig=(key,j)=>(key>>(4*(k-1-j)))&15;
  for(const o of ops[k]||[]) for(const pm of perms(k)){ let ok=true; for(const [key,v] of tab){ let x=0; for(let j=0;j<k;j++) x=x*16+dig(key,pm[j]); if(o.T[x]!==v){ ok=false; break; } }
    if(ok) return {name:o.name,prog:o.prog,ins:[...Array(k).keys()].map(i=>o.ins[pm.indexOf(i)]),out:o.out}; }
  return null; }
// בונה-הערכים על לוח-ערכים (k קלטים ⇒ ערך); לא נשמר במדף עד שהפתרון כולו עובר
function learnValue(tab,k,{ms=60000,say=()=>{},tag='ערך'}={}){ const ent=[...tab].sort((a,b)=>a[0]-b[0]); const name=`${tag}-נלמד #`+crypto.createHash('sha1').update(J([k,ent])).digest('hex').slice(0,12);
  const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const have=sh.named.find(b=>b.name===name); if(have) return {tool:{name,prog:have.prog,ins:have.ins,out:have.out??2},name,learned:null};
  const K=ent.map(x=>x[0]); const ins=LINS[k]; const dig=(key,j)=>(key>>(4*(k-1-j)))&15;
  const gen=()=>{ const key=K[R(K.length)]; const mem=Array.from({length:16},()=>R(16)); ins.forEach((c,j)=>{ mem[c]=dig(key,j); }); const w=tab.get(key); const m0=mem.slice(); return {mem,want:w,ok:r=>r[2]===w&&ins.every(c=>r[c]===m0[c])&&LISTV.every(c=>r[c]===m0[c])}; };
  say(`    בונה-הערכים לומד «${name}» (${K.length} מפתחות)…`); const v=valueBuild(gen,{name,ins,out:2,ms}); if(!v.prog) return null; if(finalCheck(v.prog,gen,3000).bad) return null;
  return {tool:{name,prog:v.prog,ins,out:2},name:name+(v.expr?' = '+showExpr(v.expr):''),learned:{name,prog:v.prog,ins,k,gen}}; }
// סטטיסטיקה נגזרת: ערכים לכל דוגמה (מהלוח, ומהתוכנית עצמה על מפתחות שלא נראו)
function makeDstat(key,subs,op,name,lists,off,NP,learned=null){ const k=subs.length; const memo=new Map();
  const at=e=>{ let x=0; for(const s of subs) x=x*16+s.ev[e]; if(memo.has(x)) return memo.get(x); const m=Array.from({length:16},()=>R(16)); op.ins.forEach((c,j)=>{ m[c]=(x>>(4*(k-1-j)))&15; }); const r=run([['WHERE',0],['GO'],...shift(op.prog,2)],m,{maxSteps:50000}); const y=r&&!r.st.length?r.mem[op.out??2]&15:0; memo.set(x,y); return y; };
  const ev=lists.map((_,e)=>at(e)); if(ev.every(x=>x===ev[0])) return null;
  return {key,kind:'dstat',wide:true,subs,op,name,cost:3+subs.reduce((a,s)=>a+s.cost,0)+(learned?2:0),ev,v:pointsOf(ev,lists,off,NP),learned}; }

// ─── 6. תנאי: כלי מהמדף (כל סדר-קלטים, ישר/הפוך), או לוח שנלמד ───────────────
const perms=k=>k===1?[[0]]:k===2?[[0,1],[1,0]]:[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
function shelfCond(tab,k,ops){ const keys=[...tab.keys()]; const dig=(key,j)=>(key>>(4*(k-1-j)))&15; const out=[];
  for(const o of ops[k]||[]) for(const pm of perms(k)){ let pos=true, neg=true; for(const key of keys){ let x=0; for(let j=0;j<k;j++) x=x*16+dig(key,pm[j]); const t=o.T[x]!==0; if(t!==tab.get(key)) pos=false; else neg=false; if(!pos&&!neg) break; }
    if(pos||neg) out.push({tool:{name:o.name,prog:o.prog,ins:[...Array(k).keys()].map(i=>o.ins[pm.indexOf(i)]),out:o.out},neg:!pos,name:o.name,len:o.prog.length}); }
  // ins: הקלט ה-j של הצירוף ⇒ התא של הכלי שבמקום pm.indexOf(j)
  return out.sort((a,b)=>a.len-b.len); }
const tabName=(tab,k)=>{ const tr=[...tab].filter(([,v])=>v).map(([key])=>key).sort((a,b)=>a-b), fa=[...tab].filter(([,v])=>!v).map(([key])=>key).sort((a,b)=>a-b);
  if(k===1) return 'ערכים: '+tr.join(','); if(k===2){ const fmt=L=>L.map(x=>`${x>>4}.${x&15}`).join(','); return `זוג-ערכים: כן ${fmt(tr)} · לא ${fmt(fa)}`; }
  return 'שלישיית-ערכים #'+crypto.createHash('sha1').update(J([tr,fa])).digest('hex').slice(0,12); };
const LINS={1:[0],2:[0,1],3:[0,1,3]};
// בונה-הערכים על הלוח (רק המפתחות שנראו; השאר «לא אכפת»). לא נשמר במדף עד שהפתרון כולו עובר.
function learnCond(tab,k,{ms=60000,say=()=>{}}={}){ const name=tabName(tab,k); const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const have=sh.named.find(b=>b.name===name&&(b.ins||[]).length===k);
  if(have) return {tool:{name,prog:have.prog,ins:have.ins,out:have.out??2},neg:false,name,learned:false};
  const K=[...tab.keys()]; const ins=LINS[k]; const dig=(key,j)=>(key>>(4*(k-1-j)))&15;
  const gen=()=>{ const key=K[R(K.length)]; const mem=Array.from({length:16},()=>R(16)); ins.forEach((c,j)=>{ mem[c]=dig(key,j); }); const w=tab.get(key)?15:0; const m0=mem.slice(); return {mem,want:w,ok:r=>r[2]===w&&ins.every(c=>r[c]===m0[c])&&LISTV.every(c=>r[c]===m0[c])}; };
  say(`    בונה-הערכים לומד «${name.slice(0,60)}» (${K.length} מפתחות)…`); const v=valueBuild(gen,{name,ins,out:2,ms}); if(!v.prog) return null;
  if(finalCheck(v.prog,gen,3000).bad) return null;
  return {tool:{name,prog:v.prog,ins,out:2},neg:false,name:name+(v.expr?' = '+showExpr(v.expr):''),learned:{name,prog:v.prog,ins,k,gen}}; }
function shelveLearned(L){ if(!L) return; const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); if(sh.named.some(b=>b.name===L.name)) return;
  const N=1<<(4*L.k); const tt=Array.from({length:N},(_,x)=>{ const m=Array.from({length:16},()=>R(16)); L.ins.forEach((c,j)=>{ m[c]=(x>>(4*(L.k-1-j)))&15; }); const r=run(L.prog,m,{maxSteps:50000}); return r&&!r.st.length?r.mem[2]&15:0; });
  sh.named.push({name:L.name,prog:L.prog,ins:L.ins,out:2,movable:movable(L.prog,L.gen),by:'נלמד: תנאי (סינון-סטטיסטי)'}); fs.writeFileSync('shelf3.json',JSON.stringify(sh));
  const LG=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); LG[L.name]={ins:L.ins,tt}; fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(LG)); }

// ─── 7. יחס R מתוויות עקיפות (יש-קודם / הזוג-הראשון) ────────────────────────
// מחזיר Map(מפתח y*16+x ⇒ true/false) של ערכים ודאיים, או null אם סותר
function relLabels(mode,lists,wants){ const Z=new Set(), ONE=new Set(), dis=[];
  for(let e=0;e<lists.length;e++){ const l=lists[e], w=wants[e];
    if(mode==='exists'){ if(!isSubseq(l,w)) return null; const keep=new Set(w); const K=[]; for(const x of l){ if(keep.has(x)){ for(const y of K) Z.add(y*16+x); K.push(x); } else { if(!K.length) return null; dis.push(K.map(y=>y*16+x)); } } }
    else { if(w.length===0){ for(let j=1;j<l.length;j++) for(let i=0;i<j;i++) Z.add(l[i]*16+l[j]); continue; } if(w.length!==2) return null; const i0=l.indexOf(w[0]), j0=l.indexOf(w[1]); if(i0<0||j0<0||i0>=j0) return null;
      for(let j=1;j<=j0;j++) for(let i=0;i<j;i++){ if(j===j0&&i===i0) break; Z.add(l[i]*16+l[j]); } ONE.add(w[0]*16+w[1]); } }
  for(const d of dis){ const c=d.filter(k=>!Z.has(k)); if(!c.length) return null; if(c.length===1) ONE.add(c[0]); }
  for(const k of ONE) if(Z.has(k)) return null;
  if(!ONE.size||!Z.size) return null; const tab=new Map(); for(const k of Z) tab.set(k,false); for(const k of ONE) tab.set(k,true); return tab; }

// ─── 8. החיפוש ────────────────────────────────────────────────────────────────
export async function statScanCompose(gen,{ms=+process.env.SSMS||180000,say=()=>{},maxLearn=+process.env.SSLEARN||4}={}){ const T0=Date.now(), DEAD=T0+ms; const left=()=>DEAD-Date.now(); const sec=()=>((Date.now()-T0)/1000).toFixed(1);
  const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const parts=shelfParts(sh);
  const ex=pickExamplesFor(gen,6); const more=Array.from({length:400},()=>gen()); const val=Array.from({length:1800},()=>gen());
  const ALL=[...ex,...more,...val]; const lists=ALL.map(e=>walk(e.mem)), wants=ALL.map(e=>JSON.parse(e.want));
  if(ALL.every((e,i)=>J(lists[i])===J(wants[i]))) return {prog:null,why:'אין שינוי'};
  const {F,off,NP,sigs}=contextFeatures(ALL,lists,parts); const Wf=wideFeatures(lists,off,NP,sigs); const SF=[...F.filter(f=>f.kind==='stat'),...Wf];
  say(`  סינון-סטטיסטי: ערכי-הקשר ${F.length} (סטטיסטיקות ${F.filter(f=>f.kind==='stat').length}, ערכי-רשימה ${F.filter(f=>f.kind==='perx').length}, ממוצעים-רחבים ${Wf.length}) · פעולות ${parts.ops[1].length}/${parts.ops[2].length}/${parts.ops[3].length} · ${sec()} שנ׳`);
  const chk=makeChecker(gen,300,50000); const quick=ALL.slice(0,ex.length+400);
  const verify=p=>{ if(!p) return false; const C=encodeG(p); for(const e of quick){ const m=runFastG(C,e.mem,0,50000); if(!m||J(walkA(m))!==e.want) return false; } if(!chk(p)) return false; return finalCheck(p,gen,2000).bad===0; };
  let nLearn=0; const learnedFail=new Set(); const tried=new Set();
  const condsFor=(tab,k,allowLearn)=>{ const s=shelfCond(tab,k,parts.ops); if(s.length||!allowLearn) return s.slice(0,3);
    const key=k+':'+tabName(tab,k); if(learnedFail.has(key)||nLearn>=maxLearn||left()<15000) return []; nLearn++;
    const c=learnCond(tab,k,{ms:Math.min(60000,left()-10000),say}); if(!c){ learnedFail.add(key); return []; } return [c]; };
  const tryFrame=(p,how,learned=[])=>{ if(!p) return null; const k=J(p); if(tried.has(k)) return null; tried.add(k); if(!verify(p)) return null; for(const L of learned) if(L) shelveLearned(L); return {prog:p,how,ms:Date.now()-T0,learned:learned.filter(Boolean).map(l=>l.name)}; };
  const fname={filter:'סנן',take:'קח-כל-עוד',drop:'דלג-כל-עוד',slice:'פרוסה-בין-סמנים'};
  const desc=(mode,c,t)=>`${fname[mode]} [${c.neg?'לא ':''}${c.name}(${t.feats.map(f=>f.name).join(', ')})]`;
  // סטטיסטיקות נגזרות: סף (A ≤ x ≤ B) וציר (האיבר היחיד שהוצא/נשאר)
  const D=[]; let nd=0; const addD=d=>{ if(!d) return null; const sg=Buffer.from(d.v).toString('latin1'); if(sigs.has(sg)) return null; sigs.add(sg); D.push(d); return d; };
  const ints=intervalCands(lists,wants,SF,parts.ops[1]); const pendInt=[];
  for(const c of ints){ if(c.map==='id'){ if(c.S.wide&&!D.includes(c.S)) D.push(c.S); } else if(c.map!=='learn') addD(makeDstat('d'+(nd++),[c.S],c.map,`${c.map.name}(${c.S.name})`,lists,off,NP)); else pendInt.push(c); }
  const pivs=pivotTargets(lists,wants); const pendPiv=[];
  for(const pv of pivs) for(const t of pivotTuples(pv.Tg,SF)){ const op=shelfValueOp(t.tab,t.subs.length,parts.ops); if(op) addD(makeDstat('d'+(nd++),t.subs,op,`${op.name}(${t.subs.map(s=>s.name).join(', ')})`,lists,off,NP)); else pendPiv.push(t); }
  // מסגרות-סריקה: תוויות ⇒ צירופים עקביים (מחושב מחדש כשנוספות סטטיסטיקות נגזרות)
  const LBL=[]; for(const mode of ['filter','take','drop','slice']){ const L=labelsFor(mode,lists,wants,off); if(L) LBL.push({mode,L}); }
  let pool=[], tups=[]; const retuple=()=>{ pool=[...F,...D]; tups=LBL.flatMap(({mode,L})=>consistentTuples(pool,L,{limit:60}).map(t=>({...t,mode}))).sort((a,b)=>a.cost-b.cost); };
  retuple();
  // זוגות / יחס R
  const pairLab=(()=>{ const A=new Map(), B=new Map(); for(let e=0;e<lists.length;e++){ const l=lists[e], w=wants[e]; if(!isSubseq(l,w)) return null; const k=new Set(w);
      for(let i=0;i<l.length;i+=2){ const a=l[i], b=l[i+1]||0; const ka=a*16+b; const ra=!k.has(a); if(A.has(ka)&&A.get(ka)!==ra) return null; A.set(ka,ra); if(b){ const rb=!k.has(b); if(B.has(ka)&&B.get(ka)!==rb) return null; B.set(ka,rb); } } }
    const nt=m=>[...m.values()].some(x=>x)&&[...m.values()].some(x=>!x); return nt(A)||nt(B)?{A,B}:null; })();
  const rels=[]; for(const mode of ['exists','firstpair']){ const tab=relLabels(mode,lists,wants); if(tab) rels.push({mode,tab}); }
  say(`  מסגרות: ${LBL.map(m=>m.mode).join(',')} · צירופים ${tups.length} · נגזרות ${D.length} (ממתינות ללימוד: סף ${pendInt.length}, ציר ${pendPiv.length})${pairLab?' · זוגות':''}${rels.map(r=>' · '+r.mode+'('+r.tab.size+')').join('')} · ${sec()} שנ׳`);
  const NEVER={name:'אף-פעם',prog:[...PUSH0,...P(2)],ins:[],out:2};
  const runPairs=allowLearn=>{ if(!pairLab) return null; const has=m=>m.size&&[...m.values()].some(x=>x); const cA=has(pairLab.A)?condsFor(pairLab.A,2,allowLearn):[{tool:null}], cB=has(pairLab.B)?condsFor(pairLab.B,2,allowLearn):[{tool:null}];
    for(const a of cA) for(const b of cB){ if(left()<5000) return null; const r=tryFrame(pairFrame({cA:a.tool||NEVER,cB:b.tool||NEVER,negA:!!a.neg,negB:!!b.neg}),`זוגות [הוצא ראשון: ${a.tool?(a.neg?'לא ':'')+a.name:'אף-פעם'} · הוצא שני: ${b.tool?(b.neg?'לא ':'')+b.name:'אף-פעם'}]`,[a.learned,b.learned]); if(r) return r; } return null; };
  const runRels=allowLearn=>{ for(const r0 of rels){ if(left()<5000) return null; for(const c of condsFor(r0.tab,2,allowLearn)){ const r=tryFrame(relFrame({rel:c.tool,neg:c.neg,first:r0.mode==='firstpair'}),`${r0.mode==='exists'?'יש-קודם':'הזוג-הראשון'} [${c.neg?'לא ':''}${c.name}(y, x)]`,[c.learned]); if(r) return r; } } return null; };
  const runScan=(allowLearn,maxTry=6)=>{ let nTry=0; for(const t of tups){ if(left()<5000) return null; const k=t.feats.length; if(allowLearn&&(t.hasShelf||nTry>=maxTry)) continue;
      const cs=condsFor(t.tab,k,allowLearn); if(!allowLearn) t.hasShelf=cs.length>0; else nTry++;
      for(const c of cs){ const lf=t.feats.filter(f=>f.learned).map(f=>f.learned); const r=tryFrame(scanFrame({mode:t.mode,feats:t.feats,cond:c.tool,neg:c.neg}),desc(t.mode,c,t),[c.learned,...lf]); if(r) return r; } } return null; };
  // שלב א: בלי לימוד
  const runCS=()=>runClassSort(lists,wants,{condsFor,tryFrame,left});
  let r=runPairs(false)||runScan(false)||runRels(false)||runCS(); if(r) return r;
  // שלב ב: לימוד — זוגות/יחס (דו-מקומי), מפות-סף (חד-מקומי), תנאים לצירופים, ציר (עד 3 קלטים)
  r=runPairs(true)||runRels(true); if(r) return r;
  { let nl=0; const sides=new Map(); for(const c of pendInt){ const sd=c.vk[0]; if(!sides.has(sd)) sides.set(sd,[]); sides.get(sd).push(c); }
    const order=[]; for(let i=0;i<4;i++) for(const L of sides.values()) if(L[i]) order.push(L[i]);   // לסירוגין: A, B, A, B… (סף דו-צדדי צריך את שניהם)
    for(const c of order){ if(left()<20000||nl>=6) break;
      const tab=rangeMap(c.L,c.H,c.vs); if(!tab) continue; nl++; const o=learnValue(tab,1,{ms:Math.min(30000,left()-15000),say,tag:'סף'}); if(!o) continue;
      const d=addD(makeDstat('d'+(nd++),[c.S],o.tool,`${o.name}(${c.S.name})`,lists,off,NP,o.learned)); if(d){ retuple(); r=runScan(false); if(r) return r; } } }
  r=runScan(true); if(r) return r;
  { let nl=0; for(const t of pendPiv){ if(left()<20000||nl>=6) break; nl++; const o=learnValue(t.tab,t.subs.length,{ms:Math.min(25000,left()-15000),say,tag:'ציר'}); if(!o) continue;
      const d=addD(makeDstat('d'+(nd++),t.subs,o.tool,`${o.name}(${t.subs.map(s=>s.name).join(', ')})`,lists,off,NP,o.learned)); if(d){ retuple(); r=runScan(false); if(r) return r; } } }
  return {prog:null,ms:Date.now()-T0,modes:LBL.map(m=>m.mode).join(',')+` tups=${tups.length} D=${D.length}`}; }
// מיון-במקום של קבוצה: תנאי-הקבוצה וההשוואה — מהמדף, או נלמדים
function runClassSort(lists,wants,{condsFor,tryFrame,left}){ const inf=classSortInfer(lists,wants); if(!inf) return null;
  for(const allowLearn of [false,true]){ const cC=condsFor(inf.C,1,allowLearn); if(!cC.length) continue; const cK=condsFor(inf.cmp,2,allowLearn);
    for(const c of cC) for(const k of cK){ if(left()<5000) return null; const r=tryFrame(classSortFrame({C:c.tool,negC:c.neg,cmp:k.tool,negCmp:k.neg}),`מיון-במקום [קבוצה: ${c.neg?'לא ':''}${c.name} · לפני: ${k.neg?'לא ':''}${k.name}]`,[c.learned,k.learned]); if(r) return r; } }
  return null; }

// הרצה ישירה: node statscan.mjs <קובץ-משימות> [שם|שם…] — עם הבדיקות הקשוחות (20000 דוגמאות, ריפוד-ממולכד). FRESH=1 ⇒ מדף נקי לפני כל משימה.
if((process.argv[1]||'').endsWith('statscan.mjs')){ const { llGen }=await import('./listlist.mjs'); const { deepRelocOk }=await import('./jumpfix.mjs');
  const file=process.argv[2]; const only=process.argv[3]?new Set(process.argv[3].split('|')):null; const S=JSON.parse(fs.readFileSync(file,'utf8')).tasks.filter(t=>t.kind==='list2list'&&(!only||only.has(t.name))); let n=0;
  for(const t of S){ if(process.env.FRESH){ fs.copyFileSync('shelf3.before-bench100.json','shelf3.json'); fs.copyFileSync('tzoref-learned-goals.before-bench100.json','tzoref-learned-goals.json'); }
    const gen=llGen(new Function('return ('+t.src+')')()); const t0=Date.now(); const r=await statScanCompose(gen,{say:process.env.V?console.log:()=>{}}); const sec=(Date.now()-t0)/1000;
    let fc=null, dr=null; if(r.prog){ fc=finalCheck(r.prog,gen,20000).bad; dr=deepRelocOk(r.prog,gen); } const ok=!!r.prog&&fc===0&&dr; if(ok) n++;
    console.log(`${ok?'✓':'✗'} ${t.name}: ${r.prog?`${r.prog.length} פקודות · ${r.how} · בדיקה-סופית ${fc}/20000 · ריפוד-ממולכד ${dr?'עבר':'נכשל'}`:'לא נמצא '+(r.modes||r.why||'')} · ${sec.toFixed(1)} שנ׳`);
    if(process.env.OUT) fs.appendFileSync(process.env.OUT,J({name:t.name,ok,len:r.prog?.length??null,how:r.how||null,fc,dr,sec,prog:r.prog||null})+'\n'); }
  console.log(`סך: ${n}/${S.length}`); process.exit(0); }
export const _internal={contextFeatures,labelsFor,consistentTuples,relLabels,shelfCond,isSubseq,wideFeatures,intervalCands,pivotTargets,pivotTuples,shelfValueOp,makeDstat,learnValue,rangeMap,statCode,scanFrame};
