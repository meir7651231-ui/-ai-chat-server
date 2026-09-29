const {makeEngine}=require('./core2.js'); const E=makeEngine(7); const t00=Date.now(); let round=0;
// מתחילים מהלבנים שכבר נלמדו (שרת + דפדפן) — המדף ממיין אותן לפי מה שהן באמת מחשבות
const o=JSON.parse(require('fs').readFileSync('endless-state.json','utf8')); for(const b of o.shelf) E.offer(b.ops,'old');
console.log('התחלה: טבלאות ממופות', E.lib.size+'/256');
while(Date.now()-t00<240000){ round++; const tt=E.nextTarget(null,round); if(tt==null){ console.log('הכל ממופה'); break; }
  const S=new E.Search(tt); let res,t0=Date.now(); for(;;){ const r=S.step(1e9); if(r){res=r; if(r.best||r.ring>=9||Date.now()-t0>60000) break;} }
  if(res.best) E.offer([["W",0],["GO"],...res.best.ops],'goal'); else E.failed(tt,round);
  console.log(`#${round} ${res.best?'✓':'↻'} ${E.nameOf(tt)} · עיגול ${res.ring} · ${Math.round((Date.now()-t0)/100)/10}s · נקצרו ${res.harvested} · ממופות ${E.lib.size}/256`); }
