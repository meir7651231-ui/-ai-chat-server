// «בונה-יסודות»: רק חבר / נאנד / חצי על שני תאים — כל 256 הקלטים בבת אחת. קדימה (מהקטן לגדול) + אחורה (מהתשובה)
const key=v=>Buffer.from(v).toString('latin1');
export function basicBuild(tt,{ms=60000,maxBank=4000000,ins=[0,1],ops=[],multi=0}={}){ const sols=[]; const t0=Date.now(); const W=Uint8Array.from(tt), wk=key(W); const N=W.length, K=ins.length;
  const leaf=j=>Uint8Array.from({length:N},(_,i)=>(i>>(4*(K-1-j)))&15);   // תא-קלט מספר j: הספרה ה-j של האינדקס
  const seen=new Map(), lev=[[]]; let found=null;
  const add=(v,e,s)=>{ const k=key(v); if(seen.has(k)) return; seen.set(k,{e,s}); (lev[s]||(lev[s]=[])).push({v,e}); if(k===wk) found=e; };
  ins.forEach((c,j)=>add(leaf(j),{c},0)); if(found) return {expr:found,ms:Date.now()-t0};
  // אחורה: חבר — ? = תשובה פחות x (תשובה אחת). נאנד — ביטים שבהם x=1 קובעים את ?, השאר חופשיים: מנסים למלא אותם כמו ?-מוכר
  const want=new Map(); const wantAdd=(v,mk)=>{ const k=key(v); if(seen.has(k)){ found=mk(seen.get(k).e); return true; } if(want.size<2e6&&!want.has(k)) want.set(k,mk); return false; };
  const T1=[]; const back=x=>{ const y=new Uint8Array(N); for(let i=0;i<N;i++) y[i]=(W[i]-x.v[i])&15; if(T1.length<4000) T1.push({v:y,mk:e=>({o:'ADD',a:x.e,b:e})}); if(wantAdd(y,e=>({o:'ADD',a:x.e,b:e}))) return;
    let ok=true; const fix=new Uint8Array(N), msk=new Uint8Array(N); for(let i=0;i<N;i++){ const nw=(~W[i])&15; if((~x.v[i]&15)&~nw&15){ ok=false; break; } }   // נאנד: איפה ש-x=0 התשובה חייבת להיות 1
    if(!ok) return; for(let i=0;i<N;i++){ msk[i]=x.v[i]; fix[i]=(~W[i])&x.v[i]&15; }
    nandT.push({x,fix,msk}); };
  const nandT=[];   // «נאנד-מבוקש»: ? מתאים אם (?&msk)==fix בכל 256 — נבדק על כל ביטוי חדש
  const chkNand=(v,e)=>{ for(const t of nandT){ let ok=true; for(let i=0;i<N;i++) if((v[i]&t.msk[i])!==t.fix[i]){ ok=false; break; } if(ok) return {o:'NAND',a:t.x.e,b:e}; } return null; };
  for(const x of lev[0]) back(x);
  for(let s=1;(!found||(multi&&sols.length<multi))&&Date.now()-t0<ms&&seen.size<maxBank;s++){ if(found&&multi){ sols.push(found); found=null; } const L=lev[s]=lev[s]||[];
    const emit=(v,e)=>{ if(found&&multi){ sols.push(found); found=null; if(sols.length>=multi) found=sols[0]; } if(found) return; const k=key(v); if(seen.has(k)) return; if(want.has(k)){ found=want.get(k)(e); return; } if(nandT.length&&L.length<200000){ const r=chkNand(v,e); if(r){ found=r; return; } } add(v,e,s); };
    for(const x of lev[s-1]){ const v=new Uint8Array(N); for(let i=0;i<N;i++) v[i]=x.v[i]>>1; emit(v,{o:'SHR',a:x.e}); if(found) break;
    }
    // קופסאות של שלושה קלטים — רק על תאי-הקלט עצמם (זול)
    if(s===(ops.find(o=>o.k===3)?.w||99)) for(const op of ops) if(op.k===3){ const L0=lev[0]; for(const x of L0) for(const y of L0) for(const z of L0){ if(x===y||y===z||x===z) continue; const u=new Uint8Array(N); for(let i=0;i<N;i++) u[i]=op.T[x.v[i]*256+y.v[i]*16+z.v[i]]; emit(u,{m:op.name,k:3,a:x.e,b:y.e,d:z.e}); } }
    // קופסאות: «מחיר» w לפי אורך הקוד שלהן — קופסה יקרה נכנסת רק בשכבה מאוחרת (קודם מנסים את הזול)
    for(const op of ops){ if(found) break; if(op.k===3) continue; const w=op.w||1; if(s-w<0) continue;
      if(op.k===1){ for(const x of lev[s-w]||[]){ const u=new Uint8Array(N); for(let i=0;i<N;i++) u[i]=op.T[x.v[i]]; emit(u,{m:op.name,k:1,a:x.e}); if(found) break; } continue; }
      for(let sa=0;sa<=s-w&&!found;sa++){ const sb=s-w-sa; for(const x of lev[sa]||[]){ if(found||Date.now()-t0>ms||seen.size>maxBank) break; for(const y of lev[sb]||[]){ if(x===y) continue;
          const u=new Uint8Array(N); for(let i=0;i<N;i++) u[i]=op.T[x.v[i]*16+y.v[i]]; emit(u,{m:op.name,k:2,a:x.e,b:y.e}); if(found) break; } } } }
    for(let sa=0;sa<s&&!found;sa++){ const sb=s-1-sa; if(sb<sa) break; for(const x of lev[sa]||[]){ if(found||Date.now()-t0>ms||seen.size>maxBank) break; for(const y of lev[sb]||[]){ if(sa===sb&&y===x) {} 
          const v1=new Uint8Array(N), v2=new Uint8Array(N); for(let i=0;i<N;i++){ v1[i]=(x.v[i]+y.v[i])&15; v2[i]=(~(x.v[i]&y.v[i]))&15; }
          emit(v1,{o:'ADD',a:x.e,b:y.e}); emit(v2,{o:'NAND',a:x.e,b:y.e}); if(found) break; } } }
    if(!found&&s<=3) for(const x of L) back(x); if(nandT.length>3000) nandT.length=3000;
    // שני צעדים אחורה: «מבוקש» = (מבוקש-ראשון) פחות x' — עוד צעד חבר; ו-(מבוקש-ראשון) = נאנד(x', ?) כשהוא נקבע
    if(!found&&s===3&&!process.env.NOBACK2){ const X=[...lev[0],...lev[1],...(lev[2]||[])].slice(0,600); for(const t of T1){ if(found||want.size>1.5e6) break; for(const x of X){ const y=new Uint8Array(N); for(let i=0;i<N;i++) y[i]=(t.v[i]-x.v[i])&15; if(wantAdd(y,e=>t.mk({o:'ADD',a:x.e,b:e}))) break; } } } }
  if(multi){ if(found&&!sols.includes(found)) sols.push(found); return {expr:sols[0]||null,all:sols,ms:Date.now()-t0,bank:seen.size}; }
  return {expr:found,ms:Date.now()-t0,bank:seen.size}; }
const size=e=>e.c!=null?0:1+size(e.a)+(e.b?size(e.b):0);
const hasM=(e,MAC={})=>e.c==null&&((e.m!=null&&!MAC[e.m])||hasM(e.a,MAC)||(e.b?hasM(e.b,MAC):false)||(e.d?hasM(e.d,MAC):false));
const depth=e=>e.c!=null||e.m!=null?1:e.b?Math.max(depth(e.a),depth(e.b)+1):depth(e.a);
// לקוד: קודם הענף העמוק (כדי שהמחסנית לא תתמלא); חבר ונאנד — אפשר להחליף צדדים
export function compile(e,out=2,MAC={}){ e=expand(e,MAC); const go=e=>{ if(e.c!=null) return [['WHERE',e.c],['GO'],['TAKE']]; if(e.o==='SHR') return [...go(e.a),['SHR']]; const [p,q]=depth(e.a)>=depth(e.b)?[e.a,e.b]:[e.b,e.a]; return [...go(p),...go(q),[e.o==='NAND'?'CALC':'ADD']]; };
  return [...go(e),['WHERE',out],['GO'],['PUT']]; }
export const showB=e=>e.c!=null&&e.m==null?'תא'+e.c:e.m!=null?`${e.m}(${showB(e.a)}${e.b?', '+showB(e.b):''}${e.d?', '+showB(e.d):''})`:e.o==='SHR'?`חצי(${showB(e.a)})`:`${e.o==='ADD'?'חבר':'נאנד'}(${showB(e.a)}, ${showB(e.b)})`;
export { size };

// טבלה מלאה מהמטרה: התשובה כפונקציה של תאי-הקלט בלבד (אם תלויה במשהו אחר — null)
export function tableOf(gen,ins,tries=0){ const K=ins.length, N=16**K; const T=new Int16Array(N).fill(-1); let left=N; const lim=tries||N*40;
  for(let t=0;t<lim&&left;t++){ const e=gen(); if(e.want==null) return null; let i=0; for(const c of ins) i=i*16+(e.mem[c]&15); const w=e.want&15; if(T[i]<0){ T[i]=w; left--; } else if(T[i]!==w) return null; }
  return left?null:Array.from(T); }

// קומפילציה עם «קופסאות» מהמדף: כל קופסה מחושבת קודם (מחסנית ריקה), התוצאה לתא-עבודה, ואז הביטוי הרגיל משתמש בתא כמו בקלט
export function compileH(e,{out=2,ins=[0,1],blocks,placements,rnd=false,MAC={}}){ e=expand(e,MAC); const prog=[]; const live=new Set(); const R=k=>rnd?Math.floor(Math.random()*k):0;
  const pool=[0,1,2,3,4,5,6,7].filter(c=>!ins.includes(c)&&c!==out); const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
  const usedC=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]));
  const hoist=e=>{ if(e.c!=null) return e; if(e.m==null) return {...e,a:hoist(e.a),b:e.b?hoist(e.b):undefined};
    const kids=[e.a,e.b,e.d].filter(Boolean).map(hoist); const cells=[];
    for(const k of kids){ if(k.c!=null){ cells.push(k.c); continue; } const free=pool.filter(c=>!live.has(c)); if(!free.length) throw 0; const t=free[R(free.length)]; prog.push(...shift(go(k),prog.length),['WHERE',t],['GO'],['PUT']); live.add(t); cells.push(t); }
    const b=blocks.get(e.m); const C=b.movable===false?[{prog:b.prog,ins:(b.ins||[]).filter(c=>c<8),out:b.out??2}]:placements(b,4000);
    const ok=C.filter(p=>p.ins.join()===cells.join()&&!ins.includes(p.out)&&!live.has(p.out)&&[...usedC(p.prog)].every(c=>c===p.out||cells.includes(c)||(!live.has(c)&&!ins.includes(c)&&c!==out)||(c===out&&p.out===out)));
    if(!ok.length) throw 0; const p=ok[R(ok.length)]; prog.push(...shift(p.prog,prog.length)); for(const c of cells) live.delete(c); live.add(p.out); return {c:p.out}; };
  const go=e=>{ if(e.c!=null) return [['WHERE',e.c],['GO'],['TAKE']]; if(e.o==='SHR') return [...go(e.a),['SHR']]; const [p,q]=depth(e.a)>=depth(e.b)?[e.a,e.b]:[e.b,e.a]; return [...go(p),...go(q),[e.o==='NAND'?'CALC':'ADD']]; };
  try{ const f=hoist(e); return [...prog,...shift(go(f),prog.length),['WHERE',out],['GO'],['PUT']]; }catch{ return null; } }
export { hasM };

// מתכון ⇒ פורשים בחזרה ליסודות (תא0/תא1 של המתכון = הארגומנטים)
export function expand(e,MAC){ if(e.c!=null) return e; const kids={a:expand(e.a,MAC),b:e.b?expand(e.b,MAC):undefined};
  if(e.m!=null&&MAC[e.m]){ const sub=x=>x.c!=null?(x.c===0?kids.a:kids.b):{...x,a:sub(x.a),b:x.b?sub(x.b):undefined}; return sub(MAC[e.m].expr); }
  const r={...e,a:kids.a}; if(e.b) r.b=kids.b; if(e.d) r.d=expand(e.d,MAC); return r; }
