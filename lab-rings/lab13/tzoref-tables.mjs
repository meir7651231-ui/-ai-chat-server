// הצורף — «לוח כפל» לכל חלק במדף: מריצים את החלק על כל צירופי הקלט (16 או 256), עם זבל אקראי בשאר התאים.
// חלק נכנס רק אם התשובה תלויה בקלט בלבד (אותה תשובה עם 3 זבלים שונים) — אחרת הוא לא «פונקציה» ואי אפשר לסמוך על הלוח.
import { run } from './machine3s.mjs';
export function partTables(named){ const out=[];
  for(const b of named){ const ins=(b.ins||[]).filter(c=>c<8), o=b.out??2; if(!ins.length||ins.length>2||o>7||/רשימה|ספור|בלי|אמצע|וקטן/.test(b.name)) continue;
    const n=ins.length===1?16:256, T=new Uint8Array(n); let ok=true;
    for(let x=0;x<n&&ok;x++){ const a=ins.length===1?x:x>>4, bb=x&15; let v=null;
      for(let k=0;k<3;k++){ const m=Array.from({length:16},()=>Math.floor(Math.random()*16)); m[ins[0]]=a; if(ins.length===2) m[ins[1]]=bb;
        const r=run(b.prog,m,{maxSteps:20000}); if(!r||r.st.length){ ok=false; break; } if(v==null) v=r.mem[o]; else if(v!==r.mem[o]){ ok=false; break; } }
      T[x]=v??0; }
    if(ok) out.push({name:b.name,k:ins.length,T:Array.from(T)}); }
  return out; }
if(import.meta.url==='file://'+process.argv[1]){ const fs=await import('fs'); const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const t=Date.now(); const tb=partTables(sh.named);
  fs.writeFileSync('tzoref-tables.json',JSON.stringify(tb)); console.log(`לוחות: ${tb.length} חלקים (${tb.filter(x=>x.k===1).length} עם קלט אחד, ${tb.filter(x=>x.k===2).length} עם שניים) · ${Date.now()-t}ms`); console.log(tb.map(x=>x.name).join(' · ')); }
