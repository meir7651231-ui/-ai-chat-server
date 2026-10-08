// «מסגרות-סריקה»: רשימה ⇒ רשימה. הולכים על הרשימה (תא 3 = מצביע לחוליה, תא 4 = האיבר, תא 5 = «עזר»),
// ולכל איבר מריצים תנאי מהמדף. מה עושים כשהתנאי מתקיים — לפי סוג המסגרת:
//   סנן  — הוצא/השאר ·  קח-כל-עוד — חתוך כאן (החוליה ⇐ 0) ·  דלג-כל-עוד — הוצא מהראש, ובראשון שלא — עצור.
//   «והעבר לסוף»: סנן/דלג — אבל מה שהוצא לא נזרק: נאסף לשרשרת שנייה (תאים 6,7) שמחוברת בסוף (זוגיים-קודם, סיבוב).
// «עזר» (תא 5) — אחד מאלה: אין · הקודם (תא 3) · הבא (mem[x]) · ערך מהרשימה שמחושב פעם אחת לפני ההליכה
// (הראשון, או כלי רשימה⇒מספר מהמדף) · «מצב רץ»: מתחיל מקבוע/מהראשון/מכלי-רשימה ומתעדכן בכל איבר ע"י כלי מהמדף.
// לפני ואחרי: 0–2 כלים מהמדף שמשנים רשימה (מיין, הפוך…) — אחרי: רק כלי ששומר על הקבוצה (סדר בלבד).
// המכונה בוחרת הכל מהדוגמאות: קודם מסיקה מהדוגמאות מה קרה לכל איבר (נשאר/הוצא/נחתך), ואז מחפשת «עזר» שהתווית
// היא פונקציה שלו ושל האיבר, וכלי מהמדף (או צירוף שבונה-הערכים מוצא) שנותן בדיוק את הטבלה הזו.
import fs from 'fs'; import { placements, makeChecker, finalCheck } from './tzoref.mjs';
import { valueBuild } from './tzoref-value.mjs';
const R=k=>Math.floor(Math.random()*k); const J=JSON.stringify;
const walk=m=>{ const o=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ o.push(a); a=m[a]; } return o; };
const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
const usedC=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]));
const relink=(m,l)=>{ const q=m.slice(); for(let c=8;c<16;c++) q[c]=0; q[1]=l[0]||0; l.forEach((a,i)=>{ q[a]=l[i+1]||0; }); return q; };
const Z=[['WHERE',0],['GO']]; const T=c=>[['WHERE',c],['GO'],['TAKE']], P=c=>[['WHERE',c],['GO'],['PUT']]; const mv=(a,b)=>[...T(a),...P(b)];
const PUSH15=[...T(4),['TAKE'],['CALC'],['TAKE'],['CALC']];   // NAND(NAND(x,x),x)=15 — «תמיד»
// בחיפוש: אותה מכונה קפדנית, עם חיבור/הזז-ימינה מטבלה (כמו machine3f). הבדיקה הסופית — במכונה הרשמית (machine3s)
import { add4 } from './lifted-add.mjs'; import { shr4 } from './lifted-shr.mjs';
const ADDT=new Uint8Array(256), SHRT=new Uint8Array(16); for(let a=0;a<16;a++){ SHRT[a]=shr4(a); for(let b=0;b<16;b++) ADDT[a*16+b]=add4(a,b); }
function runF(prog,mem0,maxSteps=600000){ const mem=mem0.slice(); let A=0,P=0,pc=0,steps=0; const st=[]; const n=prog.length;
  while(pc<n){ if(++steps>maxSteps) return null; const x=prog[pc++]; const op=x[0];
    if(op==='WHERE') A=x[1]; else if(op==='GO') P=A; else if(op==='TAKE'){ if(P>=16) return null; st.push(mem[P]); } else if(op==='PUT'){ if(!st.length||P>=16) return null; mem[P]=st.pop(); }
    else if(op==='WHERE@'){ if(!st.length) return null; A=st.pop()%16; } else if(op==='JUMP'){ if(!st.length) return null; if(st.pop()!==0) pc=A; }
    else if(op==='CALC'){ if(st.length<2) return null; const b=st.pop(),a=st.pop(); st.push(~(a&b)&15); } else if(op==='ADD'){ if(st.length<2) return null; const b=st.pop(),a=st.pop(); st.push(ADDT[a*16+b]); }
    else if(op==='SHR'){ if(!st.length) return null; st.push(SHRT[st.pop()]); } }
  return {mem,st}; }
const RUN=(p,m)=>runF(p,m,50000);   // כמו בבדיקה הסופית: כל התוכנית חייבת להיגמר ב-50,000 צעדים
// הרכבה עם תוויות: 'שם' = תווית, ['J','שם'] = קפוץ-אם-לא-אפס, {code} = קטע (כתובות-הקוד שלו מוזזות)
function assemble(parts){ const out=[], lab={}, fix=[]; for(const x of parts){ if(typeof x==='string'){ lab[x]=out.length; continue; } if(x.code){ out.push(...shift(x.code,out.length)); continue; } if(x[0]==='J'){ fix.push([out.length,x[1]]); out.push(null,['JUMP']); continue; } out.push(x); }
  for(const [i,l] of fix) out[i]=['WHERE',lab[l],'code']; return out; }
// קבוע k לתא c — מ-15, בפעולות-יסוד בלבד (לא, הזז ימינה, חבר לעצמו); החיפוש הקצר ביותר
const CONST=(()=>{ const OPS=[[[['TAKE'],['TAKE'],['CALC'],['PUT']],v=>(~v)&15],[[['TAKE'],['SHR'],['PUT']],v=>v>>1],[[['TAKE'],['TAKE'],['ADD'],['PUT']],v=>(v+v)&15]];
  const best={15:[]}; let fr=[15]; while(fr.length){ const nf=[]; for(const v of fr) for(const [c,f] of OPS){ const w=f(v); if(best[w]) continue; best[w]=[...best[v],...c]; nf.push(w); } fr=nf; } return best; })();
const constCode=(k,c)=>[['WHERE',c],['GO'],['TAKE'],['TAKE'],['CALC'],['TAKE'],['CALC'],['PUT'],...CONST[k]];
// עוטף כלי-מספר: שומר במחסנית את תאי-המסגרת שהוא נוגע בהם (או את כולם, אם הוא קורא כתובת מחושבת)
const wrap=(prog,keep)=>{ const U=usedC(prog); const sv=prog.some(x=>x[0]==='WHERE@')?keep:keep.filter(c=>U.has(c)); return [...sv.flatMap(c=>T(c)),{code:Z},{code:prog},...[...sv].reverse().flatMap(c=>P(c))]; };
const FRAMECELLS=[1,3,4,5];
// כלי-רשימה ברצף: כמו ברצף-כלים (לאן 0 · לך · כלי). יש כלים במדף (הפוך, מיין) שחוזרים בלולאה לשורה 1 של התוכנית — הם נכונים
// רק בתחילתה, ולכן כלי-הרשימה הראשון יושב ממש בהתחלה ושום דבר לא נשמר במחסנית. z: לאפס את תא 0 לפני כל כלי שאינו ראשון
// (כמו בדוגמאות שעליהן נבדקו) — המכונה מנסה קודם בלי, ובודקת בהרצה אמיתית של אותו קוד.
const ZERO0=[...PUSH15,['SHR'],['SHR'],['SHR'],['SHR'],...P(0)];
export const listPart=(progs,z=false)=>progs.flatMap((t,i)=>[...(i>0&&z?ZERO0:[]),{code:Z},{code:t}]);
// המסגרת. spec: {mode:'filter'|'take'|'drop', onTrue, pre:[prog], post:[prog], aux, cond:{prog}, upd, policy, move}
//   aux: {kind:'none'|'p'|'nx'|'V'|'S', tool?:prog (V מכלי-רשימה), init?:{kind:'const',k}|{kind:'first'}|{kind:'tool',prog}} · z: לאפס תא 0 בין כלי-רשימה
//   upd: {kind:'copy'} | {prog} (כלי-מספר ⇒ תא 2 ⇒ תא 5) · policy: 'all' (כל איבר שנבדק) | 'kept' (רק מי שנשאר)
export function scanFrame({mode,onTrue,pre=[],post=[],aux={kind:'none'},cond,upd=null,policy='all',z=false,move=false}){
  const KEEP=move?[...FRAMECELLS,6,7]:FRAMECELLS;
  const parts=[...listPart(pre,z)]; let called=pre.length;
  const callList=prog=>{ parts.push(...(called>0&&z?ZERO0:[]),{code:Z},{code:prog}); called++; };
  if(aux.kind==='V'){ if(aux.tool){ callList(aux.tool); parts.push(...mv(2,5)); } else parts.push(...mv(1,5)); }   // V = כלי-רשימה, או הראשון (= ראש-הרשימה)
  if(aux.kind==='S'){ if(aux.init.kind==='const') parts.push(...constCode(aux.init.k,5)); else if(aux.init.kind==='tool'){ callList(aux.init.prog); parts.push(...mv(2,5)); } else parts.push(...mv(1,5)); }
  const updCode=!upd?[]:upd.kind==='copy'?mv(4,5):[...wrap(upd.prog,KEEP.filter(c=>c!==5)),...mv(2,5)];
  if(move) parts.push(...PUSH15,['SHR'],['SHR'],['SHR'],['SHR'],...P(6),...constCode(6,7));   // «העבר לסוף»: תא 6 = ראש שרשרת-המוצאים (0), תא 7 = הזנב שלה (6)
  const tgt={filter:{T:'UNLINK',F:'ADV'},take:{T:'CUT',F:'ADV'},drop:{T:'UNLINK',F:'EXIT'}}[mode]; const flip=onTrue==='keep'||onTrue==='cont'||onTrue==='stop';
  const [tT,tF]=flip?[tgt.F,tgt.T]:[tgt.T,tgt.F];
  parts.push(...PUSH15,['SHR'],['SHR'],['SHR'],...P(3),   // p ⇐ 1 (החוליה של ראש-הרשימה)
    'LOOP', ...T(3),['WHERE@'],['GO'],['TAKE'],...P(4), ...T(4),['J','BODY'], ...PUSH15,['J','EXIT'],   // x ⇐ mem[p]; x=0 ⇒ סוף
    'BODY', ...(aux.kind==='nx'?[...T(4),['WHERE@'],['GO'],['TAKE'],...P(5)]:[]),
    ...wrap(cond.prog,KEEP), ...T(2), ...(policy==='all'?updCode:[]), ['J',tT], ...PUSH15, ['J',tF],
    'ADV', ...(policy==='kept'?updCode:[]), ...T(4),...P(3), ...PUSH15,['J','LOOP'],   // p ⇐ x
    'UNLINK', ...T(4),['WHERE@'],['GO'],['TAKE'], ...T(3),['WHERE@'],['GO'],['PUT'],   // mem[p] ⇐ mem[x]
    ...(move?[...T(4),...T(7),['WHERE@'],['GO'],['PUT'],...mv(4,7)]:[]), ...PUSH15,['J','LOOP']);   // «העבר»: mem[זנב] ⇐ x · זנב ⇐ x
  if(mode==='take') parts.push('CUT', ...PUSH15,['SHR'],['SHR'],['SHR'],['SHR'], ...T(3),['WHERE@'],['GO'],['PUT']);   // mem[p] ⇐ 0, ונופלים לסוף
  parts.push('EXIT');
  if(move) parts.push(...PUSH15,['SHR'],['SHR'],['SHR'],['SHR'], ...T(7),['WHERE@'],['GO'],['PUT'],   // סוף שרשרת-המוצאים ⇐ 0
    'TAILW', ...T(3),['WHERE@'],['GO'],['TAKE'],['J','TSTEP'], ...PUSH15,['J','TLINK'],   // p הולך לזנב הרשימה
    'TSTEP', ...T(3),['WHERE@'],['GO'],['TAKE'],...P(3), ...PUSH15,['J','TAILW'],
    'TLINK', ...T(6), ...T(3),['WHERE@'],['GO'],['PUT']);   // mem[זנב] ⇐ ראש שרשרת-המוצאים
  for(const t of post){ called=Math.max(called,1); callList(t); }
  return assemble(parts); }

// ─── הסקה מהדוגמאות ──────────────────────────────────────────────────────────
// לכל דוגמה: מה קרה לכל איבר שהמסגרת «פוגשת». תווית 1 = הוצא / חתוך / דלג, 0 = השאר / המשך / עצור.
function shapeOf(lp,w,mode,setOnly){ const inW=new Set(w); const vis=[]; let kept;
  if(mode==='filter'){ kept=lp.filter(x=>inW.has(x)); if(kept.length!==w.length) return null; if(!setOnly&&J(kept)!==J(w)) return null; lp.forEach((x,i)=>vis.push({i,lab:inW.has(x)?0:1})); }
  else if(mode==='take'){ const k=w.length; if(k>lp.length) return null; kept=lp.slice(0,k); if(setOnly?!kept.every(x=>inW.has(x)):J(kept)!==J(w)) return null; for(let i=0;i<=Math.min(k,lp.length-1);i++) vis.push({i,lab:i<k?0:1}); }
  else if(mode==='dropMove'){ if(w.length!==lp.length) return null; if(!lp.length) return {vis,kept:[]}; const d=lp.indexOf(w[0]); if(d<0||J(w)!==J([...lp.slice(d),...lp.slice(0,d)])) return null;
    if(d>0) for(let i=0;i<=d;i++) vis.push({i,lab:i<d?1:0}); kept=w; }   // סיבוב ב-0 = סיבוב בכל האורך ⇒ דוגמה דו-משמעית, בלי תוויות
  else if(mode==='filterMove'){ if(w.length!==lp.length||!lp.every(x=>inW.has(x))) return null; const ks=[];
    for(let k=0;k<=w.length;k++){ const A=new Set(w.slice(0,k)); if(J(lp.filter(x=>A.has(x)))===J(w.slice(0,k))&&J(lp.filter(x=>!A.has(x)))===J(w.slice(k))) ks.push(k); }
    if(!ks.length) return null; if(ks.length===1){ const A=new Set(w.slice(0,ks[0])); lp.forEach((x,i)=>vis.push({i,lab:A.has(x)?0:1})); } kept=w; }   // כמה חלוקות אפשריות ⇒ בלי תוויות
  else { const d=lp.length-w.length; if(d<0) return null; kept=lp.slice(d); if(setOnly?!kept.every(x=>inW.has(x)):J(kept)!==J(w)) return null; for(let i=0;i<=Math.min(d,lp.length-1);i++) vis.push({i,lab:i<d?1:0}); }
  return {vis,kept}; }
const truthy=v=>v!==0;
// סיווג המדף (פעם אחת לכל מדף, בתוך אותו תהליך): כלי-רשימה משנים (L) ומחשבים (V) — רק ניידים, דטרמיניסטיים, ששומרים על המחסנית ריקה
// (נייד = אותה תוצאה גם אחרי ריפוד בתחילת התוכנית ועם זבל אחר בתאים 2–7: משנה ⇒ אותה רשימה, מחשב ⇒ אותו מספר); ולוחות-הכפל של כלי-המספר
let KINDS=null;
function shelfKinds(sh){ const sig=sh.named.map(b=>b.name+':'+b.prog.length).join('|'); if(KINDS&&KINDS.sig===sig) return KINDS;
  const PAD=[...Z,...Z,...Z,...Z,...Z]; const g=listGenId(); const ex=Array.from({length:80},()=>g());
  const L=[], V=[]; for(const b of sh.named){ if(b.prog.length>300||b.bad) continue; let ok=true, okV=true, ch=0, keeps=true, setp=true;
    for(const e of ex){ const r=RUN(b.prog,e.mem); if(!r||r.st.length){ ok=false; break; } const r2=RUN([...PAD,...shift(b.prog,PAD.length)],e.mem.map((v,c)=>c>=2&&c<8?R(16):v));
      if(!r2||r2.st.length||J(walk(r2.mem))!==J(walk(r.mem))){ ok=false; break; } if((r2.mem[2]&15)!==(r.mem[2]&15)) okV=false; const a=walk(r.mem), l=walk(e.mem); if(J(a)!==J(l)) ch++;
      if([1,8,9,10,11,12,13,14,15].some(c=>r.mem[c]!==e.mem[c])) keeps=false; if(J([...a].sort())!==J([...l].sort())) setp=false; }
    if(!ok) continue; if(ch>0) L.push({name:b.name,prog:b.prog,setp}); else if(okV&&keeps&&b.prog.some(x=>x[0]==='WHERE@')) V.push({name:b.name,prog:b.prog}); }
  const TB=tablesF(sh.named.filter(b=>!b.bad));
  KINDS={sig,L,V,U1:TB.filter(t=>t.k===1),B2:TB.filter(t=>t.k===2)}; return KINDS; }
// לוחות-כפל — אותו כלל כמו partTables (tzoref-tables.mjs): תשובה שתלויה רק בקלט (3 זבלים שונים), בלי חלקיים; רק על המכונה המהירה
function tablesF(named){ const out=[]; for(const b of named){ const ins=(b.ins||[]).filter(c=>c<8), o=b.out??2; if(!ins.length||ins.length>2||o>7||/רשימה|ספור|בלי|אמצע|וקטן/.test(b.name)) continue;
    const n=ins.length===1?16:256, T=new Uint8Array(n); let ok=true;
    for(let x=0;x<n&&ok;x++){ const a=ins.length===1?x:x>>4, bb=x&15; let v=null;
      for(let k=0;k<3;k++){ const m=Array.from({length:16},()=>R(16)); m[ins[0]]=a; if(ins.length===2) m[ins[1]]=bb; const r=runF(b.prog,m,20000); if(!r||r.st.length){ ok=false; break; } if(v==null) v=r.mem[o]; else if(v!==r.mem[o]){ ok=false; break; } }
      T[x]=v??0; }
    if(ok) out.push({name:b.name,k:ins.length,T:Array.from(T)}); }
  return out; }
// רשימה אקראית (כמו llGen): ראש בתא 1, תאים 0,1,8–15 לפי הרשימה, השאר זבל
const listGenId=()=>()=>{ const m=new Array(16).fill(0); const p=[8,9,10,11,12,13,14,15]; for(let i=7;i>0;i--){ const j=R(i+1); [p[i],p[j]]=[p[j],p[i]]; } const l=p.slice(0,R(9)); m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; }); return {mem:m.map((v,k)=>[0,1,8,9,10,11,12,13,14,15].includes(k)?v:R(16))}; };
export function scanCompose(gen,{N=200,ms=+process.env.CUTMS||200000,maxPre=2,useVB=!process.env.NOVB,say=()=>{}}={}){ const DEAD=Date.now()+ms; const T0=Date.now();
  const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const ex=Array.from({length:N},()=>gen()); const Ls=ex.map(e=>walk(e.mem)); const Ws=ex.map(e=>JSON.parse(e.want));
  const {L,V,U1,B2}=shelfKinds(sh);
  const byName=new Map(sh.named.map(b=>[b.name,b]));
  // שיבוץ כלי-מספר לתאים: כניסות ⇒ תא 2
  const placeCache=new Map(); const place=(name,ins)=>{ const k=name+'|'+ins.join(); if(placeCache.has(k)) return placeCache.get(k); const b=byName.get(name); let q=null;
    if(b){ const P=placements(b,6000).filter(z=>z.ins.join()===ins.join()&&z.out===2); q=P.find(z=>[...usedC(z.prog)].every(c=>c<8&&!FRAMECELLS.includes(c)||ins.includes(c)))||P.find(z=>[...usedC(z.prog)].every(c=>c<8))||null; }
    placeCache.set(k,q?q.prog:null); return q?q.prog:null; };
  // רצפי «לפני»: 0..maxPre משנים. לכל רצף — הזיכרון אחרי, והרשימה שנוצרה. «אחרי»: רק משנה-סדר (אותה קבוצה)
  let pres=[[]]; for(let k=1;k<=maxPre;k++) pres=[...pres,...pres.filter(s=>s.length===k-1).flatMap(s=>L.map(b=>[...s,b]))];
  const posts=[null,...L.filter(b=>b.setp)];
  const skels=[]; const memCache=new Map();
  // הזיכרון אחרי ה«לפני» — מריצים בדיוק את הקוד שהמסגרת תריץ (כלי שתלוי במקום שלו בתוכנית — נופל כאן ולא בבודק)
  const memsAfter=(pre,z)=>{ const k=pre.map(b=>b.name).join('⇒')+z; if(memCache.has(k)) return memCache.get(k); const code=assemble(listPart(pre.map(b=>b.prog),z));
    let ms=[]; for(const e of ex){ if(!pre.length){ ms.push(e.mem.slice()); continue; } const r=RUN(code,e.mem); if(!r||r.st.length){ ms=null; break; } ms.push(r.mem); } memCache.set(k,ms); return ms; };
  for(const pre of pres) for(const z of pre.length>1?[false,true]:[false]){ if(Date.now()>DEAD) break; const ms=memsAfter(pre,z); if(!ms) continue; const lps=ms.map(walk);
    for(const post of posts) for(const mode of ['filter','take','drop','filterMove','dropMove']){ if(post&&/Move/.test(mode)) continue;
      const sh2=lps.map((lp,i)=>shapeOf(lp,Ws[i],mode,!!post)); if(sh2.some(s=>!s)) continue;
      if(post){ let ok=true; for(let i=0;i<N&&ok;i++){ const q=relink(ms[i],sh2[i].kept); if(z) q[0]=0; const r=RUN(post.prog,q); if(!r||r.st.length||J(walk(r.mem))!==J(Ws[i])) ok=false; } if(!ok) continue; }
      // כל התוויות זהות ⇒ המסגרת לא עושה כלום / תמיד אותו דבר — זה תפקיד של רצף-כלים, לא של מסגרת
      const labs=sh2.flatMap(s=>s.vis.map(v=>v.lab)); if(!labs.some(x=>x)||!labs.some(x=>!x)) continue;
      skels.push({pre,post,mode,z,ms,lps,sh:sh2,cost:10*(pre.length+(post?1:0))+(z?1:0)}); } }
  say(`שלדים אפשריים: ${skels.length} · משנים ${L.length} · מחשבים ${V.length} · ${((Date.now()-T0)/1000).toFixed(1)} שנ׳`);
  const chk=makeChecker(gen,300,200000); let nChk=0;
  const tryProg=(spec,how)=>{ const p=scanFrame(spec); nChk++; if(!chk(p)) return null; if(finalCheck(p,gen,2000).bad) return null; return {prog:p,how}; };
  // לכל שלד: «עזרים» אפשריים ⇒ טבלת-תוויות (x, עזר) ⇒ כלי שנותן אותה
  const cands=[]; const pending=[];   // pending: טבלאות עקביות שאין להן כלי יחיד במדף — לבונה-הערכים
  for(const sk of skels){ if(Date.now()>DEAD) break;
    const X=[], LAB=[], EXI=[], VI=[]; sk.sh.forEach((s,e)=>s.vis.forEach(v=>{ X.push(sk.lps[e][v.i]); LAB.push(v.lab); EXI.push(e); VI.push(v.i); })); const n=X.length;
    const ctxs=[]; const sigSeen=new Set();
    const addCtx=(aux,A,cost,extra={})=>{ const sig=A?Array.from(A).join(','):'-'; if(sigSeen.has(sig)) return; sigSeen.add(sig); ctxs.push({aux,A,cost,...extra}); };
    addCtx({kind:'none'},null,0);
    { const A=new Uint8Array(n); for(let j=0;j<n;j++){ const e=EXI[j], i=VI[j], lp=sk.lps[e]; if(/^filter/.test(sk.mode)){ let q=1; for(let k=i-1;k>=0;k--) if(sk.sh[e].vis[k].lab===0){ q=lp[k]; break; } A[j]=q; } else A[j]=sk.mode==='take'?(i?lp[i-1]:1):1; } addCtx({kind:'p'},A,1,{cell:3}); }
    { const A=new Uint8Array(n); for(let j=0;j<n;j++){ const lp=sk.lps[EXI[j]]; A[j]=lp[VI[j]+1]||0; } addCtx({kind:'nx'},A,1); }
    { const A=new Uint8Array(n); for(let j=0;j<n;j++) A[j]=sk.ms[EXI[j]][1]; addCtx({kind:'V'},A,1,{name:'הראשון'}); }
    // ערך מכלי-רשימה: מחושב על הזיכרון שאחרי ה«לפני»; ונבדק בהרצה של הקוד המורכב עצמו על 30 דוגמאות
    const Vv=[]; for(const v of V){ const vals=sk.ms.map(m=>{ const r=RUN(v.prog,m); return r&&!r.st.length?r.mem[2]&15:-1; }); if(vals.some(x=>x<0)) continue;
      if(sk.pre.length){ const code=assemble(listPart([...sk.pre.map(b=>b.prog),v.prog],sk.z)); let ok=true; for(let i=0;i<30&&ok;i++){ const r=RUN(code,ex[i].mem); if(!r||r.st.length||(r.mem[2]&15)!==vals[i]||J(walk(r.mem))!==J(sk.lps[i])) ok=false; } if(!ok) continue; }
      Vv.push({v,vals}); const A=new Uint8Array(n); for(let j=0;j<n;j++) A[j]=vals[EXI[j]]; addCtx({kind:'V',tool:v.prog},A,2,{name:v.name}); }
    // מצב רץ: התחלה (קבוע 0..15 · הראשון · כלי-רשימה) × עדכון (העתק x · כלי חד-מקומי על המצב · כלי דו-מקומי (מצב,x)/(x,מצב)) × מתי (כל איבר / רק מי שנשאר)
    // (התחלה מכלי-רשימה — רק עם עדכון חד-מקומי: «כמה נשארו» = האורך, פחות 1 בכל צעד)
    const inits=[...Array.from({length:16},(_,k)=>({kind:'const',k})),{kind:'first'},...Vv.map(({v,vals})=>({kind:'tool',prog:v.prog,name:v.name,vals}))];
    const upds=[{kind:'copy',f:(s,x)=>x,name:'העתק x',cost:0},...U1.filter(t=>!/^קבוע|^העתק$/.test(t.name)).map(t=>({tool:t.name,ins:[5],f:(s,x)=>t.T[s],name:t.name,cost:1})),
      ...B2.flatMap(t=>[{tool:t.name,ins:[5,4],f:(s,x)=>t.T[s*16+x],name:t.name+'(מצב,x)',cost:2},{tool:t.name,ins:[4,5],f:(s,x)=>t.T[x*16+s],name:t.name+'(x,מצב)',cost:2}])];
    for(const pol of /^filter/.test(sk.mode)?['all','kept']:['all']) for(const u of upds) for(const init of inits){ if(init.kind==='tool'&&!(u.ins&&u.ins.length===1)) continue; const A=new Uint8Array(n); let j=0;
      for(let e=0;e<N;e++){ let s=init.kind==='const'?init.k:init.kind==='tool'?init.vals[e]:sk.ms[e][1]; const lp=sk.lps[e]; for(const v of sk.sh[e].vis){ A[j++]=s; const x=lp[v.i]; if(pol==='all'||v.lab===0) s=u.f(s,x); } }
      addCtx({kind:'S',init},A,3+u.cost+(pol==='kept'?0.5:0)+(init.kind==='const'?0.1:init.kind==='tool'?1:0),{name:`מצב: ${init.kind==='const'?'מ-'+init.k:init.kind==='tool'?'מ'+init.name:'מהראשון'} · ${u.name}${pol==='kept'?' · רק כשנשאר':''}`,upd:u,policy:pol}); }
    // עקביות: התווית היא פונקציה של (x), של (עזר), או של (x, עזר)? — אם של x לבד: לא צריך עזר בכלל
    { const tab=new Int8Array(16).fill(-1); let ok=true; for(let j=0;j<n&&ok;j++){ if(tab[X[j]]<0) tab[X[j]]=LAB[j]; else if(tab[X[j]]!==LAB[j]) ok=false; } if(ok) ctxs.splice(1); }
    for(const c of ctxs){ for(const key of c.A?['A','xA']:['x']){ const tab=new Int8Array(256).fill(-1); let ok=true;
        for(let j=0;j<n;j++){ const k=key==='x'?X[j]:key==='A'?c.A[j]:X[j]*16+c.A[j]; if(tab[k]<0) tab[k]=LAB[j]; else if(tab[k]!==LAB[j]){ ok=false; break; } } if(!ok) continue;
        const keys=[...tab.keys()].filter(k=>tab[k]>=0); const ACELL=c.aux.kind==='p'?3:5;
        const base={sk,c,key,keys,tab,cost:sk.cost+c.cost+(key==='xA'?0.5:0)};
        let found=0;
        if(key==='x'||key==='A'){ for(const t of U1){ const v=keys.map(k=>truthy(t.T[k])===!!tab[k]); const all=v.every(Boolean), none=v.every(z=>!z); if(!all&&!none) continue; cands.push({...base,tool:t.name,ins:[key==='x'?4:ACELL],neg:none,cost:base.cost+0.01*(byName.get(t.name)?.prog.length||0)}); found++; } }
        else { for(const t of B2) for(const ord of ['xA','Ax']){ const v=keys.map(k=>{ const x=k>>4, a=k&15; return truthy(t.T[ord==='xA'?x*16+a:a*16+x])===!!tab[k]; }); const all=v.every(Boolean), none=v.every(z=>!z); if(!all&&!none) continue;
            cands.push({...base,tool:t.name,ins:ord==='xA'?[4,ACELL]:[ACELL,4],neg:none,cost:base.cost+0.01*(byName.get(t.name)?.prog.length||0)}); found++; } }
        if(!found) pending.push(base);
        break; }   // אם התווית תלויה רק בעזר — לא מחפשים גם (x, עזר)
    } }
  cands.sort((a,b)=>a.cost-b.cost); say(`מועמדים מהמדף: ${cands.length} · טבלאות בלי כלי: ${pending.length} · ${((Date.now()-T0)/1000).toFixed(1)} שנ׳`);
  const specOf=(cd,condProg)=>{ const {sk,c}=cd; const md=sk.mode.replace('Move',''); const lab1={filter:'remove',take:'cut',drop:'drop'}[md], lab0={filter:'keep',take:'cont',drop:'stop'}[md];
    let upd=null; if(c.aux.kind==='S'){ if(c.upd.kind==='copy') upd={kind:'copy'}; else { const pp=place(c.upd.tool,c.upd.ins); if(!pp) return null; upd={prog:pp}; } }
    return {mode:md,move:/Move/.test(sk.mode),z:sk.z,onTrue:cd.neg?lab0:lab1,pre:sk.pre.map(b=>b.prog),post:sk.post?[sk.post.prog]:[],aux:c.aux,cond:{prog:condProg},upd,policy:c.policy||'all'}; };
  const howOf=(cd,condName)=>{ const {sk,c}=cd; const fr={filter:'סנן',take:'קח-כל-עוד',drop:'דלג-כל-עוד',filterMove:'סנן-והעבר-לסוף',dropMove:'דלג-כל-עוד-והעבר-לסוף'}[sk.mode]; const md=sk.mode.replace('Move',''); const act={filter:cd.neg?'השאר':'הוצא',take:cd.neg?'המשך':'חתוך',drop:cd.neg?'עצור':'דלג'}[md];
    const aux=c.aux.kind==='none'?'':c.aux.kind==='p'?' · עזר=הקודם':c.aux.kind==='nx'?' · עזר=הבא':c.aux.kind==='V'?` · עזר=${c.name}`:` · ${c.name}`;
    return `${sk.pre.map(b=>b.name+' ⇒ ').join('')}${fr} [${act} כש${condName}${aux}]${sk.post?' ⇒ '+sk.post.name:''}`; };
  const fails=new Map(); const CAP=+process.env.CUTCAP||12;   // שלד שנכשל בבודק שוב ושוב (למשל כלי שתלוי במקומו בתוכנית) — עוזבים אותו
  for(const cd of cands){ if(Date.now()>DEAD) return {prog:null,timeout:true,nskel:skels.length,ncand:cands.length,nchk:nChk}; if((fails.get(cd.sk)||0)>=CAP) continue;
    const pp=place(cd.tool,cd.ins); if(!pp) continue; const spec=specOf(cd,pp); if(!spec) continue;
    const r=tryProg(spec,howOf(cd,`${cd.tool}(${cd.ins.map(c=>c===4?'x':'עזר').join(',')})`)); if(r) return {...r,nskel:skels.length,ncand:cands.length,nchk:nChk,ms:Date.now()-T0}; fails.set(cd.sk,(fails.get(cd.sk)||0)+1); }
  // אין כלי יחיד: בונה-הערכים מחפש צירוף שנותן את הטבלה (רק על הזוגות שנראו), והמסגרת עוטפת אותו
  if(useVB){ pending.sort((a,b)=>a.cost-b.cost||a.keys.length-b.keys.length); const tried=new Set();
    for(const pd of pending.slice(0,+process.env.CUTVB||6)){ if(Date.now()>DEAD-20000) break; const ACELL=pd.c.aux.kind==='p'?3:5; const ins=pd.key==='x'?[4]:pd.key==='A'?[ACELL]:[4,ACELL];
      const sig=pd.key+'|'+pd.keys.map(k=>k+':'+pd.tab[k]).join(','); if(tried.has(sig)) continue; tried.add(sig);
      for(const neg of [false,true]){ if(Date.now()>DEAD-20000) break;
        const g=()=>{ const k=pd.keys[R(pd.keys.length)]; const m=Array.from({length:16},()=>R(16)); if(ins.length===1) m[ins[0]]=k; else { m[4]=k>>4; m[ACELL]=k&15; } const w=(!!pd.tab[k])!==neg?15:0; const m0=m.slice();
          return {mem:m,want:w,ok:r=>r[2]===w&&ins.every(c=>r[c]===m0[c])&&[8,9,10,11,12,13,14,15].every(c=>r[c]===m0[c])}; };
        const v=valueBuild(g,{name:'תנאי-רשימה (מסגרת)',ins,out:2,ms:Math.min(60000,DEAD-Date.now()-15000)}); if(!v.prog) continue;
        const cd={...pd,neg}; const spec=specOf(cd,v.prog); if(!spec) continue; const r=tryProg(spec,howOf(cd,`[צירוף: ${v.expr?showE(v.expr):'?'}]`));
        if(r) return {...r,nskel:skels.length,ncand:cands.length,nchk:nChk,ms:Date.now()-T0,vb:true}; } } }
  return {prog:null,nskel:skels.length,ncand:cands.length,npending:pending.length,nchk:nChk,ms:Date.now()-T0}; }
const showE=e=>e.cell!=null?(e.cell===4?'x':'עזר'):`${e.f}(${showE(e.a)}${e.b?', '+showE(e.b):''}${e.c?', '+showE(e.c):''})`;
