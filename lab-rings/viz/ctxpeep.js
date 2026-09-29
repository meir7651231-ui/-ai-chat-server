// טבלת קיצורים לפי הקשר: בכל נקודה בתוכנית מריצים את ההתחלה על 64 זיכרונות אמיתיים (מלוכלכים) ומקבלים «איך נראה העולם כאן».
// משם בונים את כל הרצפים עד D (רק כאלה שמביאים מצב חדש), ורושמים לכל מצב-עולם את הרצף הקצר ביותר שמגיע אליו.
// כל נקודה מאוחרת יותר j בתוכנית: אם אותו מצב-עולם בדיוק מושג ברצף קצר יותר — מחליפים. בסוף התוכנית רק תא 2 חשוב.
const ATOM=[...[0,1,2,3,4,5,6,7].map(k=>["W",k]),["GO"],["TAKE"],["PUT"],["CALC"]];
function step(S,[o,k]){ if(!S) return null; const m=S.m.slice(), st=S.st.slice(); let A=S.A,P=S.P;
  if(o==="W")A=k; else if(o==="GO")P=A; else if(o==="TAKE"){ if(st.length>=4) return null; st.push(m[P]); }
  else if(o==="PUT"){ if(!st.length) return null; m[P]=st.pop(); } else { if(st.length<2) return null; const b=st.pop(),a=st.pop(); st.push(~(a&b)&15); }
  return {m,st,A,P}; }
const keyFull=(Ss)=>Ss.map(S=>S?S.m.join(",")+"|"+S.A+S.P+"|"+S.st.join(","):"x").join(";");
const keyOut=(Ss)=>Ss.map(S=>S?S.m[2]:"x").join(",");
function optimizeCtx(ops,works,mems,D=4,cap=40000){ let cur=ops.slice(), improved=true;
  while(improved){ improved=false;
    // מצבים לאורך התוכנית
    const trace=[mems.map(m=>({m:m.slice(),st:[],A:0,P:0}))]; for(const op of cur) trace.push(trace[trace.length-1].map(S=>step(S,op)));
    const n=cur.length;
    for(let i=0;i<n&&!improved;i++){ if(trace[i].some(S=>!S)) break;
      const full=new Map(), out=new Map(); let layer=[{seq:[],Ss:trace[i]}]; full.set(keyFull(trace[i]),[]); out.set(keyOut(trace[i]),[]);
      for(let d=1;d<=D&&layer.length;d++){ const next=[]; for(const {seq,Ss} of layer) for(const a of ATOM){ const T=Ss.map(S=>step(S,a)); if(T.some(S=>!S)) continue;
          const kf=keyFull(T); if(full.has(kf)) continue; const q=[...seq,a]; full.set(kf,q); const ko=keyOut(T); if(!out.has(ko)) out.set(ko,q); if(full.size<cap) next.push({seq:q,Ss:T}); } layer=next; }
      for(let j=n;j>i+1&&!improved;j--){ const r=j===n?out.get(keyOut(trace[j])):full.get(keyFull(trace[j])); if(!r||r.length>=j-i) continue;
        const cand=[...cur.slice(0,i),...r,...cur.slice(j)]; if(works(cand)){ cur=cand; improved=true; } } } }
  return cur; }
module.exports={optimizeCtx};
