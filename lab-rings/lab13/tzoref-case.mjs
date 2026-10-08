// «פיצול-מקרים» (שאנון): משימה שאף בונה לא פותר בבת אחת ⇒ מחלקים אותה למקרים קלים יותר, פותרים כל מקרה לבד, ומחברים בקפיצה.
//   1. שני ערכים פשוטים (העתק/קבוע) מכסים את כל הדוגמאות ⇒ צריך רק תנאי שבוחר ביניהם (הקרוב מבין שניים).
//   2. ריכוז: שני קלטים ⇒ קלט אחד (לבנה מהמדף לתא-עבודה), אם התשובה תלויה רק בו (מרחק האמינג = ספירת-ביטים של «שונה»).
//   3. חיסול משתנה: מקבצים את ערכי הקלט לפי «מה נשאר» כשהוא קבוע (ב&3 ⇒ 4 קבוצות), עץ-תנאים על הקלט הזה, ובעלים — משימה בלי הקלט.
//   4. ערך פשוט + שארית: «כאן התשובה היא 0 / היא תא1» — פותרים את השארית, ואז תנאי רק איפה שהשארית טועה.
//   5. קלט אחד שקשה: חוצים לפי ביט שלו (היפוך ביטים) — כל חצי קל יותר.
// עלים ותנאים: בונה-היסודות (חבר/נאנד/חצי, על התחום החלקי בלבד), ואם לא — בונה-ערכים (לבנים מהמדף). כל צומת נבדק על כל התחום שלו.
// חיבור: [X] [תנאי על המחסנית: לא-אפס ⇔ X נכון] [קפוץ לסוף] [Y] — X רץ תמיד, Y דורס את תא 2 רק אם צריך. בלי קפיצה-בלי-תנאי.
//   X רץ גם מחוץ לתחום שלו ⇒ מותר רק אם הוא «בטוח» שם (נגמר, לא נוגע בקלט, מחסנית ריקה). אחרת, וגם לתנאי שנבנה מלבנים (כותב לתא 2):
//   [תנאי] [קפוץ ל-X אם לא-אפס] [Y] [15 ⇒ קפוץ לסוף] [X] — כל צד רץ רק על התחום שלו.  כל כתובת-קוד מסומנת 'code' ⇒ התוכנית ניידת.
import { basicBuild, compile, tableOf } from './tzoref-basic.mjs';
import { valueBuild } from './tzoref-value.mjs';
import { loadShelf, placements } from './tzoref.mjs';
import { partTables } from './tzoref-tables.mjs';
import { run } from './machine3s.mjs';

const R=k=>Math.floor(Math.random()*k);
const keyOf=v=>Buffer.from(v).toString('latin1');
const shift=(p,o)=>p.map(x=>x[2]==='code'?['WHERE',x[1]+o,'code']:x);
const usedCells=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]));
// קיצור לקוד של ביטוי (קוד ישר, בלי קפיצות): «לאן c; לך» כשהמצביע כבר על c — מיותר (כל «לך» בקוד-ביטוי בא אחרי «לאן» משלו)
function peep(code){ const out=[]; let P=null; for(let i=0;i<code.length;i++){ const x=code[i], y=code[i+1];
    if(x[0]==='WHERE'&&!x[2]&&y&&y[0]==='GO'){ if(P===x[1]){ i++; continue; } P=x[1]; out.push(x,y); i++; continue; }
    if(x[0]==='GO'||x[0]==='JUMP'||x[0]==='WHERE@'||(x[0]==='WHERE'&&x[2])) P=null; out.push(x); }
  return out; }
const comp=e=>peep(compile(e,2)), compStack=e=>peep(compile(e,2).slice(0,-3));
const evalE=(e,p)=>e.c!=null?p[e.c]:e.o==='SHR'?evalE(e.a,p)>>1:e.o==='ADD'?(evalE(e.a,p)+evalE(e.b,p))&15:(~(evalE(e.a,p)&evalE(e.b,p)))&15;

// ─── מרחב: התאים שהם «המשתנים» עכשיו, התאים שאסור לשנות, נקודות (ערך לכל תא), והתשובה בכל נקודה ───
const sub=(sp,idx)=>({cells:sp.cells,keep:sp.keep,pts:idx.map(i=>sp.pts[i]),W:Uint8Array.from(idx.map(i=>sp.W[i]))});
const projKey=(p,cs)=>{ let k=0; for(const c of cs) k=k*16+p[c]; return k; };
function isFn(sp,cs){ const m=new Map(); for(let i=0;i<sp.pts.length;i++){ const k=projKey(sp.pts[i],cs), o=m.get(k); if(o===undefined) m.set(k,sp.W[i]); else if(o!==sp.W[i]) return false; } return true; }
function relevant(sp){ let cs=sp.cells.slice(); for(const c of sp.cells.slice().reverse()){ const t=cs.filter(x=>x!==c); if(isFn(sp,t)) cs=t; } return cs; }
// נקודות שונות בלבד (לפי התאים cs) — וקטורים קצרים לחיפוש
function uniq(sp,cs){ const m=new Map(); sp.pts.forEach((p,i)=>{ const k=projKey(p,cs); if(!m.has(k)) m.set(k,i); }); return [...m.values()]; }

// ─── הרצה ובדיקה של קטע-קוד על כל נקודות המרחב (זבל אקראי בשאר התאים, פעמיים) ───
function runAt(code,sp,i,steps=60000){ const p=sp.pts[i]; const mem=Array.from({length:16},()=>R(16)); for(const c of sp.keep) mem[c]=p[c];
  const r=run(code,mem,{maxSteps:steps}); if(!r||r.st.length||!sp.keep.every(c=>r.mem[c]===p[c])) return -1; return r.mem[2]; }
function goodAt(code,sp,i){ const a=runAt(code,sp,i); return a===sp.W[i]&&runAt(code,sp,i)===a; }
function verify(code,sp){ for(let i=0;i<sp.pts.length;i++) if(!goodAt(code,sp,i)) return false; return true; }

// ─── עלים פשוטים ───
const copyProg=c=>[['WHERE',c],['GO'],['TAKE'],['WHERE',2],['GO'],['PUT']];
const CONST=new Map();
function constProg(v){ if(!CONST.has(v)){ const r=basicBuild(Array(16).fill(v),{ins:[2],ms:5000}); CONST.set(v,r.expr?comp(r.expr):null); } return CONST.get(v); }
function trivials(sp){ const out=[]; const n=sp.W.length;
  for(let v=0;v<16;v++){ let k=0; for(let i=0;i<n;i++) if(sp.W[i]===v) k++; if(k) out.push({kind:'const',v,n:k,ok:i=>sp.W[i]===v,name:'קבוע '+v}); }
  for(const c of sp.keep){ let k=0; for(let i=0;i<n;i++) if(sp.W[i]===sp.pts[i][c]) k++; if(k) out.push({kind:'copy',c,n:k,ok:i=>sp.W[i]===sp.pts[i][c],name:'תא'+c}); }
  return out.sort((a,b)=>b.n-a.n||(a.kind==='copy'?-1:1)); }
const trivCode=t=>t.kind==='const'?constProg(t.v):copyProg(t.c);

// ─── חיפוש תנאי: ביטוי (חבר/נאנד/חצי) שהוא 0 בדיוק איפה שצריך (וכל לא-אפס טוב) ───
function zsearch(vecs,one,{ms=400,maxBank=80000,maxSize=14}={}){ const N=one.length, t0=Date.now(); const seen=new Set(), lev=[[]];
  const test=v=>{ let pos=true,neg=true; for(let i=0;i<N&&(pos||neg);i++){ const nz=v[i]!==0; if(nz!==(one[i]!==0)) pos=false; else neg=false; } return pos?1:neg?-1:0; };
  const add=(v,e,s)=>{ const k=keyOf(v); if(seen.has(k)) return null; seen.add(k); lev[s].push({v,e}); const t=test(v); return t?{e,pol:t}:null; };
  for(const x of vecs){ const r=add(x.v,x.e,0); if(r) return r; }
  for(let s=1;s<=maxSize;s++){ lev[s]=[];
    for(const x of lev[s-1]){ const r=add(x.v.map(y=>y>>1),{o:'SHR',a:x.e},s); if(r) return r; }
    for(let sa=0;sa<s;sa++){ const sb=s-1-sa; if(sb<sa) break; for(const x of lev[sa]){ if(Date.now()-t0>ms||seen.size>maxBank) return null; for(const y of lev[sb]){
          const v1=new Uint8Array(N), v2=new Uint8Array(N); for(let i=0;i<N;i++){ v1[i]=(x.v[i]+y.v[i])&15; v2[i]=(~(x.v[i]&y.v[i]))&15; }
          let r=add(v1,{o:'ADD',a:x.e,b:y.e},s); if(r) return r; r=add(v2,{o:'NAND',a:x.e,b:y.e},s); if(r) return r; } } } }
  return null; }
// תנאי על תחום: one[i]=1 ⇔ «הצד הראשון» נכון. מחזיר {kind:'stack'|'cell', code, pol} — pol=1: לא-אפס ⇔ הצד הראשון
function predicate(sp,one,ctx,{ms=600,value=true}={}){ const P={...sp,W:Uint8Array.from(one)}; const cs=relevant(P); const idx=uniq(P,cs);
  const vecs=cs.map(c=>({v:Uint8Array.from(idx.map(i=>P.pts[i][c])),e:{c}})); const o=Uint8Array.from(idx.map(i=>one[i]));
  if(!cs.length) return null;
  const z=zsearch(vecs,o,{ms,maxBank:Math.min(80000,Math.floor(2e8/idx.length))}); if(z) return {kind:'stack',code:compStack(z.e),pol:z.pol,how:'יסודות'};
  if(Date.now()>ctx.deadline) return null;
  for(const [a,b,pol] of [[15,0,1],[0,15,-1],[1,0,1],[0,1,-1]]){ const W=Array.from(o,x=>x?a:b); const r=basicBuild(W,{ins:cs,leaves:vecs.map(x=>Array.from(x.v)),ms:Math.min(ms,800),maxBank:Math.min(1500000,Math.floor(3e8/idx.length))});
    if(r.expr&&idx.every((i,j)=>evalE(r.expr,P.pts[i])===W[j])) return {kind:'stack',code:compStack(r.expr),pol,how:'יסודות'}; }
  if(!value) return null;
  for(const [a,b,pol] of [[0,15,-1],[15,0,1]]){ if(Date.now()>ctx.deadline-5000) return null; const S={...sp,W:Uint8Array.from(one,x=>x?a:b)};
    const v=leafValue(S,ctx,Math.min(ctx.vms,ctx.deadline-Date.now())); if(v) return {kind:'cell',code:v.code,pol,how:'לבנים'}; }
  return null; }

// ─── חיבור שני צדדים לפי תנאי ───
// «בטוח» על התחום: נגמר, לא נוגע בתאים-לשמור ומשאיר מחסנית ריקה (התשובה יכולה להיות לא נכונה) — רק אז מותר להריץ אותו גם מחוץ לתחום שלו
function safeOn(code,sp){ for(let i=0;i<sp.pts.length;i++) if(runAt(code,sp,i,20000)<0) return false; return true; }
function join(X,Y,q,sp){ if(q.pol<0) [X,Y]=[Y,X];   // עכשיו: לא-אפס ⇔ X
  // ברצף: [X] [תנאי] [קפוץ לסוף] [Y] — X רץ על כל התחום, לכן רק אם הוא בטוח בכל התחום
  if(q.kind==='stack'&&safeOn(X,sp)){ const out=[...X,...shift(q.code,X.length)]; const ys=out.length+2; out.push(['WHERE',ys+Y.length,'code'],['JUMP'],...shift(Y,ys)); return out; }
  // קודם התנאי: [תנאי] [קפוץ ל-X] [Y] [15 ⇒ קפוץ לסוף] [X] — כל צד רץ רק על התחום שלו. תנאי-מלבנים רץ על הכל ⇒ חייב להיות בטוח
  if(q.kind==='cell'&&!safeOn(q.code,sp)) return null;
  const out=[...q.code]; const jx=out.length; if(q.kind==='cell') out.push(['WHERE',2],['GO'],['TAKE']); out.push(['WHERE',-1,'code'],['JUMP']); const jxa=out.length-2; out.push(...shift(Y,out.length));
  const ju=out.length; out.push(['WHERE',2],['GO'],['TAKE'],['TAKE'],['TAKE'],['CALC'],['CALC'],['WHERE',-1,'code'],['JUMP']);   // x נאנד (x נאנד x) = 15 ⇒ קפיצה תמיד
  const lx=out.length; out.push(...shift(X,lx)); out[jxa]=['WHERE',lx,'code']; out[ju+7]=['WHERE',out.length,'code']; return out; }

// ─── עלים: בונה-היסודות על התחום החלקי, ואם לא — בונה-ערכים ───
function leafBasic(sp,cs,ms){ if(!cs.length||cs.length>3) return null; const idx=uniq(sp,cs); const W=idx.map(i=>sp.W[i]);
  let r; try{ r=basicBuild(W,{ins:cs,leaves:cs.map(c=>idx.map(i=>sp.pts[i][c])),ms,maxBank:Math.min(2500000,Math.floor(3e8/idx.length))}); }catch{ return null; }
  if(!r.expr||!idx.every((i,j)=>evalE(r.expr,sp.pts[i])===W[j])) return null; return {code:comp(r.expr),how:'יסודות'}; }
function genOf(sp){ return ()=>{ const i=R(sp.pts.length), p=sp.pts[i]; const mem=Array.from({length:16},()=>R(16)); for(const c of sp.keep) mem[c]=p[c]; const w=sp.W[i], kv=sp.keep.map(c=>p[c]);
  return {mem,want:w,ok:r=>r[2]===w&&sp.keep.every((c,j)=>r[c]===kv[j])}; }; }
function leafValue(sp,ctx,ms){ if(ms<1500) return null; let r; const t=Date.now(); try{ r=valueBuild(genOf(sp),{name:'',ins:sp.keep,out:2,ms,maxSize:ctx.vsize}); }catch(e){ return null; } ctx.vtime+=Date.now()-t;
  if(!r.prog||!verify(r.prog,sp)) return null; return {code:r.prog,how:'לבנים'}; }

// ─── 2. ריכוז: לבנה של שני קלטים (מהמדף) שאחריה התשובה תלויה בפחות קלטים ───
let TB2=null, BLK=null;
function tables(){ if(!TB2){ const sh=loadShelf(); BLK=new Map(sh.named.map(b=>[b.name,b])); TB2=partTables(sh.named.filter(b=>!b.bad&&b.movable!==false)).filter(t=>t.k===2&&!t.partial&&t.name!=='העתק'); } return TB2; }
function blockAt(b,ci,cj,D,keep,T){ // הלבנה b בתאים ci,cj ⇒ D, בלי לגעת בתאים אחרים שאסור
  for(const p of placements(b,4000)){ if(p.ins.join()!==[ci,cj].join()||p.out!==D) continue; const U=usedCells(p.prog); if([...U].some(c=>keep.includes(c)&&c!==ci&&c!==cj&&c!==D)) continue;
    let ok=true; for(let t=0;t<120&&ok;t++){ const m=Array.from({length:16},()=>R(16)); const x=m[ci], y=m[cj]; const keepV=keep.map(c=>m[c]); const r=run(p.prog,m,{maxSteps:60000});
      ok=!!r&&!r.st.length&&r.mem[D]===T[x*16+y]&&keep.every((c,j)=>c===D||r.mem[c]===keepV[j]); }
    if(ok) return p.prog; }
  return null; }
function collapses(sp,cs){ const out=[]; if(cs.length<2) return out;
  for(const tb of tables()) for(const i of cs) for(const j of cs){ if(i===j) continue; const rest=cs.filter(c=>c!==i&&c!==j); const m=new Map(); let ok=true;
    for(let n=0;n<sp.pts.length&&ok;n++){ const p=sp.pts[n]; const k=tb.T[p[i]*16+p[j]]*4096+projKey(p,rest); const o=m.get(k); if(o===undefined) m.set(k,sp.W[n]); else if(o!==sp.W[n]) ok=false; }
    if(ok) out.push({tb,i,j,rest,size:m.size,len:BLK.get(tb.name).prog.length}); }
  return out.sort((a,b)=>a.size-b.size||a.len-b.len); }
function solveCollapsed(sp,c,ctx,depth){ const D=[4,5,6,7].find(x=>!sp.keep.includes(x)); if(D==null) return null; const keep=[...sp.keep,D];
  const code0=blockAt(BLK.get(c.tb.name),c.i,c.j,D,sp.keep,c.tb.T); if(!code0) return null;
  const pts=sp.pts.map(p=>{ const q=p.slice(); q[D]=c.tb.T[p[c.i]*16+p[c.j]]; return q; });
  ctx.log.push(`${'  '.repeat(depth)}ריכוז: תא${D} = ${c.tb.name}(תא${c.i}, תא${c.j})`);
  const inner=solve({cells:[D,...c.rest],keep,pts,W:sp.W},ctx,depth+1); if(!inner) return null;
  return {code:[...code0,...shift(inner.code,code0.length)],how:'ריכוז'}; }

// ─── 3. חיסול משתנה: קבוצות של ערכי תא j עם אותה «שארית» ───
function elimCands(sp,cs){ const out=[];
  for(const j of cs){ const rest=cs.filter(c=>c!==j); const byV=new Map(); sp.pts.forEach((p,i)=>{ const v=p[j]; if(!byV.has(v)) byV.set(v,new Map()); byV.get(v).set(projKey(p,rest),sp.W[i]); });
    const classes=[]; for(const [v,f] of [...byV].sort((a,b)=>b[1].size-a[1].size)){ let cl=classes.find(C=>[...f].every(([k,w])=>!C.f.has(k)||C.f.get(k)===w)); if(!cl){ cl={vals:[],f:new Map()}; classes.push(cl); } cl.vals.push(v); for(const [k,w] of f) cl.f.set(k,w); }
    out.push({j,rest,classes}); }
  return out.sort((a,b)=>a.classes.length-b.classes.length); }
// איזה משתנה לחסל: כשיש כמה מועמדים — טועמים 3 קבוצות מכל אחד (בונה-היסודות, 0.3 שנ׳) ומעדיפים את מי שהעלים שלו נפתרים
function probeElim(sp,E){ const C=E.filter(e=>e.classes.length<=16); if(C.length<2) return;
  for(const e of C){ let ok=0, n=0; for(const cl of e.classes.slice(0,3)){ const S=new Set(cl.vals); const s=sub(sp,sp.pts.map((p,i)=>S.has(p[e.j])?i:-1).filter(i=>i>=0)); n++;
      const T=trivials(s); if(T[0]&&T[0].n===s.W.length){ ok++; continue; } const cs=relevant(s); if(cs.length<=2&&leafBasic(s,cs,300)) ok++; } e.probe=ok/n; }
  E.sort((a,b)=>(b.probe??-1)-(a.probe??-1)||a.classes.length-b.classes.length); }
function bipartitions(classes){ const m=classes.length, C=[]; const all=classes.flatMap(c=>c.vals);
  for(let k=0;k<4;k++){ const s=classes.map(c=>c.vals.every(v=>(v>>k)&1)?1:c.vals.every(v=>!((v>>k)&1))?0:-1); if(s.includes(-1)||!s.includes(0)||!s.includes(1)) continue; C.push(s); }
  for(let t=1;t<16;t++){ const s=classes.map(c=>c.vals.every(v=>v>=t)?1:c.vals.every(v=>v<t)?0:-1); if(s.includes(-1)||!s.includes(0)||!s.includes(1)) continue; if(!C.some(x=>x.join()===s.join())) C.push(s); }
  if(m<=6) for(let mask=1;mask<(1<<(m-1));mask++){ const s=classes.map((c,i)=>(mask>>i)&1); if(!C.some(x=>x.join()===s.join()||x.map(y=>1-y).join()===s.join())) C.push(s); }
  if(!C.length){ const s=classes.map((c,i)=>i<m/2?1:0); C.push(s); }
  return C; }
function classTree(sp,j,classes,ctx,depth){ if(Date.now()>ctx.deadline) return null;
  const idxOf=cls=>{ const S=new Set(cls.flatMap(c=>c.vals)); return sp.pts.map((p,i)=>S.has(p[j])?i:-1).filter(i=>i>=0); };
  if(classes.length===1) return solve(sub(sp,idxOf(classes)),ctx,depth+1);
  // התנאי: על תא j בלבד, רק על הערכים שיש כאן. בוחרים את הקצר ביותר (ובין שווים — המאוזן)
  const vals=[...new Set(classes.flatMap(c=>c.vals))].sort((a,b)=>a-b); let best=null;
  for(const s of bipartitions(classes)){ const side=new Map(); classes.forEach((c,i)=>c.vals.forEach(v=>side.set(v,s[i]))); const one=Uint8Array.from(vals,v=>side.get(v));
    const z=zsearch([{v:Uint8Array.from(vals),e:{c:j}}],one,{ms:250}); if(!z) continue; const len=compStack(z.e).length; const bal=Math.abs(s.reduce((a,b)=>a+b,0)*2-classes.length);
    if(!best||len+2*bal<best.score) best={s,z,score:len+2*bal}; }
  if(!best) return null;
  const A=classes.filter((c,i)=>best.s[i]), B=classes.filter((c,i)=>!best.s[i]);
  const X=classTree(sp,j,A,ctx,depth+1); if(!X) return null; const Y=classTree(sp,j,B,ctx,depth+1); if(!Y) return null;
  const code=join(X.code,Y.code,{kind:'stack',code:compStack(best.z.e),pol:best.z.pol},sp); return code&&{code,how:'חיסול'}; }

// ─── 4. ערך פשוט + שארית ───
function splitTrivial(sp,T,ctx,depth){ const rem=[]; sp.W.forEach((w,i)=>{ if(!T.ok(i)) rem.push(i); }); if(!rem.length||rem.length===sp.W.length) return null;
  ctx.log.push(`${'  '.repeat(depth)}ערך פשוט ${T.name} (${T.n}/${sp.W.length}) + שארית ${rem.length}`);
  const Y=solve(sub(sp,rem),ctx,depth+1); if(!Y) return null; const yok=sp.W.map((w,i)=>goodAt(Y.code,sp,i));
  const care=[]; const one=[]; sp.W.forEach((w,i)=>{ if(T.ok(i)&&!yok[i]){ care.push(i); one.push(1); } else if(!T.ok(i)){ care.push(i); one.push(0); } });
  if(!one.includes(1)) return Y;   // השארית נכונה בכל מקום
  const q=predicate(sub(sp,care),one,ctx,{ms:1500}); if(!q) return null; ctx.log.push(`${'  '.repeat(depth)}  תנאי (${q.how}, ${q.code.length})`);
  const code=join(trivCode(T),Y.code,q,sp); return code&&{code,how:'ערך+שארית'}; }
function twoTrivial(sp,ctx,depth){ const T=trivials(sp).slice(0,8); const n=sp.W.length;
  for(let a=0;a<T.length;a++) for(let b=a+1;b<T.length;b++){ const A=T[a], B=T[b]; if(A.kind==='const'&&B.kind==='const') continue; if(A.n+B.n<n) continue;
    let ok=true; for(let i=0;i<n&&ok;i++) if(!A.ok(i)&&!B.ok(i)) ok=false; if(!ok) continue;
    const care=[], one=[]; for(let i=0;i<n;i++){ const x=A.ok(i), y=B.ok(i); if(x!==y){ care.push(i); one.push(x?1:0); } }
    ctx.log.push(`${'  '.repeat(depth)}שני ערכים: ${A.name} / ${B.name}`);
    const q=predicate(sub(sp,care),one,ctx,{ms:1500}); if(!q) continue; ctx.log.push(`${'  '.repeat(depth)}  תנאי (${q.how}, ${q.code.length})`);
    const code=join(trivCode(A),trivCode(B),q,sp); if(!code) continue; return {code,how:'שני-ערכים'}; }
  return null; }

// ─── 5. קלט אחד: חוצים לפי ביט ───
function bitSplit(sp,c,ctx,depth){ for(const k of [3,0,1,2]){ if(Date.now()>ctx.deadline) return null;
    const A=[], B=[]; sp.pts.forEach((p,i)=>((p[c]>>k)&1?A:B).push(i)); if(!A.length||!B.length) continue;
    const one=sp.pts.map(p=>(p[c]>>k)&1); const q=predicate(sp,one,ctx,{ms:300,value:false}); if(!q) continue;
    ctx.log.push(`${'  '.repeat(depth)}ביט ${k} של תא${c}`);
    const X=solve(sub(sp,A),ctx,depth+1); if(!X) continue; const Y=solve(sub(sp,B),ctx,depth+1); if(!Y) continue;
    const code=join(X.code,Y.code,q,sp); if(!code) continue; return {code,how:'ביט'}; }
  return null; }

// ─── הפותר ───
function solve(sp,ctx,depth=0){ if(Date.now()>ctx.deadline||depth>ctx.maxDepth) return null; const pad='  '.repeat(depth);
  const T=trivials(sp); if(T[0]&&T[0].n===sp.W.length){ const code=trivCode(T[0]); if(code) return {code,how:T[0].name}; }
  const cs=relevant(sp); const res=r=>{ if(r&&!verify(r.code,sp)){ ctx.log.push(pad+'✗ נכשל בבדיקת-הצומת ('+r.how+')'); if(process.env.CASEDBG){ const i=sp.pts.findIndex((p,i)=>!goodAt(r.code,sp,i)); console.log('DBG', JSON.stringify(r.code), 'pt', Array.from(sp.pts[i]).join(','), 'want', sp.W[i], 'got', runAt(r.code,sp,i)); } return null; } return r; };
  if(cs.length===1){ let r=leafBasic(sp,cs,2500); if(r) return res(r);
    r=leafValue(sp,ctx,Math.min(6000,ctx.deadline-Date.now())); if(r) return res(r);
    if(uniq(sp,cs).length>=4){ r=bitSplit(sp,cs[0],ctx,depth); if(r) return res(r); }   // כל חצייה מקטינה את התחום פי 2 ⇒ נגמר לבד
    return res(leafBasic(sp,cs,Math.min(15000,ctx.deadline-Date.now()))); }
  let r=twoTrivial(sp,ctx,depth); if(r) return res(r);
  for(const c of collapses(sp,cs).slice(0,3)){ r=solveCollapsed(sp,c,ctx,depth); if(r) return res(r); }
  if(cs.length===2){ r=leafBasic(sp,cs,3000); if(r) return res(r); }
  const E=elimCands(sp,cs); probeElim(sp,E);
  // חיסול זול: מעט קבוצות, או שכל עלה נשאר עם קלט אחד
  for(const e of E){ if(!(e.classes.length<=4||(cs.length===2&&e.classes.length<=16))) continue; ctx.log.push(`${pad}חיסול תא${e.j}: ${e.classes.length} קבוצות`); r=classTree(sp,e.j,e.classes,ctx,depth); if(r) return res(r); }
  r=leafValue(sp,ctx,Math.min(ctx.vms,ctx.deadline-Date.now())); if(r) return res(r);
  for(const t of T.slice(0,3)){ if(t.n<sp.W.length*0.15) break; r=splitTrivial(sp,t,ctx,depth); if(r) return res(r); }
  for(const e of E){ if(e.classes.length>4&&e.classes.length<=16){ ctx.log.push(`${pad}חיסול תא${e.j}: ${e.classes.length} קבוצות`); r=classTree(sp,e.j,e.classes,ctx,depth); if(r) return res(r); } }
  return null; }

// בונה-פיצול: gen כמו בשאר הבונים (התשובה חייבת להיות פונקציה של תאי-הקלט). מחזיר {prog, how, log, ms}
export function caseBuild(gen,{ins=[0,1],ms=280000,vms=8000,vsize=5,maxDepth=12,say=()=>{}}={}){ const t0=Date.now();
  const tt=tableOf(gen,ins); if(!tt) return {prog:null,why:'התשובה לא נקבעת מתאי-הקלט בלבד',ms:Date.now()-t0};
  const K=ins.length, pts=[], W=new Uint8Array(tt.length); for(let x=0;x<tt.length;x++){ const p=new Int8Array(16).fill(-1); ins.forEach((c,j)=>{ p[c]=(x>>(4*(K-1-j)))&15; }); pts.push(p); W[x]=tt[x]; }
  const ctx={deadline:t0+ms,maxDepth,vms,vsize,log:[],vtime:0}; let r=null; try{ r=solve({cells:ins.slice(),keep:ins.slice(),pts,W},ctx,0); }catch(e){ ctx.log.push('שגיאה: '+String(e.message||e).slice(0,120)); }
  for(const l of ctx.log) say(l);
  return {prog:r?r.code:null,how:r?r.how:null,log:ctx.log,ms:Date.now()-t0,vms:ctx.vtime}; }
