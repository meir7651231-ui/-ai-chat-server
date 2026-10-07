// ═══════════════════════════════════════════════════════════════════════════
//  הצורף — מנוע אחד: בונה ⇒ מרכיב ⇒ מקצר ⇒ בודק ⇒ שומר במדף ⇒ לומד מכל ניסיון
// ═══════════════════════════════════════════════════════════════════════════
//  מכונה אחת: הקפדנית (16 תאים, נגיעה בתא שלא קיים = כישלון), בגרסה המהירה (machine3f).
//  בודק אחד: הכללים כתובים כאן בלבד — תשובה נכונה · קלט לא משתנה · מחסנית ריקה · עובד מכל «לאן/איפה» · עם ערבוב בכל חזרה.
//  בדיקה סופית: מכונה נפרדת (machine3s, הקריאה האיטית) — כדי שטעות במכונה המהירה לא תעבור בשקט.
//  הלומד והרשת: יושבים מעל הכל, רושמים כל ניסיון, ומסדרים «מה לנסות קודם». הם רק מסדרים — לא זורקים אף אפשרות,
//  ולכן לא יכולים לגרום לתוצאה גרועה יותר; רק למהירה יותר (או לא).
import fs from 'fs'; import * as TR from './tzoref-tricks.mjs'; import { rankParts, loadUsed, noteUsed } from './tzoref-pick.mjs';
import { run as runSlow } from './machine3s.mjs';
import { encode, runCode, MEM } from './machine3f.mjs';
let WM=null; if(!process.env.NOWASM){ try{ WM=await import('./machine3w.mjs'); }catch{ WM=null; } }   // המכונה ב-C (WebAssembly) — אם אין, נשארים ב-JS
import { add4 } from './lifted-add.mjs'; import { shr4 } from './lifted-shr.mjs';
import { expand, dataOf } from './recipes.mjs';
import { shrink, ALPHA } from './tools3f.mjs';
import { bigAnneal } from './bigmoves3.mjs';
import { goals, goalFor, keepOf } from './tzoref-goals.mjs'; import { partTables } from './tzoref-tables.mjs';

const SHELF='shelf3.json', BRAIN='tzoref-brain.json', LOG='tzoref-log.jsonl';
const say=(...a)=>console.log(...a);
const clock=()=>Date.now();

// ─── 1. הבודק האחד ───────────────────────────────────────────────────────────
// דוגמאות קבועות לכל בודק; כל דוגמה נבדקת פעמיים (בלי ערבוב / עם ערבוב); «לאן/איפה» מכסים את כל 16×16 באופן שיטתי.
// בדיקה מהירה: אחרי הצלחה ראשונה לומדים אילו תאים הבודק באמת בודק, ובאיזה ערך יחיד — ומאז משווים רק אותם (בלי להעתיק זיכרון ובלי לקרוא לבודק)
function learnFx(ok,R){ const fx=[]; for(let i=0;i<16;i++){ let acc=0, val=-1; const keep=R[i]; for(let v=0;v<16;v++){ R[i]=v; if(ok(R)){ acc++; val=v; } } R[i]=keep; if(acc===16) continue; if(acc!==1||val!==keep) return null; fx.push(i,keep); }
  // ביטחון: אם שני תאים משנים יחד ועדיין «נכון» — הבודק תלוי בצירוף; לא סומכים על הקיצור
  const T=R.slice(); for(let t=0;t<8;t++){ for(let i=0;i<16;i++) T[i]=R[i]; for(let j=0;j<fx.length;j+=2){} for(let i=0;i<16;i++) if(!fx.some((c,j)=>j%2===0&&c===i)) T[i]=(R[i]+1+t)&15; if(!ok(T)) return null; }
  return Int32Array.from(fx); }
export function makeChecker(gen,N,maxSteps=20000){
  const cases=[]; for(let idx=0;idx<N;idx++){ const e=gen(); const sc=1+Math.floor(Math.random()*1e6);
    for(const s of [0,sc]) cases.push({e,sc:s,pa:(idx*5+(s?7:0))&15,aa:((idx>>4)*3+(s?11:0)+idx)&15}); }
  const f=(p)=>{ f.calls++; const code=encode(p);
    for(let i=0;i<cases.length;i++){ const c=cases[i]; const r=runCode(code,c.pa,c.aa,c.e.mem,maxSteps,c.sc);
      let bad; if(r===-2) bad=!slowOk(p,c,maxSteps); else if(r!==1) bad=true; else if(c.fx){ bad=false; const fx=c.fx; for(let j=0;j<fx.length;j+=2) if(MEM[fx[j]]!==fx[j+1]){ bad=true; break; } if(process.env.FASTVERIFY){ const sl=!c.e.ok(Array.from(MEM)); if(sl!==bad){ globalThis.__DIS=(globalThis.__DIS||0)+1; } globalThis.__CMP=(globalThis.__CMP||0)+1; } }
      else { const R=Array.from(MEM); bad=!c.e.ok(R); if(!bad&&c.fx!==null) c.fx=learnFx(c.e.ok,R); }
      if(bad){ if(i>0){ cases.splice(i,1); cases.unshift(c); } return false; } }   // הדוגמה שהפילה — ראשונה בפעם הבאה
    return true; };
  f.calls=0; const w=WM&&wasmChecker(cases,maxSteps); if(w&&process.env.CMPCHK){ const g=(p)=>{ const a=f(p), b=w(p); globalThis.__CMP=(globalThis.__CMP||0)+1; if(a!==b) globalThis.__DIS=(globalThis.__DIS||0)+1; return a; }; g.calls=0; return g; } return w||f; }
// אותו בודק — הלולאה רצה ב-C. מקרה שעוד אין לו «תאים-לבדוק» (או שהמחסנית התפוצצה) — חוזר ל-JS רק עבורו
function wasmChecker(cases,maxSteps){ const {W,H,alloc,MEMO}=WM; const n=cases.length, CS=52;
  const pC=alloc(n*CS), pOrd=alloc(n), pO=alloc(4096), pA=alloc(4096); if(pC<0||pOrd<0||pO<0||pA<0) return null;
  const C=pC>>2, ORD=pOrd>>2, O=pO>>2, A=pA>>2;
  cases.forEach((c,i)=>{ const b=C+i*CS; H[b]=c.pa; H[b+1]=c.aa; H[b+2]=c.sc; for(let j=0;j<16;j++) H[b+3+j]=c.e.mem[j]|0; H[b+19]=-1; H[ORD+i]=i; });
  const setFx=(i,fx)=>{ const b=C+i*CS; if(!fx||fx.length>32){ H[b+19]=-2; return; } H[b+19]=fx.length; for(let j=0;j<fx.length;j++) H[b+20+j]=fx[j]; };
  const noLearn=new Set(); const front=i=>{ if(i<=0) return; const v=H[ORD+i]; for(let k=i;k>0;k--) H[ORD+k]=H[ORD+k-1]; H[ORD]=v; };
  const f=(p)=>{ f.calls++; const code=encode(p); if(code.n>4096) return false; H.set(code.ops,O); H.set(code.args,A);
    let start=0; for(;;){ const r=W.batch(pO,pA,code.n,pC,pOrd,n,maxSteps,start); if(r<0) return true; const i=r>>2, kind=r&3, ci=H[ORD+i], c=cases[ci];
      if(kind===1){ front(i); return false; }
      if(kind===2){ if(!slowOk(p,c,maxSteps)){ front(i); return false; } start=i+1; continue; }
      // kind 3: אין עדיין תאים-לבדוק — הבודק הכללי, ולומדים אותם להבא (או מסמנים «תמיד JS»)
      const R=Array.from(H.subarray(MEMO,MEMO+16)); if(!c.e.ok(R)){ front(i); return false; } if(!noLearn.has(ci)){ const fx=learnFx(c.e.ok,R.slice()); if(fx&&fx.length<=32) setFx(ci,fx); else noLearn.add(ci); } start=i+1; } };
  f.calls=0; return f; }
const prefix=(p,pa,aa)=>[['WHERE',pa],['GO'],['WHERE',aa],...p.map(([o,k,c])=>o==='WHERE'?['WHERE',c?k+3:k]:[o])];
function slowOk(p,c,maxSteps){ const r=runSlow(prefix(p,c.pa,c.aa),c.e.mem,{maxSteps,scramble:c.sc}); return !!r&&!r.st.length&&c.e.ok(r.mem); }
// בדיקה «קשה»: כל 256 צירופי לאן×איפה × 12 דוגמאות × עם/בלי ערבוב
function makeHard(gen){ const H=[]; let s=31; const R=(n)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%n; };
  for(let pa=0;pa<16;pa++) for(let aa=0;aa<16;aa++) for(let t=0;t<12;t++) H.push({e:gen(),pa,aa,sc:t%2?1+R(1e5):0});
  return (p)=>{ const code=encode(p); for(const c of H){ const r=runCode(code,c.pa,c.aa,c.e.mem,20000,c.sc); if(r===-2?!slowOk(p,c,20000):(r!==1||!c.e.ok(Array.from(MEM)))) return false; } return true; }; }
// בדיקה סופית ועצמאית: המכונה האיטית, 20,000 דוגמאות, נקודות-התחלה וערבוב אקראיים
export function finalCheck(p,gen,n=20000){ let bad=0; for(let t=0;t<n;t++){ const e=gen(); const pa=Math.floor(Math.random()*16), aa=Math.floor(Math.random()*16), sc=t%2?1+Math.floor(Math.random()*1e5):0;
    const r=runSlow(prefix(p,pa,aa),e.mem,{maxSteps:50000,scramble:sc}); if(!r||r.st.length||!e.ok(r.mem)) bad++; } return {n,bad}; }

// ─── 2. הלומד והרשת ──────────────────────────────────────────────────────────
// כל שינוי מתואר ב«מאפיינים» (סוג השינוי, הפקודה שלפניו/עליו/אחריו, מה הוכנס). הטבלה סופרת, הרשת מכלילה.
const brain=fs.existsSync(BRAIN)?JSON.parse(fs.readFileSync(BRAIN,'utf8')):{W:{},good:{},tried:{},pieces:{},tasks:[]};
const sig1=(z)=>1/(1+Math.exp(-z));
const netScore=(feats)=>sig1(feats.reduce((a,f)=>a+(brain.W[f]||0),-3));
function learn(feats,y,rate=0.05){ const p=netScore(feats); for(const f of feats) brain.W[f]=(brain.W[f]||0)+rate*(y-p); }
function note(fkey,good){ brain.tried[fkey]=(brain.tried[fkey]||0)+1; if(good) brain.good[fkey]=(brain.good[fkey]||0)+1; }
const tabScore=(fkey)=>((brain.good[fkey]||0)+0.1)/((brain.tried[fkey]||0)+2);
const guess=(e)=>0.5*netScore(e.feats)+0.5*tabScore(e.f);
function saveBrain(){ fs.writeFileSync(BRAIN,JSON.stringify(brain)); }
function logTask(rec){ brain.tasks.push(rec); fs.appendFileSync(LOG,JSON.stringify(rec)+'\n'); saveBrain(); }

// ─── 3. שינויים (עם תיקון כתובות-קפיצה) ─────────────────────────────────────
const key=(x)=>x?(x[0]==='WHERE'?(x[2]?'W@':'W'+x[1]):x[0]):'^';
function rebuild(p,order,ins){ const newPos=new Map(); order.forEach((o,i)=>{ if(o!=null&&!newPos.has(o)) newPos.set(o,i); }); const n=order.length;
  const mapT=(t)=>{ if(t>=p.length) return n; for(let x=t;x<p.length;x++) if(newPos.has(x)) return newPos.get(x); return n; };
  return order.map((o,i)=>{ const x=o==null?ins[i]:p[o]; return x[2]==='code'?['WHERE',mapT(x[1]),'code']:x; }); }
function mk(p,kind,i,a,w,k){ const n=p.length, o=[...Array(n).keys()]; let q, ins={};
  if(kind==='D'){ q=o.slice(); q.splice(i,1); }
  else if(kind==='R'){ if(p[i][2]||p[i][0]==='JUMP'||key(a)===key(p[i])) return null; q=o.slice(); q[i]=null; ins[i]=a; }
  else if(kind==='I'){ q=o.slice(); q.splice(i,0,null); ins[i]=a; }
  else { const seg=o.slice(i,i+w); q=[...o.slice(0,i),...o.slice(i+w)]; if(k>q.length||k===i) return null; q.splice(k,0,...seg); }
  const t=kind+(w||''), P=key(p[i-1]), C=key(p[i]), N=key(p[i+1]), A=a?key(a):'-';
  return {p:rebuild(p,q,ins), f:`${t}|${P}|${C}|${N}|${A}`, feats:[`t:${t}`,`t:${t}|c:${C}`,`t:${t}|p:${P}`,`t:${t}|n:${N}`,`t:${t}|a:${A}`,`c:${C}|a:${A}`,`p:${P}|c:${C}`]}; }
// כל השינויים בחלון [a,b) — מחיקה, החלפה, הכנסה, הזזת קטע (2–5)
function* edits(p,a=0,b=p.length){ const n=p.length; b=Math.min(b,n);
  for(let i=a;i<b;i++) yield mk(p,'D',i);
  for(let i=a;i<b;i++) for(const x of ALPHA){ const e=mk(p,'R',i,x); if(e) yield e; }
  for(let i=a;i<=b;i++) for(const x of ALPHA) yield mk(p,'I',i,x);
  for(let w=2;w<=5;w++) for(let i=a;i+w<=b;i++) for(let k=Math.max(0,a-w);k<=Math.min(n-w,b);k++){ const e=mk(p,'M',i,null,w,k); if(e) yield e; } }

// ─── 4. הבונה: חיפוש מלא, שכבה אחרי שכבה, עם 5 הפעולות + לבנים מהמדף כ«צינורות» ────────
// שתי תוכניות שמגיעות לאותו מצב בכל הדוגמאות — מתאחדות. כשהשכבה גדולה מדי — נשארים הטובים (לפי כמה דוגמאות כבר נכונות),
// והלומד מסדר איזו לבנה לנסות קודם.
const ADD=new Int32Array(256), SHR=new Int32Array(16); for(let a=0;a<16;a++){ SHR[a]=shr4(a); for(let b=0;b<16;b++) ADD[a*16+b]=add4(a,b); }
export function exec(prog,s,maxSteps=4000,scramble=0){ // מריץ קטע (גם עם קפיצות) ממצב נתון. מחזיר מצב חדש או null
  const mem=s.mem.slice(), st=s.st.slice(); let A=s.A,P=s.P,pc=0,steps=0,sd=scramble;
  while(pc<prog.length){ if(++steps>maxSteps) return null; const [op,k,c]=prog[pc++];
    switch(op){ case 'WHERE': A=k; break; case 'WHERE@': if(!st.length) return null; A=st.pop()%16; break; case 'GO': P=A; break;
      case 'JUMP': if(!st.length) return null; if(st.pop()!==0){ const back=A<pc; pc=A; if(scramble&&back){ sd=(sd*1103515245+12345)%2147483648; A=Math.floor((sd/2147483648)*16); sd=(sd*1103515245+12345)%2147483648; P=Math.floor((sd/2147483648)*16); } } break;
      case 'TAKE': if(P>15) return null; if(st.length>=6) return null; st.push(mem[P]); break;
      case 'PUT': if(!st.length||P>15) return null; mem[P]=st.pop(); break;
      case 'ADD': { if(st.length<2) return null; const b=st.pop(),a=st.pop(); st.push(ADD[a*16+b]); break; }
      case 'SHR': if(!st.length) return null; st.push(SHR[st.pop()]); break;
      case 'CALC': { if(st.length<2) return null; const b=st.pop(),a=st.pop(); st.push(~(a&b)&15); break; } } }
  return {mem,st,A,P}; }
// חלק שנלמד — בכל שיבוץ תאים אפשרי (כמו במנוע העיגולים): הכניסות לכל צירוף תאים, התשובה לכל תא אחר, תאי-עבודה לתאים פנויים
function* orderings(pool,k,pre=[]){ if(pre.length===k){ yield pre; return; } for(const c of pool) if(!pre.includes(c)) yield* orderings(pool,k,[...pre,c]); }
const CFG=(()=>{ try{ return {W0:500,LAB:5,BIG:200,RULES:true,...JSON.parse(fs.readFileSync('tzoref-config.json','utf8'))}; }catch{ return {W0:500,LAB:5,BIG:200,RULES:true}; } })();   // ההגדרות שהצורף בחר לעצמו (tzoref-tune.mjs)
export function placements(b,cap=80,pref=null){ const all=[0,1,2,3,4,5,6,7]; const ins=(b.ins||[]).filter(c=>c<8), o=b.out??2; const data=dataOf(b.prog).filter(c=>c<8);
  const inPlace=ins.includes(o); const cand=[];
  for(const I of orderings(all,ins.length)) for(const O of (inPlace?[I[ins.indexOf(o)]]:all.filter(c=>!I.includes(c)))){ const map={}; ins.forEach((a,i)=>{ map[a]=I[i]; }); map[o]=O;
    const scratch=data.filter(a=>map[a]==null); const free=all.filter(c=>!Object.values(map).includes(c)).reverse(); if(free.length<scratch.length) continue; scratch.forEach((a,i)=>{ map[a]=free[i]; });
    // דירוג: כמה «טבעי» השיבוץ — כניסות מתאי-המטרה/תאי-עבודה, תשובה לתא-עבודה או לתא 2 (בלי העדפה = הסדר הרגיל)
    const rank=pref?I.reduce((a,c)=>a+(pref.includes(c)?pref.indexOf(c):20),0)+(pref.includes(O)?pref.indexOf(O):20):cand.length;
    cand.push({rank,p:{name:b.name,out:map[o],ins:I.slice(),prog:b.prog.map(([op,k,c])=>op==='WHERE'&&!c?['WHERE',map[k]??k]:(c?[op,k,c]:(k==null?[op]:[op,k])))}}); }
  cand.sort((x,y)=>x.rank-y.rank); return cand.slice(0,cap).map(x=>x.p); }
export function build(gen,{pieces=[],maxLen=24,widths=[500,5000,50000,400000],N=14,ms=120000,zeroStart=false}={}){
  // חיפוש שמתרחב: בכל שלב נשארים W הכי קרובים; אם לא נמצא — מתחילים שוב עם W גדול יותר. קל ⇒ נמצא מהר; קשה ⇒ מקבל יותר מקום.
  const t0=clock(); const ex=Array.from({length:N},(_,i)=>{ const e=gen(); return {e,pa:(i*5+3)&15,aa:(i*7+1)&15}; });
  const atoms=ALPHA.map(x=>({name:null,prog:[x]}));
  const pipes=[...atoms,...pieces.slice().sort((a,b)=>(brain.pieces[b.name]||0)-(brain.pieces[a.name]||0))];
  const S0=ex.map(x=>({mem:x.e.mem.slice(),st:[],A:zeroStart?0:x.aa,P:zeroStart?0:x.pa}));
  const K=(S)=>{ let h1=2166136261|0, h2=5381|0; const mix=(v)=>{ h1=Math.imul(h1^v,16777619); h2=(Math.imul(h2,33)+v)|0; };
    for(const s of S){ for(let i=0;i<16;i++) mix(s.mem[i]); mix(99); for(const v of s.st) mix(v); mix(98); mix(s.A); mix(s.P); } return (h1>>>0).toString(36)+':'+(h2>>>0).toString(36); };
  // «כמה קרוב»: דוגמה נכונה = 10; הערך הנכון בראש המחסנית = 2; הערך הנכון בתא כלשהו / במחסנית = 1
  const near=(s,e)=>{ if(e.want!=null) return s.st.length&&s.st[s.st.length-1]===e.want?2:(s.mem.slice(0,8).includes(e.want)||s.st.includes(e.want)?1:0);
    for(const v of new Set([...s.mem.slice(0,8),...s.st])){ const m=s.mem.slice(); m[2]=v; if(e.ok(m)) return 1; } return 0; };
  const score=(S)=>S.reduce((a,s,i)=>a+(s.st.length===0&&ex[i].e.ok(s.mem)?10:near(s,ex[i].e)),0);
  const hasWant=ex.every(x=>x.e.want!=null);
  const dead=(S)=>{ const m=new Map(); for(let i=0;i<S.length;i++){ const s=S[i]; const k=s.mem.join(',')+'|'+s.st.join(',')+'|'+s.A+','+s.P; const w=m.get(k); if(w!=null&&w!==ex[i].e.want) return true; m.set(k,ex[i].e.want); } return false; };
  const full=makeChecker(gen,300); let tries=0;
  for(const W of widths){ let layer=[{S:S0,prog:[],used:[]}]; const seen=new Set([K(S0)]);
    for(let L=1;L<=maxLen&&layer.length;L++){ const next=[];
      for(const n of layer) for(const pp of pipes){ if(n.prog.length+pp.prog.length>maxLen) continue; tries++;
        const S=[]; let bad=false; for(const s of n.S){ const r=exec(pp.prog.map(([o,k,c])=>c==='code'?[o,k,c]:[o,k]),s); if(!r){ bad=true; break; } S.push(r); } if(bad) continue;
        if(hasWant&&dead(S)) continue; const k=K(S); if(seen.has(k)) continue; seen.add(k);
        const prog=[...n.prog,...pp.prog.map(x=>x[2]==='code'?['WHERE',x[1]+n.prog.length,'code']:x)]; const used=pp.name?[...n.used,pp.name]:n.used;
        const sc=score(S); if(sc===10*N&&full(prog)){ for(const u of used) brain.pieces[u]=(brain.pieces[u]||0)+1; return {prog,used,tries,ms:clock()-t0,width:W}; }
        next.push({S,prog,used,sc}); if(next.length>W*4){ next.sort((a,b)=>b.sc-a.sc); next.length=W; }
        if(clock()-t0>ms) return {prog:null,tries,ms:clock()-t0}; }
      next.sort((a,b)=>b.sc-a.sc); layer=next.length>W?next.slice(0,W):next; if(process.env.DBG&&L<8) console.error(`W${W} L${L}: ${next.length} · הכי טוב ${next[0]?.sc} · ${next[0]?.prog.map(x=>x[0]+(x[1]??"")).join(" ")}`); } }
  return {prog:null,tries,ms:clock()-t0}; }

// ─── 4ב. הבונה עם קפיצות («אם» ולולאה) — כמו מנוע העיגולים: כל מועמד מורץ מההתחלה על כל הדוגמאות ─────────
// צינורות: 5 הפעולות + «לך-לשורה c» (לכל שורה עד האורך+12, או «סוף») + לבנים מהמדף. עיגול פנימי = הטובים.
// שלוש דרכים לבחור «טובים»: הכי הרבה דוגמאות נכונות · הכי «קרוב» · הכי הרבה שימוש במה שנלמד. + הרשת מסדרת.
const END=1000;
export function buildJ(gen,{pieces=[],beam=300,rounds=40,patience=10,N=16,ms=120000,maxLen=40}={}){
  const t0=clock(); const ex=Array.from({length:N},(_,i)=>({e:gen(),sc:i+1})); if(!ex.every(x=>x.e.want!=null)) return {prog:null,tries:0,ms:0};
  const full=makeChecker(gen,300); let tries=0;
  const jumps=(len)=>[...Array.from({length:len+13},(_,c)=>({name:null,prog:[['WHERE',c,'code'],['JUMP']]})),{name:null,prog:[['WHERE',END,'code'],['JUMP']]}];
  const atoms=ALPHA.map(x=>({name:null,prog:[x]}));
  const place=(pc,off)=>pc.prog.map(([o,k,c])=>c==='code'?['WHERE',k===END?END:k+off,'code']:(k==null?[o]:[o,k]));
  const finish=(p)=>p.map(([o,k,c])=>c==='code'&&k===END?['WHERE',p.length,'code']:(c?[o,k,c]:(k==null?[o]:[o,k])));
  const score=(prog)=>{ const fin=finish(prog); const st=[]; let s=0,near=0;
    for(const x of ex){ const r=exec(fin,{mem:x.e.mem,st:[],A:0,P:0},600,x.sc); if(!r) return null; st.push(r);
      if(r.st.length===0&&x.e.ok(r.mem)) s++; if(r.mem.slice(0,8).includes(x.e.want)||r.st.includes(x.e.want)) near++; }
    if(s<N){ const m=new Map(); for(let i=0;i<N;i++){ const k=st[i].mem.join(',')+'|'+st[i].st.join(','); const w=m.get(k); if(w!=null&&w!==ex[i].e.want) return null; m.set(k,ex[i].e.want); } }  // מבוי סתום
    return {s,near,sig:st.map(r=>r.mem.slice(0,8).join(',')+'|'+r.st.join(',')+'|'+r.A+','+r.P).join('/')}; };
  const pf=(pc)=>['pipe:'+(pc.name||key(pc.prog[0])+(pc.prog.length>1?'+J':''))];
  let inner=[{prog:[],s:0,near:0,used:[]}]; const seen=new Set(); let best=0,still=0;
  for(let r=0;r<rounds&&clock()-t0<ms;r++){ const outer=[];
    for(const c of inner){ const pipes=[...atoms,...jumps(c.prog.length),...pieces].sort((a,b)=>netScore(pf(b))-netScore(pf(a)));
      for(const pc of pipes){ const prog=[...c.prog,...place(pc,c.prog.length)]; if(prog.length>maxLen) continue; tries++;
        const sc=score(prog); if(!sc||seen.has(sc.sig)) continue; seen.add(sc.sig); const used=pc.name?[...c.used,pc.name]:c.used;
        const node={prog,s:sc.s,near:sc.near,used,step:pc};
        if(sc.s===N){ const fin=finish(prog); if(full(fin)){ for(const u of used) brain.pieces[u]=(brain.pieces[u]||0)+1; learn(pf(pc),1); return {prog:fin,used,tries,ms:clock()-t0}; } }
        outer.push(node); } }
    if(!outer.length) break; if(seen.size>1.5e6) seen.clear();
    const A=[...outer].sort((x,y)=>y.s-x.s||y.near-x.near||x.prog.length-y.prog.length), B=[...outer].sort((x,y)=>y.near-x.near||y.s-x.s||x.prog.length-y.prog.length);
    const C=[...outer].sort((x,y)=>y.s-x.s||y.near-x.near||y.used.length-x.used.length||x.prog.length-y.prog.length);
    const pick=new Set(); for(let i=0;pick.size<beam&&(A[i]||B[i]||C[i]);i++) for(const q of [A[i],B[i],C[i]]) if(q&&pick.size<beam) pick.add(q); inner=[...pick];
    for(const q of inner.slice(0,20)) learn(pf(q.step),0.6,0.01);   // «נראה מבטיח» — חיזוק קל
    const nb=Math.max(...inner.map(c=>c.s)); if(nb>best){ best=nb; still=0; } else if(++still>=patience) break; }
  return {prog:null,tries,ms:clock()-t0,best}; }

// ─── 4ג. השלד: «עבור על כל איבר ברשימה» עם חור לגוף. הגוף = לבנה מהמדף שמעדכנת את הצובר (תא 2) לפי האיבר (תא 3) ──────
const SKELETON='WHERE 1; GO; TAKE; WHERE 3; GO; PUT; LOOP: WHERE 3; GO; TAKE; WHERE @BODY; JUMP; WHERE 3; GO; TAKE; TAKE; CALC; WHERE @END; JUMP; BODY: WHERE 3; GO; TAKE; HOLE; WHERE 3; GO; TAKE; WHERE@; GO; TAKE; WHERE 3; GO; PUT; WHERE @LOOP; JUMP; END:';
const F15='TAKE; TAKE; CALC; TAKE; CALC';
const INITS={'0':`WHERE 2; GO; ${F15}; PUT; TAKE; TAKE; CALC; PUT`,'15':`WHERE 2; GO; ${F15}; PUT`};
export function buildList(gen,sh){ const shelf=new Map(sh.named.map(b=>[b.name,b])); const t0=clock(); let tries=0; const fresh=makeChecker(gen,300);
  const bodies=[];
  for(const b of sh.named){ if(b.prog.length>60||/רשימה|ספור|בלי|אמצע|וקטן/.test(b.name)) continue; const ins=b.ins||[], o=b.out??2;
    if(ins.length===2&&!ins.includes(o)){ bodies.push({name:b.name,rec:[{call:b.name,map:{[ins[0]]:2,[ins[1]]:3,[o]:7},free:[6,5,4,0]},'WHERE 7; GO; TAKE; WHERE 2; GO; PUT']});
      bodies.push({name:b.name+' (הפוך)',rec:[{call:b.name,map:{[ins[0]]:3,[ins[1]]:2,[o]:7},free:[6,5,4,0]},'WHERE 7; GO; TAKE; WHERE 2; GO; PUT']}); }
    if(ins.length===1&&ins[0]===o) bodies.push({name:b.name,rec:[{call:b.name,map:{[o]:2},free:[7,6,5,4,0]}]}); }
  for(const [iv,init] of Object.entries(INITS)) for(const bd of bodies){ tries++;
    let body; try{ body=expand(bd.rec,shelf); }catch{ continue; }
    const bodyTxt=body.map(([o,k,c],i)=>o==='WHERE'?(c?`WHERE @b${i<0?0:k}`:`WHERE ${k}`):o); const labels=new Set(body.filter(x=>x[2]).map(x=>x[1]));
    const bt=body.map(([o,k,c],i)=>(labels.has(i)?`b${i}: `:'')+(o==='WHERE'?(c?`WHERE @b${k}`:`WHERE ${k}`):o)).join('; ')+(labels.has(body.length)?`; b${body.length}:`:'');
    const prog=expand([init,SKELETON.replace('HOLE',bt)],shelf);
    if(fresh(prog)){ brain.pieces[bd.name]=(brain.pieces[bd.name]||0)+1; return {prog,used:[bd.name,'שלד','התחלה '+iv],tries,ms:clock()-t0}; } }
  return {prog:null,tries,ms:clock()-t0}; }

// ─── 5ב. superopt: קטע של 2–6 פקודות ⇐ כל הרצפים הקצרים יותר (עד 3 פקודות) ────────────────────────────
function* seqs(n){ if(n===0){ yield []; return; } for(const a of ALPHA) for(const r of seqs(n-1)) yield [a,...r]; }
export function superopt(p,ok,{maxR=3,END_T=Infinity}={}){ let better=true;
  const rep=(q,i,w,r)=>{ for(let j=i;j<i+w;j++){ const [o,,c]=q[j]; if(o==='JUMP'||c) return null; } for(const [o,k,c] of q) if(c&&k>i&&k<i+w) return null; const d=r.length-w;
    return [...q.slice(0,i),...r,...q.slice(i+w)].map(x=>x[2]==='code'&&x[1]>=i+w?['WHERE',x[1]+d,'code']:x); };
  while(better&&clock()<END_T){ better=false;
    for(let w=6;w>=2&&!better;w--) for(let i=0;i+w<=p.length&&!better&&clock()<END_T;i++) for(let r=0;r<Math.min(w,maxR+1)&&!better;r++) for(const sq of seqs(r)){ const q=rep(p,i,w,sq); if(q&&ok(q)){ p=q; better=true; break; } } }
  return p; }

// ─── 5. המקצר: כל הכלים בסבבים, עד שני סבבים בלי שיפור; ואחר כך תפר-אחרי-תפר ────────────
export function shorten(p0,gen,{minutes=10,window=24,quiet=2,tag=''}={}){
  const fast=makeChecker(gen,40), full=makeChecker(gen,300), fresh=makeChecker(gen,3000), hard=makeHard(gen);
  const ok=(p)=>fast(p)&&full(p); const T0=clock(), END=T0+minutes*60000; let best=p0.slice(), tries=0, firstWinAt=null;
  if(!(fresh(best)&&hard(best))) throw new Error('נקודת ההתחלה לא עוברת את הבודק');
  if(process.env.NOTRICKS!=='1'){ const t=TR.applyTricks(best,(q)=>ok(q)&&fresh(q)); if(t.used&&t.prog.length<best.length&&hard(t.prog)){ say(`  ✓ מחברת-הטריקים (${t.used}): ${best.length} → ${t.prog.length}`); best=t.prog; } }
  // «נייד»: קוד שעובד רק כשיש בדיוק 3 פקודות לפניו (כמו בבודק) — אסור; חייב לעבוד גם במקום אחר בתוכנית גדולה
  const posOk=(p)=>{ if(process.env.NOPOS) return true; for(let t=0;t<60;t++){ const e=gen(); const n=10+2*(t%5); const P=[]; for(let i=0;i<n;i++) P.push(i%2?['GO']:['WHERE',0]); const q=[...P,...p.map(x=>x[2]==='code'?['WHERE',x[1]+n,'code']:x)]; const r=runSlow(q,e.mem,{maxSteps:300000}); if(!r||r.st.length||!e.ok(r.mem)) return false; } return true; };
  const accept=(p,why)=>{ if(p.length<best.length&&fresh(p)&&hard(p)&&posOk(p)){ try{ TR.record(best,p,tag||why); }catch{} say(`  ✓ ${why}: ${best.length} → ${p.length}  (${((clock()-T0)/60000).toFixed(1)} דק')`); best=p; if(firstWinAt==null) firstWinAt=tries; return true; } return false; };
  // זוג שינויים, בסדר שהלומד מציע; כל ניסיון נרשם ללמידה
  function pairs(a,b){ const firsts=[]; const sigs=new Set();
    for(const e of edits(best,a,b)){ tries++; const good=e.p.length<best.length&&ok(e.p); note(e.f,good); if(good){ learn(e.feats,1); if(accept(e.p,'שינוי אחד')) return true; }
      else if(Math.random()<0.05) learn(e.feats,0); firsts.push(e); }
    firsts.sort((x,y)=>guess(y)-guess(x));
    for(const e1 of firsts){ if(clock()>END) return false; for(const e2 of edits(e1.p,Math.max(0,a-2),b+2)){ if(e2.p.length>=best.length) continue; tries++;
        if(ok(e2.p)){ note(e1.f,true); note(e2.f,true); learn(e1.feats,1); learn(e2.feats,1); if(accept(e2.p,'זוג שינויים')) return true; } } }
    return false; }
  let still=0, cycle=0;
  while(clock()<END&&still<quiet){ cycle++; const was=best.length;
    for(const st of [best,p0]){ if(clock()>END) break; const q=shrink(bigAnneal(st,ok,Math.min(60000,END-clock()),cycle*101),ok); accept(q,'גזור-והדבק'); }
    if(clock()<END) pairs(0,best.length);
    say(`  סבב ${cycle}: ${best.length}`); still=best.length<was?0:still+1; }
  if(clock()<END){ const q=superopt(best,ok,{END_T:END}); accept(q,'superopt'); }
  // תפר-אחרי-תפר: חלון זז, כל זוג שינויים בחלון
  let changed=true; while(changed&&clock()<END){ changed=false; for(let a=0;a<best.length&&clock()<END;a+=window>>1){ while(clock()<END&&pairs(a,a+window)) changed=true; } }
  saveBrain(); return {prog:best,tries,firstWinAt,ms:clock()-T0}; }

// ─── 6. «ניידת» או «מוברגת»: מזיזים את כל התאים 0–7 שהלבנה משתמשת בהם, ובודקים ────────────
export function movable(prog,gen){ const used=dataOf(prog).filter(c=>c<8); if(!used.length) return true;
  const sigma={}; for(const c of used) sigma[c]=(c+3)&7;                      // כל תא זז 3 מקומות (בתוך 0–7)
  const targets=new Set(Object.values(sigma));
  const q=prog.map(([o,k,c])=>o==='WHERE'&&!c&&sigma[k]!=null?['WHERE',sigma[k]]:(c?[o,k,c]:(k==null?[o]:[o,k])));
  const g2=()=>{ const e=gen(); const m=e.mem, m2=m.slice();
    for(const c of used) if(!targets.has(c)) m2[c]=Math.floor(Math.random()*16);  // תא שהתפנה = זבל
    for(const c of used) m2[sigma[c]]=m[c];                                         // הערכים עוברים למקום החדש
    return {mem:m2,ok:(r)=>{ const back=r.slice(); for(const t of targets) back[t]=m[t]; for(const c of used) back[c]=r[sigma[c]]; return e.ok(back); }}; };
  return makeChecker(g2,300)(q); }

// ─── 7. המדף ────────────────────────────────────────────────────────────────
export const loadShelf=()=>JSON.parse(fs.readFileSync(SHELF,'utf8'));
function saveShelf(sh){ const bak=SHELF.replace('.json','.before-tzoref.json'); if(!fs.existsSync(bak)) fs.copyFileSync(SHELF,bak); fs.writeFileSync(SHELF,JSON.stringify(sh)); }
function put(sh,name,prog,info){ const b=sh.named.find(x=>x.name===name); if(b){ if(prog.length>=b.prog.length) return false; Object.assign(b,{prog},info); } else sh.named.push({name,prog,...info}); saveShelf(sh); return true; }

// לבנים מהמדף ל«צינורות»: קטנות (עד 20) — בכל השיבוצים; השאר — במקומן
function piecesFrom(sh,name){ const out=[]; for(const b of sh.named){ if(b.name===name) continue; if(b.prog.length<=20&&!/רשימה|ספור|בלי|אמצע|וקטן/.test(b.name)) out.push(...placements(b)); else if(b.prog.length<=60) out.push({name:b.name,prog:b.prog}); } return out; }
// ─── 8. הצינור המלא: מטרה ⇒ בנייה (או מתכון) ⇒ קיצור ⇒ בדיקה סופית ⇒ מדף ⇒ מפל ─────────────
const G=goals();
export function forge(name,{recipe=null,start=null,minutes=10,buildMs=60000,cascade=true}={}){
  const sh=loadShelf(); const shelf=new Map(sh.named.map(b=>[b.name,b])); const old=shelf.get(name); const gen=goalFor(name,old,G);
  if(!gen) throw new Error(`אין מטרה בשם «${name}»`); const T0=clock(); let p=start, how=null, buildInfo=null;
  if(!p){ say(`[1] בונה לבד: «${name}»`); const pieces=piecesFrom(sh,name);
    if(/רשימה|ספור|בלי|אמצע/.test(name)){ buildInfo=buildList(gen,sh); if(buildInfo.prog) say('    (שלד + גוף מהמדף)'); }
    if(!buildInfo?.prog) buildInfo=build(gen,{pieces,ms:buildMs});
    if(!buildInfo.prog){ const j=buildJ(gen,{pieces,ms:buildMs}); buildInfo={...j,tries:(buildInfo.tries||0)+j.tries}; if(j.prog) say('    (עם קפיצות)'); }
    if(buildInfo.prog){ p=buildInfo.prog; how='נבנה לבד'; say(`    נמצא: ${p.length} פקודות · ${buildInfo.tries} ניסיונות${buildInfo.used.length?' · לבנים: '+(buildInfo.used||[]).join(', '):''}`); }
    else say(`    לא נמצא (${buildInfo.tries} ניסיונות)`); }
  if(!p&&recipe){ say('[2] מרכיב ממתכון'); p=expand(recipe,shelf); how='ממתכון'; say(`    ${p.length} פקודות`); }
  if(!p&&old){ p=old.prog; how='מהמדף'; }
  if(!p) return {ok:false,why:'אין דרך לבנות ואין מתכון'};
  say(`[3] מקצר (עד ${minutes} דק')`); const r=shorten(p,gen,{minutes});
  say('[4] בדיקה סופית (מכונה נפרדת, 20,000 דוגמאות)'); const fc=finalCheck(r.prog,gen); say(`    ${fc.n-fc.bad}/${fc.n}`);
  if(fc.bad) return {ok:false,why:'נכשל בבדיקה הסופית'};
  const mov=movable(r.prog,gen); say(`[5] ${mov?'ניידת':'מוברגת'}`);
  const rec={t:new Date().toISOString(),name,how,from:p.length,to:r.prog.length,tries:r.tries,firstWinAt:r.firstWinAt,buildTries:buildInfo?.tries??null,ms:clock()-T0};
  logTask(rec);
  const saved=put(sh,name,r.prog,{movable:mov,by:`הצורף · ${how}`,...(G[name]?.ins?{ins:G[name].ins,out:G[name].out}:{}),...(recipe?{recipe}:{})});
  say(saved?`[6] נשמר במדף: ${old?old.prog.length+' → ':''}${r.prog.length}`:`[6] לא נשמר (המדף כבר ${old.prog.length})`);
  if(saved&&cascade) cascadeFrom(name,{minutes:Math.max(2,minutes>>1)});
  return {ok:true,prog:r.prog,...rec}; }
// מפל: כל לבנה שהמתכון שלה משתמש בלבנה שהשתנתה — נבנית מחדש ממתכון ומקוצרת
export function cascadeFrom(name,{minutes=3}={}){ const sh=loadShelf();
  for(const b of sh.named){ if(!b.recipe||!b.recipe.some(x=>x&&x.call===name)) continue; say(`  מפל ⇒ «${b.name}»`); forge(b.name,{recipe:b.recipe,minutes,cascade:false}); } }

// ─── 9. ביקורת על כל המדף — עם הבודק האחד ─────────────────────────────────────
export function audit(){ const sh=loadShelf(); let bad=[], tot=0; for(const b of sh.named){ if(b.bad){ bad.push(b.name+' (מסומנת פסולה, ממתינה לבנייה מחדש)'); continue; } const g=goalFor(b.name,b,G); if(!g||!makeChecker(g,3000)(b.prog)) bad.push(b.name); tot+=b.prog.length; }
  let badL=0, totL=0; for(const b of sh.logic||[]){ if(!makeChecker(goalFor('',b,G),1500)(b.prog)) badL++; totL+=b.prog.length; }
  return {named:sh.named.length,bad,tot,logic:(sh.logic||[]).length,badL,totL}; }


// ─── 10. הסולם: בנייה מאפס, מדרגה אחרי מדרגה. רק 5 הפעולות + מה שנבנה *בריצה הזאת* (לא מהמדף) ─────────────
// זה המבחן של «מכונה שלומדת לתכנת לבד». ריצה שנייה = אותו סולם, והרשת כבר למדה מהראשונה — אם היא עוזרת, צריך פחות ניסיונות.
export const LADDER=['העתק','לא (מספר)','קבוע 15','לא-וגם (מספרים)','לא באותו תא','וגם (מספרים)','או (מספרים)','שונה (מספרים)','קבוע 1','ועוד 1 באותו תא','ועוד 1',
  'חיבור מספרים','קח מהכתובת שבתא','שווה (מספרים)','דלג אם לא-אפס (תא0 אפס ⇒ העתק תא1)','אם (תא0 לא-אפס ⇒ תא1, אחרת תא3)'];
export async function ladder({ms=90000,run=1}={}){ const { parallelBuild }=await import('./tzoref-fast.mjs'); const lib=[], rows=[]; const T0=clock();
  for(const name of LADDER){ const g=G[name]; const gen=goalFor(name,null,G); const pieces=lib.flatMap(b=>placements(b,1000));
    // שלב א: רק 5 הפעולות (מהיר, 4 ליבות) · שלב ב: + מה שנלמד בריצה הזאת · שלב ג: עם קפיצות
    brain.ngram=brain.ngram||{};
    let r=await parallelBuild(name,{pieces:[],ms:Math.min(ms,20000),ngram:brain.ngram}), how='5 הפעולות', tries=r.tries;
    if(!r.prog&&pieces.length){ const q=await parallelBuild(name,{pieces,ms:Math.min(ms,40000),ngram:brain.ngram}); tries+=q.tries; r=q; how='5 הפעולות + מה שנלמד'; }
    if(!r.prog){ const j=buildJ(gen,{pieces,ms}); tries+=j.tries; r=j; how='עם קפיצות'; }
    if(r.path){ const P=['^','^',...r.path]; for(let i=2;i<P.length;i++){ const k2=P[i-2]+'|'+P[i-1], k3=k2+'|'+P[i]; brain.ngram[k2]=(brain.ngram[k2]||0)+1; brain.ngram[k3]=(brain.ngram[k3]||0)+1; } saveBrain(); }  // לומד: איזה צינור בא אחרי איזה
    if(r.prog){ const q=shrink(r.prog,makeChecker(gen,300)); lib.push({name,prog:q,ins:g.ins||[0],out:g.out??2}); }
    const row={name,ok:!!r.prog,len:r.prog?lib[lib.length-1].prog.length:null,tries,how:r.prog?how:'-',used:r.prog?[...new Set(r.used||[])]:[]};
    rows.push(row); say(`${row.ok?'✓':'✗'} ${name.padEnd(36)} ${row.ok?String(row.len).padStart(3)+' פקודות':'   —      '} · ${String(tries).padStart(8)} ניסיונות · ${row.how}${row.used.length?' · בעזרת: '+row.used.join(', '):''}`); }
  logTask({t:new Date().toISOString(),name:`סולם ${run}`,ladder:rows.map(r=>({name:r.name,ok:r.ok,tries:r.tries,len:r.len})),ms:clock()-T0});
  return rows; }


// ─── 11. שגרת-עבודה: משימות חדשות + רשימת «לנסות שוב». לא זורקים — רק דוחים. ─────────────────────────────
// בכל משימה: 3 ליבות בונות מחלקי-המדף (רוחבים שונים) + ליבה אחת מ-5 הפעולות · חיפוש עם 8 דוגמאות, כל «נראה נכון» נבדק על הכל
// ⇒ קיצור ⇒ בדיקה סופית (20,000, מכונה נפרדת) ⇒ מדף ⇒ הלומד לומד. נכשלה ⇒ לרשימה, עם פי 2 זמן בפעם הבאה.
const QUEUE='tzoref-queue.json';
export const NEW_GOALS=['כפול 2','חצי','פחות 1','אפס?','זוגי?','ועוד 3','גדול או שווה','הפרש מוחלט','הגדול מבין שלושה','הקטן מבין שלושה','סכום שלושה','השני ברשימה'];
export async function work({names=NEW_GOALS,baseMs=30000,minutes=2}={}){ const { pool }=await import('./tzoref-fast.mjs'); const P=pool(4);
  const q=fs.existsSync(QUEUE)?JSON.parse(fs.readFileSync(QUEUE,'utf8')):{};
  const todo=[...names.filter(n=>!q[n]),...Object.keys(q)]; const rows=[];
  for(const name of todo){ const sh=loadShelf(); if(sh.named.find(b=>b.name===name&&!b.bad)&&!q[name]){ say(`= ${name}: כבר במדף — לא בונים שוב`); continue; }
    const g=G[name]; const gen=goalFor(name,{ins:g.ins},G); const ms=baseMs*(2**((q[name]?.tries)||0)); const T0=clock();   // כולל «הקלט לא משתנה»
    // חלקים: קטנים (עד 20) — בהרבה שיבוצים; גדולים (21–60) — עד 200, לפי «מה טבעי» (כניסות מתאי-המטרה/עבודה); «מוברגת» — רק במקומה
    const LISTC=[0,1,8,9,10,11,12,13,14,15]; const insG=g.ins??LISTC; const pref=[...(g.ins||[0,1]),4,5,6,7,2].filter((c,i,a)=>a.indexOf(c)===i);
    const small=[], big=[]; for(const b of sh.named){ if(b.name===name||b.bad||!(b.ins||[]).length||/רשימה|ספור|בלי|אמצע|וקטן/.test(b.name)||b.prog.length>60) continue;
      const bg=goalFor(b.name,b,G); const mv=b.movable??(bg?movable(b.prog,bg):false); if(b.movable==null) b.movable=mv;
      const P=mv?placements(b,b.prog.length<=20?400:CFG.BIG,pref):[{name:b.name,prog:b.prog,out:b.out??2}]; (b.prog.length<=20?small:big).push(...P); }
    const pieces=[...small,...big]; const tables=partTables(sh.named).filter(t=>t.name!==name);
    // «נבחרים»: הצורף מדרג את החלקים לפי כמה התוצאה שלהם קשורה לתשובה + מה עזר בעבר (tzoref-pick.mjs)
    const smallSet=new Set(small); const ranked=(CFG.MIX||[]).some(x=>x[0]==='T'||x[0]==='B')?rankParts(gen,pieces,{used:loadUsed()}).map(x=>x.p):null;
    brain.ngram=brain.ngram||{};
    // 4 ליבות: כל החלקים (צר) · רק הקטנים · 5 הפעולות לבד · כל החלקים (רחב) — הראשונה שמוצאת מנצחת
    // קודם «בונה-הערכים» (מחפש צירוף חלקים לפי מה שהם נותנים) — מהיר מאוד במשימות של כמה חלקים; אם לא — 4 הליבות
    let r=null; { const S=await import('./tzoref-solve.mjs'); const v=await S.solve(name,gen,g,{say}); if(v.prog){ r={prog:v.prog,tries:0,used:[]}; say(`  המוח (${v.tried.join(' ⇒ ')}): ${v.how} · ${(v.ms/1000).toFixed(1)} שנ׳`); } }
    if(false){ const { valueBuild, show }=await import('./tzoref-value.mjs'); const v=valueBuild(gen,{name,ins:g.ins,out:g.out??2,ms:CFG.VALUE_MS||20000});
      if(v.prog){ r={prog:v.prog,tries:v.made,used:[],how:'בונה-ערכים: '+show(v.expr)}; say(`  בונה-הערכים מצא: ${show(v.expr)} (${(v.ms/1000).toFixed(1)} שנ׳)`); } }
    // משימה על רשימה: קודם «בונה-לולאות» (צובר אחד), ואם לא — «שני צוברים»
    if(false){ /* הוחלף ב«מוח אחד» — tzoref-solve.mjs */ const L=await import('./tzoref-loop.mjs'); const v=L.loopBuild(gen,{name}); if(v.prog){ r={prog:v.prog,tries:v.made,used:[]}; say(`  בונה-הלולאות מצא: התחל מ-${v.init}, בכל איבר: ${L.showL(v.step)} (${(v.ms/1000).toFixed(1)} שנ׳)`); }
      else { const L2=await import('./tzoref-loop2.mjs'); const w=L2.loop2Build(gen,{name}); if(w.prog){ r={prog:w.prog,tries:w.folds,used:[]}; say(`  שני-צוברים מצא: ${w.found.f1.init.name}/${w.found.f2.init.name} · בסוף ${w.found.comb} (${(w.ms/1000).toFixed(1)} שנ׳)`); } } }
    if(!r) r=await P.build(name,{ms,ngram:brain.ngram,N:8,tables,ins:insG,lab:CFG.LAB,rules:CFG.RULES,sw:CFG.SW||null,maxLen:CFG.MAXLEN||128,jobs:(CFG.MIX||[['A',1],['S',10],['Z',100],['A',40]]).map(([k,m,l,K],i)=>({pieces:k==='A'?pieces:k==='S'?small:k==='T'?ranked.slice(0,K||600):k==='B'?[...small,...ranked.filter(q=>!smallSet.has(q)).slice(0,K||300)]:[],width:CFG.W0*m,lab:l,slice:i===0?(CFG.SLICE||0):0}))});
    if(!r.prog){ q[name]={tries:((q[name]?.tries)||0)+1,last:new Date().toISOString()}; fs.writeFileSync(QUEUE,JSON.stringify(q));
      say(`✗ ${name}: לא נמצא (${(r.tries/1e6).toFixed(1)} מיליון ניסיונות, ${((clock()-T0)/1000).toFixed(0)} שנ׳) ⇒ לרשימת «לנסות שוב», בפעם הבאה ${ms*2/1000} שנ׳`); rows.push({name,ok:false}); continue; }
    if(r.path){ const P=['^','^',...r.path]; for(let i=2;i<P.length;i++){ const k2=P[i-2]+'|'+P[i-1], k3=k2+'|'+P[i]; brain.ngram[k2]=(brain.ngram[k2]||0)+1; brain.ngram[k3]=(brain.ngram[k3]||0)+1; } }
    const built=r.prog.length, buildSec=((clock()-T0)/1000).toFixed(1);
    // «מהדומה ביותר במדף»: אם יש — מקצרים גם אותה, ולוקחים את הקצרה
    let near=null; try{ const N=await import('./tzoref-near.mjs'); const nb=N.nearBuild(gen,{name}); if(nb.prog){ near=shorten(nb.prog,gen,{minutes,quiet:1}); say(`  מהמדף: ${N.showN(nb)} ⇒ ${near.prog.length}`); } }catch{}
    let s2; try{ s2=shorten(r.prog,gen,{minutes,quiet:1}); if(near&&near.prog.length<s2.prog.length) s2=near; }catch(e){ if(near) s2=near; else { q[name]={tries:((q[name]?.tries)||0)+1}; fs.writeFileSync(QUEUE,JSON.stringify(q)); say(`✗ ${name}: נמצאה תוכנית שלא עוברת את הבודק המלא ⇒ לרשימה`); continue; } }
    const fc=finalCheck(s2.prog,gen);
    if(fc.bad){ say(`✗ ${name}: נכשל בבדיקה הסופית — לא נכנס`); continue; }
    const mov=movable(s2.prog,gen); const sh2=loadShelf(); const old=sh2.named.find(b=>b.name===name); const entry={name,prog:s2.prog,ins:g.ins||[],out:g.out??2,movable:mov,by:'הצורף · נבנה לבד'}; if(old){ delete old.bad; Object.assign(old,entry); } else sh2.named.push(entry); saveShelf(sh2);
    delete q[name]; fs.writeFileSync(QUEUE,JSON.stringify(q));
    const used=[...new Set(r.used||[])];
    noteUsed(name,used);
    say(`✓ ${name}: נבנה ב-${buildSec} שנ׳ (${built} פקודות${used.length?', מחלקים: '+used.join(' + '):', מ-5 הפעולות'}) ⇒ קוצר ל-${s2.prog.length} ⇒ ${fc.n-fc.bad}/${fc.n} ⇒ במדף · ${mov?'ניידת':'מוברגת'}`);
    rows.push({name,ok:true,len:s2.prog.length,sec:+buildSec}); logTask({t:new Date().toISOString(),name,how:'work',from:built,to:s2.prog.length,tries:r.tries,ms:clock()-T0}); }
  saveBrain(); P.close(); return rows; }

// ─── שורת-פקודה ─────────────────────────────────────────────────────────────
if(import.meta.url==='file://'+process.argv[1]) (async()=>{ const [cmd,...a]=process.argv.slice(2);
  if(cmd==='audit'){ const r=audit(); say(`עם שם: ${r.named} · נכשלו ${r.bad.length} ${r.bad.join(', ')} · סך ${r.tot}`); say(`לוגיות: ${r.logic} · נכשלו ${r.badL} · סך ${r.totL}`); }
  else if(cmd==='forge'){ const r=forge(a[0],{minutes:+a[1]||10,start:a[2]?JSON.parse(fs.readFileSync(a[2],'utf8')):null}); say(JSON.stringify({ok:r.ok,from:r.from,to:r.to,why:r.why})); }
  else if(cmd==='build'){ const sh=loadShelf(); const b=sh.named.find(x=>x.name===a[0]); const gen=goalFor(a[0],b,G); const pieces=a[2]==='atoms'?[]:piecesFrom(sh,a[0]);
    const r=build(gen,{pieces,ms:(+a[1]||60)*1000}); say(r.prog?`נבנה לבד: ${r.prog.length} פקודות · ${r.tries} ניסיונות · ${r.ms}ms${r.used.length?' · לבנים: '+r.used.join(', '):''}`:`לא נבנה · ${r.tries} ניסיונות · ${r.ms}ms`); saveBrain(); }
  else if(cmd==='work'){ const rows=await work({baseMs:(+a[0]||30)*1000,...(a[1]==='retry'?{names:[]}:{})}); say(`סיכום: נבנו ${rows.filter(r=>r.ok).length}/${rows.length}`); process.exit(0); }
  else if(cmd==='forget'){ brain.ngram={}; saveBrain(); say('הלומד התאפס'); }
  else if(cmd==='ladder'){ const rows=await ladder({ms:(+a[0]||90)*1000,run:+a[1]||1}); say(`נבנו לבד: ${rows.filter(r=>r.ok).length}/${rows.length} · סך ניסיונות: ${rows.reduce((x,r)=>x+r.tries,0)}`); saveBrain(); process.exit(0); }
  else if(cmd==='curve'){ const L=brain.tasks.filter(t=>t.ladder); for(const t of L) say(`${t.name} (${t.t.slice(5,16)}): נבנו ${t.ladder.filter(r=>r.ok).length}/${t.ladder.length} · ניסיונות ${t.ladder.reduce((x,r)=>x+r.tries,0)}`); }
  else if(cmd==='brain'){ say(`משימות שנרשמו: ${brain.tasks.length} · סוגי-שינוי שנלמדו: ${Object.keys(brain.tried).length} · משקלות ברשת: ${Object.keys(brain.W).length}`);
    for(const t of brain.tasks.slice(-20)) say(`  ${t.t.slice(5,16)} ${t.name}: ${t.from}→${t.to} · ניסיונות עד השיפור הראשון: ${t.firstWinAt??'-'} · סה"כ ${t.tries}`); }
  else say('שימוש: node tzoref.mjs audit | forge <שם> [דקות] [התחלה.json] | build <שם> [שניות] [atoms] | brain'); })();
