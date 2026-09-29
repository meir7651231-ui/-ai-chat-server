const ROOT={id:0,prog:[],ops:[]};
function makeEngine(seed){
  let s=seed||7; const rnd=(k)=>{s=(s*1103515245+12345)%2147483648;return Math.floor(s/2147483648*k)};
  const CELLS=6, INS=[0,1,3], FREE_IN=[0,1,3,4,5], FREE_OUT=[2,3,4,5];
  const ATOMS=[...[0,1,2,3,4,5].map(k=>({name:`לאן ${k}`,ops:[["W",k]]})),{name:"לך",ops:[["GO"]]},{name:"קח",ops:[["TAKE"]]},{name:"שים",ops:[["PUT"]]},{name:"חשב",ops:[["CALC"]]}];
  function run(ops,mem0){const m=mem0.slice();let A=0,P=0;const st=[];for(const [o,k] of ops){if(o==="W")A=k;else if(o==="GO")P=A;else if(o==="TAKE"){if(st.length>=4)return null;st.push(m[P])}else if(o==="PUT"){if(!st.length)return null;m[P]=st.pop()}else if(o==="CALC"){if(st.length<2)return null;const b=st.pop(),a=st.pop();st.push(~(a&b)&15)}}return {m,st,A,P}}
  function examples(fn,n=16){const ex=[];for(let i=0;i<n;i++){const a=rnd(16),b=rnd(16),c=rnd(16);const m=[a,b,rnd(16),c,rnd(16),rnd(16)];ex.push({mem:m,a,b,c,want:fn(a,b,c)&15})}return ex}
  const dataOf=(ops)=>[...new Set(ops.filter(o=>o[0]==="W").map(o=>o[1]))];
  const bits=(x,y)=>4-((x^y)&15).toString(2).split("").filter(z=>z==="1").length;
  // לבנה ⇒ גרסאות: הקלט והפלט עוברים לתאים אחרים, ותאי-העבודה שלה עוברים לתאים פנויים (כמו ב-lab13)
  function variants(b){ const out=[]; const scratch=b.data.filter(c=>!b.ins.includes(c)&&c!==2);
    const pool=b.ins.length===3?[0,1,3]:FREE_IN; const pick=(n,pre=[])=>pre.length===n?[pre]:pool.filter(c=>!pre.includes(c)).flatMap(c=>pick(n,[...pre,c]));
    for(const ins of pick(b.ins.length)) for(const o of FREE_OUT){ if(ins.includes(o)) continue; const map={}; b.ins.forEach((a,i)=>map[a]=ins[i]); map[2]=o;
      const used=new Set(Object.values(map)); const free=[5,4,3,1,0,2].filter(c=>!used.has(c)); if(free.length<scratch.length) continue; scratch.forEach((c,i)=>map[c]=free[i]);
      out.push({name:`${b.name}(${ins.join(",")}→${o})`,ops:b.ops.map(([op,k])=>op==="W"?["W",map[k]]:[op]),brick:b.name}); }
    return out; }
  class Search{
    constructor(goal,shelf){ this.tokens=[...ATOMS]; for(const b of [...shelf].sort((x,y)=>x.ops.length-y.ops.length)){ const v=variants(b); if(this.tokens.length+v.length>240) continue; this.tokens.push(...v); } this.hold=goal.hold||[]; this.ex=goal.ex; this.N=this.ex.length; this.inner=[ROOT]; this.seen=new Set(); this.nid=0; this.ring=0; this.begin(); }
    begin(){ this.ring++; this.ci=0; this.outer=[]; this.tried=0; this.merged=0; this.broke=0; this.best=null; }
    step(ms){ const t0=performance.now(), ex=this.ex, N=this.N;
      while(this.ci<this.inner.length){ const c=this.inner[this.ci++];
        for(const t of this.tokens){ this.tried++; const ops=c.ops.concat(t.ops); const rs=[]; let bad=false;
          for(const e of ex){ const r=run(ops,e.mem); if(!r){bad=true;break} rs.push(r) }
          if(bad){ this.broke++; continue }
          const sig=rs.map(r=>r.m.join(",")+"|"+r.st.join(",")+"|"+r.A+r.P).join("/"); if(this.seen.has(sig)){ this.merged++; continue } this.seen.add(sig);
          let ok=0,b2=0,bn=0; rs.forEach((r,i)=>{ const w=ex[i].want; if(r.m[2]===w) ok++; b2+=bits(r.m[2],w); let bb=0; for(const v of r.m) bb=Math.max(bb,bits(v,w)); for(const v of r.st) bb=Math.max(bb,bits(v,w)); bn+=bb; });
          const node={id:++this.nid,prog:c.prog.concat([t]),ops,ok,b2,bn,parent:c,out:rs.map(r=>r.m[2])}; this.outer.push(node); if(ok===N&&!this.best&&this.hold.every(e=>{ const r=run(ops,e.mem); return r&&r.m[2]===e.want; })) this.best=node; }
        if(performance.now()-t0>ms) return null; }
      this.outer.sort((a,b)=>b.ok-a.ok||b.bn-a.bn||b.b2-a.b2||a.prog.length-b.prog.length); const kept=this.outer.slice(0,Math.max(1500,Math.floor(160000/this.tokens.length)));
      const res={ring:this.ring,tried:this.tried,merged:this.merged,broke:this.broke,kept,best:this.best,N};
      if(!this.best){ this.inner=kept; this.begin(); } return res; }
    get progress(){ return this.inner.length? this.ci/this.inner.length : 0 }
  }
  const NAMED=[
    ["העתק",1,(a)=>a,"תא 2 ← א"],["לא",1,(a)=>~a,"תא 2 ← לא א"],["לא-וגם",2,(a,b)=>~(a&b),"תא 2 ← לא-וגם(א, ב)"],["וגם",2,(a,b)=>a&b,"תא 2 ← וגם(א, ב)"],
    ["או",2,(a,b)=>a|b,"תא 2 ← או(א, ב)"],["לא-או",2,(a,b)=>~(a|b),"תא 2 ← לא-או(א, ב)"],["שונה",2,(a,b)=>a^b,"תא 2 ← שונה(א, ב)"],["שווה",2,(a,b)=>~(a^b),"תא 2 ← שווה(א, ב)"],
    ["א ולא ב",2,(a,b)=>a&~b,"תא 2 ← א וגם לא ב"],["קבוע 15",0,()=>15,"תא 2 ← 15"],["קבוע 0",0,()=>0,"תא 2 ← 0"],
    ["וגם-3",3,(a,b,c)=>a&b&c,"תא 2 ← וגם(א, ב, ג)"],["או-3",3,(a,b,c)=>a|b|c,"תא 2 ← או(א, ב, ג)"],["בחר",3,(a,b,c)=>(a&b)|(~a&c),"תא 2 ← אם א אז ב, אחרת ג"],
    ["רוב",3,(a,b,c)=>(a&b)|(a&c)|(b&c),"תא 2 ← הרוב מבין א, ב, ג"],["שונה-3",3,(a,b,c)=>a^b^c,"תא 2 ← שונה(א, ב, ג)"]];
  const insFor=(k)=>INS.slice(0,k);
  function table(tt){ return (a,b,c)=>{ let r=0; for(let i=0;i<4;i++){ const idx=(((a>>i)&1)<<2)|(((b>>i)&1)<<1)|((c>>i)&1); r|=((tt>>idx)&1)<<i; } return r; }; }
  // תור המשימות: קודם הרשימה, ואחר כך טבלאות אקראיות — בלי סוף. כל משימה ניתנת לשמירה כמפתח.
  let qi=0; const done=new Set();
  function fromKey(k){ if(k.n!=null){ const [name,ar,fn,rule]=NAMED[k.n]; return {key:k,name,ins:insFor(ar),fn,rule}; }
    const bitsS=k.t.toString(2).padStart(8,"0"); return {key:k,name:`טבלה ${k.t}`,ins:insFor(3),fn:table(k.t),rule:`תא 2 ← לפי הטבלה ${bitsS}`}; }
  function nextTask(){ if(qi<NAMED.length) return fromKey({n:qi++});
    for(;;){ const tt=1+rnd(254); if(done.has(tt)) continue; done.add(tt); return fromKey({t:tt}); } }
  const state=()=>({s,qi,done:[...done]}); const restore=(o)=>{ s=o.s; qi=o.qi; done.clear(); o.done.forEach(x=>done.add(x)); };
  return {ATOMS,examples,Search,nextTask,fromKey,state,restore,run,variants,dataOf};
}
