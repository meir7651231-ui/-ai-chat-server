// הצורף — «לוח כפל» לכל חלק במדף: מריצים את החלק על כל צירופי הקלט (16 או 256), עם זבל אקראי בשאר התאים.
// חלק נכנס רק אם התשובה תלויה בקלט בלבד (אותה תשובה עם 3 זבלים שונים) — אחרת הוא לא «פונקציה» ואי אפשר לסמוך על הלוח.
import { run } from './machine3s.mjs';
// זיכרון: לוח של לבנה (אותו שם, אותה תוכנית) נבנה פעם אחת בכל תהליך — בונה-ערכים קורא לזה פעמיים בכל ריצה (7 שנ׳ כל פעם)
const MEMO=new Map();
export function partTables(named){ const out=[];
  for(const b of named){ const mk=b.name+'|'+JSON.stringify(b.prog)+'|'+JSON.stringify(b.ins)+'|'+b.out; if(MEMO.has(mk)){ const m=MEMO.get(mk); if(m) out.push({...m,T:m.T.slice()}); continue; } const n0=out.length; partOne(b,out); MEMO.set(mk,out.length>n0?out[out.length-1]:null); if(out.length>n0) out[out.length-1]={...out[out.length-1],T:out[out.length-1].T.slice()}; }
  return out; }
function partOne(b,out){
  { const ins=(b.ins||[]).filter(c=>c<8), o=b.out??2; if(!ins.length||ins.length>2||o>7||/רשימה|ספור|בלי|אמצע|וקטן/.test(b.name)) return;
    const n=ins.length===1?16:256, T=new Uint8Array(n); let ok=true, bad=0;   // «לא ידוע» (למשל חילוק ב-0) ⇒ 0, והחלק נשאר — הבודק הסופי תופס טעויות
    for(let x=0;x<n&&ok;x++){ const a=ins.length===1?x:x>>4, bb=x&15; let v=null;
      for(let k=0;k<3;k++){ const m=Array.from({length:16},()=>Math.floor(Math.random()*16)); m[ins[0]]=a; if(ins.length===2) m[ins[1]]=bb;
        const r=run(b.prog,m,{maxSteps:20000}); if(!r||r.st.length){ bad++; v=0; break; } if(v==null) v=r.mem[o]; else if(v!==r.mem[o]){ ok=false; break; } }
      T[x]=v??0; }
    if(ok&&bad<=n/8) out.push({name:b.name,k:ins.length,T:Array.from(T),partial:bad>0}); } }
if(import.meta.url==='file://'+process.argv[1]){ const fs=await import('fs'); const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const t=Date.now(); const tb=partTables(sh.named);
  fs.writeFileSync('tzoref-tables.json',JSON.stringify(tb)); console.log(`לוחות: ${tb.length} חלקים (${tb.filter(x=>x.k===1).length} עם קלט אחד, ${tb.filter(x=>x.k===2).length} עם שניים) · ${Date.now()-t}ms`); console.log(tb.map(x=>x.name).join(' · ')); }
