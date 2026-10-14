// «הליכה-בצעד» (walkframes.mjs, KEY=walk) — רשימה ⇒ רשימה / רשימה ⇒ מספר: הליכה שבה הצעד נקבע ע"י האיבר.
// אני כותב רק שלדים (מסגרות עם חריצים) + חיפוש; כל מה שנכנס לחריצים — המכונה ממלאת מהדוגמאות או מהמדף שלה:
//   J  קפיצות:     i ⇐ i0; כל עוד i < n { בקר ב-l[i]; i ⇐ i + s(l[i]) }.
//                  חריצים: i0 ∈ {0,1,2} · לוח-הצעד s: 8..15 ⇒ 1..8 · היציאה.
//                  רשימה⇒רשימה: מי שבוקר (לפי הסדר) / מי שלא בוקר.  רשימה⇒מספר: כמה ביקורים / n פחות / האחרון שבוקר /
//                  סכום המבוקרים (&15 או רווי ב-15) / חריגה בסוף (i−n) / המקום של הביקור האחרון ⇒ כלי-סיום (findPost של מצב-רחב-2).
//                  הלוח נלמד: רשימה⇒רשימה — מזוגות עוקבים בפלט (מדויק) + האחרון (חסם תחתון), כמו «מעקב-מצביעים» ב-rearr;
//                  רשימה⇒מספר — חיפוש-עומק על 8 הכניסות (1..8), עקביות על הדוגמאות מהקצרה לארוכה.
//                  לוח ⇒ כלי: סגירה חד-מקומית מהמדף (scanfold lib().UC) שמתאימה לכל מה שנלמד; אין ⇒ בונה-הערכים בונה את הלוח
//                  (נשמר במדף רק אחרי שכל הפתרון עבר).
//                  בקוד: הליכה סדרתית על החוליות עם «ספירה-לאחור» D (D=0 ⇒ ביקור, ואז D ⇐ s(x)−1) — אין צורך במקום i.
//   O  מסלולי תמורת-דרגה (רשימה⇒מספר): F(x) = l[r(x)], r(x) = #{y ברשימה: R(y,x)} — R יחס מהמדף (כלי של שניים, בשני הסדרים, ישר/הפוך).
//                  תקף רק אם F תמורה על כל דוגמה. יציאות: מעגלים / נקודות-שבת / n−מעגלים / אורך המסלול של הראשון ⇒ כלי-סיום.
//                  מעגלים בלי סימון-ביקור: סופרים x שהוא הקטן במסלול שלו (הולכים y=F(x) עד שחוזרים; y<x ⇒ לא).
//   M  קיפול מודולרי מעבר ל-4 ביטים (רשימה⇒מספר): r ⇐ r0; לכל x: v ⇐ g(x); r ⇐ (r op v) mod m — op: כפל / חיבור / הורנר r·B+v.
//                  המכפלה בשני תאים (חבר-רחב חוזר), הצמצום בחיסור-רחב חוזר. חריצים: op, m (2..16), r0, B, g (x, 1, כלי-מדף), כלי-סיום.
//   (T — «המקום שבו הסכום חצה סף» — הורחב במקום ב-wide2frames.mjs, שלב מצב-רחב-2.)
// החיפוש: סימולציה ב-JS על ~800 דוגמאות ⇒ רק תוכניות עקביות ⇒ קוד-מכונה ⇒ 60 במכונה ⇒ בודק (300, 600k צעדים) ⇒ 2000 הרצות.
import fs from 'fs'; import { run } from './machine3s.mjs'; import { makeChecker, movable } from './tzoref.mjs'; import { valueBuild, show as showExpr } from './tzoref-value.mjs';
import { scanTools, shift, dataCells, remap } from './scan-tools.mjs'; import { relocate } from './chainsafe.mjs'; import { assemble, JLT, JEQ } from './greedylib.mjs';
import { _test as W2 } from './wide2frames.mjs';
const { ADDW, SUBW, CONST, SET, T_, P_, MV, findPost, postCode, gOptions } = W2;
const R=k=>Math.floor(Math.random()*k); const J=JSON.stringify;
const walk=m=>{ const o=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ o.push(a); a=m[a]; } return o; };
const VALS=[8,9,10,11,12,13,14,15];

// ─── 1. אבני-שלד ─────────────────────────────────────────────────────────────
const P15=[['TAKE'],['TAKE'],['CALC'],['TAKE'],['CALC']];
const GOTO=l=>[...P15,['J',l]];
const INC=c=>[...T_(c),...CONST[1],['ADD'],...P_(c)];
const DEC=c=>[...T_(c),...P15,['ADD'],...P_(c)];
const NEXTX=X=>[...T_(X),['WHERE@'],['GO'],['TAKE'],...P_(X)];      // x ⇐ mem[x]
const UNLINK=(X,PV)=>[...T_(X),['WHERE@'],['GO'],['TAKE'],...T_(PV),['WHERE@'],['GO'],['PUT']];   // mem[PV] ⇐ mem[X]
let UID=0; const lab=s=>'w'+s+(++UID);
// כלי מהמדף במקומו: כניסות ⇒ inCells, יציאה ⇒ outC, תאי-עבודה ⇒ תאים פנויים; אין מספיק ⇒ תאים חיים (וגם תא 1, ראש-הרשימה) נשמרים במחסנית סביבו
const CELLS=[0,2,3,4,5,6,7,1];
function callTool(f,inCells,outC,live){ const map={}; f.ins.forEach((c,i)=>{ map[c]=inCells[i]; }); map[f.out]=outC; const taken=new Set([...inCells,outC]);
  const scratch=dataCells(f.prog).filter(c=>map[c]==null); const free=CELLS.filter(c=>c!==1&&!taken.has(c)&&!live.has(c)), busy=CELLS.filter(c=>!taken.has(c)&&(live.has(c)||c===1)); const save=[];
  for(const c of scratch){ if(free.length) map[c]=free.shift(); else if(busy.length){ const b=busy.shift(); map[c]=b; save.push(b); } else return null; }
  return [...save.flatMap(c=>T_(c)),{code:[['WHERE',0],['GO'],...shift(remap(f.prog,map),2)]},...[...save].reverse().flatMap(c=>P_(c))]; }
const toolOrThrow=(t,what)=>{ if(!t) throw new Error('אין מקום ל-'+what); return t; };

// ─── 2. סגירה מהמדף ⇒ כלי (ביטוי של כלים, משתנה a ⇒ תא 0, תוצאה ⇒ תא 2) ───────────
function compileExpr(e){ const pool=[3,4,5,6,7]; const code=[]; const temps=new Set();
  const emit=x=>{ if(x.v!=null) return 0; const args=x.a.map(emit);
    for(let j=0;j<args.length;j++) if(args.indexOf(args[j])!==j){ const t=pool.shift(); if(t==null) throw new Error('אין תא זמני'); code.push(...MV(args[j],t)); temps.add(t); args[j]=t; }
    const t=pool.shift(); if(t==null) throw new Error('אין תא זמני'); const c=callTool(x.f,args,t,new Set([0,...temps])); if(!c) throw new Error('אין מקום לכלי'); code.push(...c);
    for(const a of args) if(temps.has(a)){ temps.delete(a); pool.unshift(a); } temps.add(t); return t; };
  const r=emit(e); if(r!==2) code.push(...MV(r,2)); return assemble(code); }
// בדיקה — כמו שהמסגרות משתמשות בכלי (callTool: כניסה ⇒ תא אחר, יציאה ⇒ תא אחר, תאי-עבודה ⇒ תאים פנויים, תאים חיים נשמרים במחסנית):
//   נותן את הלוח על המפתחות, לא משנה את הקלט, את התאים החיים ולא את הרשימה (תא 1 ותאים 8..15)
const MAPS=[[3,4,[5]],[5,2,[3,4]],[3,6,[2,4,5]]];
function toolOk(prog,tab,keys=VALS){ const tool={ins:[0],out:2,prog};
  for(const [ic,oc,live] of MAPS){ const c=callTool(tool,[ic],oc,new Set(live)); if(!c) return false; const p=assemble(c);
    for(const v of keys) for(let t=0;t<3;t++){ const m=Array.from({length:16},()=>R(16)); m[ic]=v; const m0=m.slice(); const r=run(p,m,{maxSteps:60000});
      if(!r||r.st.length||(r.mem[oc]&15)!==tab[v]||r.mem[ic]!==v||live.some(c=>r.mem[c]!==m0[c])||[1,...VALS].some(c=>r.mem[c]!==m0[c])) return false; } }
  return true; }
// סגירות חד-מקומיות שהלוח שלהן (על 8..15) בתוך הקבוצות המותרות — מהקטנה לגדולה
let LIBP=null; async function getLib(){ if(!LIBP) LIBP=import('./scanfold.mjs'); const m=await LIBP; return m; }
async function ucCandidates(allowed,{max=4}={}){ const sf=await getLib(); const {UC,IDX,W32}=sf.lib(); const show=sf.show;
  const acc=new Uint32Array(W32).fill(0xffffffff);
  for(const v of VALS){ const m=new Uint32Array(W32); for(const w of allowed[v]) { const b=IDX[(v<<4)|w]; for(let k=0;k<W32;k++) m[k]|=b[k]; } for(let k=0;k<W32;k++) acc[k]&=m[k]; }
  const out=[]; for(let k=0;k<W32&&out.length<max*4;k++){ let m=acc[k]; while(m){ const b=31-Math.clz32(m&-m); m&=m-1; const u=UC[(k<<5)+b]; if(u) out.push(u); } }
  const res=[]; for(const u of out){ if(res.length>=max) break; let prog; try{ prog=u.e.v!=null?null:compileExpr(u.e); }catch{ continue; } if(!prog) continue; const tab=Array.from(u.tab);
    if(!toolOk(prog,tab)) continue; res.push({tool:{ins:[0],out:2,prog,name:show(u.e)},tab,name:show(u.e)}); }
  return res; }
// בונה-הערכים בונה לוח (מפתחות 8..15 ⇒ ערך) — כמו learnLut(..,{bool:false}) ב-rearr
function learnTable(tab,{ms=60000,say=()=>{},tag='צעד'}={}){ const keys=VALS.filter(v=>tab[v]>0);
  const gen=()=>{ const k=keys[R(keys.length)]; const mem=Array.from({length:16},()=>R(16)); mem[0]=k; const w=tab[k]; const m0=mem.slice(); return {mem,want:w,ok:r=>r[2]===w&&r[0]===k&&VALS.every(c=>r[c]===m0[c])}; };
  const name=`${tag}: `+keys.map(k=>`${k}⇐${tab[k]}`).join(',');
  const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const have=sh.named.find(b=>b.name===name);
  if(have){ const prog=relocate(have.prog); if(prog&&toolOk(prog,tab,keys)) return {tool:{ins:[0],out:2,prog,name},tab,name,learned:null}; }
  say(`    בונה-הערכים לומד «${name}»…`); const v=valueBuild(gen,{name,ins:[0],out:2,ms}); if(!v.prog) return null; const prog=relocate(v.prog); if(!prog||!toolOk(prog,tab,keys)) return null;
  return {tool:{ins:[0],out:2,prog,name},tab,name:'נלמד '+(v.expr?showExpr(v.expr):name),learned:{name,prog,gen}}; }
function shelveLearned(L){ if(!L) return; try{ const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); if(sh.named.some(b=>b.name===L.name)) return;
  const tt=Array.from({length:16},(_,x)=>{ const m=Array.from({length:16},()=>R(16)); m[0]=x; const r=run(L.prog,m,{maxSteps:60000}); return r&&!r.st.length?r.mem[2]&15:0; });
  sh.named.push({name:L.name,prog:L.prog,ins:[0],out:2,movable:movable(L.prog,L.gen),by:'נלמד: לוח-צעד (הליכה-בצעד)'}); fs.writeFileSync('shelf3.json',JSON.stringify(sh));
  const LG=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); LG[L.name]={ins:[0],tt}; fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(LG)); }catch{} }

// ─── 3. J — קפיצות ───────────────────────────────────────────────────────────
// מודל ב-JS: s = לוח (0 = לא ידוע ⇒ מחזיר −1−v: הערך שחסר)
const J_OUTS=['cnt','ncnt','last','sum','sumc','over','lidx'];
function simJ(l,s,i0,out,c0){ const n=l.length; let i=i0, cnt=0, sum=0, last=c0, lidx=c0;
  while(i<n){ const v=l[i]; const d=s[v]; if(!d) return -1-v; cnt++; sum+=v; last=v; lidx=i; i+=d; }
  switch(out){ case 'cnt': return cnt; case 'ncnt': return n-cnt; case 'last': return last; case 'sum': return sum&15; case 'sumc': return Math.min(15,sum); case 'over': return (i-n)&15; default: return lidx; } }
function visitedJ(l,s,i0){ const v=[]; let i=i0; while(i<l.length){ v.push(i); i+=s[l[i]]; } return v; }
// חיפוש-עומק על הלוח: הכניסה שמתפצלים עליה = מה שחסר לדוגמה הראשונה (מהקצרות) שלא הושלמה
function dfsSteps(ex,i0,out,c0,{deadline,cap=48,maxNodes=4000}={}){ const s=new Int8Array(16); const sols=[]; let nodes=0, aborted=false; const map=new Int8Array(16);
  const rec=()=>{ if(++nodes>maxNodes||Date.now()>deadline){ aborted=true; return; } map.fill(-1); let need=-1;
    for(const e of ex){ const r=simJ(e.l,s,i0,out,c0); if(r<0){ if(need<0) need=-1-r; continue; } if(map[r]<0) map[r]=e.want; else if(map[r]!==e.want) return; }
    if(need<0){ sols.push(s.slice()); return; }
    for(let v=1;v<=8;v++){ s[need]=v; rec(); if(sols.length>=cap||aborted) break; } s[need]=0; };
  rec(); return {sols,aborted,nodes}; }
// רשימה⇒רשימה: לוח מדויק מזוגות עוקבים + חסם תחתון מהאחרון
function learnJList(ex,i0,comp){ const exact=new Int8Array(16), lb=new Int8Array(16);
  for(const e of ex){ const l=e.l, n=l.length; const V=comp?(()=>{ const k=new Set(e.w); return l.filter(x=>!k.has(x)); })():e.w;
    if(n<=i0){ if(V.length) return null; continue; } if(!V.length||V[0]!==l[i0]) return null;
    const pos=V.map(x=>l.indexOf(x));
    for(let j=0;j+1<V.length;j++){ const d=pos[j+1]-pos[j]; if(d<1) return null; const v=V[j]; if(exact[v]&&exact[v]!==d) return null; exact[v]=d; }
    const v=V.at(-1); lb[v]=Math.max(lb[v],n-pos.at(-1)); }
  for(const v of VALS) if(exact[v]&&exact[v]<lb[v]) return null;
  if(!VALS.some(v=>exact[v])) return null;   // שום קפיצה לא נראתה — אין מה ללמוד
  const allowed={}; for(const v of VALS){ allowed[v]=exact[v]?[exact[v]]:Array.from({length:16-Math.max(1,lb[v])},(_,k)=>Math.max(1,lb[v])+k); }
  const tab=new Int8Array(16); for(const v of VALS) tab[v]=exact[v]||Math.max(1,lb[v]);
  return {exact,lb,allowed,tab}; }
// קוד: X=3 חוליה, D=4 ספירה-לאחור, PV=5 (רשימה: תא-הקישור של הקודם שנשאר) · מספר: N=2 התשובה, H=5/I=5 עזר, S=7
function codeJ(p){ const X=3, D=4; const parts=[...SET(D,p.i0),...MV(1,X)]; const L=lab('L'), B=lab('B'), SK=lab('SK'), NX=lab('NX'), E=lab('E');
  const step=live=>[...toolOrThrow(callTool(p.s.tool,[X],D,new Set(live)),'s'),...DEC(D)];
  if(p.kind==='list'){ const PV=5; const keep=MV(X,PV), drop=UNLINK(X,PV);
    parts.push(...SET(PV,1),L,...T_(X),['J',B],...GOTO(E),
      B,...T_(D),['J',SK],...step([X,PV]),...(p.comp?drop:keep),...GOTO(NX),
      SK,...DEC(D),...(p.comp?keep:drop),
      NX,...NEXTX(X),...GOTO(L),E);
    return assemble(parts); }
  const N=2, H=5, I=5, S=7; const o=p.out;
  parts.push(...SET(N,o==='last'||o==='lidx'?p.c0:0)); if(o==='sumc') parts.push(...SET(H,0)); if(o==='lidx') parts.push(...SET(I,0));
  const live=[X,N,...(o==='sumc'||o==='lidx'?[H]:[])];
  const onVisit=o==='cnt'?INC(N):o==='last'?MV(X,N):o==='sum'?[...T_(N),...T_(X),['ADD'],...P_(N)]:o==='sumc'?ADDW(N,H,X,S):o==='lidx'?MV(I,N):[];
  const onSkip=o==='ncnt'?INC(N):[];
  parts.push(L,...T_(X),['J',B],...GOTO(E),
    B,...T_(D),['J',SK],...onVisit,...step(live),...GOTO(NX),
    SK,...DEC(D),...onSkip,
    NX,...(o==='lidx'?INC(I):[]),...NEXTX(X),...GOTO(L),E);
  if(o==='sumc'){ const OK=lab('ok'); parts.push(...T_(H),['J',OK],...GOTO(OK+'z'),OK,...SET(N,15),OK+'z'); }
  if(o==='over') parts.push(...MV(D,N));
  parts.push(...postCode(p.post,N));
  return assemble(parts); }
const J_DESC={cnt:'כמה ביקורים',ncnt:'כמה לא בוקרו',last:'האחרון שבוקר',sum:'סכום המבוקרים (&15)',sumc:'סכום המבוקרים (רווי)',over:'חריגה בסוף (i−n)',lidx:'המקום של הביקור האחרון'};
const postDesc=post=>!post||post.kind==='id'?'':post.kind==='const2'?` ⇒ ${post.a} : ${post.b}`:post.kind==='tool'?` ⇒ ${post.name}`:' ⇒ [לוח שנלמד]';
const descJ=p=>`קפיצות: מתחילים ב-${p.i0}, צעד ${p.s.name} ⇒ ${p.kind==='list'?(p.comp?'מי שלא בוקר':'מי שבוקר'):J_DESC[p.out]+(p.out==='last'||p.out==='lidx'?` (אין ⇒ ${p.c0})`:'')+postDesc(p.post)}`;

// ─── 4. O — מסלולי תמורת-דרגה ────────────────────────────────────────────────
// יחסים R(y,x) מכלי-שניים במדף (שני הסדרים), «לא-אפס» = אמת, ישר או הפוך — בלי כפילויות (לפי הלוח על 8..15)
function relationsOf(B){ const out=[], seen=new Set();
  for(const f of B) for(const order of ['yx','xy']) for(const neg of [false,true]){ const T=new Int8Array(256); let ok=true; let sig='';
    for(const y of VALS) for(const x of VALS){ const v=order==='yx'?f.T[(y<<4)|x]:f.T[(x<<4)|y]; if(v<0){ ok=false; break; } const b=((v!==0)!==neg)?1:0; T[(y<<4)|x]=b; sig+=b; }
    if(!ok||seen.has(sig)) continue; seen.add(sig); out.push({f,order,neg,T,name:`${f.name}${order==='xy'?' (x,y)':''}${neg?' (הפוך)':''}`,cost:f.prog.length/500+(order==='xy'?0.05:0)+(neg?0.1:0)}); }
  return out; }
function permOf(l,rel){ const n=l.length; const F=new Map(); const used=new Set();
  for(const x of l){ let r=0; for(const y of l) r+=rel.T[(y<<4)|x]; if(r>=n||used.has(r)) return null; used.add(r); F.set(x,l[r]); } return F; }
const O_OUTS=['cyc','ncyc','fix','orb0'];
function simO(l,F,out){ if(out==='orb0'){ if(!l.length) return 0; let y=F.get(l[0]), k=1; while(y!==l[0]){ y=F.get(y); k++; } return k; }
  let c=0; for(const x of l){ if(out==='fix'){ if(F.get(x)===x) c++; continue; } let y=F.get(x), mn=true; while(y!==x){ if(y<x){ mn=false; break; } y=F.get(y); } if(mn===(out==='cyc')) c++; } return c; }
// קוד: N=2 X=3 Y=4 Z=5 K=6 C=7 (0 = פנוי לכלי)
function codeO(p){ const N=2, X=3, Y=4, Z=5, K=6, C=7; const rel=p.rel;
  const FY=()=>{ const RL=lab('RL'), RB=lab('RB'), RI=lab('RI'), RN=lab('RN'), RD=lab('RD'), WL=lab('WL'), WB=lab('WB'), WD=lab('WD');
    const args=rel.order==='yx'?[Z,Y]:[Y,Z]; const t=toolOrThrow(callTool(rel.f,args,C,new Set([N,X,Y,Z,K])),'R');
    return [...SET(K,0),...MV(1,Z),
      RL,...T_(Z),['J',RB],...GOTO(RD),
      RB,...t,...T_(C),['J',rel.neg?RN:RI],...GOTO(rel.neg?RI:RN),
      RI,...INC(K),
      RN,...NEXTX(Z),...GOTO(RL),
      RD,...MV(1,Z),
      WL,...T_(K),['J',WB],...GOTO(WD),
      WB,...NEXTX(Z),...DEC(K),...GOTO(WL),
      WD,...MV(Z,Y)]; };
  const parts=[...SET(N,0)]; const E=lab('E');
  if(p.out==='orb0'){ const G=lab('G'), IL=lab('IL'); parts.push(...T_(1),['J',G],...GOTO(E),G,...MV(1,X),...MV(X,Y),IL,...FY(),...INC(N),...JEQ(Y,X,C,E),...GOTO(IL)); }
  else { const OL=lab('OL'), OB=lab('OB'), IL=lab('IL'), CNT=lab('CNT'), NX=lab('NX'), NM=lab('NM');
    parts.push(...MV(1,X),OL,...T_(X),['J',OB],...GOTO(E),OB,...MV(X,Y));
    if(p.out==='fix') parts.push(...FY(),...JEQ(Y,X,C,CNT),...GOTO(NX));
    else parts.push(IL,...FY(),...JEQ(Y,X,C,p.out==='cyc'?CNT:NX),...JLT(Y,X,C,p.out==='cyc'?NX:CNT),...GOTO(IL));
    parts.push(CNT,...INC(N),NX,...NEXTX(X),...GOTO(OL)); }
  parts.push(E,...postCode(p.post,N)); return assemble(parts); }
const O_DESC={cyc:'מספר המעגלים',ncyc:'n פחות מספר המעגלים',fix:'נקודות-שבת',orb0:'אורך המסלול של הראשון'};
const descO=p=>`תמורת-דרגה: F(x)=l[#y: ${p.rel.name}(y,x)] ⇒ ${O_DESC[p.out]}${postDesc(p.post)}`;

// ─── 5. M — קיפול מודולרי ────────────────────────────────────────────────────
const modStep=(r,v,p)=>{ const z=p.op==='mul'?r*v:p.op==='add'?r+v:r*p.B+v; return z%p.m; };
// קוד: R=2 (המצב), X=3, L=4, H=5 (מכפלה רחבה), V=6 (g(x), אחר כך המודולוס), K=7 (מונה להורנר), S=0
function codeM(p){ const Rc=2, X=3, L=4, H=5, V=6, K=7, S=0; const LP=lab('LP'), BD=lab('BD'), RED=lab('RED'), E=lab('E');
  const g=p.g.kind==='x'?MV(X,V):p.g.kind==='one'?SET(V,1):toolOrThrow(callTool(p.g.tool,[X],V,new Set([X,Rc])),'g');
  const parts=[...SET(Rc,p.r0),...MV(1,X),LP,...T_(X),['J',BD],...GOTO(E),BD,...g];
  if(p.op==='mul'){ const ML=lab('ML'), MB=lab('MB'); parts.push(...SET(L,0),...SET(H,0),ML,...T_(V),['J',MB],...GOTO(RED),MB,...ADDW(L,H,Rc,S),...DEC(V),...GOTO(ML)); }
  else if(p.op==='add') parts.push(...MV(Rc,L),...SET(H,0),...ADDW(L,H,V,S));
  else { const HL=lab('HL'), HB=lab('HB'); parts.push(...MV(V,L),...SET(H,0),...SET(K,p.B),HL,...T_(K),['J',HB],...GOTO(RED),HB,...ADDW(L,H,Rc,S),...DEC(K),...GOTO(HL)); }
  parts.push(RED); if(p.m===16) parts.push(...MV(L,Rc)); else { const RL=lab('RL'), RD=lab('RD'); parts.push(...SET(V,p.m),RL,...SUBW(L,H,V,S,RD),...GOTO(RL),RD,...MV(L,Rc)); }
  parts.push(...NEXTX(X),...GOTO(LP),E,...postCode(p.post,Rc)); return assemble(parts); }
const descM=p=>`קיפול מודולרי: r⇐${p.r0}; r⇐(${p.op==='mul'?'r·v':p.op==='add'?'r+v':`r·${p.B}+v`}) mod ${p.m}, v=${p.g.name}${postDesc(p.post)}`;

// ─── 6. התוכניות (סימולציה) ──────────────────────────────────────────────────
const edge=(ex,cond)=>{ let e=null; for(const x of ex) if(cond(x.l)){ if(e==null) e=x.want; else if(e!==x.want) return null; } return e??0; };
async function plansList(ex,{say,DEAD}){ const out=[];
  // שער: הפלט תת-סדרה של הקלט
  const isSub=(l,w)=>{ let j=0; for(const x of l) if(j<w.length&&w[j]===x) j++; return j===w.length; };
  if(!ex.every(e=>isSub(e.l,e.w))) return out;
  for(const comp of [false,true]) for(const i0 of [0,1,2]){ const T=learnJList(ex,i0,comp); if(!T) continue;
    say(`  הליכה/J: i0=${i0} ${comp?'משלים':'מבוקרים'} — לוח מדויק ${VALS.filter(v=>T.exact[v]).map(v=>v+':'+T.exact[v]).join(' ')}`);
    const fitsS=tab=>ex.every(e=>{ const v=visitedJ(e.l,tab,i0); const keep=comp?e.l.filter((x,j)=>!v.includes(j)):v.map(j=>e.l[j]); return J(keep)===J(e.w); });
    if(!fitsS(T.tab)) continue;
    const cands=await ucCandidates(T.allowed,{max:3}); for(const c of cands){ if(!fitsS(c.tab)) continue; out.push({fr:'J',kind:'list',i0,comp,s:c,cost:1+i0*0.1+(comp?0.2:0)}); }
    out.push({fr:'J',kind:'list',i0,comp,s:{needLearn:true,tab:Array.from(T.tab)},cost:5+i0*0.1+(comp?0.2:0)}); }
  return out; }
async function plansNum(ex,{U,say,DEAD}){ const out=[]; const W=ex.map(e=>e.want); const byLen=[...ex].sort((a,b)=>a.l.length-b.l.length);
  if(new Set(W).size<2) return out;
  const add=(plan,raw,cost)=>{ const post=findPost(raw,W,U,false); if(post) out.push({...plan,post,cost:cost+post.cost}); };
  // J
  const t0=Date.now(); const dl=Math.min(DEAD,t0+2500);
  for(const i0 of [0,1,2]) for(const o of J_OUTS){ if(Date.now()>dl) break; const c0=o==='last'||o==='lidx'?edge(ex,l=>l.length<=i0):0; if(c0==null) continue;
    const {sols,aborted}=dfsSteps(byLen,i0,o,c0,{deadline:Math.min(dl,Date.now()+400)}); if(!sols.length) continue;
    say(`  הליכה/J: i0=${i0} ${o} — ${sols.length}${aborted?'+':''} לוחות עקביים · ${sols[0].slice(8).join(',')}`);
    const allowed={}; for(const v of VALS){ const set=new Set(); for(const s of sols){ if(s[v]>=8) for(let w=8;w<16;w++) set.add(w); else set.add(s[v]); } allowed[v]=[...set]; }
    const rawOf=tab=>ex.map(e=>simJ(e.l,tab,i0,o,c0));
    const cands=await ucCandidates(allowed,{max:3}); for(const c of cands){ const tab=new Int8Array(16); for(const v of VALS) tab[v]=c.tab[v]; const raw=rawOf(tab); if(raw.some(r=>r<0)) continue; add({fr:'J',kind:'num',i0,out:o,c0,s:c},raw,1+i0*0.1+J_OUTS.indexOf(o)*0.05); }
    for(const s of sols.slice(0,2)){ const raw=rawOf(s); add({fr:'J',kind:'num',i0,out:o,c0,s:{needLearn:true,tab:Array.from(s)}},raw,5+i0*0.1+J_OUTS.indexOf(o)*0.05); } }
  // M
  const G=gOptions(U); const mp=new Int8Array(16);
  const fitM=(p,gv)=>{ mp.fill(-1); for(let k=0;k<byLen.length;k++){ const e=byLen[k], v=gv[k]; let r=p.r0; for(let j=0;j<v.length;j++) r=modStep(r,v[j],p); if(mp[r]<0) mp[r]=e.want; else if(mp[r]!==e.want) return false; } return true; };
  for(const g of G){ if(Date.now()>DEAD) break; const gv=byLen.map(e=>e.l.map(g.f)); if(gv.some(v=>v.some(x=>x<0))) continue;
    for(const op of ['mul','add','horner']) for(let m=2;m<=16;m++) for(let r0=0;r0<16;r0++) for(const B of op==='horner'?[2,3,4,5,6,7,8,9,10,11,12,13,14,15]:[0]){
      const p={fr:'M',op,m,r0,B,g}; if(!fitM(p,gv)) continue;
      const raw=ex.map(e=>{ let r=r0; for(const x of e.l) r=modStep(r,g.f(x),p); return r; }); add(p,raw,2+g.cost+(op==='horner'?0.3:op==='add'?0.1:0)+m/1000+r0/10000); } }
  // O
  const {B}=scanTools(); const RELS=relationsOf(B);
  for(const rel of RELS){ if(Date.now()>DEAD) break; const Fs=[]; let ok=true; for(const e of byLen){ const F=permOf(e.l,rel); if(!F){ ok=false; break; } Fs.push(F); } if(!ok) continue;
    const Fx=new Map(byLen.map((e,k)=>[e,Fs[k]]));
    for(const o of O_OUTS) add({fr:'O',rel,out:o},ex.map(e=>simO(e.l,Fx.get(e),o)),3+rel.cost+O_OUTS.indexOf(o)*0.05); }
  return out.sort((a,b)=>a.cost-b.cost); }

// ─── 7. המרכיב ───────────────────────────────────────────────────────────────
const CODE={J:codeJ,O:codeO,M:codeM}, DESC={J:descJ,O:descO,M:descM};
export async function walkCompose(gen,{N=800,ms=+process.env.WALKMS||120000,say=()=>{},maxTry=24}={}){ const T0=Date.now(), DEAD=T0+ms;
  const raw=Array.from({length:N},()=>gen()); const isList=typeof raw[0].want==='string';
  let ex; try{ ex=raw.map(e=>({l:walk(e.mem),want:e.want,w:isList?JSON.parse(e.want):null,e})); }catch{ return {prog:null,cands:0,ms:Date.now()-T0}; }
  if(isList&&!ex.every(x=>Array.isArray(x.w)&&x.w.every(v=>Number.isInteger(v)))) return {prog:null,cands:0,ms:Date.now()-T0};
  const {U}=scanTools();
  const plans=isList?await plansList(ex,{say,DEAD}):await plansNum(ex,{U,say,DEAD});
  say(`הליכה-בצעד: ${plans.length} מועמדים מהסימולציה · ${((Date.now()-T0)/1000).toFixed(1)} שנ׳`);
  if(!plans.length) return {prog:null,cands:0,ms:Date.now()-T0};
  let chk=null, tried=0; const seen=new Set();
  for(let p of plans){ if(Date.now()>DEAD||tried>=maxTry) break;
    let learned=null;
    try{
      if(p.s&&p.s.needLearn){ if(DEAD-Date.now()<8000) continue; const L=learnTable(p.s.tab,{ms:Math.min(90000,DEAD-Date.now()-3000),say}); if(!L) continue; learned=L.learned; p={...p,s:L}; }
      if(p.post&&p.post.kind==='vb'){ if(DEAD-Date.now()<8000) continue; const keys=p.post.keys, tab=p.post.tab;
        const g=()=>{ const k=keys[R(keys.length)]; const m=Array.from({length:16},()=>R(16)); m[3]=k; const w=tab[k]; return {mem:m,want:w,ok:r=>r[2]===w&&r[3]===k}; };
        const v=valueBuild(g,{name:'סיום (הליכה-בצעד)',ins:[3],out:2,ms:Math.min(60000,DEAD-Date.now()-3000)}); if(!v.prog) continue;
        p={...p,post:{kind:'tool',tool:{ins:[3],out:2,prog:v.prog,name:'לוח שנלמד'},name:'לוח שנלמד'}}; }
    }catch(err){ say('  חריץ: '+err.message); continue; }
    let prog; try{ prog=CODE[p.fr](p); }catch(err){ say('  קוד: '+err.message); continue; }
    const key=J(prog); if(seen.has(key)) continue; seen.add(key); tried++;
    const bad=ex.slice(0,60).filter(f=>{ const r=run(prog,f.e.mem,{maxSteps:600000}); return !r||r.st.length||!f.e.ok(r.mem); }).length;
    if(bad){ say(`  ✗ במכונה (${bad}/60): ${DESC[p.fr](p)}`); continue; }
    chk=chk||makeChecker(gen,300,600000); if(!chk(prog)){ say('  ✗ בבודק: '+DESC[p.fr](p)); continue; }
    let b2=0; for(let k=0;k<2000&&!b2;k++){ const e=gen(); const r=run(prog,e.mem,{maxSteps:600000}); if(!r||r.st.length||!e.ok(r.mem)) b2++; }
    if(b2){ say('  ✗ בבדיקה (2000): '+DESC[p.fr](p)); continue; }
    shelveLearned(learned);
    return {prog,how:'הליכה-בצעד: '+DESC[p.fr](p),cands:plans.length,tried,ms:Date.now()-T0}; }
  return {prog:null,cands:plans.length,tried,ms:Date.now()-T0}; }
export const _walk={simJ,dfsSteps,learnJList,codeJ,codeO,codeM,relationsOf,permOf,simO,compileExpr,ucCandidates};
