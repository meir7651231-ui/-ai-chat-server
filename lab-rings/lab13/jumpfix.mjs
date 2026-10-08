// jumpfix.mjs — «נייד באמת»: תוכנית שקופצת לשורה קבועה בלי לסמן אותה ככתובת-קוד — נשברת כשמזיזים אותה.
//   deepRelocOk: לפני התוכנית ריפוד «ממולכד» (דוחף זבל למחסנית, מזיז מצביעים). קפיצה לתוך הריפוד ⇒ זבל נוסף ⇒ נכשל.
//   repairJumps: מריצים עם מעקב — כל קפיצה שנלקחה, מאיפה בא היעד שלה? יעד קבוע שלא סומן ⇒ מוסיפים לפני הקפיצה «לך לשורה X (קוד)».
import { run } from './machine3s.mjs'; import { add4 } from './lifted-add.mjs'; import { shr4 } from './lifted-shr.mjs';
const R=k=>Math.floor(Math.random()*k);
export const shiftC=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
export function deepRelocOk(p,gen,{n=40,maxSteps=600000}={}){ for(let t=0;t<n;t++){ const e=gen(); const k=3+R(10); const P=[]; for(let i=0;i<k;i++) P.push(['WHERE',R(16)],['GO'],['TAKE']); P.push(['WHERE',R(16)],['GO']);
    const r=run([...P,...shiftC(p,P.length)],e.mem,{maxSteps}); if(!r||r.st.length!==k||!e.ok(r.mem)) return false; } return true; }
// הרצה עם מעקב: לכל JUMP שנלקח — מקור הכתובת A: 'code' / 'plain' (WHERE בלי סימון) / 'data' (WHERE@)
function trace(prog,mem0,maxSteps=600000){ const mem=new Array(16).fill(0); mem0.forEach((v,i)=>{mem[i]=v;}); let A=0,P=0,pc=0,steps=0,src='plain'; const st=[]; const J=new Map();
  while(pc<prog.length){ if(++steps>maxSteps) return null; const at=pc; const [op,k,c]=prog[pc++];
    if(op==='WHERE'){ A=k; src=c==='code'?'code':'plain'; } else if(op==='WHERE@'){ if(!st.length) return null; A=st.pop()%16; src='data'; } else if(op==='GO') P=A;
    else if(op==='JUMP'){ if(!st.length) return null; if(st.pop()!==0){ if(!J.has(at)) J.set(at,new Set()); J.get(at).add(src+':'+A); pc=A; } }
    else if(op==='TAKE'){ if(P>=16) return null; st.push(mem[P]); } else if(op==='PUT'){ if(!st.length) return null; mem[P]=st.pop(); }
    else if(op==='ADD'){ if(st.length<2) return null; const b=st.pop(),a=st.pop(); st.push(add4(a,b)); } else if(op==='SHR'){ if(!st.length) return null; st.push(shr4(st.pop())); }
    else if(op==='CALC'){ if(st.length<2) return null; const b=st.pop(),a=st.pop(); st.push(~(a&b)&15); } }
  return J; }
export function repairJumps(prog,gen,{N=400}={}){ const all=new Map(); for(let t=0;t<N;t++){ const J=trace(prog,gen().mem); if(!J) return null; for(const [at,s] of J){ if(!all.has(at)) all.set(at,new Set()); for(const x of s) all.get(at).add(x); } }
  const fix=[]; for(const [at,s] of all){ const v=[...s]; if(v.every(x=>x.startsWith('code:'))) continue; if(v.some(x=>x.startsWith('data:'))||v.length!==1) return null; fix.push([at,+v[0].split(':')[1]]); }   // יעד מהנתונים / כמה יעדים ⇒ לא מתקנים
  if(!fix.length) return prog;
  // מכניסים «WHERE יעד (קוד)» לפני כל קפיצה כזו; כל כתובות-הקוד שאחרי נקודת-הכנסה זזות
  const at=new Set(fix.map(f=>f[0])), tgt=new Map(fix); const newIdx=[]; let off=0; for(let i=0;i<=prog.length;i++){ if(at.has(i)) off++; newIdx[i]=i+off; }
  // קפיצה לשורה i הישנה נוחתת על הפקודה המקורית (אחרי ה-WHERE שנוסף לפניה) — אותה התנהגות בדיוק
  const map=i=>newIdx[i];
  const out=[]; prog.forEach((x,i)=>{ if(at.has(i)) out.push(['WHERE',map(tgt.get(i)),'code']); out.push(x[2]==='code'&&x[1]>=0?['WHERE',map(x[1]),'code']:x); }); return out; }
