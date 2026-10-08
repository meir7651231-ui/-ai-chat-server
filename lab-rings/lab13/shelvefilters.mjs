// כלי-סינון נכנסים למדף ככלים רגילים (רשימה⇒רשימה), עם מטרה-נלמדת — כדי שאפשר יהיה לשרשר אותם
import fs from 'fs'; import { filterCompose } from './filtcomp.mjs'; import { llGen } from './listlist.mjs'; import { finalCheck } from './tzoref.mjs';
const F={'בלי הזוגיים':'l=>l.filter(x=>x%2)','רק הזוגיים':'l=>l.filter(x=>x%2===0)','בלי הגדולים מ-12':'l=>l.filter(x=>x<=12)','רק הגדולים מ-12':'l=>l.filter(x=>x>12)'};
for(const [name,src] of Object.entries(F)){ let sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); if(sh.named.some(b=>b.name===name)){ console.log('כבר במדף:',name); continue; }
  const f=new Function('l','return ('+src+')(l)'); const gen=llGen(f); const r=filterCompose(gen); if(!r.prog){ console.log('✗',name); continue; } const fc=finalCheck(r.prog,gen,5000); if(fc.bad){ console.log('✗ בדיקה',name); continue; }
  let LG={}; try{ LG=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); }catch{} LG[name]={listlf:src}; fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(LG));
  sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); sh.named.push({name,prog:r.prog,ins:[],out:2,by:'מסגרת-סינון',how:r.how}); fs.writeFileSync('shelf3.json',JSON.stringify(sh)); console.log('✓',name,r.prog.length,'⇒ במדף'); }
process.exit(0);
