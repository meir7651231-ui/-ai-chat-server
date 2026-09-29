// בנייה מחלקים: טבלה חסרה = חיבור(טבלה ידועה, טבלה ידועה). החיפוש הוא על 8 ביטים בלבד — לא על תוכניות.
// מה שנמצא — מורכב לתוכנית מהלבנים עצמן, ונבדק על 240 זיכרונות (עם תאים מלוכלכים) לפני שנכנס.
const fs=require('fs'); const {makeEngine}=require('./core2.js'); const E=makeEngine(99);
const o=JSON.parse(fs.readFileSync('core2-state.json','utf8')); E.restore(o.eng);
for(const dir of ['dbread3/bricks']) if(fs.existsSync(dir)) for(const f of fs.readdirSync(dir)){ const d=JSON.parse(fs.readFileSync(dir+'/'+f,'utf8')); const b=d.data||d; if(Array.isArray(b.ops)) E.offer(b.ops,'shared'); }
const start=E.lib.size; console.log('התחלה:',start,'/256');
const INPUTS=[0,1,3], dataOf=(ops)=>[...new Set(ops.filter(x=>x[0]==='W').map(x=>x[1]))];
// מפה לבנה לתאים: קלטים ⇒ inCells, פלט (תא 2 שלה) ⇒ out, תאי-עבודה שלה ⇒ תאים שמותר ללכלך
function place(b,inCells,out,avoid){ const map={}; b.ins.forEach((c,i)=>map[c]=inCells[i]); map[2]=out;
  const scratch=dataOf(b.ops).filter(c=>!b.ins.includes(c)&&c!==2); const used=new Set([...Object.values(map),...avoid]);
  const free=[6,7,5,2,0,1,3,4].filter(c=>!used.has(c)); if(free.length<scratch.length) return null; scratch.forEach((c,i)=>map[c]=free[i]);
  return b.ops.map(([op,k])=>op==='W'?['W',map[k]]:[op]); }
// הפעולה O כפונקציה של שני ביטים (מתוך הטבלה שלה, כשהיא תלויה רק ב-א,ב)
const bit2=(O,x,y)=>(O.tt>>((x<<2)|(y<<1)))&1;
const apply2=(O,g,h)=>{ let t=0; for(let i=0;i<8;i++) t|=bit2(O,(g>>i)&1,(h>>i)&1)<<i; return t; };
const apply1=(O,g)=>{ let t=0; for(let i=0;i<8;i++) t|=((O.tt>>(((g>>i)&1)<<2))&1)<<i; return t; };
let rounds=0, added=0;
for(;;){ rounds++; const lib=[...E.lib.values()]; const ops2=lib.filter(b=>b.ins.length===2&&b.ins[0]===0&&b.ins[1]===1); const ops1=lib.filter(b=>b.ins.length===1&&b.ins[0]===0);
  const RAW=[{tt:240,cell:0},{tt:204,cell:1},{tt:170,cell:3}];
  const operands=[...RAW,...lib];
  const missing=[]; for(let t=0;t<256;t++) if(!E.lib.has(t)) missing.push(t); if(!missing.length) break;
  let gained=0;
  for(const T of missing){ if(E.lib.has(T)) continue; let done=false;
    // חד-מקומי: T = O(g)
    for(const O of ops1){ if(done) break; for(const g of lib){ if(apply1(O,g.tt)!==T) continue;
      const pg=place(g,g.ins,4,[]); if(!pg) continue; const po=place(O,[4],2,[]); if(!po) continue;
      if(E.offer([...pg,...po],'compose')){ done=true; break; } } }
    // דו-מקומי: T = O(g,h). g,h = טבלה ידועה (מחושבת לתא 4/5) או קלט גולמי (כבר יושב בתא 0/1/3)
    for(const O of ops2){ if(done) break; for(const g of operands){ if(done) break; for(const h of operands){ if(apply2(O,g.tt,h.tt)!==T) continue;
      for(const [A,B] of [[g,h],[h,g]]){
        const ca=A.cell??4, cb=B.cell??5; const needB=B.cell!=null?[B.cell]:B.ins;
        const pa=A.cell!=null?[]:place(A,A.ins,ca,[...needB]); if(!pa) continue;
        const pb=B.cell!=null?[]:place(B,B.ins,cb,[ca]); if(!pb) continue;
        const po=place(O,A===g?[ca,cb]:[cb,ca],2,[]); if(!po) continue;
        if(E.offer([...pa,...pb,...po],'compose')){ done=true; break; } }
      if(done) break; } } }
    if(done){ gained++; added++; } }
  console.log(`סיבוב ${rounds}: נוספו ${gained} · ממופות ${E.lib.size}/256`); if(!gained) break; }
fs.writeFileSync('compose-lib.json',JSON.stringify([...E.lib.values()].map(({tt,name,ops,src})=>({tt,name,ops,src}))));
const miss=[]; for(let t=0;t<256;t++) if(!E.lib.has(t)) miss.push(t); console.log('נשארו:',miss.length, miss.join(' '));
