// «מצב-רחב» (wideframes.mjs): מספרים מעל 15 בשני תאים — נמוך (L) + גבוה (H), כמו מונה של שתי ספרות.
// המסגרת סופרת ביחידות: «ועוד 1» לנמוך, וכשהוא חוזר ל-0 — «ועוד 1» לגבוה (נשא); «פחות 1» לנמוך, וכשהיה 0 — «פחות 1» לגבוה (שאילה),
// וכששניהם 0 — «חריגה» (מתחת לאפס). כל הבדיקות הן «אפס?» בלבד (קפוץ), בלי כלי-השוואה.
// שלוש מסגרות (אני כותב רק את השלד והחיפוש; מה שנכנס לחריצים — המכונה בוחרת מהדוגמאות):
//   למעלה  — צובר: S ⇐ S + g(x) לכל איבר (ומונה n) ⇒ אחרי ההליכה: נמוך / גבוה / n / S חלקי d (חיסור חוזר; d = n או קבוע)
//   למטה   — תקציב: B ⇐ K, ולכל איבר מנסים B − g(x) על עותק: אין חריגה ⇒ «נכנס» (B מתעדכן), חריגה ⇒ «עובר»:
//            עצור (stop) / דלג והמשך (skip). רשימה⇒מספר: כמה נכנסו / כמה עד שעבר / עבר? / כמה נשאר בתקציב.
//            רשימה⇒רשימה: קח-כל-עוד-נכנס (חתוך) · דלג על מה שלא נכנס · הוצא-כל-עוד-נכנס.
//   חריצים: g (האיבר עצמו / 1 / כלי חד-מקומי מהמדף) · K (0..255, נבחר מהדוגמאות) · d · כלי-סיום (זהות / כלי מהמדף /
//           שני קבועים לתשובת «עבר?» / לוח שנלמד מהדוגמאות ונבנה ע"י בונה-הערכים).
// החיפוש: מדמה כל צירוף ב-JS על 1000 דוגמאות (מהיר), ורק מה שעבר — מורכב לקוד-מכונה ונבדק במכונה.
import { run } from './machine3s.mjs'; import { makeChecker, finalCheck } from './tzoref.mjs';
import { scanTools, shift, dataCells, remap } from './scan-tools.mjs'; import { assemble } from './posframes.mjs';
import { valueBuild } from './tzoref-value.mjs';
const R=k=>Math.floor(Math.random()*k); const J=JSON.stringify;
const walk=m=>{ const o=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ o.push(a); a=m[a]; } return o; };

// ─── 1. אבני-השלד ────────────────────────────────────────────────────────────
const G_=c=>[['WHERE',c],['GO']], T_=c=>[...G_(c),['TAKE']], P_=c=>[...G_(c),['PUT']], MV=(a,b)=>[...T_(a),...P_(b)];
const P15=[['TAKE'],['TAKE'],['CALC'],['TAKE'],['CALC']];   // לא-וגם(לא v, v) = 15 מכל תא (P תמיד תא חוקי)
const GOTO=l=>[...P15,['J',l]];
// קבועים מ-15: החיפוש הקצר ביותר עם «הזז ימינה», «חבר», «לא-וגם» (כמו בסורק-הקיפול)
const CONST=(()=>{ const best=new Array(16).fill(null); const q=[{st:[],code:[]}]; const seen=new Set(['']);
  while(q.length){ const n=q.shift(); if(n.st.length===1&&!best[n.st[0]]) best[n.st[0]]=n.code; if(best.every(Boolean)) break; const nx=[];
    if(n.st.length<3) nx.push({st:[...n.st,15],code:[...n.code,...P15]});
    if(n.st.length>=1) nx.push({st:[...n.st.slice(0,-1),n.st.at(-1)>>1],code:[...n.code,['SHR']]});
    if(n.st.length>=2){ const a=n.st.at(-2), b=n.st.at(-1); nx.push({st:[...n.st.slice(0,-2),(a+b)&15],code:[...n.code,['ADD']]}); nx.push({st:[...n.st.slice(0,-2),~(a&b)&15],code:[...n.code,['CALC']]}); }
    for(const m of nx){ const k=m.st.join(','); if(seen.has(k)||m.code.length>40) continue; seen.add(k); q.push(m); } q.sort((a,b)=>a.code.length-b.code.length); }
  return best; })();
const SET=(c,k)=>[...G_(c),...CONST[k],...P_(c)];
const INC=c=>[...T_(c),...P15,['SHR'],['SHR'],['SHR'],['ADD'],...P_(c)];   // c ⇐ c+1
const DEC=c=>[...T_(c),...P15,['ADD'],...P_(c)];                         // c ⇐ c+15 = c−1
const NEXTX=X=>[...T_(X),['WHERE@'],['GO'],['TAKE'],...P_(X)];            // x ⇐ mem[x]
// «פחות 1» לזוג (lo,hi) עם שאילה; שניהם 0 ⇒ קפוץ ל-under. אחרת ממשיך אחרי הקטע.
let UID=0; const DEC2=(lo,hi,under)=>{ const u=++UID, NB='nb'+u, BR='br'+u, DN='dn'+u;
  return [...T_(lo),['J',NB], ...T_(hi),['J',BR], ...GOTO(under), BR,...DEC(hi), NB,...DEC(lo)]; };
const INC2=(lo,hi)=>{ const u=++UID, DN='in'+u; return [...INC(lo), ...T_(lo),['J',DN], ...INC(hi), DN]; };
// כלי מהמדף במקומו: כניסה ⇒ inC, יציאה ⇒ outC, תאי-עבודה ⇒ תאים פנויים (או תאים חיים שנשמרים במחסנית סביבו)
function callTool(f,inC,outC,live){ const map={}; map[f.ins[0]]=inC; map[f.out]=outC; const taken=new Set([inC,outC]);
  const scratch=dataCells(f.prog).filter(c=>map[c]==null); const cells=[0,2,3,4,5,6,7]; const free=cells.filter(c=>!taken.has(c)&&!live.has(c)), busy=cells.filter(c=>!taken.has(c)&&live.has(c)); const save=[];
  for(const c of scratch){ if(free.length) map[c]=free.shift(); else if(busy.length){ const b=busy.shift(); map[c]=b; save.push(b); } else return null; }
  return [...save.flatMap(c=>T_(c)),{code:[['WHERE',0],['GO'],...shift(remap(f.prog,map),2)]},...[...save].reverse().flatMap(c=>P_(c))]; }
const gCode=(g,X,C,live)=>g.kind==='x'?MV(X,C):g.kind==='one'?SET(C,1):callTool(g.tool,X,C,live);

// ─── 2. הקוד: רשימה ⇒ מספר ───────────────────────────────────────────────────
// plan: {mode:'up'|'stop'|'skip', g, K, out:'lo'|'hi'|'n'|'div'|'nx'|'flag'|'rlo'|'rhi', d:'n'|k, post:{kind:'id'|'tool'|'const2'|'vb', ...}}
function postCode(post,raw,live){ if(post.kind==='id') return raw===2?[]:MV(raw,2);
  let pre=[], src=raw; if(raw===2){ pre=MV(2,3); src=3; } const c=callTool(post.tool,src,2,live); if(!c) throw new Error('אין מקום לכלי-הסיום'); return [...pre,...c]; }
export function codeNum(plan){ const X=3, C=0, L=4, H=5; const parts=[]; const g=plan.g;
  if(plan.mode==='up'){ const N=6, Q=2, D=7;
    const gc=gCode(g,X,C,new Set([X,L,H,N])); if(!gc) throw new Error('אין מקום ל-g');
    parts.push(...SET(L,0),...SET(H,0),...SET(N,0),...MV(1,X),
      'LOOP',...T_(X),['J','BODY'],...GOTO('END'),
      'BODY',...gc,
      'ADDL',...T_(C),['J','ADD1'],...GOTO('NEXT'),
      'ADD1',...DEC(C),...INC2(L,H),...GOTO('ADDL'),
      'NEXT',...INC(N),...NEXTX(X),...GOTO('LOOP'),
      'END');
    let raw; if(plan.out==='lo') raw=L; else if(plan.out==='hi') raw=H; else if(plan.out==='n') raw=N;
    else { const Dc=plan.d==='n'?N:D; raw=Q;   // S חלקי d: חיסור חוזר של d יחידות; חריגה ⇒ סוף. d=0 ⇒ 0
      parts.push(...SET(Q,0),...(plan.d==='n'?[]:SET(D,plan.d)),...T_(Dc),['J','DIV'],...GOTO('OUT'),
        'DIV',...MV(Dc,C),
        'DSUB',...T_(C),['J','DS1'],...INC(Q),...GOTO('DIV'),
        'DS1',...DEC(C),...DEC2(L,H,'OUT'),...GOTO('DSUB'),
        'OUT'); }
    parts.push(...postCode(plan.post,raw,new Set()));
    return assemble(parts); }
  // למטה: תקציב K, עותק (TL,TH), N = כמה נכנסו (בתא 2)
  const TL=6, TH=7, N=2; const gc=gCode(g,X,C,new Set([X,L,H,N])); if(!gc) throw new Error('אין מקום ל-g');
  parts.push(...SET(L,plan.K&15),...SET(H,plan.K>>4),...SET(N,0),...MV(1,X),
    'LOOP',...T_(X),['J','BODY'],...GOTO('END0'),
    'BODY',...gc,...MV(L,TL),...MV(H,TH),
    'SUB',...T_(C),['J','S1'],...GOTO('COMMIT'),
    'S1',...DEC(C),...DEC2(TL,TH,'CROSS'),...GOTO('SUB'),
    'COMMIT',...MV(TL,L),...MV(TH,H),...INC(N),...GOTO('NEXT'),
    'CROSS',...(plan.mode==='stop'?GOTO('END1'):[]),
    'NEXT',...NEXTX(X),...GOTO('LOOP'));
  if(plan.out==='flag'){ parts.push('END1',...SET(2,plan.post.a),...GOTO('OUT'),'END0',...SET(2,plan.post.b),'OUT'); return assemble(parts); }
  parts.push('END1',...(plan.out==='nx'?INC(N):[]),'END0');
  const raw=plan.out==='rlo'?L:plan.out==='rhi'?H:N; parts.push(...postCode(plan.post,raw,new Set()));
  return assemble(parts); }

// ─── 3. הקוד: רשימה ⇒ רשימה ──────────────────────────────────────────────────
// mode: 'take' (נכנס ⇒ התקדם, עובר ⇒ חתוך ועצור) · 'skip' (נכנס ⇒ התקדם, עובר ⇒ הוצא והמשך) · 'drop' (נכנס ⇒ הוצא, עובר ⇒ עצור)
const XAT=Pc=>[...T_(Pc),['WHERE@'],['GO'],['TAKE']];   // דוחף x = mem[חוליה]
export function codeList(plan){ const Pc=3, C=0, L=4, H=5, TL=6, TH=7, XC=2; const g=plan.g;
  const gc=g.kind==='x'?[...XAT(Pc),...P_(C)]:g.kind==='one'?SET(C,1):(()=>{ const t=callTool(g.tool,XC,C,new Set([Pc,L,H])); if(!t) throw new Error('אין מקום ל-g'); return [...XAT(Pc),...P_(XC),...t]; })();
  const ADV=[...XAT(Pc),...P_(Pc)];                                                          // חוליה ⇐ x
  const UNLINK=[...XAT(Pc),['WHERE@'],['GO'],['TAKE'],...T_(Pc),['WHERE@'],['GO'],['PUT']];     // mem[חוליה] ⇐ mem[x]
  const CUT=[...P15,['SHR'],['SHR'],['SHR'],['SHR'],...T_(Pc),['WHERE@'],['GO'],['PUT']];       // mem[חוליה] ⇐ 0
  const onFit=plan.mode==='drop'?UNLINK:ADV, onCross=plan.mode==='take'?[...CUT,...GOTO('END')]:plan.mode==='skip'?[...UNLINK,...GOTO('LOOP')]:GOTO('END');
  return assemble([...SET(L,plan.K&15),...SET(H,plan.K>>4),...SET(Pc,1),
    'LOOP',...XAT(Pc),['J','BODY'],...GOTO('END'),
    'BODY',...gc,...MV(L,TL),...MV(H,TH),
    'SUB',...T_(C),['J','S1'],...GOTO('COMMIT'),
    'S1',...DEC(C),...DEC2(TL,TH,'CROSS'),...GOTO('SUB'),
    'COMMIT',...MV(TL,L),...MV(TH,H),...onFit,...GOTO('LOOP'),
    'CROSS',...onCross,
    'END']); }

// ─── 4. סימולציה ב-JS (אותה משמעות בדיוק) ────────────────────────────────────
function simDown(gv,K,stop){ let B=K, n=0, cross=0; for(const v of gv){ if(B>=v){ B-=v; n++; } else { cross=1; if(stop) break; } } return {B,n,cross}; }
function simList(l,gv,K,mode){ let B=K; const out=[]; for(let i=0;i<l.length;i++){ const v=gv[i]; if(B>=v){ B-=v; if(mode!=='drop') out.push(l[i]); } else { if(mode==='take') break; if(mode==='drop'){ out.push(...l.slice(i)); break; } } } return out; }

// ─── 5. חיפוש ────────────────────────────────────────────────────────────────
// g: האיבר / 1 / כלי חד-מקומי מהמדף (רק אם מוגדר על 8..15); כפילויות (אותם ערכים על 8..15) — נשאר הזול
function gOptions(U){ const out=[{kind:'x',name:'x',f:x=>x,cost:0},{kind:'one',name:'1',f:()=>1,cost:0.2}]; const seen=new Set(out.map(o=>[8,9,10,11,12,13,14,15].map(o.f).join()));
  for(const t of U){ const f=x=>t.T[x]; const k=[8,9,10,11,12,13,14,15].map(f); if(k.some(v=>v<0)) continue; const s=k.join(); if(seen.has(s)) continue; seen.add(s); out.push({kind:'tool',tool:t,name:t.name,f,cost:1+t.prog.length/500}); }
  return out; }
// כלי-סיום: ערך-גולמי ⇒ תשובה. זהות · שני קבועים (לתשובת «עבר?») · כלי חד-מקומי מהמדף · אחרת: הלוח עצמו (לבונה-הערכים)
function findPost(raw,want,U,isFlag){ const m=new Int8Array(16).fill(-1); for(let e=0;e<raw.length;e++){ const r=raw[e]; if(m[r]<0) m[r]=want[e]; else if(m[r]!==want[e]) return null; }
  const keys=[...m.keys()].filter(k=>m[k]>=0); if(keys.length<2) return null;   // ערך-גולמי קבוע — המסגרת לא מסבירה כלום
  if(isFlag) return {kind:'const2',a:m[1],b:m[0],cost:0.3};
  if(keys.every(k=>m[k]===k)) return {kind:'id',cost:0};
  for(const t of U) if(keys.every(k=>t.T[k]===m[k])) return {kind:'tool',tool:t,name:t.name,cost:1+t.prog.length/500};
  return {kind:'vb',tab:m,keys,cost:5}; }
export function describe(p){ const g=p.g.name; const post=!p.post?'':p.post.kind==='id'?'':p.post.kind==='const2'?` ⇒ עבר? ${p.post.a} : ${p.post.b}`:p.post.kind==='tool'?` ⇒ ${p.post.name}`:' ⇒ [לוח שנלמד]';
  if(p.kind==='list') return `תקציב ${p.K} · g=${g} · ${{take:'קח-כל-עוד-נכנס',skip:'דלג על מה שלא נכנס',drop:'הוצא-כל-עוד-נכנס'}[p.mode]}`;
  if(p.mode==='up') return `צובר S+=${g} ⇒ ${p.out==='div'?'S חלקי '+(p.d==='n'?'n':p.d):{lo:'נמוך',hi:'גבוה',n:'n'}[p.out]}${post}`;
  return `תקציב ${p.K} · g=${g} · ${p.mode==='stop'?'עצור כשעובר':'דלג על מה שלא נכנס'}${p.out==='flag'?'':' ⇒ '+{n:'כמה נכנסו',nx:'כמה עד שעבר',rlo:'נשאר (נמוך)',rhi:'נשאר (גבוה)'}[p.out]}${post}`; }

function plansNum(ex,G,U){ const W=ex.map(e=>e.want); const out=[];
  const add=(plan,raw,isFlag,cost)=>{ const post=findPost(raw,W,U,isFlag); if(post) out.push({...plan,post,cost:cost+post.cost}); };
  for(const g of G){ const gv=ex.map(e=>e.l.map(g.f)); const S=gv.map(v=>v.reduce((a,b)=>a+b,0)), len=ex.map(e=>e.l.length);
    // למעלה
    add({kind:'num',mode:'up',g,out:'lo'},S.map(s=>s&15),false,g.cost); add({kind:'num',mode:'up',g,out:'hi'},S.map(s=>(s>>4)&15),false,g.cost+0.1);
    if(g.kind!=='one') add({kind:'num',mode:'up',g,out:'n'},len,false,g.cost+0.1);
    add({kind:'num',mode:'up',g,out:'div',d:'n'},S.map((s,e)=>len[e]?Math.floor(s/len[e])&15:0),false,g.cost+1);
    for(let d=2;d<=15;d++) add({kind:'num',mode:'up',g,out:'div',d},S.map(s=>Math.floor(s/d)&15),false,g.cost+1.2);
    // למטה: תקציב K
    for(const mode of ['stop','skip']) { for(let K=0;K<=255;K++){ const rs=gv.map(v=>simDown(v,K,mode==='stop')); if(rs.every(r=>!r.cross)&&K>0&&!rs.some(r=>r.B<16)) break;   // מעבר לכל הסכומים, וגם «נשאר» כבר לא בתא אחד
        const c0=g.cost+2+(mode==='skip'?0.5:0)+K/1000;
        add({kind:'num',mode,g,K,out:'n'},rs.map(r=>r.n&15),false,c0);
        if(mode==='stop'){ add({kind:'num',mode,g,K,out:'nx'},rs.map(r=>(r.n+r.cross)&15),false,c0+0.1); add({kind:'num',mode,g,K,out:'flag'},rs.map(r=>r.cross),true,c0); }
        add({kind:'num',mode,g,K,out:'rlo'},rs.map(r=>r.B&15),false,c0+0.2); add({kind:'num',mode,g,K,out:'rhi'},rs.map(r=>(r.B>>4)&15),false,c0+0.3); } } }
  return out.sort((a,b)=>a.cost-b.cost); }
function plansList(ex,G){ const out=[]; const ord=ex.map((e,i)=>i).sort((a,b)=>ex[b].l.length-ex[a].l.length);
  for(const g of G){ const gv=ex.map(e=>e.l.map(g.f));
    for(const mode of ['take','skip','drop']) for(let K=0;K<=255;K++){ let ok=true, anyCross=false;
      for(const i of ord){ const o=simList(ex[i].l,gv[i],K,mode); if(o.length!==ex[i].w.length||o.some((v,j)=>v!==ex[i].w[j])){ ok=false; break; } }
      if(ok){ // המסגרת חייבת «לעבוד»: לפחות דוגמה אחת שבה משהו עובר את התקציב
        for(let e=0;e<ex.length&&!anyCross;e++) if(simDown(gv[e],K,false).cross) anyCross=true;
        if(anyCross) out.push({kind:'list',mode,g,K,cost:g.cost+(mode==='take'?0:0.5)+K/1000}); }
      if(gv.every(v=>v.reduce((a,b)=>a+b,0)<=K)) break; } }
  return out.sort((a,b)=>a.cost-b.cost); }

// המרכיב: מועמדים מהסימולציה ⇒ קוד ⇒ בודק המכונה ⇒ בדיקה סופית (2000)
export function wideCompose(gen,{N=1000,ms=+process.env.WIDEMS||120000,say=()=>{},maxTry=40}={}){ const T0=Date.now(); const DEAD=T0+ms;
  const raw=Array.from({length:N},()=>gen()); const isList=typeof raw[0].want==='string';
  const ex=raw.map(e=>({l:walk(e.mem),want:e.want,w:isList?JSON.parse(e.want):null,e}));
  const {U}=scanTools(); const G=gOptions(U);
  const plans=isList?plansList(ex,G):plansNum(ex,G,U);
  say(`מצב-רחב: ${plans.length} מועמדים מהסימולציה (${G.length} אפשרויות ל-g) · ${((Date.now()-T0)/1000).toFixed(1)} שנ׳`);
  if(!plans.length) return {prog:null,cands:0,ms:Date.now()-T0};
  const chk=makeChecker(gen,300,50000); let tried=0; const seen=new Set();
  for(const p of plans){ if(Date.now()>DEAD||tried>=maxTry) break;
    let post=p.post;
    if(post&&post.kind==='vb'){   // לוח-סיום שאין לו כלי במדף: בונה-הערכים בונה אותו מהדוגמאות (רק על הערכים שנראו)
      if(Date.now()>DEAD-20000) continue; const keys=post.keys, tab=post.tab;
      const g=()=>{ const k=keys[R(keys.length)]; const m=Array.from({length:16},()=>R(16)); m[3]=k; const w=tab[k]; return {mem:m,want:w,ok:r=>r[2]===w&&r[3]===k}; };
      const v=valueBuild(g,{name:'סיום (מצב-רחב)',ins:[3],out:2,ms:Math.min(60000,DEAD-Date.now()-10000)}); if(!v.prog) continue;
      post={kind:'tool',tool:{ins:[3],out:2,prog:v.prog,name:'לוח שנלמד'},name:'לוח שנלמד'}; }
    let prog; try{ prog=(p.kind==='list'?codeList:codeNum)({...p,post}); }catch(err){ say('  קוד: '+err.message); continue; }
    const key=J(prog); if(seen.has(key)) continue; seen.add(key); tried++;
    const bad=ex.slice(0,60).filter(f=>{ const r=run(prog,f.e.mem,{maxSteps:50000}); return !r||r.st.length||!f.e.ok(r.mem); }).length;
    if(bad){ say(`  ✗ במכונה (${bad}/60): ${describe({...p,post})}`); continue; }
    if(!chk(prog)){ say('  ✗ בבודק: '+describe({...p,post})); continue; }
    const fc=finalCheck(prog,gen,2000); if(fc.bad){ say(`  ✗ בבדיקה (${fc.bad}/2000): ${describe({...p,post})}`); continue; }
    return {prog,how:'מצב-רחב: '+describe({...p,post}),cands:plans.length,tried,ms:Date.now()-T0}; }
  return {prog:null,cands:plans.length,tried,ms:Date.now()-T0}; }
