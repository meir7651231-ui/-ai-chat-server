// «זוגות» (pairframes.mjs, KEY=pairs) — רשימה ⇒ מספר: ספירות ומדידות על זוגות איברים, ואיבר-מול-סטטיסטיקה.
// אני כותב רק את השלד (לולאה כפולה + תאי-מצב) ואת החיפוש; מה שנכנס לחריצים — המכונה בוחרת מהמדף או לומדת מהדוגמאות.
//   אטום-זוג  c(x) = קפל_{y ∈ תחום(x)} IN(c, R(y,x))        — R יחס דו-מקומי (כלי/צירוף מהמדף, או לוח שנלמד ונבנה ע"י בונה-הערכים)
//                תחום: כולם · לפני x · אחרי x · כולם-חוץ-מ-x · n מעברים (נקודת-שבת)        IN: צובר מהמדף (ספירה, סכום, מקסימום, «או», …)
//   סטטיסטיקה S   — קיפול על כל הרשימה (צובר מהמדף), כלי-רשימה מהמדף, או מסגרת-רחבה (wideframes: ממוצע, סכום רחב…) — מחושבת פעם אחת
//   מעטפת     r ⇐ F(r, s(x, i, c|S)) — F צובר מהמדף, s אות קטן; או «דגל» f ⇐ לוגי(f, a, b) + r ⇐ F(r, f) (שני אירועים מול שתי סטטיסטיקות)
//   סיום       כלי חד-מקומי (סגירות של המדף) מעביר את המצב לתשובה.
// יחס/מפתח שנלמד: (1) «ספירת-זוגות» — התשובה = G(#זוגות y-לפני-x עם R) ⇒ R נקרא מרשימות של שני איברים ונבדק על 3000 דוגמאות;
//                 (2) «איבר מול S» — Σ_x R(x,S) ⇒ לכל ערך של S: 8 נעלמים 0/1 (256 השמות); (3) «מפתח» — כמה מחלקות שונות ⇒ החלוקה היחידה של 8..15 (מ-4140) שמתאימה.
//   הלוח שנלמד: אם כלי/צירוף במדף נותן אותו — משתמשים בו; אחרת בונה-הערכים בונה אותו (ונשמר במדף).
// החיפוש: מדמה כל צירוף ב-JS על לוחות-הערכים (מהיר), ורק מה שעבר 600 דוגמאות חדשות — מורכב לקוד ונבדק במכונה.
import fs from 'fs'; import { run } from './machine3s.mjs'; import { makeChecker, finalCheck, movable } from './tzoref.mjs';
import { lib } from './scanfold.mjs'; import { shift, dataCells, remap } from './scan-tools.mjs'; import { assemble } from './posframes.mjs';
import { codeNum } from './wideframes.mjs'; import { valueBuild } from './tzoref-value.mjs';
const R_=k=>Math.floor(Math.random()*k);
const walk=m=>{ const o=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ o.push(a); a=m[a]; } return o; };
const V=v=>({v}); const N_=(f,...a)=>({f,a});
const sizeOf=e=>e.v!=null?0:1+e.a.reduce((s,x)=>s+sizeOf(x),0);
const subst=(e,m)=>e.v!=null?(m[e.v]??e):{f:e.f,a:e.a.map(x=>subst(x,m))};
const usesVar=(e,v)=>e.v!=null?e.v===v:e.a.some(x=>usesVar(x,v));
export const show=e=>e.v!=null?e.v:`${e.f.name}(${e.a.map(show).join(', ')})`;
function hashArr(a){ let h1=2166136261|0, h2=5381|0; for(let i=0;i<a.length;i++){ const v=a[i]+2; h1=Math.imul(h1^v,16777619); h2=(Math.imul(h2,33)+v)|0; } return (h1>>>0).toString(36)+':'+(h2>>>0).toString(36)+':'+a.length; }
function evalS(e,env){ if(e.v!=null) return env[e.v]; const a=e.a.map(x=>evalS(x,env)); if(a.some(x=>x<0||x==null)) return -1; const T=e.f.T; return e.f.k===1?T[a[0]]:e.f.k===2?T[(a[0]<<4)|a[1]]:T[(a[0]<<8)|(a[1]<<4)|a[2]]; }
// לוח של ביטוי בשני משתנים (a,b) ⇒ 256 כניסות
const tab2=(e,a,b)=>{ const T=new Int8Array(256); for(let i=0;i<256;i++){ const env={[a]:i>>4,[b]:i&15}; T[i]=evalS(e,env); } return T; };

// ─── 1. ספריות: יחסים R(y,x), צוברים IN(c,d), סטטיסטיקות ───────────────────────
const LV=[8,9,10,11,12,13,14,15];
const key64=T=>{ let s=''; for(const y of LV) for(const x of LV) s+=String.fromCharCode(66+T[(y<<4)|x]); return s; };
let RELS=null, RELT=0;
export function relations(){ let mt=0; try{ mt=fs.statSync('shelf3.json').mtimeMs; }catch{} if(RELS&&RELT===mt) return RELS; const L=lib(); const out=[], seen=new Map();
  const add=(e,lvl)=>{ const T=tab2(e,'y','x'); for(const y of LV) for(const x of LV) if(T[(y<<4)|x]<0) return; const k=key64(T); if(seen.has(k)) return; const vs=new Set(); for(const y of LV) for(const x of LV) vs.add(T[(y<<4)|x]); const r={e,T,size:sizeOf(e),lvl,useX:usesVar(e,'x'),useY:usesVar(e,'y'),bool:vs.size===2}; seen.set(k,r); out.push(r); };
  const y=V('y'), x=V('x');
  add(y,0);   // הטלה: c לא תלוי ב-x ⇒ סטטיסטיקה
  for(const f of L.B){ add(N_(f,y,x),1); add(N_(f,x,y),1); }
  for(const f of L.U) add(N_(f,y),1);
  // יחס-מפתח: B(K(y),K(x)) — «אותו מפתח», «מפתח גדול יותר»… ; ו-B(K(y),x), B(y,K(x))
  for(const K of L.U) for(const f of L.B){ add(N_(f,N_(K,y),N_(K,x)),2); }
  for(const K of L.U) for(const f of L.B){ add(N_(f,N_(K,y),x),3); add(N_(f,y,N_(K,x)),3); add(N_(f,x,N_(K,y)),3); add(N_(f,N_(K,x),y),3); }
  for(const f of L.Tn){ add(N_(f,y,x,y),3); add(N_(f,x,y,x),3); add(N_(f,y,y,x),3); add(N_(f,x,x,y),3); add(N_(f,y,x,x),3); add(N_(f,x,y,y),3); }
  out.sort((a,b)=>a.lvl-b.lvl||a.size-b.size); RELS=out; RELT=mt; return out; }
// צוברים: סגירות דו-מקומיות (r = המצב, s = מה שנכנס) מספריית הסורק
let INS=null;
export function accumulators(){ if(INS) return INS; const L=lib(); const BC1=L.BC.slice(0,L.nB1);
  const agg=BC1.filter(b=>b.agg&&b.useR&&b.useS).map(b=>({e:b.e,T:b.tab,size:b.size,agg:true}));
  // «ספירה / יש / כולם»: צובר שעל קלט של שני ערכים בלבד (0 ומשהו) סופר או מסמן — מזוהה מהלוח: ההפעלה החוזרת על אותו ערך נותנת רצף שונה מ-0
  for(const a of agg){ let ok=false; for(const r0 of [0,15]) for(const [z,v] of [[0,1],[0,15],[15,0]]){ if(a.T[(r0<<4)|z]!==r0) continue; let r=r0; const seq=new Set([r0]); for(let k=0;k<8;k++){ r=a.T[(r<<4)|v]; if(r<0) break; seq.add(r); } if(seq.size>=2) ok=true; } a.cnt=ok; }
  const last={e:V('s'),T:Int8Array.from({length:256},(_,i)=>i&15),size:0,agg:false,last:true};
  // «הראשון» = דלג אם לא-אפס(r, s): r≠0 ⇒ r, אחרת s (מהמדף, אם יש)
  const nonc=BC1.filter(b=>!b.agg&&b.useR&&b.useS).map(b=>({e:b.e,T:b.tab,size:b.size,agg:false}));
  const two=L.BC.slice(L.nB1).filter(b=>b.useR&&b.useS).map(b=>({e:b.e,T:b.tab,size:b.size,agg:false}));
  INS={agg,last,nonc,two}; return INS; }

// ─── 2. דוגמאות ⇒ הקשר: לכל צעד חיצוני — x, i ; ו«אטומים מיוחדים» (c או S) ─────────────
export function context(lists){ let S=0; for(const l of lists) S+=l.length; const X=new Int8Array(S), I=new Int8Array(S), E=new Int32Array(S), st=new Int32Array(lists.length+1); let t=0;
  lists.forEach((l,e)=>{ st[e]=t; l.forEach((x,i)=>{ X[t]=x; I[t]=i; E[t]=e; t++; }); }); st[lists.length]=t; return {S,X,I,E,st,n:lists.length,lists}; }
const SCOPES=['all','before','after','others','nall'];
// הזרם של אטום-זוג: לכל צעד חיצוני (x במקום t) — הקיפול על y בתחום
export function innerStream(cx,Rt,INt,init,scope){ const out=new Int8Array(cx.S); const {lists,st}=cx;
  for(let e=0;e<lists.length;e++){ const l=lists[e], n=l.length, b=st[e];
    for(let t=0;t<n;t++){ const x=l[t]; let c=init;
      // n מעברים = «עד שמתייצב»: מעבר הוא פונקציה של c בלבד ⇒ מעבר שלא שינה את c — מכאן c קבוע. לא התייצב תוך n מעברים ⇒ זה לא נקודת-שבת (נפסל)
      if(scope==='nall'){ let stable=false; for(let p=0;p<=n&&!stable;p++){ const c0=c; for(let j=0;j<n;j++){ const d=Rt[(l[j]<<4)|x]; c=INt[(c<<4)|d]; if(c<0) return null; } if(c===c0) stable=true; } if(!stable) return null; }
      else { const j0=scope==='after'?t+1:0, j1=scope==='before'?t:n; for(let j=j0;j<j1;j++){ if(scope==='others'&&j===t) continue; const d=Rt[(l[j]<<4)|x]; c=INt[(c<<4)|d]; if(c<0) return null; } }
      out[b+t]=c; } }
  return out; }
// סטטיסטיקה מתוכנית (כלי-רשימה מהמדף / מסגרת-רחבה): מריצים במכונה על כל רשימה
const relink=l=>{ const m=Array.from({length:16},()=>R_(16)); for(let c=8;c<16;c++) m[c]=0; m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; }); return m; };
function progVal(prog,l){ let v=null; for(let k=0;k<2;k++){ const m=relink(l); const r=run(prog,m,{maxSteps:60000}); if(!r||r.st.length) return -1; if([1,...LV].some(c=>r.mem[c]!==m[c])) return -1; const y=r.mem[2]&15; if(v==null) v=y; else if(v!==y) return -1; } return v; }
const PAD=[['WHERE',0],['GO'],['WHERE',5],['GO'],['WHERE',0],['GO']];
function progStats(sample){ const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const out=[];
  // כלי-רשימה מהמדף: עונה בתא 2, לא נוגע ברשימה, נייד (עובד גם אחרי ריפוד)
  for(const b of sh.named){ if(!b.prog.some(x=>x[0]==='WHERE@')||b.prog.length>400||/^(בלי|רק) /.test(b.name)) continue; const moved=[...PAD,...shift(b.prog,PAD.length)]; let ok=true;
    for(const l of sample){ const v=progVal(b.prog,l); if(v<0||progVal(moved,l)!==v){ ok=false; break; } } if(ok) out.push({kind:'prog',name:b.name,prog:b.prog,size:1+b.prog.length/100}); }
  // מסגרת-רחבה (wideframes «למעלה»): סכום רחב / מונה / סכום חלקי n או קבוע — מספרים מעל 15 בשני תאים
  for(const g of [{kind:'x',name:'x'},{kind:'one',name:'1'}]) for(const [out_,d] of [['lo',null],['hi',null],['div','n'],['div',2],['div',4],['div',8]]){
    if(g.kind==='one'&&out_!=='lo'&&!(out_==='div'&&d!=='n')) continue; const plan={mode:'up',g,out:out_,d,post:{kind:'id'}}; let prog; try{ prog=codeNum(plan); }catch{ continue; }
    out.push({kind:'prog',name:`רחב: Σ${g.name} ${out_}${d!=null?'/'+d:''}`,prog,size:2}); }
  // ממוצע של g(x) לכל כלי חד-מקומי g מהמדף: Σg(x) חלקי n (למשל g = 15−x ⇒ 15 − ממוצע מעוגל למעלה)
  for(const f of lib().U){ const plan={mode:'up',g:{kind:'tool',tool:f,name:f.name},out:'div',d:'n',post:{kind:'id'}}; let prog; try{ prog=codeNum(plan); }catch{ continue; }
    out.push({kind:'prog',name:`רחב: Σ${f.name}(x)/n`,prog,size:2.5}); }
  return out; }

// ─── 3. כלים מהספרייה: מפתח-סיום, «שקית», התאמה ──────────────────────────────
function findG(map){ const {UC,IDX,W32}=lib(); let id=true; for(let v=0;v<16;v++) if(map[v]>=0&&map[v]!==v){ id=false; break; } if(id) return UC[0];
  const keys=[]; for(let v=0;v<16;v++) if(map[v]>=0) keys.push((v<<4)|map[v]);
  for(let w=0;w<W32;w++){ let m=0xffffffff; for(const k of keys){ m&=IDX[k][w]; if(!m) break; } if(m) return UC[(w<<5)+(31-Math.clz32(m&-m))]; } return null; }
const HW=Uint32Array.from({length:16},(_,v)=>(Math.imul(v+1,2654435761)^0x9e3779b9)>>>0);
function bagOk(s,cx,W){ const m=new Map(); const st=cx.st; for(let e=0;e<cx.n;e++){ let h=0; for(let t=st[e];t<st[e+1];t++) h=(h+HW[s[t]])>>>0; const k=h*16+(st[e+1]-st[e]); const w=m.get(k); if(w===undefined) m.set(k,W[e]); else if(w!==W[e]) return false; } return true; }
const MV_=new Int8Array(16), MG_=new Int32Array(16); let GEN_=0;
function fits(F,s,c,cx,W,map){ const g=++GEN_; const st=cx.st, n=cx.n;
  for(let e=0;e<n;e++){ let r=c; for(let t=st[e],z=st[e+1];t<z;t++){ r=F[(r<<4)|s[t]]; if(r<0) return false; } const w=W[e]; if(MG_[r]!==g){ MG_[r]=g; MV_[r]=w; } else if(MV_[r]!==w) return false; }
  for(let v=0;v<16;v++) map[v]=MG_[v]===g?MV_[v]:-1; return true; }
function apply(f,args,n){ const out=new Int8Array(n), T=f.T;
  if(f.k===1){ const a=args[0]; for(let t=0;t<n;t++){ const x=a[t]; out[t]=x<0?-1:T[x]; } }
  else if(f.k===2){ const a=args[0], b=args[1]; for(let t=0;t<n;t++){ const x=a[t], y=b[t]; out[t]=(x<0||y<0)?-1:T[(x<<4)|y]; } }
  else { const a=args[0], b=args[1], c=args[2]; for(let t=0;t<n;t++){ const x=a[t], y=b[t], z=c[t]; out[t]=(x<0||y<0||z<0)?-1:T[(x<<8)|(y<<4)|z]; } }
  return out; }
// אותות שמשתמשים באטום המיוחד (c או S): c, U(c), B(c,a), B(a,c) ל-a ∈ {x, i}
// אותות שמשתמשים באטום המיוחד (c או S): c, U(c), B(c,a), B(a,c) ל-a ∈ {x, i}. רק אותות ש«השקית» שלהם קובעת את התשובה (צובר חילופי רואה רק אותה);
//   אם השקית של c לא קובעת — גם של U(c) לא (U(c) פונקציה של c). lite: בלי x (לרמות היקרות)
function* signalsOf(cx,sp,spName,W,{lite=false,ext=false}={}){ const {U,B}=lib(); const seen=new Set(); const S=cx.S;
  const mk=(e,s)=>{ for(let t=0;t<S;t++) if(s[t]<0) return null; const k=hashArr(s); if(seen.has(k)) return null; seen.add(k); return bagOk(s,cx,W)?{e,s,size:sizeOf(e)}:null; };
  const c=V(spName); const c0=mk(c,sp); if(c0) yield c0;
  if(c0) for(const f of U){ const r=mk(N_(f,c),apply(f,[sp],S)); if(r) yield r; }
  const passB=[];
  for(const [an,as] of lite?[['i',cx.I]]:[['x',cx.X],['i',cx.I]]) for(const f of B){ let r=mk(N_(f,c,V(an)),apply(f,[sp,as],S)); if(r){ passB.push(r); yield r; } r=mk(N_(f,V(an),c),apply(f,[as,sp],S)); if(r){ passB.push(r); yield r; } }
  // גודל 2: U(B(c,a)) — רק מעל אות B שהשקית שלו כבר קובעת את התשובה (אחרת גם U שלו לא)
  for(const b of passB) for(const f of U){ const r=mk(N_(f,b.e),apply(f,[b.s],S)); if(r) yield r; }
  // ext (לסטטיסטיקות בלבד — מעטות): B(U(x),S), B(S,U(x)), B(x,U(S)), B(U(S),x) — למשל «15−x גדול מ-S»
  if(ext){ const ux=U.map(f=>({f,s:apply(f,[cx.X],S)})), uc=U.map(f=>({f,s:apply(f,[sp],S)}));
    for(const f of B){ for(const u of ux){ let r=mk(N_(f,N_(u.f,V('x')),c),apply(f,[u.s,sp],S)); if(r) yield r; r=mk(N_(f,c,N_(u.f,V('x'))),apply(f,[sp,u.s],S)); if(r) yield r; }
      for(const u of uc){ let r=mk(N_(f,V('x'),N_(u.f,c)),apply(f,[cx.X,u.s],S)); if(r) yield r; r=mk(N_(f,N_(u.f,c),V('x')),apply(f,[u.s,cx.X],S)); if(r) yield r; } } } }
const isEv=s=>{ let a=-1,b=-1; for(let t=0;t<s.length;t++){ const v=s[t]; if(v===a||v===b) continue; if(a<0) a=v; else if(b<0) b=v; else return false; } return b>=0; };

// ─── 4. סימולציה של תוכנית-זוגות ב-JS (לבדיקה על דוגמאות חדשות) ───────────────────
export function simPlan(plan,l){ const env0={};
  for(let k=0;k<plan.stats.length;k++){ const s=plan.stats[k]; env0['S'+(k+1)]=s.kind==='prog'?progVal(s.prog,l):(()=>{ let c=s.init; for(const y of l){ c=s.IN.T[(c<<4)|y]; if(c<0) return -1; } return c; })(); if(env0['S'+(k+1)]<0) return -1; }
  const R={}; for(const g of plan.regs) R[g.name]=g.init; const n=l.length;
  for(let t=0;t<n;t++){ const x=l[t]; const env={...env0,x,i:t};
    if(plan.inner){ const {Rt,INt,init,scope}=plan.inner; let c=init;
      if(scope==='nall'){ for(let p=0;p<n;p++) for(let j=0;j<n;j++){ c=INt[(c<<4)|Rt[(l[j]<<4)|x]]; if(c<0) return -1; } }
      else { const j0=scope==='after'?t+1:0, j1=scope==='before'?t:n; for(let j=j0;j<j1;j++){ if(scope==='others'&&j===t) continue; c=INt[(c<<4)|Rt[(l[j]<<4)|x]]; if(c<0) return -1; } }
      env.c=c; }
    for(const g of plan.regs){ for(const h of plan.regs) env[h.name]=R[h.name]; env.self=R[g.name]; const v=evalS(g.upd,env); if(v<0) return -1; R[g.name]=v; } }
  return evalS(plan.final,R); }
export function describe(plan){ const st=plan.stats.map((s,k)=>`S${k+1}=${s.kind==='prog'?s.name:'קפל '+show(subst(s.IN.e,{r:V('S'),s:V('y')}))+' מ-'+s.init}`).join(' ; ');
  const inn=plan.inner?`c(x)=קפל_{y∈${plan.inner.scope}} ${show(subst(plan.inner.IN.e,{r:V('c'),s:plan.inner.R.e}))} מ-${plan.inner.init}`:'';
  return [st,inn,plan.regs.map(g=>`${g.name}⇐${show(g.upd)} (מ-${g.init})`).join(' ; ')].filter(Boolean).join(' · ')+' ⇒ '+show(plan.final); }

// ─── 5. קוד-מכונה ────────────────────────────────────────────────────────────
const G_=c=>[['WHERE',c],['GO']], T_=c=>[['WHERE',c],['GO'],['TAKE']], P_=c=>[['WHERE',c],['GO'],['PUT']], MV=(a,b)=>[...T_(a),...P_(b)];
const P15=['TAKE','TAKE','CALC','TAKE','CALC'].map(o=>[o]);
const GOTO=l=>[...P15,['J',l]];
const CONST=(()=>{ const best=new Array(16).fill(null); const q=[{st:[],code:[]}]; const seen=new Set(['']);
  while(q.length){ const n=q.shift(); if(n.st.length===1&&!best[n.st[0]]) best[n.st[0]]=n.code; if(best.every(Boolean)) break; const nx=[];
    if(n.st.length<3) nx.push({st:[...n.st,15],code:[...n.code,...P15]});
    if(n.st.length>=1) nx.push({st:[...n.st.slice(0,-1),n.st.at(-1)>>1],code:[...n.code,['SHR']]});
    if(n.st.length>=2){ const a=n.st.at(-2), b=n.st.at(-1); nx.push({st:[...n.st.slice(0,-2),(a+b)&15],code:[...n.code,['ADD']]}); nx.push({st:[...n.st.slice(0,-2),~(a&b)&15],code:[...n.code,['CALC']]}); }
    for(const m of nx){ const k=m.st.join(','); if(seen.has(k)||m.code.length>40) continue; seen.add(k); q.push(m); } q.sort((a,b)=>a.code.length-b.code.length); }
  return best; })();
const SET=(c,k)=>[...G_(c),...CONST[k],...P_(c)];
const INC=c=>[...T_(c),...P15,['SHR'],['SHR'],['SHR'],['ADD'],...P_(c)];
const NEXT=(from,to)=>[...T_(from),['WHERE@'],['GO'],['TAKE'],...P_(to)];   // to ⇐ mem[from]
const CELLS=[0,1,2,3,4,5,6,7];
// כלי במקום: כניסות ⇒ תאי-הארגומנטים, יציאה ⇒ out, תאי-עבודה ⇒ תאים פנויים; אם אין — שומרים תאים חיים במחסנית סביבו (תא 1 = ראש-הרשימה, תמיד חי)
function callTool(f,argCells,outCell,live){ const map={}; f.ins.forEach((c,j)=>{ map[c]=argCells[j]; }); map[f.out]=outCell; const taken=new Set([...argCells,outCell]);
  const scratch=dataCells(f.prog).filter(c=>map[c]==null); const free=CELLS.filter(c=>!taken.has(c)&&!live.has(c)&&c!==1), busy=CELLS.filter(c=>!taken.has(c)&&(live.has(c)||c===1)); const save=[];
  for(const c of scratch){ if(free.length) map[c]=free.shift(); else if(busy.length){ const b=busy.shift(); map[c]=b; save.push(b); } else return null; }
  return [...save.flatMap(c=>T_(c)),{code:[['WHERE',0],['GO'],...shift(remap(f.prog,map),2)]},...[...save].reverse().flatMap(c=>P_(c))]; }
// ביטוי ⇒ קוד; מחזיר את התא שבו התוצאה. pool = תאים פנויים לזמניים; fixed = תאים חיים
export function emitExpr(e,varCell,pool,fixed,code,temps){ if(e.v!=null) return varCell(e.v);
  const args=e.a.map(a=>emitExpr(a,varCell,pool,fixed,code,temps));
  for(let j=0;j<args.length;j++) if(args.indexOf(args[j])!==j){ const t=pool.shift(); if(t==null) throw new Error('אין תא זמני'); if(t===1) pool.used1=true; code.push(...MV(args[j],t)); temps.add(t); args[j]=t; }
  const t=pool.shift(); if(t==null) throw new Error('אין תא זמני'); if(t===1) pool.used1=true; const live=new Set([...fixed,...temps]); const c=callTool(e.f,args,t,live); if(!c) throw new Error('אין מקום לכלי'); code.push(...c);
  for(const a of args) if(temps.has(a)){ temps.delete(a); pool.unshift(a); } temps.add(t); return t; }
let UID=0;
export function codegen(plan){ const lbl=s=>s+(++UID); const parts=[];
  const needI=plan.regs.some(g=>usesVar(g.upd,'i')); const X=3;
  // תאים קבועים: X=3, תשובה=2 (המצב הראשון), שאר המצבים, I, S1/S2, ובלולאה הפנימית Y, C, Z
  const avail=[2,4,5,6,7,0]; const take=pref=>{ const j=pref!=null&&avail.includes(pref)?avail.indexOf(pref):0; if(!avail.length) throw new Error('אין תאים'); return avail.splice(j,1)[0]; };
  const cell={}; const finalReg=plan.final.v!=null?plan.final.v:null;
  if(finalReg) cell[finalReg]=take(2); for(const g of plan.regs) if(cell[g.name]==null) cell[g.name]=take();
  if(needI) cell.i=take(); plan.stats.forEach((s,k)=>{ cell['S'+(k+1)]=take(); });
  let Y,C,Z; if(plan.inner){ Y=take(); C=take(); if(plan.inner.scope==='nall') Z=take(); }
  const fixedOuter=[X,1,...Object.values(cell),...(plan.inner?[C]:[])];
  // 1. סטטיסטיקות: כל אחת מחושבת (כלי מהמדף / קיפול), התוצאה נדחפת למחסנית; בסוף — מהמחסנית לתאים שלהן
  plan.stats.forEach((s,k)=>{ if(s.kind==='prog') parts.push({code:[['WHERE',0],['GO'],...shift(s.prog,2)]},...T_(2));
    else { const A=4, YY=3; const L=lbl('SL'), B=lbl('SB'), E=lbl('SE'); const code=[]; const pool=[0,2,5,6,7]; const temps=new Set();
      const r=emitExpr(subst(s.IN.e,{r:V('acc'),s:V('y')}),v=>v==='acc'?A:YY,pool,[A,YY,1],code,temps);
      parts.push(...SET(A,s.init),...MV(1,YY),L,...T_(YY),['J',B],...GOTO(E),B,...code,...(r!==A?MV(r,A):[]),...NEXT(YY,YY),...GOTO(L),E,...T_(A)); } });
  for(let k=plan.stats.length;k>=1;k--) parts.push(...P_(cell['S'+k]));
  // 2. ערכי-התחלה
  for(const g of plan.regs) parts.push(...SET(cell[g.name],g.init)); if(needI) parts.push(...SET(cell.i,0));
  parts.push(...MV(1,X)); const LOOP=lbl('LOOP'), BODY=lbl('BODY'), END=lbl('END');
  parts.push(LOOP,...T_(X),['J',BODY],...GOTO(END),BODY);
  // 3. הלולאה הפנימית: C ⇐ קפל IN(C, R(Y, X))
  if(plan.inner){ const {scope,R,IN,init}=plan.inner; const IL=lbl('IL'), IB=lbl('IB'), IE=lbl('IE'), IN_=lbl('INX'), PS=lbl('PS'), PE=lbl('PE');
    const code=[]; const fixed=[X,1,Y,C,...(Z!=null?[Z]:[]),...Object.values(cell)]; const pool=CELLS.filter(c=>c!==1&&!fixed.includes(c)); const temps=new Set();
    // תאי-המעטפת שלא צריך בלולאה הפנימית — נשמרים במחסנית סביבה (מפנה תאים לכלים)
    const outerOnly=Object.values(cell); const pool2=[...pool,...outerOnly]; const fixed2=[X,1,Y,C,...(Z!=null?[Z]:[])];
    const r=emitExpr(subst(IN.e,{r:V('c'),s:R.e}),v=>v==='c'?C:v==='y'?Y:v==='x'?X:(()=>{ throw new Error('משתנה '+v); })(),pool2,fixed2,code,temps);
    parts.push(...outerOnly.flatMap(c=>T_(c)),...SET(C,init));
    // n מעברים: Z סופר מעברים (הולך על הרשימה). בתחילת מעבר — c נדחף פעמיים למחסנית; בסופו: c השתנה? (c + לא(c-ישן) + 1 ≠ 0) ⇒ עוד מעבר, אחרת — התייצב, יוצאים (אותה תוצאה כמו n מעברים, מהר יותר)
    const PB=lbl('PB'); if(scope==='nall') parts.push(...MV(1,Z),PS,...T_(Z),['J',PB],...GOTO(PE),PB,...T_(C),['TAKE'],...MV(1,Y));
    else if(scope==='after') parts.push(...NEXT(X,Y)); else parts.push(...MV(1,Y));
    parts.push(IL,...T_(Y),['J',IB],...GOTO(IE),IB);
    if(scope==='before'||scope==='others'){ const NE=lbl('NE');   // Y ≠ X ? (Y + לא-X + 1 ≠ 0)
      parts.push(...T_(Y),...G_(X),['TAKE'],['TAKE'],['CALC'],['ADD'],...P15,['SHR'],['SHR'],['SHR'],['ADD'],['J',NE],...GOTO(scope==='before'?IE:IN_),NE); }
    parts.push(...code,...(r!==C?MV(r,C):[]),IN_,...NEXT(Y,Y),...GOTO(IL),IE);
    if(scope==='nall') parts.push(...NEXT(Z,Z),['CALC'],...T_(C),['ADD'],...P15,['SHR'],['SHR'],['SHR'],['ADD'],['J',PS],PE);
    parts.push(...[...outerOnly].reverse().flatMap(c=>P_(c))); }
  // 4. עדכון המצבים (לפי הסדר; כל מצב רואה את הערך הנוכחי של האחרים)
  const varCell=v=>{ if(v==='x') return X; if(v==='i') return cell.i; if(v==='c') return C; if(cell[v]!=null) return cell[v]; throw new Error('משתנה '+v); };
  // אין מספיק תאים זמניים ⇒ גם תא 1 (ראש-הרשימה) משמש כזמני: נשמר במחסנית לפני העדכון ומוחזר אחריו
  const wrap1=(pool,code)=>pool.used1?[...T_(1),...code,...P_(1)]:code;
  for(const g of plan.regs){ const code=[]; const fixed=[X,1,...Object.values(cell),...(plan.inner?[C]:[])]; const pool=[...CELLS.filter(c=>c!==1&&!fixed.includes(c)),1]; const temps=new Set();
    const r=emitExpr(subst(g.upd,{self:V(g.name)}),varCell,pool,fixed,code,temps); parts.push(...wrap1(pool,[...code,...(r!==cell[g.name]?MV(r,cell[g.name]):[])])); }
  if(needI) parts.push(...INC(cell.i));
  parts.push(...NEXT(X,X),...GOTO(LOOP),END);
  // 5. סיום: כלי-הסיום לתא 2
  { const code=[]; const fixed=[1,...plan.regs.map(g=>cell[g.name])]; const pool=[...CELLS.filter(c=>c!==1&&!fixed.includes(c)),1]; const temps=new Set();
    const r=emitExpr(plan.final,v=>{ if(cell[v]!=null) return cell[v]; throw new Error('משתנה '+v); },pool,fixed,code,temps); parts.push(...wrap1(pool,[...code,...(r!==2?MV(r,2):[])])); }
  return assemble(parts); }

// ─── 6. החיפוש ───────────────────────────────────────────────────────────────
// רמות (הזולה קודם; הראשונה שעוברת את כל הבדיקות — מנצחת):
//   S   סטטיסטיקה אחת S  + מעטפת r ⇐ F(r, s(x,i,S))
//   P1  אטום-זוג c(x) עם יחס קטן (כלי אחד, או הטלה) וצובר מהמדף, בארבעה תחומים + אותה מעטפת
//   P2  אטום-זוג עם יחס-מפתח B(K(y),K(x)) ;  P3  יחס מעורב B(K(y),x) / כלי משלושה (יקר — בסוף)
//   F2  שתי סטטיסטיקות, שני אירועים (x מול S1, x מול S2), דגל f ⇐ לוגי(f,a,b), ו-r ⇐ F(r, f)
//   N   תחום «n מעברים» (נקודת-שבת: c ⇐ IN(c, R(y,x)) שוב ושוב) עם צובר לא-חילופי
function* outerA(cx,W,sp,name,mk,map,late,opt={}){ const {agg}=accumulators();
  for(const s of signalsOf(cx,sp,name,W,opt)){ if(late()) return;
    for(const F of agg) for(let c0=0;c0<16;c0++){ if(!fits(F.T,s.s,c0,cx,W,map)) continue; const g=findG(map); if(!g) continue;
      yield mk([{name:'r',init:c0,upd:subst(F.e,{r:V('self'),s:s.e})}],subst(g.e,{a:V('r')})); } } }
function foldStats(lists){ const {agg,last,nonc}=accumulators(); const out=[];
  for(const IN of [...agg,last,...nonc]) for(const init of [0,15]){ const vals=lists.map(l=>{ let c=init; for(const y of l){ c=IN.T[(c<<4)|y]; if(c<0) return -1; } return c; }); if(vals.some(v=>v<0)) continue;
    out.push({st:{kind:'fold',IN,init},vals,size:IN.size+(IN.agg||IN.last?0:0.5)}); }
  return out; }
export function* pairPlans(gen,{N=64,say=()=>{},deadline=Infinity,levels=null}={}){ const late=()=>Date.now()>deadline;
  const ex=Array.from({length:N},()=>gen()); const lists0=ex.map(e=>walk(e.mem)); const ord=lists0.map((l,i)=>i).sort((a,b)=>lists0[b].length-lists0[a].length);
  const lists=ord.map(i=>lists0[i]), W=Int8Array.from(ord.map(i=>ex[i].want)); const cx=context(lists); const map=new Int8Array(16);
  const seenS=new Set([hashArr(cx.X),hashArr(cx.I)]);
  const perEx=vals=>{ const s=new Int8Array(cx.S); for(let t=0;t<cx.S;t++) s[t]=vals[cx.E[t]]; return s; };
  // סטטיסטיקות: קיפולים (צובר מהמדף על כל הרשימה) + כלי-רשימה מהמדף + מסגרת-רחבה — בלי כפילויות (לפי הערכים)
  let STATS=null; const stats=()=>{ if(STATS) return STATS; const seen=new Set(), out=[];
    const add=(st,vals,size)=>{ if(vals.some(v=>v<0)) return; const k=vals.join(','); if(seen.has(k)) return; if(vals.every(v=>v===vals[0])) return; seen.add(k); out.push({st,vals,size}); };
    for(const f of foldStats(lists)) add(f.st,f.vals,f.size);
    for(const p of progStats(lists.slice(0,24))) add(p,lists.map(l=>progVal(p.prog,l)),p.size);
    out.sort((a,b)=>a.size-b.size); say(`  סטטיסטיקות: ${out.length}`); STATS=out; return out; };
  const LVs=levels||['S','P1','F2','S2','P2','N','P3'];
  for(const lv of LVs){ if(late()) return; const t0=Date.now(); say('רמה '+lv);
    if(lv==='S') for(const S of stats()){ if(late()) return; const sp=perEx(S.vals); seenS.add(hashArr(sp));
      yield* outerA(cx,W,sp,'S1',(regs,final)=>({stats:[S.st],inner:null,regs,final}),map,late); }
    if(lv==='S2') for(const S of stats()){ if(late()) return; const sp=perEx(S.vals);   // אותות בגודל 2 מול סטטיסטיקה
      yield* outerA(cx,W,sp,'S1',(regs,final)=>({stats:[S.st],inner:null,regs,final}),map,late,{ext:true}); }
    if(lv==='P1'||lv==='P2'||lv==='P3'){ const {agg,last}=accumulators(); const RS=relations().filter(r=>lv==='P1'?r.lvl<=1:lv==='P2'?r.lvl===2:r.lvl===3); let n=0;
      for(const R of RS) for(const scope of ['before','after','all','others']){ if(late()) return; if(!R.useX&&scope==='all') continue;   // הטלה על כולם = סטטיסטיקה (רמה S)
        // יחס דו-ערכי (כן/לא) ⇒ צוברים של ספירה / «יש» / «כולם» בלבד (הסכום, ההפרש, «או», «וגם», סכום-רווי); יחס רב-ערכי ⇒ כל הצוברים
        const ins=R.bool?agg.filter(a=>a.cnt):[...agg,last];
        for(const IN of ins) for(const init of [0,15]){ const sp=innerStream(cx,R.T,IN.T,init,scope); if(!sp) continue; const h=hashArr(sp); if(seenS.has(h)) continue; seenS.add(h); n++;
          yield* outerA(cx,W,sp,'c',(regs,final)=>({stats:[],inner:{scope,R,IN,init,Rt:R.T,INt:IN.T},regs,final}),map,late,{lite:lv!=='P1'}); } }
      say(`  אטומי-זוג: ${n} (${Date.now()-t0}ms)`); }
    if(lv==='F2'){ const SS=stats().slice(0,+process.env.PAIRF2||14); const {B,T}=lib(); const LG=T.filter(t=>t.name.startsWith('לוגי')); const {agg}=accumulators();
      const evOf=k=>{ const sp=perEx(SS[k].vals); const out=[], seen=new Set(); for(const f of B) for(const [e,s] of [[N_(f,V('x'),V('S')),apply(f,[cx.X,sp],cx.S)],[N_(f,V('S'),V('x')),apply(f,[sp,cx.X],cx.S)]]){ if(s.some(v=>v<0)||!isEv(s)) continue; const h=hashArr(s); if(seen.has(h)) continue; seen.add(h); out.push({e,s}); } return out; };
      const EV=SS.map((_,k)=>evOf(k)); const fseen=new Set(); const fo=new Int8Array(cx.S), fn=new Int8Array(cx.S);
      for(let k1=0;k1<SS.length;k1++) for(let k2=k1+1;k2<SS.length;k2++){ if(late()) return;
        for(const a of EV[k1]) for(const b of EV[k2]) for(const L of LG) for(const f0 of [0,15]){ let ok=true;
          for(let e=0;e<cx.n&&ok;e++){ let f=f0; for(let t=cx.st[e];t<cx.st[e+1];t++){ fo[t]=f; f=L.T[(f<<8)|(a.s[t]<<4)|b.s[t]]; if(f<0){ ok=false; break; } fn[t]=f; } } if(!ok) continue;
          for(const [nm,fs] of [['o',fo],['n',fn]]){ const h=hashArr(fs); if(fseen.has(h)) continue; fseen.add(h); if(fs.every(v=>v===fs[0])||!bagOk(fs,cx,W)) continue;
            for(const F of agg) for(let c0=0;c0<16;c0++){ if(!fits(F.T,fs,c0,cx,W,map)) continue; const g=findG(map); if(!g) continue;
              const fr={name:'f',init:f0,upd:N_(L,V('self'),subst(a.e,{S:V('S1')}),subst(b.e,{S:V('S2')}))}, rr={name:'r',init:c0,upd:subst(F.e,{r:V('self'),s:V('f')})};
              yield {stats:[SS[k1].st,SS[k2].st],inner:null,regs:nm==='o'?[rr,fr]:[fr,rr],final:subst(g.e,{a:V('r')})}; } } } }
      say(`  דגלים: ${fseen.size} (${Date.now()-t0}ms)`); }
    if(lv==='N'){ const {agg,nonc,two}=accumulators(); const RS=relations().filter(r=>r.lvl<=1&&r.useY); let n=0;
      for(const IN of [...nonc,...two]) for(const R of RS) for(const init of [0,15]){ if(late()) return; const sp=innerStream(cx,R.T,IN.T,init,'nall'); if(!sp) continue; const h=hashArr(sp); if(seenS.has(h)) continue; seenS.add(h); n++;
        if(!bagOk(sp,cx,W)) continue;
        for(const F of agg) for(let c0=0;c0<16;c0++){ if(!fits(F.T,sp,c0,cx,W,map)) continue; const g=findG(map); if(!g) continue;
          yield {stats:[],inner:{scope:'nall',R,IN,init,Rt:R.T,INt:IN.T},regs:[{name:'r',init:c0,upd:subst(F.e,{r:V('self'),s:V('c')})}],final:subst(g.e,{a:V('r')})}; } }
      say(`  נקודות-שבת: ${n} (${Date.now()-t0}ms)`); }
    say(`  רמה ${lv} נגמרה (${Date.now()-t0}ms)`); } }

// המרכיב: מועמד מהסימולציה ⇒ 600 דוגמאות חדשות ב-JS ⇒ קוד ⇒ המכונה (60) ⇒ הבודק
export function pairSearch(gen,{ms=+process.env.PAIRMS||120000,say=()=>{},levels=null}={}){ const T0=Date.now(); const chk=makeChecker(gen,300,600000);
  const fresh=Array.from({length:600},()=>gen()).map(e=>({l:walk(e.mem),w:e.want,e})); let n=0, nv=0;
  for(const plan of pairPlans(gen,{say,levels,deadline:T0+ms})){ n++; if(Date.now()-T0>ms) return {prog:null,timeout:true,cands:n};
    if(!fresh.every(f=>simPlan(plan,f.l)===f.w)) continue; nv++;
    let prog; try{ prog=codegen(plan); }catch(err){ say('  קוד: '+err.message+' · '+describe(plan)); continue; }
    const bad=fresh.slice(0,60).filter(f=>{ const r=run(prog,f.e.mem,{maxSteps:600000}); return !r||r.st.length||r.mem[2]!==f.w||[1,...LV].some(c=>r.mem[c]!==f.e.mem[c]); }).length;
    if(bad){ say(`  ✗ במכונה (${bad}/60): ${describe(plan)}`); continue; }
    if(chk(prog)) return {prog,how:'זוגות: '+describe(plan),cands:n,valid:nv,ms:Date.now()-T0};
    say('  ✗ בבודק: '+describe(plan)); }
  return {prog:null,cands:n,valid:nv,timeout:Date.now()-T0>ms}; }

// ─── 7. חריצים שנלמדים מהדוגמאות (כשאין במדף כלי שנותן אותם) ──────────────────────
// לוח של כלי (כניסות ins ⇒ תא out) על כל הקלטים; -1 = לא מוגדר (תלוי בזבל / נכשל)
function toolTable(prog,ins,out){ const k=ins.length, n=1<<(4*k); const T=new Int8Array(n);
  for(let idx=0;idx<n;idx++){ const a=[]; for(let j=0;j<k;j++) a.push((idx>>(4*(k-1-j)))&15); let v=null;
    for(let t=0;t<2;t++){ const m=Array.from({length:16},()=>R_(16)); ins.forEach((c,j)=>{ m[c]=a[j]; }); const r=run(prog,m,{maxSteps:20000});
      if(!r||r.st.length||LV.some(c=>r.mem[c]!==m[c])||ins.some((c,j)=>r.mem[c]!==a[j])){ v=-1; break; } const y=r.mem[out]; if(v==null) v=y; else if(v!==y){ v=-1; break; } }
    T[idx]=v; } return T; }
// כלי שנלמד: אם במדף כבר יש כלי באותו שם — הוא; אחרת בונה-הערכים בונה אותו מהלוח בלבד (תחום = הקלטים שהלוח מגדיר), נבדק ונשמר במדף
export function learnTool(name,ins,dom,f,{ms=60000,by,say=()=>{}}){ const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); let b=sh.named.find(x=>x.name===name);
  const gen=()=>{ const mem=Array.from({length:16},()=>R_(16)); const a=dom[R_(dom.length)]; ins.forEach((c,j)=>{ mem[c]=a[j]; }); const w=f(...a); return {mem,want:w,ok:r=>r[2]===w&&ins.every((c,j)=>r[c]===a[j])}; };
  if(!b){ const t0=Date.now(); const v=valueBuild(gen,{name,ins,out:2,ms}); if(!v.prog){ say(`    ✗ בונה-הערכים לא בנה «${name}» (${((Date.now()-t0)/1000).toFixed(0)}s)`); return null; }
    if(finalCheck(v.prog,gen,4000).bad) return null; b={name,prog:v.prog,ins,out:2,movable:movable(v.prog,gen),by};
    const S2=JSON.parse(fs.readFileSync('shelf3.json','utf8')); S2.named.push(b); fs.writeFileSync('shelf3.json',JSON.stringify(S2));
    try{ const LG=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); LG[name]={ins,dom,tt:dom.map(a=>[a,f(...a)])}; fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(LG)); }catch{}
    say(`    נלמד «${name}»: ${v.prog.length} פקודות (${((Date.now()-t0)/1000).toFixed(0)}s)`); }
  const T=toolTable(b.prog,b.ins,2); for(const a of dom){ let idx=0; for(const v of a) idx=idx*16+v; if(T[idx]!==f(...a)) return null; }
  return {name:b.name,ins:b.ins,out:2,prog:b.prog,T,k:b.ins.length}; }
// (1) ספירת-זוגות: התשובה = G(#זוגות (y לפני x) עם R(y,x)). רשימות של שני איברים מראות את R ישירות: התשובה שלהן אחד משני ערכים,
//     והערך של רשימה ריקה/בודדת = «אין זוג». R נבדק אחר כך על כל הדוגמאות דרך החיפוש הרגיל (המעטפת לומדת את G).
export function inferPairRel(gen,M=4000){ const z=new Set(), v=new Map(); for(let t=0;t<M;t++){ const e=gen(); const l=walk(e.mem); if(l.length<2) z.add(e.want); else if(l.length===2){ const k=(l[0]<<4)|l[1]; if(v.has(k)&&v.get(k)!==e.want) return null; v.set(k,e.want); } }
  if(z.size!==1||new Set(v.values()).size!==2) return null; const w0=[...z][0]; const T=new Int8Array(256); let n=0, ones=0; for(const y of LV) for(const x of LV){ if(x===y) continue; const k=(y<<4)|x; if(!v.has(k)) return null; const b=v.get(k)!==w0; T[k]=b?15:0; n++; if(b) ones++; }
  if(!ones||ones===n) return null;
  // ההשערה כולה, לפני שבונים משהו: התשובה היא פונקציה של מספר הזוגות (y לפני x) עם R — על 3000 דוגמאות
  const f=new Map(); for(let t=0;t<3000;t++){ const e=gen(); const l=walk(e.mem); let c=0; for(let i=0;i<l.length;i++) for(let j=i+1;j<l.length;j++) if(T[(l[i]<<4)|l[j]]) c++; if(f.has(c)&&f.get(c)!==e.want) return null; f.set(c,e.want); }
  return T; }
// (2) איבר מול S: התשובה = Σ_x R(x,S) ⇒ לכל ערך v של S — 8 נעלמים R(·,v) (0/1), כל דוגמה עם S=v היא משוואה; 256 השמות לכל v
function inferStatRel(lists,W,vals){ const byV=new Map(); lists.forEach((l,e)=>{ const v=vals[e]; if(!byV.has(v)) byV.set(v,[]); byV.get(v).push(e); }); const T=new Int8Array(256).fill(-1);
  for(const [v,es] of byV){ let sol=-1, nsol=0; for(let m=0;m<256;m++){ let ok=true; for(const e of es){ let c=0; for(const x of lists[e]) if(m>>(x-8)&1) c++; if(c!==W[e]){ ok=false; break; } } if(ok){ nsol++; sol=m; if(nsol>1) break; } }
    if(nsol!==1) return null; for(const x of LV) T[(x<<4)|v]=(sol>>(x-8)&1)?15:0; } return T; }
// (3) מפתח: התשובה = כמה מחלקות שונות יש ברשימה, לחלוקה כלשהי של 8..15 (4140 חלוקות) ⇒ מפתח K (מספר המחלקה)
function partitions(){ const out=[]; const cls=new Array(8); const rec=(i,k)=>{ if(i===8){ out.push(cls.slice()); return; } for(let c=0;c<=k;c++){ cls[i]=c; rec(i+1,Math.max(k,c+1)); } }; rec(0,0); return out; }
function inferKey(gen,M=3000){ const ex=Array.from({length:M},()=>{ const e=gen(); return {l:walk(e.mem),w:e.want}; }); const ok=[];
  for(const P of partitions()){ let good=true; const nc=Math.max(...P)+1; if(nc===8||nc===1) continue; for(const {l,w} of ex){ let m=0; for(const x of l) m|=1<<P[x-8]; let c=0; while(m){ m&=m-1; c++; } if(c!==w){ good=false; break; } } if(good) ok.push(P); if(ok.length>1) return null; }
  return ok.length===1?ok[0]:null; }

// חריץ מהמדף לפני בונה-הערכים: ביטוי דו-מקומי (סגירות הסורק, r/s בשני הסדרים) שנותן בדיוק את הלוח (0 / ערך אחד ≠0) על התחום
export function shelfMatch2(T,dom){ const {BC}=lib(); const want=dom.map(([a,b])=>T[(a<<4)|b]!==0);
  for(const b of BC){ if(!b.useR||!b.useS) continue; for(const [ra,sa] of [['a','b'],['b','a']]){ let v=-1, ok=true;
      for(let k=0;k<dom.length&&ok;k++){ const [a,c]=dom[k]; const r=ra==='a'?a:c, sv=ra==='a'?c:a; const y=b.tab[(r<<4)|sv]; if(y<0){ ok=false; break; } if(want[k]){ if(y===0) ok=false; else if(v<0) v=y; else if(v!==y) ok=false; } else if(y!==0) ok=false; }
      if(ok&&(v===1||v===15)) return {e:b.e,order:ra}; } } return null; }
// מפתח מהמדף: פונקציה חד-מקומית (סגירות הסורק) שמחלקת את 8..15 בדיוק לפי החלוקה
function shelfKey(P){ const {UC}=lib(); const canon=a=>{ const m=new Map(); return a.map(v=>{ if(!m.has(v)) m.set(v,m.size); return m.get(v); }).join(','); }; const want=canon(P);
  for(const u of UC){ const a=LV.map(x=>u.tab[x]); if(a.some(v=>v<0)) continue; if(canon(a)===want) return u; } return null; }
const EQ=()=>lib().B.find(f=>{ for(let a=0;a<16;a++) for(let b=0;b<16;b++) if((f.T[(a<<4)|b]!==0)!==(a===b)) return false; return true; });

// השלב: (1) החיפוש בספרייה — הרמות הזולות; (2) חריצים שנלמדים מהדוגמאות (מפתח / יחס-זוג / יחס מול S) — קודם מהמדף, אחרת בונה-הערכים;
//        (3) הרמות היקרות (נקודת-שבת, יחסי-מפתח, יחסים מעורבים) עם מה שנשאר
export async function pairCompose(gen,{ms=+process.env.PAIRMS||120000,say=()=>{}}={}){ const T0=Date.now(); const left=()=>ms-(Date.now()-T0);
  const lvMain=(process.env.PAIRLV||'S,P1,F2,S2').split(','); const share=Math.max(10000,Math.min(left()*0.4,+process.env.PAIRMAIN||60000));
  let r=pairSearch(gen,{ms:share,say,levels:lvMain}); if(r.prog) return r;
  const chkLearned=(plans)=>{ const chk=makeChecker(gen,300,600000); const fresh=Array.from({length:600},()=>gen()).map(e=>({l:walk(e.mem),w:e.want,e}));
    for(const plan of plans){ if(left()<0) return null; if(!fresh.every(f=>simPlan(plan,f.l)===f.w)) continue; let prog; try{ prog=codegen(plan); }catch(err){ say('  קוד: '+err.message); continue; } if(chk(prog)) return {prog,how:'זוגות (חריץ נלמד): '+describe(plan)}; } return null; };
  const ex=Array.from({length:64},()=>gen()); const lists=ex.map(e=>walk(e.mem)), W=Int8Array.from(ex.map(e=>e.want)); const cx=context(lists); const map=new Int8Array(16);
  const withRel=(R,scopes)=>{ const plans=[]; const {agg,last}=accumulators(); for(const scope of scopes) for(const IN of [...agg,last]) for(const init of [0,15]){ const sp=innerStream(cx,R.T,IN.T,init,scope); if(!sp) continue;
      for(const p of outerA(cx,W,sp,'c',(regs,final)=>({stats:[],inner:{scope,R,IN,init,Rt:R.T,INt:IN.T},regs,final}),map,()=>left()<0)){ plans.push(p); if(plans.length>40) return plans; } } return plans; };
  const relOf=e=>({e,T:tab2(e,'y','x'),size:sizeOf(e),lvl:9,useX:true,useY:true});
  // (2א) מפתח («כמה מחלקות שונות»): החלוקה מהדוגמאות ⇒ מפתח מהמדף, ואם אין — נלמד
  if(left()>15000){ const P=inferKey(gen); if(P){ const sig=P.join(''); const eq=EQ(); say('  חלוקה מהדוגמאות: '+sig);
      let K=null; const u=shelfKey(P); if(u) K=e=>subst(u.e,{a:e}); else { const tool=eq&&learnTool('מפתח-מחלקה: '+sig,[0],LV.map(x=>[x]),x=>P[x-8],{ms:Math.min(90000,left()-5000),by:'נלמד: מפתח-מחלקה (זוגות)',say}); if(tool) K=e=>N_(tool,e); }
      if(K&&eq){ say('  מפתח: '+show(K(V('x')))); const w=chkLearned(withRel(relOf(N_(eq,K(V('y')),K(V('x')))),['before','after'])); if(w) return w; } } }
  // (2ב) יחס-זוג: רשימות של שני איברים מראות את R
  if(left()>15000){ const T=inferPairRel(gen); if(T){ const sig=[...LV].map(y=>LV.filter(x=>x!==y&&T[(y<<4)|x]).map(x=>x-8).join('')).join('.'); say('  יחס-זוג מהדוגמאות: '+sig);
      const dom=LV.flatMap(y=>LV.filter(x=>x!==y).map(x=>[y,x])); const m=shelfMatch2(T,dom); let e=null;
      if(m) e=subst(m.e,m.order==='a'?{r:V('y'),s:V('x')}:{r:V('x'),s:V('y')});
      else { const tool=learnTool('יחס-זוג: '+sig,[0,1],dom,(y,x)=>T[(y<<4)|x],{ms:Math.min(90000,left()-5000),by:'נלמד: יחס-זוג (זוגות)',say}); if(tool) e=N_(tool,V('y'),V('x')); }
      if(e){ say('  יחס: '+show(e)); const w=chkLearned(withRel(relOf(e),['before'])); if(w) return w; } } }
  // (2ג) איבר מול סטטיסטיקה: לכל ערך של S — 8 נעלמים
  if(left()>15000){ const seen=new Set(); const cand=[...foldStats(lists).map(f=>({st:f.st,vals:f.vals})),...progStats(lists.slice(0,24)).map(p=>({st:p,vals:lists.map(l=>progVal(p.prog,l))}))];
    for(const S of cand){ if(left()<15000) break; if(S.vals.some(v=>v<0)) continue; const k=S.vals.join(','); if(seen.has(k)) continue; seen.add(k); const T=inferStatRel(lists,W,S.vals); if(!T) continue;
      const dom=[]; for(const x of LV) for(let v=0;v<16;v++) if(T[(x<<4)|v]>=0) dom.push([x,v]); const sig=[...new Set(dom.map(a=>a[1]))].map(v=>v+':'+LV.filter(x=>T[(x<<4)|v]).map(x=>x-8).join('')).join('.');
      const st=S.st; const more=Array.from({length:600},()=>gen()).map(e=>({l:walk(e.mem),w:e.want})); if(!more.every(({l,w})=>{ const v=st.kind==='prog'?progVal(st.prog,l):(()=>{ let c=st.init; for(const y of l) c=st.IN.T[(c<<4)|y]; return c; })(); let c=0; for(const x of l){ const z=T[(x<<4)|v]; if(z<0) return false; if(z) c++; } return c===w; })) continue;
      say(`  יחס איבר-מול-S מהדוגמאות (${st.kind==='prog'?st.name:'קיפול'}): ${sig}`);
      const m=shelfMatch2(T,dom); let e=null; if(m) e=subst(m.e,m.order==='a'?{r:V('x'),s:V('S1')}:{r:V('S1'),s:V('x')});
      else { const tool=learnTool('יחס-מול: '+sig,[0,1],dom,(x,v)=>T[(x<<4)|v],{ms:Math.min(90000,left()-5000),by:'נלמד: יחס איבר-מול-סטטיסטיקה (זוגות)',say}); if(tool) e=N_(tool,V('x'),V('S1')); }
      if(!e) continue; const {agg}=accumulators(); const plans=[]; const sp=new Int8Array(cx.S); for(let t=0;t<cx.S;t++) sp[t]=S.vals[cx.E[t]];
      const s=new Int8Array(cx.S); for(let t=0;t<cx.S;t++) s[t]=evalS(e,{x:cx.X[t],S1:sp[t]});
      for(const F of agg) for(let c0=0;c0<16;c0++){ if(!fits(F.T,s,c0,cx,W,map)) continue; const g=findG(map); if(!g) continue; plans.push({stats:[st],inner:null,regs:[{name:'r',init:c0,upd:subst(F.e,{r:V('self'),s:e})}],final:subst(g.e,{a:V('r')})}); }
      const w=chkLearned(plans); if(w) return w; } }
  // (3) הרמות היקרות
  if(left()>10000){ r=pairSearch(gen,{ms:left()-3000,say,levels:(process.env.PAIRLATE||'N,P2,P3').split(',')}); if(r.prog) return r; }
  return {prog:null}; }
