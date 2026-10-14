// «סידור-מקומי» (rearr.mjs, KEY=rearr): רשימה ⇒ רשימה — סידורים-מחדש מקומיים ומעוגני-סטטיסטיקה.
//   אני כותב רק שלדים (מסגרות) וחיפוש; מה שנכנס לחריצים — המכונה בוחרת מהדוגמאות:
//   סטטיסטיקות (כלי רשימה⇒מספר מהמדף) · יחס / מפתח / תנאי (כלי מהמדף שהלוח שלו מתאים, ישר/הפוך, בכל סדר-ארגומנטים,
//   ואם אין — הלוח שהוסק מהדוגמאות נבנה ע"י בונה-הערכים) · קבוע k (נבחר מהדוגמאות).
//   מסגרות:
//     החלף-שניים(S1,S2)          — הערכים S1, S2 מחליפים מקום, השאר במקומם
//     הפוך-רישא(S, כולל?)        — הופכים את הרישא שנגמרת באיבר S (במקום, בהיפוך מצביעים)
//     מעבר-השוואה(R)             — מעבר אחד משמאל לימין: «נושא» נלקח קדימה כל עוד R(נושא, x) (מעבר-בועה)
//     חלוקה-לערמות(k)            — לפי מקום mod k, ערמה אחרי ערמה
//     לסירוגין(K)                — שתי מחלקות לפי מפתח K, איבר-איבר, השאריות בסוף
//     חלון-כבד(k, מקס/מינ)       — k איברים רצופים עם הסכום הגדול/הקטן ביותר (סכום רחב: מונה בשני תאים, רק «אפס?»)
//     בין-סמנים(S1,S2, כולל?)    — האיברים בין שני הסמנים (בכל סדר)
//     סינון-דרגה(R, תנאי)        — r(x) = כמה y ברשימה עם R(y,x); משאירים x אם תנאי(r[, מקום | אורך])
//     מעקב-מצביעים(f)            — מקום-הבא = f(x); עוצרים כשיוצאים מהרשימה או חוזרים (בניית מצביעים במקום, ואז חיתוך)
import fs from 'fs'; import { run } from './machine3s.mjs'; import { makeChecker } from './tzoref.mjs'; import { valueBuild, show as showExpr } from './tzoref-value.mjs';
import { runFastG, encodeG, walk, relocate } from './chainsafe.mjs'; import { assemble } from './posframes.mjs'; import { shelfParts, callTool } from './statscan.mjs';
import { deepRelocOk, repairJumps } from './jumpfix.mjs';
const R=k=>Math.floor(Math.random()*k); const J=JSON.stringify;
// ─── אבני-שלד ───
const T=c=>[['WHERE',c],['GO'],['TAKE']], P=c=>[['WHERE',c],['GO'],['PUT']], MV=(a,b)=>[...T(a),...P(b)], AT=c=>[...T(c),['WHERE@'],['GO']];
const PUSH15=[...T(4),['TAKE'],['CALC'],['TAKE'],['CALC']], PUSH1=[...PUSH15,['SHR'],['SHR'],['SHR']], PUSH0=[...PUSH15,...PUSH15,['CALC']];
const GOTO=l=>[...PUSH15,['J',l]]; const ZC={code:[['WHERE',0],['GO']]};
const ZERO=c=>[...PUSH0,...P(c)], INC=c=>[...T(c),...PUSH1,['ADD'],...P(c)], DEC=c=>[...T(c),...PUSH15,['ADD'],...P(c)];
const NEXT=c=>[...AT(c),['TAKE'],...P(c)];                         // c ⇐ mem[c]
const CONST=k=>{ const o=[...PUSH0]; for(let j=0;j<k;j++) o.push(...PUSH1,['ADD']); return o; };
// קפוץ אם a≠b — XOR מ«לא-וגם» בלי תא-עזר (לא-וגם(a,b) מחושב פעמיים)
const JNE=(a,b,l)=>[...T(a),...T(a),...T(b),['CALC'],['CALC'],...T(b),...T(a),...T(b),['CALC'],['CALC'],['CALC'],['J',l]];
// מחסנית ⇒ רשימה: סמן-תחתית 0; התחתון = הראשון (תאים 5, 7)
const LINK=u=>['LINK'+u,...PUSH0,...P(5),'L1'+u,...P(7),...T(7),['J','L2'+u],...GOTO('LD'+u),'L2'+u,...T(5),...AT(7),['PUT'],...T(7),...P(5),...GOTO('L1'+u),'LD'+u,...T(5),...P(1)];
let UID=0;
const statC=s=>[ZC,{code:s.prog},...T(2)];
const tl=x=>({prog:x.tool.prog,ins:x.tool.ins,out:x.tool.out??2});

// ─── המסגרות (קוד-מכונה) ───
export function swapFrame({s1,s2}){ const u=++UID, L=s=>s+u; return assemble([...statC(s1),...statC(s2),...P(4),...P(3), ...PUSH0,
  ...ZERO(7),...MV(1,5), L('Q'),...T(5),['J',L('QB')],...GOTO(L('QE')),                     // מעבר ראשון: יש גם S1 וגם S2?
  L('QB'),...JNE(5,3,L('Q2')),...INC(7), L('Q2'),...JNE(5,4,L('Q3')),...INC(7), L('Q3'),...NEXT(5),...GOTO(L('Q')),
  L('QE'),...MV(1,5), ...T(7),...PUSH15,['ADD'],...PUSH15,['ADD'],['J',L('CP')],...GOTO(L('LP')),   // מונה ≠ 2 ⇒ העתקה
  L('CP'),...T(5),['J',L('CB')],...GOTO('LINK'+u), L('CB'),...T(5),...NEXT(5),...GOTO(L('CP')),
  L('LP'),...T(5),['J',L('B')],...GOTO('LINK'+u),
  L('B'),...JNE(5,3,L('N1')),...T(4),...GOTO(L('AD')),
  L('N1'),...JNE(5,4,L('N2')),...T(3),...GOTO(L('AD')),
  L('N2'),...T(5),
  L('AD'),...NEXT(5),...GOTO(L('LP')), ...LINK(u)]); }
export function revPrefixFrame({s,incl}){ const u=++UID, L=x=>x+u; return assemble([...statC(s),...P(3), ...ZERO(4), ...MV(1,5), ...MV(1,0),
  L('LP'),...T(5),['J',L('B')],...GOTO(L('END')),
  L('B'),...(incl?[]:[...JNE(5,3,L('B2')),...GOTO(L('END')),L('B2')]),
  ...AT(5),['TAKE'],...P(7), ...T(4),...AT(5),['PUT'], ...MV(5,4),
  ...(incl?[...JNE(4,3,L('B3')),...MV(7,5),...GOTO(L('END')),L('B3')]:[]),
  ...MV(7,5),...GOTO(L('LP')),
  L('END'),...T(4),['J',L('E2')],...GOTO(L('DONE')),
  L('E2'),...T(5),...AT(0),['PUT'],...MV(4,1), L('DONE')]); }
export function bubbleFrame({rel}){ const u=++UID, L=x=>x+u; const F=[1,3,4,5]; const args=rel.order==='ab'?[3,5]:[5,3];
  return assemble([...PUSH0, ...MV(1,5), ...T(5),['J',L('S')],...GOTO('LINK'+u),
    L('S'),...MV(5,3),...NEXT(5),
    L('LP'),...T(5),['J',L('B')],...GOTO(L('FIN')),
    L('B'),...callTool(tl(rel),args,F),...T(2),['J',rel.neg?L('KP'):L('SW')],...GOTO(rel.neg?L('SW'):L('KP')),
    L('SW'),...T(5),...GOTO(L('AD')),
    L('KP'),...T(3),...MV(5,3),
    L('AD'),...NEXT(5),...GOTO(L('LP')),
    L('FIN'),...T(3), ...LINK(u)]); }
export function dealFrame({k}){ const u=++UID, L=x=>x+u; return assemble([...PUSH0, ...CONST(k),...P(0), ...ZERO(4),
  L('PL'),...JNE(4,0,L('PB')),...GOTO('LINK'+u),
  L('PB'),...MV(4,7),...MV(1,5),
  L('W'),...T(5),['J',L('WB')],...GOTO(L('PN')),
  L('WB'),...T(7),['J',L('DC')],...T(5),...T(0),...PUSH15,['ADD'],...P(7),...GOTO(L('WA')),
  L('DC'),...DEC(7),
  L('WA'),...NEXT(5),...GOTO(L('W')),
  L('PN'),...INC(4),...GOTO(L('PL')), ...LINK(u)]); }
export function altFrame({key}){ const u=++UID, L=x=>x+u; const F=[1,3,4];
  const seek=(c,wantA)=>{ const v=++UID, M=x=>x+'s'+v; const isA=key.neg?M('NA'):M('YA'), notA=key.neg?M('YA'):M('NA');
    return [M('S'),...T(c),['J',M('C')],...GOTO(M('D')), M('C'),...callTool(tl(key),[c],F),...T(2),['J',isA],...GOTO(notA),
      M('YA'),...(wantA?GOTO(M('D')):[...NEXT(c),...GOTO(M('S'))]), M('NA'),...(wantA?[...NEXT(c),...GOTO(M('S'))]:GOTO(M('D'))), M('D')]; };
  return assemble([...PUSH0, ...MV(1,3), ...MV(1,4),
    L('LP'),...seek(3,true),...seek(4,false),
    ...T(3),['J',L('NZ')],...T(4),['J',L('NZ')],...GOTO('LINK'+u),
    L('NZ'),...T(3),['J',L('HA')],...GOTO(L('CB')),
    L('HA'),...T(3),...NEXT(3),
    L('CB'),...T(4),['J',L('HB')],...GOTO(L('LP')),
    L('HB'),...T(4),...NEXT(4),...GOTO(L('LP')), ...LINK(u)]); }
// סכום רחב: מונה (lo=7, hi=0) — רק «ועוד 1» / «פחות 1» ובדיקות-אפס. s=3, B=4, w=5, c=6, t=2
export function windowFrame({k,mode}){ const u=++UID, L=x=>x+u;
  let q=0;
  const inc2=()=>{ const v=++q; return [...INC(7),...T(7),['J',L('i'+v)],...INC(0),L('i'+v)]; };
  const dec2=under=>{ const v=++q; return [...T(7),['J',L('nb'+v)],...T(0),['J',L('br'+v)],...GOTO(under),L('br'+v),...DEC(0),L('nb'+v),...DEC(7)]; };
  const addWin=(src,op)=>{ const v=++q; return [...MV(src,5),...CONST(k),...P(6),
    L('A'+v),...T(6),['J',L('AB'+v)],...GOTO(L('AE'+v)),
    L('AB'+v),...MV(5,2), L('X'+v),...T(2),['J',L('XB'+v)],...GOTO(L('XE'+v)), L('XB'+v),...op(),...DEC(2),...GOTO(L('X'+v)),
    L('XE'+v),...NEXT(5),...DEC(6),...GOTO(L('A'+v)), L('AE'+v)]; };
  return assemble([...MV(1,3),...MV(1,4),
    L('LP'),...MV(3,5),...T(5),['J',L('F0')],...GOTO(L('OUT')),
    L('F0'),...CONST(k-1),...P(6),
    L('F1'),...T(6),['J',L('F2')],...GOTO(L('FIT')),
    L('F2'),...NEXT(5),...T(5),['J',L('F3')],...GOTO(L('OUT')), L('F3'),...DEC(6),...GOTO(L('F1')),
    L('FIT'),...ZERO(7),...ZERO(0), ...addWin(3,inc2), ...addWin(4,()=>dec2(L('UN'))),
    ...(mode==='max'?[...T(7),['J',L('BET')],...T(0),['J',L('BET')],...GOTO(L('NX')), L('UN'),...GOTO(L('NX'))]
                    :[...GOTO(L('NX')), L('UN'),...GOTO(L('BET'))]),
    L('BET'),...MV(3,4),
    L('NX'),...NEXT(3),...GOTO(L('LP')),
    L('OUT'),...MV(4,1),...MV(4,5),...CONST(k-1),...P(6),
    L('C1'),...T(5),['J',L('C2')],...GOTO(L('DONE')),
    L('C2'),...T(6),['J',L('C3')],...PUSH0,...AT(5),['PUT'],...GOTO(L('DONE')),
    L('C3'),...NEXT(5),...DEC(6),...GOTO(L('C1')), L('DONE')]); }
export function betweenFrame({s1,s2,inA,inB}){ const u=++UID, L=x=>x+u; return assemble([...statC(s1),...statC(s2),...P(4),...P(3), ...PUSH0, ...ZERO(7), ...MV(1,5),
  L('LP'),...T(5),['J',L('B')],...GOTO('LINK'+u),
  L('B'),...JNE(5,3,L('C2')),...GOTO(L('MK')), L('C2'),...JNE(5,4,L('NM')),
  L('MK'),...T(7),['J',L('SEC')],...INC(7),...(inA?T(5):[]),...GOTO(L('AD')),
  L('SEC'),...(inB?T(5):[]),...GOTO('LINK'+u),
  L('NM'),...T(7),['J',L('PX')],...GOTO(L('AD')), L('PX'),...T(5),
  L('AD'),...NEXT(5),...GOTO(L('LP')), ...LINK(u)]); }
// סינון-דרגה: x=3 (הולך על הרשימה המקורית, שלא משתנה), i=5, r=6, y=7, n=0 · הנשארים נדחפים למחסנית ⇒ רשימה בסוף
const FCELL={r:6,i:5,n:0};
export function rankFrame({rel,pred}){ const u=++UID, L=x=>x+u; const F=[0,1,3,5,6,7]; const useN=pred.feats.includes('n');
  return assemble([...(useN?[...ZERO(0),...MV(1,7), L('N0'),...T(7),['J',L('N1')],...GOTO(L('N2')), L('N1'),...INC(0),...NEXT(7),...GOTO(L('N0')), L('N2')]:[]),
    ...PUSH0, ...ZERO(5), ...MV(1,3),
    L('LP'),...T(3),['J',L('BD')],...GOTO('LINK'+u),
    L('BD'),...ZERO(6),...MV(1,7),
    L('RL'),...T(7),['J',L('RB')],...GOTO(L('RD')),
    L('RB'),...callTool(tl(rel),rel.order==='yx'?[7,3]:[3,7],F),...T(2),['J',rel.neg?L('RN'):L('RI')],...GOTO(rel.neg?L('RI'):L('RN')),
    L('RI'),...INC(6),
    L('RN'),...NEXT(7),...GOTO(L('RL')),
    L('RD'),...callTool(tl(pred),pred.order.map(f=>FCELL[f]),F),...INC(5),...T(2),['J',pred.neg?L('AD'):L('KP')],...GOTO(pred.neg?L('KP'):L('AD')),
    L('KP'),...T(3),
    L('AD'),...NEXT(3),...GOTO(L('LP')), ...LINK(u)]); }
// מעקב-מצביעים: (1) לכל x: q=f(x), t(x) = האיבר במקום q (0 אם מחוץ לרשימה) ⇒ זוגות במחסנית (2) mem[x] ⇐ t(x)
//   (3) מהראש: y = mem[cur]; y כבר בשרשרת (הליכה מהראש עד cur) ⇒ mem[cur] ⇐ 0
export function chaseFrame({f}){ const u=++UID, L=x=>x+u; const F=[1,3,5,6];
  return assemble([...PUSH0,...PUSH0, ...MV(1,3),
    L('P1'),...T(3),['J',L('P1B')],...GOTO(L('PH2')),
    L('P1B'),...T(3),...callTool(tl(f),[3],F),...MV(2,6),...MV(1,5),
    L('WK'),...T(6),['J',L('W1')],...GOTO(L('WD')), L('W1'),...T(5),['J',L('W2')],...GOTO(L('WD')), L('W2'),...NEXT(5),...DEC(6),...GOTO(L('WK')),
    L('WD'),...T(5),...NEXT(3),...GOTO(L('P1')),
    L('PH2'),...P(5),...P(3),...T(3),['J',L('P2B')],...GOTO(L('PH3')), L('P2B'),...T(5),...AT(3),['PUT'],...GOTO(L('PH2')),
    L('PH3'),...MV(1,3),...T(3),['J',L('C1')],...GOTO(L('END')),
    L('C1'),...AT(3),['TAKE'],...P(4),...T(4),['J',L('C2')],...GOTO(L('END')),
    L('C2'),...MV(1,5),
    L('VL'),...JNE(5,4,L('VN')),...GOTO(L('CUT')),
    L('VN'),...JNE(5,3,L('VA')),...MV(4,3),...GOTO(L('C1')),
    L('VA'),...NEXT(5),...GOTO(L('VL')),
    L('CUT'),...PUSH0,...AT(3),['PUT'], L('END')]); }

// ─── מודלים ב-JS (לחיפוש מהיר על הדוגמאות) ───
const M={
  swap:(l,{a,b})=>l.includes(a)&&l.includes(b)?l.map(x=>x===a?b:x===b?a:x):[...l],
  revp:(l,{s,incl})=>{ let i=l.indexOf(s); if(i<0) return [...l].reverse(); if(incl) i++; return [...l.slice(0,i).reverse(),...l.slice(i)]; },
  bubble:(l,{rf})=>{ if(!l.length) return []; let c=l[0]; const o=[]; for(const x of l.slice(1)){ if(rf(c,x)) o.push(x); else { o.push(c); c=x; } } o.push(c); return o; },
  deal:(l,{k})=>{ const o=[]; for(let r=0;r<k;r++) for(let j=r;j<l.length;j+=k) o.push(l[j]); return o; },
  alt:(l,{kf})=>{ const a=l.filter(kf), b=l.filter(x=>!kf(x)), o=[]; for(let i=0;i<Math.max(a.length,b.length);i++){ if(i<a.length) o.push(a[i]); if(i<b.length) o.push(b[i]); } return o; },
  window:(l,{k,mode})=>{ if(l.length<k) return [...l]; let b=0, bs=null; for(let i=0;i+k<=l.length;i++){ let s=0; for(let t=0;t<k;t++) s+=l[i+t]; if(bs===null||(mode==='max'?s>bs:s<bs)){ bs=s; b=i; } } return l.slice(b,b+k); },
  between:(l,{a,b,inA,inB})=>{ const o=[]; let st=0; for(const x of l){ if(x===a||x===b){ if(!st){ st=1; if(inA) o.push(x); } else { if(inB) o.push(x); break; } } else if(st) o.push(x); } return o; },
  chase:(l,{ff})=>{ if(!l.length) return []; const t=x=>{ const q=ff(x); return q<l.length?l[q]:0; }; const o=[l[0]]; let c=l[0]; for(;;){ const y=t(c); if(!y||o.includes(y)) break; o.push(y); c=y; } return o; },
};
const same=(a,b)=>a.length===b.length&&a.every((x,i)=>x===b[i]);
const fitsAll=(lists,outs,f)=>{ for(let e=0;e<lists.length;e++) if(!same(f(lists[e]),outs[e])) return false; return true; };
const isSubseq=(l,w)=>{ let j=0; for(const x of l) if(j<w.length&&w[j]===x) j++; return j===w.length; };
const isContig=(l,w)=>{ if(!w.length) return true; const a=l.indexOf(w[0]); return a>=0&&same(l.slice(a,a+w.length),w); };

// ─── חריצים: כלי מהמדף לפי לוח, או בונה-הערכים ───
// lut: Map(מפתח ⇒ ערך), k קלטים (מפתח = ספרות של 4 ביט). bool: «לא-אפס» = אמת (וגם הפוך)
function fitOps(parts,lut,k,{bool=true,orders}={}){ const out=[]; const ops=parts.ops[k]||[]; orders=orders||(k===1?[[0]]:[[0,1],[1,0]]);
  for(const o of ops){ const prog=relocate(o.prog); if(!prog) continue;
    for(const ord of orders) for(const neg of bool?[false,true]:[false]){ let ok=true;
      for(const [key,v] of lut){ const dg=[...Array(k).keys()].map(j=>(key>>(4*(k-1-j)))&15); const kk=ord.reduce((s,j)=>s*16+dg[j],0); const y=o.T[kk]; const got=bool?((y!==0)!==neg):y; if(got!==(bool?!!v:v)){ ok=false; break; } }
      if(ok) out.push({tool:{name:o.name,prog,ins:o.ins,out:o.out},ord,neg,name:o.name+(neg?' (הפוך)':''),len:prog.length}); } }
  return out.sort((a,b)=>a.len-b.len); }
const LINS={1:[0],2:[0,1],3:[0,1,3]};
function learnLut(lut,k,{bool=true,ms=60000,say=()=>{},tag='לוח'}={}){ const K=[...lut.keys()]; if(!K.length) return null; const ins=LINS[k]; const dig=(key,j)=>(key>>(4*(k-1-j)))&15;
  const val=v=>bool?(v?15:0):v;
  const gen=()=>{ const key=K[R(K.length)]; const mem=Array.from({length:16},()=>R(16)); ins.forEach((c,j)=>{ mem[c]=dig(key,j); }); const w=val(lut.get(key)); const m0=mem.slice(); return {mem,want:w,ok:r=>r[2]===w&&ins.every(c=>r[c]===m0[c])&&[8,9,10,11,12,13,14,15].every(c=>r[c]===m0[c])}; };
  const name=`${tag}: `+[...lut].sort((a,b)=>a[0]-b[0]).map(([a,v])=>`${a}→${+v}`).join(',');
  say(`    בונה-הערכים לומד «${name.slice(0,70)}» (${K.length} מפתחות)…`); const v=valueBuild(gen,{name,ins,out:2,ms}); if(!v.prog) return null; const prog=relocate(v.prog); if(!prog) return null;
  const code=encodeG(prog); for(const key of K) for(let t=0;t<3;t++){ const m=Array.from({length:16},()=>R(16)); ins.forEach((c,j)=>{ m[c]=dig(key,j); }); const r=runFastG(code,m,0,60000); if(!r||(r[2]&15)!==val(lut.get(key))) return null; }
  return {tool:{name,prog,ins,out:2},ord:[...Array(k).keys()],neg:false,name:'נלמד '+(v.expr?showExpr(v.expr):name.slice(0,40)),learned:true}; }
const evalTool=(cand,k)=>(...a)=>{ const kk=cand.ord.reduce((s,j)=>s*16+a[j],0); return cand.T?cand.T[kk]:null; };

// ─── החיפוש ───
export async function rearrCompose(gen,{ms=+process.env.REARRMS||150000,say=()=>{},N=+process.env.REARRN||700}={}){ const T0=Date.now(), DEAD=T0+ms; const left=()=>DEAD-Date.now();
  const EX=Array.from({length:N},()=>gen()); let outs; try{ outs=EX.map(e=>JSON.parse(e.want)); }catch{ return {prog:null,why:'פלט לא רשימה'}; }
  if(!outs.every(o=>Array.isArray(o)&&o.every(x=>Number.isInteger(x)))) return {prog:null,why:'הפלט אינו רשימה'};
  const lists=EX.map(e=>walk(e.mem)); if(lists.every((l,i)=>same(l,outs[i]))) return {prog:null,why:'אין שינוי'};
  if(!outs.every((o,i)=>new Set(o).size===o.length&&o.every(x=>lists[i].includes(x)))) return {prog:null,why:'הפלט אינו מאיברי הקלט'};
  const perm=outs.every((o,i)=>o.length===lists[i].length), subseq=outs.every((o,i)=>isSubseq(lists[i],o)), contig=subseq&&outs.every((o,i)=>isContig(lists[i],o));
  const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const parts=shelfParts(sh);
  let STATS=null; const stats=()=>{ if(STATS) return STATS; STATS=[]; for(const s of parts.stats){ const prog=relocate(s.prog); if(!prog) continue; const C=encodeG(s.prog); const ev=[]; let ok=true; for(const e of EX){ const r=runFastG(C,e.mem,0,300000); if(!r){ ok=false; break; } ev.push(r[2]&15); } if(ok) STATS.push({name:s.name,prog,ev}); } return STATS; };
  const chk=makeChecker(gen,300,600000); const more=Array.from({length:300},()=>gen());
  const verify=p=>{ for(const e of more){ const r=run(p,e.mem,{maxSteps:600000}); if(!r||r.st.length||!e.ok(r.mem)) return null; } if(!chk(p)) return null; if(deepRelocOk(p,gen)) return p; const f=repairJumps(p,gen); return f&&deepRelocOk(f,gen)&&chk(f)?f:null; };
  let tried=0; const attempt=(prog,how)=>{ tried++; const ok=verify(prog); if(!ok){ say('  נכשל באימות: '+how); return null; } return {prog:ok,how,ms:Date.now()-T0}; };
  const S=(ex,f)=>{ for(let e=0;e<lists.length;e++) if(!same(f(lists[e],e),outs[e])) return false; return true; };
  let r;
  // 1. החלף-שניים
  if(perm){ const st=stats(); const diff=outs.map((o,e)=>{ const d=[]; o.forEach((x,i)=>{ if(x!==lists[e][i]) d.push(x); }); return d; });
    if(diff.every(d=>d.length===0||d.length===2)) for(let a=0;a<st.length&&!r;a++) for(let b=a+1;b<st.length&&!r;b++){ const A=st[a], B=st[b];
      if(!diff.every((d,e)=>!d.length||(d.includes(A.ev[e])&&d.includes(B.ev[e])))) continue;
      if(S(0,(l,e)=>M.swap(l,{a:A.ev[e],b:B.ev[e]}))) r=attempt(swapFrame({s1:A,s2:B}),`החלף-שניים [${A.name}] ↔ [${B.name}]`); } }
  // 2. הפוך-רישא
  if(!r&&perm){ const st=stats(); for(const s of st){ if(r) break; for(const incl of [true,false]){ if(S(0,(l,e)=>M.revp(l,{s:s.ev[e],incl}))){ r=attempt(revPrefixFrame({s,incl}),`הפוך-רישא עד [${s.name}]${incl?' (כולל)':' (לא כולל)'}`); if(r) break; } } } }
  // 3. חלוקה-לערמות(k)
  if(!r&&perm) for(let k=2;k<=7&&!r;k++) if(S(0,l=>M.deal(l,{k}))) r=attempt(dealFrame({k}),`חלוקה-לערמות k=${k}`);
  // 4. מעבר-השוואה: מהדוגמאות — לכל (נושא, x) האם x יצא לפני הנושא
  if(!r&&perm){ const lut=new Map(); let ok=true;
    for(let e=0;e<lists.length&&ok;e++){ const l=lists[e], o=outs[e]; if(!l.length) continue; let c=l[0];
      for(let j=1;j<l.length;j++){ const x=l[j], key=c*16+x; let v; if(o[j-1]===x) v=1; else if(o[j-1]===c) v=0; else { ok=false; break; } if(lut.has(key)&&lut.get(key)!==v){ ok=false; break; } lut.set(key,v); if(!v) c=x; }
      if(ok&&o[l.length-1]!==c) ok=false; }
    if(ok&&lut.size&&[...lut.values()].some(v=>v)){ let cands=fitOps(parts,lut,2); say(`  מעבר-השוואה: ${lut.size} מפתחות, ${cands.length} כלים מתאימים`);
      if(!cands.length&&left()>20000){ const L=learnLut(lut,2,{ms:Math.min(90000,left()-10000),say,tag:'יחס-מעבר'}); if(L) cands=[L]; }
      for(const c of cands.slice(0,4)){ const rel={...c,order:c.ord[0]===0?'ab':'ba'}; r=attempt(bubbleFrame({rel}),`מעבר-השוואה [${c.name}${rel.order==='ba'?' · הפוך-סדר':''}]`); if(r) break; } } }
  // 5. לסירוגין(K): שיוך הערכים לשתי מחלקות (256 אפשרויות על 8..15), המחלקה «כן» ראשונה
  if(!r&&perm){ const sub=lists.slice(0,250), so=outs.slice(0,250); const good=[];
    for(let m=1;m<255;m++){ const kf=x=>x>=8&&((m>>(x-8))&1)===1; let ok=true; for(let e=0;e<sub.length;e++) if(!same(M.alt(sub[e],{kf}),so[e])){ ok=false; break; } if(ok) good.push(m); }
    for(const m of good){ if(r) break; const kf=x=>((m>>(x-8))&1)===1; if(!S(0,l=>M.alt(l,{kf}))) continue; const seen=new Set(lists.flat()); const lut=new Map([...seen].map(v=>[v,kf(v)?1:0]));
      let cands=fitOps(parts,lut,1); if(!cands.length&&left()>20000){ const L=learnLut(lut,1,{ms:Math.min(60000,left()-10000),say,tag:'מפתח'}); if(L) cands=[L]; }
      for(const c of cands.slice(0,3)){ r=attempt(altFrame({key:c}),`לסירוגין [מפתח: ${c.name}]`); if(r) break; } } }
  // 6. חלון-כבד(k)
  if(!r&&contig) for(let k=1;k<=7&&!r;k++) for(const mode of ['max','min']){ if(S(0,l=>M.window(l,{k,mode}))){ r=attempt(windowFrame({k,mode}),`חלון-${mode==='max'?'כבד':'קל'} k=${k}`); if(r) break; } }
  // 7. בין-סמנים
  if(!r&&contig){ const st=stats(); for(let a=0;a<st.length&&!r;a++) for(let b=a;b<st.length&&!r;b++) for(const inA of [false,true]) for(const inB of [false,true]){ if(r) break; const A=st[a], B=st[b];
      if(S(0,(l,e)=>M.between(l,{a:A.ev[e],b:B.ev[e],inA,inB}))) r=attempt(betweenFrame({s1:A,s2:B,inA,inB}),`בין-סמנים [${A.name}] … [${B.name}]${inA?' כולל-ראשון':''}${inB?' כולל-שני':''}`); } }
  // 8. סינון-דרגה: R מהמדף (יחס דו-מקומי), התנאי על (r) / (r,i) / (r,n)
  if(!r&&subseq&&!perm){ const keepLab=lists.map((l,e)=>{ const k=new Set(outs[e]); return l.map(x=>k.has(x)?1:0); });
    const rels=[]; for(const o of parts.ops[2]||[]) for(const order of ['yx','xy']) for(const neg of [false,true]) rels.push({o,order,neg});
    const sigs=new Set(); const found=[];
    for(const rl of rels){ const rk=lists.map(l=>l.map(x=>l.reduce((s,y)=>{ const v=rl.o.T[rl.order==='yx'?y*16+x:x*16+y]; return s+(((v!==0)!==rl.neg)?1:0); },0))); const sg=J(rk.slice(0,60)); if(sigs.has(sg)) continue; sigs.add(sg);
      for(const feats of [['r'],['r','i'],['r','n']]){ const lut=new Map(); let ok=true;
        for(let e=0;e<lists.length&&ok;e++) lists[e].forEach((x,i)=>{ if(!ok) return; const fv={r:rk[e][i],i,n:lists[e].length}; const key=feats.reduce((s,f)=>s*16+fv[f],0); const v=keepLab[e][i]; if(lut.has(key)&&lut.get(key)!==v) ok=false; else lut.set(key,v); });
        if(ok&&[...lut.values()].some(v=>v)&&[...lut.values()].some(v=>!v)){ found.push({rl,feats,lut}); break; } }
      if(found.length>=6) break; }
    say(`  סינון-דרגה: ${found.length} צירופים עקביים`);
    const relTool=rl=>{ const prog=relocate(rl.o.prog); return prog&&{tool:{name:rl.o.name,prog,ins:rl.o.ins,out:rl.o.out},order:rl.order,neg:rl.neg,name:rl.o.name+(rl.neg?' (הפוך)':'')+(rl.order==='xy'?' (x,y)':'')}; };
    for(const pass of ['shelf','learn']) for(const fd of found.sort((a,b)=>a.feats.length-b.feats.length)){ if(r||left()<5000) break; const rel=relTool(fd.rl); if(!rel) continue; const k=fd.feats.length;
      let cands=pass==='shelf'?fitOps(parts,fd.lut,k):(()=>{ const L=learnLut(fd.lut,k,{ms:Math.min(60000,left()-5000),say,tag:'תנאי-דרגה'}); return L?[L]:[]; })();
      for(const c of cands.slice(0,3)){ const pred={tool:c.tool,neg:c.neg,feats:fd.feats,order:c.ord.map(j=>fd.feats[j])}; r=attempt(rankFrame({rel,pred}),`סינון-דרגה [r(x)=#y: ${rel.name}] [תנאי(${pred.order.join(',')}): ${c.name}]`); if(r) break; } } }
  // 9. מעקב-מצביעים: f(x) = המקום של האיבר הבא בפלט
  //    הסקה: זוגות (o_j ⇒ המקום של o_{j+1}) מדויקים; לאיבר האחרון — «מותר»: מקום שכבר בוקר, או מחוץ לרשימה (≥n)
  if(!r&&!perm&&outs.every((o,e)=>!lists[e].length||o[0]===lists[e][0])){ const exact=new Map(), allow=new Map(); let ok=true;
    for(let e=0;e<lists.length&&ok;e++){ const l=lists[e], o=outs[e]; if(!o.length) continue;
      for(let j=0;j+1<o.length;j++){ const q=l.indexOf(o[j+1]); if(exact.has(o[j])&&exact.get(o[j])!==q){ ok=false; break; } exact.set(o[j],q); }
      const vis=new Set(o.map(x=>l.indexOf(x))); const al=new Set([...Array(16).keys()].filter(q=>q>=l.length||vis.has(q))); const v=o.at(-1);
      allow.set(v,allow.has(v)?new Set([...allow.get(v)].filter(q=>al.has(q))):al); }
    for(const [v,al] of allow){ if(exact.has(v)&&!al.has(exact.get(v))) ok=false; if(!al.size) ok=false; }
    if(ok&&(exact.size||allow.size)){ const lut=new Map(exact); for(const [v,al] of allow) if(!lut.has(v)) lut.set(v,Math.min(...al));
      const fitsT=Tb=>[...exact].every(([v,q])=>Tb[v]===q)&&[...allow].every(([v,al])=>exact.has(v)||al.has(Tb[v]));
      let cands=[]; for(const o of parts.ops[1]||[]){ if(!fitsT(o.T)) continue; const prog=relocate(o.prog); if(!prog) continue; if(!S(0,l=>M.chase(l,{ff:x=>o.T[x]}))) continue; cands.push({tool:{name:o.name,prog,ins:o.ins,out:o.out},ord:[0],neg:false,name:o.name,len:prog.length}); }
      cands.sort((x,y)=>x.len-y.len);
      if(!cands.length&&left()>20000){ const L=learnLut(lut,1,{bool:false,ms:Math.min(90000,left()-10000),say,tag:'מקום-הבא'}); if(L){ const code=encodeG(L.tool.prog); const ff=x=>{ const m=Array.from({length:16},()=>0); m[0]=x; const z=runFastG(code,m,0,60000); return z?z[2]&15:-1; }; if(S(0,l=>M.chase(l,{ff}))) cands=[L]; } }
      for(const c of cands.slice(0,3)){ r=attempt(chaseFrame({f:c}),`מעקב-מצביעים [מקום-הבא: ${c.name}]`); if(r) break; } } }
  return r?{...r,tried}:{prog:null,tried,ms:Date.now()-T0}; }

if((process.argv[1]||'').endsWith('rearr.mjs')){ const { llGen }=await import('./listlist.mjs'); const { finalCheck }=await import('./tzoref.mjs');
  const file=process.argv[2]; const only=process.argv[3]?new Set(process.argv[3].split('|')):null; const S=[];
  for(const f of file.split(',')){ const j=JSON.parse(fs.readFileSync(f,'utf8')); for(const t of (j.tasks||j)) if(t.kind==='list2list'&&(!only||only.has(t.name))) S.push(t); }
  let ok=0; for(const t of S){ const gen=llGen(new Function('return ('+t.src+')')()); const t0=Date.now(); const r=await rearrCompose(gen,{say:process.env.V?console.log:()=>{}}); const sec=(Date.now()-t0)/1000;
    let fc=null, dr=null; if(r.prog){ fc=finalCheck(r.prog,gen,20000).bad; dr=deepRelocOk(r.prog,gen,{n:200}); } const good=!!r.prog&&fc===0&&dr; if(good) ok++;
    console.log(`${good?'✓':'✗'} ${t.name}: ${r.prog?`${r.prog.length} פקודות · ${r.how} · בדיקה-סופית ${fc}/20000 · נייד ${dr}`:'לא נמצא'+(r.why?' ('+r.why+')':'')} · ${sec.toFixed(1)} שנ׳`); }
  console.log(`סך: ${ok}/${S.length}`); process.exit(0); }
