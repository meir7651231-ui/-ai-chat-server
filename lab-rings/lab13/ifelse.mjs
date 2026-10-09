// «אם-אחרת»: אם [תנאי על כל הרשימה] אז [צעד א] אחרת [צעד ב] — הרחבה של «אם-רשימה» (ifpos.mjs), שם «אחרת» = בלי שינוי.
//   הצעדים: הכלים הבטוחים-לשרשרת של רצף-מקום (stepTools: מדף, סינונים, על-כל-זנב, סובב-אל, סינון-לפי-מקום) ועוד «בלי שינוי».
//     אם אין במדף צעד מתאים — סינון-לפי-ערך נלמד מהדוגמאות: ברשימה מלאה (8 איברים) רואים בדיוק מה נשאר ומה הוצא ⇒ עד שתי טבלאות ⇒ תנאי-ערך מהמדף או נבנה (בונה-ערכים) ⇒ מסגרת-סינון.
//   התנאי: סטטיסטיקה אחת או שתיים (כלי רשימה⇒מספר מהמדף, בגרסה בטוחה-לשרשרת) ⇒ פעולה מהמדף (חד- או דו-מקומית);
//     ואם אין — טבלת אמת/שקר שהדוגמאות מחייבות (על ערך אחד, או על זוג ערכים) נבנית ע"י בונה-הערכים ונשמרת במדף.
//   מהיר: קודם מחשבים איזה צעד נותן את התשובה באיזו דוגמה; רק זוגות (א,ב) שביחד מכסים את כל הדוגמאות; רק אז מתאימים תנאי.
//   «לא אכפת»: דוגמה שבה שני הצעדים נותנים את התשובה — התנאי חופשי בה.
//   טבלה נלמדת רק אם היא מסכימה עם כל ~2300 הדוגמאות ו«סגורה»: כמעט אין תאים שנראו פעם אחת בלבד (אחרת זו שינון).
import fs from 'fs'; import { run } from './machine3s.mjs'; import { makeChecker, finalCheck, movable, placements } from './tzoref.mjs'; import { valueBuild } from './tzoref-value.mjs';
import { runFastG, encodeG, walk, walkA, shift, Z, chainSafeLN, chainSafeLL } from './chainsafe.mjs'; import { assemble } from './posframes.mjs';
import { stepTools, pickExamplesFor } from './poscompose.mjs'; import { learnValCond } from './ifpos.mjs'; import { filterFrame } from './filtcomp.mjs';
const R=k=>Math.floor(Math.random()*k); const J=JSON.stringify;
const PADN=14, PAD=Array.from({length:PADN},(_,i)=>i%2?['GO']:['WHERE',0]); const encP=p=>encodeG([...PAD,...shift(p,PADN)]);
const usedC=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]));
const T=c=>[['WHERE',c],['GO'],['TAKE']], P=c=>[['WHERE',c],['GO'],['PUT']];
const PUSH15=[...T(4),['TAKE'],['CALC'],['TAKE'],['CALC']]; const GOTO=l=>[...PUSH15,['J',l]]; const ZC={code:Z};
// תאים שהפעולה עלולה לדרוס ושהמסגרת צריכה: ראש-הרשימה (1) ותאי-הרשימה (8..15). «לאן מהמחסנית» ⇒ שומרים את כולם.
const guard=(op,withHead)=>{ if(!op) return []; const all=op.some(x=>x[0]==='WHERE@'); const U=usedC(op); return [...(withHead?[1]:[]),8,9,10,11,12,13,14,15].filter(c=>all||U.has(c)); };
// המסגרת. c = {p1, p2?, op?, neg}: p1/p2 = כלי רשימה⇒מספר (בטוחים-לשרשרת); op = פעולה מהמדף (קוראת תא 0, או תאים 0,1) ⇒ תא 2; neg = הצעד א רץ כשהתשובה 0.
export function ifElseFrame(c,A,B){ const cond=[];
  if(c.p2){ const sv=guard(c.op,false);   // שתי סטטיסטיקות: ראש-הרשימה למחסנית, s1 למחסנית, s2 ⇒ תא 1, s1 ⇒ תא 0, פעולה, ראש-הרשימה חוזר
    cond.push(...T(1), ZC,{code:c.p1}, ...T(2), ZC,{code:c.p2}, ...T(2),...P(1), ...P(0), ...sv.flatMap(T), ZC,{code:c.op}, ...[...sv].reverse().flatMap(P), ...P(1)); }
  else { cond.push(ZC,{code:c.p1}); if(c.op){ const sv=guard(c.op,true); cond.push(...T(2),...P(0), ...sv.flatMap(T), ZC,{code:c.op}, ...[...sv].reverse().flatMap(P)); } }
  return assemble([...cond, ...T(2),['J',c.neg?'ELSE':'THEN'], ...GOTO(c.neg?'THEN':'ELSE'),
    'THEN', ZC,{code:A}, ...GOTO('END'),
    'ELSE', ZC,{code:B},
    'END']); }
// פעולות מהמדף: טבלה מלאה (חד-מקומית: תא 0; דו-מקומית: תאים 0,1), רק אם התשובה תלויה בקלט בלבד. נשמר רק «לא-אפס?» — זה מה שהמסגרת בודקת.
function shelfOps(sh,k){ const out=[], seen=new Set(); const key=k===1?'0':'0,1', N=k===1?16:256;
  for(const b of sh.named){ if(b.bad||(b.ins||[]).join()!==key||(b.out??2)!==2||b.prog.length>250||b.prog.some(x=>x[0]==='WHERE@')) continue;
    const nz=new Uint8Array(N); let ok=true; for(let x=0;x<N&&ok;x++){ let z=null; for(let t=0;t<3;t++){ const m=Array.from({length:16},()=>R(16)); if(k===1) m[0]=x; else { m[0]=x>>4; m[1]=x&15; } const r=run([...Z,...b.prog],m,{maxSteps:20000}); if(!r||r.st.length){ ok=false; break; } const y=r.mem[2]&15; if(z===null) z=y; else if(z!==y){ ok=false; break; } } nz[x]=z?1:0; }
    if(!ok||nz.every(x=>x===nz[0])) continue; const s=nz.join(''); if(seen.has(s)) continue; seen.add(s); out.push({name:b.name,prog:b.prog,nz}); } return out; }
// סטטיסטיקות: כלי רשימה⇒מספר בטוחים-לשרשרת (מ-stepTools), ועוד כלים בלי «לאן מהמחסנית» ששומרים על הרשימה (למשל «הראשון»). קבועים וכפולים — נזרקים.
function statTools(sh,ex,LN){ const out=[], sig=new Set(); const add=(name,prog)=>{ const C=encP(prog); const v=[]; for(const e of ex){ const m=runFastG(C,e.mem,PADN,300000); if(!m) return; v.push(m[2]&15); } if(v.every(x=>x===v[0])) return; const k=J(v); if(sig.has(k)) return; sig.add(k); out.push({name,prog,C}); };
  for(const l of [...LN].sort((a,b)=>a.prog.length-b.prog.length)) add(l.name,l.prog);
  for(const b of sh.named){ if(b.bad||b.prog.length>200||b.prog.some(x=>x[0]==='WHERE@')) continue; let keeps=true, ok=true; const bc=encodeG(b.prog);
    for(const e of ex){ const r=runFastG(bc,e.mem,0,200000); if(!r){ ok=false; break; } if(r[1]!==e.mem[1]||walk(e.mem).some(x=>r[x]!==e.mem[x])){ keeps=false; break; } }
    if(!ok||!keeps) continue; const s=chainSafeLN(b.prog,ex); if(s) add(b.name,s.prog); }
  return out; }
// סינון-לפי-ערך שנלמד מהדוגמאות: ברשימה מלאה (כל 8 הערכים) הפלט, אם הוא תת-רשימה, קובע בדיוק טבלה «נשאר/הוצא». עד שתי טבלאות שחוזרות.
//   חסרה טבלה (למשל ברשימה מלאה תמיד מנצח אותו צד)? הדוגמאות שאף טבלה לא מסבירה מתאחדות לטבלה נוספת (מהארוכה לקצרה; דוגמה סותרת — מדלגים), אם כל 8 הערכים נקבעו.
export function filterTables(exs){ const subs=[]; for(const e of exs){ const l=walk(e.mem); if(!l.length) continue; const w=JSON.parse(e.want); let j=0; for(const x of l) if(j<w.length&&w[j]===x) j++; if(j!==w.length) continue; const keep=new Set(w); subs.push({l,rm:l.map(x=>!keep.has(x))}); }
  const cnt=new Map(); for(const s of subs){ if(s.l.length!==8||s.rm.every(x=>!x)||s.rm.every(x=>x)) continue; const tab=Array.from({length:16},()=>false); s.l.forEach((x,i)=>{ tab[x]=s.rm[i]; }); const k=J(tab); cnt.set(k,(cnt.get(k)||0)+1); }
  const tabs=[...cnt].filter(([,n])=>n>=2).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([k])=>JSON.parse(k));
  const fits=(tab,s)=>s.l.every((x,i)=>tab[x]===s.rm[i]);
  while(tabs.length<2){ const res=subs.filter(s=>!tabs.some(t=>fits(t,s))).sort((a,b)=>b.l.length-a.l.length); const cur=Array(16).fill(null); let n=0;
    for(const s of res){ if(s.l.some((x,i)=>cur[x]!==null&&cur[x]!==s.rm[i])) continue; s.l.forEach((x,i)=>{ cur[x]=s.rm[i]; }); n++; }
    const v=cur.slice(8); if(n<3||v.includes(null)||v.every(x=>x)||v.every(x=>!x)) break; tabs.push(cur.map(x=>!!x)); }
  return tabs; }
export async function filterStep(tab,ex,{ops1,say,ms,learn}){ // tab[v]=true ⇒ v מוצא
  const rm=[8,9,10,11,12,13,14,15].map(v=>tab[v]?1:0).join(''); let cond=null, name=null, remove=true;
  for(const o of ops1){ const p=[8,9,10,11,12,13,14,15].map(v=>o.nz[v]).join(''); if(p===rm){ cond=o; remove=true; break; } if(p===rm.replace(/./g,d=>d==='1'?'0':'1')){ cond=o; remove=false; break; } }
  if(!cond){ if(!learn) return null; const c=await learnValCond(tab,{say,ms}); if(!c) return null; cond={name:c.name,prog:c.prog,learned:c.learned}; remove=true; }
  const q=placements({name:cond.name,prog:cond.prog,ins:[0],out:2},6000).find(z=>z.ins.join()==='4'&&z.out===2); if(!q) return {fail:true};
  const sv=guard(q.prog,false); const cp=sv.length?assemble([...sv.flatMap(T),{code:q.prog},...[...sv].reverse().flatMap(P)]):q.prog;   // תנאי שנוגע בתאי-הרשימה (8..15) — שומרים ומחזירים אותם סביבו
  const f=filterFrame(cp,remove); const s=chainSafeLL(f,ex); if(!s) return {fail:true};
  return {name:`${remove?'הוצא':'השאר רק'} ערכים ש[${cond.name}]`,prog:s.prog,learned:cond.learned?cond.name:null}; }
// לומד פעולה דו-מקומית מטבלת אמת/שקר על זוגות (x,y) שנראו. «לא אכפת» על זוגות שלא נראו. נשמר במדף + מטרה (ההתנהגות בפועל על כל 256).
export async function learnPairCond(tab,{say=()=>{},ms=90000}={}){ const K=[...tab.keys()].sort((a,b)=>a-b); const tr=K.filter(k=>tab.get(k)), fa=K.filter(k=>!tab.get(k));
  const fmt=L=>L.map(k=>`${k>>4}.${k&15}`).join(','); const name=`זוג-ערכים: כן ${fmt(tr)} · לא ${fmt(fa)}`;
  const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const have=sh.named.find(b=>b.name===name); if(have) return {name,prog:have.prog,learned:false};
  const gen=()=>{ const k=K[R(K.length)]; const mem=Array.from({length:16},()=>R(16)); mem[0]=k>>4; mem[1]=k&15; const w=tab.get(k)?15:0, a=mem[0], b=mem[1]; return {mem,want:w,ok:r=>r[2]===w&&r[0]===a&&r[1]===b}; };
  say(`  לומד פעולה דו-מקומית «${name}» (בונה-ערכים)…`); const v=valueBuild(gen,{name,ins:[0,1],out:2,ms}); if(!v.prog) return null;
  for(const k of K) for(let t=0;t<4;t++){ const m=Array.from({length:16},()=>R(16)); m[0]=k>>4; m[1]=k&15; const r=run(v.prog,m,{maxSteps:50000}); if(!r||r.st.length||((r.mem[2]&15)!==0)!==tab.get(k)) return null; }
  if(finalCheck(v.prog,gen,4000).bad) return null;
  const tt=Array.from({length:256},(_,x)=>{ const m=Array.from({length:16},()=>R(16)); m[0]=x>>4; m[1]=x&15; const r=run(v.prog,m,{maxSteps:50000}); return r&&!r.st.length?r.mem[2]&15:0; });
  const S2=JSON.parse(fs.readFileSync('shelf3.json','utf8')); S2.named.push({name,prog:v.prog,ins:[0,1],out:2,movable:movable(v.prog,gen),by:'נלמד: תנאי דו-מקומי (אם-אחרת)'}); fs.writeFileSync('shelf3.json',JSON.stringify(S2));
  const LG=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); LG[name]={ins:[0,1],tt}; fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(LG));
  return {name,prog:v.prog,learned:true}; }

// סטטיסטיקה על מה שצעד מייצר («כמה נשארים אחרי הסינון»): שומרים את הרשימה במחסנית, מריצים את הצעד ואחריו את הסטטיסטיקה, מחזירים את הרשימה (תא 2 לא נוגעים בו)
const LISTC=[1,8,9,10,11,12,13,14,15];
export const derivedStat=(step,stat)=>assemble([...LISTC.flatMap(T), ZC,{code:step}, ZC,{code:stat}, ...[...LISTC].reverse().flatMap(P)]);
export async function ifElseCompose(gen,{ms=+process.env.IFEMS||200000,learn=true,say=()=>{},maxLearn=3,dmax=(process.env.IFEDMAX!=null?+process.env.IFEDMAX:100)}={}){ const T0=Date.now(), DEAD=T0+ms; const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8'));
  const ex=pickExamplesFor(gen); const more=Array.from({length:300},()=>gen()); const val=Array.from({length:2000},()=>gen());
  const ALL=[...ex,...more,...val], NA=ALL.length; const wantS=ALL.map(e=>J(JSON.parse(e.want)));
  if(ALL.every((e,i)=>J(walk(e.mem))===wantS[i])) return {prog:null,why:'אין שינוי'};
  const {tools:T0s,LN}=stepTools(ex,{sh,say}); const tools=[{name:'בלי שינוי',prog:[],P:encP([])},...T0s];
  const stats=statTools(sh,ex,LN); const ops1=shelfOps(sh,1), ops2=shelfOps(sh,2);
  const sigOf=v=>Buffer.from(v).toString('latin1'); const baseSig=new Set();
  const base=[]; for(const s of stats){ const v=new Uint8Array(NA); let ok=true; for(let i=0;i<NA;i++){ const m=runFastG(s.C,ALL[i].mem,PADN,300000); if(!m){ ok=false; break; } v[i]=m[2]&15; } if(!ok) continue; const k=sigOf(v); if(baseSig.has(k)) continue; baseSig.add(k); base.push({name:s.name,prog:s.prog,C:s.C,v}); }
  const cheap=base.filter(s=>s.prog.length<=dmax);
  say(`  אם-אחרת: צעדים ${tools.length} · סטטיסטיקות ${base.length} (זולות ${cheap.length}) · פעולות ${ops1.length}+${ops2.length} · ${((Date.now()-T0)/1000).toFixed(1)} שנ׳`);
  const chk=makeChecker(gen,300,600000);
  const verify=p=>{ for(const e of more){ const r=run(p,e.mem,{maxSteps:50000}); if(!r||r.st.length||!e.ok(r.mem)) return false; } return chk(p); };
  // איזה צעד עובד באיזו דוגמה (קודם על הדוגמאות הראשונות; על כולן — רק לצעדים שנכנסים לזוג מכסה). שומרים גם את הזיכרון שאחרי הצעד (לסטטיסטיקות-על-צעד)
  const worksOn=(t,i)=>{ const m=runFastG(t.P,ALL[i].mem,PADN,300000); return !!m&&J(walkA(m))===wantS[i]; };
  const fullW=t=>{ if(!t.W){ t.W=new Uint8Array(NA); t.M=new Array(NA); for(let i=0;i<NA;i++){ const m=runFastG(t.P,ALL[i].mem,PADN,300000); t.M[i]=m; t.W[i]=!!m&&J(walkA(m))===wantS[i]?1:0; } } return t.W; };
  const derivedOf=X=>{ if(X.D) return X.D; X.D=[]; if(!X.prog.length) return X.D; fullW(X);
    for(const s of cheap){ const v=new Uint8Array(NA); let ok=true; for(let i=0;i<NA;i++){ const m=X.M[i]; const r=m&&runFastG(s.C,m,PADN,300000); if(!r){ ok=false; break; } v[i]=r[2]&15; } if(!ok||v.every(x=>x===v[0])) continue;
      X.D.push({name:`${s.name} של [${X.name}]`,prog:derivedStat(X.prog,s.prog),v,derived:true}); } return X.D; };
  const learnQ=[]; let nPairs=0;
  const tryTools=async(TL)=>{ for(const t of TL) if(!t.wEx){ t.wEx=new Uint8Array(ex.length); for(let i=0;i<ex.length;i++) t.wEx[i]=worksOn(t,i)?1:0; }
    const pairs=[]; for(let a=0;a<TL.length;a++) for(let b=a+1;b<TL.length;b++){ const A=TL[a], B=TL[b]; let cov=true, fa=true, fb=true; for(let i=0;i<ex.length;i++){ if(!A.wEx[i]&&!B.wEx[i]){ cov=false; break; } if(!A.wEx[i]) fa=false; if(!B.wEx[i]) fb=false; } if(cov&&(fa||fb)){ fa=fullW(A).every(x=>x); fb=fullW(B).every(x=>x); } if(cov&&!fa&&!fb) pairs.push([A,B]); }   // צעד שעובד על כל הדוגמאות הראשונות — אולי הענף השני נדיר: בודקים על כולן
    pairs.sort((x,y)=>x[0].prog.length+x[1].prog.length-y[0].prog.length-y[1].prog.length);
    for(const [A,B] of pairs){ if(Date.now()>DEAD) return null; const WA=fullW(A), WB=fullW(B); let cov=true; for(let i=0;i<NA;i++) if(!WA[i]&&!WB[i]){ cov=false; break; } if(!cov) continue; nPairs++;
      const need=new Int8Array(NA); const dec=[]; for(let i=0;i<NA;i++){ need[i]=WA[i]&&!WB[i]?1:!WA[i]&&WB[i]?0:-1; if(need[i]>=0) dec.push(i); }
      if(!dec.some(i=>need[i]===1)||!dec.some(i=>need[i]===0)) continue;
      const fit=f=>{ let pos=true, neg=true; for(const i of dec){ const c=f(i); if(c!==need[i]) pos=false; else neg=false; if(!pos&&!neg) return 0; } return pos?1:-1; };
      const tryC=async(c,nm)=>{ const p=ifElseFrame(c,A.prog,B.prog); if(verify(p)) return {prog:p,how:`אם ${c.neg?'לא ':''}[${nm}] אז [${A.name}] אחרת [${B.name}]`,ms:Date.now()-T0}; return null; };
      // שלב א: סטטיסטיקות מהמדף; שלב ב: גם סטטיסטיקות על מה ששני הצעדים מייצרים (רק צירופים שיש בהם לפחות אחת כזו)
      const stage=async(SL,onlyNew)=>{ const c1=[];
        for(const s of SL){ if(onlyNew&&!s.derived) continue; const v=s.v; let f=fit(i=>v[i]?1:0); if(f) c1.push([{p1:s.prog,neg:f<0},s.name]);
          for(const o of ops1){ f=fit(i=>o.nz[v[i]]); if(f) c1.push([{p1:s.prog,op:o.prog,neg:f<0},`${o.name}(${s.name})`]); } }
        for(const [c,nm] of c1.slice(0,6)){ const r=await tryC(c,nm); if(r) return r; }
        const c2=[]; for(const sa of SL){ if(c2.length>=6) break; for(const sb of SL){ if(c2.length>=6) break; if(sa===sb||(onlyNew&&!sa.derived&&!sb.derived)) continue; const va=sa.v, vb=sb.v;
            for(const o of ops2){ const f=fit(i=>o.nz[va[i]*16+vb[i]]); if(f){ c2.push([{p1:sa.prog,p2:sb.prog,op:o.prog,neg:f<0},`${o.name}(${sa.name}, ${sb.name})`]); break; } } } }
        for(const [c,nm] of c2){ const r=await tryC(c,nm); if(r) return r; } return null; };
      let r=await stage(base,false); if(r) return r;
      const ds=new Set(baseSig); const D=[]; for(const d of [...derivedOf(A),...derivedOf(B)]){ const k=sigOf(d.v); if(ds.has(k)) continue; ds.add(k); D.push(d); }
      const SL=[...base,...D]; if(D.length){ r=await stage(SL,true); if(r) return r; }
      // טבלאות ללימוד: חייבות להסכים על כל הדוגמאות; ו«סגורות»: כמעט אין תאים שנראו רק פעם אחת (הערכת גוד-טיורינג לתא שעוד לא נראה ≤ 0.5%) — אחרת זה שינון
      const TB=new Int8Array(256), CN=new Uint16Array(256);
      const tableOf=(key)=>{ TB.fill(-1); CN.fill(0); for(const i of dec){ const k=key(i); if(TB[k]>=0&&TB[k]!==need[i]) return null; TB[k]=need[i]; CN[k]++; }
        let singles=0, t1=0, t0=0; const tab=new Map(); for(let k=0;k<256;k++) if(CN[k]){ if(CN[k]===1) singles++; tab.set(k,TB[k]===1); if(TB[k]===1) t1++; else t0++; }
        if(singles>0.005*dec.length||!t1||!t0) return null; return tab; };
      const lenOf=s=>s.prog.length;
      for(const sa of SL){ const tab=tableOf(i=>sa.v[i]); if(tab) learnQ.push({A,B,k:1,s1:sa,tab,size:tab.size,len:A.prog.length+B.prog.length+lenOf(sa)}); }
      for(let a=0;a<SL.length;a++) for(let b=a+1;b<SL.length;b++){ const sa=SL[a], sb=SL[b]; const tab=tableOf(i=>sa.v[i]*16+sb.v[i]); if(tab) learnQ.push({A,B,k:2,s1:sa,s2:sb,tab,size:tab.size,len:A.prog.length+B.prog.length+lenOf(sa)+lenOf(sb)}); } }
    return null; };
  let r=await tryTools(tools); if(r) return r;
  // אין במדף צעד מתאים? סינון-לפי-ערך שנלמד מהרשימות (עד שתי טבלאות)
  const fts=filterTables([...ALL,...Array.from({length:600},()=>gen())]); const extra=[];
  for(const tab of fts){ let s=null; for(let tr=0;tr<2&&!s&&Date.now()<DEAD;tr++) s=await filterStep(tab,ex,{ops1,say,learn,ms:Math.min(90000,Math.max(5000,DEAD-Date.now()))}); if(!s||s.fail) continue;   // בונה-הערכים אקראי ⇒ ניסיון שני (רק אם הלימוד עצמו נכשל)
    const t={name:s.name,prog:s.prog,P:encP(s.prog),learnedStep:s.learned}; const o=ex.map(e=>{ const m=runFastG(t.P,e.mem,PADN,300000); return m?J(walkA(m)):null; });
    if(o.includes(null)) continue; if(tools.some(u=>{ if(!u.sig) u.sig=J(ex.map(e=>{ const m=runFastG(u.P,e.mem,PADN,300000); return m?J(walkA(m)):null; })); return u.sig===J(o); })) continue; extra.push(t); }
  if(extra.length){ say(`  סינונים שנלמדו: ${extra.map(t=>t.name).join(' | ')}`); r=await tryTools([...tools,...extra]); if(r) return {...r,learnedSteps:extra.filter(t=>t.learnedStep).map(t=>t.learnedStep)}; }
  if(!learn) return {prog:null,pairs:nPairs,learnable:learnQ.length,ms:Date.now()-T0};
  // לימוד תנאי: קודם על סטטיסטיקה אחת, אחר-כך על זוג; טבלה קטנה (פחות תאים) וקוד קצר — קודם
  const seenTab=new Set(); const Q=learnQ.sort((x,y)=>x.k-y.k||x.size-y.size||x.len-y.len).filter(q=>{ const key=q.k+J([...q.tab].sort((a,b)=>a[0]-b[0]))+q.A.name+'|'+q.B.name; if(seenTab.has(key)) return false; seenTab.add(key); return true; });
  say(`  זוגות מכסים ${nPairs} · טבלאות ללימוד ${Q.length}${Q.length?` (הראשונה: ${Q[0].k===1?Q[0].s1.name:Q[0].s1.name+' × '+Q[0].s2.name}, ${Q[0].size} תאים)`:''}`);
  let nl=0; const failedTab=new Set();
  for(const q of Q){ if(Date.now()>DEAD||nl>=maxLearn) break; const tkey=q.k+J([...q.tab].sort((a,b)=>a[0]-b[0])); if(failedTab.has(tkey)) continue;
    const left=Math.min(90000,Math.max(5000,DEAD-Date.now())); nl++; let c=null, nm='';
    if(q.k===1){ const tab=Array.from({length:16},(_,v)=>!!q.tab.get(v)); const o=await learnValCond(tab,{say,ms:left}); if(o){ c={p1:q.s1.prog,op:o.prog,neg:false,learned:o.learned?o.name:null}; nm=`${o.name}(${q.s1.name})`; } }
    else { const o=await learnPairCond(q.tab,{say,ms:left}); if(o){ c={p1:q.s1.prog,p2:q.s2.prog,op:o.prog,neg:false,learned:o.learned?o.name:null}; nm=`${o.name}(${q.s1.name}, ${q.s2.name})`; } }
    if(!c){ failedTab.add(tkey); continue; }
    const p=ifElseFrame(c,q.A.prog,q.B.prog); if(verify(p)) return {prog:p,how:`אם [${nm}] אז [${q.A.name}] אחרת [${q.B.name}]${c.learned?' (פעולה נלמדה עכשיו)':''}`,learned:c.learned,ms:Date.now()-T0}; }
  return {prog:null,pairs:nPairs,learnable:Q.length,ms:Date.now()-T0}; }

// הרצה ישירה: node ifelse.mjs <קובץ-משימות> [שם|שם…] — עם הבדיקות הקשוחות (20000 דוגמאות, ריפוד-ממולכד). FRESH=קובץ-מדף ⇒ מדף נקי לפני כל משימה.
if((process.argv[1]||'').endsWith('ifelse.mjs')){ const { llGen }=await import('./listlist.mjs'); const { deepRelocOk }=await import('./jumpfix.mjs'); const genFor=t=>llGen(new Function('return ('+t.src+')')());   // כמו genFor של המוח (רשימה⇒רשימה) — בלי לייבא אותו (מעגל)
  const file=process.argv[2]; const only=process.argv[3]?new Set(process.argv[3].split('|')):null; const S=JSON.parse(fs.readFileSync(file,'utf8')).tasks.filter(t=>t.kind==='list2list'&&(!only||only.has(t.name))); let n=0;
  for(const t of S){ if(process.env.FRESH){ fs.copyFileSync(process.env.FRESH,'shelf3.json'); fs.copyFileSync(process.env.FRESHG,'tzoref-learned-goals.json'); }
    const gen=genFor(t); const t0=Date.now(); const r=await ifElseCompose(gen,{say:process.env.V?console.log:()=>{}}); const sec=(Date.now()-t0)/1000;
    let fc=null, dr=null; if(r.prog){ fc=finalCheck(r.prog,gen,20000).bad; dr=deepRelocOk(r.prog,gen); } const ok=!!r.prog&&fc===0&&dr; if(ok) n++;
    console.log(`${ok?'✓':'✗'} ${t.name}: ${r.prog?`${r.prog.length} פקודות · ${r.how} · בדיקה-סופית ${fc}/20000 · ריפוד-ממולכד ${dr?'עבר':'נכשל'}`:'לא נמצא'+(r.pairs!=null?` (זוגות מכסים ${r.pairs}, טבלאות ${r.learnable})`:'')} · ${sec.toFixed(1)} שנ׳`);
    if(process.env.OUT) fs.appendFileSync(process.env.OUT,J({name:t.name,ok,len:r.prog?.length??null,how:r.how||null,fc,dr,sec,prog:r.prog||null})+'\n'); }
  console.log(`סך: ${n}/${S.length}`); process.exit(0); }
