// «בטוח לשרשרת»: כלי-רשימה שעובד לבד (בהתחלת התוכנית, עם תא 0 = 0) — האם הוא עובד גם באמצע שרשרת?
// שתי סכנות שנמצאו (ראו «האמצע הפוך»):
//   1. קפיצה לכתובת-קוד קבועה שלא סומנה 'code' (למשל «הפוך רשימה» קופץ ל-1): בתחילת התוכנית זה «מתחיל מחדש» ועובד,
//      אבל באמצע שרשרת זה מריץ שוב את הכלים שלפניו. בדיקת-הניידות הרגילה (ריפוד WHERE 0/GO) לא רואה את זה, כי הריפוד לא משנה כלום.
//   2. הנחה שהתא 0 (או תא-עזר אחר) מתחיל ב-0 — באמצע שרשרת יש שם זבל מהכלי הקודם.
// כאן: מריצים עם «שומר» (קפיצה אל מתחת לתחילת הכלי = כישלון) על זיכרון מלוכלך, ומנסים תיקונים מכניים: איפוס תאי-עזר לפני הכלי, ו«העברת» קפיצות קבועות.
import { cleanNonList } from './posframes.mjs'; import { add4 } from './lifted-add.mjs'; import { shr4 } from './lifted-shr.mjs';
const R=k=>Math.floor(Math.random()*k);
export const walk=m=>{ const o=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ o.push(a); a=m[a]; } return o; };
export const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
export const Z=[['WHERE',0],['GO']];
// אותה מכונה קפדנית (machine3s), ועוד: קפיצה לכתובת קטנה מ-lo = כישלון (הכלי חזר אל מה שלפניו)
export function runG(prog,mem0,{lo=0,maxSteps=600000}={}){ const mem=new Array(16).fill(0); mem0.forEach((v,i)=>{ mem[i]=v; });
  let A=0,P=0,pc=0,steps=0; const st=[];
  while(pc<prog.length){ if(++steps>maxSteps) return null; const [op,k]=prog[pc++];
    if(op==='WHERE') A=k; else if(op==='WHERE@'){ if(!st.length) return null; A=st.pop()%16; } else if(op==='GO') P=A;
    else if(op==='JUMP'){ if(!st.length) return null; if(st.pop()!==0){ if(A<lo) return null; pc=A; } }
    else if(op==='TAKE'){ if(P>=16) return null; st.push(mem[P]); } else if(op==='PUT'){ if(!st.length||P>=16) return null; mem[P]=st.pop(); }
    else if(op==='ADD'){ if(st.length<2) return null; const b=st.pop(),a=st.pop(); st.push(add4(a,b)); }
    else if(op==='SHR'){ if(!st.length) return null; st.push(shr4(st.pop())); }
    else if(op==='CALC'){ if(st.length<2) return null; const b=st.pop(),a=st.pop(); st.push(~(a&b)&15); } }
  return {mem,st,steps}; }
// אותו «שומר», מהיר: קידוד פעם אחת, חיבור והזזה מטבלה שמולאה ע"י התוכניות המורמות (כמו machine3f). מחזיר זיכרון חדש, או null.
const ADDT=new Int32Array(256), SHRT=new Int32Array(16); for(let a=0;a<16;a++){ SHRT[a]=shr4(a); for(let b=0;b<16;b++) ADDT[a*16+b]=add4(a,b); }
const OPC={WHERE:0,'WHERE@':1,GO:2,JUMP:3,TAKE:4,PUT:5,ADD:6,SHR:7,CALC:8}; const STK=new Int32Array(1<<16);
export function encodeG(p){ const n=p.length, ops=new Int32Array(n), args=new Int32Array(n); for(let i=0;i<n;i++){ ops[i]=OPC[p[i][0]]; if(p[i][0]==='WHERE') args[i]=p[i][1]; } return {ops,args,n}; }
export function runFastG(code,mem0,lo=0,maxSteps=600000){ const {ops,args,n}=code; const M=new Int32Array(16); for(let i=0;i<16;i++) M[i]=mem0[i]|0; let A=0,P=0,pc=0,steps=0,sp=0;
  while(pc<n){ if(++steps>maxSteps) return null; const op=ops[pc], k=args[pc]; pc++;
    switch(op){ case 0: A=k; break; case 1: if(sp===0) return null; A=STK[--sp]%16; break; case 2: P=A; break;
      case 3: if(sp===0) return null; if(STK[--sp]!==0){ if(A<lo) return null; pc=A; } break;
      case 4: if(P>=16) return null; if(sp>=STK.length) return null; STK[sp++]=M[P]; break;
      case 5: if(sp===0||P>=16) return null; M[P]=STK[--sp]; break;
      case 6: { if(sp<2) return null; const b=STK[--sp], a=STK[--sp]; STK[sp++]=ADDT[a*16+b]; break; }
      case 7: if(sp===0) return null; STK[sp-1]=SHRT[STK[sp-1]]; break;
      case 8: { if(sp<2) return null; const b=STK[--sp], a=STK[--sp]; STK[sp++]=~(a&b)&15; break; } } }
  return sp===0?M:null; }
export const walkA=m=>{ const o=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ o.push(a); a=m[a]; } return o; };
// זיכרון «מלוכלך»: תאי-עזר 0,2..7 וגם תאי 8..15 שאינם ברשימה — אקראיים (כמו אחרי כלי אחר)
export const dirty=(m)=>{ const q=m.slice(), inl=new Set(walk(m)); for(let c=0;c<16;c++) if(c!==1&&!inl.has(c)) q[c]=R(16); return q; };
// איפוס תאים: 15 = לא-וגם(לא x, x) ⇒ 0 = לא-וגם(15,15) ⇒ מעתיקים את ה-0 לשאר
export function zeroCells(cs){ if(!cs.length) return []; const c0=cs[0]; const out=[['WHERE',c0],['GO'],['TAKE'],['TAKE'],['CALC'],['TAKE'],['CALC'],['PUT'],['TAKE'],['TAKE'],['CALC'],['PUT']];
  for(const c of cs.slice(1)) out.push(['WHERE',c0],['GO'],['TAKE'],['WHERE',c],['GO'],['PUT']); return out; }
// העברת קפיצות: JUMP שהכתובת שלו באה מ-WHERE k קבוע (בלי 'code') ⇒ מכניסים לפניו WHERE מסומן 'code' לנקודת-נחיתה שקולה:
//   k עצמו אם הקוד שם לא קורא את A לפני שקובע אותו, או k-1 אם שם כתוב WHERE k (נוחתים ומקבלים בדיוק A=k).
const readsA=(p,i)=>{ for(let j=i;j<p.length;j++){ const o=p[j][0]; if(o==='WHERE'||o==='WHERE@') return false; if(o==='GO'||o==='JUMP') return true; } return false; };
export function relocate(p){ const fix=[]; let any=false;
  for(let j=0;j<p.length;j++){ if(p[j][0]!=='JUMP') continue; let i=j-1; while(i>=0&&!['WHERE','WHERE@','JUMP'].includes(p[i][0])) i--;
    if(i<0||p[i][0]!=='WHERE') return null; if(p[i][2]==='code') continue; const k=p[i][1];
    let land; if(!readsA(p,k)) land=k; else if(k>0&&p[k-1][0]==='WHERE'&&!p[k-1][2]&&p[k-1][1]===k) land=k-1; else return null;
    if(readsA(p,j+1)) return null;   // אם לא קופצים — A משתנה, ואסור שמישהו אחרי יקרא אותו
    fix.push([j,land]); any=true; }
  if(!any) return p; const at=new Map(fix.map(([j,l])=>[j,l])); const map=[]; let n=0; for(let j=0;j<p.length;j++){ if(at.has(j)) n++; map[j]=n++; } map[p.length]=n;
  const out=[]; for(let j=0;j<p.length;j++){ if(at.has(j)) out.push(['WHERE',map[at.get(j)],'code']); const x=p[j]; out.push(x[2]==='code'?['WHERE',map[x[1]],'code']:x); } return out; }
const PADN=14; const PAD=Array.from({length:PADN},(_,i)=>i%2?['GO']:['WHERE',0]);
// כלי רשימה⇒רשימה: מחזיר גרסה שעובדת באמצע שרשרת (אותו פלט כמו לבד, על זיכרון מלוכלך, בלי לחזור אחורה), או null
export function chainSafeLL(prog,exs,{n=3}={}){ const c0=encodeG(prog); const want=exs.map(e=>{ const r=runFastG(c0,e.mem); return r?JSON.stringify(walkA(r)):null; }); if(want.some(x=>x===null)) return null;
  const ok=q=>{ const body=encodeG([...PAD,...shift(q,PADN)]); for(let t=0;t<n;t++) for(let i=0;i<exs.length;i++){ const r=runFastG(body,dirty(exs[i].mem),PADN); if(!r||JSON.stringify(walkA(r))!==want[i]) return false; } return true; };
  const rel=relocate(prog); const cands=[[prog,'']];
  if(rel&&rel!==prog) cands.push([rel,'העברת קפיצות']);
  for(const [q,w] of [...cands]){ cands.push([[...zeroCells([0]),...shift(q,12)],(w?w+' + ':'')+'איפוס תא 0']); cands.push([[...zeroCells([0,2,3,4,5,6,7]),...shift(q,12+36)],(w?w+' + ':'')+'איפוס תאי-עזר']); }
  for(const [q,w] of [...cands].slice(0,2)){ const CL=cleanNonList(); const pre=[...CL,...zeroCells([0,2,3,4,5,6,7])]; cands.push([[...pre,...shift(q,pre.length)],(w?w+' + ':'')+'ניקוי תאים שמחוץ לרשימה + איפוס תאי-עזר']); }
  for(const [q,w] of cands) if(ok(q)) return {prog:q,fix:w}; return null; }
// כלי רשימה⇒מספר (תשובה בתא 2, הרשימה לא משתנה): אותו רעיון
export function chainSafeLN(prog,exs,{n=3}={}){ const c0=encodeG(prog); const want=exs.map(e=>{ const r=runFastG(c0,e.mem); return r?r[2]&15:null; }); if(want.some(x=>x===null)) return null;
  const same=(a,b)=>{ if(a[1]!==b[1]) return false; for(const x of walk(b)) if(a[x]!==b[x]) return false; return true; };
  const ok=q=>{ const body=encodeG([...PAD,...shift(q,PADN)]); for(let t=0;t<n;t++) for(let i=0;i<exs.length;i++){ const m=dirty(exs[i].mem); const r=runFastG(body,m,PADN); if(!r||(r[2]&15)!==want[i]||!same(r,m)) return false; } return true; };
  const rel=relocate(prog); const cands=[[prog,'']]; if(rel&&rel!==prog) cands.push([rel,'העברת קפיצות']);
  for(const [q,w] of [...cands]){ cands.push([[...zeroCells([0]),...shift(q,12)],(w?w+' + ':'')+'איפוס תא 0']); cands.push([[...zeroCells([0,2,3,4,5,6,7]),...shift(q,12+36)],(w?w+' + ':'')+'איפוס תאי-עזר']); }
  for(const [q,w] of cands) if(ok(q)) return {prog:q,fix:w,v:want}; return null; }
