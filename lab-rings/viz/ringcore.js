// מנוע העיגולים בקטן — אותו רעיון: עיגול פנימי = התוכניות שנשארו, עיגול חיצוני = כל אחת + פעולה אחת. שופט, איחוד, שמירת לבנה.
function makeEngine(seed){
  let s=seed||7; const rnd=(k)=>{s=(s*1103515245+12345)%2147483648;return Math.floor(s/2147483648*k)};
  const CELLS=4;
  const ATOMS=[...[0,1,2,3].map(k=>({name:`לאן ${k}`,ops:[["W",k]]})),{name:"לך",ops:[["GO"]]},{name:"קח",ops:[["TAKE"]]},{name:"שים",ops:[["PUT"]]},{name:"חשב",ops:[["CALC"]]}];
  function run(ops,mem0){const m=mem0.slice();let A=0,P=0;const st=[];for(const [o,k] of ops){if(o==="W")A=k;else if(o==="GO")P=A;else if(o==="TAKE"){if(st.length>=4)return null;st.push(m[P])}else if(o==="PUT"){if(!st.length)return null;m[P]=st.pop()}else if(o==="CALC"){if(st.length<2)return null;const b=st.pop(),a=st.pop();st.push(~(a&b)&15)}}return {m,st,A,P}}
  function examples(fn,n=10){const ex=[];for(let i=0;i<n;i++){const m=[rnd(16),rnd(16),rnd(16),rnd(16)];ex.push({mem:m,want:fn(m[0],m[1])})}return ex}
  // לבנה שנלמדה ⇒ גרסאות על תאים אחרים (הקלט והפלט עוברים לתאים 0..3)
  function variants(b){const out=[];const cells=[0,1,2,3];const pick=(n,pre=[])=>pre.length===n?[pre]:cells.filter(c=>!pre.includes(c)).flatMap(c=>pick(n,[...pre,c]));
    for(const ins of pick(b.ins.length))for(const o of cells){const map={};b.ins.forEach((a,i)=>map[a]=ins[i]);if(map[2]!=null&&map[2]!==o)continue;map[2]=o;
      const ops=b.ops.map(([op,k])=>op==="W"?["W",map[k]??k]:[op]);out.push({name:`${b.name}(${ins.join(",")}→${o})`,ops,brick:b.name})}return out}
  function* search(goal,shelf,{maxRings=14,keep=3000}={}){
    const tokens=[...ATOMS,...shelf.flatMap(variants)];const ex=goal.ex,N=ex.length;
    let inner=[{prog:[],ops:[],st:ex.map(e=>({m:e.mem.slice(),st:[],A:0,P:0}))}];const seen=new Set();
    for(let ring=1;ring<=maxRings;ring++){const outer=[];let tried=0,merged=0,broke=0,best=null;
      for(const c of inner)for(const t of tokens){tried++;const ops=[...c.ops,...t.ops];const rs=[];let bad=false;
        for(const e of ex){const r=run(ops,e.mem);if(!r){bad=true;break}rs.push(r)}
        if(bad){broke++;continue}
        const sig=rs.map(r=>r.m.join(",")+"|"+r.st.join(",")+"|"+r.A+r.P).join("/");if(seen.has(sig)){merged++;continue}seen.add(sig);
        const ok=rs.filter((r,i)=>r.m[2]===ex[i].want).length;const near=rs.filter((r,i)=>r.m.includes(ex[i].want)||r.st.includes(ex[i].want)).length;
        const node={prog:[...c.prog,t],ops,ok,near,parent:c};outer.push(node);if(ok===N&&!best)best=node}
      outer.sort((a,b)=>b.ok-a.ok||b.near-a.near);const kept=outer.slice(0,keep);
      yield {ring,tried,merged,broke,outer,kept,best,N};if(best)return;inner=kept}
  }
  return {ATOMS,examples,variants,search,run};
}
if(typeof module!=="undefined")module.exports={makeEngine};
