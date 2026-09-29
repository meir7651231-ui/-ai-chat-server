// בנייה מחדש: לכל אחת מ-256 — מנסים כל חיבור של שתי טבלאות ידועות (עכשיו קצרות). נכנס רק אם יותר קצר ועובר 240 בדיקות. אחר כך מקצר. חוזר עד שאין שיפור.
const fs=require('fs'); const {makeEngine}=require('./core2.js'); const E=makeEngine(123);
const st=JSON.parse(fs.readFileSync('core2-state.json','utf8')); E.restore(st.eng);
const dataOf=(ops)=>[...new Set(ops.filter(x=>x[0]==='W').map(x=>x[1]))];
function place(b,inCells,out,avoid){ const map={}; b.ins.forEach((c,i)=>map[c]=inCells[i]); map[2]=out;
  const scratch=dataOf(b.ops).filter(c=>!b.ins.includes(c)&&c!==2); const used=new Set([...Object.values(map),...avoid]);
  const free=[6,7,5,2,0,1,3,4].filter(c=>!used.has(c)); if(free.length<scratch.length) return null; scratch.forEach((c,i)=>map[c]=free[i]);
  return b.ops.map(([op,k])=>op==='W'?['W',map[k]]:[op]); }
const bit2=(O,x,y)=>(O.tt>>((x<<2)|(y<<1)))&1;
const apply2=(O,g,h)=>{ let t=0; for(let i=0;i<8;i++) t|=bit2(O,(g>>i)&1,(h>>i)&1)<<i; return t; };
const apply1=(O,g)=>{ let t=0; for(let i=0;i<8;i++) t|=((O.tt>>(((g>>i)&1)<<2))&1)<<i; return t; };
const tot=()=>[...E.lib.values()].reduce((a,b)=>a+b.ops.length,0);
console.log('התחלה:',tot());
for(let round=1;round<=6;round++){
  const lib=[...E.lib.values()]; const ops2=lib.filter(b=>b.ins.length===2&&b.ins[0]===0&&b.ins[1]===1); const ops1=lib.filter(b=>b.ins.length===1&&b.ins[0]===0);
  const operands=[{tt:240,cell:0,ops:[]},{tt:204,cell:1,ops:[]},{tt:170,cell:3,ops:[]},...lib];
  // לכל טבלה-יעד: כל הזוגות שנותנים אותה, מהקצר לארוך
  const cands=new Map();
  for(const O of ops1) for(const g of lib){ const T=apply1(O,g.tt); (cands.get(T)||cands.set(T,[]).get(T)).push({k:1,O,g,est:O.ops.length+g.ops.length}); }
  for(const O of ops2) for(const g of operands) for(const h of operands){ const T=apply2(O,g.tt,h.tt); (cands.get(T)||cands.set(T,[]).get(T)).push({k:2,O,g,h,est:O.ops.length+g.ops.length+h.ops.length}); }
  let comp=0;
  for(let T=0;T<256;T++){ const cur=E.lib.get(T).ops.length; const list=(cands.get(T)||[]).filter(c=>c.est<cur).sort((a,b)=>a.est-b.est).slice(0,400);
    for(const c of list){ if(c.est>=E.lib.get(T).ops.length) break; let prog=null;
      if(c.k===1){ const pg=place(c.g,c.g.ins,4,[]), po=pg&&place(c.O,[4],2,[]); if(po) prog=[...pg,...po]; }
      else for(const [A,B] of [[c.g,c.h],[c.h,c.g]]){ const ca=A.cell??4, cb=B.cell??5; const needB=B.cell!=null?[B.cell]:B.ins;
        const pa=A.cell!=null?[]:place(A,A.ins,ca,[...needB]); if(!pa) continue; const pb=B.cell!=null?[]:place(B,B.ins,cb,[ca]); if(!pb) continue;
        const po=place(c.O,A===c.g?[ca,cb]:[cb,ca],2,[]); if(!po) continue; prog=[...pa,...pb,...po]; if(E.ttOfOps(prog)===T) break; prog=null; }
      if(prog&&E.offer(prog,'compose')){ comp++; break; } } }
  const afterComp=tot(); let sh=0;
  for(const b of [...E.lib.values()]){ const S=new E.Shrinker(b); while(!S.done) S.step(1e9); if(S.ops.length<b.ops.length&&E.offer(S.ops,'shrink')) sh++; }
  console.log(`סיבוב ${round}: ${comp} נבנו מחדש קצר יותר (סה"כ ${afterComp}) · ${sh} קוצרו אחר כך (סה"כ ${tot()})`);
  if(!comp&&!sh) break; }
fs.writeFileSync('core2-state.json',JSON.stringify({...st,eng:E.state()}));
fs.rmSync('outbox5',{recursive:true,force:true}); fs.mkdirSync('outbox5');
const L=[...E.lib.values()].map(b=>b.ops.length).sort((a,b)=>a-b);
for(const b of E.lib.values()) fs.writeFileSync(`outbox5/t${b.tt}.json`,JSON.stringify({name:b.name,tt:b.tt,ops:b.ops,len:b.ops.length,src:'server',at:new Date().toISOString()}));
console.log('min',L[0],'median',L[128],'max',L[255],'total',tot());
