// «מוח אחד»: מקבל משימה, מנסה את כל הבונים — מהמהיר לאיטי — ומחזיר את התוכנית הראשונה שעוברת את הבודק.
//   מספרים (יש תאי-קלט):  בונה-ערכים
//   רשימה ⇒ מספר:         בונה-לולאות ⇒ שני-צוברים
//   רשימה ⇒ רשימה:        בונה-חצים ⇒ פגישה-באמצע (4 עובדים)
//   ואם אף אחד לא הצליח — 4 הליבות של הבונה הרגיל (בשגרת העבודה)
import { spawn } from 'child_process'; import { makeChecker } from './tzoref.mjs';
const runSplit=(name,min)=>Promise.all([0,1,2,3].map(k=>new Promise(res=>{ let out=''; const c=spawn(process.execPath,['--max-old-space-size=3000','tzoref-split.mjs',name],{env:{...process.env,PART:k,PARTS:4,TOPK:60,MIN:min,JSON:1}});
  c.stdout.on('data',d=>out+=d); c.on('close',()=>{ const l=out.split('\n').find(x=>x.startsWith('JSON')); res(l?JSON.parse(l.slice(4)):null); }); })));
export async function solve(name,gen,g,{say=()=>{},splitMin=10}={}){ const t0=Date.now(); const chk=makeChecker(gen,300); const sample=gen(); const tried=[];
  const done=(prog,how)=>({prog,how,tried,ms:Date.now()-t0});
  if(g.ins){ const { valueBuild, show }=await import('./tzoref-value.mjs'); tried.push('ערכים'); const v=valueBuild(gen,{name,ins:g.ins,out:g.out??2,ms:20000}); if(v.prog) return done(v.prog,'בונה-ערכים: '+show(v.expr)); return done(null,null); }
  if(sample.want!=null){ const L=await import('./tzoref-loop.mjs'); tried.push('לולאות'); const a=L.loopBuild(gen,{name}); if(a.prog) return done(a.prog,`בונה-לולאות: התחל מ-${a.init}, בכל איבר ${L.showL(a.step)}`);
    const L2=await import('./tzoref-loop2.mjs'); tried.push('שני-צוברים'); const b=L2.loop2Build(gen,{name}); if(b.prog) return done(b.prog,`שני-צוברים: בסוף ${b.found.comb}`);
    const L3=await import('./tzoref-loop3.mjs'); tried.push('לולאה-עם-זיכרון'); let c3=L3.loop3Build(gen,{name}); if(!c3.prog) c3=L3.loop3Build(gen,{name,maxG:2,ms:300000}); if(c3.prog) return done(c3.prog,'לולאה-עם-זיכרון: '+L3.show3(c3.found)); return done(null,null); }
  const PT=await import('./tzoref-ptr.mjs'); tried.push('חצים'); const c=PT.ptrBuild(gen,{ms:30000}); if(c.body){ const p=PT.ptrCompile(c); if(chk(p)) return done(p,'בונה-חצים: '+PT.showP(c)); }
  const SP=await import('./tzoref-split.mjs'); tried.push('פגישה-באמצע'); say('  מנסה «פגישה באמצע» על 4 עובדים…'); const rs=await runSplit(name,splitMin); const r=rs.find(x=>x&&x.a);
  if(r){ const p=SP.compileSplit(r); if(chk(p)) return done(p,'פגישה-באמצע: '+SP.showSplit(r)); }
  return done(null,null); }
if(import.meta.url==='file://'+process.argv[1]){ const { goals, goalFor }=await import('./tzoref-goals.mjs'); const G=goals();
  for(const name of process.argv.slice(2)){ const g=G[name]; const gen=goalFor(name,{ins:g.ins},G); const r=await solve(name,gen,g,{say:s=>console.log(s)});
    console.log(`${r.prog?'✓':'✗'} ${name} · ${r.prog?r.prog.length+' פקודות · '+r.how:'לא נמצא'} · ניסה: ${r.tried.join(' ⇒ ')} · ${(r.ms/1000).toFixed(1)} שנ׳`); } process.exit(0); }
