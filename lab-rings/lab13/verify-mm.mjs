import fs from 'fs'; import { run } from './machine3s.mjs';
for(const f of ['lm-mmA.json','lm-mmB.json']){ const p=JSON.parse(fs.readFileSync(f,'utf8')); let s=777; const R=k=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%k; };
 const KEEP=[0,1,8,9,10,11,12,13,14,15]; let bad=0,n=0;
 for(let t=0;t<20000;t++){ const q=[8,9,10,11,12,13,14,15]; for(let i=7;i>0;i--){ const j=R(i+1); [q[i],q[j]]=[q[j],q[i]]; } const l=q.slice(0,R(9));
  const m=new Array(16).fill(0); m[1]=l[0]||0; l.forEach((x,i)=>m[x]=l[i+1]||0); const mem=m.map((v,k)=>KEEP.includes(k)?v:R(16));
  const mx=l.length?Math.max(...l):0, mn=l.length?Math.min(...l):15; const pa=R(16),aa=R(16), sc=t%2?1+R(1e5):0;
  const pp=[['WHERE',pa],['GO'],['WHERE',aa],...p.map(([o,k,c])=>o==='WHERE'?['WHERE',c?k+3:k]:[o])]; n++;
  const r=run(pp,mem,{maxSteps:50000,scramble:sc}); if(!r||r.st.length||r.mem[6]!==mx||r.mem[7]!==mn||KEEP.some(c=>r.mem[c]!==mem[c])) bad++; }
 const back=p.filter(([o,k,c],i)=>c==='code'&&k<i).length;
 console.log(f,'אורך',p.length,'· עברו',`${n-bad}/${n}`,'· קפיצות אחורה (לולאות):',back,'· זהה ל-A?', JSON.stringify(p)===fs.readFileSync('lm-mmA.json','utf8')); }
