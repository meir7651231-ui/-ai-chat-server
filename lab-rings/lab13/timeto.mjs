// כמה זמן עד שהמקצר מגיע לאורך הסופי (הקיצור האחרון שנמצא)
const mod=await import(process.argv[2]); const { finalCheck }=mod; const { goals, goalFor }=await import('./tzoref-goals.mjs'); import fs from 'fs';
const G=goals(); const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8'));
const names=['ספור זוגיים ברשימה','מ8 שארית ב-3','ממוצע','הגדול ברשימה','מ6 אפס או שלוש?','סכום רשימה'];
let tot=0; for(const name of names){ const b=sh.named.find(x=>x.name===name); const g=G[name]; const gen=goalFor(name,{ins:g.ins},G);
  // מתחילים מגרסה «מנופחת» (פקודות-סרק) כדי שיהיה מה לקצר
  const P=b.prog; const pad=[]; for(const x of P){ pad.push(x); if(!x[2]&&x[0]==='PUT') pad.push(['TAKE'],['PUT']); }
  const fixed=pad.map(x=>x); const map=[]; { let j=0; for(let i=0;i<P.length;i++){ map[i]=j; j+=(!P[i][2]&&P[i][0]==='PUT')?3:1; } map[P.length]=pad.length; }
  const prog=fixed.map(x=>x[2]==='code'?['WHERE',map[x[1]]??x[1],'code']:x);
  const log=[]; const orig=console.log; const t0=Date.now(); console.log=(...a)=>{ const s=a.join(' '); const m=s.match(/→ (\d+)/); if(m) log.push([+m[1],(Date.now()-t0)/1000]); };
  let r; try{ r=mod.shorten(prog,gen,{minutes:+process.env.MIN||1,quiet:9}); }catch(e){ console.log=orig; console.log(name,'שגיאה',e.message); continue; } console.log=orig;
  const last=log.filter(x=>x[0]===r.prog.length)[0]; tot+=last?last[1]:0; orig(`${name}: ${prog.length} ⇒ ${r.prog.length} · הגיע אחרי ${last?last[1].toFixed(1):'?'} שנ׳`); }
console.log('סה״כ זמן-עד-התוצאה:',tot.toFixed(1),'שנ׳'); process.exit(0);
