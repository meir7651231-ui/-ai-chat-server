import fs from 'fs'; import { run } from './machine3.mjs';
const n=process.argv[2], f=process.argv[3]; let j=JSON.parse(fs.readFileSync(f,'utf8')); const p=Array.isArray(j)?j:j.named.find(x=>x.name===n).prog;
// מריץ על רשימות אקראיות ומדווח על כל גישה לתא >15: באיזו שורה
const hits={}; let s=5; const R=k=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%k; };
for(let t=0;t<2000;t++){ const q=[8,9,10,11,12,13,14,15].sort(()=>R(3)-1); const l=q.slice(0,R(9)); const m=Array.from({length:16},()=>R(16)); [0,1,8,9,10,11,12,13,14,15].forEach(c=>m[c]=0); m[1]=l[0]||0; l.forEach((x,i)=>m[x]=l[i+1]||0); m[0]=8+R(8);
  const pa=R(16),aa=R(16); const pre=[['WHERE',pa],['GO'],['WHERE',aa]]; const pp=[...pre,...p.map(([o,k,c])=>o==='WHERE'&&c==='code'?[o,k+3,c]:[o,k])];
  // עוקב: מריץ עם מלכודת
  let A=0,P=0,pc=0,st=[],mem=m.slice(),steps=0; while(pc<pp.length&&steps++<20000){ const [op,k]=pp[pc++]; if(op==='WHERE')A=k; else if(op==='WHERE@')A=st.pop()%16; else if(op==='GO')P=A; else if(op==='JUMP'){ if(st.pop()!==0)pc=A; } else if(op==='TAKE'||op==='PUT'){ if(P>15){ const key=`${op} שורה ${pc-4} P=${P}`; hits[key]=(hits[key]||0)+1; break; } if(op==='TAKE')st.push(mem[P]); else mem[P]=st.pop(); } else { const b=st.pop(),a=st.pop(); st.push(0); } } }
console.log(n, p.length, hits);
