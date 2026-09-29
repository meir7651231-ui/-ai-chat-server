// מדידה: כמה זמן לוקחת בדיקה אחת? ואיפה הזמן הולך?
import fs from 'fs'; import { run as runS } from './machine3s.mjs'; import { add4 } from './lifted-add.mjs'; import { shr4 } from './lifted-shr.mjs';
// טבלאות: ממלאים פעם אחת ע"י הרצת התוכניות המורמות עצמן (אותה תוצאה בדיוק, רק לא מחשבים מחדש כל פעם)
const ADD=new Uint8Array(256), SHR=new Uint8Array(16); for(let a=0;a<16;a++){ SHR[a]=shr4(a); for(let b=0;b<16;b++) ADD[a*16+b]=add4(a,b); }
function runT(prog, mem0, { cells=16, maxSteps=2000, scramble=0 }={}){ const mem=new Array(cells).fill(0); mem0.forEach((v,i)=>{ mem[i]=v; });
  let A=0,P=0,pc=0,steps=0; const st=[]; let sd=scramble; const rnd=()=>{ sd=(sd*1103515245+12345)%2147483648; return Math.floor((sd/2147483648)*cells); };
  while(pc<prog.length){ if(++steps>maxSteps) return null; const [op,k]=prog[pc++];
    if(op==='WHERE') A=k; else if(op==='WHERE@'){ if(!st.length) return null; A=st.pop()%cells; } else if(op==='GO') P=A;
    else if(op==='JUMP'){ if(!st.length) return null; if(st.pop()!==0){ const back=A<pc; pc=A; if(scramble&&back){ A=rnd(); P=rnd(); } } }
    else if(op==='TAKE'){ if(P>=cells) return null; st.push(mem[P]); } else if(op==='PUT'){ if(!st.length||P>=cells) return null; mem[P]=st.pop(); }
    else if(op==='ADD'){ if(st.length<2) return null; const b=st.pop(),a=st.pop(); st.push(ADD[a*16+b]); }
    else if(op==='SHR'){ if(!st.length) return null; st.push(SHR[st.pop()]); }
    else if(op==='CALC'){ if(st.length<2) return null; const b=st.pop(),a=st.pop(); st.push(~(a&b)&15); } }
  return { mem, st, steps, A, P }; }
const p=JSON.parse(fs.readFileSync('lm-mid.json','utf8')); let s=1; const R=k=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%k; };
const ex=[]; for(let t=0;t<3000;t++){ const q=[8,9,10,11,12,13,14,15].sort(()=>R(3)-1); const l=q.slice(0,R(9)); const m=Array.from({length:16},()=>R(16)); [0,1,8,9,10,11,12,13,14,15].forEach(c=>m[c]=0); m[1]=l[0]||0; l.forEach((x,i)=>m[x]=l[i+1]||0); ex.push(m); }
for(const [nm,f] of [['היום',runS],['עם טבלאות',runT]]){ const t=process.hrtime.bigint(); let chk=0; for(const m of ex){ const r=f(p,m,{maxSteps:50000}); chk+=r?r.mem[2]:99; } console.log(nm, Number(process.hrtime.bigint()-t)/1e6|0,'אלפיות-שנייה', 'בדיקת-שוויון', chk); }
