// הצורף — הבונה «8 במכה אחת». אותה בנייה כמו tzoref-fast.mjs, רק שכל מספר של 32 ביט מחזיק את אותו תא של 8 דוגמאות
// (4 ביטים לכל דוגמה). פעולה אחת על המספר = אותה פעולה על 8 הדוגמאות. 16 דוגמאות = 2 מספרים לכל תא.
//   לא-וגם: ~(x&y) — ביט-ביט, עובד על כל 8 בבת אחת.
//   חיבור (mod 16 בכל רביעייה): ((x&0x77777777)+(y&0x77777777)) ^ ((x^y)&0x88888888) — הנשא לא עובר לשכנה.
//   הזז-ימינה: (x>>>1)&0x77777777.
//   קח/שים: כשכל הדוגמאות באותה כתובת (המקרה הרגיל) — מספר שלם; כשהכתובות שונות — דוגמה-דוגמה.
// כל תוצאה עוברת את אותו בודק מלא (makeChecker) לפני שמוחזרת — כך שטעות כאן לא יכולה להיכנס.
import { tokOf } from './tzoref-fast.mjs'; import fs from 'fs';
// הרשימה השחורה (tzoref-rules.mjs): זוגות ושלישיות שאף פעם לא עושים משהו חדש
const RULES=(()=>{ try{ const r=JSON.parse(fs.readFileSync(new URL('./tzoref-rules.json',import.meta.url),'utf8')); return {P:new Set(r.pairs.map(x=>x.join('|'))),T:new Set(r.triples.map(x=>x.join('|')))}; }catch{ return null; } })();
const OPC={WHERE:0,'WHERE@':1,GO:2,TAKE:3,PUT:4,CALC:5,ADD:6,SHR:7};
const SMAX=6, G=2, N=16;
// מבנה מצב (Int32Array): תאים 16×G · מחסנית SMAX×G · גובה · A (G) · P (G) · «עצרה» (G)
const MEMO=0, STO=16*G, SPO=STO+SMAX*G, AO=SPO+1, PO=AO+G, HO=PO+G, WRO=HO+G, S=WRO+1;
const ONES=0x11111111|0, LOW3=0x77777777|0, HIGH=0x88888888|0;
const uni=(w)=>{ const n=w&15; return w===Math.imul(n,ONES)?n:-1; };            // כל 8 הרביעיות שוות? ⇒ הערך, אחרת -1
const eqN=(x,y)=>{ const z=x^y; return ~((z|(z>>>1)|(z>>>2)|(z>>>3))&ONES)&ONES; };   // ביט 1 בכל רביעייה שווה
const nzN=(x)=>((x|(x>>>1)|(x>>>2)|(x>>>3))&ONES);                              // ביט 1 בכל רביעייה שאינה 0
// טבלת «כבר ראיתי» — נוצרת פעם אחת לכל ליבה; בין משימות מנקים רק את התאים שנכתבו
const SZ=1<<23, MASK=SZ-1, HA=new Uint32Array(SZ), HB=new Uint32Array(SZ), USED=new Int32Array(SZ); let hsize=0;
const seenClear=()=>{ for(let k=0;k<hsize;k++){ const i=USED[k]; HA[i]=0; HB[i]=0; } hsize=0; };
const seenAdd=(a,b)=>{ if(a===0&&b===0) b=1; let i=a&MASK; for(;;){ const x=HA[i], y=HB[i]; if(x===0&&y===0){ HA[i]=a; HB[i]=b; USED[hsize++]=i; return true; } if(x===a&&y===b) return false; i=(i+1)&MASK; } };
const pc=(x)=>{ x=x-((x>>>1)&0x55555555); x=(x&0x33333333)+((x>>>2)&0x33333333); return Math.imul((x+(x>>>4))&0x0f0f0f0f,0x01010101)>>>24; };
export function swarBuild(gen,{pieces=[],maxLen=128,widths=[500,5000,50000,400000],ms=120000,check,ngram=null,stop=null,ins=null,tables=null}={}){
  const t0=Date.now(); const ex=Array.from({length:N},()=>gen()); if(!ex.every(e=>e.want!=null)) return null;
  const W_=new Int32Array(G); ex.forEach((e,i)=>{ W_[i>>3]|=(e.want&15)<<(4*(i&7)); });
  const atoms=[...[0,1,2,3,4,5,6,7].map(k=>({name:null,ops:[[0,k]]})),...[1,2,3,4,5,6,7].map(o=>({name:null,ops:[[o,0]]})),{name:null,ops:[[8,0]]}];
  const D={TAKE:1,PUT:-1,'WHERE@':-1,CALC:-1,ADD:-1,SHR:0,WHERE:0,GO:0};
  // חלק עם «קפוץ קדימה» (לסוף החלק או לאמצע): op 9 = [9, יעד-במקור, יעד-ברשימת-הפעולות]. הקטע שמדלגים עליו חייב להיות מאוזן (לא משנה את גובה המחסנית)
  const conv=(p)=>{ const pr=p.prog, n=pr.length, ops=[], orig=[];
    for(let i=0;i<n;i++){ const [o,k,c]=pr[i];
      if(c==='code'){ if(k<=i||k>n||pr[i+1]?.[0]!=='JUMP') return null;                   // רק קדימה
        let d=0; for(let j=i+2;j<k;j++){ const oo=pr[j][0]; if(oo==='JUMP'||pr[j][2]) return null; d+=D[oo]; if(d<0) return null; } if(d!==0) return null;
        ops.push([9,k,-1]); orig.push(i); i++; continue; }
      if(o==='JUMP') return null; ops.push([OPC[o],k|0]); orig.push(i); }
    for(const op of ops) if(op[0]===9){ let t=orig.findIndex(x=>x>=op[1]); op[2]=t<0?ops.length:t; }
    return {name:p.name,ops}; };
  const straight=pieces.map(conv).filter(Boolean);
  const pipes=[...atoms,...straight]; for(const p of pipes) p.len=p.ops.length+p.ops.filter(o=>o[0]===8||o[0]===9).length;
  const toks=pipes.map(tokOf); const TID=new Map(); toks.forEach(t=>{ if(!TID.has(t)) TID.set(t,TID.size+1); }); const tid=pipes.map((_,i)=>TID.get(toks[i])); const TNAME=['^',...TID.keys()];
  const pr=(a,b,c)=>{ if(!ngram) return 0; const n3=ngram[TNAME[a]+'|'+TNAME[b]+'|'+TNAME[c]]||0, n2=ngram[TNAME[a]+'|'+TNAME[b]]||0; return Math.log((n3+0.05)/(n2+1)); };
  // שטויות: «לאן» ואחריו «לאן» (הראשון נמחק) · «לך» ואחרי «לך» · «קח» ואחריו «שים» (מחזיר את אותו ערך לאותו מקום) · «לאן» ואחריו «לאן@»
  // שם-פעולה לכל צינור בודד (לרשימה השחורה); חלק מהמדף = «L» (אין עליו כללים, והוא גם «מאפס» את ההקשר)
  const RN={o1:'W@',o2:'GO',o3:'TAKE',o4:'PUT',o5:'CALC',o6:'ADD',o7:'SHR',o8:'J'};
  const nameOf=(p)=>p.name?null:(p.ops.length!==1?null:(p.ops[0][0]===0?'W'+p.ops[0][1]:RN['o'+p.ops[0][0]]));
  const tidName=new Map(); pipes.forEach((p,i)=>tidName.set(tid[i],nameOf(p)));
  const pipeName=pipes.map(nameOf); const skipCache=new Map();
  const skipFor=(t1,t2)=>{ const k=t1*100000+t2; let v=skipCache.get(k); if(v) return v; const a=tidName.get(t1)||null, b=tidName.get(t2)||null;
    v=pipeName.map(c=>{ if(!c||!b||!RULES) return false; if(RULES.P.has(b+'|'+c)) return true; return !!(a&&RULES.T.has(a+'|'+b+'|'+c)); }); skipCache.set(k,v); return v; };
  const NONE=pipes.map(()=>false); const T=new Int32Array(S); let tries=0;
  const gather=(g,Pw)=>{ let v=0; for(let j=0;j<8;j++){ const p=(Pw>>>(4*j))&15; v|=((T[MEMO+p*G+g]>>>(4*j))&15)<<(4*j); } return v; };
  const L=new Int32Array(G); const OT=new Int32Array(8), OM=new Int32Array(8*G); let NO=0;
  function step(src,so,ops){ for(let i=0;i<S;i++) T[i]=src[so+i]; L[0]=0; L[1]=0; NO=0;
    for(let j=0;j<ops.length;j++){ const o=ops[j][0], k=ops[j][1]; let sp=T[SPO];
      for(let q=0;q<NO;q++) if(OT[q]===j){ for(let g=0;g<G;g++) L[g]&=~OM[q*G+g]; OT[q]=-1; }   // הגיעו ליעד — מי שדילגה חוזרת
      switch(o){
        case 0: for(let g=0;g<G;g++) T[AO+g]=(T[AO+g]&L[g])|(Math.imul(k,ONES)&~L[g]); break;
        case 1: if(!sp) return false; sp--; for(let g=0;g<G;g++) T[AO+g]=(T[AO+g]&L[g])|(T[STO+sp*G+g]&~L[g]); T[SPO]=sp; break;
        case 2: for(let g=0;g<G;g++) T[PO+g]=(T[PO+g]&L[g])|(T[AO+g]&~L[g]); break;
        case 3: if(sp>=SMAX) return false; for(let g=0;g<G;g++){ const p=uni(T[PO+g]); T[STO+sp*G+g]=p>=0?T[MEMO+p*G+g]:gather(g,T[PO+g]); } T[SPO]=sp+1; break;
        case 4: if(!sp) return false; sp--; for(let g=0;g<G;g++){ const v=T[STO+sp*G+g], h=T[HO+g]|L[g], Pw=T[PO+g], p=uni(Pw);
            if(p>=0){ const a=MEMO+p*G+g; T[a]=(T[a]&h)|(v&~h); T[WRO]|=1<<p; }
            else for(let e=0;e<8;e++){ const m=15<<(4*e); if(h&m) continue; const pp=(Pw>>>(4*e))&15, a=MEMO+pp*G+g; T[a]=(T[a]&~m)|(v&m); T[WRO]|=1<<pp; } }
          T[SPO]=sp; break;
        case 5: if(sp<2) return false; for(let g=0;g<G;g++){ const y=T[STO+(sp-1)*G+g], x=T[STO+(sp-2)*G+g]; T[STO+(sp-2)*G+g]=~(x&y); } T[SPO]=sp-1; break;
        case 6: if(sp<2) return false; for(let g=0;g<G;g++){ const y=T[STO+(sp-1)*G+g], x=T[STO+(sp-2)*G+g]; T[STO+(sp-2)*G+g]=(((x&LOW3)+(y&LOW3))^((x^y)&HIGH)); } T[SPO]=sp-1; break;
        case 7: if(!sp) return false; for(let g=0;g<G;g++){ const a=STO+(sp-1)*G+g; T[a]=(T[a]>>>1)&LOW3; } break;
        case 8: { if(!sp) return false; sp--; T[SPO]=sp; for(let g=0;g<G;g++){ const h=T[HO+g]; const nz=Math.imul(nzN(T[STO+sp*G+g]),15)&~h;   // רביעיות לא-אפס (שעוד לא עצרו)
            if(nz&&sp) return false;                                  // עוצרת עם משהו במחסנית ⇒ הדוגמה לעולם לא תצליח
            T[HO+g]=h|nz; } break; }
        case 9: { if(!sp) return false; sp--; T[SPO]=sp; if(NO>=8) return false; OT[NO]=ops[j][2]; for(let g=0;g<G;g++){ const m=Math.imul(nzN(T[STO+sp*G+g]),15)&~T[HO+g]&~L[g]; OM[NO*G+g]=m; L[g]|=m; } NO++; break; } }   // דילוג קדימה
      // עצרה ⇒ «לאן/איפה» שלה לא משנים יותר; מאפסים אותם כדי שמצבים זהים ייראו זהים
      for(let g=0;g<G;g++){ const h=T[HO+g]; T[AO+g]&=~h; T[PO+g]&=~h; } }
    for(let k=T[SPO];k<SMAX;k++) for(let g=0;g<G;g++) T[STO+k*G+g]=0; return true; }
  const INS=ins?ins.reduce((m,c)=>m|(1<<c),0):0xffff; const WANT=ex.map(e=>e.want&15); const KEY=new Float64Array(N);
  function dead(){ if(process.env.NODEAD) return false; const rel=INS|T[WRO], sp=T[SPO];
    for(let e=0;e<N;e++){ const g=e>>3, sh=4*(e&7); let h1=2166136261|0, h2=5381|0;
      for(let c=0;c<16;c++) if(rel&(1<<c)){ const v=(T[MEMO+c*G+g]>>>sh)&15; h1=Math.imul(h1^v,16777619); h2=(Math.imul(h2,33)+v)|0; }
      for(let k=0;k<sp;k++){ const v=(T[STO+k*G+g]>>>sh)&15; h1=Math.imul(h1^(v+16),16777619); h2=(Math.imul(h2,33)+v+16)|0; }
      const a=(T[AO+g]>>>sh)&15, p=(T[PO+g]>>>sh)&15, hl=(T[HO+g]>>>sh)&15; h1=Math.imul(h1^(a+32),16777619); h1=Math.imul(h1^(p+48),16777619); h1=Math.imul(h1^(hl+64),16777619);
      KEY[e]=(h1>>>0)*4194304+((h2>>>0)&0x3fffff); }
    for(let e=0;e<N;e++) for(let f=e+1;f<N;f++) if(WANT[e]!==WANT[f]&&KEY[e]===KEY[f]) return true; return false; }
  let DEADS=0;
  let H1=0,H2=0; function hash(){ let h1=2166136261|0, h2=5381|0; for(let i=0;i<S;i++){ const v=T[i]; h1=Math.imul(h1^v,16777619); h2=(Math.imul(h2,33)+v)|0; } H1=h1>>>0; H2=h2>>>0; }
  // «חם-קר» חכם: האם חלק אחד מהמדף, על ערכים שכבר יש לי (קלט / מה שכתבתי / המחסנית), נותן את התשובה בכל הדוגמאות?
  const TB=(process.env.NOLOOK||!tables)?[]:tables.filter(t=>t.name!=='העתק').map(t=>({k:t.k,T:Uint8Array.from(t.T)}));
  const V=Array.from({length:16+SMAX},()=>new Uint8Array(N)); let LOOKS=0;
  function oneAway(){ const rel=(ins?ins.reduce((m,c)=>m|(1<<c),0):0xff)|T[WRO], sp=T[SPO]; let ns=0;
    for(let c=0;c<8;c++) if(rel&(1<<c)){ const v=V[ns++]; for(let e=0;e<N;e++) v[e]=(T[MEMO+c*G+(e>>3)]>>>(4*(e&7)))&15; }
    for(let k=0;k<sp;k++){ const v=V[ns++]; for(let e=0;e<N;e++) v[e]=(T[STO+k*G+(e>>3)]>>>(4*(e&7)))&15; }
    for(const tb of TB){ const F=tb.T;
      if(tb.k===1){ for(let i=0;i<ns;i++){ const a=V[i]; let e=0; for(;e<N;e++) if(F[a[e]]!==WANT[e]) break; if(e===N) return true; } }
      else for(let i=0;i<ns;i++){ const a=V[i]; for(let j=0;j<ns;j++){ if(i===j) continue; const b=V[j]; let e=0; for(;e<N;e++) if(F[a[e]*16+b[e]]!==WANT[e]) break; if(e===N) return true; } } }
    return false; }
  function score(){ let s=0; const sp=T[SPO];
    for(let g=0;g<G;g++){ const w=W_[g], h=T[HO+g]&ONES; const ok2=eqN(T[MEMO+2*G+g],w);
      const correct=sp===0?ok2:(ok2&h); s+=10*pc(correct);
      let rest=ONES&~correct;
      if(sp){ const top=eqN(T[STO+(sp-1)*G+g],w)&rest&~h; s+=2*pc(top); rest&=~top; }
      let any=0; for(let c=0;c<8;c++) any|=eqN(T[MEMO+c*G+g],w); for(let k=0;k<sp;k++) any|=eqN(T[STO+k*G+g],w); s+=pc(any&rest); }
    if(TB.length&&s<10*N&&oneAway()){ LOOKS++; s+=5*N; }   // חלק אחד מהתשובה ⇒ «חם מאוד»
    return s; }
  // «כבר ראיתי»
  const init=new Int32Array(S); ex.forEach((e,i)=>{ const g=i>>3, sh=4*(i&7); for(let c=0;c<16;c++) init[MEMO+c*G+g]|=(e.mem[c]&15)<<sh; init[AO+g]|=((i*7+1)&15)<<sh; init[PO+g]|=((i*5+3)&15)<<sh; });
  for(const W of widths){ seenClear(); let cur={buf:init.slice(),n:1,par:[null],pipe:[null],len:[0],t1:[0],t2:[0],pri:[0]};
    T.set(init); hash(); seenAdd(H1,H2); const hist=[];
    for(let L=1;L<=maxLen&&cur.n;L++){ hist.push(cur); const cap=W*4; const CAP=Math.min(cap,cur.n*pipes.length); let nb=new Int32Array(CAP*S), nn=0, npar=new Int32Array(CAP), npipe=new Array(CAP), nlen=new Int32Array(CAP), nsc=new Int32Array(CAP), nt1=new Int32Array(CAP), nt2=new Int32Array(CAP), npri=new Float64Array(CAP);
      for(let i=0;i<cur.n;i++){ const sk=process.env.NORULES?NONE:skipFor(cur.t1[i],cur.t2[i]); for(let pi=0;pi<pipes.length;pi++){ if(sk[pi]) continue; const pp=pipes[pi]; const newLen=cur.len[i]+pp.len; if(newLen>maxLen) continue; tries++;
        if(!step(cur.buf,i*S,pp.ops)) continue; hash(); if(!seenAdd(H1,H2)) continue; if(dead()){ DEADS++; continue; }
        const sc=score();
        if(sc===10*N){ const prog=rebuildProg(hist,i,pp); if(!check||check(prog)) return {prog,looks:LOOKS,deads:DEADS,used:usedOf(hist,i,pp),tries,ms:Date.now()-t0,width:W,path:pathOf(hist,i,pp)}; }
        if(nn>=cap){ const keep=[...Array(nn).keys()].sort((a,b)=>nsc[b]-nsc[a]||npri[b]-npri[a]).slice(0,W); const nb2=new Int32Array(nb.length); keep.forEach((k,j)=>nb2.set(nb.subarray(k*S,k*S+S),j*S)); nb=nb2;
          const re=(A,B)=>{ keep.forEach((k,j)=>{ B[j]=A[k]; }); return B; };
          npar=re(npar,new Int32Array(CAP)); npipe=re(npipe,new Array(CAP)); nlen=re(nlen,new Int32Array(CAP)); nsc=re(nsc,new Int32Array(CAP)); nt1=re(nt1,new Int32Array(CAP)); nt2=re(nt2,new Int32Array(CAP)); npri=re(npri,new Float64Array(CAP)); nn=keep.length; }
        nb.set(T,nn*S); npar[nn]=i; npipe[nn]=pp; nlen[nn]=newLen; nsc[nn]=sc; nt1[nn]=cur.t2[i]; nt2[nn]=tid[pi]; npri[nn]=ngram?cur.pri[i]+pr(cur.t1[i],cur.t2[i],tid[pi]):0; nn++;
        if((tries&4095)===0&&(Date.now()-t0>ms||(stop&&Atomics.load(stop,0)))) return {prog:null,deads:DEADS,tries,ms:Date.now()-t0}; if(hsize>SZ*0.7) break; } }
      const idx=[...Array(nn).keys()].sort((a,b)=>nsc[b]-nsc[a]||npri[b]-npri[a]).slice(0,W); const buf=new Int32Array(idx.length*S);
      idx.forEach((k,j)=>buf.set(nb.subarray(k*S,k*S+S),j*S)); cur={buf,n:idx.length,par:idx.map(k=>npar[k]),pipe:idx.map(k=>npipe[k]),len:idx.map(k=>nlen[k]),t1:idx.map(k=>nt1[k]),t2:idx.map(k=>nt2[k]),pri:idx.map(k=>npri[k])}; } }
  return {prog:null,deads:DEADS,tries,ms:Date.now()-t0};
  function rebuildProg(hist,i,pp){ const seq=[pp]; let L=hist.length-1, k=i; while(L>0){ seq.push(hist[L].pipe[k]); k=hist[L].par[k]; L--; }
    const NAME=['WHERE','WHERE@','GO','TAKE','PUT','CALC','ADD','SHR']; const p=[];
    for(const q of seq.reverse()){ const start=p.length, part=[];
      for(const [o,k] of q.ops){ if(o===8) part.push(['WHERE',-1,'code'],['JUMP']); else if(o===9) part.push(['WHERE',-1000-k,'code'],['JUMP']); else if(o===0) part.push(['WHERE',k]); else part.push([NAME[o]]); }
      for(const x of part) p.push(x[2]==='code'&&x[1]<=-1000?['WHERE',start+(-1000-x[1]),'code']:x); }   // יעד בתוך החלק ⇒ מקום אמיתי בתוכנית
    return p.map(x=>x[2]==='code'&&x[1]===-1?['WHERE',p.length,'code']:x); }
  function pathOf(hist,i,pp){ const q=[tokOf(pp)]; let L=hist.length-1,k=i; while(L>0){ q.push(tokOf(hist[L].pipe[k])); k=hist[L].par[k]; L--; } return q.reverse(); }
  function usedOf(hist,i,pp){ const u=[]; if(pp.name) u.push(pp.name); let L=hist.length-1,k=i; while(L>0){ const p=hist[L].pipe[k]; if(p&&p.name) u.push(p.name); k=hist[L].par[k]; L--; } return u.reverse(); }
}
