// המכונה לומדת כלי רשימה⇒רשימה חסר מדוגמאות בלבד (הבונה הרגיל), ואם הצליח — נכנס למדף
import fs from 'fs'; const NEW=process.env.STEP==='filter1'?{'בלי הראשון אם זוגי':'l=>(l.length&&l[0]%2===0)?l.slice(1):l','בלי הזוגיים שבהתחלה':'l=>{ let i=0; while(i<l.length&&l[i]%2===0) i++; return l.slice(i); }'}:{'בלי הראשון':'l=>l.slice(1)','בלי הזוגיים':'l=>l.filter(x=>x%2)'};
let LG={}; try{ LG=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); }catch{} for(const [n,src] of Object.entries(NEW)) if(!LG[n]) LG[n]={listlf:src}; fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(LG));
const { solve } = await import('./tzoref-solve.mjs'); const { goals, goalFor } = await import('./tzoref-goals.mjs'); const { finalCheck } = await import('./tzoref.mjs'); const G=goals();
for(const name of Object.keys(NEW)){ let sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); if(sh.named.some(b=>b.name===name)){ console.log('כבר במדף:',name); continue; }
  const g=G[name]; const gen=goalFor(name,{ins:g.ins},G); const t=Date.now();
  const r=await Promise.race([solve(name,gen,g,{splitMin:+process.env.SPLITMIN||5}),new Promise(res=>setTimeout(()=>res({prog:null,tried:['נגמר הזמן']}),+process.env.TMAX||900000))]);
  if(!r.prog){ console.log('✗',name,'· ניסה:',(r.tried||[]).join(' ⇒ '),'·',((Date.now()-t)/1000).toFixed(0),'שנ׳'); continue; } const fc=finalCheck(r.prog,gen); if(fc.bad){ console.log('✗ (בדיקה)',name); continue; }
  sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); sh.named.push({name,prog:r.prog,ins:[],out:2,by:'נלמד: רשימה⇒רשימה'}); fs.writeFileSync('shelf3.json',JSON.stringify(sh));
  console.log('✓',name,':',r.prog.length,'פקודות ·',r.how,'·',((Date.now()-t)/1000).toFixed(0),'שנ׳ ⇒ במדף'); }
process.exit(0);
