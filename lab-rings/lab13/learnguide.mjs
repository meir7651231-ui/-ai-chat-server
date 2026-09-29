// העיקרון של «רשת + לומד»: לומדים מכל קיצור שהצליח — איזה שינוי, באיזה הקשר — ומשתמשים בזה כדי לבחור מה לנסות קודם.
// 1) ניסיון: הרבה לבנים, כל שינוי אחד שמשאיר אותן עובדות ומקצר / שומר אורך — נרשם עם ההקשר שלו.
// 2) לומד: סופר מה הצליח באיזה הקשר (תדירות מוחלקת).
// 3) חיפוש מונחה של עד 3 שינויים: בכל שלב רק K השינויים שהלומד מדרג הכי גבוה (גם שבורים באמצע).
import fs from 'fs'; import { run } from './machine2.mjs'; import { makeSpecs } from './specs.mjs'; import { checker, ALPHA, plain } from './tools2.mjs';
const key=(x)=>x?(x[0]==='WHERE'?(x[2]?'W@code':'W'+x[1]):x[0]):'^';
function rebuild(p,order,ins){ const newPos=new Map(); order.forEach((o,i)=>{ if(o!=null&&!newPos.has(o)) newPos.set(o,i); }); const L=order.length;
  const mapT=(t)=>{ if(t>=p.length) return L; for(let x=t;x<p.length;x++) if(newPos.has(x)) return newPos.get(x); return L; };
  return order.map((o,i)=>{ const x=o==null?ins[i]:p[o]; return x[2]==='code'?['WHERE',mapT(x[1]),'code']:x; }); }
function* edits(p){ const n=p.length, o=[...Array(n).keys()];
  for(let i=0;i<n;i++){ const q=o.slice(); q.splice(i,1); yield {p:rebuild(p,q,{}),f:`D|${key(p[i-1])}|${key(p[i])}|${key(p[i+1])}`}; }
  for(let i=0;i<n;i++){ if(p[i][2]||p[i][0]==='JUMP') continue; for(const a of ALPHA){ const q=o.slice(); q[i]=null; yield {p:rebuild(p,q,{[i]:a}),f:`R|${key(p[i-1])}|${key(p[i])}|${key(p[i+1])}|${key(a)}`}; } }
  for(let i=0;i<=n;i++) for(const a of ALPHA){ const q=o.slice(); q.splice(i,0,null); yield {p:rebuild(p,q,{[i]:a}),f:`I|${key(p[i-1])}|${key(p[i])}|${key(a)}`}; } }
// ---- 1+2: ניסיון ולמידה. «הצלחה» = השינוי שומר את הלבנה עובדת (על 60 דוגמאות).
const {S}=makeSpecs(51); const sh=JSON.parse(fs.readFileSync('shelf.json','utf8'));
const tt=(t)=>()=>{ const m=Array.from({length:16},()=>Math.floor(Math.random()*16)); const a=m[0],bb=m[1],c=m[3]; let w=0; for(let k=0;k<4;k++){ const idx=(((a>>k)&1)<<2)|(((bb>>k)&1)<<1)|((c>>k)&1); w|=((t>>idx)&1)<<k; } return {mem:m,ok:r=>r[2]===w}; };
const pool=[...sh.logic.filter((_,i)=>i%4===0).map(b=>({prog:b.prog,g:tt(b.tt)})), ...sh.named.filter(b=>S[b.name]&&b.prog.length<60).map(b=>({prog:b.prog,g:S[b.name]}))];
const good=new Map(), all=new Map(); let t0=Date.now();
for(const {prog,g} of pool){ const ok=checker(g,60,20000); for(const e of edits(prog)){ all.set(e.f,(all.get(e.f)||0)+1); if(e.p.length<=prog.length&&ok(e.p)) good.set(e.f,(good.get(e.f)||0)+1); } }
const score=(f)=>((good.get(f)||0)+0.05)/((all.get(f)||0)+1);
console.log(`למידה: ${pool.length} לבנים · ${all.size} סוגי שינוי שונים · ${[...good.values()].reduce((a,b)=>a+b,0)} שינויים שהצליחו · ${((Date.now()-t0)/1000).toFixed(0)}s`);
fs.writeFileSync('learned.json',JSON.stringify({good:[...good],all:[...all]}));
// ---- 3: חיפוש מונחה, עד 3 שינויים
const name='אורך רשימה (לולאה + ספירה)'; const L=[0,1,8,9,10,11,12,13,14,15];
const g=()=>{ const e=S[name](); const b=e.mem.slice(); return {mem:e.mem,ok:r=>e.ok(r)&&L.every(c=>r[c]===b[c])}; };
const full=checker(g,300,20000), fresh=checker(g,3000,20000); const quick=checker(g,30,20000);
const start=JSON.parse(fs.readFileSync('bigmoves.json','utf8')); const K=+process.argv[2]||400; t0=Date.now(); let best=start;
let layer=[{p:start,s:0}]; const seen=new Set([JSON.stringify(start)]);
for(let d=1;d<=3;d++){ const cand=[];
  for(const c of layer) for(const e of edits(c.p)){ const k=JSON.stringify(e.p); if(seen.has(k)) continue; seen.add(k); cand.push({p:e.p,s:c.s+Math.log(score(e.f))}); }
  for(const c of cand) if(c.p.length<best.length&&quick(c.p)&&full(c.p)&&fresh(c.p)){ best=c.p; console.log(`  ✓ ${d} שינויים ⇒ ${best.length}`); }
  cand.sort((a,b)=>b.s-a.s); layer=cand.slice(0,K); console.log(`שלב ${d}: ${cand.length} מועמדים · ממשיכים עם ${layer.length} הכי סבירים · הכי טוב ${best.length} · ${((Date.now()-t0)/1000).toFixed(0)}s`); }
fs.writeFileSync('learnguide.json',JSON.stringify(best)); console.log('סוף:',best.length,'(ביד 39)');
