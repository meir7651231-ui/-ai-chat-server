// «מוח אחד»: מקבל משימה, מנסה את כל הבונים — מהמהיר לאיטי — ומחזיר את התוכנית הראשונה שעוברת את הבודק.
//   מספרים (יש תאי-קלט):  בונה-ערכים
//   רשימה ⇒ מספר:         בונה-לולאות ⇒ שני-צוברים
//   רשימה ⇒ רשימה:        בונה-חצים ⇒ פגישה-באמצע (4 עובדים)
//   ואם אף אחד לא הצליח — 4 הליבות של הבונה הרגיל (בשגרת העבודה)
import { spawn } from 'child_process'; import { makeChecker } from './tzoref.mjs';
const runSplit=(name,min)=>Promise.all([0,1,2,3].map(k=>new Promise(res=>{ let out=''; const c=spawn(process.execPath,['--max-old-space-size=3000','tzoref-split.mjs',name],{env:{...process.env,PART:k,PARTS:4,TOPK:60,MIN:min,JSON:1}});
  c.stdout.on('data',d=>out+=d); c.on('close',()=>{ const l=out.split('\n').find(x=>x.startsWith('JSON')); res(l?JSON.parse(l.slice(4)):null); }); })));
export async function solve(name,gen,g,{say=()=>{},splitMin=10,depth=0}={}){ const t0=Date.now(); const chk=makeChecker(gen,300); const sample=gen(); const tried=[];
  const done=(prog,how)=>({prog,how,tried,ms:Date.now()-t0});
  if(g.ins){ const { valueBuild, show }=await import('./tzoref-value.mjs');
    // בונה-יסודות (חבר/נאנד/חצי, כל הקלטים) ובונה-ערכים (חלקים מהמדף) — שניהם; לוקחים את הקצר שעובר
    let bb=null; if(g.ins.length<=3){ const BS=await import('./tzoref-basic.mjs'); tried.push('יסודות'); const T=BS.tableOf(gen,g.ins); if(T){ const r=BS.basicBuild(T,{ins:g.ins,ms:+process.env.BASICMS||20000}); if(r.expr){ const p=BS.compile(r.expr,g.out??2); if(chk(p)) bb={prog:p,how:'בונה-יסודות: '+BS.showB(r.expr)}; } } }
    tried.push('ערכים'); const v=valueBuild(gen,{name,ins:g.ins,out:g.out??2,ms:60000});
    const best=[bb,v.prog?{prog:v.prog,how:'בונה-ערכים: '+show(v.expr)}:null].filter(Boolean).sort((a,b)=>a.prog.length-b.prog.length)[0]; if(best) return done(best.prog,best.how);
    const RP=await import('./tzoref-repeat.mjs'); tried.push('חזור-N-פעמים'); const w=RP.repeatBuild(gen,{name,ins:g.ins}); if(w.prog) return done(w.prog,'חזור-N-פעמים: '+RP.showR(w.found));
    const WH=await import('./tzoref-while.mjs'); tried.push('כל-עוד'); const x=WH.whileBuild(gen,{name,ins:g.ins}); if(x.prog) return done(x.prog,'כל-עוד: '+WH.showW(x.found)); return done(null,null); }
  if(sample.want!=null){ const L=await import('./tzoref-loop.mjs'); tried.push('לולאות'); const a=L.loopBuild(gen,{name}); if(a.prog) return done(a.prog,`בונה-לולאות: התחל מ-${a.init}, בכל איבר ${L.showL(a.step)}${a.post?' · ובסוף: '+L.showL(a.post):''}`);
    const L2=await import('./tzoref-loop2.mjs'); tried.push('שני-צוברים'); let b=L2.loop2Build(gen,{name});
    // «מה חסר לי?» — אם נמצא פער (שתי צבירות שהתשובה תלויה רק בהן), בונים את החלק החסר, שמים במדף, ומנסים שוב
    if(!b.prog&&b.gap&&depth<2){ const helper=await buildGap(name,gen,b.gap,{say,depth}); if(helper) b=L2.loop2Build(gen,{name}); } if(b.prog) return done(b.prog,`שני-צוברים: בסוף ${b.found.comb}`);
    const L3=await import('./tzoref-loop3.mjs'); tried.push('לולאה-עם-זיכרון'); let c3=L3.loop3Build(gen,{name}); if(!c3.prog) c3=L3.loop3Build(gen,{name,maxG:2,ms:300000}); if(c3.prog) return done(c3.prog,'לולאה-עם-זיכרון: '+L3.show3(c3.found)); return done(null,null); }
  const PT=await import('./tzoref-ptr.mjs'); tried.push('חצים'); const c=PT.ptrBuild(gen,{ms:30000}); if(c.body){ const p=PT.ptrCompile(c); if(chk(p)) return done(p,'בונה-חצים: '+PT.showP(c)); }
  const SP=await import('./tzoref-split.mjs'); tried.push('פגישה-באמצע'); say('  מנסה «פגישה באמצע» על 4 עובדים…'); const rs=await runSplit(name,splitMin); const r=rs.find(x=>x&&x.a);
  if(r){ const p=SP.compileSplit(r); if(chk(p)) return done(p,'פגישה-באמצע: '+SP.showSplit(r)); }
  return done(null,null); }

// ─── בניית חלק חסר: טבלה מלאה מ-3,000 דוגמאות ⇒ מטרה חדשה ⇒ «מוח אחד» בונה אותה ⇒ קיצור ⇒ בדיקה סופית ⇒ מדף
async function buildGap(name,gen,gap,{say,depth}){ const fs=await import('fs'); const L2=await import('./tzoref-loop2.mjs'); const T=await import('./tzoref.mjs'); const GM=await import('./tzoref-goals.mjs');
  const pairs=new Map(); for(let i=0;i<3000;i++){ const e=gen(); const a=L2.runFold(gap.f1,e.mem), b=L2.runFold(gap.f2,e.mem), k=a*16+b; if(pairs.has(k)&&pairs.get(k)!==e.want) return null; pairs.set(k,e.want); }
  const hname=`עזר: ${name}`; const P=[...pairs].map(([k,w])=>[k>>4,k&15,w]);
  say(`  «מה חסר לי?» — התשובה תלויה רק בשתי צבירות, אבל אין לי חלק שמחבר אותן (${P.length} צירופים ידועים) ⇒ בונה חלק חדש «${hname}»`);
  const L=GM.learnedGoals(); L[hname]={pairs:P,for:name}; fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(L));
  const G=GM.goals(); const hg=GM.goalFor(hname,{ins:[0,1]},G); const r=await solve(hname,hg,G[hname],{say,depth:depth+1});
  if(!r.prog){ say('  בונה-הערכים לא הצליח ⇒ מעביר את החלק החסר לבונה הרגיל (4 עובדים)'); await T.work({names:[hname],baseMs:+process.env.GAPMS||120000,minutes:1});
    const ok=T.loadShelf().named.find(b=>b.name===hname&&!b.bad); if(ok){ say(`  ✓ החלק החסר נבנה בבונה הרגיל · ${ok.prog.length} פקודות ⇒ במדף`); return hname; } say('  ✗ לא הצלחתי לבנות את החלק החסר'); return null; }
  let s=r.prog; try{ s=T.shorten(r.prog,hg,{minutes:1,quiet:1,tag:hname}).prog; }catch{} const fc=T.finalCheck(s,hg); if(fc.bad) return null;
  const sh=T.loadShelf(); sh.named=sh.named.filter(b=>b.name!==hname); sh.named.push({name:hname,prog:s,ins:[0,1],out:2,movable:T.movable(s,hg),by:'הצורף · חלק שגילה שחסר לו'}); fs.writeFileSync('shelf3.json',JSON.stringify(sh));
  say(`  ✓ החלק החסר נבנה (${r.how}) · ${s.length} פקודות · ${fc.n-fc.bad}/${fc.n} ⇒ במדף`); return hname; }
