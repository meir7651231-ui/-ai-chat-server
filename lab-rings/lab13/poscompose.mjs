// «רצף-מקום»: מרכיב רשימה⇒רשימה מרצף של עד 4 צעדים. צעד = כלי-רשימה מהמדף (בגרסה בטוחה-לשרשרת), או מסגרת-מקום שהחריץ שלה מולא מהמדף:
//   סינון-לפי-מקום [תנאי-מספר על המקום] · על-כל-זנב [כלי-רשימה] · סובב-אל [כלי רשימה⇒מספר].
// החיפוש: לרוחב, ומצבים כפולים (אותן רשימות בכל הדוגמאות) נזרקים — כך 4 צעדים לא מתפוצצים.
//   גיזום: צעדים לא יוצרים ערכים, אז מצב שכבר איבד איבר שצריך להופיע בתשובה — מת.
//   הצעד האחרון רק נבדק מול התשובה, ונעצר בדוגמה הראשונה שנכשלת.
// אם התשובה = «חלק מהמקומות» של מצב כלשהו, ואין במדף תנאי-מקום מתאים — הטבלה נלמדת מהדוגמאות ונבנית (valueBuild), ונשמרת במדף.
import fs from 'fs'; import { run } from './machine3s.mjs'; import { makeChecker, finalCheck, movable } from './tzoref.mjs'; import { valueBuild } from './tzoref-value.mjs';
import { runG, runFastG, encodeG, walk, walkA, shift, Z, chainSafeLL, chainSafeLN, relocate, zeroCells } from './chainsafe.mjs';
import { posFilterFrame, suffixMapFrame, rotateToFrame } from './posframes.mjs';
const R=k=>Math.floor(Math.random()*k); const J=JSON.stringify;
const PADN=14, PAD=Array.from({length:PADN},(_,i)=>i%2?['GO']:['WHERE',0]);
const usedC=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]));
export const seqProg=(steps)=>{ let p=[]; for(const s of steps){ p=[...p,...Z]; p=[...p,...shift(s.prog,p.length)]; } return p; };
// דוגמאות: כל האורכים 0..8, הארוכות קודם (נכשלות מהר יותר)
function pickExamples(gen,per=5){ const by=Array.from({length:9},()=>[]); for(let t=0;t<4000&&by.some(b=>b.length<per);t++){ const e=gen(); const n=walk(e.mem).length; if(by[n].length<per) by[n].push(e); } return by.reverse().flat(); }
export const pickExamplesFor=(gen,per)=>pickExamples(gen,per);
// תנאי-מקום מהמדף: כלי עם קלט אחד (תא 0) ותשובה בתא 2, בלי «לאן מהמחסנית», רק תאים 0..7
function condTools(sh){ const out=[]; for(const b of sh.named){ if(b.bad||(b.ins||[]).join()!=='0'||(b.out??2)!==2||b.prog.length>120||b.prog.some(x=>x[0]==='WHERE@')) continue; if([...usedC(b.prog)].some(c=>c>7)) continue;
    const pat=[]; let ok=true; for(let v=0;v<8&&ok;v++){ let z=null; for(let t=0;t<4;t++){ const m=Array.from({length:16},()=>R(16)); m[0]=v; const r=run([...Z,...b.prog],m,{maxSteps:20000}); if(!r||r.st.length){ ok=false; break; } const y=(r.mem[2]&15)?1:0; if(z===null) z=y; else if(z!==y){ ok=false; break; } } pat.push(z); }
    if(ok) out.push({name:b.name,prog:b.prog,pat:pat.join('')}); } return out; }
// הכלים: מהמדף + מסגרות שהחריצים שלהן מולאו מהמדף. כפולים (אותו פלט על הדוגמאות) וכלים שלא משנים כלום — נזרקים.
export function stepTools(ex,{sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')),say=()=>{}}={}){
  const LL=[], LN=[]; const ins=ex.map(e=>J(walk(e.mem)));
  for(const b of sh.named){ if(b.bad||b.prog.length>400) continue; let ok=true, ch=0, keeps=true;
    const bc=encodeG(b.prog); for(const e of ex){ const r=runFastG(bc,e.mem,0,200000); if(!r){ ok=false; break; } if(J(walkA(r))!==J(walk(e.mem))) ch++; if(r[1]!==e.mem[1]||walk(e.mem).some(x=>r[x]!==e.mem[x])) keeps=false; }
    if(!ok) continue;
    if(ch){ const s=chainSafeLL(b.prog,ex); if(s) LL.push({name:b.name,prog:s.prog,safe:true,fix:s.fix}); else { const rel=relocate(b.prog); if(rel) LL.push({name:b.name,prog:[...zeroCells([0]),...shift(rel,12)],safe:false,fix:'שביר: עובד רק על זיכרון נקי'}); } }
    else if(keeps&&b.prog.some(x=>x[0]==='WHERE@')){ const s=chainSafeLN(b.prog,ex); if(s) LN.push({name:b.name,prog:s.prog,fix:s.fix,v:s.v}); } }
  const conds=condTools(sh); const cand=[];
  for(const t of LL) cand.push({name:t.name,prog:t.prog,kind:'מדף'});
  for(const t of LL.filter(t=>t.safe)) for(const fh of [true,false]) cand.push({name:`על-כל-זנב${fh?'':' (כולל הכל)'} [${t.name}]`,prog:suffixMapFrame(t.prog,fh),kind:'זנב'});
  for(const l of LN) cand.push({name:`סובב-אל [${l.name}]`,prog:rotateToFrame(l.prog),kind:'סובב'});
  const seenPat=new Set(); for(const c of conds){ if(/^[01]+$/.test(c.pat)&&(c.pat==='00000000'||c.pat==='11111111')) continue; if(seenPat.has(c.pat)) continue; seenPat.add(c.pat);
    for(const fromEnd of [false,true]) for(const remove of [true,false]) cand.push({name:`${remove?'הוצא':'השאר רק'} מקום${fromEnd?'-מהסוף':''} ש[${c.name}]`,prog:posFilterFrame(c.prog,remove,fromEnd),kind:'מקום'}); }
  const out=[], sig=new Set([J(ins)]);
  for(const c of cand){ const P=encodeG([...PAD,...shift(c.prog,PADN)]); const o=[]; let ok=true; for(const e of ex){ const r=runFastG(P,e.mem,PADN,300000); if(!r){ ok=false; break; } o.push(J(walkA(r))); } if(!ok) continue;
    const k=J(o); if(sig.has(k)) continue; sig.add(k); out.push({...c,P}); }
  say(`  כלים: מדף ${LL.length} (בטוחים ${LL.filter(t=>t.safe).length}) · רשימה⇒מספר ${LN.length} · תנאי-מקום ${seenPat.size} ⇒ ${cand.length} צעדים ⇒ אחרי הסרת כפולים ${out.length}`);
  return {tools:out,LL,LN,conds}; }
// התאמת «חלק מהמקומות»: התשובה היא תת-רשימה של המצב, ומה שנשאר נקבע רק לפי המקום (מההתחלה או מהסוף)
export function fitPos(lists,wants,fromEnd){ const tab=Array(8).fill(null); for(let i=0;i<lists.length;i++){ const s=lists[i], t=wants[i]; let j=0;
    for(let k=0;k<s.length;k++){ const idx=fromEnd?s.length-1-k:k; const kept=j<t.length&&t[j]===s[k]; if(kept) j++; if(idx>7) return null; if(tab[idx]===null) tab[idx]=kept; else if(tab[idx]!==kept) return null; }
    if(j!==t.length) return null; }
  if(!tab.some(x=>x===true)||!tab.some(x=>x===false)) return null; return tab; }
// לומד תנאי-מקום חדש: טבלה על 0..7 (המקום), נבנה ע"י בונה-הערכים; על 8..15 נרשם מה שהתוכנית עושה בפועל (המטרה = התנהגות אמיתית שנבדקת בביקורת)
export async function learnPosCond(tab,{say=()=>{},ms=90000}={}){ const name='מקום: '+tab.map((x,i)=>x?i:null).filter(x=>x!==null).join(',');
  const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const have=sh.named.find(b=>b.name===name); if(have) return {name,prog:have.prog,learned:false};
  const want=v=>v<8&&tab[v]?15:0; const gen8=()=>{ const mem=Array.from({length:16},()=>R(16)); mem[0]=R(8); const w=want(mem[0]), k=mem[0]; return {mem,want:w,ok:r=>r[2]===w&&r[0]===k}; };
  say(`  לומד תנאי «${name}» (בונה-ערכים)…`); const v=valueBuild(gen8,{name,ins:[0],out:2,ms}); if(!v.prog) return null;
  const tt=Array.from({length:16},(_,x)=>{ if(x<8) return want(x); const m=Array.from({length:16},()=>R(16)); m[0]=x; const r=run(v.prog,m,{maxSteps:20000}); return r?r.mem[2]&15:0; });
  const gen16=()=>{ const mem=Array.from({length:16},()=>R(16)); const w=tt[mem[0]], k=mem[0]; return {mem,want:w,ok:r=>r[2]===w&&r[0]===k}; };
  if(finalCheck(v.prog,gen16).bad) return null;   // התנהגות לא קבועה על 8..15 ⇒ לא נשמר
  const S2=JSON.parse(fs.readFileSync('shelf3.json','utf8')); S2.named.push({name,prog:v.prog,ins:[0],out:2,movable:movable(v.prog,gen16),by:'נלמד: תנאי-מקום (רצף-מקום)'}); fs.writeFileSync('shelf3.json',JSON.stringify(S2));
  const LG=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); LG[name]={ins:[0],tt}; fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(LG));
  return {name,prog:v.prog,learned:true}; }

export async function posCompose(gen,{maxLen=4,ms=+process.env.POSMS||200000,learn=true,say=()=>{}}={}){ const T0=Date.now(), DEAD=T0+ms;
  const ex=pickExamples(gen); const wants=ex.map(e=>JSON.parse(e.want)); const wantS=wants.map(w=>J(w));
  const {tools}=stepTools(ex,{say}); const chk=makeChecker(gen,300,600000); const more=Array.from({length:300},()=>gen());
  const verify=(steps)=>{ const p=seqProg(steps); for(const e of more){ const r=run(p,e.mem,{maxSteps:600000}); if(!r||r.st.length||!e.ok(r.mem)) return null; } return chk(p)?p:null; };
  const apply=(t,mem)=>runFastG(t.P,mem,PADN,300000);
  const learnQ=[], learnedTabs=new Set(); let tried=0, nLearn=0;   // לכל היותר 2 ניסיונות-לימוד למשימה
  const noteFit=(st)=>{ for(const fromEnd of [false,true]){ const tab=fitPos(st.lists,wants,fromEnd); if(tab&&!tab.includes(null)) learnQ.push({st,tab,fromEnd}); } };
  const done=(chain,extra={})=>({how:chain.map(s=>s.name).join(' ⇒ '),steps:chain.length,ntools:tools.length,tried,ms:Date.now()-T0,...extra});
  // לומדים תנאי-מקום לרצפים שאורכם (כולל הסינון) ≤ maxTot — רק אחרי שהמדף לבדו לא הספיק באורך הזה
  const tryLearn=async(maxTot)=>{ if(!learn) return null; for(const q of learnQ){ if(q.st.chain.length+1>maxTot||q.used) continue; q.used=true; if(Date.now()>DEAD) return null;
      const neg=q.tab.filter(Boolean).length>4; const tab=neg?q.tab.map(x=>!x):q.tab; const key=J(tab); if(learnedTabs.has(key)) continue; learnedTabs.add(key); if(nLearn>=2) return null; nLearn++;
      const c=await learnPosCond(tab,{say,ms:Math.min(90000,Math.max(20000,DEAD-Date.now()))}); if(!c) continue;
      const step={name:`${neg?'הוצא':'השאר רק'} מקום${q.fromEnd?'-מהסוף':''} ש[${c.name}]`,prog:posFilterFrame(c.prog,neg,q.fromEnd)}; const chain=[...q.st.chain,step]; const p=verify(chain);
      if(p) return {prog:p,...done(chain,{learned:c.learned?c.name:null})}; } return null; };
  let level=[{chain:[],mems:ex.map(e=>e.mem),lists:ex.map(e=>walk(e.mem))}]; const seen=new Set([J(level[0].lists)]); noteFit(level[0]);
  if(level[0].lists.every((l,i)=>J(l)===wantS[i])) return {prog:null,why:'אין שינוי'};
  for(let L=1;L<=maxLen;L++){ const next=[]; const last=L===maxLen;
    for(const st of level) for(const t of tools){ if(Date.now()>DEAD) return {prog:null,timeout:true,tried,ntools:tools.length,level:L};
      if(last){ let ok=true; for(let i=0;i<ex.length&&ok;i++){ const m=apply(t,st.mems[i]); if(!m||J(walkA(m))!==wantS[i]) ok=false; } if(!ok) continue; tried++; const chain=[...st.chain,t]; const p=verify(chain); if(p) return {prog:p,...done(chain)}; continue; }
      const mems=[], lists=[]; let ok=true, alive=true; for(let i=0;i<ex.length;i++){ const m=apply(t,st.mems[i]); if(!m){ ok=false; break; } const l=walkA(m); mems.push(m); lists.push(l); if(alive&&wants[i].some(x=>!l.includes(x))) alive=false; } if(!ok) continue;
      if(lists.every((l,i)=>J(l)===wantS[i])){ tried++; const chain=[...st.chain,t]; const p=verify(chain); if(p) return {prog:p,...done(chain)}; }
      if(!alive) continue; const k=J(lists); if(seen.has(k)) continue; seen.add(k); const ns={chain:[...st.chain,t],mems,lists}; next.push(ns); noteFit(ns); }
    say(`  רמה ${L}: ${next.length} מצבים חדשים · ${((Date.now()-T0)/1000).toFixed(1)} שנ׳ · התאמות-מקום ${learnQ.length}`);
    const lr=await tryLearn(L); if(lr) return lr;
    level=next; if(!level.length&&!last) { const lr2=await tryLearn(maxLen); if(lr2) return lr2; break; } }
  const lr=await tryLearn(maxLen); if(lr) return lr;
  return {prog:null,ntools:tools.length,tried,fits:learnQ.length,ms:Date.now()-T0}; }

// בדיקת «במקום אחר»: ריפוד 10..18 פקודות WHERE 0 / GO לפני התוכנית, כתובות-קוד מוזזות, 300 דוגמאות
export function offsetCheck(p,gen,n=300){ let bad=0; for(let t=0;t<n;t++){ const k=10+(t%9); const pre=Array.from({length:k},(_,i)=>i%2?['GO']:['WHERE',0]); const q=[...pre,...shift(p,k)]; const e=gen(); const r=run(q,e.mem,{maxSteps:600000}); if(!r||r.st.length||!e.ok(r.mem)) bad++; } return bad; }

if((process.argv[1]||'').endsWith('poscompose.mjs')){ const { llGen }=await import('./listlist.mjs'); const cmd=process.argv[2]||'suite';
  const file=process.argv[3]||'../suite-listfail.json'; const only=process.argv[4]?new Set(process.argv[4].split('|')):null;
  const S=JSON.parse(fs.readFileSync(file,'utf8')).tasks.filter(t=>t.kind==='list2list'&&(!only||only.has(t.name))); const res=[];
  for(const t of S){ const f=new Function('return ('+t.src+')')(); const gen=llGen(f); const t0=Date.now(); const r=await posCompose(gen,{say:process.env.V?console.log:()=>{}}); const sec=(Date.now()-t0)/1000;
    let fc=null, off=null; if(r.prog){ fc=finalCheck(r.prog,gen,20000).bad; off=offsetCheck(r.prog,gen); }
    const ok=!!r.prog&&fc===0&&off===0; res.push({name:t.name,ok,len:r.prog?.length??null,how:r.how||null,sec,fc,off,tried:r.tried,ntools:r.ntools,timeout:!!r.timeout});
    console.log(`${ok?'✓':'✗'} ${t.name}: ${r.prog?`${r.prog.length} פקודות · ${r.how} · בדיקה-סופית ${fc}/20000 · במקום-אחר ${off}/300`:'לא נמצא'+(r.timeout?' (זמן)':'')} · ${sec.toFixed(1)} שנ׳`); }
  console.log(`סך: ${res.filter(r=>r.ok).length}/${res.length}`); if(process.env.OUT) fs.writeFileSync(process.env.OUT,JSON.stringify(res,null,1)); process.exit(0); }
