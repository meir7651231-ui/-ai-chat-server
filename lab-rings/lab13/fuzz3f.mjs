// בדיקת שוויון: המכונה המהירה מול המכונה הקפדנית הרגילה — תוכניות אקראיות (עם לולאות וכתובות-קוד), זיכרון אקראי, ערבוב
import { run } from './machine3s.mjs'; import { encode, runCode, MEM } from './machine3f.mjs';
let s=17; const R=k=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%k; };
const OPS=['WHERE','WHERE@','GO','JUMP','TAKE','PUT','ADD','SHR','CALC']; let n=0,diff=0,kinds={};
for(let t=0;t<200000;t++){ const L=3+R(30); const p=[]; for(let i=0;i<L;i++){ const o=OPS[R(9)]; if(o==='WHERE') p.push(R(4)===0?['WHERE',R(L+1),'code']:['WHERE',R(20)]); else p.push([o]); }
  const mem=Array.from({length:16},()=>R(16)); const pa=R(16),aa=R(16), sc=R(2)?0:1+R(1e5), ms=[50,500,3000][R(3)];
  const q=[['WHERE',pa],['GO'],['WHERE',aa],...p.map(([o,k,c])=>o==='WHERE'?['WHERE',c?k+3:k]:[o])];
  const r=run(q,mem,{maxSteps:ms,scramble:sc}); const f=runCode(encode(p),pa,aa,mem,ms,sc); n++;
  const slow=!r?-1:(r.st.length?2:1); let same=slow===f; if(same&&f!==-1) for(let i=0;i<16;i++) if(r.mem[i]!==MEM[i]) same=false;
  kinds[slow]=(kinds[slow]||0)+1; if(!same){ diff++; if(diff<4) console.log('הבדל!',JSON.stringify(p),slow,f); } }
console.log(`${n} תוכניות אקראיות · הבדלים: ${diff} · (נכשל ${kinds[-1]||0}, נקי ${kinds[1]||0}, מחסנית ${kinds[2]||0})`);
