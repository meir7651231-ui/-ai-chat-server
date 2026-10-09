// «בחירה-במקום»: רשימה ⇒ מספר = האיבר שבמקום k(n) של «רשימת-מצב».
//   מצב = הרשימה אחרי 0–2 צעדים בטוחים-לשרשרת (הכלים של רצף-מקום: stepTools — מיין, הפוך, בלי הראשון…).
//   n = אורך המצב. k = פונקציה של n — המכונה מסיקה מהדוגמאות באיזה מקום במצב יושבת התשובה
//   (הערכים שונים ⇒ המקום יחיד), ובונה את k: כלי חד-מקומי מהמדף, ואם אין — בונה-הערכים (valueBuild) על הטבלה שנלמדה.
//   תשובה 0 ברשימה לא ריקה ⇒ «מעבר לסוף»: דרישה k(n) ≥ n (ההליכה נעצרת בסוף ⇒ 0).
// מסגרת (שלד שכתבנו; החריצים — צעדים ו-k — מתמלאים מהדוגמאות): [צעדים] ⇒ אורך ⇒ k ⇒ הליכה k חוליות ⇒ תא 2. רשימה ריקה ⇒ 0.
// הצעדים הורסים את הרשימה ⇒ המוח המאוחד עוטף ב«שומר-רשימה» (keepList).
import fs from 'fs'; import { run } from './machine3s.mjs'; import { makeChecker, finalCheck, movable } from './tzoref.mjs'; import { valueBuild } from './tzoref-value.mjs';
import { runFastG, walk, walkA, Z, shift, relocate } from './chainsafe.mjs'; import { assemble } from './posframes.mjs'; import { stepTools, pickExamplesFor, seqProg } from './poscompose.mjs';
import { deepRelocOk, repairJumps } from './jumpfix.mjs';   // (במעבדה החיה reloc.mjs שונה שמו ל-jumpfix.mjs — אותו תוכן)
const R=k=>Math.floor(Math.random()*k); const J=JSON.stringify; const PADN=14; const NMAX=8;
const usedC=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]));
// עזרי-מסגרת (כמו ב-posframes): T = דחוף תא, P = שים בתא, AT = לך לכתובת שבתא, GOTO = קפיצה תמיד
const T=c=>[['WHERE',c],['GO'],['TAKE']], P=c=>[['WHERE',c],['GO'],['PUT']], AT=c=>[...T(c),['WHERE@'],['GO']];
const PUSH15=[...T(4),['TAKE'],['CALC'],['TAKE'],['CALC']], PUSH1=[...PUSH15,['SHR'],['SHR'],['SHR']], PUSH0=[...PUSH15,...PUSH15,['CALC']];
const GOTO=l=>[...PUSH15,['J',l]];
// המסגרת: kTool קורא את n מתא 0 ועונה בתא 2. תאים: 0 = n · 3 = מצביע · 4 = כמה חוליות נשארו. הראש (תא 1) נשמר במחסנית סביב kTool.
export function pickFrame(kTool){ return assemble([
    ...PUSH0,...P(0), ...T(1),...P(3),
    'LEN', ...T(3),['J','LN'], ...GOTO('LEND'),
    'LN', ...T(0),...PUSH1,['ADD'],...P(0), ...AT(3),['TAKE'],...P(3), ...GOTO('LEN'),
    'LEND', ...T(1), {code:Z}, {code:kTool}, ...P(1),
    ...T(1),...P(3), ...T(2),...P(4),
    'W', ...T(4),['J','W1'], ...GOTO('OUT'),
    'W1', ...T(3),['J','W2'], ...GOTO('OUT'),
    'W2', ...AT(3),['TAKE'],...P(3), ...T(4),...PUSH15,['ADD'],...P(4), ...GOTO('W'),
    'OUT', ...T(3),...P(2) ]); }
// טבלה של כלי חד-מקומי על 0..upto: null אם הכלי נכשל (תקוע/מחסנית); -1 במקום שבו התשובה תלויה במשהו מלבד תא 0 («לא קבוע» — לא עומד באף דרישה)
export function unaryTable(prog,{upto=15}={}){ const tt=[]; const q=[...Z,...shift(prog,Z.length)]; for(let v=0;v<=upto;v++){ let z=null; for(let t=0;t<4;t++){ const m=Array.from({length:16},()=>R(16)); m[0]=v; const r=run(q,m,{maxSteps:20000}); if(!r||r.st.length) return null; const y=r.mem[2]&15; if(z===null) z=y; else if(z!==y) z=-1; } tt.push(z); } return tt; }
// כלים חד-מקומיים מהמדף (קלט תא 0 או בלי קלט, תשובה בתא 2, רק תאים 0..7, בלי «לאן מהמחסנית»); קפיצות קבועות ⇒ מועברות (relocate) או שהכלי נזרק
function kTools(sh){ const out=[], seen=new Set(); for(const b of sh.named){ if(b.bad||(b.out??2)!==2||!['','0'].includes((b.ins||[]).join())||b.prog.length>250||b.prog.some(x=>x[0]==='WHERE@')) continue; if([...usedC(b.prog)].some(c=>c>7)) continue;
    const prog=relocate(b.prog); if(!prog) continue; const tt=unaryTable(prog,{upto:NMAX}); if(!tt) continue; const k=tt.join(','); if(seen.has(k)) continue; seen.add(k); out.push({name:b.name,prog,tt}); } return out; }
// הדרישות על k מתוך רשימות-מצב והתשובות: eq[n] = המקום (כשהתשובה ברשימה) · ge[n] = «מעבר לסוף» (תשובה 0). סתירה ⇒ null
export function kReq(lists,wants){ const eq=Array(NMAX+1).fill(null), ge=Array(NMAX+1).fill(false);
  for(let i=0;i<lists.length;i++){ const s=lists[i], w=wants[i], n=s.length; if(n>NMAX) return null; if(w===0){ if(n) ge[n]=true; continue; } const p=s.indexOf(w); if(p<0) return null; if(eq[n]===null) eq[n]=p; else if(eq[n]!==p) return null; }
  for(let n=0;n<=NMAX;n++) if(ge[n]&&eq[n]!==null) return null; if(!eq.some(x=>x!==null)) return null; return {eq,ge}; }
const fitsK=(tt,{eq,ge})=>{ for(let n=0;n<=NMAX;n++){ if(eq[n]!==null&&tt[n]!==eq[n]) return false; if(ge[n]&&tt[n]<n) return false; } return true; };
const reqKey=({eq,ge})=>eq.map((x,n)=>x!==null?x:ge[n]?'>':'?').join(',');
// לימוד k: בונה-הערכים על המקומות הידועים בלבד (שאר ה-n — «לא אכפת»); אחר כך בודקים שהתוכנית מקיימת גם את «מעבר לסוף».
//   לא עמד ⇒ מנסים שוב כשה«מעבר לסוף» ממולא (k=n, ואז k=15). נשמר במדף כמו תנאי-מקום (התנהגות אמיתית על 0..15).
export async function learnK(req,{say=()=>{},ms=90000,store=true}={}){ const {eq,ge}=req; const care=eq.map((x,n)=>x!==null?n:null).filter(n=>n!==null);
  const name='מקום לפי אורך: '+eq.map((x,n)=>x!==null?`${n}→${x}`:null).filter(Boolean).join(',');
  const fills=[{}]; if(ge.some(Boolean)){ fills.push(Object.fromEntries(ge.map((g,n)=>g?[n,n]:null).filter(Boolean))); fills.push(Object.fromEntries(ge.map((g,n)=>g?[n,15]:null).filter(Boolean))); }
  const T0=Date.now();
  for(const fill of fills){ const left=ms-(Date.now()-T0); if(left<5000) break; const tab={}; for(const n of care) tab[n]=eq[n]; Object.assign(tab,fill); const dom=Object.keys(tab).map(Number);
    const gen=()=>{ const mem=Array.from({length:16},()=>R(16)); mem[0]=dom[R(dom.length)]; const w=tab[mem[0]], k=mem[0]; return {mem,want:w,ok:r=>r[2]===w&&r[0]===k}; };
    say(`  לומד k: ${reqKey(req)}${Object.keys(fill).length?' (מילוי '+J(fill)+')':''} (בונה-ערכים)…`);
    const v=valueBuild(gen,{name,ins:[0],out:2,ms:Math.min(left,ms)}); if(!v.prog) continue; let prog=relocate(v.prog); if(!prog) continue;
    if([...usedC(prog)].some(c=>c>7)||prog.some(x=>x[0]==='WHERE@')) continue;   // k לא נוגע בתאי-הרשימה (8..15) — רק תא 1 נשמר סביבו
    const tt8=unaryTable(prog,{upto:NMAX}); if(!tt8||!fitsK(tt8,req)){ say(`  k שנבנה לא מקיים את הדרישות על 0..${NMAX}: ${tt8&&tt8.join(',')}`); continue; }
    // נשמר במדף רק אם ההתנהגות קבועה על כל 0..15 (כמו תנאי-מקום); אחרת — משמש רק כאן (n תמיד 0..8)
    let tt=unaryTable(prog); if(tt&&tt.includes(-1)) tt=null; const gen16=tt&&(()=>{ const mem=Array.from({length:16},()=>R(16)); const w=tt[mem[0]], k=mem[0]; return {mem,want:w,ok:r=>r[2]===w&&r[0]===k}; });
    if(store&&tt&&!finalCheck(prog,gen16,4000).bad){ const S2=JSON.parse(fs.readFileSync('shelf3.json','utf8')); if(!S2.named.some(b=>b.name===name)){ S2.named.push({name,prog,ins:[0],out:2,movable:movable(prog,gen16),by:'נלמד: מקום לפי אורך (בחירה-במקום)'}); fs.writeFileSync('shelf3.json',JSON.stringify(S2));
        const LG=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); LG[name]={ins:[0],tt}; fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(LG)); } }
    return {name,prog,tt:tt8}; }
  return null; }

export async function pickAtCompose(gen,{maxSteps=2,ms=+process.env.PICKMS||150000,learn=true,store=true,maxLearn=3,say=()=>{}}={}){ const T0=Date.now(), DEAD=T0+ms;
  const ex=pickExamplesFor(gen,10); const wants=ex.map(e=>e.want&15); const ins=ex.map(e=>walk(e.mem));
  // המשפחה: התשובה היא תמיד איבר של הרשימה, או 0 (ורשימה ריקה ⇒ 0)
  if(ex.some((e,i)=>wants[i]!==0&&!ins[i].includes(wants[i]))) return {prog:null,why:'התשובה אינה איבר של הרשימה'};
  if(ex.some((e,i)=>!ins[i].length&&wants[i]!==0)) return {prog:null,why:'רשימה ריקה ⇒ לא 0'};
  if(wants.every(w=>w===0)) return {prog:null,why:'תמיד 0'};
  const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const {tools}=stepTools(ex,{sh,say}); const KT=kTools(sh);
  const chk=makeChecker(gen,300,600000); const more=Array.from({length:300},()=>gen());
  const verify=p=>{ for(const e of more){ const r=run(p,e.mem,{maxSteps:600000}); if(!r||r.st.length||!e.ok(r.mem)) return null; } if(!chk(p)) return null;
    if(deepRelocOk(p,gen)) return p; const f=repairJumps(p,gen); return f&&deepRelocOk(f,gen)&&chk(f)?f:null; };
  const apply=(t,mem)=>runFastG(t.P,mem,PADN,300000);
  // 1. רצפי-צעדים (לרוחב, מצבים כפולים נזרקים; מצב שאיבד תשובה — מת). כל מצב שהדרישות על k בו עקביות ⇒ מועמד.
  const cands=[]; let level=[{chain:[],mems:ex.map(e=>e.mem),lists:ins}]; const seen=new Set([J(ins)]);
  const note=st=>{ const q=kReq(st.lists,wants); if(q) cands.push({...st,req:q}); };
  note(level[0]);
  for(let L=1;L<=maxSteps;L++){ const next=[];
    for(const st of level) for(const t of tools){ if(Date.now()>DEAD) break; const mems=[], lists=[]; let ok=true;
      for(let i=0;i<ex.length;i++){ const m=apply(t,st.mems[i]); if(!m){ ok=false; break; } const l=walkA(m); if(wants[i]&&!l.includes(wants[i])){ ok=false; break; } mems.push(m); lists.push(l); }
      if(!ok) continue; const k=J(lists); if(seen.has(k)) continue; seen.add(k); const ns={chain:[...st.chain,t],mems,lists}; next.push(ns); note(ns); }
    say(`  רמה ${L}: ${next.length} מצבים חדשים · מועמדים ${cands.length} · ${((Date.now()-T0)/1000).toFixed(1)} שנ׳`); level=next; }
  const done=(c,k,extra={})=>{ const how=[...c.chain.map(s=>s.name),'אורך',`k=[${k.name}]`,'הליכה k חוליות'].join(' ⇒ '); return {how,steps:c.chain.length,cands:cands.length,ms:Date.now()-T0,...extra}; };
  // הרכבה: [צעדים] ⇒ Z ⇒ המסגרת (כתובות-הקוד של המסגרת מוזזות למקומה)
  const buildS=(c,k)=>{ const pre=seqProg(c.chain); const fr=pickFrame(k.prog); const off=pre.length+Z.length; return [...pre,...Z,...fr.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+off,'code']:x)]; };
  // 2. k מהמדף: כלי שהטבלה שלו מקיימת את כל הדרישות
  for(const c of cands) for(const k of KT){ if(Date.now()>DEAD) return {prog:null,timeout:true,cands:cands.length}; if(!fitsK(k.tt,c.req)) continue; const p=verify(buildS(c,k)); if(p) return {prog:p,...done(c,k)}; }
  // 3. k נלמד: לכל טבלת-דרישות שונה (לפי סדר הרצפים — הקצרים קודם), בונה-הערכים
  if(!learn) return {prog:null,cands:cands.length,ms:Date.now()-T0};
  const tried=new Set(); let nl=0;
  for(const c of cands){ const key=reqKey(c.req); if(tried.has(key)) continue; tried.add(key); if(nl>=maxLearn||Date.now()>DEAD-5000) break; nl++;
    const k=await learnK(c.req,{say,ms:Math.min(90000,DEAD-Date.now()),store}); if(!k) continue;
    for(const c2 of cands){ if(!fitsK(k.tt,c2.req)) continue; const p=verify(buildS(c2,k)); if(p) return {prog:p,...done(c2,k,{learned:k.name})}; } }
  return {prog:null,cands:cands.length,reqs:[...tried],ms:Date.now()-T0}; }
