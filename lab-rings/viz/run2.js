// השרת על המנוע הקוצר: טבלאות אי-זוגיות, עד 90 שניות למשימה, כל טבלה חדשה או מקוצרת ⇒ outbox (לזיכרון המשותף). נשמר אחרי כל משימה.
const fs=require('fs'); const {makeEngine}=require('./core2.js'); const E=makeEngine(424242); const F='core2-state.json';
let n=0, tried=0;
if(fs.existsSync(F)){ const o=JSON.parse(fs.readFileSync(F,'utf8')); E.restore(o.eng); n=o.n; tried=o.tried; }
else { const o=JSON.parse(fs.readFileSync('endless-state.json','utf8')); for(const b of o.shelf) E.offer(b.ops,'server'); }
for(const f of (fs.existsSync('dbread/bricks')?fs.readdirSync('dbread/bricks'):[])){ const d=JSON.parse(fs.readFileSync('dbread/bricks/'+f,'utf8')); const b=d.data||d; if(Array.isArray(b.ops)) E.offer(b.ops,'shared'); }
let seen=0; fs.mkdirSync('outbox2',{recursive:true});
const flush=()=>{ for(const ev of E.events.slice(seen)){ const b=E.lib.get(ev.tt); if(b) fs.writeFileSync(`outbox2/t${b.tt}.json`,JSON.stringify({name:b.name,tt:b.tt,ops:b.ops,len:b.ops.length,src:'server',at:new Date().toISOString()})); } seen=E.events.length; };
const save=()=>fs.writeFileSync(F,JSON.stringify({eng:E.state(),n,tried}));
console.log('התחלה: ממופות',E.lib.size+'/256'); flush(); save();
for(;;){ n++; const tt=E.nextTarget(x=>x%2===1,n) ?? E.nextTarget(null,n); if(tt==null){ console.log('כל 256 ממופות'); break; }
  const S=new E.Search(tt); let res,t0=Date.now(); for(;;){ const r=S.step(1e9); if(r){ res=r; tried+=r.tried; if(r.best||r.ring>=9||Date.now()-t0>90000) break; } }
  if(res.best) E.offer([["W",0],["GO"],...res.best.ops],'server'); else E.failed(tt,n);
  flush(); save();
  console.log(`${new Date().toISOString().slice(11,19)} #${n} ${res.best?'✓':'↻'} ${E.nameOf(tt)} · עיגול ${res.ring} · ${Math.round((Date.now()-t0)/1000)}s · נקצרו ${res.harvested} · ממופות ${E.lib.size}/256 · נבדקו ${(tried/1e6).toFixed(1)}M`); }
