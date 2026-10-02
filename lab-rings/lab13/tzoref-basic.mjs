// «בונה-יסודות»: רק חבר / נאנד / חצי על שני תאים — כל 256 הקלטים בבת אחת. קדימה (מהקטן לגדול) + אחורה (מהתשובה)
const key=v=>Buffer.from(v).toString('latin1');
export function basicBuild(tt,{ms=60000,maxBank=4000000,ins=[0,1]}={}){ const t0=Date.now(); const W=Uint8Array.from(tt), wk=key(W); const N=W.length, K=ins.length;
  const leaf=j=>Uint8Array.from({length:N},(_,i)=>(i>>(4*(K-1-j)))&15);   // תא-קלט מספר j: הספרה ה-j של האינדקס
  const seen=new Map(), lev=[[]]; let found=null;
  const add=(v,e,s)=>{ const k=key(v); if(seen.has(k)) return; seen.set(k,{e,s}); (lev[s]||(lev[s]=[])).push({v,e}); if(k===wk) found=e; };
  ins.forEach((c,j)=>add(leaf(j),{c},0)); if(found) return {expr:found,ms:Date.now()-t0};
  // אחורה: חבר — ? = תשובה פחות x (תשובה אחת). נאנד — ביטים שבהם x=1 קובעים את ?, השאר חופשיים: מנסים למלא אותם כמו ?-מוכר
  const want=new Map(); const wantAdd=(v,mk)=>{ const k=key(v); if(seen.has(k)){ found=mk(seen.get(k).e); return true; } if(want.size<2e6&&!want.has(k)) want.set(k,mk); return false; };
  const back=x=>{ const y=new Uint8Array(N); for(let i=0;i<N;i++) y[i]=(W[i]-x.v[i])&15; if(wantAdd(y,e=>({o:'ADD',a:x.e,b:e}))) return;
    let ok=true; const fix=new Uint8Array(N), msk=new Uint8Array(N); for(let i=0;i<N;i++){ const nw=(~W[i])&15; if((~x.v[i]&15)&~nw&15){ ok=false; break; } }   // נאנד: איפה ש-x=0 התשובה חייבת להיות 1
    if(!ok) return; for(let i=0;i<N;i++){ msk[i]=x.v[i]; fix[i]=(~W[i])&x.v[i]&15; }
    nandT.push({x,fix,msk}); };
  const nandT=[];   // «נאנד-מבוקש»: ? מתאים אם (?&msk)==fix בכל 256 — נבדק על כל ביטוי חדש
  const chkNand=(v,e)=>{ for(const t of nandT){ let ok=true; for(let i=0;i<N;i++) if((v[i]&t.msk[i])!==t.fix[i]){ ok=false; break; } if(ok) return {o:'NAND',a:t.x.e,b:e}; } return null; };
  for(const x of lev[0]) back(x);
  for(let s=1;!found&&Date.now()-t0<ms&&seen.size<maxBank;s++){ const L=lev[s]=lev[s]||[];
    const emit=(v,e)=>{ if(found) return; const k=key(v); if(seen.has(k)) return; if(want.has(k)){ found=want.get(k)(e); return; } if(nandT.length&&L.length<200000){ const r=chkNand(v,e); if(r){ found=r; return; } } add(v,e,s); };
    for(const x of lev[s-1]){ const v=new Uint8Array(N); for(let i=0;i<N;i++) v[i]=x.v[i]>>1; emit(v,{o:'SHR',a:x.e}); if(found) break; }
    for(let sa=0;sa<s&&!found;sa++){ const sb=s-1-sa; if(sb<sa) break; for(const x of lev[sa]||[]){ if(found||Date.now()-t0>ms||seen.size>maxBank) break; for(const y of lev[sb]||[]){ if(sa===sb&&y===x) {} 
          const v1=new Uint8Array(N), v2=new Uint8Array(N); for(let i=0;i<N;i++){ v1[i]=(x.v[i]+y.v[i])&15; v2[i]=(~(x.v[i]&y.v[i]))&15; }
          emit(v1,{o:'ADD',a:x.e,b:y.e}); emit(v2,{o:'NAND',a:x.e,b:y.e}); if(found) break; } } }
    if(!found&&s<=3) for(const x of L) back(x); if(nandT.length>3000) nandT.length=3000; }
  return {expr:found,ms:Date.now()-t0,bank:seen.size}; }
const size=e=>e.c!=null?0:1+size(e.a)+(e.b?size(e.b):0);
const depth=e=>e.c!=null?1:e.b?Math.max(depth(e.a),depth(e.b)+1):depth(e.a);
// לקוד: קודם הענף העמוק (כדי שהמחסנית לא תתמלא); חבר ונאנד — אפשר להחליף צדדים
export function compile(e,out=2){ const go=e=>{ if(e.c!=null) return [['WHERE',e.c],['GO'],['TAKE']]; if(e.o==='SHR') return [...go(e.a),['SHR']]; const [p,q]=depth(e.a)>=depth(e.b)?[e.a,e.b]:[e.b,e.a]; return [...go(p),...go(q),[e.o==='NAND'?'CALC':'ADD']]; };
  return [...go(e),['WHERE',out],['GO'],['PUT']]; }
export const showB=e=>e.c!=null?'תא'+e.c:e.o==='SHR'?`חצי(${showB(e.a)})`:`${e.o==='ADD'?'חבר':'נאנד'}(${showB(e.a)}, ${showB(e.b)})`;
export { size };

// טבלה מלאה מהמטרה: התשובה כפונקציה של תאי-הקלט בלבד (אם תלויה במשהו אחר — null)
export function tableOf(gen,ins,tries=0){ const K=ins.length, N=16**K; const T=new Int16Array(N).fill(-1); let left=N; const lim=tries||N*40;
  for(let t=0;t<lim&&left;t++){ const e=gen(); if(e.want==null) return null; let i=0; for(const c of ins) i=i*16+(e.mem[c]&15); const w=e.want&15; if(T[i]<0){ T[i]=w; left--; } else if(T[i]!==w) return null; }
  return left?null:Array.from(T); }
