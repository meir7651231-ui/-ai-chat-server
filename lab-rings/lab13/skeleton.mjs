// שלד «עבור על כל איבר» עם חור באמצע. מקצרים את השלד בלבד — וכל שינוי חייב לעבוד עם שלושה גופים שונים (ספירה, סכום, הגדול).
import fs from 'fs'; import { expand } from './recipes.mjs'; import { asm } from './machine2.mjs'; import { checker, ALPHA } from './tools2.mjs';
const sh=JSON.parse(fs.readFileSync('shelf.json','utf8')); const shelf=new Map(sh.named.map(b=>[b.name,b]));
let s=91; const rnd=(k)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%k; };
const shuffled=()=>{ const p=[8,9,10,11,12,13,14,15]; for(let i=7;i>0;i--){ const j=rnd(i+1); [p[i],p[j]]=[p[j],p[i]]; } return p; };
const LIST=[0,1,8,9,10,11,12,13,14,15];
const gen=(f)=>()=>{ const m=new Array(16).fill(0); const l=shuffled().slice(0,rnd(9)); m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; }); const w=f(l); const mem=m.map((v,k)=>LIST.includes(k)?v:rnd(16)); const bf=mem.slice(); return {mem,ok:r=>r[2]===w&&LIST.every(c=>r[c]===bf[c])}; };
const F15='TAKE; TAKE; CALC; TAKE; CALC';
const tag=(p)=>{ const out=p.map(x=>x.slice()); let last=-1; out.forEach(([o],i)=>{ if(o==='WHERE') last=i; else if(o==='WHERE@'||o==='GO') last=-1; else if(o==='JUMP'&&last>=0){ out[last]=['WHERE',out[last][1],'code']; last=-1; } }); return out; };
// גוף = קוד שמקבל «איפה אני» בתא 3 ומעדכן את תא 2. אתחול = לפני השלד.
const B=(rec)=>expand(rec,shelf);
const BODIES=[
 {name:'ספירה', init:tag(asm('WHERE 2; GO; '+F15+'; PUT; TAKE; TAKE; CALC; PUT')), body:B([{call:'ועוד 1 באותו תא',map:{2:2},free:[7,6,5,4,0]}]), f:l=>l.length},
 {name:'סכום', init:tag(asm('WHERE 2; GO; '+F15+'; PUT; TAKE; TAKE; CALC; PUT')), body:B([{call:'חיבור מספרים',map:{0:2,1:3,2:7},free:[6,5,4,0]},'WHERE 7; GO; TAKE; WHERE 2; GO; PUT']), f:l=>l.reduce((a,b)=>a+b,0)&15},
 {name:'הגדול', init:tag(asm('WHERE 2; GO; '+F15+'; PUT; TAKE; TAKE; CALC; PUT')), body:B([{call:'מקסימום',map:{0:2,1:3,2:7},free:[6,5,4]},'WHERE 7; GO; TAKE; WHERE 2; GO; PUT']), f:l=>l.length?Math.max(...l):0},
];
// שלד: HOLE = מקום הגוף
const SK0=tag(asm('WHERE 1; GO; TAKE; WHERE 3; GO; PUT; LOOP: WHERE 3; GO; TAKE; WHERE @BODY; JUMP; WHERE 3; GO; TAKE; TAKE; CALC; WHERE @END; JUMP; BODY: WHERE 3; GO; TAKE; HOLE; WHERE 3; GO; TAKE; WHERE@; GO; TAKE; WHERE 3; GO; PUT; WHERE @LOOP; JUMP; END:').map(x=>x[0]==='HOLE'?['HOLE']:x));
// הרכבה: הגוף נכנס במקום החור; כתובות-קוד מוזזות
function inst(sk,body,init){ const h=sk.findIndex(x=>x[0]==='HOLE'); const d=body.length-1, off=init.length;
  const skx=sk.flatMap((x,i)=>i===h?body.map(y=>y[2]==='code'?['WHERE',y[1]+h+off,'code']:y):[x[2]==='code'?['WHERE',x[1]>h?x[1]+d+off:x[1]+off,'code']:x]);
  return [...init,...skx]; }
const checks=BODIES.map(b=>({b,fast:checker(gen(b.f),30,80000),full:checker(gen(b.f),200,80000),fresh:checker(gen(b.f),1500,80000)}));
const okAll=(sk)=>checks.every(c=>c.fast(inst(sk,c.b.body,c.b.init)))&&checks.every(c=>c.full(inst(sk,c.b.body,c.b.init)));
const freshAll=(sk)=>checks.every(c=>c.fresh(inst(sk,c.b.body,c.b.init)));
// שינויים בשלד בלבד (החור, קפיצות וכתובות-קוד — לא נוגעים; יעדים מוזזים)
function rep(p,i,w,r){ if(i<0||i+w>p.length) return null; for(let j=i;j<i+w;j++){ const [o,,c]=p[j]; if(o==='JUMP'||c||o==='HOLE') return null; } for(const [o,k,c] of p) if(c&&k>i&&k<i+w) return null; const d=r.length-w;
  return [...p.slice(0,i),...r,...p.slice(i+w)].map(x=>x[2]==='code'&&x[1]>=i+w?['WHERE',x[1]+d,'code']:x); }
console.log('שלד התחלתי:',SK0.length-1,'פעולות · עובד עם שלושת הגופים:',freshAll(SK0), checks.map(c=>c.b.name+':'+c.fresh(inst(SK0,c.b.body,c.b.init))).join(' ')); if(process.argv[3]==='check') process.exit(0);
let best=SK0; const reps=[[],...ALPHA.map(a=>[a]),...ALPHA.flatMap(a=>ALPHA.map(b=>[a,b]))];
let better=true; while(better){ better=false; for(let w=6;w>=1&&!better;w--) for(let i=0;i+w<=best.length&&!better;i++) for(const r of reps){ if(r.length>=w) break; const q=rep(best,i,w,r); if(q&&okAll(q)){ best=q; better=true; break; } } }
console.log('אחרי מקצר:',best.length-1); fs.writeFileSync('skeleton.json',JSON.stringify(best));
let s2=5; const R=(n)=>{ s2=(Math.imul(s2,1103515245)+12345)&0x7fffffff; return (s2>>>16)%n; }; const U=()=>R(1e6)/1e6; const A=()=>ALPHA[R(ALPHA.length)];
let cur=best; const t0=Date.now(), MS=+process.argv[2]||120000;
while(Date.now()-t0<MS){ const T=1.0*(1-(Date.now()-t0)/MS)+0.05; const L=cur.length, i=R(L), m=R(5); let c=null;
  if(m===0) c=rep(cur,i,1,[]); else if(m===1) c=rep(cur,i,1,[A()]); else if(m===2) c=rep(cur,i,0,[A()]); else if(m===3) c=rep(cur,i,1,[A(),A()]); else { const w=2+R(3); c=rep(cur,i,w,Array.from({length:R(w)},A)); }
  if(!c) continue; const d=c.length-cur.length; if(d>0&&U()>Math.exp(-d/T)) continue; if(c.length>best.length+6||!okAll(c)) continue; cur=c; if(cur.length<best.length&&freshAll(cur)){ best=cur; console.log('  שלד:',best.length-1); fs.writeFileSync('skeleton.json',JSON.stringify(best)); } }
console.log('שלד סופי:',best.length-1,'· עובד עם שלושת הגופים על 1500 רשימות חדשות:',freshAll(best));
for(const c of checks) console.log(`  ${c.b.name}: אתחול ${c.b.init.length} + שלד ${best.length-1} + גוף ${c.b.body.length} = ${inst(best,c.b.body,c.b.init).length}`);
fs.writeFileSync('skeleton.json',JSON.stringify(best));
