// הצורף — הבונה המהיר. אותה בנייה בדיוק (אותן פעולות, אותה מכונה קפדנית, אותו «קרוב», אותו «מבוי סתום»), רק:
//  (1) בלי עותקים: כל המצבים של שכבה יושבים במערך-מספרים אחד. כל ניסיון זוכר רק «מאיפה באתי + איזה צינור» — התוכנית נבנית מחדש רק לזוכה.
//  (2) «כבר ראיתי» = טבלת-מספרים מוכנה מראש (שתי טביעות של 32 ביט), בלי מחרוזות.
// רק צינורות בלי קפיצות (5 הפעולות + לבנים ישרות). לבנים עם קפיצות — הבונה הרגיל.
import { add4 } from './lifted-add.mjs'; import { shr4 } from './lifted-shr.mjs';
const ADD=new Uint8Array(256), SHR=new Uint8Array(16); for(let a=0;a<16;a++){ SHR[a]=shr4(a); for(let b=0;b<16;b++) ADD[a*16+b]=add4(a,b); }
const OPC={WHERE:0,'WHERE@':1,GO:2,TAKE:3,PUT:4,CALC:5,ADD:6,SHR:7};
const SMAX=6, REC=16+SMAX+4;            // לכל דוגמה: 16 תאים · מחסנית (עד 6) · גובה-מחסנית · A · P · «עצרה» (קפצה לסוף)
// טבלת «כבר ראיתי»: פתוחה, 2 טביעות לכל מצב
class Seen{ constructor(bits){ this.n=1<<bits; this.mask=this.n-1; this.a=new Uint32Array(this.n); this.b=new Uint32Array(this.n); this.size=0; }
  add(h1,h2){ if(h1===0&&h2===0) h2=1; let i=h1&this.mask; for(;;){ const x=this.a[i], y=this.b[i]; if(x===0&&y===0){ this.a[i]=h1; this.b[i]=h2; this.size++; return true; } if(x===h1&&y===h2) return false; i=(i+1)&this.mask; } }
  full(){ return this.size>this.n*0.7; } }
export const tokOf=(p)=>p.name?'L:'+p.name.replace(/ \(.*$/,''):p.ops.map(([o,k])=>o===0?'W'+k:'o'+o).join('');
export function fastBuild(gen,{pieces=[],maxLen=64,widths=[500,5000,50000,400000],N=14,ms=120000,check,learnOrder,ngram=null}={}){
  const t0=Date.now(); const ex=Array.from({length:N},(_,i)=>gen()); if(!ex.every(e=>e.want!=null)) return null;
  const want=Uint8Array.from(ex.map(e=>e.want));
  // צינורות: רצפי פעולות (בלי קפיצות)
  const atoms=[...[0,1,2,3,4,5,6,7].map(k=>({name:null,ops:[[0,k]]})),...[1,2,3,4,5,6,7].map(o=>({name:null,ops:[[o,0]]})),{name:null,ops:[[8,0]]}];
  const straight=pieces.filter(p=>!p.prog.some(([o,,c])=>o==='JUMP'||c)).map(p=>({name:p.name,ops:p.prog.map(([o,k])=>[OPC[o],k|0])}));
  let pipes=[...atoms,...straight]; if(learnOrder) pipes=learnOrder(pipes);
  // «כמה סביר» צינור אחרי שני הקודמים — מתוך תוכניות שהצליחו בעבר (0 אם אין ניסיון)
  const toks=pipes.map(tokOf); const TID=new Map(); toks.forEach((t,i)=>{ if(!TID.has(t)) TID.set(t,TID.size+1); }); const tid=pipes.map((_,i)=>TID.get(toks[i]));
  const TNAME=['^',...TID.keys()];
  const pr=(a,b,c)=>{ if(!ngram) return 0; const n3=ngram[TNAME[a]+'|'+TNAME[b]+'|'+TNAME[c]]||0, n2=ngram[TNAME[a]+'|'+TNAME[b]]||0; return Math.log((n3+0.05)/(n2+1)); };
  const S=N*REC; let tries=0;
  // מריץ צינור על מצב (in → out). מחזיר false אם נכשל
  const tmp=new Uint8Array(S);
  function step(src,so,ops){ tmp.set(src.subarray(so,so+S));
    for(let e=0;e<N;e++){ const b=e*REC; if(tmp[b+19+SMAX]) continue; let sp=tmp[b+16+SMAX], A=tmp[b+17+SMAX], P=tmp[b+18+SMAX]; const st=b+16; let halt=0;
      for(let j=0;j<ops.length&&!halt;j++){ const o=ops[j][0];
        switch(o){ case 0: A=ops[j][1]; break; case 1: if(!sp) return false; A=tmp[st+(--sp)]&15; break; case 2: P=A; break;
          case 3: if(P>15||sp>=SMAX) return false; tmp[st+sp++]=tmp[b+P]; break;
          case 4: if(!sp||P>15) return false; tmp[b+P]=tmp[st+(--sp)]; break;
          case 5: { if(sp<2) return false; const y=tmp[st+(--sp)], x=tmp[st+(--sp)]; tmp[st+sp++]=~(x&y)&15; break; }
          case 6: { if(sp<2) return false; const y=tmp[st+(--sp)], x=tmp[st+(--sp)]; tmp[st+sp++]=ADD[x*16+y]; break; }
          case 7: { if(!sp) return false; tmp[st+sp-1]=SHR[tmp[st+sp-1]]; break; }
          case 8: { if(!sp) return false; if(tmp[st+(--sp)]!==0){ halt=1; A=255; } break; } } }   // קפיצה לסוף = הדוגמה עוצרת כאן
      tmp[b+16+SMAX]=sp; tmp[b+17+SMAX]=A; tmp[b+18+SMAX]=P; tmp[b+19+SMAX]=halt; for(let k=sp;k<SMAX;k++) tmp[st+k]=0; }
    return true; }
  const EH=new Int32Array(N), EH2=new Int32Array(N);
  function hash(){ let g1=0, g2=0; for(let e=0;e<N;e++){ let h1=2166136261|0, h2=5381|0; const b=e*REC; for(let i=b;i<b+REC;i++){ const v=tmp[i]; h1=Math.imul(h1^v,16777619); h2=(Math.imul(h2,33)+v)|0; }
      EH[e]=h1; EH2[e]=h2; g1=Math.imul(g1^h1,16777619)+e|0; g2=(Math.imul(g2,33)^h2)+e|0; } return [g1>>>0,g2>>>0]; }
  // ציון: דוגמה נכונה (מחסנית ריקה + התשובה בתא 2) = 10 · התשובה בראש המחסנית = 2 · התשובה בתא/במחסנית = 1
  function score(){ let s=0; for(let e=0;e<N;e++){ const b=e*REC, sp=tmp[b+16+SMAX], w=want[e];
      if(sp===0&&tmp[b+2]===w){ s+=10; continue; } if(sp&&tmp[b+16+sp-1]===w){ s+=2; continue; }
      let f=0; for(let c=0;c<8&&!f;c++) if(tmp[b+c]===w) f=1; for(let k=0;k<sp&&!f;k++) if(tmp[b+16+k]===w) f=1; s+=f; } return s; }
  // מבוי סתום: שתי דוגמאות באותו מצב בדיוק שצריכות תשובות שונות
  function dead(){ for(let e=0;e<N;e++) for(let f=e+1;f<N;f++) if(want[e]!==want[f]&&EH[e]===EH[f]&&EH2[e]===EH2[f]) return true; return false; }
  // התחלה: כל דוגמה עם «לאן/איפה» אחרים (הכלל: עובד מכל נקודה)
  const init=new Uint8Array(S); ex.forEach((e,i)=>{ const b=i*REC; for(let c=0;c<16;c++) init[b+c]=e.mem[c]; init[b+17+SMAX]=(i*7+1)&15; init[b+18+SMAX]=(i*5+3)&15; });
  const seenT=new Seen(23);
  for(const W of widths){ const seen=seenT; seen.a.fill(0); seen.b.fill(0); seen.size=0; let cur={buf:init.slice(),n:1,par:[null],pipe:[null],len:[0],t1:[0],t2:[0],pri:[0]}; // שכבה: מצבים + «מאיפה באתי»
    tmp.set(init); { const [h1,h2]=hash(); seen.add(h1,h2); }
    const hist=[]; // כל השכבות — כדי לשחזר את התוכנית של הזוכה
    for(let L=1;L<=maxLen&&cur.n;L++){ hist.push(cur); const cap=W*4; let nb=new Uint8Array(Math.min(cap,cur.n*pipes.length)*S), nn=0, npar=[], npipe=[], nlen=[], nsc=[], nt1=[], nt2=[], npri=[];
      for(let i=0;i<cur.n;i++) for(let pi=0;pi<pipes.length;pi++){ const pp=pipes[pi]; const newLen=cur.len[i]+pp.ops.length+pp.ops.filter(o=>o[0]===8).length; if(newLen>maxLen) continue; tries++;
        if(!step(cur.buf,i*S,pp.ops)) continue; const [h1,h2]=hash(); if(dead()) continue; if(!seen.add(h1,h2)) continue;
        const sc=score();
        if(sc===10*N){ const prog=rebuildProg(hist,i,pp); const used=usedOf(hist,i,pp); if(!check||check(prog)) return {prog,used,tries,ms:Date.now()-t0,width:W,path:pathOf(hist,i,pp)}; }
        if(nn>=cap){ // מלא — נשארים W הכי קרובים, וממשיכים
          const keep=[...Array(nn).keys()].sort((a,b)=>nsc[b]-nsc[a]||npri[b]-npri[a]).slice(0,W); const nb2=new Uint8Array(nb.length); keep.forEach((k,j)=>nb2.set(nb.subarray(k*S,k*S+S),j*S)); nb=nb2;
          npar=keep.map(k=>npar[k]); npipe=keep.map(k=>npipe[k]); nlen=keep.map(k=>nlen[k]); nsc=keep.map(k=>nsc[k]); nt1=keep.map(k=>nt1[k]); nt2=keep.map(k=>nt2[k]); npri=keep.map(k=>npri[k]); nn=keep.length; }
        nb.set(tmp,nn*S); npar.push(i); npipe.push(pp); nlen.push(newLen); nsc.push(sc); nt1.push(cur.t2[i]); nt2.push(tid[pi]); npri.push(cur.pri[i]+pr(cur.t1[i],cur.t2[i],tid[pi])); nn++;
        if(Date.now()-t0>ms) return {prog:null,tries,ms:Date.now()-t0}; if(seen.full()) break; }
      // נשארים W הכי קרובים
      const idx=[...Array(nn).keys()].sort((a,b)=>nsc[b]-nsc[a]||npri[b]-npri[a]).slice(0,W); const buf=new Uint8Array(idx.length*S);
      idx.forEach((k,j)=>buf.set(nb.subarray(k*S,k*S+S),j*S)); cur={buf,n:idx.length,par:idx.map(k=>npar[k]),pipe:idx.map(k=>npipe[k]),len:idx.map(k=>nlen[k]),t1:idx.map(k=>nt1[k]),t2:idx.map(k=>nt2[k]),pri:idx.map(k=>npri[k])}; } }
  return {prog:null,tries,ms:Date.now()-t0};
  function rebuildProg(hist,i,pp){ const seq=[pp]; let L=hist.length-1, k=i; while(L>0){ seq.push(hist[L].pipe[k]); k=hist[L].par[k]; L--; }
    const NAME=['WHERE','WHERE@','GO','TAKE','PUT','CALC','ADD','SHR']; const p=seq.reverse().flatMap(p=>p.ops.flatMap(([o,k])=>o===8?[['WHERE',-1,'code'],['JUMP']]:o===0?[['WHERE',k]]:[[NAME[o]]]));
    return p.map(x=>x[2]==='code'&&x[1]===-1?['WHERE',p.length,'code']:x); }
  function pathOf(hist,i,pp){ const q=[tokOf(pp)]; let L=hist.length-1,k=i; while(L>0){ q.push(tokOf(hist[L].pipe[k])); k=hist[L].par[k]; L--; } return q.reverse(); }
  function usedOf(hist,i,pp){ const u=[]; if(pp.name) u.push(pp.name); let L=hist.length-1,k=i; while(L>0){ const p=hist[L].pipe[k]; if(p&&p.name) u.push(p.name); k=hist[L].par[k]; L--; } return u.reverse(); }
}
// 4 ליבות במקביל: כל ליבה ברוחב אחר; הראשונה שמוצאת — מנצחת, והשאר נעצרות
import { Worker } from 'worker_threads';
export function parallelBuild(name,{pieces=[],widths=[500,5000,50000,400000],ms=60000,ngram=null,jobs=null,N=14}={}){ const t0=Date.now();
  const J=jobs||widths.map(width=>({pieces,width}));
  return new Promise((resolve)=>{ let left=J.length, tries=0, done=false; const ws=[];
    for(const {pieces,width} of J){ const w=new Worker(new URL('./tzoref-worker.mjs',import.meta.url),{workerData:{name,pieces,width,ms,ngram,N},resourceLimits:{maxOldGenerationSizeMb:1400}}); ws.push(w);
      w.online=false; w.on('online',()=>{ w.online=true; if(done) w.terminate(); });
      w.on('message',(r)=>{ tries+=r.tries||0; if(done) return; if(r.prog){ done=true; for(const x of ws) if(x.online) x.terminate(); resolve({...r,tries,ms:Date.now()-t0,width}); } else if(--left===0){ done=true; resolve({prog:null,tries,ms:Date.now()-t0}); } });
      w.on('error',()=>{ if(!done&&--left===0){ done=true; resolve({prog:null,tries,ms:Date.now()-t0}); } }); } }); }

// בריכת ליבות שנשארות דלוקות (נדלקות פעם אחת). build = כמה עבודות במקביל, הראשונה שמוצאת — מנצחת, והשאר עוצרות בדגל
let POOL=null;
export function pool(n=4){ if(POOL) return POOL; const ws=Array.from({length:n},()=>new Worker(new URL('./tzoref-worker.mjs',import.meta.url),{resourceLimits:{maxOldGenerationSizeMb:1400}}));
  let seq=0; const wait=new Map(); ws.forEach(w=>w.on('message',(r)=>{ const f=wait.get(r.id); if(f){ wait.delete(r.id); f(r); } }));
  POOL={ build(name,{jobs,ms=60000,ngram=null,N=14,tables=null,ins=null}){ const t0=Date.now(); const stopBuf=new SharedArrayBuffer(4); const stop=new Int32Array(stopBuf);
      return new Promise((resolve)=>{ let left=jobs.length, tries=0, done=false;
        jobs.forEach((j,i)=>{ const id=++seq; wait.set(id,(r)=>{ tries+=r.tries||0; if(done){ if(--left===0){} return; }
            if(r.prog){ done=true; Atomics.store(stop,0,1); resolve({...r,tries,ms:Date.now()-t0,width:j.width}); } else if(--left===0){ done=true; resolve({prog:null,tries,ms:Date.now()-t0}); } });
          ws[i%ws.length].postMessage({id,name,pieces:j.pieces||[],width:j.width,ms,ngram,N,stopBuf,tables,ins}); }); }); },
    close(){ ws.forEach(w=>w.terminate()); POOL=null; } };
  return POOL; }
