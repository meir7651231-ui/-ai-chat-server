// «מסגרת-לולאה למספרים» (numloop): התחלה; חזור (לפי מונה שנלקח מקלט, או עד שתא מתאפס) { גוף }; ואחרי — התשובה לתא 2.
// ההתחלה, הגוף, המונה והתנאי — כלים מהמדף (לבנים ניידות) או צירופים קטנים של חבר/נאנד/חצי, שנבחרים בחיפוש לפי הדוגמאות.
// צורת-הלולאה מוסקת מהטבלה המלאה של המשימה (מהדוגמאות בלבד): למשל f(a,b) עם b סיבובים של r=F(r,a) — רואים ש-T(b+1)=F(T(b),a).
// מסגרות (מהזולה ליקרה):
//   ספירה-עד-אפס  x=I; n=0; כל עוד x: x=U(x); n++          ⇒ P(n)          (ספירת ביטים, מרחק האמינג)
//   מונה+אחרי      c=D; r=I; חזור c פעמים: r=U(r)            ⇒ P(r)          (הביט שבמקום ב, סיבוב)
//   פעם-אחת (אם)   r=I; אם C: r=J                             ⇒ r             (הקרוב מבין שניים)
//   זוג (אוקלידס)   u=I1; v=I2; כל עוד v: (u,v)=(v,B(u,v))      ⇒ u             (מחלק משותף)
//   נסיגה          c=D; r=I; חזור c: r=F(r,R)  — F מוסק מהטבלה  (חזקה, קנס, סדרה חשבונית בהפרשים, חצי עליון עם בן-לוויה)
//   נהג+צובר       x=I; r=I'; חזור K / עד x=0: r=B(V1(r),V2(x)); x=H(x)  (היפוך ביטים)
import fs from 'fs'; import crypto from 'crypto';
import { run } from './machine3s.mjs'; import { makeChecker, finalCheck } from './tzoref.mjs';
import { add4 } from './lifted-add.mjs'; import { shr4 } from './lifted-shr.mjs';

const R=k=>Math.floor(Math.random()*k);
const key=v=>Buffer.from(v.buffer,v.byteOffset,v.length).toString('latin1');
const dataOf=p=>[...new Set(p.filter(([o,,c])=>o==='WHERE'&&!c).map(([,k])=>k))];
const now=()=>Date.now();

// ─── 1. הכלים: חבר / נאנד / חצי + לבנים ניידות מהמדף (עם לוח-כפל מלא) ───────────────────────
export let PR=null;
function basicPrims(){ const A=new Uint8Array(256), N=new Uint8Array(256), S=new Uint8Array(16);
  for(let a=0;a<16;a++){ S[a]=shr4(a); for(let b=0;b<16;b++){ A[a*16+b]=add4(a,b); N[a*16+b]=~(a&b)&15; } }
  return [{name:'חבר',k:2,T:A,op:'ADD',basic:true,len:1,comm:true},{name:'נאנד',k:2,T:N,op:'CALC',basic:true,len:1,comm:true},{name:'חצי',k:1,T:S,op:'SHR',basic:true,len:1}]; }
// לבנה מוזזת לתאים אחרים ולמקום אחר בתוכנית — עדיין נותנת את הלוח?
function relocTest(b,T){ for(let t=0;t<40;t++){ const perm=[...Array(16).keys()].sort(()=>Math.random()-0.5); const map={}; b.cells.forEach((c,i)=>{ map[c]=perm[i]; });
    const off=5+R(9); const pre=[]; for(let i=0;i<off;i++) pre.push(i%2?['GO']:['WHERE',R(16)]);
    const q=[...pre,...b.prog.map(x=>x[0]==='WHERE'?(x[2]?['WHERE',x[1]+off,'code']:['WHERE',map[x[1]]]):x)];
    const m=Array.from({length:16},()=>R(16)); const args=b.ins.map(()=>R(16)); b.ins.forEach((c,i)=>{ m[map[c]]=args[i]; });
    const idx=args.reduce((a,x)=>a*16+x,0); const r=run(q,m,{maxSteps:60000}); if(T[idx]===255) continue;
    if(!r||r.st.length||r.mem[map[b.out]]!==T[idx]||b.ins.some((c,i)=>r.mem[map[c]]!==args[i])) return false; }
  return true; }
export function loadPrims({file='shelf3.json',cache='numloop-prims.json'}={}){ if(PR) return PR;
  const raw=fs.readFileSync(file,'utf8'); const h=crypto.createHash('md5').update(raw).digest('hex'); let blocks=null;
  try{ const c=JSON.parse(fs.readFileSync(cache,'utf8')); if(c.h===h) blocks=c.blocks.map(b=>({...b,T:Uint8Array.from(b.T)})); }catch{}
  if(!blocks){ blocks=[]; const sh=JSON.parse(raw);
    for(const b of sh.named){ const ins=b.ins||[], o=b.out??2; if(b.bad||!ins.length||ins.length>3||ins.includes(o)||b.movable===false) continue;
      if(/רשימה|ספור|בלי|אמצע|וקטן|^ר\d|^רר\d|^ש[3-6]/.test(b.name)||b.prog.length>200||b.prog.some(x=>x[0]==='WHERE@')) continue;
      const k=ins.length, n=16**k, T=new Uint8Array(n); let ok=true, und=0;
      for(let x=0;x<n&&ok;x++){ const args=[]; for(let j=k-1;j>=0;j--) args[j]=(x>>(4*(k-1-j)))&15; let v=null;
        for(let t=0;t<3;t++){ const m=Array.from({length:16},()=>R(16)); ins.forEach((c,i)=>{ m[c]=args[i]; }); const r=run(b.prog,m,{maxSteps:30000});
          if(!r||r.st.length||ins.some((c,i)=>r.mem[c]!==args[i])){ v=255; und++; break; } if(v==null) v=r.mem[o]; else if(v!==r.mem[o]){ ok=false; break; } }
        T[x]=v; }
      if(!ok||und>n/4) continue; if(T.every(v=>v===T[0])) continue;                      // קבוע — יש לנו קבועים בלי לבנה
      if(k===1&&T.every((v,i)=>v===i)) continue;                                              // העתק
      const bb={name:b.name,k,T,prog:b.prog,ins,out:o,cells:dataOf(b.prog),len:b.prog.length,und};
      if(!relocTest(bb,T)) continue; blocks.push(bb); }
    fs.writeFileSync(cache,JSON.stringify({h,blocks:blocks.map(b=>({...b,T:Array.from(b.T)}))})); }
  // אותו לוח — רק הקצרה
  const byT=new Map(); for(const b of blocks){ const kk=b.k+':'+key(b.T); const o=byT.get(kk); if(!o||b.len<o.len) byT.set(kk,b); }
  const bas=basicPrims(); const bk=new Set(bas.map(p=>p.k+':'+key(p.T)));
  PR=[...bas,...[...byT.values()].filter(b=>!bk.has(b.k+':'+key(b.T))).sort((a,b)=>a.len-b.len)];
  PR.forEach((p,i)=>{ p.id=i; p.bool=p.T.every(v=>v===0||v===15||v===255); p.cost=p.basic?1:p.len+4;
    if(p.k===2){ const IL=new Int16Array(256).fill(-1), IR=new Int16Array(256).fill(-1);   // הפוך: x ו-w ⇒ ה-y היחיד (אם יש)
      for(let x=0;x<16;x++) for(let w=0;w<16;w++){ let y=-1,n=0,z=-1,m=0; for(let c=0;c<16;c++){ if(p.T[x*16+c]===w){ y=c; n++; } if(p.T[c*16+x]===w){ z=c; m++; } } if(n===1) IL[x*16+w]=y; if(m===1) IR[x*16+w]=z; }
      p.IL=IL; p.IR=IR; }
    if(p.k===1){ const I=new Int16Array(16).fill(-1); for(let w=0;w<16;w++){ const c=[...Array(16).keys()].filter(z=>p.T[z]===w); if(c.length===1) I[w]=c[0]; } p.I1=I; } });
  return PR; }

// ─── 2. קבועים: התוכנית הקצרה ביותר (קח/חשב/חבר/חצי מתא כלשהו) שמשאירה קבוע במחסנית ─────────────────
let CONSTS=null;
export function CONST_(){ if(CONSTS) return CONSTS; const CF='numloop-consts.json'; try{ const c=JSON.parse(fs.readFileSync(CF,'utf8')); if(c.length===16&&c.every(Boolean)) return CONSTS=c; }catch{}
  CONSTS=computeConsts(); try{ fs.writeFileSync(CF,JSON.stringify(CONSTS)); }catch{} return CONSTS; }
function computeConsts(){ const out=new Array(16).fill(null); const X=[...Array(16).keys()];
  const A=(a,b)=>a.map((x,i)=>(x+b[i])&15), N=(a,b)=>a.map((x,i)=>~(x&b[i])&15), S=a=>a.map(x=>x>>1);
  let layer=[{st:[],code:[]}]; const seen=new Set(['']); let left=16;
  for(let d=0;d<14&&left;d++){ const nx=[];
    for(const s of layer){ const cand=[];
      if(s.st.length<4) cand.push({st:[...s.st,X],op:'TAKE'});
      if(s.st.length>=2){ const a=s.st[s.st.length-2], b=s.st[s.st.length-1], r=s.st.slice(0,-2); cand.push({st:[...r,A(a,b)],op:'ADD'},{st:[...r,N(a,b)],op:'CALC'}); }
      if(s.st.length>=1) cand.push({st:[...s.st.slice(0,-1),S(s.st[s.st.length-1])],op:'SHR'});
      for(const c of cand){ const k=c.st.map(v=>v.join(',')).join('|'); if(seen.has(k)) continue; seen.add(k); const code=[...s.code,[c.op]]; nx.push({st:c.st,code});
        if(c.st.length===1&&c.st[0].every(v=>v===c.st[0][0])&&!out[c.st[0][0]]){ out[c.st[0][0]]=code; left--; } } }
    layer=nx; }
  // מה שחסר: צירוף של שני קבועים שכבר יש (חבר/נאנד) או חצי — עד שאין שיפור
  for(let ch=true;ch;){ ch=false; const cand=(v,code)=>{ if(!out[v]||code.length<out[v].length){ out[v]=code; ch=true; } };
    for(let a=0;a<16;a++) if(out[a]){ cand(a>>1,[...out[a],['SHR']]); for(let b=0;b<16;b++) if(out[b]){ cand((a+b)&15,[...out[a],...out[b],['ADD']]); cand(~(a&b)&15,[...out[a],...out[b],['CALC']]); } } }
  return out; }

// ─── 3. ביטויים: {t:'x',i} משתנה מופשט · {t:'v',i} משתנה-מסגרת · {t:'in',i} קלט · {t:'k',c} קבוע · {t:'p',p,a:[..]} כלי ─────
export const show=e=>e.t==='x'?'xyzw'[e.i]:e.t==='v'?'v'+e.i:e.t==='in'?'קלט'+e.i:e.t==='k'?String(e.c):`${PR[e.p].name}(${e.a.map(show).join(', ')})`;
export const sizeOf=e=>e.t==='p'?1+e.a.reduce((s,a)=>s+sizeOf(a),0):0;
export function costOf(e){ if(e.t==='k') return CONST_()[e.c].length; if(e.t!=='p') return 3; const p=PR[e.p];
  if(p.basic) return 1+e.a.reduce((s,a)=>s+costOf(a),0); return p.len+3+e.a.reduce((s,a)=>s+(a.t==='p'||a.t==='k'?costOf(a)+3:0),0); }
export const subst=(e,f)=>e.t==='x'?f(e.i):e.t==='p'?{t:'p',p:e.p,a:e.a.map(a=>subst(a,f))}:e;
const ap=(p,T,a,b,c)=>{ const k=PR[p].k; return k===1?T[a]:k===2?T[(a<<4)|b]:T[(a<<8)|(b<<4)|c]; };
// ערך של ביטוי (סקלר). leaf(e) נותן ערך לעלה. 255/-1 = לא ידוע
export function evS(e,leaf){ if(e.t==='k') return e.c; if(e.t!=='p') return leaf(e); const p=PR[e.p]; const a=e.a.map(x=>evS(x,leaf)); if(a.some(x=>x<0)) return -1;
  const r=ap(e.p,p.T,a[0],a[1],a[2]); return r===255?-1:r; }
// ערך של ביטוי במשתנה מופשט אחד/שניים על כל הלוח (16 או 256)
function tableOfExpr(e,k){ const n=16**k, T=new Int16Array(n); for(let x=0;x<n;x++){ const v=[x>>4&15,x&15]; T[x]=evS(e,l=>k===1?x&15:v[l.i]); } return T; }

// ─── 4. בריכות: כל הפונקציות של משתנה אחד (16 ערכים) שאפשר לבנות בזול — לפי מחיר ───────────────────
let UPOOL=null;
export function unaryPool({cap=40000}={}){ if(UPOOL) return UPOOL; loadPrims();
  const seen=new Map(); const L=[[]]; const X=Int16Array.from({length:16},(_,i)=>i);
  const add=(T,e,l)=>{ if(T.some(v=>v<0||v===255)) return; const k=key(Uint8Array.from(T)); const o=seen.get(k); const c=costOf(e); if(o){ if(c<o.cost){ o.e=e; o.cost=c; } return; } const it={T:Uint8Array.from(T),e,cost:c}; seen.set(k,it); (L[l]||(L[l]=[])).push(it); };
  add(X,{t:'x',i:0},0); for(let c=0;c<16;c++) add(new Int16Array(16).fill(c),{t:'k',c},0);
  // קודם: כל תוכניות-המחסנית היסודיות (קח/חבר/נאנד/חצי) עד 13 פקודות — זולות, גם כשהן «עמוקות» (סיבוב = 8 פקודות)
  { const XA=Array.from({length:16},(_,i)=>i); let layer=[{st:[],es:[]}]; const sn=new Set(['']); const ADD=PR[0].id, NAND=PR[1].id, SHR=PR[2].id;
    for(let d=1;d<=13;d++){ const nx=[];
      for(const s of layer){ const st=s.st, es=s.es; const cand=[];
        if(st.length<4) cand.push([[...st,XA],[...es,{t:'x',i:0}]]);
        if(st.length>=2){ const a=st[st.length-2], b=st[st.length-1], r=st.slice(0,-2), ea=es[es.length-2], eb=es[es.length-1], re=es.slice(0,-2);
          cand.push([[...r,a.map((x,i)=>(x+b[i])&15)],[...re,{t:'p',p:ADD,a:[ea,eb]}]],[[...r,a.map((x,i)=>~(x&b[i])&15)],[...re,{t:'p',p:NAND,a:[ea,eb]}]]); }
        if(st.length>=1) cand.push([[...st.slice(0,-1),st[st.length-1].map(x=>x>>1)],[...es.slice(0,-1),{t:'p',p:SHR,a:[es[es.length-1]]}]]);
        for(const [c,ce] of cand){ const k=c.map(v=>v.join(',')).join('|'); if(sn.has(k)) continue; sn.add(k); nx.push({st:c,es:ce});
          if(c.length===1){ const kk=key(Uint8Array.from(c[0])); if(!seen.has(kk)){ const it={T:Uint8Array.from(c[0]),e:ce[0],cost:d+2}; seen.set(kk,it); (L[9]||(L[9]=[])).push(it); } } } }
      layer=nx; } }
  const P1=PR.filter(p=>p.k===1), P2=PR.filter(p=>p.k===2);
  for(let l=1;l<=3&&seen.size<cap;l++){ L[l]=L[l]||[];
    for(const p of P1) for(const a of L[l-1]){ const T=new Int16Array(16); for(let i=0;i<16;i++) T[i]=p.T[a.T[i]]; add(T,{t:'p',p:p.id,a:[a.e]},l); }
    for(const p of P2){ if(seen.size>cap) break;
      for(let la=0;la<l;la++){ const lb=l-1-la; if(l===3&&la===1&&!p.basic&&p.len>20) continue;
        for(const a of L[la]) for(const b of L[lb]){ if(a.e.t==='k'&&b.e.t==='k') continue; const T=new Int16Array(16); for(let i=0;i<16;i++) T[i]=p.T[(a.T[i]<<4)|b.T[i]]; add(T,{t:'p',p:p.id,a:[a.e,b.e]},l); } } } }
  UPOOL=[...seen.values()].filter(it=>!it.T.every(v=>v===it.T[0])||it.e.t==='k').sort((a,b)=>a.cost-b.cost);
  return UPOOL; }

// ─── 5. «ממלא-טבלה»: ביטוי קטן שמתאים לנקודות (טבלה חלקית). כמו בונה-הערכים, על הכלים שלנו ─────────────
// cols: וקטור לכל משתנה; W: התשובה. mode 'bool' = רק אפס/לא-אפס צריך להתאים.
export const WPM=100000;   // יחידות-עבודה לאלפית-שנייה (בערך, על מכונה פנויה)
export function synth(cols,W,{ms=3000,work=ms*WPM,mode='exact',maxL=2,keep=6000,consts=true,top3=true}={}){ loadPrims(); const n=W.length, nv=cols.length; let WK=0; synth.work=0;
  const isB=mode==='bool'; const match=v=>{ if(isB){ for(let i=0;i<n;i++) if((v[i]===0)!==(W[i]===0)) return false; return true; } for(let i=0;i<n;i++) if(v[i]!==W[i]) return false; return true; };
  const seen=new Map(); const L=[[]]; let found=null;
  const add=(v,e,l)=>{ WK+=n+200; for(let i=0;i<n;i++) if(v[i]===255) return; const k=key(v); if(seen.has(k)) return; seen.set(k,e); L[l].push({v,e}); if(!found&&match(v)) found=e; };
  cols.forEach((c,i)=>add(Uint8Array.from(c),{t:'x',i},0)); if(consts) for(let c=0;c<16;c++) add(new Uint8Array(n).fill(c),{t:'k',c},0);
  if(found) return found;
  const P1=PR.filter(p=>p.k===1), P2=PR.filter(p=>p.k===2), P3=PR.filter(p=>p.k===3);
  const close=v=>{ let eq=0; const J=new Set(); for(let i=0;i<n;i++){ if(isB?((v[i]===0)===(W[i]===0)):v[i]===W[i]) eq++; J.add(v[i]*16+W[i]); } return eq+0.5*(n-J.size); };
  // מבוקש: התשובה = p(x, ?) — ה-? היחיד; אם כבר נבנה — נמצא
  const inv=()=>{ if(isB) return; const need=new Uint8Array(n);
    for(const p of P1){ let ok=true; for(let i=0;i<n;i++){ const y=p.I1[W[i]]; if(y<0){ ok=false; break; } need[i]=y; } if(ok){ const e=seen.get(key(need)); if(e){ found={t:'p',p:p.id,a:[e]}; return; } } }
    for(const p of P2) for(const Lx of L) for(const x of Lx){ for(const side of [0,1]){ const I=side?p.IR:p.IL; let ok=true, i=0; for(;i<n;i++){ const y=I[x.v[i]*16+W[i]]; if(y<0){ ok=false; break; } need[i]=y; } WK+=i+3;
          if(!ok) continue; WK+=200; const e=seen.get(key(need)); if(e){ found={t:'p',p:p.id,a:side?[e,x.e]:[x.e,e]}; return; } } if(WK>work) return; } };
  // שלב-עליון מהיר (בלי לשמור): p(a,b) עם יציאה מוקדמת בדוגמה הראשונה שלא מתאימה
  const topScan=(la,lb,dl)=>{ const A=L[la]||[], B=L[lb]||[];
    for(const p of (isB?[...P2].sort((x,y)=>(y.bool-x.bool)||(x.cost-y.cost)):P2)){ const T=p.T; if(WK>dl) return;
      for(const a of A){ if(WK>dl) return; const av=a.v; for(const b of B){ if(a.e.t==='k'&&b.e.t==='k') continue; const bv=b.v; let i=0;
          if(isB){ for(;i<n;i++){ const r=T[(av[i]<<4)|bv[i]]; if(r===255||(r===0)!==(W[i]===0)) break; } }
          else { for(;i<n;i++) if(T[(av[i]<<4)|bv[i]]!==W[i]) break; }
          WK+=i+3; if(i===n){ found={t:'p',p:p.id,a:[a.e,b.e]}; return; } } } } };
  const build=(l,dl)=>{ L[l]=L[l]||[];
    for(const p of P1){ for(const a of L[l-1]){ const v=new Uint8Array(n); for(let i=0;i<n;i++) v[i]=p.T[a.v[i]]; add(v,{t:'p',p:p.id,a:[a.e]},l); if(found) return; } }
    for(const p of P2){ if(WK>dl) return; for(let la=0;la<l;la++){ const lb=l-1-la;
        for(const a of L[la]){ if(found||WK>dl) return; for(const b of L[lb]){ if(a.e.t==='k'&&b.e.t==='k') continue; const v=new Uint8Array(n); for(let i=0;i<n;i++) v[i]=p.T[(a.v[i]<<4)|b.v[i]]; add(v,{t:'p',p:p.id,a:[a.e,b.e]},l); if(found) return; } } } }
    if(l===1&&top3){ const L3=L[0].filter(x=>x.e.t!=='k'||[0,1,15].includes(x.e.c)); for(const p of P3) for(const a of L3) for(const b of L3) for(const c of L3){ if(found) return; const v=new Uint8Array(n); for(let i=0;i<n;i++) v[i]=p.T[(a.v[i]<<8)|(b.v[i]<<4)|c.v[i]]; add(v,{t:'p',p:p.id,a:[a.e,b.e,c.e]},l); } } };
  // הסדר: שכבה 1 ⇒ «מבוקש» ⇒ עליון על (0,1),(1,1) ⇒ שכבה 2 ⇒ «מבוקש» ⇒ עליון על (0,2)
  const D=f=>work*f; const fin=x=>{ synth.work=WK; return x; };
  build(1,D(0.3)); if(found) return fin(found); inv(); if(found) return fin(found);
  topScan(0,1,D(0.4)); if(found) return fin(found); topScan(1,0,D(0.45)); if(found) return fin(found); topScan(1,1,D(0.6)); if(found) return fin(found);
  if(maxL>=2){ if(L[1].length>keep) L[1]=L[1].map(x=>[close(x.v),x]).sort((a,b)=>b[0]-a[0]).slice(0,keep).map(x=>x[1]);
    build(2,D(0.85)); if(found) return fin(found); inv(); if(found) return fin(found); topScan(0,2,D(0.95)); if(found) return fin(found); topScan(2,0,D(1)); }
  return fin(found); }
// ממלא-טבלה בסבבים: מתחילים ממדגם, מוסיפים נקודות שנכשלו
export function fit(pts,nv,opts={}){ // pts: [{x:[..],w}]
  const work=(opts.ms||3000)*WPM; let used=0; let S=pts.length<=(opts.n||128)?pts.slice():[...pts].sort(()=>Math.random()-0.5).slice(0,opts.n||128);
  const mode=opts.mode||'exact';
  for(let round=0;round<5;round++){ const cols=[...Array(nv)].map((_,j)=>Uint8Array.from(S.map(p=>p.x[j]))); const W=Uint8Array.from(S.map(p=>p.w));
    const e=synth(cols,W,{...opts,work:Math.max(200*WPM,work-used)}); used+=synth.work; if(!e) return null;
    const bad=pts.filter(p=>{ const r=evS(e,l=>p.x[l.i]); return mode==='bool'?(r<0||(r===0)!==(p.w===0)):r!==p.w; });
    if(!bad.length) return e; if(used>work) return null; S=[...S,...bad.slice(0,32)]; }
  return null; }

// ─── 6. המסגרת: ערך (סימולציה) ותוכנית ─────────────────────────────────────────────────────────────
// fr = {nv, init:[[j,e]], cond:j|-1, body:[[j,e]], post:e, how}
export function evalFrame(fr,X,maxIt=40){ const V=new Array(fr.nv).fill(-1); const leaf=e=>e.t==='v'?V[e.i]:X[e.i];   // -1 = עוד לא הושם (בתא יש זבל)
  for(const [j,e] of fr.init){ const r=evS(e,leaf); if(r<0) return -1; V[j]=r; }
  if(fr.cond>=0){ let it=0; for(;;){ if(V[fr.cond]<0) return -1; if(V[fr.cond]===0) break; if(++it>maxIt) return -1; for(const [j,e] of fr.body){ const r=evS(e,leaf); if(r<0) return -1; V[j]=r; } } }
  return evS(fr.post,leaf); }
export function compileFrame(fr,ins){ loadPrims(); const out=[]; let P=null;
  const pool=[15,14,13,12,11,10,9,8,7,6,5,4,3,1,0].filter(c=>!ins.includes(c)); const varCell=[];
  const pv=fr.post.t==='v'?fr.post.i:-1; for(let j=0;j<fr.nv;j++){ if(j===pv){ varCell[j]=2; continue; } varCell[j]=pool.shift(); }
  if(pv<0) pool.push(2);   // תא 2 — רק בסוף; עד אז אפשר כתא-עבודה
  const busy=new Set(); const alloc=()=>{ const c=pool.find(c=>!busy.has(c)); if(c==null) throw new Error('אין תא פנוי'); busy.add(c); return c; };
  const go=c=>{ if(P!==c){ out.push(['WHERE',c],['GO']); P=c; } };
  const depth=e=>e.t==='p'?1+Math.max(...e.a.map(depth)):0;
  const emitS=e=>{ if(e.t==='c'){ go(e.c); out.push(['TAKE']); return; } if(e.t==='k'){ if(P==null) go(varCell[0]??0); out.push(...CONST_()[e.c].map(x=>[...x])); return; }
    const p=PR[e.p]; if(p.k===1){ emitS(e.a[0]); out.push([p.op]); return; } const [x,y]=depth(e.a[0])>=depth(e.a[1])?[e.a[0],e.a[1]]:[e.a[1],e.a[0]]; emitS(x); emitS(y); out.push([p.op]); };
  const hoist=(e,tmp,want=null)=>{ if(e.t==='v') return {t:'c',c:varCell[e.i]}; if(e.t==='in') return {t:'c',c:ins[e.i]}; if(e.t==='k') return e;
    const p=PR[e.p]; if(p.basic) return {t:'p',p:e.p,a:e.a.map(a=>hoist(a,tmp))};
    const local=[], cells=[];
    for(const a of e.a){ const h=hoist(a,tmp); let c; if(h.t==='c'&&!cells.includes(h.c)) c=h.c; else { c=alloc(); local.push(c); emitS(h); go(c); out.push(['PUT']); } cells.push(c); }
    const o=want!=null&&!cells.includes(want)?want:alloc(); if(o!==want) tmp.push(o);
    const map={}; p.ins.forEach((q,i)=>{ map[q]=cells[i]; }); map[p.out]=o; const scr=[]; for(const q of p.cells) if(map[q]==null){ const s=alloc(); scr.push(s); map[q]=s; }
    const off=out.length; for(const x of p.prog) out.push(x[0]==='WHERE'?(x[2]?['WHERE',x[1]+off,'code']:['WHERE',map[x[1]]]):[...x]);
    P=null; for(const s of [...scr,...local]) busy.delete(s); return {t:'c',c:o}; };
  const assign=(c,e)=>{ const tmp=[]; const h=hoist(e,tmp,c); if(!(h.t==='c'&&h.c===c)){ emitS(h); go(c); out.push(['PUT']); } for(const t of tmp) busy.delete(t); };
  for(const [j,e] of fr.init) assign(varCell[j],e);
  if(fr.cond>=0){ const c=varCell[fr.cond]; go(c); out.push(['TAKE']); const j1=out.length; out.push(['WHERE',0,'code'],['JUMP'],['TAKE'],['TAKE'],['CALC']); const j2=out.length; out.push(['WHERE',0,'code'],['JUMP']);
    const B=out.length; P=null;   // חזרה לאחור מערבבת את «לאן/איפה» — לא סומכים על כלום
    for(const [j,e] of fr.body) assign(varCell[j],e);
    go(c); out.push(['TAKE'],['WHERE',B,'code'],['JUMP']); const E=out.length; out[j1]=['WHERE',B,'code']; out[j2]=['WHERE',E,'code']; P=c; }
  if(pv<0) assign(2,fr.post);
  return out; }

// ─── 7. בדיקות: הבודק הרשמי + «במקום אחר בתוכנית» ────────────────────────────────────────────────────
export function posCheck(prog,gen,n=300){ let bad=0; for(let t=0;t<n;t++){ const e=gen(); const k=10+(t%9); const pre=[]; for(let i=0;i<k;i++) pre.push(i%2?['GO']:['WHERE',0]);
    const q=[...pre,...prog.map(x=>x[2]==='code'?['WHERE',x[1]+k,'code']:x)]; const r=run(q,e.mem,{maxSteps:300000}); if(!r||r.st.length||!e.ok(r.mem)) bad++; } return bad; }
export function fullVerify(prog,gen,n=20000){ const fc=finalCheck(prog,gen,n); const pb=posCheck(prog,gen,300); return {n,bad:fc.bad,posBad:pb,ok:fc.bad===0&&pb===0}; }

// ─── 8. הטבלה המלאה של המשימה (מהדוגמאות בלבד) + «בריכת-התחלה»: ביטויים קטנים על הקלטים, כווקטור על כל הטבלה ─────────
export function fullTable(gen,ins){ const K=ins.length, N=16**K; const T=new Int16Array(N).fill(-1); let left=N;
  for(let t=0;t<N*60&&left;t++){ const e=gen(); let i=0; for(const c of ins) i=i*16+(e.mem[c]&15); const w=e.want&15; if(T[i]<0){ T[i]=w; left--; } else if(T[i]!==w) return null; }
  return left?null:Uint8Array.from(T); }
const digit=(idx,j,K)=>(idx>>(4*(K-1-j)))&15;
function inPool(K,{nu=400}={}){ const N=16**K; const U=unaryPool(); const seen=new Map(); const out=[];
  const add=(vec,e,cost)=>{ if(vec.some(v=>v===255)) return; const k=key(vec); const o=seen.get(k); if(o){ if(cost<o.cost){ o.e=e; o.cost=cost; } return; } const it={vec,e,cost}; seen.set(k,it); out.push(it); };
  const D=[...Array(K)].map((_,j)=>Uint8Array.from({length:N},(_,i)=>digit(i,j,K)));
  for(let j=0;j<K;j++) add(D[j],{t:'in',i:j},3);
  for(let c=0;c<16;c++) add(new Uint8Array(N).fill(c),{t:'k',c},CONST_()[c].length);
  for(let j=0;j<K;j++) for(const u of U.slice(0,nu)){ if(u.e.t!=='p') continue; const v=new Uint8Array(N); for(let i=0;i<N;i++) v[i]=u.T[D[j][i]]; add(v,subst(u.e,()=>({t:'in',i:j})),u.cost); }
  for(const p of PR) if(p.k===2) for(let a=0;a<K;a++) for(let b=0;b<K;b++){ if(a===b) continue; const v=new Uint8Array(N); for(let i=0;i<N;i++) v[i]=p.T[(D[a][i]<<4)|D[b][i]]; add(v,{t:'p',p:p.id,a:[{t:'in',i:a},{t:'in',i:b}]},p.cost+6); }
  if(K===3) for(const p of PR) if(p.k===3) for(const [a,b,c] of [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]]){ const v=new Uint8Array(N); for(let i=0;i<N;i++) v[i]=p.T[(D[a][i]<<8)|(D[b][i]<<4)|D[c][i]]; add(v,{t:'p',p:p.id,a:[{t:'in',i:a},{t:'in',i:b},{t:'in',i:c}]},p.cost+9); }
  return out.sort((a,b)=>a.cost-b.cost); }
const isConst=v=>{ for(let i=1;i<v.length;i++) if(v[i]!==v[0]) return false; return true; };
const shuffled=n=>{ const a=Uint32Array.from({length:n},(_,i)=>i); for(let i=n-1;i>0;i--){ const j=R(i+1); const t=a[i]; a[i]=a[j]; a[j]=t; } return a; };
// פונקציה של משתנה אחד מהבריכה שמתאימה למפה חלקית m (16, -1 = לא ידוע)
function unaryMatch(m,{allowId=true}={}){ const U=unaryPool(); for(const u of U){ if(!allowId&&u.e.t==='x') continue; let ok=true; for(let v=0;v<16;v++) if(m[v]>=0&&u.T[v]!==m[v]){ ok=false; break; } if(ok) return u; } return null; }
const DEC=c=>({t:'p',p:0,a:[c,{t:'k',c:15}]}), INC=c=>({t:'p',p:0,a:[c,{t:'k',c:1}]});
const X0={t:'x',i:0};

// ─── 9. המסגרות ───────────────────────────────────────────────────────────────────────────────────
// א. ספירה-עד-אפס: x=I; n=0; כל עוד x: x=U(x); n++  ⇒ P(n)
function* tWhileCount(ctx){ const {T,N,IP,U}=ctx; const perm=shuffled(N);
  const Us=U.filter(u=>u.e.t==='p').slice(0,ctx.nUw).map(u=>{ const cnt=new Uint8Array(16); for(let v=0;v<16;v++){ let x=v,n=0; while(x!==0&&n<16){ x=u.T[x]; n++; } cnt[v]=x===0&&n<16?n:255; } return {u,cnt}; });
  for(const I of IP.slice(0,ctx.nIw)){ if(ctx.out()) return; if(ctx.tick()) yield null; if(isConst(I.vec)) continue; const g=new Int16Array(16).fill(-1); let ok=true;
    for(let q=0;q<N;q++){ const i=perm[q]; const v=I.vec[i]; if(g[v]<0) g[v]=T[i]; else if(g[v]!==T[i]){ ok=false; break; } } if(!ok) continue;
    for(const {u,cnt} of Us){ const m=new Int16Array(16).fill(-1); let good=true; for(let v=0;v<16;v++){ if(g[v]<0) continue; const c=cnt[v]; if(c===255){ good=false; break; } if(m[c]<0) m[c]=g[v]; else if(m[c]!==g[v]){ good=false; break; } }
      if(!good) continue; const P=unaryMatch(m); if(!P) continue;
      yield {how:`ספירה-עד-אפס: x=${show(I.e)}; כל עוד x: x=${show(subst(u.e,()=>({t:'v',i:0})))}; n++ ⇒ ${show(P.e)}`,
        nv:2, init:[[0,I.e],[1,{t:'k',c:0}]], cond:0, body:[[0,subst(u.e,()=>({t:'v',i:0}))],[1,INC({t:'v',i:1})]], post:P.e.t==='x'?{t:'v',i:1}:subst(P.e,()=>({t:'v',i:1}))}; } } }
// ב. מונה+אחרי: c=D; r=I; חזור c פעמים: r=U(r)  ⇒ P(r)
function* tCountPost(ctx){ const {T,N,IP,U}=ctx; const perm=shuffled(N);
  const Ds=IP.filter(d=>!(isConst(d.vec)&&d.vec[0]===0)).slice(0,ctx.nD), Is=IP.filter(x=>!isConst(x.vec)).slice(0,ctx.nI);
  const Us=U.filter(u=>u.e.t==='p'&&!isConst(u.T)).slice(0,ctx.nU).map(u=>{ const pw=new Uint8Array(256); for(let v=0;v<16;v++){ let x=v; for(let k=0;k<16;k++){ pw[k*16+v]=x; x=u.T[x]; } } return {u,pw}; });
  const m=new Int16Array(16);
  for(const D of Ds){ if(ctx.out()) return; if(ctx.tick()) yield null; for(const I of Is){ for(const {u,pw} of Us){ m.fill(-1); let q=0;
        for(;q<N;q++){ const i=perm[q]; const s=pw[D.vec[i]*16+I.vec[i]]; if(m[s]<0) m[s]=T[i]; else if(m[s]!==T[i]) break; }
        if(q<N) continue; const P=unaryMatch(m); if(!P) continue;
        yield {how:`מונה+אחרי: c=${show(D.e)}; r=${show(I.e)}; חזור c: r=${show(subst(u.e,()=>({t:'v',i:1})))} ⇒ ${show(subst(P.e,()=>({t:'v',i:1})))}`,
          nv:2, init:[[0,D.e],[1,I.e]], cond:0, body:[[1,subst(u.e,()=>({t:'v',i:1}))],[0,DEC({t:'v',i:0})]], post:P.e.t==='x'?{t:'v',i:1}:subst(P.e,()=>({t:'v',i:1}))}; } } } }
// ג. פעם-אחת (אם): r=I; אם C: r=J  ⇒ r.   C נבנה מהדוגמאות שבהן I≠J
function* tOnce(ctx){ for(const oms of ctx.onceMsL) yield* tOnce1({...ctx,onceMs:oms}); }
function* tOnce1(ctx){ const {T,N,IP,K}=ctx; const top=IP.slice(0,ctx.nPair); let tried=0;
  for(const I of top) for(const J of top){ if(ctx.out()||tried>=ctx.maxOnce) return; if(ctx.tick()) yield null; if(I===J) continue; let ok=true, nI=0, nJ=0;
      for(let i=0;i<N;i++){ const t=T[i]; if(t!==I.vec[i]&&t!==J.vec[i]){ ok=false; break; } if(I.vec[i]!==J.vec[i]){ if(t===J.vec[i]) nJ++; else nI++; } }
      if(!ok||!nI||!nJ) continue; tried++;
      const pts=[]; for(let i=0;i<N;i++) if(I.vec[i]!==J.vec[i]) pts.push({x:[...Array(K)].map((_,j)=>digit(i,j,K)),w:T[i]===J.vec[i]?15:0});
      let C=ctx.fit(pts,K,{ms:ctx.onceMs,mode:'bool'}); if(!C) continue; C=subst(C,i=>({t:'in',i}));
      yield {how:`פעם-אחת: r=${show(I.e)}; אם ${show(C)}: r=${show(J.e)}`, nv:2, init:[[0,I.e],[1,C]], cond:1, body:[[0,J.e],[1,{t:'k',c:0}]], post:{t:'v',i:0}}; } }
// ד. זוג (אוקלידס): u=I1; v=I2; כל עוד v: (u,v)=(v,B(u,v))  ⇒ u
function* tPair(ctx){ const {T,N,IP}=ctx; const perm=shuffled(N); const top=IP.filter(x=>!isConst(x.vec)).slice(0,ctx.nPairInit);
  const Bs=[]; for(const p of PR) if(p.k===2){ Bs.push({p,sw:0},{p,sw:1}); }
  for(const I1 of top) for(const I2 of top){ if(ctx.out()) return; if(ctx.tick()) yield null; if(I1===I2) continue;
    for(const {p,sw} of Bs){ let q=0; for(;q<N;q++){ const i=perm[q]; let u=I1.vec[i], v=I2.vec[i], it=0, bad=false; while(v!==0){ if(++it>20){ bad=true; break; } const t=sw?p.T[(v<<4)|u]:p.T[(u<<4)|v]; if(t===255){ bad=true; break; } u=v; v=t; } if(bad||u!==T[i]) break; }
      if(q<N) continue; const B={t:'p',p:p.id,a:sw?[{t:'v',i:1},{t:'v',i:0}]:[{t:'v',i:0},{t:'v',i:1}]};
      yield {how:`זוג: u=${show(I1.e)}; v=${show(I2.e)}; כל עוד v: (u,v)=(v,${show(B)})`, nv:3, init:[[0,I1.e],[1,I2.e]], cond:1, body:[[2,B],[0,{t:'v',i:1}],[1,{t:'v',i:2}]], post:{t:'v',i:0}}; } } }
// ה. נסיגה (מהטבלה): בוחרים מונה D וקבוצת-קלטים Rs כך ש-T = G(D, Rs). אז:
//   (1) T(k+1)=F(T(k),Rs)                  ⇒ r=I(Rs); חזור D: r=F(r,Rs)
//   (2) ההפרשים d(k)=T(k+1)-T(k) נסוגים      ⇒ r=I; x=J; חזור D: r=r+x; x=H(x,Rs)        (סדרה חשבונית)
//   (3) עם «בן-לוויה» y (y=y0; y=Hy(y,Rs))   ⇒ r=F(r,y,Rs)                                (החצי העליון של המכפלה)
const subsetsOf=K=>{ const out=[]; for(let m=0;m<(1<<K);m++){ const s=[]; for(let j=0;j<K;j++) if(m>>j&1) s.push(j); out.push(s); } return out.sort((a,b)=>a.length-b.length); };
const findXS=()=>({XOR:PR.find(p=>p.k===2&&p.T.every((v,i)=>v===((i>>4)^(i&15)))), SUB:PR.find(p=>p.k===2&&p.T.every((v,i)=>v===(((i>>4)-(i&15))&15)))});
export function recurJobs(ctx){ const {T,N,K,IP}=ctx; const Ds=IP.filter(d=>!isConst(d.vec)).slice(0,ctx.nDrec); const SS=subsetsOf(K).filter(s=>s.length<K);
  const {XOR,SUB}=findXS(); const jobs=[];
  for(const D of Ds) for(const Rs of SS){ const nr=16**Rs.length; const rk=i=>{ let r=0; for(const j of Rs) r=r*16+digit(i,j,K); return r; };
    const G=new Int16Array(16*nr).fill(-1); let ok=true; for(let i=0;i<N;i++){ const k=D.vec[i]*nr+rk(i); if(G[k]<0) G[k]=T[i]; else if(G[k]!==T[i]){ ok=false; break; } } if(!ok) continue;
    let z=true; for(let r=0;r<nr;r++){ let any=false; for(let k=0;k<16;k++) if(G[k*nr+r]>=0) any=true; if(any&&G[r]<0){ z=false; break; } } if(!z) continue;   // כל r צריך T(0,r)
    const rdig=r=>{ const o=[]; for(let q=Rs.length-1;q>=0;q--){ o[q]=r%16; r=Math.floor(r/16); } return o; };
    // (1)
    { const F=new Int16Array(16*nr).fill(-1); let good=true, pairs=0, rep=0; for(let r=0;r<nr&&good;r++) for(let k=0;k<15;k++){ const a=G[k*nr+r], b=G[(k+1)*nr+r]; if(a<0||b<0) continue; pairs++; const q=a*nr+r; if(F[q]<0) F[q]=b; else if(F[q]!==b){ good=false; break; } else rep++; }
      if(good&&pairs) jobs.push({kind:1,D,Rs,nr,G,F,rdig,score:D.cost+(rep?0:40)+Rs.length*5}); }
    // (2)
    for(const op of [SUB,XOR].filter(Boolean)){ const d=new Int16Array(16*nr).fill(-1); for(let r=0;r<nr;r++) for(let k=0;k<15;k++){ const a=G[k*nr+r], b=G[(k+1)*nr+r]; if(a>=0&&b>=0) d[k*nr+r]=op===SUB?((b-a)&15):(a^b); }
      let jz=true; for(let r=0;r<nr;r++) if(G[r]>=0&&G[nr+r]>=0&&d[r]<0) jz=false; if(!jz) continue;
      const H=new Int16Array(16*nr).fill(-1); let good=true, pairs=0, rep=0; for(let r=0;r<nr&&good;r++) for(let k=0;k<14;k++){ const a=d[k*nr+r], b=d[(k+1)*nr+r]; if(a<0||b<0) continue; pairs++; const q=a*nr+r; if(H[q]<0) H[q]=b; else if(H[q]!==b){ good=false; break; } else rep++; }
      if(good&&pairs&&rep) jobs.push({kind:2,op,D,Rs,nr,G,d,H,rdig,score:D.cost+15+Rs.length*5}); }
    // (3)
    if(ctx.companion){ const ys=[{e:{t:'k',c:0},v:()=>0},{e:{t:'k',c:1},v:()=>1},...Rs.map((j,q)=>({e:{t:'in',i:j},v:rr=>rr[q]}))];
      const hs=[]; Rs.forEach((j,q)=>{ hs.push({e:{t:'p',p:0,a:[X0,{t:'x',i:1+q}]},f:(y,rr)=>(y+rr[q])&15}); if(SUB) hs.push({e:{t:'p',p:SUB.id,a:[X0,{t:'x',i:1+q}]},f:(y,rr)=>(y-rr[q])&15}); });
      hs.push({e:INC(X0),f:y=>(y+1)&15},{e:{t:'p',p:0,a:[X0,X0]},f:y=>(y*2)&15},{e:{t:'p',p:2,a:[X0]},f:y=>y>>1});
      for(const y0 of ys) for(const h of hs) for(const after of [1,0]){ const F=new Int16Array(256*nr).fill(-1); let good=true, pairs=0, rep=0;
        for(let r=0;r<nr&&good;r++){ const rr=rdig(r); let y=y0.v(rr); for(let k=0;k<15;k++){ const y2=h.f(y,rr); const a=G[k*nr+r], b=G[(k+1)*nr+r]; if(a>=0&&b>=0){ pairs++; const q=(a*16+(after?y2:y))*nr+r; if(F[q]<0) F[q]=b; else if(F[q]!==b){ good=false; break; } else rep++; } y=y2; } }
        if(good&&pairs) jobs.push({kind:3,D,Rs,nr,G,F,rdig,y0,h,after,score:D.cost+30+Rs.length*5+(rep>pairs/8?0:20)}); } } }
  return jobs.sort((a,b)=>a.score-b.score); }
export const inPoolX=K=>inPool(K);
// בסבבים: קודם כל העבודות עם ממלא-טבלה קצר (הפשוטות נמצאות מהר), ואז שוב עם זמן ארוך יותר
function* tRecur(ctx){ const {SUB}=findXS(); const IPd=ctx.IP.filter(d=>!isConst(d.vec)); let jobs=null;
  for(const sms of ctx.recurMs){ yield null; const seen=new Set();
    if(!jobs){ jobs=recurJobs({...ctx,IP:IPd.slice(0,ctx.nDrec),nDrec:ctx.nDrec}); yield null; const more=recurJobs({...ctx,IP:IPd,nDrec:IPd.length}); jobs=[...jobs,...more]; }
    let nj=0; for(const J of jobs){ const k=J.kind+'|'+key(J.D.vec)+'|'+J.Rs.join()+'|'+(J.y0?show(J.y0.e)+show(J.h.e)+J.after:'')+(J.op?J.op.id:''); if(seen.has(k)) continue; seen.add(k); if(++nj>ctx.maxJobs) break;
      yield* recurJob({...ctx,synthMs:sms},J,SUB); if(ctx.out()) return; if(ctx.tick()) yield null; } } }
function* recurJob(ctx,J,SUB){ const mapR=Rs=>i=>({t:'in',i:Rs[i]}); const fit=ctx.fit;
  { const {Rs,nr,G,rdig}=J;
    const Ipts=[]; for(let r=0;r<nr;r++) if(G[r]>=0) Ipts.push({x:rdig(r),w:G[r]}); let I=Rs.length?fit(Ipts,Rs.length,{ms:ctx.synthMs}):(Ipts.every(p=>p.w===Ipts[0].w)?{t:'k',c:Ipts[0].w}:null); if(!I) return; I=subst(I,mapR(Rs));
    const accVar=i=>i===0?{t:'v',i:1}:{t:'in',i:Rs[i-1]};
    if(J.kind===1){ const pts=[]; for(let q=0;q<16*nr;q++) if(J.F[q]>=0) pts.push({x:[Math.floor(q/nr),...rdig(q%nr)],w:J.F[q]}); let F=fit(pts,1+Rs.length,{ms:ctx.synthMs}); if(!F) return; F=subst(F,accVar);
      yield {how:`נסיגה: c=${show(J.D.e)}; r=${show(I)}; חזור c: r=${show(F)}`, nv:2, init:[[0,J.D.e],[1,I]], cond:0, body:[[1,F],[0,DEC({t:'v',i:0})]], post:{t:'v',i:1}}; }
    if(J.kind===2){ const Jp=[]; for(let r=0;r<nr;r++) if(J.d[r]>=0) Jp.push({x:rdig(r),w:J.d[r]}); let J0=Rs.length?fit(Jp,Rs.length,{ms:ctx.synthMs}):(Jp.every(p=>p.w===Jp[0].w)?{t:'k',c:Jp[0].w}:null); if(!J0) return; J0=subst(J0,mapR(Rs));
      const pts=[]; for(let q=0;q<16*nr;q++) if(J.H[q]>=0) pts.push({x:[Math.floor(q/nr),...rdig(q%nr)],w:J.H[q]}); let H=fit(pts,1+Rs.length,{ms:ctx.synthMs}); if(!H) return;
      H=subst(H,i=>i===0?{t:'v',i:2}:{t:'in',i:Rs[i-1]}); const step={t:'p',p:J.op===SUB?0:J.op.id,a:[{t:'v',i:1},{t:'v',i:2}]};
      yield {how:`הפרשים: c=${show(J.D.e)}; r=${show(I)}; x=${show(J0)}; חזור c: r=${show(step)}; x=${show(H)}`, nv:3, init:[[0,J.D.e],[1,I],[2,J0]], cond:0, body:[[1,step],[2,H],[0,DEC({t:'v',i:0})]], post:{t:'v',i:1}}; }
    if(J.kind===3){ const pts=[]; for(let q=0;q<256*nr;q++) if(J.F[q]>=0){ const r=q%nr, ay=Math.floor(q/nr); pts.push({x:[ay>>4,ay&15,...rdig(r)],w:J.F[q]}); }
      let F=fit(pts,2+Rs.length,{ms:ctx.synthMs}); if(!F) return; F=subst(F,i=>i===0?{t:'v',i:1}:i===1?{t:'v',i:2}:{t:'in',i:Rs[i-2]});
      const Hy=subst(J.h.e,i=>i===0?{t:'v',i:2}:{t:'in',i:Rs[i-1]}); const y0=J.y0.e;
      const body=J.after?[[2,Hy],[1,F],[0,DEC({t:'v',i:0})]]:[[1,F],[2,Hy],[0,DEC({t:'v',i:0})]];
      yield {how:`בן-לוויה: c=${show(J.D.e)}; r=${show(I)}; y=${show(y0)}; חזור c: ${J.after?'y='+show(Hy)+'; r='+show(F):'r='+show(F)+'; y='+show(Hy)}`, nv:3, init:[[0,J.D.e],[1,I],[2,y0]], cond:0, body, post:{t:'v',i:1}}; } } }
// ו. נהג+צובר: x=I; r=A0; חזור K פעמים (או עד x=0): r=B(V1(r),V2(x)); x=H(x)
function* tDriver(ctx){ const {T,N,IP,U}=ctx; const perm=shuffled(N); const t0=now();
  const small=U.filter(u=>u.e.t==='p'&&!isConst(u.T)).slice(0,ctx.nH); const V1=[{T:Uint8Array.from({length:16},(_,i)=>i),e:X0},...small.slice(0,ctx.nV1)];
  const V2=[{T:Uint8Array.from({length:16},(_,i)=>i),e:X0},...U.filter(u=>u.e.t==='p'&&!isConst(u.T)).slice(0,ctx.nV2)];
  // לוחות F(r,x) — בלי כפילויות
  const Fs=new Map(); for(const p of PR) if(p.k===2&&(p.basic||p.len<=40)) for(const a of V1) for(const b of V2){ const F=new Uint8Array(256); let bad=false; for(let r=0;r<16&&!bad;r++) for(let x=0;x<16;x++){ const v=p.T[(a.T[r]<<4)|b.T[x]]; if(v===255){ bad=true; break; } F[r*16+x]=v; } if(bad) continue;
      const k=key(F); if(!Fs.has(k)) Fs.set(k,{F,e:{t:'p',p:p.id,a:[subst(a.e,()=>({t:'x',i:0})),subst(b.e,()=>({t:'x',i:1}))]}}); if(Fs.size>ctx.maxF) break; }
  const FL=[...Fs.values()];
  const Is=IP.filter(x=>!isConst(x.vec)).slice(0,ctx.nI2), A0=IP.filter(x=>isConst(x.vec)&&x.vec[0]===0).concat(IP.filter(x=>x.e.t==='in')).slice(0,4);
  const xs=new Uint8Array(17);
  for(const I of Is) for(const h of small.slice(0,ctx.nH)) for(const Kc of [0,4,1,2,3,5,6,7,8]){ if(ctx.out()) return; if(ctx.tick()) yield null;
    // לכל דוגמה: מסלול הנהג (עד 16 צעדים)
    const traj=[]; let okT=true; for(let q=0;q<Math.min(N,64);q++){ const i=perm[q]; let x=I.vec[i]; const tr=[]; if(Kc===0){ while(x!==0&&tr.length<17){ tr.push(x); x=h.T[x]; } if(x!==0){ okT=false; break; } } else for(let k=0;k<Kc;k++){ tr.push(x); x=h.T[x]; } traj.push(tr); } if(!okT) continue;
    if(Kc===0&&traj.every(t=>t.length<=1)) continue;
    for(const A of A0) for(const f of FL){ let q=0; for(;q<traj.length;q++){ const i=perm[q]; let r=A.vec[i]; const tr=traj[q]; for(let k=0;k<tr.length;k++) r=f.F[r*16+tr[k]]; if(r!==T[i]) break; }
      if(q<traj.length) continue;
      const step=subst(f.e,i=>({t:'v',i:i===0?1:2})); const H=subst(h.e,()=>({t:'v',i:2}));
      if(Kc===0) yield {how:`נהג+צובר: x=${show(I.e)}; r=${show(A.e)}; עד x=0: r=${show(step)}; x=${show(H)}`, nv:3, init:[[2,I.e],[1,A.e]], cond:2, body:[[1,step],[2,H]], post:{t:'v',i:1}};
      else yield {how:`נהג+צובר: x=${show(I.e)}; r=${show(A.e)}; חזור ${Kc}: r=${show(step)}; x=${show(H)}`, nv:3, init:[[0,{t:'k',c:Kc}],[2,I.e],[1,A.e]], cond:0, body:[[1,step],[2,H],[0,DEC({t:'v',i:0})]], post:{t:'v',i:1}}; } } }

// ─── 10. הוצאת חישוב קבוע מהלולאה: תת-ביטוי בגוף שתלוי רק בקלטים — מחושב פעם אחת לפני הלולאה, למשתנה חדש ─────
export function hoistInvariants(fr){ const init=[...fr.init]; let nv=fr.nv; const memo=new Map();
  const pure=e=>e.t==='in'||e.t==='k'||(e.t==='p'&&e.a.every(pure)); const heavy=e=>e.t==='p'&&!PR[e.p].basic||(e.t==='p'&&e.a.some(heavy));
  const walk=e=>{ if(e.t!=='p') return e; if(pure(e)&&heavy(e)){ const k=show(e); if(!memo.has(k)){ memo.set(k,nv); init.push([nv,e]); nv++; } return {t:'v',i:memo.get(k)}; } return {...e,a:e.a.map(walk)}; };
  const body=fr.body.map(([j,e])=>[j,walk(e)]); if(nv===fr.nv) return fr; return {...fr,nv,init,body}; }

// משתנה שאף אחד לא קורא (בן-לוויה שלא נחוץ) — נמחק עם ההשמות שלו
const varsOf=(e,S)=>{ if(e.t==='v') S.add(e.i); else if(e.t==='p') e.a.forEach(a=>varsOf(a,S)); return S; };
export function dropDead(fr){ const need=new Set([...varsOf(fr.post,new Set())]); if(fr.cond>=0) need.add(fr.cond);
  for(let ch=true;ch;){ ch=false; for(const [j,e] of [...fr.init,...fr.body]) if(need.has(j)) for(const v of varsOf(e,new Set())) if(!need.has(v)){ need.add(v); ch=true; } }
  if([...Array(fr.nv).keys()].every(j=>need.has(j))) return fr;
  const old=[...need].sort((a,b)=>a-b); const m=new Map(old.map((j,i)=>[j,i])); const rn=e=>e.t==='v'?{t:'v',i:m.get(e.i)}:e.t==='p'?{...e,a:e.a.map(rn)}:e;
  return {...fr,nv:old.length,init:fr.init.filter(([j])=>need.has(j)).map(([j,e])=>[m.get(j),rn(e)]),body:fr.body.filter(([j])=>need.has(j)).map(([j,e])=>[m.get(j),rn(e)]),cond:fr.cond>=0?m.get(fr.cond):-1,post:rn(fr.post)}; }

// תיאור קצר של מסגרת (אחרי הניקוי)
export function showFrame(fr){ const a=([j,e])=>`v${j}=${show(e)}`; return `${fr.init.map(a).join('; ')}; ${fr.cond>=0?`כל עוד v${fr.cond}: { ${fr.body.map(a).join('; ')} }; `:''}⇒ ${show(fr.post)}`; }

// ─── 11. הבונה: כל המסגרות בתורות (פלח-זמן לכל אחת, והפלח גדל בכל סבב) ⇒ ערכים על כל הטבלה ⇒ תוכנית ⇒ בודק ─────
export function loopBuild(gen,{ins=[0,1],ms=240000,say=()=>{},only=null}={}){ const t0=now(); loadPrims(); const U=unaryPool();
  const T=fullTable(gen,ins); if(!T) return {prog:null,why:'אין טבלה (התשובה תלויה במשהו מלבד הקלטים)',ms:now()-t0};
  const K=ins.length, N=T.length; const IP=inPool(K); const memo=new Map();
  const ctx={T,N,K,IP,U,out:()=>now()-t0>ms,sliceEnd:0,tick:()=>now()>ctx.sliceEnd,nU:3000,nUw:1e9,nIw:1e9,nI:30,nD:120,nPair:40,maxOnce:60,synthMs:1500,onceMs:4000,nPairInit:12,nDrec:60,maxJobs:3000,companion:true,nH:25,nV1:12,nV2:400,maxF:60000,nI2:12,
    recurMs:[300,1500,6000], onceMsL:[800,4000],
    fit:(pts,nv,o)=>{ const k=nv+'|'+(o.mode||'')+'|'+pts.map(p=>p.x.join(',')+':'+p.w).join(';'); const m=memo.get(k); if(m&&(m.e||m.ms>=o.ms)) return m.e; const r=fit(pts,nv,o); memo.set(k,{e:r,ms:o.ms}); return r; }};
  const chk=makeChecker(gen,300); let tried=0;
  const valueOk=fr=>{ const X=new Array(K); for(let i=0;i<N;i++){ for(let j=0;j<K;j++) X[j]=digit(i,j,K); if(evalFrame(fr,X)!==T[i]) return false; } return true; };
  const TPL=[['ספירה-עד-אפס',tWhileCount],['מונה+אחרי',tCountPost],['זוג',tPair],['פעם-אחת',tOnce],['נהג+צובר',tDriver],['נסיגה',tRecur]].filter(([n])=>!only||only.includes(n));
  const G=TPL.map(([name,tpl])=>({name,it:tpl(ctx),done:false,n:0,ms:0}));
  for(let slice=+process.env.LSLICE||4000; !ctx.out()&&G.some(g=>!g.done); slice*=2){
    for(const g of G){ if(g.done||ctx.out()) continue; ctx.sliceEnd=now()+slice; const t1=now();
      for(;;){ const r=g.it.next(); if(r.done){ g.done=true; break; } const fr0=r.value; if(fr0===null){ if(ctx.tick()||ctx.out()) break; continue; }
        g.n++; tried++; if(!valueOk(fr0)){ if(ctx.tick()||ctx.out()) break; continue; }
        const fr=hoistInvariants(dropDead(fr0)); fr.how=fr0.how.split(':')[0]+': '+showFrame(fr); let prog; try{ prog=compileFrame(fr,ins); }catch(e){ continue; }
        if(!chk(prog)){ say(`  ✗ ${g.name}: עבר בערכים ונפל בבודק — ${fr.how}`); continue; }
        g.ms+=now()-t1; say(`  ✓ ${g.name} (${((now()-t0)/1000).toFixed(1)} שנ׳ מההתחלה): ${fr.how} · ${prog.length} פקודות`);
        return {prog,how:'מסגרת-לולאה: '+fr.how,frame:fr,tpl:g.name,tried,ms:now()-t0}; }
      g.ms+=now()-t1; } }
  say('  · '+G.map(g=>`${g.name}: ${g.n} מועמדים/${(g.ms/1000).toFixed(1)} שנ׳${g.done?'':' (לא נגמר)'}`).join(' · '));
  return {prog:null,why:'אף מסגרת לא התאימה',tried,ms:now()-t0}; }
