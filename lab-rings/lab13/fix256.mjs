// 256 הלוגיות במכונה הגדולה: בדיקה «באמצע תוכנית» (לאן/איפה אקראיים), תיקון מי שתלויה ב-0, ואז קיצור עם כל הפעולות (גם חיבור ו«לאן מתא»).
import fs from 'fs'; import { checker, shrink, anneal } from './tools2.mjs';
const MS=+process.argv[2]||800; const L=JSON.parse(fs.readFileSync('logic256.json','utf8')); let s=17; const R=(n)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%n; };
const gen=(tt)=>()=>{ const m=Array.from({length:16},()=>R(16)); const a=m[0],b=m[1],c=m[3]; let w=0; for(let k=0;k<4;k++){ const idx=(((a>>k)&1)<<2)|(((b>>k)&1)<<1)|((c>>k)&1); w|=((tt>>idx)&1)<<k; } return {mem:m,ok:r=>r[2]===w}; };
let before=0, after=0, fixed=0, overfit=0; const out=[];
for(const b of L){ const fast=checker(gen(b.tt),40), full=checker(gen(b.tt),300), fresh=checker(gen(b.tt),2000); const ok=p=>fast(p)&&full(p);
  let p=b.prog; if(!fresh(p)){ p=[['WHERE',0],['GO'],...p]; fixed++; if(!fresh(p)) { console.log('לא הצליח לתקן',b.tt); out.push(b); continue; } }
  const safe=p; p=anneal(shrink(p,ok),ok,MS,4,b.tt+1); if(!fresh(p)){ overfit++; p=safe; }
  before+=b.prog.length; after+=p.length; out.push({tt:b.tt,prog:p}); }
console.log(`קיצור שנכשל בבדיקה החדשה (נשאר הבטוח): ${overfit} · תוקנו ${fixed} (הוספת «לאן 0, לך») · סך לפני ${before} → אחרי ${after}`); fs.writeFileSync('logic256b.json',JSON.stringify(out));
