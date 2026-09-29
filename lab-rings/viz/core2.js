// מנוע העיגולים — גרסה «קוצרת»: כל תוכנית שנבדקת בדרך נבדקת גם «מה היא בעצם מחשבת».
// 6 תאים: א=0, ב=1, ג=3 (קלט) · 2 = תשובה · 4,5 = עבודה. תאים שאינם קלט מתחילים מלוכלכים.
// כל פונקציה של שלושה קלטים (ביט-ביט) היא טבלה של 8 שורות ⇒ יש בדיוק 256. המטרה: למפות את כולן, כל אחת בדרך הקצרה ביותר שנמצאה.
const ROOT={id:0,prog:[],ops:[]};
function makeEngine(seed){
  let s=seed||7; const rnd=(k)=>{s=(s*1103515245+12345)%2147483648;return Math.floor(s/2147483648*k)};
  const FREE_IN=[0,1,3,4,5], FREE_OUT=[2,3,4,5];
  const ATOMS=[...[0,1,2,3,4,5].map(k=>({name:`לאן ${k}`,ops:[["W",k]]})),{name:"לך",ops:[["GO"]]},{name:"קח",ops:[["TAKE"]]},{name:"שים",ops:[["PUT"]]},{name:"חשב",ops:[["CALC"]]}];
  function run(ops,mem0){const m=mem0.slice();let A=0,P=0;const st=[];for(const [o,k] of ops){if(o==="W")A=k;else if(o==="GO")P=A;else if(o==="TAKE"){if(st.length>=4)return null;st.push(m[P])}else if(o==="PUT"){if(!st.length)return null;m[P]=st.pop()}else if(o==="CALC"){if(st.length<2)return null;const b=st.pop(),a=st.pop();st.push(~(a&b)&15)}}return {m,st,A,P}}
  const table=(tt)=>(a,b,c)=>{ let r=0; for(let i=0;i<4;i++){ const idx=(((a>>i)&1)<<2)|(((b>>i)&1)<<1)|((c>>i)&1); r|=((tt>>idx)&1)<<i; } return r; };
  const ttOfFn=(fn)=>{ let t=0; for(let idx=0;idx<8;idx++){ const a=(idx>>2)&1?15:0,b=(idx>>1)&1?15:0,c=idx&1?15:0; if(fn(a,b,c)&1) t|=1<<idx; } return t; };
  const NAMED=[["העתק",(a)=>a],["לא",(a)=>~a],["לא-וגם",(a,b)=>~(a&b)],["וגם",(a,b)=>a&b],["או",(a,b)=>a|b],["לא-או",(a,b)=>~(a|b)],["שונה",(a,b)=>a^b],["שווה",(a,b)=>~(a^b)],
    ["א ולא ב",(a,b)=>a&~b],["קבוע 15",()=>15],["קבוע 0",()=>0],["וגם-3",(a,b,c)=>a&b&c],["או-3",(a,b,c)=>a|b|c],["בחר",(a,b,c)=>(a&b)|(~a&c)],["רוב",(a,b,c)=>(a&b)|(a&c)|(b&c)],["שונה-3",(a,b,c)=>a^b^c],
    ["ב",(a,b)=>b],["ג",(a,b,c)=>c],["לא ב",(a,b)=>~b],["לא ג",(a,b,c)=>~c]].map(([n,f])=>({name:n,tt:ttOfFn(f)}));
  const ALIAS=new Map(); for(const x of NAMED) if(!ALIAS.has(x.tt)) ALIAS.set(x.tt,x.name);
  const nameOf=(tt)=>ALIAS.get(tt)||`טבלה ${tt}`;
  const ruleOf=(tt)=>ALIAS.has(tt)?`תא 2 ← ${ALIAS.get(tt)} · טבלה ${tt.toString(2).padStart(8,"0")}`:`תא 2 ← לפי הטבלה ${tt.toString(2).padStart(8,"0")}`;
  const uses=(tt)=>{ const u=[]; for(const [bit,cell] of [[4,0],[2,1],[1,3]]){ let d=false; for(let idx=0;idx<8;idx++) if(((tt>>idx)&1)!==((tt>>(idx^bit))&1)) d=true; if(d) u.push(cell); } return u; };
  const dataOf=(ops)=>[...new Set(ops.filter(o=>o[0]==="W").map(o=>o[1]))];
  const mem=(a,b,c)=>[a,b,rnd(16),c,rnd(16),rnd(16),rnd(16),rnd(16)];   // 6,7 = תאי-עבודה נוספים (מלוכלכים) — מקום להרכבת לבנים
  const HOLD=Array.from({length:240},()=>{ const a=rnd(16),b=rnd(16),c=rnd(16); return {a,b,c,mem:mem(a,b,c)}; });
  // מה התוכנית מחשבת? מריצים על 240 זיכרונות (עם תאים מלוכלכים). אם כל ביט של התשובה תלוי רק בביטים של א,ב,ג באותו מקום — זו טבלה.
  function ttOfOps(ops){ const tab=new Array(8).fill(-1);
    for(const h of HOLD){ const r=run(ops,h.mem); if(!r) return null; for(let i=0;i<4;i++){ const idx=(((h.a>>i)&1)<<2)|(((h.b>>i)&1)<<1)|((h.c>>i)&1); const o=(r.m[2]>>i)&1; if(tab[idx]<0) tab[idx]=o; else if(tab[idx]!==o) return null; } }
    if(tab.includes(-1)) return null; return tab.reduce((t,v,i)=>t|(v<<i),0); }
  // המדף: טבלה ⇒ הלבנה הקצרה ביותר שידועה לה
  const lib=new Map(); const events=[];
  function offer(ops,src){ const tt=ttOfOps(ops); if(tt==null) return null; const cur=lib.get(tt); if(cur&&cur.ops.length<=ops.length) return null;
    const b={tt,name:nameOf(tt),ins:uses(tt),ops,len:ops.length,data:dataOf(ops),src,at:Date.now()}; lib.set(tt,b); events.push({tt,name:b.name,len:b.len,better:!!cur,src}); return b; }
  function variants(b){ const out=[]; const scratch=b.data.filter(c=>!b.ins.includes(c)&&c!==2);
    const pool=b.ins.length===3?[0,1,3]:FREE_IN; const pick=(n,pre=[])=>pre.length===n?[pre]:pool.filter(c=>!pre.includes(c)).flatMap(c=>pick(n,[...pre,c]));
    for(const ins of pick(b.ins.length)) for(const o of FREE_OUT){ if(ins.includes(o)) continue; const map={}; b.ins.forEach((a,i)=>map[a]=ins[i]); map[2]=o;
      const used=new Set(Object.values(map)); const free=[7,6,5,4,3,1,0,2].filter(c=>!used.has(c)); if(free.length<scratch.length) continue; scratch.forEach((c,i)=>map[c]=free[i]);
      out.push({name:`${b.name}(${ins.join(",")}→${o})`,ops:b.ops.map(([op,k])=>op==="W"?["W",map[k]??k]:[op]),brick:b.name}); }
    return out; }
  const bits=(x,y)=>4-((x^y)&15).toString(2).split("").filter(z=>z==="1").length;
  class Search{
    constructor(tt){ this.goal=tt; const fn=table(tt); this.tokens=[...ATOMS];
      for(const b of [...lib.values()].sort((x,y)=>x.len-y.len)){ if(b.ins.length===0) continue; const v=variants(b); if(this.tokens.length+v.length>240) continue; this.tokens.push(...v); }
      this.ex=Array.from({length:16},()=>{ const a=rnd(16),b=rnd(16),c=rnd(16); return {a,b,c,mem:mem(a,b,c),want:fn(a,b,c)}; });
      this.N=16; this.inner=[ROOT]; this.seen=new Set(); this.nid=0; this.ring=0; this.harvested=0; this.probed=new Set(); this.begin(); }
    begin(){ this.ring++; this.ci=0; this.outer=[]; this.tried=0; this.merged=0; this.broke=0; this.best=null; }
    // קציר: מה התוכנית הזאת מחשבת לפי 16 הדוגמאות? אם זו טבלה שאין לנו, או שיש לה עכשיו דרך קצרה יותר — בודקים עד הסוף ושומרים.
    harvest(node,rs){ const tab=new Array(8).fill(-1);
      for(let k=0;k<rs.length;k++){ const e=this.ex[k], o2=rs[k].m[2]; for(let i=0;i<4;i++){ const idx=(((e.a>>i)&1)<<2)|(((e.b>>i)&1)<<1)|((e.c>>i)&1); const o=(o2>>i)&1; if(tab[idx]<0) tab[idx]=o; else if(tab[idx]!==o) return; } }
      if(tab.includes(-1)) return; const tt=tab.reduce((t,v,i)=>t|(v<<i),0); const cur=lib.get(tt); const L=node.ops.length+2;
      if(cur&&cur.len<=L) return; const key=tt+":"+L; if(this.probed.has(key)) return; this.probed.add(key);
      if(offer([["W",0],["GO"],...node.ops],"harvest")) this.harvested++; }
    step(ms){ const t0=performance.now(), ex=this.ex, N=this.N;
      while(this.ci<this.inner.length){ const c=this.inner[this.ci++];
        for(const t of this.tokens){ this.tried++; const ops=c.ops.concat(t.ops); const rs=[]; let bad=false;
          for(const e of ex){ const r=run(ops,e.mem); if(!r){bad=true;break} rs.push(r) }
          if(bad){ this.broke++; continue }
          const sig=rs.map(r=>r.m.join(",")+"|"+r.st.join(",")+"|"+r.A+r.P).join("/"); if(this.seen.has(sig)){ this.merged++; continue } this.seen.add(sig);
          let ok=0,b2=0,bn=0; rs.forEach((r,i)=>{ const w=ex[i].want; if(r.m[2]===w) ok++; b2+=bits(r.m[2],w); let bb=0; for(const v of r.m) bb=Math.max(bb,bits(v,w)); for(const v of r.st) bb=Math.max(bb,bits(v,w)); bn+=bb; });
          const node={id:++this.nid,prog:c.prog.concat([t]),ops,ok,b2,bn,parent:c,out:rs.map(r=>r.m[2])}; this.outer.push(node);
          this.harvest(node,rs);
          if(ok===N&&!this.best&&ttOfOps(ops)===this.goal) this.best=node; }
        if(performance.now()-t0>ms) return null; }
      this.outer.sort((a,b)=>b.ok-a.ok||b.bn-a.bn||b.b2-a.b2||a.prog.length-b.prog.length); const kept=this.outer.slice(0,Math.max(1500,Math.floor(160000/this.tokens.length)));
      const res={ring:this.ring,tried:this.tried,merged:this.merged,broke:this.broke,kept,best:this.best,N,harvested:this.harvested};
      if(!this.best){ this.inner=kept; this.begin(); } return res; }
    get progress(){ return this.inner.length? this.ci/this.inner.length : 0 }
  }
  // קיצור: מתחילים מתוכנית שעובדת. מנסים למחוק קטע של 1–4 פעולות, או להחליף אותו בפעולה אחת או שתיים. נשאר רק מה שעדיין עובד (בדיקה מהירה על 24, ואז 240).
  const QUICK=Array.from({length:24},()=>{ const a=rnd(16),b=rnd(16),c=rnd(16); return {a,b,c,mem:mem(a,b,c)}; });
  const ALL8=[...[0,1,2,3,4,5,6,7].map(k=>["W",k]),["GO"],["TAKE"],["PUT"],["CALC"]];
  class Shrinker{
    constructor(b){ this.tt=b.tt; this.fn=table(b.tt); this.start=b.ops.length; this.ops=b.ops.slice(); this.w=4; this.i=0; this.r=0; this.k=0; this.tried=0; this.wins=0; this.passImproved=false; this.done=false; this.last=null; }
    works(ops){ for(const h of QUICK){ const r=run(ops,h.mem); if(!r||r.m[2]!==this.fn(h.a,h.b,h.c)) return false; } return ttOfOps(ops)===this.tt; }
    reps(r){ if(r===0) return [[]]; if(r===1) return ALL8.map(x=>[x]); const o=[]; for(const x of ALL8) for(const y of ALL8) o.push([x,y]); return o; }
    step(ms){ const t0=performance.now(); this.last=null;
      while(!this.done){
        if(this.i+this.w>this.ops.length){ this.i=0; this.r=0; this.k=0; this.w--; if(this.w<1){ if(this.passImproved){ this.w=4; this.passImproved=false; } else { this.done=true; break; } } continue; }
        const R=this.reps(this.r); if(this.k>=R.length){ this.k=0; this.r++; if(this.r>=Math.min(this.w,3)){ this.r=0; this.i++; } continue; }
        const rep=R[this.k++]; this.tried++; const cand=[...this.ops.slice(0,this.i),...rep,...this.ops.slice(this.i+this.w)];
        if(this.works(cand)){ this.last={i:this.i,w:this.w,r:rep.length,from:this.ops.length,to:cand.length}; this.ops=cand; this.wins++; this.passImproved=true; this.k=0; this.r=0; return this.last; }
        if(performance.now()-t0>ms) return null; }
      return null; }
    get where(){ return {i:this.i,w:this.w}; }
  }
  // המשימה הבאה — לפי תועלת, לא באקראי: קודם הרשימה, ואחר כך הטבלה החסרה שהכי קרובה (בביטים) למשהו שכבר יודעים.
  const backoff=new Map();   // tt ⇒ {tries, until}
  function nextTarget(accept,round,skip){ const known=new Set(lib.keys()); const ok=(tt)=>!known.has(tt)&&(!skip||!skip(tt))&&(!backoff.has(tt)||backoff.get(tt).until<=round);
    for(const x of NAMED) if(ok(x.tt)&&(!accept||accept(x.tt))) return x.tt;
    let best=null, bd=9; const pop=(x)=>x.toString(2).split("").filter(z=>z==="1").length;
    for(let tt=0;tt<256;tt++){ if(!ok(tt)||(accept&&!accept(tt))) continue; let d=9; for(const k of known) d=Math.min(d,pop(tt^k)); if(d<bd||(d===bd&&rnd(3)===0)){ bd=d; best=tt; } }
    return best; }
  function failed(tt,round){ const b=backoff.get(tt)||{tries:0}; b.tries++; b.until=round+2+b.tries*3; backoff.set(tt,b); return b.tries; }
  const state=()=>({s,lib:[...lib.values()].map(({tt,ops,src,at})=>({tt,ops,src,at})),backoff:[...backoff.entries()]});
  const restore=(o)=>{ s=o.s; lib.clear(); for(const b of o.lib) { const tt=ttOfOps(b.ops); if(tt===b.tt) lib.set(tt,{tt,name:nameOf(tt),ins:uses(tt),ops:b.ops,len:b.ops.length,data:dataOf(b.ops),src:b.src,at:b.at}); } backoff.clear(); for(const [k,v] of o.backoff||[]) backoff.set(k,v); };
  return {ATOMS,Search,Shrinker,lib,events,offer,nextTarget,failed,backoff,nameOf,ruleOf,ttOfOps,uses,state,restore,run,table};
}
if(typeof module!=="undefined") module.exports={makeEngine,ROOT};
