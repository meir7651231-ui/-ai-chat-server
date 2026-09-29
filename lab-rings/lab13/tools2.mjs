// כלי הקיצור, למכונה עם לולאות: קפיצות נשמרות — כתובת-קוד («WHERE k code») מוזזת כשמשהו לפניה נמחק/נוסף,
// ואסור לגעת בקטע שיש בו קפיצה, כתובת-קוד, או יעד של קפיצה.
import { run } from './machine2s.mjs';
export const ALPHA=[...[0,1,2,3,4,5,6,7].map(k=>['WHERE',k]),['WHERE@'],['GO'],['TAKE'],['PUT'],['CALC'],['ADD']];
export const plain=(p)=>p.map(([o,k])=>o==='WHERE'?['WHERE',k]:[o]);
export function replace(p,i,w,rep){ const n=p.length; if(i<0||i+w>n) return null; for(let j=i;j<i+w;j++){ const [o,,c]=p[j]; if(o==='JUMP'||c) return null; }
  for(const [o,k,c] of p) if(c&&k>i&&k<i+w) return null; if(i+w>n) return null; const d=rep.length-w;
  return [...p.slice(0,i),...rep,...p.slice(i+w)].map(x=>x[2]==='code'&&x[1]>=i+w?['WHERE',x[1]+d,'code']:x); }
export function checker(gen,N,maxSteps=3000){ const ex=Array.from({length:N},()=>{ const e=gen(); return {...e,sc:1+Math.floor(Math.random()*1e6)}; });
  // לבנה נכנסת באמצע תוכנית: «לאן» ו«איפה» לא מתחילים ב-0. לכן לפני כל בדיקה — כיוון אקראי שלהם (כתובות-קוד מוזזות ב-3)
  // כל צירופי «איפה»×«לאן» (16×16) מכוסים באופן שיטתי — לא באקראי, כדי שלא יישאר צירוף שלא נבדק
  return (p)=>{ for(let idx=0;idx<ex.length;idx++){ const e=ex[idx]; for(const sc of [0,e.sc]){ const pa=(idx*5+(sc?7:0))&15, aa=((idx>>4)*3+(sc?11:0)+idx)&15;
      const q=[['WHERE',pa],['GO'],['WHERE',aa],...p.map(([o,k,c])=>o==='WHERE'?['WHERE',c?k+3:k]:[o])];
      const r=run(q,e.mem,{maxSteps,scramble:sc}); if(!r||r.st.length||!e.ok(r.mem)) return false; } } return true; }; }
// מקצר רגיל: חלון עד 6 ⇒ עד 2
export function shrink(p,ok){ let better=true; const reps=[[],...ALPHA.map(a=>[a]),...ALPHA.flatMap(a=>ALPHA.map(b=>[a,b]))];
  while(better){ better=false; for(let w=6;w>=1&&!better;w--) for(let i=0;i+w<=p.length&&!better;i++) for(const rep of reps){ if(rep.length>=w) break; const q=replace(p,i,w,rep); if(q&&ok(q)){ p=q; better=true; break; } } }
  return p; }
// חישול עם כמה נקודות התחלה
export function anneal(p0,ok,ms,starts=4,seed=1){ let s=seed; const R=(n)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%n; }, U=()=>R(1e6)/1e6;
  const mut=(c)=>{ const L=c.length,i=R(L),m=R(6); const A=()=>ALPHA[R(ALPHA.length)];
    if(m===0) return replace(c,i,1,[]); if(m===1) return replace(c,i,1,[A()]); if(m===2) return replace(c,i,0,[A()]); if(m===3) return replace(c,i,1,[A(),A()]);
    if(m===4){ const w=2+R(3); return replace(c,i,w,Array.from({length:R(w)},A)); } const j=R(L); if(j===i) return null; const a=Math.min(i,j), b=Math.max(i,j); const x=c[a], y=c[b];
    if(x[0]==='JUMP'||y[0]==='JUMP'||x[2]||y[2]||c.some(z=>z[2]&&(z[1]===a||z[1]===b))) return null; const q=c.slice(); q[a]=y; q[b]=x; return q; };
  let best=p0.slice(); const pool=[best]; for(let k=1;k<starts;k++){ let c=best; for(let t=0;t<30;t++){ const d=mut(c); if(d&&d.length<=best.length+5&&ok(d)) c=d; } pool.push(c); }
  for(const st of pool){ let cur=st; const t0=Date.now(), end=t0+ms/starts;
    while(Date.now()<end){ const T=1.2*(1-(Date.now()-t0)/(end-t0))+0.05; const c=mut(cur); if(!c) continue; const d=c.length-cur.length; if(d>0&&U()>Math.exp(-d/T)) continue; if(c.length>best.length+8||!ok(c)) continue; cur=c; if(cur.length<best.length) best=cur.slice(); } }
  return shrink(best,ok); }
