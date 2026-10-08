// «פריסת ביטים» (bit slicing): כל ביט של התשובה — פונקציה בוליאנית של ביטי-הקלט; נבנה לבד, ומורכב בסוף.
//   1. טבלה מלאה (כל צירופי הקלט) ⇒ 4 «מישורים»: מישור j = ביט j של התשובה בכל צירוף (סיביות ארוזות).
//   2. מחסן-ערכים: כל הביטויים הקטנים (חבר / נאנד / חצי, ו-15) על תאי-הקלט — לפי אורך-קוד, בלי כפילויות.
//      + «אינדקס-מישורים»: לכל ערך ולכל מקום-ביט L — המישור שלו ⇒ חיפוש מדויק ב-O(1).
//   3. לכל ביט j בוחרים «מקום-חישוב» c: c≥j (ואז «חצי» c-j פעמים) או c=0 (ואז «כפול 2» j פעמים).
//      במקום c מחפשים ערך שהביט שלו (במקום L≥c) נכון. אין? מפרקים לפי ביט-קלט x:
//        · שאנון: x ? f1 : f0  (נאנד-נאנד-נאנד עם x ו«לא x»)
//        · במקום 0 בלבד — «חבר» הוא XOR (אין נשא שנכנס לביט 0): דאוויו f = f0 ⊕ (x ∧ (f0⊕f1)), ו«פגישה באמצע»: f = g ⊕ h.
//      כל חלק «מורם» (לא תלוי ב-x) — כך כל תת-בעיה היא פונקציה שלמה ואפשר לחפש אותה באינדקס.
//      בסוף הפירוק תמיד יש קבוע ⇒ מדויק לכל פונקציה; השאלה רק האורך.
//   4. הרכבה: ביט (או קבוצת ביטים שאותו ערך נותן) נגזר במסיכה: נאנד(ערך, מסיכה); שני גזורים ⇒ נאנד = «או»; קבוצות ⇒ חבר.
//   5. קוד: עץ ⇒ פקודות; ערך שחוזר — מחושב פעם אחת לתא-עבודה; «לאן/לך» מיותרים לא נכתבים.
import { tableOf } from './tzoref-basic.mjs';

const pc32=x=>{ x=x-((x>>>1)&0x55555555); x=(x&0x33333333)+((x>>>2)&0x33333333); return (((x+(x>>>4))&0x0F0F0F0F)*0x01010101)>>>24; };

// ─── צמתים (DAG: אותו ביטוי ⇒ אותו צומת) ───
function makeIR(){ const tab=new Map(); let id=0;
  const mk=(op,a,b,c)=>{ const k=op+':'+(a?.id??a)+':'+(b?.id??b??'')+':'+(c??''); let n=tab.get(k); if(!n){ n={id:id++,op,a,b,c}; tab.set(k,n); } return n; };
  const R={ cell:c=>mk('cell',null,null,c), k15:()=>mk('k15'), shr:a=>mk('shr',a), nand:(a,b)=>a.id<=b.id?mk('nand',a,b):mk('nand',b,a), add:(a,b)=>a.id<=b.id?mk('add',a,b):mk('add',b,a) };
  R.not=a=>R.nand(a,R.k15()); R.and=(a,b)=>R.not(R.nand(a,b)); R.dbl=a=>R.add(a,a); R.shrN=(a,k)=>{ for(let i=0;i<k;i++) a=R.shr(a); return a; }; R.dblN=(a,k)=>{ for(let i=0;i<k;i++) a=R.dbl(a); return a; };
  return R; }

// ─── קוד: ערך שמשמש פעמיים או יותר (ויקר מספיק) — מחושב פעם אחת לתא-עבודה ───
//   תאים: רק 16 (פחות הקלטים והתשובה) ⇒ תא משתחרר אחרי השימוש האחרון בו ומשמש שוב («חיים» של ערך = מההגדרה עד השימוש האחרון).
//   אם אין תא פנוי — מוותרים על השיתוף של הערך הכי פחות משתלם באותו רגע, ומחשבים מחדש.
export function codegen(root,{scratch,out=2,maxNodes=Infinity}){ const nodes=new Map(); const walk=n=>{ if(nodes.has(n.id)) return; nodes.set(n.id,n); if(n.a) walk(n.a); if(n.b) walk(n.b); }; walk(root); if(nodes.size>maxNodes) return {prog:null,shared:0};
  const order=[]; const seen=new Set(); const topo=n=>{ if(seen.has(n.id)) return; seen.add(n.id); if(n.a) topo(n.a); if(n.b) topo(n.b); order.push(n); }; topo(root);
  const shared=new Set();
  const inl=new Map(); const cost=n=>{ if(shared.has(n.id)) return 3; if(inl.has(n.id)) return inl.get(n.id); const c=n.op==='cell'?3:n.op==='k15'?5:n.op==='shr'?cost(n.a)+1:cost(n.a)+cost(n.b)+1; inl.set(n.id,c); return c; };
  // «כמה פעמים הצומת נכתב בפועל» = סכום על ההורים (הורה משותף נכתב פעם אחת)
  const uses=()=>{ const u=new Map([[root.id,1]]); for(let k=order.length-1;k>=0;k--){ const n=order[k]; const m=shared.has(n.id)?1:(u.get(n.id)||0); for(const ch of [n.a,n.b]) if(ch) u.set(ch.id,(u.get(ch.id)||0)+m); } return u; };
  const gain=new Map(); const banned=new Set();
  const choose=()=>{ shared.clear(); let U=uses(); for(let k=order.length-1;k>=0;k--){ const n=order[k]; if(n===root||n.op==='cell'||banned.has(n.id)) continue; const r=U.get(n.id)||0; if(r<2) continue; inl.clear(); const c=cost(n); const g=r*c-(c+3+3*r); if(g>0){ shared.add(n.id); gain.set(n.id,g); U=uses(); } } };
  const refsOf=x=>{ const R=new Set(); const go=(n,top)=>{ if(!top&&shared.has(n.id)){ R.add(n.id); return; } if(n.a) go(n.a,false); if(n.b) go(n.b,false); }; go(x,true); return R; };
  let alloc=null;
  for(let it=0;it<500;it++){ choose(); const E=[...order.filter(n=>shared.has(n.id)),root]; const pos=new Map(E.map((n,i)=>[n.id,i])); const lastUse=new Map();
    E.forEach((x,i)=>{ for(const r of refsOf(x)) lastUse.set(r,Math.max(lastUse.get(r)||0,i)); });
    const freeC=scratch.slice(); const live=[]; const cellOf=new Map(); let bad=null;
    const bads=new Set();   // כל ההתנגשויות במעבר אחד (לא אחת-אחת) — מתכנס מהר גם ב-DAG ענק
    for(let i=0;i<E.length-1;i++){ for(let k=live.length-1;k>=0;k--){ if((lastUse.get(live[k])??i)<=i){ freeC.push(cellOf.get(live[k])); live.splice(k,1); } }
      const x=E[i]; if(!freeC.length){ const cand=[...live,x.id]; cand.sort((p,q)=>(gain.get(p)||0)-(gain.get(q)||0)); const b=cand[0]; bads.add(b); if(b===x.id) continue; const k=live.indexOf(b); freeC.push(cellOf.get(b)); live.splice(k,1); }
      cellOf.set(x.id,freeC.shift()); live.push(x.id); }
    if(bads.size){ bad=1; for(const b of bads) banned.add(b); }
    if(bad==null){ alloc=cellOf; break; } }
  if(!alloc){ shared.clear(); alloc=new Map(); }
  const prog=[]; let A=null, P=null;
  const go=c=>{ if(P===c) return; if(A!==c){ prog.push(['WHERE',c]); A=c; } prog.push(['GO']); P=c; };
  const emit=(n,top)=>{ if(!top&&shared.has(n.id)){ go(alloc.get(n.id)); prog.push(['TAKE']); return; }
    if(n.op==='cell'){ go(n.c); prog.push(['TAKE']); return; }
    if(n.op==='k15'){ if(P===null) go(scratch[0]??out); prog.push(['TAKE'],['TAKE'],['CALC'],['TAKE'],['CALC']); return; }
    if(n.op==='shr'){ emit(n.a); prog.push(['SHR']); return; }
    emit(n.a); emit(n.b); prog.push([n.op==='nand'?'CALC':'ADD']); };
  for(const n of order) if(shared.has(n.id)){ emit(n,true); go(alloc.get(n.id)); prog.push(['PUT']); }
  emit(root,true); go(out); prog.push(['PUT']); return {prog,shared:shared.size}; }

// ─── הבונה ───
export function bitsliceBuild(gen,{ins=[0,1],ms=240000,cap=+process.env.BSCAP||0,bankFrac=0.25,say=()=>{},T:T0=null,mitmG=+process.env.BSMITM||17}={}){ const t0=Date.now(); const K=ins.length;
  const T=T0||tableOf(gen,ins); if(!T) return {prog:null,why:'התשובה תלויה במשהו מלבד תאי-הקלט'};
  const N=T.length, W=(N+31)>>5, S=4*W; const last=N%32?((2**(N%32))-1)>>>0:0xFFFFFFFF; if(!cap) cap=K===1?20000:K===2?1500000:100000;
  const planes=vec=>{ const P=new Uint32Array(S); for(let x=0;x<N;x++) for(let j=0;j<4;j++) if((vec[x]>>j)&1) P[j*W+(x>>5)]|=1<<(x&31); return P; };
  const TP=planes(T); const tPl=j=>TP.slice(j*W,(j+1)*W);
  const leafVec=p=>Uint8Array.from({length:N},(_,x)=>(x>>(4*(K-1-p)))&15);
  const leafPl=[...ins.map((c,p)=>planes(leafVec(p))), planes(new Uint8Array(N).fill(15))];
  const full=new Uint32Array(W).fill(0xFFFFFFFF); full[W-1]=last;
  // ── 2. המחסן ──
  const V=new Uint32Array(cap*S), cst=new Uint8Array(cap), OP=new Uint8Array(cap), CA=new Int32Array(cap), CB=new Int32Array(cap); let n=0;
  const HS=1<<Math.ceil(Math.log2(cap*2)); const H=new Int32Array(HS).fill(-1);
  const tmp=new Uint32Array(S);
  const hashT=()=>{ let h=2166136261; for(let i=0;i<S;i++){ h=Math.imul(h^tmp[i],16777619); h^=h>>>15; } return (h>>>0)&(HS-1); };
  const push=(c,op,a,b)=>{ if(n>=cap) return false; let h=hashT(); for(;;){ const e=H[h]; if(e<0) break; let eq=true; const o=e*S; for(let i=0;i<S;i++) if(V[o+i]!==tmp[i]){ eq=false; break; } if(eq) return true; h=(h+1)&(HS-1); }
    H[h]=n; V.set(tmp,n*S); cst[n]=c; OP[n]=op; CA[n]=a; CB[n]=b; n++; return true; };
  const range=[]; const tBank=t0+ms*bankFrac;
  const leafCost=p=>p<K?3:5;
  for(let c=3;n<cap&&Date.now()<tBank&&c<64;c++){ const st=n;
    for(let p=0;p<=K;p++) if(leafCost(p)===c){ tmp.set(leafPl[p]); push(c,0,p,-1); }
    if(range[c-1]){ const [a0,a1]=range[c-1]; for(let x=a0;x<a1&&n<cap;x++){ const o=x*S; for(let i=0;i<3*W;i++) tmp[i]=V[o+W+i]; for(let i=3*W;i<S;i++) tmp[i]=0; push(c,1,x,-1); } }
    let stop=false;
    for(let ca=3;!stop&&ca<=c-1-ca;ca++){ const cb=c-1-ca; if(!range[ca]||!range[cb]) continue; const [a0,a1]=range[ca], [b0,b1]=range[cb];
      for(let x=a0;x<a1&&!stop;x++){ const ox=x*S; if((x&255)===0&&Date.now()>tBank){ stop=true; break; }
        for(let y=(ca===cb?x:b0);y<b1;y++){ const oy=y*S;
          for(let w=0;w<W;w++){ const m=w===W-1?last:0xFFFFFFFF; for(let L=0;L<4;L++) tmp[L*W+w]=(~(V[ox+L*W+w]&V[oy+L*W+w]))&m; }
          if(!push(c,2,x,y)){ stop=true; break; }
          for(let w=0;w<W;w++){ let cy=0; for(let L=0;L<4;L++){ const a=V[ox+L*W+w], b=V[oy+L*W+w]; tmp[L*W+w]=a^b^cy; cy=(a&b)|(cy&(a^b)); } }
          if(!push(c,3,x,y)){ stop=true; break; } } } }
    range[c]=[st,n]; if(stop) break; }
  // ── אינדקס-מישורים: (מישור, מקום L) ⇒ הערך הזול ביותר שזה המישור שלו במקום L ──
  const PS=1<<Math.ceil(Math.log2(n*8+16)); const PH=new Int32Array(PS).fill(-1);
  const hashP=(arr,off,L)=>{ let h=2166136261^Math.imul(L+1,0x9E3779B1); for(let i=0;i<W;i++){ h=Math.imul(h^arr[off+i],16777619); h^=h>>>15; } return (h>>>0)&(PS-1); };
  for(let i=0;i<n;i++) for(let L=0;L<4;L++){ const o=i*S+L*W; let h=hashP(V,o,L); for(;;){ const e=PH[h]; if(e<0){ PH[h]=i*4+L; break; } if((e&3)===L){ const eo=(e>>2)*S+L*W; let eq=true; for(let k=0;k<W;k++) if(V[eo+k]!==V[o+k]){ eq=false; break; } if(eq) break; } h=(h+1)&(PS-1); } }
  const lookP=(t,L)=>{ let h=hashP(t,0,L); for(;;){ const e=PH[h]; if(e<0) return -1; if((e&3)===L){ const eo=(e>>2)*S+L*W; let eq=true; for(let k=0;k<W;k++) if(V[eo+k]!==t[k]){ eq=false; break; } if(eq) return e>>2; } h=(h+1)&(PS-1); } };
  say(`  מחסן: ${n} ערכים, עד אורך ${range.length-1} (${((Date.now()-t0)/1000).toFixed(1)} שנ׳)`);
  const IR=makeIR(); const leafIR=p=>p<K?IR.cell(ins[p]):IR.k15();
  const bmemo=new Map(); const fromBank=i=>{ if(bmemo.has(i)) return bmemo.get(i); const o=OP[i]; const r=o===0?leafIR(CA[i]):o===1?IR.shr(fromBank(CA[i])):o===2?IR.nand(fromBank(CA[i]),fromBank(CB[i])):IR.add(fromBank(CA[i]),fromBank(CB[i])); bmemo.set(i,r); return r; };
  const NOTC=6;
  const notP=t=>{ const u=new Uint32Array(W); for(let w=0;w<W;w++) u[w]=(~t[w])&full[w]; return u; };
  // חיפוש מדויק (פונקציה שלמה) במקום c: ערך שהמישור שלו במקום L≥c שווה ל-t ⇒ «חצי» L-c פעמים
  const exact=(t,c)=>{ let best=null; const nt=notP(t); for(let L=c;L<4;L++){ for(const inv of [0,1]){ const i=lookP(inv?nt:t,L); if(i<0) continue; const cc=cst[i]+(L-c)+(inv?NOTC:0); if(!best||cc<best.cost) best={i,L2:L,inv,cost:cc}; } } return best; };
  // חיפוש עם «לא אכפת» (רק הצירופים שב-care) — סריקה של המחסן, עוצרת כשהמחיר כבר לא יכול לרדת
  const scan=(t,care,c,bound)=>{ let w0=-1, bp=-1; for(let w=0;w<W;w++){ const p=pc32(care[w]); if(p>bp){ bp=p; w0=w; } } if(bp<=0) return null;
    let best=null; for(let i=0;i<n;i++){ const lim=best?best.cost:bound; if(cst[i]>=lim) break; const o=i*S;
      for(let L2=c;L2<4;L2++){ const b=o+L2*W; const d=(V[b+w0]^t[w0])&care[w0]; const di=(~V[b+w0]^t[w0])&care[w0]; if(d&&di) continue;
        for(const inv of [0,1]){ if(inv?di:d) continue; const cc=cst[i]+(L2-c)+(inv?NOTC:0); if(cc>=(best?best.cost:bound)) continue; let ok=true; for(let w=0;w<W;w++){ const x=inv?~V[b+w]:V[b+w]; if((x^t[w])&care[w]){ ok=false; break; } } if(ok) best={i,L2,inv,cost:cc}; } } }
    return best; };
  const bankIR=(r,c)=>{ let e=IR.shrN(fromBank(r.i),r.L2-c); if(r.inv) e=IR.not(e); return e; };
  // «פגישה באמצע» במקום 0: t = g ⊕ h (חבר), g מהזולים, h מהאינדקס
  const mitm=(t,bound)=>{ let best=null; const need=new Uint32Array(W);
    for(let i=0;i<n;i++){ const lim=best?best.cost:bound; if(cst[i]+cst[0]+1>=lim||cst[i]>mitmG) break; const o=i*S;
      for(let L=0;L<4;L++){ const b=o+L*W; for(let w=0;w<W;w++) need[w]=t[w]^V[b+w]; for(let Lh=0;Lh<4;Lh++){ const h=lookP(need,Lh); if(h<0) continue; const cc=cst[i]+L+cst[h]+Lh+1; if(cc<(best?best.cost:bound)) best={g:i,Lg:L,h,Lh,cost:cc}; } } }
    return best; };
  // ── 3. פירוק ──
  const varPl=[]; for(let p=0;p<K;p++) for(let i=0;i<4;i++) varPl.push({p,i,pos:4*(K-1-p)+i,X:leafPl[p].slice(i*W,(i+1)*W)});
  const isZero=(t,care,inv)=>{ for(let w=0;w<W;w++){ const x=inv?~t[w]:t[w]; if(x&care[w]) return false; } return true; };
  // הרמה: f(x=b) כפונקציה שלמה (לא תלויה ב-x)
  const MSK=[0xAAAAAAAA,0xCCCCCCCC,0xF0F0F0F0,0xFF00FF00,0xFFFF0000];
  const lift=(t,v,b)=>{ const u=new Uint32Array(W); const pos=v.pos;
    if(pos>=5){ const d=1<<(pos-5); for(let w=0;w<W;w++){ const hi=(w>>(pos-5))&1; u[w]=b?(hi?t[w]:t[w+d]):(hi?t[w-d]:t[w]); } }
    else { const d=1<<pos, M=MSK[pos]; for(let w=0;w<W;w++){ u[w]=b?((t[w]&M)|((t[w]&M)>>>d)):((t[w]&~M)|((t[w]&~M)<<d)); u[w]&=full[w]; } }
    return u; };
  const eqP=(a,b)=>{ for(let w=0;w<W;w++) if(a[w]!==b[w]) return false; return true; };
  const xorP=(a,b)=>{ const u=new Uint32Array(W); for(let w=0;w<W;w++) u[w]=a[w]^b[w]; return u; };
  const andP=(a,b)=>{ const u=new Uint32Array(W); for(let w=0;w<W;w++) u[w]=a[w]&b[w]; return u; };
  const andnP=(a,b)=>{ const u=new Uint32Array(W); for(let w=0;w<W;w++) u[w]=a[w]&~b[w]&full[w]; return u; };
  const sel=(v,c)=>{ const leaf=IR.cell(ins[v.p]); return v.i>=c?IR.shrN(leaf,v.i-c):IR.dblN(leaf,c-v.i); };
  const selCost=(v,c)=>v.i>=c?3+(v.i-c):3+4*(c-v.i);
  const muxIR=(s,g,h)=>{ if(g==='O'&&h==='Z') return s; const ns=IR.nand(s,s); if(g==='Z'&&h==='O') return ns;
    if(h==='Z') return IR.and(s,g); if(g==='Z') return IR.and(ns,h);
    if(h==='O') return IR.nand(s,IR.nand(s,g)); if(g==='O') return IR.nand(ns,IR.nand(ns,h));
    return IR.nand(IR.nand(g,s),IR.nand(h,ns)); };
  const muxCost=(sc,g,h)=>{ const z=x=>x==='Z'||x==='O'; if(g==='O'&&h==='Z') return sc; if(g==='Z'&&h==='O') return 2*sc+1; if(z(g)&&z(h)) return 0;
    if(h==='Z'||g==='Z') return 2*sc+8; if(h==='O'||g==='O') return 2*sc+2; return 3*sc+4; };
  // דאוויו (רק במקום 0): f = f0 ⊕ (x ∧ g)
  const davIR=(s,f0,g)=>{ const xg=g==='O'?s:IR.and(s,g.ir); return f0==='Z'?xg:f0==='O'?IR.not(xg):IR.add(f0.ir,xg); };
  const davCost=(sc,f0,g)=>(g==='O'?sc:sc+g.cost+8)+(f0==='Z'?0:f0==='O'?NOTC:f0.cost+1);
  const supp=t=>{ let s=0; for(const v of varPl) if(!eqP(lift(t,v,0),lift(t,v,1))) s++; return s; };
  // ── הערכת צמתים על המישורים (לבדיקה ול«נקי») ──
  const evm=new Map(); const ev=nd=>{ if(evm.has(nd.id)) return evm.get(nd.id); let r=new Uint32Array(S);
    if(nd.op==='cell'){ r=leafPl[ins.indexOf(nd.c)]; } else if(nd.op==='k15') r=leafPl[K];
    else if(nd.op==='shr'){ const a=ev(nd.a); r.set(a.subarray(W,S),0); }
    else { const a=ev(nd.a), b=ev(nd.b); for(let w=0;w<W;w++){ if(nd.op==='nand'){ for(let L=0;L<4;L++) r[L*W+w]=(~(a[L*W+w]&b[L*W+w]))&full[w]; } else { let cy=0; for(let L=0;L<4;L++){ const x=a[L*W+w], y=b[L*W+w]; r[L*W+w]=x^y^cy; cy=(x&y)|(cy&(x^y)); } } } }
    evm.set(nd.id,r); return r; };
  const memo=new Map(), memo2=new Map(); const tEndAll=t0+ms*0.8; let tEnd=tEndAll, calls=0, fast=false; if(K>=3&&!process.env.BSMITM) mitmG=13;
  const keyOf=(t,c,care)=>c+'|'+Buffer.from(t.buffer,t.byteOffset,t.byteLength).toString('latin1')+'|'+Buffer.from(care.buffer,care.byteOffset,care.byteLength).toString('latin1');
  const val=x=>x==='Z'||x==='O'?0:x.cost;
  const quick=(u,cr,c)=>{ if(isZero(u,cr,0)) return {r:'Z',c:0}; if(isZero(u,cr,1)) return {r:'O',c:0}; const f=exact(u,c); return f?{c:f.cost}:{c:null,est:6+9*supp(u)}; };
  const est=q=>q.c!=null?q.c:q.est;
  // מחזיר {ir,cost} או 'Z'/'O' (קבוע במקום c). רקורסיבי, תמיד מצליח.
  const solve=(t,c,care,depth)=>{ calls++;
    if(isZero(t,care,0)) return 'Z'; if(isZero(t,care,1)) return 'O';
    const key=keyOf(t,c,care); if(memo.has(key)) return memo.get(key);
    const k2=c+'|'+Buffer.from(t.buffer,t.byteOffset,t.byteLength).toString('latin1'); const prev=memo2.get(k2);   // אותה פונקציה כבר נבנתה (עם «לא אכפת» אחר) — אם הפתרון נכון גם כאן, משתמשים בו (שיתוף ⇒ DAG)
    if(prev) for(const r of prev){ const P=ev(r.ir); let ok=true; for(let w=0;w<W;w++) if((P[c*W+w]^t[w])&care[w]){ ok=false; break; } if(ok){ memo.set(key,r); return r; } }
    if(!fast&&Date.now()>tEnd) fast=true;
    let best=null; const e=exact(t,c); if(e) best={ir:bankIR(e,c),cost:e.cost};
    if(!fast){ const s=scan(t,care,c,best?best.cost:255); if(s) best={ir:bankIR(s,c),cost:s.cost}; }
    const put=r=>{ memo.set(key,r); if(r&&r.ir){ if(!memo2.has(k2)) memo2.set(k2,[]); memo2.get(k2).push(r); } return r; };
    if(best&&best.cost<=10) return put(best);
    if(c===0&&!fast){ const m=mitm(t,best?best.cost:255); if(m){ const ir=IR.add(IR.shrN(fromBank(m.g),m.Lg),IR.shrN(fromBank(m.h),m.Lh)); best={ir,cost:m.cost}; } }
    // מועמדים לפירוק: מבט אחד קדימה (חיפוש מדויק לכל צד)
    const cands=[];
    for(const v of varPl){ const t1=lift(t,v,1), t0_=lift(t,v,0); if(eqP(t1,t0_)) continue; const c1=andP(care,v.X), c0=andnP(care,v.X); const sc=selCost(v,c);
      const q1=quick(t1,c1,c), q0=quick(t0_,c0,c); cands.push({kind:'sh',v,t1,t0:t0_,c1,c0,score:est(q1)+est(q0)+muxCost(sc,q1.r||{},q0.r||{})});
      if(c===0){ const g=xorP(t1,t0_); const qg1=quick(g,c1,c), qf0=quick(t0_,care,c); cands.push({kind:'dv',v,g,t0:t0_,c1,score:est(qf0)+(qg1.r==='O'?sc:sc+est(qg1)+8)+(qf0.r==='Z'?0:1)});
        const qg0=quick(g,c0,c), qf1=quick(t1,care,c); cands.push({kind:'dn',v,g,t1,c0,score:est(qf1)+(qg0.r==='O'?2*sc+1:2*sc+1+est(qg0)+8)+(qf1.r==='Z'?0:1)}); } }
    cands.sort((a,b)=>a.score-b.score);
    const width=fast?1:depth<2?3:depth<4?2:1;
    for(const cd of cands.slice(0,width)){ if(best&&cd.score>=best.cost*1.5) break; if(fast&&best) break; const s=sel(cd.v,c), sc=selCost(cd.v,c); let r=null;
      if(cd.kind==='sh'){ const g=solve(cd.t1,c,cd.c1,depth+1), h=solve(cd.t0,c,cd.c0,depth+1); r={ir:muxIR(s,g.ir||g,h.ir||h),cost:val(g)+val(h)+muxCost(sc,g.ir?{}:g,h.ir?{}:h)}; }
      else if(cd.kind==='dv'){ const f0=solve(cd.t0,c,care,depth+1), g=solve(cd.g,c,cd.c1,depth+1); if(g==='Z') continue; r={ir:davIR(s,f0,g),cost:davCost(sc,f0,g)}; }
      else { const f1=solve(cd.t1,c,care,depth+1), g=solve(cd.g,c,cd.c0,depth+1); if(g==='Z') continue; const ns=IR.nand(s,s); r={ir:davIR(ns,f1,g),cost:davCost(2*sc+1,f1,g)}; }
      if(r&&(!best||r.cost<best.cost)) best=r; }
    if(!best){ // ביטחון: שאנון על המשתנה הראשון שבתמיכה
      const cd=cands.find(x=>x.kind==='sh'); const g=solve(cd.t1,c,cd.c1,depth+1), h=solve(cd.t0,c,cd.c0,depth+1); const sc=selCost(cd.v,c); best={ir:muxIR(sel(cd.v,c),g.ir||g,h.ir||h),cost:val(g)+val(h)+muxCost(sc,g.ir?{}:g,h.ir?{}:h)}; }
    return put(best); };
  // ── 3ג. «BDD»: סדר-משתנים קבוע (חמדני: הכי מעט תת-פונקציות בכל רמה), שאנון על המשתנה הבא, כל תת-פונקציה נבנית פעם אחת (DAG).
  //    במקום 0: אם f(x=1) = ¬f(x=0) ⇒ f = f0 ⊕ x (חבר). בכל צומת — קודם חיפוש מדויק במחסן.
  const keyT=t=>Buffer.from(t.buffer,t.byteOffset,t.byteLength).toString('latin1');
  const orderFor=t=>{ let cur=new Map([[keyT(t),t]]); const left=varPl.slice(); const ord=[];
    while(left.length){ let bV=null,bN=null; for(const v of left){ const nx=new Map(); for(const f of cur.values()) for(const b of [0,1]){ const u=lift(f,v,b); nx.set(keyT(u),u); } if(!bN||nx.size<bN.size){ bV=v; bN=nx; } }
      ord.push(bV); left.splice(left.indexOf(bV),1); cur=bN; if(cur.size>3000){ ord.push(...left); break; } }
    return ord; };
  const memoB=new Map();
  const bdd=(t,c,ord)=>{ if(isZero(t,full,0)) return 'Z'; if(isZero(t,full,1)) return 'O'; const k=c+'|'+keyT(t); if(memoB.has(k)) return memoB.get(k);
    let best=null; const e=exact(t,c); if(e) best={ir:bankIR(e,c),cost:e.cost};
    if(!best||best.cost>12){ const v=ord.find(v=>!eqP(lift(t,v,0),lift(t,v,1))); const t1=lift(t,v,1), t0_=lift(t,v,0); const s=sel(v,c), sc=selCost(v,c); let r;
      if(c===0&&isZero(xorP(t1,t0_),full,1)){ const h=bdd(t0_,c,ord); r=h==='Z'?{ir:s,cost:sc}:h==='O'?{ir:IR.nand(s,s),cost:2*sc+1}:{ir:IR.add(h.ir,s),cost:h.cost+sc+1}; }
      else { const G=bdd(t1,c,ord), Hh=bdd(t0_,c,ord); r={ir:muxIR(s,G.ir||G,Hh.ir||Hh),cost:val(G)+val(Hh)+muxCost(sc,G.ir?{}:G,Hh.ir?{}:Hh)}; }
      if(!best||r.cost<best.cost) best=r; }
    memoB.set(k,best); return best; };
  const scr0=[...Array(16).keys()].filter(c=>!ins.includes(c)&&c!==2).sort((a,b)=>(b>=4)-(a>=4)||a-b);
  const clen=ir=>codegen(ir,{scratch:scr0,out:2}).prog.length;
  const bestOf=(t,c,care)=>{ const a=solve(t,c,care,0); if(a==='Z'||a==='O') return a; const b=bdd(t,c,orderFor(t)); if(!b||!b.ir) return a; return clen(b.ir)<clen(a.ir)?b:a; };   // פירוק או BDD — לפי אורך הקוד
  // ── 3ב. «בחירה»: התשובה תמיד אחד משני ערכים זולים X / Y (למשל שני קלטים) ⇒ מספיק ביט-בחירה אחד g (נבנה במקום 0,
  //    «לא אכפת» איפה ש-X=Y), ואז על כל המילה: B = 15·g = (נאנד(G,1)+1), תשובה = (X∧B) ∨ (Y∧¬B)
  let selSol=null;
  if(process.env.BSNOSEL!=='1'){ const cheap=[]; for(let i=0;i<n&&cst[i]<=9;i++) cheap.push(i);
    const eqTo=o=>{ const e=new Uint32Array(W); for(let w=0;w<W;w++){ let m=full[w]; for(let L=0;L<4;L++) m&=~(V[o+L*W+w]^TP[L*W+w]); e[w]=m; } return e; };
    const EQ=cheap.map(i=>eqTo(i*S)); let bp=null;
    for(let x=0;x<cheap.length;x++) for(let y=x+1;y<cheap.length;y++){ let ok=true; for(let w=0;w<W;w++) if(((EQ[x][w]|EQ[y][w])>>>0)!==full[w]){ ok=false; break; } if(!ok) continue;
      const c=cst[cheap[x]]+cst[cheap[y]]; if(!bp||c<bp.c) bp={x:cheap[x],y:cheap[y],ex:EQ[x],ey:EQ[y],c}; }
    if(bp){ const care=new Uint32Array(W), t=new Uint32Array(W); for(let w=0;w<W;w++){ care[w]=(bp.ex[w]^bp.ey[w])&full[w]; t[w]=bp.ex[w]&care[w]; }
      tEnd=Date.now()+Math.max(0,tEndAll-Date.now())*0.4; fast=false; const g=bestOf(t,0,care); selSol={...bp,g};
      say(`  בחירה: התשובה תמיד אחד משני ערכים (מחיר ${bp.c}) · ביט-הבחירה ~${g.cost??0} · ${((Date.now()-t0)/1000).toFixed(1)} שנ׳`); } }
  // ── 4. לכל ביט: מקום-החישוב הטוב ביותר ──
  const lanes=[]; const constOne=[]; for(let j=0;j<4;j++){ const t=tPl(j); if(isZero(t,full,0)){ lanes.push(null); continue; } if(isZero(t,full,1)){ lanes.push(null); constOne.push(j); continue; }
    { const left=[j,1,2,3].filter(x=>x>=j).length; tEnd=Date.now()+Math.max(0,tEndAll-Date.now())/left; fast=false; }   // לכל ביט — חלק שווה מהזמן שנשאר
    let best=null; const opts=[0,...[1,2,3].filter(c=>c>=j)];   // c=0 תמיד (ואז «כפול 2» j פעמים), ועוד c≥j
    const ordJ=orderFor(t); const mk=(r,c,how)=>{ if(r==='Z'||r==='O') return null; const e=c>=j?{ir:IR.shrN(r.ir,c-j),cost:r.cost+(c-j),c}:{ir:IR.dblN(r.ir,j),cost:r.cost+3+4*j,c}; e.len=clen(e.ir); e.how=how; return e; };
    const take=e=>{ if(e&&(!best||e.len<best.len||(e.len===best.len&&e.cost<best.cost))) best=e; };
    for(const c of new Set([0,j])) take(mk(bdd(t,c,ordJ),c,'BDD'));
    for(const c of opts){ if(c<j&&c!==0) continue; take(mk(solve(t,c,full,0),c,'פירוק')); }
    lanes.push(best); if(process.env.BSDBG){ const sc=[...Array(16).keys()].filter(c=>!ins.includes(c)&&c!==2); const tc=(n,m=new Map())=>{ if(m.has(n.id)) return m.get(n.id); const c=n.op==='cell'?3:n.op==='k15'?5:n.op==='shr'?tc(n.a,m)+1:tc(n.a,m)+tc(n.b,m)+1; m.set(n.id,c); return c; }; const cg=codegen(best.ir,{scratch:sc,out:2}); say('    קוד לביט לבד: '+cg.prog.length+' · עץ '+tc(best.ir)+' · משותפים '+cg.shared); if(process.env.BSDBG==='2') say(cg.prog.map(x=>x[0]==='WHERE'?'W'+x[1]:x[0]).join(' ')); } say(`  ביט ${j}: ${best.len} פקודות לבד (${best.how}, מחושב במקום ${best.c}) · ${((Date.now()-t0)/1000).toFixed(1)} שנ׳${fast?' (מצב מהיר)':''}`); }
  const laneOk=(P,j)=>eqP(P.subarray(j*W,(j+1)*W),TP.subarray(j*W,(j+1)*W));
  const cleanOut=(P,G)=>{ for(let L=0;L<4;L++){ if(G>>L&1) continue; for(let w=0;w<W;w++) if(P[L*W+w]) return false; } return true; };
  // קבוצות: ערך אחד שנותן כמה ביטים יחד (במקומם) — מהמחסן, על כל הצירופים
  const need=[0,1,2,3].filter(j=>lanes[j]); const groups=new Map();
  for(const j of need){ const P=ev(lanes[j].ir); if(!laneOk(P,j)) throw new Error('ביט '+j+' לא נכון — באג בבונה'); groups.set(1<<j,{ir:lanes[j].ir,cost:lanes[j].cost,clean:cleanOut(P,1<<j)}); }
  { const NM=need.reduce((a,j)=>a|1<<j,0); const subs=[]; for(let G=1;G<16;G++) if(!(G&~NM)) subs.push(G);
    for(let i=0;i<n;i++){ const o=i*S; for(const G of subs){ const cur=groups.get(G); if(cur&&cur.cost+(cur.clean?0:6)<=cst[i]) continue; let ok=true; for(let L=0;L<4&&ok;L++) if(G>>L&1){ for(let w=0;w<W;w++) if(V[o+L*W+w]!==TP[L*W+w]){ ok=false; break; } } if(!ok) continue;
        const cl=cleanOut(V.subarray(o,o+S),G); const c=cst[i]; if(!cur||c+(cl?0:6)<cur.cost+(cur.clean?0:6)) groups.set(G,{ir:fromBank(i),cost:c,clean:cl}); } } }
  const parts=[]; const rec=(rest,acc)=>{ if(!rest.length){ parts.push(acc); return; } const [f,...r]=rest; const m=r.length; for(let s=0;s<(1<<m);s++){ let G=1<<f; const left=[]; r.forEach((x,k)=>{ if(s>>k&1) G|=1<<x; else left.push(x); }); rec(left,[...acc,G]); } }; rec(need,[]);
  const MASKC=7; let bestP=null; for(const P of parts){ if(!P.every(G=>groups.has(G))) continue; const c=P.reduce((a,G)=>{ const g=groups.get(G); return a+g.cost+(g.clean?0:MASKC); },0)+P.length; if(!bestP||c<bestP.c) bestP={P,c}; }
  // מסיכות: קבועים מ-15 (חצי / נאנד / חבר) — הזול ביותר לפי אורך-עץ (15 מתא = 3)
  const K15=IR.k15(); const CK=new Map([[15,{c:3,e:K15}]]); for(let it=0;it<8;it++){ let ch=false; const cur=[...CK]; const rel=(v,c,e)=>{ const o=CK.get(v); if(!o||c<o.c){ CK.set(v,{c,e}); ch=true; } };
    for(const [v,x] of cur){ rel(v>>1,x.c+1,IR.shr(x.e)); for(const [u,y] of cur){ rel((~(v&u))&15,x.c+y.c+1,IR.nand(x.e,y.e)); rel((v+u)&15,x.c+y.c+1,IR.add(x.e,y.e)); } } if(!ch) break; }
  const constIR=m=>CK.get(m).e;
  const terms=[]; const neg=[];
  if(bestP) for(const G of bestP.P){ const g=groups.get(G); if(g.clean) terms.push(g.ir); else neg.push(IR.nand(g.ir,constIR(G))); }
  for(let i=0;i+1<neg.length;i+=2) terms.push(IR.nand(neg[i],neg[i+1])); if(neg.length%2) terms.push(IR.not(neg[neg.length-1]));
  if(constOne.length) terms.push(constIR(constOne.reduce((a,j)=>a|1<<j,0)));
  if(!terms.length) terms.push(IR.nand(K15,K15));
  let root=terms[0]; for(const x of terms.slice(1)) root=IR.add(root,x);
  { const P=ev(root); for(let j=0;j<4;j++) if(!laneOk(P,j)) throw new Error('ההרכבה לא נכונה בביט '+j+' — באג בבונה'); }
  const scratch=[...Array(16).keys()].filter(c=>!ins.includes(c)&&c!==2).sort((a,b)=>(b>=4)-(a>=4)||a-b);
  const cands=[]; { const g=codegen(root,{scratch,out:2}); cands.push({prog:g.prog,shared:g.shared,how:`פריסת-ביטים (מסיכות): ${bestP?bestP.P.map(G=>G.toString(2).padStart(4,'0')).join('+'):'קבוע'}`}); }
  if(selSol){ const X=fromBank(selSol.x), Y=fromBank(selSol.y), g=selSol.g; let R;
    if(g==='O') R=X; else if(g==='Z') R=Y; else { const ONE=constIR(1); const B=IR.add(IR.nand(g.ir,ONE),ONE); R=IR.nand(IR.nand(X,B),IR.nand(Y,IR.nand(B,B))); }
    const P=ev(R); for(let j=0;j<4;j++) if(!laneOk(P,j)) throw new Error('בחירה לא נכונה — באג בבונה');
    const cg=codegen(R,{scratch,out:2}); cands.push({prog:cg.prog,shared:cg.shared,how:'פריסת-ביטים (בחירה: ביט אחד + mux)'}); }
  // ── 4ב. הרכבה בחיבור (בלי מסיכות): R נכון בביטים 0..j-1; ביט j: E במקום 0 עם E = T_j ⊕ R_j, ואז R += E·2^j
  //    (E·2^j «נקי מלמטה» ⇒ הביטים שכבר נכונים לא זזים, ואין נשא שנכנס לביט j). התחלה: ערך מהמחסן שנכון בכמה ביטים ראשונים.
  tEnd=t0+ms*0.92; fast=false;
  if(process.env.BSNORES!=='1'){ const starts=[{R:null,from:0}]; for(const G of [1,3,7,15]){ const g=groups.get(G); if(g) starts.push({R:g.ir,from:Math.log2(G+1)}); }
    for(const st of starts){ if(Date.now()>t0+ms*0.88) break; let R=st.R, okAll=true; const tag=[st.from?`מחסן(${st.from})`:'']; let late=false;
      for(let j=st.from;j<4;j++){ if(Date.now()>t0+ms*0.95){ late=true; break; } const Rp=R?ev(R):null; const t=new Uint32Array(W); for(let w=0;w<W;w++) t[w]=TP[j*W+w]^(Rp?Rp[j*W+w]:0); if(isZero(t,full,0)) continue;
        const r=bestOf(t,0,full); if(r==='Z') continue; const E=r==='O'?constIR(1):r.ir; const D=IR.dblN(E,j); R=R?IR.add(R,D):D; tag.push(j); }
      if(late) break; if(!R) R=IR.nand(K15,K15); const P=ev(R); for(let j=0;j<4;j++) if(!laneOk(P,j)) okAll=false; if(!okAll) throw new Error('הרכבה בחיבור לא נכונה — באג בבונה');
      const g=codegen(R,{scratch,out:2,maxNodes:30000}); if(g.prog) cands.push({prog:g.prog,shared:g.shared,how:`פריסת-ביטים (חיבור): ${tag.filter(x=>x!=='').join('+')}`}); } }
  cands.sort((a,b)=>a.prog.length-b.prog.length); const best=cands[0];
  return {prog:best.prog,how:best.how,alts:cands.map(c=>c.prog.length),T,bank:n,calls,shared:best.shared,ms:Date.now()-t0,est:bestP?.c,fast}; }

// ─── הכל יחד (לשימוש המוח): בונה ⇒ (אם נשאר זמן) המקצר של הצורף, ב-Worker עם עצירה קשיחה ⇒ בדיקה סופית. ms = תקציב כולל ───
export function shortenBounded(prog,T,ins,ms){ return new Promise(async res=>{ const { Worker }=await import('worker_threads'); let best=prog, fin=false;
  const w=new Worker(new URL('./bitslice-shorten-worker.mjs',import.meta.url),{workerData:{prog,T,ins,slice:Math.max(0.15,Math.min(1,ms/180000))}});
  const end=()=>{ if(fin) return; fin=true; clearTimeout(tm); w.terminate().catch(()=>{}); res(best); };
  const tm=setTimeout(end,ms); w.on('message',m=>{ if(m.prog&&m.prog.length<best.length) best=m.prog; if(m.done) end(); }); w.on('error',end); w.on('exit',end); }); }
export async function bitsliceSolve(gen,{ins=[0,1],ms=280000,buildFrac=ins.length>=3?0.7:0.55,say=()=>{},short=process.env.BSSHORT!=='0'}={}){ const t0=Date.now();
  const r=bitsliceBuild(gen,{ins,ms:ms*buildFrac,say}); if(!r.prog) return r; const built=r.prog.length;
  const { finalCheck }=await import('./tzoref.mjs');
  const left=t0+ms-Date.now()-(8000+r.prog.length*4);   // שומרים זמן לבדיקה הסופית
  if(short&&left>15000&&r.prog.length>12&&r.prog.length<=4000){   // הבודק המהיר של הצורף (WASM) לא מקבל תוכנית מעל 4096 פקודות ⇒ אין קיצור לארוכות
    const p=await shortenBounded(r.prog,r.T,ins,Math.min(left,30000+r.prog.length*400)); /* תוכנית קצרה ⇒ קיצור קצר */ if(p.length<r.prog.length&&finalCheck(p,gen,20000).bad===0){ r.prog=p; r.how+=` · קוצר ${built}⇒${p.length}`; } }
  const fc=finalCheck(r.prog,gen,20000); return {...r,T:undefined,built,bad:fc.bad,prog:fc.bad===0?r.prog:null,ms:Date.now()-t0}; }
