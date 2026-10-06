// «פירוק»: כשלא מוצאים את כל התוכנית — לוקחים חלק «כמעט נכון» (x), ומה שחסר כדי להגיע לתשובה (תשובה פחות x) הוא משימה חדשה וקטנה יותר.
// פותרים אותה באותה דרך (עד עומק D). כל חלק-חסר שנפתר נשמר כ«מתכון» — כדי שבפעם הבאה יהיה צעד אחד (לומדים מהכישלון).
import fs from 'fs'; import { basicBuild, showB } from './tzoref-basic.mjs';
const N_OF=k=>16**k;
// כמה «פשוט» היעד: מעט ערכים שונים ומעט «רעש» — קל יותר לבנות
// מבנה: בכל שורה (א קבוע) ובכל עמודה (ב קבוע) — כמה ערכים שונים. קוד אמיתי «מסודר» לאורך השורות והעמודות; רעש — לא
function rowcol(v){ const n=v.length; if(n!==256) return complexity(v); let s=0; for(let a=0;a<16;a++){ let m=0; for(let b=0;b<16;b++) m|=1<<v[a*16+b]; s+=popc(m); } for(let b=0;b<16;b++){ let m=0; for(let a=0;a<16;a++) m|=1<<v[a*16+b]; s+=popc(m); } return s; }
const popc=m=>{ let c=0; while(m){ c+=m&1; m>>=1; } return c; };
function complexity(v){ const cnt=new Int32Array(16); for(const x of v) cnt[x]++; let distinct=0, top=0; for(const c of cnt){ if(c) distinct++; if(c>top) top=c; }
  let H=0; for(const c of cnt) if(c){ const p=c/v.length; H-=p*Math.log2(p); } return H*100+distinct; }
const LEARN='tzoref-learned-parts.json'; const loadL=()=>{ try{ return JSON.parse(fs.readFileSync(LEARN,'utf8')); }catch{ return []; } };
export function decompose(T,{ins=[0,1],depth=2,ms=20000,K=+process.env.DK||40,subms=+process.env.SUBMS||3000,say=()=>{},tag='',learned=true}={}){ const t0=Date.now();
  // חלקים שנלמדו בעבר (מכישלונות קודמים) — נכנסים כצעד אחד
  const L=learned?loadL().filter(x=>x.k===ins.length&&x.T.length===T.length):[];
  const ops=L.map((x,i)=>({name:'נלמד'+i,k:0,T:null,vec:Uint8Array.from(x.T),expr:x.expr}));
  for(const o of ops) if(o.vec.every((v,i)=>v===T[i])) return {expr:o.expr,how:'מהמדף-הנלמד'};
  const r=basicBuild(T,{ins,ms,keepBank:depth>0}); if(r.expr) return {expr:r.expr,how:'ישיר'};
  if(depth<=0||!r.lev) return null;
  const W=Uint8Array.from(T); const N=W.length; const cand=[];
  const consider=(xv,xe)=>{ const res=new Uint8Array(N); for(let i=0;i<N;i++) res[i]=(W[i]-xv[i])&15; const c=(process.env.CMEAS==='H'?complexity:rowcol)(res); if(cand.length<K||c<cand[cand.length-1].c){ cand.push({c,res,xe}); cand.sort((a,b)=>a.c-b.c); if(cand.length>K) cand.pop(); } };
  for(const lv of r.lev) for(const x of lv||[]) consider(x.v,x.e);
  for(const o of ops) consider(o.vec,o.expr);   // גם חלק-נלמד יכול להיות ה«כמעט נכון»
  say(`${tag}לא נמצא ישירות · מנסה ${cand.length} פירוקים (מורכבות-השארית ${cand.map(c=>c.c.toFixed(0)).join(',')})`);
  for(const c of cand){ const sub=decompose(Array.from(c.res),{ins,depth:depth-1,ms:subms,K:Math.min(K,10),subms,say,tag:tag+'  ',learned});
    if(sub){ // לומדים: השארית שנפתרה הופכת לחלק במדף-הנלמד
      if(learned){ const Ls=loadL(); const key=Array.from(c.res).join(','); if(!Ls.some(x=>x.T.join(',')===key)){ Ls.push({k:ins.length,T:Array.from(c.res),expr:sub.expr}); fs.writeFileSync(LEARN,JSON.stringify(Ls)); } }
      return {expr:{o:'ADD',a:c.xe,b:sub.expr},how:`פירוק(${sub.how})`}; } }
  return null; }
