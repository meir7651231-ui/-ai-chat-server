// «מצב-רחב 2» (wide2frames.mjs, KEY=wide2): עוד מסגרות על מצב של שני תאים (נמוך L + גבוה H = מספר 0..255).
// אני כותב רק שלד + חיפוש; מה שנכנס לחריצים — המכונה בוחרת מהדוגמאות (כלים מהמדף / קבועים / לוח שנלמד ונבנה ע"י בונה-הערכים).
// אבני-שלד חדשות: «חבר-רחב» ADDW ו«חסר-רחב» SUBW — חיבור/חיסור של תא שלם בפעם אחת (הנשא/השאילה מחושבים ב«לא-וגם» ו«הזז ימינה»),
//   במקום יחידה-יחידה. SUBW קופץ ל«חריגה» לפני שהוא משנה משהו (כך אין צורך בעותק).
// המסגרות:
//   חלוקה-עם-היסט (רשימה⇒מספר): S ⇐ c0 + Σg(x) ⇒ ⌊S/d⌋ (d קבוע או n; c0 קבוע, n−1 או ⌊n/2⌋) — עיגול למעלה / לקרוב.
//   חוצה-סף (רשימה⇒מספר): תקציב K, מחסרים g(x) — האיבר שבו הסכום הרץ עבר את K (אחרת 0) ⇒ כלי-סיום.
//   שני-חלקים (שתיהן): D ⇐ בסיס + Σg(הראשונים k1) − Σg(מאחרי k2), k = ⌊n/2⌋ או ⌈n/2⌉.
//            רשימה⇒מספר: |A−B| (רווי ב-15) / A≥B? / A>B?  ·  רשימה⇒רשימה: לפי A≥B (או A>B) — השאר את הראשונים k1 או את מה שאחרי k2.
//   ממוצע-רץ (שתיהן): D ⇐ בסיס + Σ(g(x) − c); איבר «עובר» אם D נשאר ≥ בסיס (ממוצע ≥ c, או > c) · הראשון חופשי? (חריץ)
//            רשימה⇒רשימה: קח-כל-עוד / דלג / הוצא-כל-עוד · רשימה⇒מספר: כמה נלקחו.
//   קיצוץ (שתיהן): כל עוד Σg > K — מוציאים את האיבר שנבחר בקיפול f (ראשון / אחרון / כלי-בחירה מהמדף: מקסימום, מינימום…).
//            רשימה⇒מספר: כמה הוצאו / כמה נשארו (הרשימה משתנה ⇒ המוח עוטף ב«שומר-רשימה»).
//   מול-הממוצע (שתיהן): לכל איבר — Σ_y m·(g(x)−g(y)) + w·n מול 0 (או פס |·| ≤ w·n) ⇒ כמה / השאר-הוצא (הדגלים נשמרים במחסנית).
//   תנאי-ממוצע (שתיהן): ממוצע הרשימה מול c2/2 ⇒ הנבחר בקיפול f1 או f2 (רשימה⇒רשימה: מוציאים אותו).
//   מיכלים-לפי-הסדר (רשימה⇒מספר): כמה מיכלים של K · תקציב-יחסי (שתיהן): m2·קידומת ≤ m1·Σ ⇒ כמה / האיבר שעבר / קח-הוצא-כל-עוד.
//   ועוד יציאות: S mod d · האחרון שנכנס · max(0,A−B) · האיבר שבו הממוצע-הרץ ירד.
// החיפוש: סימולציה ב-JS על 1000 דוגמאות; רק מה שמתאים לכולן מורכב לקוד-מכונה ונבדק במכונה (60 ⇒ בודק ⇒ 2000).
import { run } from './machine3s.mjs'; import { makeChecker, finalCheck } from './tzoref.mjs';
import { scanTools, shift, dataCells, remap } from './scan-tools.mjs'; import { assemble } from './posframes.mjs';
import { valueBuild } from './tzoref-value.mjs';
const R=k=>Math.floor(Math.random()*k); const J=JSON.stringify;
const walk=m=>{ const o=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ o.push(a); a=m[a]; } return o; };

// ─── 1. אבני-השלד ────────────────────────────────────────────────────────────
const G_=c=>[['WHERE',c],['GO']], T_=c=>[...G_(c),['TAKE']], P_=c=>[...G_(c),['PUT']], MV=(a,b)=>[...T_(a),...P_(b)];
const P15=[['TAKE'],['TAKE'],['CALC'],['TAKE'],['CALC']];   // לא-וגם(לא v, v) = 15 מכל תא
const GOTO=l=>[...P15,['J',l]];
const CONST=(()=>{ const best=new Array(16).fill(null); const q=[{st:[],code:[]}]; const seen=new Set(['']);
  while(q.length){ const n=q.shift(); if(n.st.length===1&&!best[n.st[0]]) best[n.st[0]]=n.code; if(best.every(Boolean)) break; const nx=[];
    if(n.st.length<3) nx.push({st:[...n.st,15],code:[...n.code,...P15]});
    if(n.st.length>=1) nx.push({st:[...n.st.slice(0,-1),n.st.at(-1)>>1],code:[...n.code,['SHR']]});
    if(n.st.length>=2){ const a=n.st.at(-2), b=n.st.at(-1); nx.push({st:[...n.st.slice(0,-2),(a+b)&15],code:[...n.code,['ADD']]}); nx.push({st:[...n.st.slice(0,-2),~(a&b)&15],code:[...n.code,['CALC']]}); }
    for(const m of nx){ const k=m.st.join(','); if(seen.has(k)||m.code.length>40) continue; seen.add(k); q.push(m); } q.sort((a,b)=>a.code.length-b.code.length); }
  return best; })();
const SET=(c,k)=>[...G_(c),...CONST[k&15],...P_(c)];
const INC=c=>[...T_(c),...CONST[1],['ADD'],...P_(c)];
const DEC=c=>[...T_(c),...P15,['ADD'],...P_(c)];
const NEXTX=X=>[...T_(X),['WHERE@'],['GO'],['TAKE'],...P_(X)];      // x ⇐ mem[x]
const BIT3=c=>[...T_(c),['SHR'],['SHR'],['SHR']];                   // דוחף 1 אם c ≥ 8
let UID=0;
// (lo,hi) ⇐ (lo,hi) + c   · s = תא-עזר.  נשא = ביט 3 של רוב(lo, c, לא s)
const ADDW=(lo,hi,c,s)=>[...T_(lo),...T_(c),['ADD'],...P_(s),
  ...T_(lo),...T_(c),['CALC'], ...T_(lo),...T_(lo),['CALC'],...T_(c),...T_(c),['CALC'],['CALC'], ...T_(s),...T_(s),['CALC'],['CALC'],['CALC'],
  ['SHR'],['SHR'],['SHR'],...T_(hi),['ADD'],...P_(hi), ...MV(s,lo)];
// (lo,hi) ⇐ (lo,hi) − c; אם יוצא שלילי ⇒ קפוץ ל-under בלי לשנות דבר.  שאילה = ביט 3 של רוב(לא lo, c, d)
const SUBW=(lo,hi,c,s,under)=>{ const u=++UID, B='sb'+u, HD='sh'+u, NB='sn'+u;
  return [...T_(c),...T_(c),['CALC'],...CONST[1],['ADD'],...T_(lo),['ADD'],...P_(s),
    ...T_(lo),...T_(lo),['CALC'],...T_(c),['CALC'], ...T_(lo),...T_(c),...T_(c),['CALC'],['CALC'], ...T_(s),['CALC'],['CALC'],
    ['SHR'],['SHR'],['SHR'],['J',B],...GOTO(NB),
    B,...T_(hi),['J',HD],...GOTO(under),
    HD,...DEC(hi),
    NB,...MV(s,lo)]; };
const INC2=(lo,hi)=>{ const u=++UID, DN='in'+u; return [...INC(lo),...T_(lo),['J',DN],...INC(hi),DN]; };
const DEC1W=(lo,hi)=>{ const u=++UID, NB='dn'+u; return [...T_(lo),['J',NB],...DEC(hi),NB,...DEC(lo)]; };
// קפוץ ל-lab אם תא a ≠ תא b (XOR מ«לא-וגם»; s = עזר)
const JNE=(a,b,s,lab)=>[...T_(a),...T_(b),['CALC'],...P_(s),...T_(a),...T_(s),['CALC'],...T_(b),...T_(s),['CALC'],['CALC'],['J',lab]];
// כלי מהמדף במקומו: כניסות ⇒ inCells, יציאה ⇒ outC, תאי-עבודה ⇒ תאים פנויים (או תאים חיים שנשמרים במחסנית סביבו)
function callTool(f,inCells,outC,live){ const map={}; f.ins.forEach((c,i)=>{ map[c]=inCells[i]; }); map[f.out]=outC; const taken=new Set([...inCells,outC]);
  const scratch=dataCells(f.prog).filter(c=>map[c]==null); const cells=[0,2,3,4,5,6,7]; const free=cells.filter(c=>!taken.has(c)&&!live.has(c)), busy=cells.filter(c=>!taken.has(c)&&live.has(c)); const save=[];
  for(const c of scratch){ if(free.length) map[c]=free.shift(); else if(busy.length){ const b=busy.shift(); map[c]=b; save.push(b); } else return null; }
  return [...save.flatMap(c=>T_(c)),{code:[['WHERE',0],['GO'],...shift(remap(f.prog,map),2)]},...[...save].reverse().flatMap(c=>P_(c))]; }
const gCode=(g,X,C,live)=>{ if(g.kind==='x') return MV(X,C); if(g.kind==='one') return SET(C,1); const t=callTool(g.tool,[X],C,live); if(!t) throw new Error('אין מקום ל-g'); return t; };
// כלי-סיום על הערך-הגולמי שבתא raw ⇒ תא 2
function postCode(post,raw){ if(post.kind==='id') return raw===2?[]:MV(raw,2);
  if(post.kind==='const2'){ const u=++UID; return [...T_(raw),['J','pa'+u],...SET(2,post.b),...GOTO('pz'+u),'pa'+u,...SET(2,post.a),'pz'+u]; }
  let pre=[], src=raw; if(raw===2){ pre=MV(2,3); src=3; } const c=callTool(post.tool,[src],2,new Set()); if(!c) throw new Error('אין מקום לכלי-הסיום'); return [...pre,...c]; }
const kOf=(N,kind)=>kind==='c'?[...T_(N),...CONST[1],['ADD'],['SHR']]:[...T_(N),['SHR']];   // ⌈n/2⌉ / ⌊n/2⌋ (דוחף)
const XAT=Pc=>[...T_(Pc),['WHERE@'],['GO'],['TAKE']];             // דוחף mem[mem[Pc]]
const AT=Pc=>[...T_(Pc),['WHERE@'],['GO']];                         // P ⇐ mem[Pc]

// ─── 2. הקוד ─────────────────────────────────────────────────────────────────
// שני-חלקים: סופר n, k1/k2, ואז הליכה אחת: k1 הראשונים נכנסים ל-D (+), כל מה שאחרי k2 יוצא מ-D (−).  תאים: C0 X3 L4 H5 K1=6 K2=7 S2
function halvesCore(p){ const C=0, X=3, L=4, H=5, K1=6, K2=7, S=2;
  return [...SET(K1,0),...MV(1,X),
    'HC',...T_(X),['J','HCB'],...GOTO('HCE'),
    'HCB',...INC(K1),...NEXTX(X),...GOTO('HC'),
    'HCE',...kOf(K1,p.k2),...P_(K2),...kOf(K1,p.k1),...P_(K1),
    ...SET(L,p.base&15),...SET(H,p.base>>4),...MV(1,X),
    'HL',...T_(X),['J','HB'],...GOTO('HEND'),
    'HB',...gCode(p.g,X,C,new Set([X,L,H,K1,K2])),
    ...T_(K1),['J','HA'],...GOTO('HSA'),
    'HA',...ADDW(L,H,C,S),...DEC(K1),
    'HSA',...T_(K2),['J','HSB'],...SUBW(L,H,C,S,'HEND'),...GOTO('HNX'),
    'HSB',...DEC(K2),
    'HNX',...NEXTX(X),...GOTO('HL'),
    'HEND']; }
// ממוצע-רץ: איבר אחד — C ⇐ g(x), D ⇐ D + C − c; «עובר» אם D ≥ 128 (ביט 3 של H).  KC = תא הקבוע c
function meanStep(p,xc,xcell,C,L,H,KC,S,live,fit,cross){ return [...xc,...gCode(p.g,xcell,C,live),...ADDW(L,H,C,S),...SUBW(L,H,KC,S,cross),...BIT3(H),['J',fit],...GOTO(cross)]; }
// מול-הממוצע: לכל איבר x — D = בסיס + Σ_y (m·(g(x)−g(y)) + w)  (m = 1 או 2: חצאי-יחידות), «כן» אם D ≥ 128;
//   פס (band): גם D − Σ_y 2w ≤ 128, כלומר |m·(n·g(x) − Σg)| ≤ w·n.  קופץ ל-yes / no.  g=x ⇒ קוראים את X/Y ישירות (בלי העתקה)
function vsCond(p,X,Y,L,H,S,C,live,yes,no){ const u=++UID, E='ve'+u; const direct=p.g.kind==='x';
  const tx=direct?[]:gCode(p.g,X,C,live), ty=direct?[]:gCode(p.g,Y,C,live), cx=direct?X:C, cy=direct?Y:C;
  const add=[...tx,...ADDW(L,H,cx,S),...(p.m===2?ADDW(L,H,cx,S):[])], sub=[...ty,...SUBW(L,H,cy,S,E),...(p.m===2?SUBW(L,H,cy,S,E):[])];
  const wt=p.w>0?[...SET(C,p.w),...ADDW(L,H,C,S)]:p.w<0?[...SET(C,-p.w),...SUBW(L,H,C,S,E)]:[];
  const out=[...SET(L,p.base&15),...SET(H,p.base>>4),...MV(1,Y),
    'vi'+u,...T_(Y),['J','vb'+u],...GOTO(E),
    'vb'+u,...add,...sub,...wt,...NEXTX(Y),...GOTO('vi'+u),
    E,...BIT3(H)];
  if(!p.band) return [...out,['J',yes],...GOTO(no)];
  return [...out,['J','vc'+u],...GOTO(no),
    'vc'+u,...SET(C,2*p.w),...MV(1,Y),
    'vj'+u,...T_(Y),['J','vk'+u],...GOTO('vl'+u),
    'vk'+u,...SUBW(L,H,C,S,no),...NEXTX(Y),...GOTO('vj'+u),
    'vl'+u,...DEC1W(L,H),...BIT3(H),['J',no],...GOTO(yes)]; }
// תנאי-ממוצע על כל הרשימה: D = בסיס + Σ (2·g(x) − c2)  ⇒ «כן» אם D ≥ 128 (ממוצע ≥ c2/2, או > עם בסיס 127)
function meanAll(p,X,C,L,H,S,yes,no){ const u=++UID;
  return [...SET(L,p.base&15),...SET(H,p.base>>4),...MV(1,X),
    'ma'+u,...T_(X),['J','mb'+u],...GOTO('mc'+u),
    'mb'+u,...gCode(p.g,X,C,new Set([X,L,H])),...ADDW(L,H,C,S),...ADDW(L,H,C,S),...SET(C,p.c2>>1),...SUBW(L,H,C,S,'mc'+u),...SET(C,p.c2-(p.c2>>1)),...SUBW(L,H,C,S,'mc'+u),...NEXTX(X),...GOTO('ma'+u),
    'mc'+u,...BIT3(H),['J',yes],...GOTO(no)]; }
// קיפול-בחירה: M ⇐ הראשון; לכל איבר הבא: M ⇐ f(M, x)  (ראשון / אחרון / כלי-בחירה מהמדף)
function foldSel(f,X,M,C,live=new Set([X,M])){ const u=++UID; const step=f.kind==='first'?[]:f.kind==='last'?MV(X,M):(()=>{ const t=callTool(f.tool,[M,X],C,live); if(!t) throw new Error('אין מקום ל-f'); return [...t,...MV(C,M)]; })();
  return [...MV(1,M),...T_(M),['WHERE@'],['GO'],['TAKE'],...P_(X),
    'fl'+u,...T_(X),['J','fb'+u],...GOTO('fe'+u),
    'fb'+u,...step,...NEXTX(X),...GOTO('fl'+u),
    'fe'+u]; }
// הוצא את M מהרשימה (חוליה Pc עוברת עד שמוצאים את M)
function unlinkVal(M,Pc,C,S,done){ const u=++UID;
  return [...SET(Pc,1),
    'ul'+u,...XAT(Pc),...P_(C),...JNE(C,M,S,'un'+u),
    ...T_(M),['WHERE@'],['GO'],['TAKE'],...AT(Pc),['PUT'],...GOTO(done),
    'un'+u,...MV(C,Pc),...GOTO('ul'+u)]; }
// סכום כל הרשימה, m1 פעמים, לתוך (L,H); קפדני ⇒ פחות 1.  X = הולך על הרשימה
function relTotal(p,X,C,L,H,S){ const u=++UID;
  return [...SET(L,0),...SET(H,0),...MV(1,X),
    'rt'+u,...T_(X),['J','rb'+u],...GOTO('re'+u),
    'rb'+u,...gCode(p.g,X,C,new Set([X,L,H])),...Array.from({length:p.m1},()=>ADDW(L,H,C,S)).flat(),...NEXTX(X),...GOTO('rt'+u),
    're'+u,...(p.strict?DEC1W(L,H):[])]; }
export function codeNum(p){ const parts=[];
  if(p.fr==='updiv'){ const C=0, X=3, L=4, H=5, N=6, S=7, Q=2;
    parts.push(...SET(L,typeof p.off==='number'?p.off:0),...SET(H,0),...SET(N,0),...MV(1,X),
      'LOOP',...T_(X),['J','BODY'],...GOTO('END'),
      'BODY',...gCode(p.g,X,C,new Set([X,L,H,N])),...ADDW(L,H,C,S),...INC(N),...NEXTX(X),...GOTO('LOOP'),
      'END');
    if(p.off==='n1') parts.push(...T_(N),...P15,['ADD'],...P_(C),...ADDW(L,H,C,S));
    if(p.off==='nh') parts.push(...T_(N),['SHR'],...P_(C),...ADDW(L,H,C,S));
    const Dc=p.d==='n'?N:X; if(p.d!=='n') parts.push(...SET(X,p.d));
    parts.push(...SET(Q,0),...T_(Dc),['J','DIV'],...GOTO('OUT'),
      'DIV',...SUBW(L,H,Dc,S,'OUT'),...INC(Q),...GOTO('DIV'),
      'OUT',...postCode(p.post,p.out==='rem'?L:Q));   // rem: מה שנשאר אחרי החלוקה (S mod d)
    return assemble(parts); }
  if(p.fr==='stopx'){ const C=0, X=3, L=4, H=5, M=6, S=7; const out=p.out||'xc';   // xc: האיבר שעבר · xp: האחרון שנכנס (גם אם אף אחד לא עבר) · xp0: האחרון שנכנס, ו-0 אם לא עבר
    parts.push(...SET(L,p.K&15),...SET(H,p.K>>4),...SET(M,0),...MV(1,X),
      'LOOP',...T_(X),['J','BODY'],...GOTO('NONE'),
      'BODY',...gCode(p.g,X,C,new Set([X,L,H,M])),...SUBW(L,H,C,S,'CROSS'),...MV(X,M),...NEXTX(X),...GOTO('LOOP'),
      'CROSS',...MV(out==='xc'?X:M,2),...GOTO('OUT'),
      'NONE',...(out==='xp'?MV(M,2):SET(2,0)),
      'OUT',...postCode(p.post,2));
    return assemble(parts); }
  if(p.fr==='half'){ const L=4, H=5, K1=6;
    parts.push(...halvesCore(p));
    if(p.out==='flag') parts.push(...BIT3(H),...P_(2),...postCode(p.post,2));
    else parts.push(...SET(K1,15),...BIT3(H),['J','POS'],...GOTO('NEG'),   // |D−128| רווי: צעדים אל 128, עד 15
      ...(p.out==='neg'?['POS',...GOTO('FIN')]:['POS',...T_(L),['J','PG'],...T_(H),...CONST[8],['ADD'],['J','PG'],...GOTO('FIN'),
      'PG',...T_(K1),['J','PG2'],...GOTO('FIN'),'PG2',...DEC(K1),...DEC1W(L,H),...GOTO('POS')]),   // pos: A−B רווי (ו-0 אם שלילי) · neg: B−A
      ...(p.out==='pos'?['NEG',...GOTO('FIN')]:['NEG',...T_(L),['J','NG'],...T_(H),...CONST[8],['ADD'],['J','NG'],...GOTO('FIN'),
      'NG',...T_(K1),['J','NG2'],...GOTO('FIN'),'NG2',...DEC(K1),...INC2(L,H),...GOTO('NEG')]),
      'FIN',...T_(K1),...T_(K1),['CALC'],...P_(2),...postCode(p.post,2));
    return assemble(parts); }
  if(p.fr==='mean'){ const C=0, X=3, L=4, H=5, KC=6, N=2, S=7;   // כמה נלקחו (take) / כמה עברו (skip)
    parts.push(...SET(L,p.base&15),...SET(H,p.base>>4),...SET(KC,p.c),...SET(N,0),...MV(1,X));
    if(p.first) parts.push(...T_(X),['J','F1'],...GOTO('OUT'),'F1',...gCode(p.g,X,C,new Set([X,L,H,KC,N])),...ADDW(L,H,C,S),...SUBW(L,H,KC,S,'OUT'),...INC(N),...NEXTX(X));
    parts.push('LOOP',...T_(X),['J','BODY'],...GOTO('OUT'),
      'BODY',...meanStep(p,[],X,C,L,H,KC,S,new Set([X,L,H,KC,N]),'FIT','CROSS'),
      'FIT',...INC(N),...NEXTX(X),...GOTO('LOOP'),
      'CROSS',...(p.out==='xc'?[...MV(X,2),...GOTO('PST')]:p.mode==='take'?GOTO('OUT'):[...ADDW(L,H,KC,S),...SUBW(L,H,C,S,'OUT'),...NEXTX(X),...GOTO('LOOP')]),
      'OUT',...(p.out==='xc'?SET(2,0):[]),'PST',...postCode(p.post,N));   // xc: האיבר שבו הממוצע ירד (0 אם לא ירד)
    return assemble(parts); }
  if(p.fr==='trim'){ const C=0, X=3, L=4, H=5, M=6, Pc=7, Rc=2;   // קיצוץ ⇒ כמה הוצאו (rm) / כמה נשארו (left). הרשימה משתנה ⇒ המוח עוטף ב«שומר-רשימה»
    parts.push(...SET(Rc,0),
      'OUTER',...SET(L,p.K&15),...SET(H,p.K>>4),...MV(1,X),
      'SUM',...T_(X),['J','SB'],...GOTO('END'),
      'SB',...gCode(p.g,X,C,new Set([X,L,H,Rc])),...SUBW(L,H,C,Pc,'REM'),...NEXTX(X),...GOTO('SUM'),
      'REM',...INC(Rc),...foldSel(p.f,X,M,C,new Set([X,M,Rc])),...unlinkVal(M,Pc,C,L,'OUTER'),
      'END');
    if(p.out==='rm') parts.push(...postCode(p.post,Rc));
    else parts.push(...SET(C,0),...MV(1,X),'CL',...T_(X),['J','CB'],...GOTO('CE'),'CB',...INC(C),...NEXTX(X),...GOTO('CL'),'CE',...postCode(p.post,C));
    return assemble(parts); }
  if(p.fr==='nextfit'){ const C=0, X=3, L=4, H=5, S=7, N=2;   // מילוי לפי הסדר: כשאיבר לא נכנס — פותחים מיכל חדש (תקציב K) ⇒ כמה מיכלים
    const live=new Set([X,L,H,N]);
    parts.push(...SET(N,0),...MV(1,X),...T_(X),['J','START'],...GOTO('OUT'),
      'START',...INC(N),...SET(L,p.K&15),...SET(H,p.K>>4),
      'LOOP',...T_(X),['J','BODY'],...GOTO('OUT'),
      'BODY',...gCode(p.g,X,C,live),...SUBW(L,H,C,S,'NEWB'),...NEXTX(X),...GOTO('LOOP'),
      'NEWB',...INC(N),...SET(L,p.K&15),...SET(H,p.K>>4),...SUBW(L,H,C,S,'OVER'),...NEXTX(X),...GOTO('LOOP'),
      'OVER',...SET(L,0),...SET(H,0),...NEXTX(X),...GOTO('LOOP'),
      'OUT',...postCode(p.post,N));
    return assemble(parts); }
  if(p.fr==='relb'){ const C=0, X=3, L=4, H=5, S=7, N=2;   // תקציב יחסי: D = m1·Σg (−1 אם קפדני); קח-כל-עוד m2·g(x) נכנס ⇒ כמה / האיבר שעבר
    parts.push(...relTotal(p,X,C,L,H,S),...SET(N,0),...MV(1,X),
      'LOOP',...T_(X),['J','BODY'],...GOTO('OUT'),
      'BODY',...gCode(p.g,X,C,new Set([X,L,H,N])),...Array.from({length:p.m2},()=>SUBW(L,H,C,S,'CROSS')).flat(),...INC(N),...NEXTX(X),...GOTO('LOOP'),
      'CROSS',...(p.out==='xc'?[...MV(X,2),...GOTO('PST')]:GOTO('OUT')),
      'OUT',...(p.out==='xc'?SET(2,0):[]),'PST',...postCode(p.post,N));
    return assemble(parts); }
  if(p.fr==='vsmean'){ const C=0, X=3, Y=4, L=5, H=6, S=7, N=2;   // כמה איברים עומדים בתנאי (או לא עומדים)
    parts.push(...SET(N,0),...MV(1,X),
      'OL',...T_(X),['J','OB'],...GOTO('OUT'),
      'OB',...vsCond(p,X,Y,L,H,S,C,new Set([X,Y,L,H,N]),p.pol?'YES':'NO',p.pol?'NO':'YES'),
      'YES',...INC(N),
      'NO',...NEXTX(X),...GOTO('OL'),
      'OUT',...postCode(p.post,N));
    return assemble(parts); }
  if(p.fr==='condsel'){ const C=0, X=3, L=4, H=5, M=6, S=7;   // אם ממוצע-הרשימה עובר את הסף — הנבחר ב-f1, אחרת ב-f2 (רשימה ריקה ⇒ 0)
    parts.push(...T_(1),['J','GO1'],...SET(M,0),...GOTO('DONE'),
      'GO1',...meanAll(p,X,C,L,H,S,'F1','F2'),
      'F1',...foldSel(p.f1,X,M,C),...GOTO('DONE'),
      'F2',...foldSel(p.f2,X,M,C),
      'DONE',...postCode(p.post,M));
    return assemble(parts); }
  throw new Error('מסגרת לא ידועה '+p.fr); }
export function codeList(p){ const parts=[];
  if(p.fr==='half'){ const X=3, H=5, K1=6;
    const keep=(kind,k)=>{ const u=++UID; return [...SET(K1,0),...MV(1,X),
      'c'+u,...T_(X),['J','cb'+u],...GOTO('ce'+u),'cb'+u,...INC(K1),...NEXTX(X),...GOTO('c'+u),
      'ce'+u,...kOf(K1,k),...P_(K1),...SET(X,1),
      'w'+u,...T_(K1),['J','wb'+u],...GOTO('we'+u),'wb'+u,...DEC(K1),...NEXTX(X),...GOTO('w'+u),
      'we'+u,...(kind==='pre'?[...CONST[0],...AT(X),['PUT']]:[...XAT(X),...P_(1)]),...GOTO('LEND')]; };
    const A=keep('pre',p.k1), B=keep('suf',p.k2);
    parts.push(...halvesCore(p),...BIT3(H),['J','TR'],...(p.map==='A'?B:A),'TR',...(p.map==='A'?A:B),'LEND');
    return assemble(parts); }
  if(p.fr==='mean'){ const C=0, Pc=3, L=4, H=5, KC=6, S=2;
    const xc=[...XAT(Pc),...P_(7)];
    const ADV=[...XAT(Pc),...P_(Pc)], UNLINK=[...XAT(Pc),['WHERE@'],['GO'],['TAKE'],...AT(Pc),['PUT']], CUT=[...CONST[0],...AT(Pc),['PUT']];
    const live=new Set([Pc,L,H,KC]);
    parts.push(...SET(L,p.base&15),...SET(H,p.base>>4),...SET(KC,p.c),...SET(Pc,1));
    if(p.first) parts.push(...XAT(Pc),['J','F1'],...GOTO('END'),'F1',...xc,...gCode(p.g,7,C,live),...ADDW(L,H,C,S),...SUBW(L,H,KC,S,'END'),...ADV);
    const onFit=p.mode==='drop'?UNLINK:ADV;
    const onCross=p.mode==='take'?[...CUT,...GOTO('END')]:p.mode==='skip'?[...ADDW(L,H,KC,S),...SUBW(L,H,C,S,'END'),...UNLINK,...GOTO('LOOP')]:GOTO('END');
    parts.push('LOOP',...XAT(Pc),['J','BODY'],...GOTO('END'),
      'BODY',...meanStep(p,xc,7,C,L,H,KC,S,live,'FIT','CROSS'),
      'FIT',...onFit,...GOTO('LOOP'),
      'CROSS',...onCross,
      'END');
    return assemble(parts); }
  if(p.fr==='trim'){ const C=0, X=3, L=4, H=5, M=6, Pc=7, S=2;
    const fold=p.f.kind==='first'?[]:p.f.kind==='last'?MV(X,M):(()=>{ const t=callTool(p.f.tool,[M,X],C,new Set([X,M])); if(!t) throw new Error('אין מקום ל-f'); return [...t,...MV(C,M)]; })();
    return assemble(['OUTER',...SET(L,p.K&15),...SET(H,p.K>>4),...MV(1,X),
      'SUM',...T_(X),['J','SB'],...GOTO('END'),
      'SB',...gCode(p.g,X,C,new Set([X,L,H])),...SUBW(L,H,C,S,'REM'),...NEXTX(X),...GOTO('SUM'),
      'REM',...MV(1,M),...T_(M),['WHERE@'],['GO'],['TAKE'],...P_(X),          // M ⇐ הראשון, X ⇐ השני
      'FOLD',...T_(X),['J','FB'],...GOTO('UNL'),
      'FB',...fold,...NEXTX(X),...GOTO('FOLD'),
      'UNL',...SET(Pc,1),
      'UL',...XAT(Pc),...P_(C),...JNE(C,M,S,'UN'),
      ...T_(M),['WHERE@'],['GO'],['TAKE'],...AT(Pc),['PUT'],...GOTO('OUTER'),   // mem[חוליה] ⇐ mem[M]
      'UN',...MV(C,Pc),...GOTO('UL'),
      'END']); }
  if(p.fr==='relb'){ const C=0, Pc=3, L=4, H=5, S=2;   // תקציב יחסי ⇒ קח-כל-עוד (take) / הוצא-כל-עוד (drop)
    const ADV=[...XAT(Pc),...P_(Pc)], UNLINK=[...XAT(Pc),['WHERE@'],['GO'],['TAKE'],...AT(Pc),['PUT']], CUT=[...CONST[0],...AT(Pc),['PUT']];
    return assemble([...relTotal(p,3,C,L,H,S),...SET(Pc,1),
      'LOOP',...XAT(Pc),['J','BODY'],...GOTO('END'),
      'BODY',...XAT(Pc),...P_(7),...gCode(p.g,7,C,new Set([Pc,L,H])),...Array.from({length:p.m2},()=>SUBW(L,H,C,S,'CROSS')).flat(),...(p.mode==='take'?ADV:UNLINK),...GOTO('LOOP'),
      'CROSS',...(p.mode==='take'?CUT:[]),
      'END']); }
  if(p.fr==='vsmean'){ const C=0, X=3, Y=4, L=5, H=6, S=2, K=7;
    // מעבר 1: לכל איבר — דגל (1 = «כן») נשאר במחסנית; K = n.  מעבר 2: מהסוף להתחלה — שולפים דגל ומוציאים לפי הקיטוב
    const UNL=[...T_(X),['WHERE@'],['GO'],['TAKE'],['WHERE@'],['GO'],['TAKE'],...AT(X),['PUT']];
    return assemble([...SET(K,0),...MV(1,X),
      'OL',...T_(X),['J','OB'],...GOTO('P2'),
      'OB',...vsCond(p,X,Y,L,H,S,C,new Set([X,Y,L,H,K]),'YES','NO'),
      'YES',...CONST[1],...GOTO('NX'),
      'NO',...CONST[0],
      'NX',...INC(K),...NEXTX(X),...GOTO('OL'),
      'P2',...T_(K),['J','PB'],...GOTO('END'),
      'PB',...DEC(K),...SET(X,1),...MV(K,Y),
      'WL',...T_(Y),['J','WB'],...GOTO('WD'),
      'WB',...DEC(Y),...NEXTX(X),...GOTO('WL'),
      'WD',['J','T1'],...(p.pol?UNL:[]),...GOTO('P2'),
      'T1',...(p.pol?[]:UNL),...GOTO('P2'),
      'END']); }
  if(p.fr==='condsel'){ const C=0, X=3, L=4, H=5, M=6, Pc=7, S=2;   // אם ממוצע-הרשימה עובר את הסף — הוצא את הנבחר ב-f1, אחרת ב-f2
    return assemble([...T_(1),['J','GO1'],...GOTO('END'),
      'GO1',...meanAll(p,X,C,L,H,S,'F1','F2'),
      'F1',...foldSel(p.f1,X,M,C),...GOTO('RM'),
      'F2',...foldSel(p.f2,X,M,C),
      'RM',...unlinkVal(M,Pc,C,S,'END'),
      'END']); }
  throw new Error('מסגרת לא ידועה '+p.fr); }

// ─── 3. סימולציה ב-JS (אותה משמעות בדיוק) ────────────────────────────────────
const K12=(n,k)=>k==='c'?(n+1)>>1:n>>1;
function simHalf(gv,p){ const n=gv.length, k1=K12(n,p.k1), k2=K12(n,p.k2); let A=0,B=0; for(let i=0;i<n;i++){ if(i<k1) A+=gv[i]; if(i>=k2) B+=gv[i]; } return {A,B,k1,k2,D:p.base+A-B}; }
function simMean(gv,p){ let D=p.base, taken=[], i=0; const n=gv.length; const keep=new Array(n).fill(false);
  if(p.first&&n){ D+=gv[0]-p.c; keep[0]=true; i=1; }
  for(;i<n;i++){ const D2=D+gv[i]-p.c; const fit=D2>=128; if(fit){ D=D2; keep[i]=p.mode!=='drop'; } else { if(p.mode==='take'){ break; } if(p.mode==='drop'){ for(let j=i;j<n;j++) keep[j]=true; break; } } }
  return keep; }
const selOf=f=>f.kind==='first'?(m,x)=>m:f.kind==='last'?(m,x)=>x:(m,x)=>f.tool.T[m*16+x];
const VALS=[8,9,10,11,12,13,14,15];
// חסם למצב-הרחב: כמה הכי רחוק מהבסיס יכול D להגיע (הרשימה = תת-קבוצה של 8..15) — כדי שלא יעבור את 0..255
const vsBound=(gf,m,w)=>{ let B=0; for(const x of VALS){ let pos=0,neg=0; for(const y of VALS){ const t=m*(gf(x)-gf(y))+w; if(t>0) pos+=t; else neg-=t; } B=Math.max(B,pos,neg); } return B; };
const termBound=t=>{ let pos=0,neg=0; for(const y of VALS){ const v=t(y); if(v>0) pos+=v; else neg-=v; } return Math.max(pos,neg); };
// מול-הממוצע: לכל דוגמה E_i = n·g_i − Σg  ⇒ תנאי לכל איבר
function vsFlags(gv,p){ const n=gv.length, S=gv.reduce((a,b)=>a+b,0); return gv.map(v=>{ const E=n*v-S; if(p.band) return p.m*E+p.w*n>=0&&p.m*E-p.w*n<=0; return p.base-128+p.m*E+p.w*n>=0; }); }
function* vsParams(g){ if(g.kind==='one') return; for(const m of [1,2]) for(let w=-7;w<=7;w++){ if(m===2&&w%2===0) continue; if(vsBound(g.f,m,w)>97) continue;
    for(const base of [128,127]) yield {m,w,base,band:false,cost:(m===2?0.3:0)+Math.abs(w)/20+(base===127?0.1:0)};
    if(w>0&&vsBound(g.f,m,-w)<=97) yield {m,w,base:128,band:true,cost:0.5+(m===2?0.3:0)+w/20}; } }
function* condParams(g){ const gs=VALS.map(g.f), lo=Math.min(...gs), hi=Math.max(...gs); if(lo===hi) return;
  for(let c2=2*lo;c2<=2*hi&&c2<=30;c2++){ if(termBound(y=>2*g.f(y)-c2)>97) continue; for(const base of [128,127]) yield {c2,base,cost:c2/1000+(base===127?0.05:0)}; } }
const selAll=(l,f)=>{ if(!l.length) return 0; const sel=selOf(f); let m=l[0]; for(let j=1;j<l.length;j++) m=sel(m,l[j]); return m; };

// ─── 4. חיפוש ────────────────────────────────────────────────────────────────
function gOptions(U){ const out=[{kind:'x',name:'x',f:x=>x,cost:0},{kind:'one',name:'1',f:()=>1,cost:0.2}]; const seen=new Set(out.map(o=>[8,9,10,11,12,13,14,15].map(o.f).join()));
  for(const t of U){ const f=x=>t.T[x]; const k=[8,9,10,11,12,13,14,15].map(f); if(k.some(v=>v<0)) continue; const s=k.join(); if(seen.has(s)) continue; seen.add(s); out.push({kind:'tool',tool:t,name:t.name,f,cost:1+t.prog.length/500}); }
  return out; }
// כלי-בחירה לקיפול «מי יוצא»: ראשון / אחרון / כלי של שתי כניסות מהמדף שתמיד מחזיר אחת מהן (על 8..15)
function fOptions(B){ const out=[{kind:'first',name:'הראשון',cost:0},{kind:'last',name:'האחרון',cost:0.1}]; const seen=new Set();
  for(const t of B){ let ok=true; const sig=[]; for(let a=8;a<16&&ok;a++) for(let b=8;b<16;b++){ if(a===b) continue; const v=t.T[a*16+b]; if(v!==a&&v!==b){ ok=false; break; } sig.push(v===a?0:1); }
    if(!ok) continue; const s=sig.join(''); if(seen.has(s)||/^0+$/.test(s)||/^1+$/.test(s)) continue; seen.add(s); out.push({kind:'tool',tool:t,name:t.name,cost:1+t.prog.length/500}); }
  return out; }
function findPost(raw,want,U,isFlag){ const m=new Int8Array(16).fill(-1); for(let e=0;e<raw.length;e++){ const r=raw[e]; if(m[r]<0) m[r]=want[e]; else if(m[r]!==want[e]) return null; }
  const keys=[...m.keys()].filter(k=>m[k]>=0); if(keys.length<2) return null;
  if(keys.every(k=>m[k]===k)) return {kind:'id',cost:0};
  if(isFlag) return {kind:'const2',a:m[1],b:m[0],cost:0.3};
  for(const t of U) if(keys.every(k=>t.T[k]===m[k])) return {kind:'tool',tool:t,name:t.name,cost:1+t.prog.length/500};
  return {kind:'vb',tab:m,keys,cost:5}; }
export function describe(p){ const g=p.g.name; const post=!p.post?'':p.post.kind==='id'?'':p.post.kind==='const2'?` ⇒ ${p.post.a} : ${p.post.b}`:p.post.kind==='tool'?` ⇒ ${p.post.name}`:' ⇒ [לוח שנלמד]';
  const kk=k=>k==='c'?'⌈n/2⌉':'⌊n/2⌋'; const cmp=p.base===128?'≥':'>';
  if(p.fr==='updiv') return p.out==='rem'?`S=Σ${g} ⇒ S mod ${p.d}${post}`:`S=${p.off==='n1'?'n−1':p.off==='nh'?'⌊n/2⌋':p.off}+Σ${g} ⇒ S חלקי ${p.d}${post}`;
  if(p.fr==='stopx') return `תקציב ${p.K} · g=${g} · ${{xc:'האיבר שבו הסכום עבר',xp:'האחרון שנכנס',xp0:'האחרון שנכנס לפני שעבר (0 אם לא עבר)'}[p.out||'xc']}${post}`;
  if(p.fr==='nextfit') return `מיכלים של ${p.K} לפי הסדר · g=${g} ⇒ כמה מיכלים${post}`;
  if(p.fr==='relb') return `תקציב יחסי: ${p.m2}·קידומת ${p.strict?'<':'≤'} ${p.m1}·Σ${g} ⇒ ${p.kind==='list'?(p.mode==='take'?'קח-כל-עוד':'הוצא-כל-עוד'):p.out==='xc'?'האיבר שעבר':'כמה נכנסו'}${post}`;
  if(p.fr==='half') return `שני-חלקים: A=Σ${g}(ראשונים ${kk(p.k1)}) B=Σ${g}(אחרי ${kk(p.k2)}) ⇒ `+(p.kind==='list'?`A${cmp}B ? ${p.map==='A'?'A':'B'} : ${p.map==='A'?'B':'A'}`:p.out==='flag'?`A${cmp}B?${post}`:p.out==='pos'?`max(0,A−B)${post}`:p.out==='neg'?`max(0,B−A)${post}`:`|A−B|${post}`);
  if(p.fr==='mean') return `ממוצע-רץ של ${g} ${cmp} ${p.c}${p.first?' · הראשון חופשי':''} · ${{take:'קח-כל-עוד',skip:'דלג על מי שמוריד',drop:'הוצא-כל-עוד'}[p.mode]}${p.kind==='num'?(p.out==='xc'?' ⇒ האיבר שבו ירד':' ⇒ כמה'):''}${post}`;
  if(p.fr==='vsmean'){ const gx=p.g.kind==='x'?'x':g+'(x)'; const t=p.band?`|${p.m===2?'2·':''}(n·${gx}−Σ${g})| ≤ ${p.w}·n`:`${p.m===2?'2·':''}(n·${gx}−Σ${g})${p.w?(p.w>0?'+':'−')+Math.abs(p.w)+'·n':''} ${p.base===128?'≥':'>'} 0`; return `מול-הממוצע: ${t} ⇒ ${p.kind==='list'?(p.pol?'השאר':'הוצא'):(p.pol?'כמה כן':'כמה לא')}${post}`; }
  if(p.fr==='condsel') return `אם Σ(2·${g}) ${p.base===128?'≥':'>'} ${p.c2}·n ⇒ ${p.f1.name}, אחרת ${p.f2.name}${p.kind==='list'?' — הוצא אותו':''}${post}`;
  if(p.fr==='trim') return `קיצוץ: כל עוד Σ${g} > ${p.K} — הוצא את ${p.f.name}${p.kind==='num'?(p.out==='rm'?' ⇒ כמה הוצאו':' ⇒ כמה נשארו'):''}${post}`;
  return J(p); }

function plansNum(ex,G,U,F){ const W=ex.map(e=>e.want); const out=[]; const len=ex.map(e=>e.l.length); const SEL=new Map((F||[]).map(f=>[f,ex.map(e=>selAll(e.l,f))]));
  const add=(plan,raw,isFlag,cost)=>{ const post=findPost(raw,W,U,isFlag); if(post) out.push({kind:'num',...plan,post,cost:cost+post.cost}); };
  for(const g of G){ const gv=ex.map(e=>e.l.map(g.f)); const S=gv.map(v=>v.reduce((a,b)=>a+b,0));
    // חלוקה-עם-היסט
    for(const off of ['n1','nh']) add({fr:'updiv',g,d:'n',off},S.map((s,e)=>{ const n=len[e]; if(!n) return 0; return Math.floor((s+(off==='n1'?(n+15)&15:n>>1))/n)&15; }),false,g.cost+1.5);
    for(let d=2;d<=15;d++) for(let off=1;off<d;off++) add({fr:'updiv',g,d,off},S.map(s=>Math.floor((s+off)/d)&15),false,g.cost+1.5+off/100);
    for(let d=2;d<=15;d++) add({fr:'updiv',g,d,off:0,out:'rem'},S.map(s=>s%d),false,g.cost+1.6);   // S mod d
    add({fr:'updiv',g,d:'n',off:0,out:'rem'},S.map((s,e)=>len[e]?s%len[e]:0),false,g.cost+1.7);
    // חוצה-סף
    for(let K=0;K<=255;K++){ const rs=gv.map((v,e)=>{ let B=K, last=0; for(let i=0;i<v.length;i++){ if(B>=v[i]){ B-=v[i]; last=ex[e].l[i]; } else return [ex[e].l[i],last,last]; } return [0,last,0]; });
      add({fr:'stopx',g,K,out:'xc'},rs.map(r=>r[0]),false,g.cost+2+K/1000); add({fr:'stopx',g,K,out:'xp'},rs.map(r=>r[1]),false,g.cost+2.1+K/1000); add({fr:'stopx',g,K,out:'xp0'},rs.map(r=>r[2]),false,g.cost+2.2+K/1000);
      if(S.every(s=>s<=K)) break; }
    // שני-חלקים
    if(g.kind!=='one') for(const k1 of ['f','c']) for(const k2 of ['f','c']){ const hs=gv.map(v=>simHalf(v,{k1,k2,base:128}));
      add({fr:'half',g,k1,k2,base:128,out:'absd'},hs.map(h=>Math.min(15,Math.abs(h.A-h.B))),false,g.cost+2.5);
      add({fr:'half',g,k1,k2,base:128,out:'flag'},hs.map(h=>h.A>=h.B?1:0),true,g.cost+2.6);
      add({fr:'half',g,k1,k2,base:127,out:'flag'},hs.map(h=>h.A>h.B?1:0),true,g.cost+2.7);
      add({fr:'half',g,k1,k2,base:128,out:'pos'},hs.map(h=>Math.max(0,Math.min(15,h.A-h.B))),false,g.cost+2.8); add({fr:'half',g,k1,k2,base:128,out:'neg'},hs.map(h=>Math.max(0,Math.min(15,h.B-h.A))),false,g.cost+2.8); }
    // ממוצע-רץ ⇒ כמה
    for(let c=0;c<=15;c++) for(const base of [128,127]) for(const first of [0,1]) for(const mode of ['take','skip']){ if(termBound(y=>Math.max(0,g.f(y)-c))>112) continue;
      const ks=gv.map(v=>simMean(v,{c,base,first,mode})); add({fr:'mean',g,c,base,first,mode},ks.map(k=>k.filter(Boolean).length&15),false,g.cost+3+(mode==='skip'?0.3:0)+first*0.2+(base===127?0.1:0));
      if(mode==='take') add({fr:'mean',g,c,base,first,mode,out:'xc'},ks.map((k,e)=>{ const j=k.indexOf(false); return j<0?0:ex[e].l[j]; }),false,g.cost+3.2+first*0.2+(base===127?0.1:0)); }
    // מילוי לפי הסדר (next-fit) ⇒ כמה מיכלים
    { const maxS=Math.max(...S); for(let K=1;K<=Math.min(255,maxS);K++){ add({fr:'nextfit',g,K},gv.map(v=>{ if(!v.length) return 0; let b=1, B=K; for(const x of v){ if(B>=x) B-=x; else { b++; B=K; if(B>=x) B-=x; else B=0; } } return b&15; }),false,g.cost+3.2+K/1000); } }
    // תקציב יחסי: m2·(קידומת) ≤ m1·Σ (או <) ⇒ כמה / האיבר שעבר
    for(const m1 of [1,2]) for(let m2=1;m2<=4;m2++) for(const strict of [0,1]){ if(m2<=m1&&!strict) continue;
      const rs=gv.map((v,e)=>{ let D=m1*S[e]-strict, n=0; for(let i=0;i<v.length;i++){ if(D>=m2*v[i]){ D-=m2*v[i]; n++; } else return [n,ex[e].l[i]]; } return [n,0]; });
      if(!rs.some(r=>r[1])) continue; add({fr:'relb',g,m1,m2,strict,out:'n'},rs.map(r=>r[0]&15),false,g.cost+3+m2/10+strict*0.05); add({fr:'relb',g,m1,m2,strict,out:'xc'},rs.map(r=>r[1]),false,g.cost+3.1+m2/10+strict*0.05); }
    // קיצוץ ⇒ כמה הוצאו / כמה נשארו
    if(F) for(const f of F){ const sel=selOf(f); const sums=gv.map((v,e)=>{ const cur=ex[e].l.slice(), cg=v.slice(); const out=[cg.reduce((a,b)=>a+b,0)]; while(cur.length){ let m=cur[0]; for(let j=1;j<cur.length;j++) m=sel(m,cur[j]); const j=cur.indexOf(m); cur.splice(j,1); cg.splice(j,1); out.push(cg.reduce((a,b)=>a+b,0)); } return out; });
      const maxS=Math.max(...S); for(let K=0;K<maxS;K++){ const rm=sums.map(z=>{ let j=0; while(z[j]>K) j++; return j; }); if(rm.every(j=>j===0)) continue;
        add({fr:'trim',g,f,K,out:'rm'},rm.map(j=>j&15),false,g.cost+f.cost+3.5+K/1000); add({fr:'trim',g,f,K,out:'left'},rm.map((j,e)=>(len[e]-j)&15),false,g.cost+f.cost+3.6+K/1000); } }
    // מול-הממוצע ⇒ כמה
    for(const q of vsParams(g)){ const fl=gv.map(v=>vsFlags(v,q)); for(const pol of [true,false]){ const {cost,...qq}=q; add({fr:'vsmean',g,...qq,pol},fl.map(f=>f.filter(b=>b===pol).length&15),false,g.cost+3.5+cost+(pol?0:0.1)); } }
    // תנאי-ממוצע ⇒ הנבחר
    if(F) for(const q of condParams(g)){ const cond=gv.map(v=>q.base-128+v.reduce((a,b)=>a+2*b-q.c2,0)>=0); if(cond.every(c=>c)||cond.every(c=>!c)) continue;
      for(const f1 of F) for(const f2 of F){ if(f1===f2) continue; const {cost,...qq}=q; add({fr:'condsel',g,...qq,f1,f2},ex.map((e,i)=>e.l.length?(cond[i]?SEL.get(f1)[i]:SEL.get(f2)[i]):0),false,g.cost+4+cost+f1.cost+f2.cost); } } }
  return out.sort((a,b)=>a.cost-b.cost); }
function plansList(ex,G,F){ const out=[]; const SEL=new Map(F.map(f=>[f,ex.map(e=>selAll(e.l,f))])); const ord=ex.map((e,i)=>i).sort((a,b)=>ex[b].l.length-ex[a].l.length); const same=(a,b)=>a.length===b.length&&a.every((v,j)=>v===b[j]);
  const fits=(fn)=>{ for(const i of ord) if(!same(fn(i),ex[i].w)) return false; return true; };
  for(const g of G){ const gv=ex.map(e=>e.l.map(g.f));
    // שני-חלקים
    if(g.kind!=='one') for(const k1 of ['f','c']) for(const k2 of ['f','c']) for(const base of [128,127]) for(const map of ['A','B']){
      const p={fr:'half',g,k1,k2,base,map};
      if(fits(i=>{ const h=simHalf(gv[i],p); const t=h.D>=128; const pre=ex[i].l.slice(0,h.k1), suf=ex[i].l.slice(h.k2); return (t===(map==='A'))?pre:suf; }))
        out.push({kind:'list',...p,cost:g.cost+2+(base===127?0.1:0)+(map==='B'?0.1:0)}); }
    // ממוצע-רץ
    for(let c=0;c<=15;c++) for(const base of [128,127]) for(const mode of ['take','skip','drop']) for(const first of mode==='drop'?[0]:[0,1]){ if(termBound(y=>Math.max(0,g.f(y)-c))>112) continue;
      const p={fr:'mean',g,c,base,first,mode}; let crossed=false;
      if(fits(i=>{ const k=simMean(gv[i],p); if(k.some(v=>v!==(mode!=='drop'))) crossed=true; return ex[i].l.filter((x,j)=>k[j]); })&&crossed)
        out.push({kind:'list',...p,cost:g.cost+3+(mode==='take'?0:0.5)+first*0.2+(base===127?0.1:0)}); }
    // תקציב יחסי ⇒ קח-כל-עוד / הוצא-כל-עוד
    { const S=gv.map(v=>v.reduce((a,b)=>a+b,0)); for(const m1 of [1,2]) for(let m2=1;m2<=4;m2++) for(const strict of [0,1]){ if(m2<=m1&&!strict) continue;
      const nfit=gv.map((v,e)=>{ let D=m1*S[e]-strict; for(let i=0;i<v.length;i++){ if(D>=m2*v[i]) D-=m2*v[i]; else return i; } return v.length; });
      if(nfit.every((k,e)=>k===gv[e].length)) continue;
      for(const mode of ['take','drop']) if(fits(i=>mode==='take'?ex[i].l.slice(0,nfit[i]):ex[i].l.slice(nfit[i]))) out.push({kind:'list',fr:'relb',g,m1,m2,strict,mode,cost:g.cost+3+m2/10+strict*0.05+(mode==='drop'?0.2:0)}); } }
    // מול-הממוצע: השאר (או הוצא) כל איבר שעומד בתנאי
    for(const q of vsParams(g)){ const fl=gv.map(v=>vsFlags(v,q)); if(fl.every(f=>f.every(b=>b))||fl.every(f=>f.every(b=>!b))) continue;
      for(const pol of [true,false]){ const {cost,...qq}=q; if(fits(i=>ex[i].l.filter((x,j)=>fl[i][j]===pol))) out.push({kind:'list',fr:'vsmean',g,...qq,pol,cost:g.cost+3.5+cost+(pol?0:0.1)}); } }
    // תנאי-ממוצע על כל הרשימה ⇒ הוצא את הנבחר ב-f1 או ב-f2
    for(const q of condParams(g)){ const cond=gv.map(v=>q.base-128+v.reduce((a,b)=>a+2*b-q.c2,0)>=0); if(cond.every(c=>c)||cond.every(c=>!c)) continue;
      for(const f1 of F) for(const f2 of F){ if(f1===f2) continue; const s1=SEL.get(f1), s2=SEL.get(f2);
        if(fits(i=>{ const t=cond[i]?s1[i]:s2[i]; return ex[i].l.filter(x=>x!==t); })){ const {cost,...qq}=q; out.push({kind:'list',fr:'condsel',g,...qq,f1,f2,cost:g.cost+4+cost+f1.cost+f2.cost}); } } }
    // קיצוץ: סדר-ההוצאה לא תלוי ב-K ⇒ לכל דוגמה טווח K מותר; חיתוך הטווחים
    for(const f of F){ const sel=selOf(f); let lo=0, hi=255, trimmed=false;
      for(const i of ord){ let cur=ex[i].l.slice(), cg=gv[i].slice(); const w=ex[i].w; let prevS=Infinity, ok=false;
        for(;;){ const s=cg.reduce((a,b)=>a+b,0); if(same(cur,w)){ lo=Math.max(lo,s); hi=Math.min(hi,prevS-1); ok=true; if(prevS!==Infinity) trimmed=true; break; }
          if(!cur.length||cur.length<w.length) break; let m=cur[0]; for(let j=1;j<cur.length;j++) m=sel(m,cur[j]); const j=cur.indexOf(m); cur.splice(j,1); cg.splice(j,1); prevS=s; }
        if(!ok||lo>hi) { lo=1; hi=0; break; } }
      if(lo<=hi&&trimmed) for(let K=lo;K<=hi&&K<lo+4;K++) out.push({kind:'list',fr:'trim',g,f,K,cost:g.cost+f.cost+3+(K-lo)/10}); } }
  return out.sort((a,b)=>a.cost-b.cost); }

// המרכיב: מועמדים מהסימולציה ⇒ קוד ⇒ בודק המכונה ⇒ בדיקה סופית (2000)
export function wide2Compose(gen,{N=1000,ms=+process.env.WIDE2MS||120000,say=()=>{},maxTry=40}={}){ const T0=Date.now(); const DEAD=T0+ms;
  const raw=Array.from({length:N},()=>gen()); const isList=typeof raw[0].want==='string';
  const ex=raw.map(e=>({l:walk(e.mem),want:e.want,w:isList?JSON.parse(e.want):null,e}));
  if(isList&&ex.some(x=>x.w.some(v=>v<8||v>15))) return {prog:null,cands:0,ms:Date.now()-T0};
  const {U,B}=scanTools(); const G=gOptions(U);
  const plans=isList?plansList(ex,G,fOptions(B)):plansNum(ex,G,U,fOptions(B));
  say(`מצב-רחב-2: ${plans.length} מועמדים מהסימולציה (${G.length} אפשרויות ל-g) · ${((Date.now()-T0)/1000).toFixed(1)} שנ׳`);
  if(!plans.length) return {prog:null,cands:0,ms:Date.now()-T0};
  const chk=makeChecker(gen,300,50000); let tried=0; const seen=new Set();
  for(const p of plans){ if(Date.now()>DEAD||tried>=maxTry) break;
    let post=p.post;
    if(post&&post.kind==='vb'){   // לוח-סיום שאין לו כלי במדף: בונה-הערכים בונה אותו מהדוגמאות (רק על הערכים שנראו)
      if(Date.now()>DEAD-20000) continue; const keys=post.keys, tab=post.tab;
      const g=()=>{ const k=keys[R(keys.length)]; const m=Array.from({length:16},()=>R(16)); m[3]=k; const w=tab[k]; return {mem:m,want:w,ok:r=>r[2]===w&&r[3]===k}; };
      const v=valueBuild(g,{name:'סיום (מצב-רחב-2)',ins:[3],out:2,ms:Math.min(60000,DEAD-Date.now()-10000)}); if(!v.prog) continue;
      post={kind:'tool',tool:{ins:[3],out:2,prog:v.prog,name:'לוח שנלמד'},name:'לוח שנלמד'}; }
    let prog; try{ prog=(p.kind==='list'?codeList:codeNum)({...p,post}); }catch(err){ say('  קוד: '+err.message); continue; }
    const key=J(prog); if(seen.has(key)) continue; seen.add(key); tried++;
    const bad=ex.slice(0,60).filter(f=>{ const r=run(prog,f.e.mem,{maxSteps:50000}); return !r||r.st.length||!f.e.ok(r.mem); }).length;
    if(bad){ say(`  ✗ במכונה (${bad}/60): ${describe({...p,post})}`); continue; }
    if(!chk(prog)){ say('  ✗ בבודק: '+describe({...p,post})); continue; }
    const fc=finalCheck(prog,gen,2000); if(fc.bad){ say(`  ✗ בבדיקה (${fc.bad}/2000): ${describe({...p,post})}`); continue; }
    return {prog,how:'מצב-רחב-2: '+describe({...p,post}),cands:plans.length,tried,ms:Date.now()-T0}; }
  return {prog:null,cands:plans.length,tried,ms:Date.now()-T0}; }
export const _test={ADDW,SUBW,JNE,CONST,assemble,INC2,DEC1W,SET,T_,P_,MV};
