// «סורק-קיפול» (רשימה ⇒ מספר): מסגרת שהולכת על הרשימה עם תאי-מצב. בכל צעד כל תא-מצב מתעדכן בכלי-מספר מהמדף
// (או צירוף קטן של כלים) — על האיבר (x), על האיבר הקודם (q), על המקום (i) ועל תאי-מצב קודמים — ובסוף כלי-מספר מעביר את המצב לתשובה.
// המכונה בוחרת את הכלים מהדוגמאות: קודם מדמה את הקיפול ב-JS על לוחות-הערכים של הכלים (מהיר, אלפי מועמדים בשנייה),
// ורק מועמד שעבר — מורכב לקוד-מכונה ונבדק במכונה עצמה. אני כותב רק את המסגרת והחיפוש; מה נכנס לחריצים — מהמדף.
import fs from 'fs'; import { run } from './machine3s.mjs'; import { makeChecker } from './tzoref.mjs';
import { scanTools, shift, dataCells, remap } from './scan-tools.mjs';
const walk=m=>{ const o=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ o.push(a); a=m[a]; } return o; };

// ─── 1. לוחות: הפעלת כלי על וקטורים ─────────────────────────────────────────
function apply(f,args,n){ const out=new Int8Array(n), T=f.T;
  if(f.k===1){ const a=args[0]; for(let t=0;t<n;t++){ const x=a[t]; out[t]=x<0?-1:T[x]; } }
  else if(f.k===2){ const a=args[0], b=args[1]; for(let t=0;t<n;t++){ const x=a[t], y=b[t]; out[t]=(x<0||y<0)?-1:T[(x<<4)|y]; } }
  else { const a=args[0], b=args[1], c=args[2]; for(let t=0;t<n;t++){ const x=a[t], y=b[t], z=c[t]; out[t]=(x<0||y<0||z<0)?-1:T[(x<<8)|(y<<4)|z]; } }
  return out; }
function hashArr(a){ let h1=2166136261|0, h2=5381|0; for(let i=0;i<a.length;i++){ const v=a[i]+2; h1=Math.imul(h1^v,16777619); h2=(Math.imul(h2,33)+v)|0; } return (h1>>>0).toString(36)+':'+(h2>>>0).toString(36)+':'+a.length; }
const V=v=>({v}); const N_=(f,...a)=>({f,a});
export const sizeOf=e=>e.v!=null?0:1+e.a.reduce((s,x)=>s+sizeOf(x),0);
const subst=(e,m)=>e.v!=null?(m[e.v]??e):{f:e.f,a:e.a.map(x=>subst(x,m))};
const usesVar=(e,v)=>e.v!=null?e.v===v:e.a.some(x=>usesVar(x,v));
export const show=e=>e.v!=null?e.v:`${e.f.name}(${e.a.map(show).join(', ')})`;

// סגירות: פונקציות של משתנה אחד (16 כניסות) ושל שניים (r,s — 256 כניסות), עד גודל קטן, בלי כפילויות (לפי הלוח)
let LIB=null, LIBT=0;   // נבנה מחדש אם המדף השתנה (למשל תנאי חדש שנלמד באותה ריצה)
export function lib(){ let mt=0; try{ mt=fs.statSync('shelf3.json').mtimeMs; }catch{} if(LIB&&mt===LIBT) return LIB; LIBT=mt; const {U,B,T}=scanTools(); const Tn=T.filter(t=>!t.name.startsWith('לוגי'));
  // משתנה אחד
  const A16=Int8Array.from({length:16},(_,i)=>i); const UC=[], seenU=new Map();
  const addU=(e,tab)=>{ if(tab.every(v=>v<0)) return; const k=hashArr(tab); if(seenU.has(k)) return; const r={e,tab,size:sizeOf(e)}; seenU.set(k,r); UC.push(r); return r; };
  addU(V('a'),A16); const evU=e=>e.v!=null?A16:apply(e.f,e.a.map(evU),16);
  const lay=[[UC[0]]];
  { const L=[]; for(const f of U){ const e=N_(f,V('a')); const r=addU(e,evU(e)); if(r) L.push(r); } for(const f of B){ const e=N_(f,V('a'),V('a')); const r=addU(e,evU(e)); if(r) L.push(r); } for(const f of Tn){ const e=N_(f,V('a'),V('a'),V('a')); const r=addU(e,evU(e)); if(r) L.push(r); } lay.push(L); }
  for(let s=2;s<=3;s++){ const L=[]; const prev=lay[s-1];
    for(const p of prev){ for(const f of U){ const e=N_(f,p.e); const r=addU(e,apply(f,[p.tab],16)); if(r) L.push(r); }
      for(const f of B){ for(const [x,y,xt,yt] of [[p.e,V('a'),p.tab,A16],[V('a'),p.e,A16,p.tab]]){ const e=N_(f,x,y); const r=addU(e,apply(f,[xt,yt],16)); if(r) L.push(r); } } }
    if(s===3) for(const p of lay[1]) for(const q of lay[1]) if(p!==q) for(const f of B){ const e=N_(f,p.e,q.e); const r=addU(e,apply(f,[p.tab,q.tab],16)); if(r) L.push(r); }
    lay.push(L); }
  // שני משתנים: r (המצב) ו-s (האות שנכנס בצעד)
  const R256=Int8Array.from({length:256},(_,i)=>i>>4), S256=Int8Array.from({length:256},(_,i)=>i&15); const BC=[], seenB=new Map();
  const addB=(e,tab)=>{ if(tab.every(v=>v<0)) return; const k=hashArr(tab); if(seenB.has(k)) return; const r={e,tab,size:sizeOf(e),useR:usesVar(e,'r'),useS:usesVar(e,'s')}; seenB.set(k,r); BC.push(r); return r; };
  const evB=e=>e.v==='r'?R256:e.v==='s'?S256:apply(e.f,e.a.map(evB),256);
  addB(V('s'),S256); const b1=[];
  const vars=[V('r'),V('s')];
  for(const f of U) for(const x of vars){ const e=N_(f,x); const r=addB(e,evB(e)); if(r) b1.push(r); }
  for(const f of B) for(const x of vars) for(const y of vars){ const e=N_(f,x,y); const r=addB(e,evB(e)); if(r) b1.push(r); }
  for(const f of Tn) for(const x of vars) for(const y of vars) for(const z of vars){ const e=N_(f,x,y,z); const r=addB(e,evB(e)); if(r) b1.push(r); }
  const nB1=BC.length;
  for(const p of b1){ for(const f of U){ const e=N_(f,p.e); addB(e,apply(f,[p.tab],256)); }
    for(const f of B) for(const x of vars){ const xt=x.v==='r'?R256:S256; addB(N_(f,p.e,x),apply(f,[p.tab,xt],256)); addB(N_(f,x,p.e),apply(f,[xt,p.tab],256)); } }
  for(const u of lay[2]) addB(subst(u.e,{a:V('r')}),Int8Array.from({length:256},(_,i)=>u.tab[i>>4]));   // מונים: פונקציה של המצב בלבד
  // «צובר»: F שהסדר לא משנה לו — F(F(r,a),b)=F(F(r,b),a) (סכום, מקסימום, ספירה…) + «האחרון» (r ⇐ s). תא-התשובה ברמות של שני תאים הוא צובר.
  for(const b of BC.slice(0,nB1)){ if(!b.useR||!b.useS){ b.agg=b.e.v==='s'; b.last=b.agg; continue; } let ok=true; const T=b.tab;
    for(let r=0;r<16&&ok;r++) for(let a=0;a<16&&ok;a++) for(let c=0;c<16;c++){ const x=T[(r<<4)|a], y=T[(r<<4)|c]; if(x<0||y<0) continue; const u=T[(x<<4)|c], v=T[(y<<4)|a]; if(u>=0&&v>=0&&u!==v){ ok=false; break; } } b.agg=ok; }
  // מפתח לכלי-הסיום: לכל (ערך, תשובה) — אילו פונקציות של משתנה אחד נותנות אותה (מערך-ביטים), כדי למצוא מהר את הראשונה שמתאימה
  const W32=Math.ceil(UC.length/32); const IDX=Array.from({length:256},()=>new Uint32Array(W32));
  UC.forEach((u,j)=>{ for(let v=0;v<16;v++){ const w=u.tab[v]; if(w>=0) IDX[(v<<4)|w][j>>5]|=1<<(j&31); } });
  LIB={U,B,T,Tn,UC,BC,nB1,IDX,W32}; return LIB; }

// ─── 2. דוגמאות ⇒ זרמים: לכל צעד — x (האיבר), q (הקודם), i (המקום) ──────────────
// passes: 1 = מעבר אחד; 'n' = המעבר חוזר n פעמים (n = אורך הרשימה) — «עד שמתייצב», בלי לשנות את הרשימה
function context(lists,passes){ let S=0; for(const l of lists) S+=passes===1?l.length:l.length*l.length;
  const X=new Int8Array(S), Q=new Int8Array(S), I=new Int8Array(S), st=new Int32Array(lists.length+1); let t=0;
  lists.forEach((l,e)=>{ st[e]=t; let q=0, i=0; const P=passes===1?1:l.length; for(let p=0;p<P;p++) for(const x of l){ X[t]=x; Q[t]=q; I[t]=i&15; q=x; i++; t++; } }); st[lists.length]=t;
  return {S,X,Q,I,st,n:lists.length,passes}; }
// מצב שמתעדכן: r ⇐ F(r, s) — מחזיר את הזרם הישן, החדש, והערך בסוף (לרשימה ריקה: ההתחלה)
function track(F,s,c,cx){ const {S,st,n}=cx; const old=new Int8Array(S), nw=new Int8Array(S), fin=new Int8Array(n);
  for(let e=0;e<n;e++){ let r=c; for(let t=st[e];t<st[e+1];t++){ old[t]=r; r=F[(r<<4)|s[t]]; if(r<0) return null; nw[t]=r; } fin[e]=r; } return {old,nw,fin}; }
// האם r ⇐ F(r,s) מההתחלה c נותן בסוף ערך שקובע את התשובה? (כל ערך-סוף ⇒ תשובה אחת) — ממלא map
const MV_=new Int8Array(16), MG_=new Int32Array(16); let GEN_=0;
const out_=(map,g)=>{ for(let v=0;v<16;v++) map[v]=MG_[v]===g?MV_[v]:-1; return true; };
function fits(F,s,c,cx,want,map){ const g=++GEN_; const st=cx.st, n=cx.n;
  for(let e=0;e<n;e++){ let r=c; for(let t=st[e],z=st[e+1];t<z;t++){ r=F[(r<<4)|s[t]]; if(r<0) return false; } const w=want[e]; if(MG_[r]!==g){ MG_[r]=g; MV_[r]=w; } else if(MV_[r]!==w) return false; } return out_(map,g); }
function fits3(F,a,b,pos,c,cx,want,map){ const g=++GEN_; const st=cx.st, n=cx.n;   // F בעל שלוש כניסות; המצב בכניסה pos, a ו-b בשתי האחרות (בסדר)
  for(let e=0;e<n;e++){ let r=c; for(let t=st[e],z=st[e+1];t<z;t++){ const x=a[t], y=b[t]; r=pos===0?F[(r<<8)|(x<<4)|y]:pos===1?F[(x<<8)|(r<<4)|y]:F[(x<<8)|(y<<4)|r]; if(r<0) return false; } const w=want[e]; if(MG_[r]!==g){ MG_[r]=g; MV_[r]=w; } else if(MV_[r]!==w) return false; } return out_(map,g); }
// כלי-סיום: פונקציה של משתנה אחד שמתאימה לכל הזוגות (ערך-סוף ⇒ תשובה)
function findG(map){ const {UC,IDX,W32}=lib(); let id=true; for(let v=0;v<16;v++) if(map[v]>=0&&map[v]!==v){ id=false; break; } if(id) return UC[0];
  const keys=[]; for(let v=0;v<16;v++) if(map[v]>=0) keys.push((v<<4)|map[v]);
  for(let w=0;w<W32;w++){ let m=0xffffffff; for(const k of keys){ m&=IDX[k][w]; if(!m) break; } if(m){ return UC[(w<<5)+(31-Math.clz32(m&-m))]; } } return null; }

// זרמי-אותות: ביטויים קטנים מעל משתנים (x,q,i,…) — בלי כפילויות, בלי «לא ידוע»
function signals(atoms,cx,maxSize,tern=true){ const {U,B,Tn}=lib(); const out=[], seen=new Set(); const S=cx.S;
  const add=(e,s)=>{ for(let t=0;t<S;t++) if(s[t]<0) return null; const k=hashArr(s); if(seen.has(k)) return null; seen.add(k); const r={e,s,size:sizeOf(e)}; out.push(r); return r; };
  for(const a of atoms) add(a.e,a.s); const l1=[];
  for(const a of atoms){ for(const f of U){ const r=add(N_(f,a.e),apply(f,[a.s],S)); if(r) l1.push(r); } }
  for(const a of atoms) for(const b of atoms){ if(a===b) continue; for(const f of B){ const r=add(N_(f,a.e,b.e),apply(f,[a.s,b.s],S)); if(r) l1.push(r); } }
  if(tern&&atoms.length>=3) for(const a of atoms) for(const b of atoms) for(const c of atoms){ if(a===b||b===c||a===c) continue; for(const f of Tn){ const r=add(N_(f,a.e,b.e,c.e),apply(f,[a.s,b.s,c.s],S)); if(r) l1.push(r); } }
  if(maxSize>=2) for(const p of l1){ for(const f of U) add(N_(f,p.e),apply(f,[p.s],S)); for(const a of atoms) for(const f of B){ add(N_(f,p.e,a.e),apply(f,[p.s,a.s],S)); add(N_(f,a.e,p.e),apply(f,[a.s,p.s],S)); } }
  return out; }

// תנאי-הכרחי לאות, לפני כל צובר: צובר שהסדר לא משנה לו רואה רק את «שקית» הערכים של כל דוגמה; «האחרון» רואה רק את הערך האחרון.
// אם שתי דוגמאות עם אותה שקית (אותו אחרון) צריכות תשובות שונות — אף צובר לא יציל את האות הזה.
const HW=Uint32Array.from({length:16},(_,v)=>(Math.imul(v+1,2654435761)^0x9e3779b9)>>>0);
function bagOk(s,cx,want,last){ const m=new Map(); const st=cx.st; for(let e=0;e<cx.n;e++){ let k=0; if(last){ k=st[e+1]>st[e]?s[st[e+1]-1]+1:0; } else { let h=0; for(let t=st[e];t<st[e+1];t++) h=(h+HW[s[t]])>>>0; k=h*16+(st[e+1]-st[e]); }
    const w=m.get(k); if(w===undefined) m.set(k,want[e]); else if(w!==want[e]) return false; } return true; }
// ─── 3. תוכנית-קיפול ⇒ סימולציה ב-JS (לבדיקה על דוגמאות חדשות) ─────────────────
function evalS(e,env){ if(e.v!=null) return env[e.v]; const a=e.a.map(x=>evalS(x,env)); if(a.some(x=>x<0)) return -1; const T=e.f.T; return e.f.k===1?T[a[0]]:e.f.k===2?T[(a[0]<<4)|a[1]]:T[(a[0]<<8)|(a[1]<<4)|a[2]]; }
export function simPlan(plan,l){ const R={}; for(const g of plan.regs) R[g.name]=g.init; let q=0, i=0; const P=plan.passes===1?1:l.length;
  for(let p=0;p<P;p++) for(const x of l){ const env={x,q,i:i&15}; for(const g of plan.regs){ env[g.name+'o']=R[g.name]; }
    for(const g of plan.regs){ env.self=R[g.name]; const v=evalS(g.upd,env); if(v<0) return -1; R[g.name]=v; env[g.name+'n']=v; } q=x; i++; }
  return evalS(plan.final,R); }

// ─── 4. קוד-מכונה: המסגרת + הכלים במקומם ────────────────────────────────────
const G_=c=>[['WHERE',c],['GO']], T_=c=>[['WHERE',c],['GO'],['TAKE']], P_=c=>[['WHERE',c],['GO'],['PUT']], MV=(a,b)=>[...T_(a),...P_(b)];
const P15=['TAKE','TAKE','CALC','TAKE','CALC'].map(o=>[o]);   // NAND(NAND(v,v),v)=15 מכל תא
// קבועים: החיפוש הקצר ביותר (רוחב) מ-15 עם «הזז ימינה», «חבר», «לא-וגם»
const CONST=(()=>{ const best=new Array(16).fill(null); const q=[{st:[],code:[]}]; const seen=new Set(['']);
  while(q.length){ const n=q.shift(); if(n.st.length===1&&!best[n.st[0]]) best[n.st[0]]=n.code; if(best.every(Boolean)) break; const nx=[];
    if(n.st.length<3) nx.push({st:[...n.st,15],code:[...n.code,...P15]});
    if(n.st.length>=1) nx.push({st:[...n.st.slice(0,-1),n.st.at(-1)>>1],code:[...n.code,['SHR']]});
    if(n.st.length>=2){ const a=n.st.at(-2), b=n.st.at(-1); nx.push({st:[...n.st.slice(0,-2),(a+b)&15],code:[...n.code,['ADD']]}); nx.push({st:[...n.st.slice(0,-2),~(a&b)&15],code:[...n.code,['CALC']]}); }
    for(const m of nx){ const k=m.st.join(','); if(seen.has(k)||m.code.length>40) continue; seen.add(k); q.push(m); } q.sort((a,b)=>a.code.length-b.code.length); }
  return best; })();
function assemble(parts){ const out=[], lab={}, fix=[]; for(const x of parts){ if(typeof x==='string'){ lab[x]=out.length; continue; } if(x.code){ out.push(...shift(x.code,out.length)); continue; } if(x[0]==='J'){ fix.push([out.length,x[1]]); out.push(null,['JUMP']); continue; } out.push(x); }
  for(const [i,l] of fix){ if(lab[l]==null) throw new Error('תווית חסרה '+l); out[i]=['WHERE',lab[l],'code']; } return out; }
// כלי במקום: כניסות ⇒ תאי-הארגומנטים, יציאה ⇒ out, תאי-עבודה ⇒ תאים פנויים; אם אין — שומרים תאים חיים במחסנית סביבו
function callTool(f,argCells,outCell,live){ const map={}; f.ins.forEach((c,j)=>{ map[c]=argCells[j]; }); map[f.out]=outCell; const taken=new Set([...argCells,outCell]);
  const scratch=dataCells(f.prog).filter(c=>map[c]==null); const free=[0,1,2,3,4,5,6,7].filter(c=>!taken.has(c)&&!live.has(c)); const busy=[0,1,2,3,4,5,6,7].filter(c=>!taken.has(c)&&live.has(c)); const save=[];
  for(const c of scratch){ if(free.length) map[c]=free.shift(); else if(busy.length){ const b=busy.shift(); map[c]=b; save.push(b); } else return null; }
  const pre=save.flatMap(c=>T_(c)), post=[...save].reverse().flatMap(c=>P_(c));
  return [...pre,{code:[['WHERE',0],['GO'],...shift(remap(f.prog,map),2)]},...post]; }
export function codegen(plan){ const regs=plan.regs; const allE=[...regs.map(g=>g.upd),plan.final]; const uses=v=>allE.some(e=>usesVar(e,v));
  const needQ=uses('q'), needI=uses('i'), multi=plan.passes!==1; const X=3; const pool=[2,4,5,6,7,0]; if(!multi) pool.push(1);
  const cell={}; const take=pref=>{ const j=pref!=null&&pool.includes(pref)?pool.indexOf(pref):0; if(j<0||!pool.length) throw new Error('אין תאים'); return pool.splice(j,1)[0]; };
  // תא התשובה (2) — לתא-המצב שהוא התשובה עצמה
  if(plan.final.v!=null) cell[plan.final.v]=take(2);
  for(const g of regs) if(cell[g.name]==null) cell[g.name]=take(null);
  // ערך ישן של מצב שמתעדכן לפני שמצב מאוחר קורא אותו — עותק בתחילת הצעד; התא משתחרר אחרי הקריאה האחרונה
  const countV=(e,v)=>e.v!=null?(e.v===v?1:0):e.a.reduce((s,x)=>s+countV(x,v),0);
  const oldCell={}, oldUses={}; regs.forEach((g,k)=>{ const n=regs.slice(k+1).reduce((s,h)=>s+countV(h.upd,g.name+'o'),0); if(n){ oldCell[g.name]=take(); oldUses[g.name]=n; } });
  if(needQ) cell.q=take(); if(needI) cell.i=take(); const Y=multi?take():null;
  const fixed=new Set([X,...Object.values(cell),...(Y!=null?[Y]:[]),...(multi?[1]:[])]); const liveOld=new Set(Object.values(oldCell));
  const varCell=(v,k)=>{ if(v==='x') return X; if(v==='q') return cell.q; if(v==='i') return cell.i; if(v==='self') return cell[regs[k].name];
    const m=v.match(/^(r\d+)([on])$/); if(m){ const j=regs.findIndex(g=>g.name===m[1]); if(m[2]==='n') return cell[m[1]]; if(j<k){ oldUses[m[1]]--; return oldCell[m[1]]; } return cell[m[1]]; } if(cell[v]!=null) return cell[v]; throw new Error('משתנה '+v); };
  const code=[]; const tempsLive=new Set(); const released=[];
  const tmp=()=>{ const t=pool.shift(); if(t==null) throw new Error('אין תא זמני'); return t; };
  const evalE=(e,k)=>{ if(e.v!=null) return varCell(e.v,k); const args=e.a.map(x=>evalE(x,k)); const fresh=[];
    // ארגומנט כפול באותו תא — מעתיקים לתא זמני (כלי לא אמור לקבל את אותו תא פעמיים)
    for(let j=0;j<args.length;j++) if(args.indexOf(args[j])!==j){ const t=tmp(); code.push(...MV(args[j],t)); args[j]=t; tempsLive.add(t); fresh.push(t); }
    const t=tmp(); const live=new Set([...fixed,...liveOld,...tempsLive]); const c=callTool(e.f,args,t,live); if(!c) throw new Error('אין מקום לכלי'); code.push(...c);
    for(const a of [...args,...fresh]) if(tempsLive.has(a)){ tempsLive.delete(a); pool.unshift(a); }
    for(const [nm,oc] of Object.entries(oldCell)) if(liveOld.has(oc)&&oldUses[nm]===0&&args.includes(oc)){ liveOld.delete(oc); pool.unshift(oc); released.push(oc); }
    tempsLive.add(t); return t; };
  const parts=[];
  // התחלה: ערכי-התחלה לתאי-המצב
  for(const g of regs) parts.push(...G_(X),...CONST[g.init],...P_(cell[g.name]));
  if(needQ) parts.push(...G_(X),...CONST[0],...P_(cell.q)); if(needI) parts.push(...G_(X),...CONST[0],...P_(cell.i));
  // גוף הצעד
  const body=[]; for(const [nm,oc] of Object.entries(oldCell)) body.push(...MV(cell[nm],oc));
  regs.forEach((g,k)=>{ code.length=0; const t=evalE(g.upd,k); body.push(...code); if(t!==cell[g.name]) body.push(...MV(t,cell[g.name])); if(tempsLive.has(t)){ tempsLive.delete(t); pool.unshift(t); } });
  if(needQ) body.push(...MV(X,cell.q)); if(needI) body.push(...T_(cell.i),...P15,['SHR'],['SHR'],['SHR'],['ADD'],...P_(cell.i));
  body.push(...T_(X),['WHERE@'],['GO'],['TAKE'],...P_(X));   // x ⇐ הבא
  // סיום: כלי-הסיום לתא 2
  code.length=0; const fin=plan.final.v!=null?cell[plan.final.v]:evalE(plan.final,regs.length); const finCode=[...code]; if(fin!==2) finCode.push(...MV(fin,2));
  if(!multi) parts.unshift(...T_(1),...T_(1),...P_(X));   // x ⇐ הראש; ראש-הרשימה נשמר במחסנית לאורך כל הלולאה (ותא 1 משמש כתא רגיל)
  const loop=[...(multi?[...T_(1),...P_(X)]:[]),'LOOP',...T_(X),['J','BODY'],...T_(X),...P15.slice(1),['J',multi?'NEXT':'END'],'BODY',...body,...T_(X),...P15.slice(1),['J','LOOP']];
  let all; if(!multi) all=[...parts,...loop,'END',...finCode,...P_(1)];
  else all=[...parts,...T_(1),...P_(Y),'OUTER',...T_(Y),['J','OB'],...T_(Y),...P15.slice(1),['J','END'],'OB',...loop,'NEXT',...T_(Y),['WHERE@'],['GO'],['TAKE'],...P_(Y),...T_(Y),...P15.slice(1),['J','OUTER'],'END',...finCode];
  return assemble(all); }
// הערה: T_(X) ואחריו P15.slice(1) = TAKE (מ-T_) + TAKE CALC TAKE CALC ⇒ 15 — «קפוץ תמיד»

// ─── 5. החיפוש ───────────────────────────────────────────────────────────────
// רמות, מהזולה ליקרה (הראשונה שעוברת את כל הבדיקות — מנצחת):
//  A  תא אחד:  r ⇐ F(r, s) — F כלי אחד, s אות קטן מ-x/q/i ; מעבר אחד, ואחר כך n מעברים («עד שמתייצב»)
//  B  שני תאים: r1 מצב-עזר פשוט (F כלי אחד על x/q/i, או מונה) ⇒ r2 ⇐ צובר(r2, s), s אות שתלוי ב-r1 (ישן/חדש) ובאיבר
//  C  תא אחד, צירופים גדולים יותר: F צירוף של שני כלים, או s צירוף של שני כלים
//  D  שני תאים: מצב-עזר עם אות (r1 ⇐ F(r1, s)) ⇒ r2 ⇐ צובר(r2, r1)
//  E  שני תאים, תא-התשובה עם שלוש כניסות: r2 ⇐ T(…, r2, …) (למשל «אם [תנאי] אז [מקום] אחרת r2»)
//  F  שני תאים: מצב-עזר מצירוף של שני כלים ⇒ r2 ⇐ צובר(r2, r1)
//  G  דגל: כשהתשובה היא «כן/לא» — שני מצבי-עזר פשוטים, «אירוע» מכל אחד (למשל «שיא חדש»), ודגל f ⇐ לוגי(f, א, ב)
//     (כל 256 הלוגיות של שלוש כניסות — כל מכונת-מצבים של ביט אחד על שני אירועים)
export function describe(plan){ return (plan.passes===1?'':'[n מעברים] ')+plan.regs.map(g=>`${g.name}⇐${show(g.upd)} (מ-${g.init})`).join(' ; ')+' ⇒ '+show(plan.final); }
export function* scanPlans(gen,{N=48,levels=null,say=()=>{},deadline=Infinity}={}){ const L=lib(); const late=()=>Date.now()>deadline; const ex=Array.from({length:N},()=>gen()); const lists0=ex.map(e=>walk(e.mem));
  // הדוגמאות הארוכות קודם — שם נופלים מהר
  const ord=lists0.map((l,i)=>i).sort((a,b)=>lists0[b].length-lists0[a].length); const lists=ord.map(i=>lists0[i]), W=Int8Array.from(ord.map(i=>ex[i].want));
  const map=new Int8Array(16); const BC1=L.BC.slice(0,L.nB1).filter(b=>b.useR||b.useS), BC2=L.BC.slice(L.nB1).filter(b=>b.useR||b.useS);
  const AGG=BC1.filter(b=>b.agg), CNT=L.BC.filter(b=>b.useR&&!b.useS);
  const finalOf=(name,m)=>{ const g=findG(m); return g?{e:subst(g.e,{a:V(name)}),size:g.size}:null; };
  const atom=(cx,v)=>({e:V(v),s:v==='x'?cx.X:v==='q'?cx.Q:cx.I,size:0});
  const CX={1:context(lists,1),n:context(lists,'n')}; const SIG={}; const sigOf=(p,k)=>SIG[p+k]||(SIG[p+k]=signals(['x','q','i'].map(v=>atom(CX[p],v)),CX[p],k));
  const one=function*(cx,Fs,sigs){ for(const F of Fs){ if(late()) return; for(const s of sigs){ if(!F.useS&&s!==sigs[0]) continue;
      for(let c=0;c<16;c++){ if(!fits(F.tab,s.s,c,cx,W,map)) continue; const fin=finalOf('r1',map); if(!fin) continue;
        yield {passes:cx.passes,regs:[{name:'r1',init:c,upd:subst(F.e,{r:V('self'),s:s.e})}],final:fin.e}; } } } };
  // מצבי-עזר: כל צירוף (F, s, התחלה) ⇒ הזרם שלו; זרמים זהים בכל הדוגמאות — נשאר אחד (הזול)
  const trackers=(cx,list,inits)=>{ const out=[], seen=new Set([hashArr(cx.X),hashArr(cx.Q),hashArr(cx.I)]); for(const [F,s] of list) for(const c of inits){ const r=track(F.tab,s.s,c,cx); if(!r) continue;
      if(seen.has(hashArr(r.nw))||seen.has(hashArr(r.old))||r.nw.every(v=>v===r.nw[0])) continue;   // מצב-עזר שהוא בעצם x / q / i / קבוע — לא מוסיף כלום
      const k=hashArr(r.old)+hashArr(r.fin); if(seen.has(k)) continue; seen.add(k); out.push({F,s,c,r,cost:F.size+s.size+(c?0.5:0)}); }
    out.sort((a,b)=>a.cost-b.cost); return out; };
  const pairs=(Fs,sigs)=>{ const o=[]; for(const F of Fs){ if(!F.useS){ o.push([F,sigs[0]]); continue; } for(const s of sigs) o.push([F,s]); } return o; };
  const r1Of=tr=>({name:'r1',init:tr.c,upd:subst(tr.F.e,{r:V('self'),s:tr.s.e})});
  const atoms2=(cx,tr)=>[atom(cx,'x'),atom(cx,'q'),atom(cx,'i'),{e:V('r1o'),s:tr.r.old,size:0},{e:V('r1n'),s:tr.r.nw,size:0}];
  const two=function*(cx,tr,Fs,sigs){ const r1=r1Of(tr); for(const s of sigs){ const bag=bagOk(s.s,cx,W,false), lst=bagOk(s.s,cx,W,true); if(!bag&&!lst) continue;
    for(const F of Fs){ if(F.last?!lst:!bag) continue; for(let c=0;c<16;c++){ if(!fits(F.tab,s.s,c,cx,W,map)) continue; const fin=finalOf('r2',map); if(!fin) continue;
      yield {passes:cx.passes,regs:[r1,{name:'r2',init:c,upd:subst(F.e,{r:V('self'),s:s.e})}],final:fin.e}; } } } };
  const LV=levels||['A','B','C1','D','C2a','E','F','G','C2b'];
  for(const lv of LV){ if(late()){ say('נגמר הזמן'); return; } const t0=Date.now(); say('רמה '+lv);
    if(lv==='A') for(const p of [1,'n']) yield* one(CX[p],BC1,sigOf(p,1));
    if(lv==='C'||lv==='C1') for(const p of [1,'n']) yield* one(CX[p],BC2,sigOf(p,1).filter(s=>s.size===0));
    // C2a: אות בגודל 2 שתלוי רק באיבר (תכונה של x) ; C2b: כל שאר האותות בגודל 2 (יקר — בסוף)
    if(lv==='C'||lv==='C2a') for(const p of [1,'n']){ const s2=signals([atom(CX[p],'x')],CX[p],2).filter(s=>s.size===2); say(`  תכונות-איבר בגודל 2 (${p}): ${s2.length}`); yield* one(CX[p],BC1,s2); }
    if(lv==='C'||lv==='C2b') for(const p of [1,'n']){ const s2=sigOf(p,2).filter(s=>s.size===2&&(usesVar(s.e,'q')||usesVar(s.e,'i'))); say(`  אותות בגודל 2 (${p}): ${s2.length}`); yield* one(CX[p],BC1,s2); }
    if(lv==='B'||lv==='D'||lv==='E'||lv==='F'){ const cx=CX[1]; const s1=sigOf(1,1), sA=s1.filter(s=>s.size===0);
      const isEv=s=>{ let a=-1,b=-1; for(let t=0;t<s.s.length;t++){ const v=s.s[t]; if(v===a||v===b) continue; if(a<0) a=v; else if(b<0) b=v; else return false; } return b>=0; };   // «אירוע»: אות עם שני ערכים בלבד
      const sEv=s1.filter(s=>s.size===1&&isEv(s));
      const trk=lv==='B'?trackers(cx,[...pairs(BC1,sA),...pairs(CNT,sA)],[0,15,1,8]):lv==='E'?trackers(cx,pairs(BC1,sA.slice(0,1)),[0,15]):lv==='D'?trackers(cx,[...pairs(BC1,s1),...pairs(CNT,sA)],[0,15,1,8]):trackers(cx,pairs(BC2.filter(b=>b.useS),sEv),[0,15]);
      say(`  מצבי-עזר: ${trk.length} (${Date.now()-t0}ms)`);
      for(const tr of trk){ if(late()) return; const at=atoms2(cx,tr);
        if(lv==='B'){ const sig=signals(at,cx,1,false).filter(s=>usesVar(s.e,'r1o')||usesVar(s.e,'r1n')); yield* two(cx,tr,AGG,sig); }
        if(lv==='D'||lv==='F') yield* two(cx,tr,AGG,at.slice(3));
        if(lv==='E'){ const sig=signals(at,cx,1,false).filter(s=>(usesVar(s.e,'r1o')||usesVar(s.e,'r1n'))&&isEv(s)); const r1=r1Of(tr);
          for(const f of L.Tn) for(let pos=0;pos<3;pos++) for(const a of sig) for(const b of at){ for(const [A1,B1] of [[a,b],[b,a]]){ if(A1===B1) continue;
            for(let c=0;c<16;c++){ if(!fits3(f.T,A1.s,B1.s,pos,c,cx,W,map)) continue; const fin=finalOf('r2',map); if(!fin) continue;
              const args=[A1.e,B1.e]; args.splice(pos,0,V('self')); yield {passes:1,regs:[r1,{name:'r2',init:c,upd:N_(f,...args)}],final:fin.e}; } } } } } }
    if(lv==='G'&&new Set(W).size<=2){ const cx=CX[1]; const isEv=s=>{ let a=-1,b=-1; for(let t=0;t<s.s.length;t++){ const v=s.s[t]; if(v===a||v===b) continue; if(a<0) a=v; else if(b<0) b=v; else return false; } return b>=0; };
      const sA=sigOf(1,1).filter(s=>s.size===0); const trk=trackers(cx,pairs(BC1,sA.slice(0,1)),[0,15]);
      // האירועים: מהאיבר/הקודם/המקום לבד, ו«x מול מצב-עזר» (כלי אחד על x ועל הערך הישן/החדש) — בלי כפילויות (לפי הזרם)
      const ev=[], seenE=new Set(); const addE=(s,tr)=>{ if(!isEv(s)) return; const k=hashArr(s.s); if(seenE.has(k)) return; seenE.add(k); ev.push({...s,tr}); };
      for(const s of sigOf(1,1)) if(s.size===1) addE(s,null);
      for(const tr of trk){ const at=atoms2(cx,tr); for(const r of at.slice(3)) for(const f of L.B){ addE({e:N_(f,at[0].e,r.e),s:apply(f,[at[0].s,r.s],cx.S),size:1},tr); addE({e:N_(f,r.e,at[0].e),s:apply(f,[r.s,at[0].s],cx.S),size:1},tr); } }
      say(`  אירועים: ${ev.length} (מ-${trk.length} מצבי-עזר)`); const LG=L.T.filter(t=>t.name.startsWith('לוגי'));
      const ren=(e,k)=>subst(e,{r1o:V(k+'o'),r1n:V(k+'n')});
      for(let j=1;j<ev.length;j++) for(let i=0;i<j;i++){ const a=ev[i], b=ev[j]; if(late()||Date.now()-t0>(+process.env.SCANG||90000)) break;   // סדר אלכסוני: הזולים קודם
        for(const f of LG) for(const c of [0,15]){ if(!fits3(f.T,a.s,b.s,0,c,cx,W,map)) continue; const fin=finalOf('f',map); if(!fin) continue;
          const regs=[]; let ea=a.e, eb=b.e;
          if(a.tr){ regs.push({...r1Of(a.tr),name:'r1'}); } if(b.tr){ if(a.tr&&a.tr===b.tr){ /* אותו מצב-עזר */ } else { const nm=a.tr?'r2':'r1'; regs.push({...r1Of(b.tr),name:nm}); eb=ren(b.e,nm); } }
          regs.push({name:'f',init:c,upd:N_(f,V('self'),ea,eb)}); yield {passes:1,regs,final:fin.e}; } } }
    say(`  רמה ${lv} נגמרה (${Date.now()-t0}ms)`); } }
// המרכיב: מועמד מהסימולציה ⇒ בדיקה על דוגמאות חדשות ב-JS ⇒ קוד ⇒ בודק המכונה
export function scanCompose(gen,{ms=+process.env.SCANMS||240000,say=()=>{},levels=null}={}){ const T0=Date.now(); const chk=makeChecker(gen,300,50000);   // אותו גבול-צעדים כמו בבדיקה הסופית
  const fresh=Array.from({length:600},()=>gen()).map(e=>({l:walk(e.mem),w:e.want,e})); let n=0, nv=0;
  for(const plan of scanPlans(gen,{say,levels,deadline:T0+ms})){ n++; if(Date.now()-T0>ms) return {prog:null,timeout:true,cands:n};
    if(!fresh.every(f=>simPlan(plan,f.l)===f.w)) continue; nv++;
    let prog; try{ prog=codegen(plan); }catch(err){ say('  קוד: '+err.message+' · '+describe(plan)); continue; }
    const bad=fresh.slice(0,60).filter(f=>{ const r=run(prog,f.e.mem,{maxSteps:50000}); return !r||r.st.length||r.mem[2]!==f.w; }).length;
    if(bad){ say(`  ✗ במכונה (${bad}/60): ${describe(plan)}`); continue; }
    if(chk(prog)) return {prog,how:'קיפול: '+describe(plan),cands:n,valid:nv,ms:Date.now()-T0};
    say('  ✗ בבודק: '+describe(plan)); }
  return {prog:null,cands:n,valid:nv,timeout:Date.now()-T0>ms}; }
