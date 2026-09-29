// מדידה הוגנת: תוכניות ארוכות שהלמידה לא ראתה. לכל אחת — אותו זמן בדיוק, פעם עם בחירה אקראית ופעם עם בחירה לפי הלמידה.
import fs from 'fs'; import { checker, ALPHA } from './tools2.mjs';
let s=5; const R=(n)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%n; }, U=()=>R(1e6)/1e6;
const key=(x)=>x?(x[0]==='WHERE'?(x[2]?'W@':'W'+x[1]):x[0]):'^';
function rebuild(p,order,ins){ return order.map((o,i)=>o==null?ins[i]:p[o]); }
function mk(p,kind,i,a,w,k){ const n=p.length, o=[...Array(n).keys()]; const P=key(p[i-1]),C=key(p[i]),N=key(p[i+1]); let q,ins={};
  if(kind==='D'){ q=o.slice(); q.splice(i,1); } else if(kind==='R'){ if(!p[i]||key(a)===C) return null; q=o.slice(); q[i]=null; ins[i]=a; }
  else if(kind==='I'){ q=o.slice(); q.splice(i,0,null); ins[i]=a; } else if(kind==='M'){ if(i+w>n) return null; const seg=o.slice(i,i+w); q=[...o.slice(0,i),...o.slice(i+w)]; if(k>q.length||k===i) return null; q.splice(k,0,...seg); }
  else { if(i+w>n) return null; q=[...o.slice(0,i),...o.slice(i+w)]; }
  const t=kind+(w?w:''); const A=a?key(a):'-'; return {p:rebuild(p,q,ins), f:`${t}|${P}|${C}|${N}|${A}`, feats:[`t:${t}`,`t:${t}|c:${C}`,`t:${t}|p:${P}`,`t:${t}|n:${N}`,`t:${t}|a:${A}`,`c:${C}|a:${A}`,`p:${P}|c:${C}`,`t:${t}|p:${P}|c:${C}`]}; }
const rnd=(p)=>{ const n=p.length, t=R(9); if(t<2) return mk(p,'D',R(n)); if(t<4) return mk(p,'R',R(n),ALPHA[R(ALPHA.length)]); if(t<5) return mk(p,'I',R(n+1),ALPHA[R(ALPHA.length)]); if(t<8) return mk(p,'M',R(n),null,1+R(6),R(n+1)); return mk(p,'X',R(n),null,2+R(4)); };
const {tab,W}=JSON.parse(fs.readFileSync('learn2.json','utf8')); const sig=(z)=>1/(1+Math.exp(-z));
const both=(e)=>0.5*sig(e.feats.reduce((a,f)=>a+(W[f]||0),-3))+0.5*((tab.good[e.f]||0)+0.1)/((tab.tried[e.f]||0)+2);
function anneal(p0,ok,ms,guided){ let cur=p0,best=p0,t0=Date.now();
  while(Date.now()-t0<ms){ const T=1.2*(1-(Date.now()-t0)/ms)+0.05; let e=null;
    if(guided){ let bs=-1; for(let j=0;j<(+process.argv[4]||8);j++){ const c=rnd(cur); if(!c) continue; const v=both(c)*(0.5+U()); if(v>bs){ bs=v; e=c; } } } else e=rnd(cur); if(!e) continue;
    const d=e.p.length-cur.length; if(d>0&&U()>Math.exp(-d/T)) continue; if(e.p.length>best.length+8||!ok(e.p)) continue; cur=e.p; if(cur.length<best.length) best=cur; } return best; }
const tt=(t)=>()=>{ const m=Array.from({length:16},()=>Math.floor(Math.random()*16)); const a=m[0],bb=m[1],c=m[3]; let w=0; for(let k=0;k<4;k++){ const idx=(((a>>k)&1)<<2)|(((bb>>k)&1)<<1)|((c>>k)&1); w|=((t>>idx)&1)<<k; } return {mem:m,ok:r=>r[2]===w}; };
const fat=JSON.parse(fs.readFileSync('../viz/core2-state.before-shrink.json','utf8')).eng.lib.filter((_,i)=>i%6===3).slice(0,+process.argv[2]||24);
const MS=+process.argv[3]||3000; let A0=0,A1=0,A2=0,wins=0,ties=0,loss=0;
for(const b of fat){ const prog=[['WHERE',0],['GO'],...b.ops.map(([o,k])=>o==='W'?['WHERE',k]:[o])]; const ok=checker(tt(b.tt),60,20000); if(!ok(prog)) continue;
  const r=anneal(prog,ok,MS,false).length, gd=anneal(prog,ok,MS,true).length; A0+=prog.length; A1+=r; A2+=gd; if(gd<r) wins++; else if(gd===r) ties++; else loss++; }
console.log(`${wins+ties+loss} תוכניות שהלמידה לא ראתה · זמן זהה (${MS/1000} שנ') לכל ריצה`);
console.log(`בלי למידה: ${A0} → ${A1} · עם למידה: ${A0} → ${A2}`);
console.log(`הלמידה ניצחה ${wins} · תיקו ${ties} · הפסידה ${loss}`);
