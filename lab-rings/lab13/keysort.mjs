// «מיון לפי מפתח שנלמד» (רשימה ⇒ רשימה). שלד שכתבנו + חיפוש; מה שנכנס לחריצים — המכונה מחליטה מהדוגמאות:
//   1. הפלט הוא סידור-מחדש של הקלט? מכל דוגמה: מי בא לפני מי. (אם יש צעד-מקדים מהמדף, למשל «מיין רשימה» — גם מה היה הסדר אחריו.)
//   2. מזה: מפתח K על 8..15 (רמות 0..m) — «x לפני y» ⇒ K(x)≤K(y), ואם הסדר לא מוסבר ע"י שוברי-השוויון ⇒ K(x)<K(y). סתירה (מעגל) ⇒ לא המשפחה הזאת.
//      שוברי-שוויון: «יציב» (כמו אחרי הצעד-המקדים) או «הפוך». בלי צעד-מקדים ובלי שוויונות ⇒ K = טבלת-דירוג מלאה (סדר כלשהו על 8..15).
//   3. את K בונה בונה-הערכים (valueBuild) מהטבלה בלבד — בכמה קידודים שומרי-סדר (0..m, הפוך, מרווח…).
//   4. כלי-השוואה מהמדף (שני קלטים ⇒ תא 2): המכונה בודקת על טבלת-האמת שלו איזה סידור-קלטים/היפוך נותן בדיוק את כלל-העצירה של המסגרת.
//   5. מסגרת «מיון-הכנסה» על הרשימה המקושרת: לכל איבר x (בסדר שאחרי הצעד-המקדים) — הולכים על הרשימה הממוינת עד המקום, ומשרשרים.
// תאים: 1 = ראש הרשימה הממוינת, 3 = שארית הקלט, 4 = x, 5 = K(x), 6 = «חוליה» (הכתובת שמצביעה על הנוכחי), 7 = K(נוכחי). 0,2 = קלט/פלט לכלים.
// כלי בחריץ שנוגע בתאי-המסגרת או בתאי-הרשימה — התאים נשמרים במחסנית סביבו (כמו guardCells).
import fs from 'fs'; import { run } from './machine3s.mjs'; import { makeChecker, finalCheck, movable } from './tzoref.mjs'; import { valueBuild, show } from './tzoref-value.mjs';
import { runFastG, encodeG, walk, walkA, shift, chainSafeLL, relocate } from './chainsafe.mjs'; import { assemble } from './posframes.mjs';
const R=k=>Math.floor(Math.random()*k); const J=JSON.stringify;
const T=c=>[['WHERE',c],['GO'],['TAKE']], P=c=>[['WHERE',c],['GO'],['PUT']], AT=c=>[...T(c),['WHERE@'],['GO']];
const PUSH15=[...T(4),['TAKE'],['CALC'],['TAKE'],['CALC']], PUSH1=[...PUSH15,['SHR'],['SHR'],['SHR']], PUSH0=[...PUSH15,...PUSH15,['CALC']];
const GOTO=l=>[...PUSH15,['J',l]]; const Z={code:[['WHERE',0],['GO']]};
const STATE=[1,3,4,5,6,7], LISTV=[8,9,10,11,12,13,14,15];
const usedC=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]));
// שומר: תאי-מסגרת/רשימה שהכלי נוגע בהם, ותאים שהמסגרת עצמה כותבת בהם קלט לכלי. «לאן מהמחסנית» ⇒ כולם.
const guard=(p,writes=[])=>{ const any=p.some(x=>x[0]==='WHERE@'), u=usedC(p); return [...STATE,...LISTV].filter(c=>any||u.has(c)||writes.includes(c)); };
const SAVE=g=>g.flatMap(T), REST=g=>[...g].reverse().flatMap(P);
// «לולאה נקייה» (בדיקה סטטית): אחרי כל קפיצה לאחור, «לאן» ו«איפה» נקבעים מחדש לפני שמשתמשים בהם.
//   הבדיקה הסופית מערבבת אותם בכל קפיצה לאחור; כלי שהלולאה שלו קוראת «איפה» ישן נכשל לעתים רחוקות — בתוך מסגרת שקוראת לו עשרות פעמים זה כבר נתפס.
export function loopClean(p){ for(let j=0;j<p.length;j++){ if(p[j][0]!=='JUMP') continue; let i=j-1; while(i>=0&&!['WHERE','WHERE@','JUMP'].includes(p[i][0])) i--; if(i<0||p[i][0]!=='WHERE') return false; const k=p[i][1]; if(k>j) continue;
    let a=false, q=false; for(let t=k;t<p.length&&!(a&&q);t++){ const o=p[t][0]; if(o==='WHERE'||o==='WHERE@') a=true; else if(o==='GO'){ if(!a) return false; q=true; } else if(o==='TAKE'||o==='PUT'){ if(!q) return false; } else if(o==='JUMP'){ if(!a||!q) return false; } } }
  return true; }

// המסגרת. key: קורא תא 0, עונה בתא 2. cmp: קורא תאים 0,1, עונה בתא 2. swap: (K(נוכחי),K(x)) במקום (K(x),K(נוכחי)). neg: עוצרים כשהתשובה 0.
export function keySortFrame({pre=[],key,cmp,swap=false,neg=false}){ const gK=guard(key), gB=guard(cmp,[1]);
  return assemble([ ...pre.flatMap(s=>[Z,{code:s}]),
    ...T(1),...P(3), ...PUSH0,...P(1),
    'OUTER', ...T(3),['J','HAVE'], ...GOTO('EXIT'),
    'HAVE', ...T(3),...P(4), ...AT(4),['TAKE'],...P(3),
      ...SAVE(gK), ...T(4),...P(0), Z,{code:key}, ...REST(gK), ...T(2),...P(5),
      ...PUSH1,...P(6),
    'WALK', ...AT(6),['TAKE'],['J','CMP'], ...GOTO('INS'),
    'CMP', ...SAVE(gK), ...AT(6),['TAKE'],...P(0), Z,{code:key}, ...REST(gK), ...T(2),...P(7),
      ...SAVE(gB), ...(swap?[...T(7),...P(0),...T(5),...P(1)]:[...T(5),...P(0),...T(7),...P(1)]), Z,{code:cmp}, ...REST(gB),
      ...T(2),['J',neg?'ADV':'INS'], ...GOTO(neg?'INS':'ADV'),
    'ADV', ...AT(6),['TAKE'],...P(6), ...GOTO('WALK'),
    'INS', ...AT(6),['TAKE'], ...AT(4),['PUT'], ...T(4),...AT(6),['PUT'], ...GOTO('OUTER'),
    'EXIT' ]); }

// מהדוגמאות: מפתח (רמות) שמסביר את הפלט, בהינתן הסדר שלפני (SL) וכלל שוברי-השוויון. null ⇒ אין כזה.
export function levelsFrom(SLs,Os,tie){ const E=new Map(), seen=new Set();
  for(let i=0;i<Os.length;i++){ const o=Os[i], pos=new Map(SLs[i].map((x,k)=>[x,k])); for(const x of o) seen.add(x);
    for(let a=0;a<o.length;a++) for(let b=a+1;b<o.length;b++){ const x=o[a], y=o[b]; const same=pos.get(x)<pos.get(y); const eqOk=tie==='stable'?same:!same; const k=x*16+y; E.set(k,Math.max(E.get(k)??0,eqOk?0:1)); } }
  const V=[...seen].sort((a,b)=>a-b); const K=new Map(V.map(v=>[v,0]));
  for(let it=0;;it++){ let ch=false; for(const [k,s] of E){ const u=k>>4, v=k&15; if(K.get(u)+s>K.get(v)){ K.set(v,K.get(u)+s); ch=true; } } if(!ch) break; if(it>V.length+1) return null; }   // מעגל עם «קטן ממש» ⇒ סתירה
  for(const [k,s] of E){ const u=k>>4, v=k&15; if(s?K.get(u)>=K.get(v):K.get(u)>K.get(v)) return null; }
  // ביטחון: מיון-הכנסה לפי K (עם שוברי-השוויון) של כל דוגמה = הפלט
  for(let i=0;i<Os.length;i++){ const out=[]; for(const x of SLs[i]){ let j=0; while(j<out.length&&(tie==='stable'?K.get(out[j])<=K.get(x):K.get(out[j])<K.get(x))) j++; out.splice(j,0,x); } if(J(out)!==J(Os[i])) return null; }
  return {V,K,m:Math.max(0,...K.values())}; }

// קידודים שומרי-סדר (או הופכי-סדר) של הרמות — בונה-הערכים צריך יעד מדויק; כלי-ההשוואה ייבחר לפי הכיוון
function encodings(L){ const {V,K,m}=L; const s=Math.floor(15/Math.max(1,m)); const out=[], seen=new Set();
  for(const [nm,f] of [['רמה',k=>k],['רמה הפוכה',k=>m-k],['רמה+8',k=>k+8],['15-רמה',k=>15-k],['מרווח',k=>k*s],['מרווח הפוך',k=>15-k*s]]){ const c=new Map(V.map(v=>[v,f(K.get(v))])); if([...c.values()].some(x=>x<0||x>15)) continue; const k=J([...c]); if(seen.has(k)) continue; seen.add(k); out.push({nm,c}); }
  return out; }

// כלי-השוואה מהמדף: שני קלטים (0,1) ⇒ תא 2, טבלת «לא-אפס» קבועה על 16×16 (לא תלויה בזבל)
let CMPS=null, CMPN=-1;
function cmpTools(sh){ if(CMPS&&CMPN===sh.named.length) return CMPS; CMPS=[]; CMPN=sh.named.length; const seen=new Set();
  for(const b of [...sh.named].sort((a,b)=>a.prog.length-b.prog.length)){ if(b.bad||(b.ins||[]).join()!=='0,1'||(b.out??2)!==2||b.prog.length>200) continue; const rp=relocate(b.prog); if(!rp||!loopClean(rp)) continue;
    const code=encodeG([['WHERE',0],['GO'],...shift(rp,2)]); const nz=new Uint8Array(256); let ok=true;
    for(let a=0;a<16&&ok;a++) for(let c=0;c<16&&ok;c++){ let z=null; for(let t=0;t<2;t++){ const m=Array.from({length:16},()=>R(16)); m[0]=a; m[1]=c; const r=runFastG(code,m,0,20000); if(!r){ ok=false; break; } const y=r[2]?1:0; if(z===null) z=y; else if(z!==y){ ok=false; break; } } nz[a*16+c]=z; }
    if(!ok) continue; const k=nz.join(''); if(seen.has(k)) continue; seen.add(k); CMPS.push({name:b.name,prog:rp,nz}); }
  return CMPS; }
// איזה כלי + סידור-קלטים + היפוך נותן בדיוק את כלל-העצירה: «יציב» ⇒ עוצרים לפני נוכחי עם רמה גדולה ממש; «הפוך» ⇒ גדולה-או-שווה
function pickCmp(cmps,L,c,tie){ const {V,K}=L; for(const t of cmps) for(const swap of [false,true]) for(const neg of [false,true]){ let ok=true;
    for(const x of V){ for(const y of V){ if(x===y) continue; const want=tie==='stable'?K.get(x)<K.get(y):K.get(x)<=K.get(y); const r=swap?t.nz[c.get(y)*16+c.get(x)]:t.nz[c.get(x)*16+c.get(y)]; if((!!r)!==neg!==want){ ok=false; break; } } if(!ok) break; }
    if(ok) return {...t,swap,neg}; } return null; }

// צעדים-מקדימים מהמדף: כלי רשימה⇒רשימה שמסדר מחדש (לא מוסיף/מוריד), בגרסה בטוחה-לשרשרת; גם זוגות
function preSteps(sh,ex){ const base=ex.map(e=>e.mem); const one=[];
  for(const b of sh.named){ if(b.bad||b.prog.length>400) continue; const bc=encodeG(b.prog); let ok=true, ch=0;
    for(const e of ex){ const r=runFastG(bc,e.mem,0,200000); if(!r){ ok=false; break; } const l=walk(e.mem), o=walkA(r); if(o.length!==l.length||J([...o].sort())!==J([...l].sort())){ ok=false; break; } if(J(o)!==J(l)) ch++; }
    if(!ok||!ch) continue; const s=chainSafeLL(b.prog,ex.slice(0,60)); if(s&&loopClean(s.prog)) one.push({name:b.name,prog:s.prog}); }
  const PADN=14, PAD=Array.from({length:PADN},(_,i)=>i%2?['GO']:['WHERE',0]);
  const apply=(steps)=>{ let mems=base; for(const s of steps){ const c=encodeG([...PAD,...shift(s.prog,PADN)]); const nx=[]; for(const m of mems){ const r=runFastG(c,m,PADN,300000); if(!r) return null; nx.push(Array.from(r)); } mems=nx; } return mems; };
  const out=[{steps:[],SL:base.map(m=>walk(m))}], sig=new Set([J(out[0].SL)]);
  for(const L of [1,2]) for(const st of (L===1?[[]]:one.map(s=>[s]))) for(const s of one){ const steps=[...st,s]; const mems=apply(steps); if(!mems) continue; const SL=mems.map(m=>walkA(m)); const k=J(SL); if(sig.has(k)) continue; sig.add(k); out.push({steps,SL}); }
  return out; }

// שמירת המפתח שנלמד במדף (כמו התנאים שנלמדים): שם מהטבלה עצמה; על 0..7 נרשם מה שהתוכנית עושה בפועל (רק אם זה קבוע)
function saveKey(c,prog){ const name='מפתח: '+[...c].map(([v,k])=>v+'⇐'+k).join(','); const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); if(sh.named.some(b=>b.name===name)) return name;
  const tt=[]; for(let x=0;x<16;x++){ let z=null; for(let t=0;t<6;t++){ const m=Array.from({length:16},()=>R(16)); m[0]=x; const r=run(prog,m,{maxSteps:20000}); if(!r||r.st.length||r.mem[0]!==x) return null; if(z===null) z=r.mem[2]; else if(z!==r.mem[2]) return null; } tt.push(c.has(x)?c.get(x):z); }
  const gen16=()=>{ const mem=Array.from({length:16},()=>R(16)); const w=tt[mem[0]], k=mem[0]; return {mem,want:w,ok:r=>r[2]===w&&r[0]===k}; }; if(finalCheck(prog,gen16,4000).bad) return null;
  sh.named.push({name,prog,ins:[0],out:2,movable:movable(prog,gen16),by:'נלמד: מפתח-מיון (מיון-לפי-מפתח)'}); fs.writeFileSync('shelf3.json',JSON.stringify(sh));
  const LG=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); LG[name]={ins:[0],tt}; fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(LG)); return name; }

// בניית המפתח: בונה-הערכים מקבל רק את הטבלה (ערך ⇒ קוד). מפתח «יקר» (חלקים עם לולאות ארוכות) ⇒ חוסמים את החלק היקר ומבקשים צירוף אחר.
const partsOf=e=>e.cell!=null?[]:[e.f,...partsOf(e.a),...(e.b?partsOf(e.b):[]),...(e.c?partsOf(e.c):[])];
const PCOST=new Map(); function partCost(sh,name){ if(PCOST.has(name)) return PCOST.get(name); const b=sh.named.find(x=>x.name===name); let mx=0;
  if(b) for(let t=0;t<30;t++){ const m=Array.from({length:16},()=>R(16)); const r=run(b.prog,m,{maxSteps:20000}); mx=Math.max(mx,r?r.steps:20000); } PCOST.set(name,mx); return mx; }
const keyCost=(p,V)=>{ let mx=0; for(const v of V) for(let t=0;t<4;t++){ const m=Array.from({length:16},()=>R(16)); m[0]=v; const r=run(p,m,{maxSteps:50000}); mx=Math.max(mx,r?r.steps:50000); } return mx; };
export function buildKey(sh,tab,{ms=60000,maxCost=600,rounds=5,say=()=>{}}={}){ const T0=Date.now(); const vs=[...tab.keys()];
  const kg=()=>{ const mem=Array.from({length:16},()=>R(16)); mem[0]=vs[R(vs.length)]; const k=mem[0], w=tab.get(k); return {mem,want:w,ok:r=>r[2]===w&&r[0]===k}; };
  let ban=sh.named.filter(b=>!loopClean(b.prog)).map(b=>b.name), best=null;   // חלקים עם לולאה לא-נקייה — לא נכנסים למפתח
  for(let round=0;round<rounds&&Date.now()-T0<ms;round++){ const v=valueBuild(kg,{name:'מפתח-מיון',ins:[0],out:2,ms:Math.max(5000,ms-(Date.now()-T0)),ban}); if(!v.prog) break;
    const parts=[...new Set(partsOf(v.expr))].map(n=>[n,partCost(sh,n)]).sort((a,b)=>b[1]-a[1]);
    const rk=relocate(v.prog); if(!rk||!loopClean(rk)||finalCheck(rk,kg,3000).bad){ if(!parts.length) break; ban=[...ban,parts[0][0]]; continue; }
    const c=keyCost(rk,vs); if(!best||c<best.cost) best={prog:rk,expr:v.expr,cost:c}; if(c<=maxCost) break;
    if(!parts.length) break; say(`    מפתח של ${c} צעדים — יקר; חוסם «${parts[0][0]}» (${parts[0][1]} צעדים) ומחפש צירוף אחר`); ban=[...ban,parts[0][0]]; }
  return best; }

export async function keySortCompose(gen,{N=400,ms=+process.env.KSMS||240000,save=!process.env.KSNOSAVE,say=()=>{}}={}){ const T0=Date.now(), DEAD=T0+ms;
  const ex=Array.from({length:N},()=>gen()); const Ls=ex.map(e=>walk(e.mem)), Os=ex.map(e=>JSON.parse(e.want));
  for(let i=0;i<ex.length;i++){ const l=Ls[i], o=Os[i]; if(l.length!==o.length||J([...l].sort())!==J([...o].sort())) return {prog:null,why:'הפלט אינו סידור-מחדש של הקלט'}; }
  if(Ls.every((l,i)=>J(l)===J(Os[i]))) return {prog:null,why:'אין שינוי'};
  const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const cmps=cmpTools(sh); const pres=preSteps(sh,ex.slice(0,150));
  // מועמדים: (צעד-מקדים, שוברי-שוויון) ⇒ רמות. מעדיפים בלי צעד-מקדים, ומפתח שאינו קבוע
  const cands=[]; for(const p of pres) for(const tie of ['stable','anti']){ const L=p.steps.length?levelsFrom(p.SL,Os.slice(0,p.SL.length),tie):levelsFrom(Ls,Os,tie); if(!L||L.m===0) continue; cands.push({pre:p.steps,tie,L}); }
  say(`  צעדים-מקדימים: ${pres.length-1} · מועמדים (מקדים × שוויון) עם מפתח עקבי: ${cands.length} · כלי-השוואה: ${cmps.length}`);
  if(!cands.length) return {prog:null,why:'אין מפתח עקבי',ms:Date.now()-T0};
  const chk=makeChecker(gen,300,600000); const more=Array.from({length:300},()=>gen());
  const PADN=14, PAD=Array.from({length:PADN},(_,i)=>i%2?['GO']:['WHERE',0]);
  const quick=p=>{ const c=encodeG([...PAD,...shift(p,PADN)]); for(let i=0;i<ex.length;i++){ const r=runFastG(c,ex[i].mem,PADN,600000); if(!r||J(walkA(r))!==J(Os[i])) return false; } return true; };
  const verify=p=>{ for(const e of more){ const r=run(p,e.mem,{maxSteps:600000}); if(!r||r.st.length||!e.ok(r.mem)) return false; } return chk(p); };
  // תקציב-צעדים: הבדיקה הסופית עוצרת ב-50,000 צעדים. מודדים את המקרה הגרוע (8 איברים, כל הכנסה הולכת עד הסוף) עם מרווח.
  const STEPMAX=+process.env.KSSTEPS||42000; const memOf=l=>{ const m=Array.from({length:16},()=>R(16)); m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; }); return m; };
  const worst=(p,L)=>{ const byL=[...L.V].sort((a,b)=>L.K.get(a)-L.K.get(b)||a-b); const tests=[byL,[...byL].reverse(),...ex.filter((e,i)=>Ls[i].length>=7).slice(0,60).map(e=>walk(e.mem))]; let mx=0;
    for(const l of tests){ const r=run(p,memOf(l),{maxSteps:STEPMAX}); if(!r) return Infinity; mx=Math.max(mx,r.steps); } return mx; };
  const built=new Map(); let nb=0;
  for(const cd of cands){ for(const enc of encodings(cd.L)){ if(Date.now()>DEAD-15000) return {prog:null,timeout:true,ms:Date.now()-T0,builds:nb};
      const cmp=pickCmp(cmps,cd.L,enc.c,cd.tie); if(!cmp) continue;
      const tk=J([...enc.c]); let key=built.get(tk);
      if(key===undefined){ say(`  בונה מפתח «${enc.nm}» ${[...enc.c].map(([v,k])=>v+'⇐'+k).join(',')} (בונה-ערכים)…`); nb++;
        key=buildKey(sh,enc.c,{ms:Math.min(90000,Math.max(10000,DEAD-Date.now()-15000)),maxCost:+process.env.KSKEYCOST||600,say}); built.set(tk,key); }
      if(!key) continue;
      const prog=keySortFrame({pre:cd.pre.map(s=>s.prog),key:key.prog,cmp:cmp.prog,swap:cmp.swap,neg:cmp.neg});
      if(!loopClean(prog)){ say('  ✗ לולאה לא-נקייה'); continue; }
      if(!quick(prog)){ say('  ✗ נכשל על הדוגמאות'); continue; }
      const w=worst(prog,cd.L); if(w>STEPMAX){ say(`  ✗ ארוך מדי: המקרה הגרוע > ${STEPMAX} צעדים (מפתח ${key.cost} צעדים)`); continue; }
      if(!verify(prog)){ say('  ✗ נכשל בבדיקה'); continue; }
      const kname=save?saveKey(enc.c,key.prog):null;
      const how=`מיין-לפי-מפתח [${kname||('מפתח '+show(key.expr))}]${cd.pre.length?' אחרי ['+cd.pre.map(s=>s.name).join(' ⇒ ')+']':''} · השוואה [${cmp.name}${cmp.swap?' הפוך':''}${cmp.neg?' לא':''}] · שוויון ${cd.tie==='stable'?'יציב':'הפוך'}`;
      return {prog,how,levels:cd.L.m+1,learned:kname,worst:w,keyCost:key.cost,ms:Date.now()-T0,builds:nb}; } }
  return {prog:null,why:'אף מועמד לא נבנה',ms:Date.now()-T0,builds:nb}; }
