// «מחברת טריקים»: כל קיצור שהצליח נרשם כטריק «קטע א ⇐ קטע ב».
// טריק נכנס למחברת רק אם הוא נכון בכל מצב (זיכרון, מחסנית, לאן/איפה) — לא רק במקרה של התוכנית שבה נמצא.
// «נכון אם אחריו WHERE»: טריק שמשנה רק את «לאן» — מותר רק כשהפקודה הבאה קובעת «לאן» מחדש.
import fs from 'fs'; import { add4 } from './lifted-add.mjs'; import { shr4 } from './lifted-shr.mjs';
const FILE='tzoref-tricks.json'; const SMAX=12;
export const loadTricks=()=>{ try{ return JSON.parse(fs.readFileSync(FILE,'utf8')); }catch{ return []; } };
const key=p=>p.map(x=>x[0]+(x[1]!=null?' '+x[1]:'')).join(';');
function run(seg,s){ const mem=s.mem.slice(), st=s.st.slice(); let A=s.A,P=s.P;
  for(const [o,k] of seg){ switch(o){ case 'WHERE': A=k; break; case 'WHERE@': if(!st.length) return null; A=st.pop()&15; break; case 'GO': P=A; break;
      case 'TAKE': if(P>15||st.length>=SMAX) return null; st.push(mem[P]); break; case 'PUT': if(!st.length||P>15) return null; mem[P]=st.pop(); break;
      case 'CALC': { if(st.length<2) return null; const b=st.pop(),a=st.pop(); st.push(~(a&b)&15); break; } case 'ADD': { if(st.length<2) return null; const b=st.pop(),a=st.pop(); st.push(add4(a,b)); break; }
      case 'SHR': if(!st.length) return null; st.push(shr4(st.pop())); break; default: return null; } }
  return {mem,st,A,P}; }
const R=k=>Math.floor(Math.random()*k);
const states=n=>Array.from({length:n},()=>({mem:Array.from({length:16},()=>R(4)?R(16):R(3)),st:Array.from({length:R(9)},()=>R(4)?R(16):0),A:R(16),P:R(16)}));
const S1=states(4000);
// האם «ב» עושה בדיוק מה ש«א» עושה? full = הכל זהה · adead = הכל חוץ מ«לאן»
export function equiv(a,b){ let full=true, adead=true, n=0;
  for(const s of S1){ const x=run(a,s); if(x==null) continue; n++; const y=run(b,s); if(y==null) return null;   // «א» עבד ו«ב» נשבר ⇒ לא טריק
    if(x.P!==y.P||x.st.join()!==y.st.join()||x.mem.join()!==y.mem.join()) return null; if(x.A!==y.A) full=false; }
  if(n<300) return null;   // «א» כמעט אף פעם לא עובד ⇒ אין הוכחה (לא «נכון בגלל שאין דוגמאות»)
  return full?'full':adead?'adead':null; }
export function purge(){ const T=loadTricks(); const K=T.filter(t=>equiv([...(t.ctx||[]),...t.from],[...(t.ctx||[]),...t.to])); fs.writeFileSync(FILE,JSON.stringify(K)); return {before:T.length,after:K.length}; }
// מה השתנה בין תוכנית ישנה לחדשה: הקטע באמצע (אחרי ההתחלה המשותפת ולפני הסוף המשותף)
export function diff(oldP,newP){ let i=0; while(i<oldP.length&&i<newP.length&&key([oldP[i]])===key([newP[i]])) i++; let j=0;
  while(j<oldP.length-i&&j<newP.length-i&&key([oldP[oldP.length-1-j]])===key([newP[newP.length-1-j]])) j++;
  return {from:oldP.slice(i,oldP.length-j),to:newP.slice(i,newP.length-j)}; }
// קיצור גדול (הרבה שינויים בבת אחת) ⇒ מפרקים ל«חתיכות» לפי היישור הארוך ביותר (LCS); כל חתיכה נבדקת לבד
function hunks(a,b){ const n=a.length,m=b.length; if(n*m>40000) return [diff(a,b)]; const A=a.map(x=>key([x])), B=b.map(x=>key([x]));
  const L=Array.from({length:n+1},()=>new Int16Array(m+1)); for(let i=n-1;i>=0;i--) for(let j=m-1;j>=0;j--) L[i][j]=A[i]===B[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
  const out=[]; let i=0,j=0,cur=null;
  while(i<n||j<m){ if(i<n&&j<m&&A[i]===B[j]){ if(cur){ out.push(cur); cur=null; } i++; j++; }
    else { if(!cur) cur={from:[],to:[],at:i}; if(j<m&&(i>=n||L[i][j+1]>=L[i+1][j])) cur.to.push(b[j++]); else cur.from.push(a[i++]); } }
  if(cur) out.push(cur); return out; }
// טריק עם «הקשר»: לפעמים קטע ⇐ קטע נכון רק אם לפניו באות פקודות מסוימות (למשל «הערך כבר בתא»). מחפשים את ההקשר הקצר ביותר (0–6 פקודות) שבו זה תמיד נכון.
export function record(oldP,newP,where=''){ let got=null; const T=loadTricks();
  for(const h of hunks(oldP,newP)){ const {from,to}=h; if(!from.length||from.length<=to.length||from.length>14) continue; if([...from,...to].some(x=>x[0]==='JUMP'||x[2])) continue;
    const at=h.at??oldP.findIndex((_,i)=>key(oldP.slice(i,i+from.length))===key(from));
    for(let c=0;c<=6&&c<=at;c++){ const ctx=oldP.slice(at-c,at); if(ctx.some(x=>x[0]==='JUMP'||x[2])) break; if(oldP.some(x=>x[2]==='code'&&x[1]>at-c&&x[1]<=at)) break;   // קפיצה לתוך ההקשר — ההקשר לא מובטח
      const kind=equiv([...ctx,...from],[...ctx,...to]); if(!kind) continue;
      const k=key(ctx)+'|'+key(from)+'=>'+key(to); if(!T.some(t=>t.k===k)){ T.push({k,ctx,from,to,kind,where,saves:from.length-to.length}); got=kind; } break; } }
  if(got){ fs.writeFileSync(FILE,JSON.stringify(T)); try{ generalize(); }catch{} } return got; }
// הפעלה: עובר על התוכנית ומחליף כל מופע של «א» ב«ב» (אם הטריק תקף במקום הזה), מתקן יעדי-קפיצות
export function applyTricks(prog0,ok){ const g0=applyGeneral(prog0,ok); const prog=g0.prog; const T=loadTricks().sort((a,b)=>b.saves-a.saves); let p=prog.slice(), used=0, changed=true;
  const code=x=>x[2]==='code';
  while(changed){ changed=false;
    for(const t of T){ const n=t.from.length, c=(t.ctx||[]).length; for(let i=c;i+n<=p.length;i++){ if(key(p.slice(i,i+n))!==key(t.from)) continue; if(p.slice(i,i+n).some(code)) continue;
        if(c&&key(p.slice(i-c,i))!==key(t.ctx)) continue;   // ההקשר חייב להופיע ממש לפני
        if(t.kind==='adead'){ const nx=p[i+n]; if(nx&&!(nx[0]==='WHERE'&&!nx[2])) continue; }
        if(p.some(x=>code(x)&&x[1]>i-c&&x[1]<i+n)) continue;   // קפיצה לתוך ההקשר או הקטע — לא נוגעים
        const d=t.to.length-n; const q=[...p.slice(0,i),...t.to.map(x=>x.slice()),...p.slice(i+n)].map((x,j)=>code(x)&&x[1]>=i+n?['WHERE',x[1]+d,'code']:x);
        if(ok&&!ok(q)) continue; p=q; used++; changed=true; break; } if(changed) break; } }
  return {prog:p,used:used+g0.used}; }
// ─── טריק כללי: במקום מספרי-תאים — «משתנים» (תא א, תא ב…). הטריק נכנס רק אם הוא נכון לכל בחירת תאים שונים.
const GFILE='tzoref-tricks-general.json';
export const loadGeneral=()=>{ try{ return JSON.parse(fs.readFileSync(GFILE,'utf8')); }catch{ return []; } };
const isW=x=>x[0]==='WHERE'&&!x[2];
function abstract(seqs){ const m=new Map(); const conv=seq=>seq.map(x=>{ if(!isW(x)) return [x[0]]; if(!m.has(x[1])) m.set(x[1],m.size); return ['WHERE',{v:m.get(x[1])}]; }); const out=seqs.map(conv); return {out,n:m.size}; }
const inst=(seq,b)=>seq.map(x=>x[1]&&typeof x[1]==='object'?['WHERE',b[x[1].v]]:x.slice());
const gkey=seq=>seq.map(x=>x[0]+(x[1]!=null?' '+(typeof x[1]==='object'?'$'+x[1].v:x[1]):'')).join(';');
function bindings(n,cnt){ const out=[]; for(let t=0;t<cnt;t++){ const p=[...Array(16).keys()].sort(()=>Math.random()-0.5); out.push(p.slice(0,n)); } return out; }
export function generalize(){ const T=loadTricks(), G=loadGeneral(); let added=0;
  for(const t of T){ const {out:[ctx,from,to],n}=abstract([t.ctx||[],t.from,t.to]); const k=gkey(ctx)+'|'+gkey(from)+'=>'+gkey(to); if(G.some(g=>g.k===k)) continue;
    let kind='full'; let ok=true; for(const b of bindings(n,n?40:1)){ const e=equiv(inst([...ctx,...from],b),inst([...ctx,...to],b)); if(!e){ ok=false; break; } if(e==='adead') kind='adead'; }
    if(ok){ G.push({k,ctx,from,to,n,kind,saves:from.length-to.length}); added++; } }
  fs.writeFileSync(GFILE,JSON.stringify(G)); return {general:G.length,added}; }
export function applyGeneral(prog,ok){ const G=loadGeneral().sort((a,b)=>b.saves-a.saves); let p=prog.slice(), used=0, changed=true; const code=x=>x[2]==='code';
  const match=(pat,at,b)=>{ for(let j=0;j<pat.length;j++){ const x=p[at+j], y=pat[j]; if(!x||x[0]!==y[0]||!!x[2]) return false; if(y[1]!=null){ if(typeof y[1]==='object'){ if(b[y[1].v]==null){ if(b.includes(x[1])) return false; b[y[1].v]=x[1]; } else if(b[y[1].v]!==x[1]) return false; } else if(x[1]!==y[1]) return false; } } return true; };
  while(changed){ changed=false;
    for(const g of G){ const c=g.ctx.length, n=g.from.length; for(let i=0;i+c+n<=p.length;i++){ const b=[]; if(!match([...g.ctx,...g.from],i,b)) continue; const s=i+c;
        if(g.kind==='adead'){ const nx=p[s+n]; if(nx&&!(nx[0]==='WHERE'&&!nx[2])) continue; }
        if(p.some(x=>code(x)&&x[1]>i&&x[1]<s+n)) continue; const d=g.to.length-n;
        const q=[...p.slice(0,s),...inst(g.to,b),...p.slice(s+n)].map(x=>code(x)&&x[1]>=s+n?['WHERE',x[1]+d,'code']:x);
        if(ok&&!ok(q)) continue; p=q; used++; changed=true; break; } if(changed) break; } }
  return {prog:p,used}; }
