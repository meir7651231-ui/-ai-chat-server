// «קוד אקראי»: תוכנית אקראית (קוראת תאים 0,1 · כותבת לתא 2). המכונה: (א) מקבלת את הקוד ומקצרת · (ב) מקבלת רק קלט⇐פלט ובונה מאפס
import { shorten, finalCheck, exec } from './tzoref.mjs'; import { valueBuild } from './tzoref-value.mjs'; import { basicBuild, compile, showB } from './tzoref-basic.mjs';
let SEED=+process.env.SEED||7; const rng=()=>{ SEED=(SEED+0x6D2B79F5)|0; let t=SEED; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }; const R=k=>Math.floor(rng()*k); const RR=k=>Math.floor(Math.random()*k); const MIN=+process.env.MIN||2, NP=+process.env.NP||8;
const OPS=['NAND','ADD','SHR'];
const rnd=d=>{ if(d<=0||R(4)===0) return {c:R(2)}; const o=OPS[R(3)]; return o==='SHR'?{o,a:rnd(d-1)}:{o,a:rnd(d-1),b:rnd(d-1)}; };
const ev=(e,a,b)=>e.c!=null?(e.c?b:a):e.o==='SHR'?ev(e.a,a,b)>>1:e.o==='ADD'?(ev(e.a,a,b)+ev(e.b,a,b))&15:(~(ev(e.a,a,b)&ev(e.b,a,b)))&15;
const comp=e=>e.c!=null?[['WHERE',e.c],['GO'],['TAKE']]:e.o==='SHR'?[...comp(e.a),['SHR']]:[...comp(e.a),...comp(e.b),[e.o==='NAND'?'CALC':'ADD']];
const show=e=>e.c!=null?(e.c?'ב':'א'):e.o==='SHR'?`חצי(${show(e.a)})`:`${e.o==='ADD'?'חבר':'נאנד'}(${show(e.a)}, ${show(e.b)})`;
let done=0; while(done<NP){ const e=rnd(4); const tt=[]; for(let a=0;a<16;a++) for(let b=0;b<16;b++) tt.push(ev(e,a,b));
  if(new Set(tt).size<4) continue; const code=[...comp(e),['WHERE',2],['GO'],['PUT']]; if(code.length<20||code.length>60) continue;
  const gen=()=>{ const m=Array.from({length:16},()=>RR(16)); const w=ev(e,m[0],m[1]); const a0=m[0],b0=m[1]; return {mem:m,want:w,ok:r=>r[2]===w&&r[0]===a0&&r[1]===b0}; };
  if(finalCheck(code,gen,2000).bad) continue; done++;
  const t1=Date.now(); const s1=process.env.ONLY?{prog:code}:shorten(code,gen,{minutes:MIN,quiet:9}); const T1=(Date.now()-t1)/1000;
  if(process.env.BASIC){ const t3=Date.now(); const r=basicBuild(tt,{ms:+process.env.BMS||60000}); const T3=(Date.now()-t3)/1000; if(!r.expr){ console.log(`#${done} ${show(e)}\n   מקור ${code.length} · בונה-יסודות ⇒ לא נמצא (${T3.toFixed(0)} שנ׳)`); continue; }
    let p=compile(r.expr); const ok0=!finalCheck(p,gen,3000).bad; let sp=p; if(ok0&&!process.env.ONLY) sp=shorten(p,gen,{minutes:MIN,quiet:9}).prog; const ok=!finalCheck(sp,gen).bad;
    console.log(`#${done} ${show(e)}\n   מקור ${code.length} · בונה-יסודות ⇒ ${p.length}${ok0?'':' ✗'}${process.env.ONLY?'':' ⇒ קוצר '+sp.length+(ok?'':' ✗')} (${T3.toFixed(0)} שנ׳) · נמצא: ${showB(r.expr)}`); continue; }
  const t2=Date.now(); let v=null; try{ v=valueBuild(gen,{name:'אקראי',ins:[0,1],out:2,ms:60000}); }catch{} let s2=null; if(v&&v.prog) s2=process.env.ONLY?{prog:v.prog}:shorten(v.prog,gen,{minutes:MIN,quiet:9}); const T2=(Date.now()-t2)/1000;
  const ok1=!finalCheck(s1.prog,gen).bad, ok2=s2?!finalCheck(s2.prog,gen).bad:false;
  console.log(`#${done} ${show(e)}\n   מקור ${code.length} · שיפור-הקוד ⇒ ${s1.prog.length}${ok1?'':' ✗'} (${T1.toFixed(0)} שנ׳) · בנייה-מאפס ⇒ ${s2?s2.prog.length+(ok2?'':' ✗'):'לא נמצא'} (${T2.toFixed(0)} שנ׳)`); }
process.exit(0);
