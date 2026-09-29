// טבלת קיצורים: כל הרצפים עד K פעולות, מקובצים לפי «מה הם עושים» (זיכרון, לאן, איפה, מחסנית — על 64 מצבים אקראיים).
// לכל קבוצה נשמר הרצף הקצר ביותר. אחר כך: כל חלון בכל תוכנית ⇒ אם יש רצף קצר יותר שעושה אותו דבר — מחליפים, ובודקים את כל התוכנית.
const ATOM=[...[0,1,2,3,4,5,6,7].map(k=>["W",k]),["GO"],["TAKE"],["PUT"],["CALC"]];
function makeStates(n,seed){ let s=seed; const R=(m)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%m; };
  return Array.from({length:n},()=>({m:Array.from({length:8},()=>R(16)),A:R(8),P:R(8),st:Array.from({length:R(5)},()=>R(16))})); }
const STATES=makeStates(64,20260928);
function sim(ops,S){ const m=S.m.slice(); let A=S.A,P=S.P; const st=S.st.slice();
  for(const [o,k] of ops){ if(o==="W")A=k; else if(o==="GO")P=A; else if(o==="TAKE"){ if(st.length>=4) return -1; st.push(m[P]); }
    else if(o==="PUT"){ if(!st.length) return -1; m[P]=st.pop(); } else { if(st.length<2) return -1; const b=st.pop(),a=st.pop(); st.push(~(a&b)&15); } }
  let h=(A*8+P)*5+st.length; for(const x of m) h=(h*16+x)>>>0 ^ (h>>>28); for(const x of st) h=((h*16+x)>>>0) ^ 0x9e3779b9; return h>>>0; }
function fp(ops){ let h1=2166136261, h2=5381; for(const S of STATES){ const v=sim(ops,S); h1=Math.imul(h1^v,16777619)>>>0; h2=(Math.imul(h2,33)^v)>>>0; } return h1+":"+h2; }
function build(K){ const best=new Map(); best.set(fp([]),[]); let layer=[[]];
  for(let L=1;L<=K;L++){ const next=[]; for(const p of layer) for(const a of ATOM){ const q=[...p,a]; const f=fp(q); if(!best.has(f)){ best.set(f,q); next.push(q); } } layer=next; }
  return best; }   // רק רצפים שעושים משהו חדש ממשיכים לשכבה הבאה — כך הבנייה נשארת קטנה
function optimize(ops,works,best,maxW=10){ let cur=ops.slice(), gained=true;
  while(gained){ gained=false;
    for(let w=Math.min(maxW,cur.length);w>=2&&!gained;w--) for(let i=0;i+w<=cur.length&&!gained;i++){ const r=best.get(fp(cur.slice(i,i+w))); if(!r||r.length>=w) continue;
      const cand=[...cur.slice(0,i),...r,...cur.slice(i+w)]; if(works(cand)){ cur=cand; gained=true; } } }
  return cur; }
module.exports={build,optimize,fp};
