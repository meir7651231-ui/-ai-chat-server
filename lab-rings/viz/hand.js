// "כתיבה ביד": מתכנת שיודע את השיטה — כל פונקציה כנוסחה של «לא-וגם» (החישוב היחיד במכונה), הנוסחה הכי זולה שיש (חיפוש מלא על הנוסחאות),
// ומתורגמת לתוכנית: עלה = «לאן k, לך, קח» (3), צומת = «חשב» (1), סוף = «לאן 2, לך, שים» (3).
const fs=require('fs'); const {makeEngine}=require('./core2.js'); const E=makeEngine(1);
E.restore(JSON.parse(fs.readFileSync('core2-state.json')).eng);
const cost=new Array(256).fill(1e9), how=new Array(256).fill(null);
[[240,0],[204,1],[170,3]].forEach(([t,k])=>{cost[t]=3;how[t]={leaf:k};});
for(let ch=true;ch;){ ch=false; for(let x=0;x<256;x++) if(cost[x]<1e9) for(let y=x;y<256;y++) if(cost[y]<1e9){ const t=(~(x&y))&255, c=cost[x]+cost[y]+1; if(c<cost[t]){cost[t]=c;how[t]={x,y};ch=true;} } }
function emit(t){ const h=how[t]; if(h.leaf!=null) return [["W",h.leaf],["GO"],["TAKE"]]; const a=emit(h.x), b=emit(h.y); return [...a,...b,["CALC"]]; }
let H=0,M=0,ok=0,fail=0,win=0,tie=0,lose=0; const rows=[];
for(let t=0;t<256;t++){ const p=[...emit(t),["W",2],["GO"],["PUT"]]; const good=E.ttOfOps(p)===t; good?ok++:fail++;
  const mine=E.lib.get(t).ops.length; H+=p.length; M+=mine; if(mine<p.length)win++; else if(mine===p.length)tie++; else lose++; rows.push([t,E.nameOf(t),p.length,mine,good]); }
console.log('ביד עובדות:',ok,'נכשלו (מחסנית):',fail); console.log('סך ביד',H,'· סך המנוע',M); console.log('המנוע קצר יותר:',win,'· שווה:',tie,'· ביד קצר יותר:',lose);
const sel=[240,15,192,252,63,3,60,195,150,232,202]; for(const r of rows.filter(r=>sel.includes(r[0]))) console.log(r[1].padEnd(12),'ביד',r[2],'· מנוע',r[3],r[4]?'':'(ביד נשבר)');
const st=JSON.parse(fs.readFileSync('core2-state.json')); let took=0, saved=0; const got=[];
for(let t=0;t<256;t++){ const p=[...emit(t),["W",2],["GO"],["PUT"]]; const cur=E.lib.get(t).ops.length; if(p.length<cur&&E.ttOfOps(p)===t){ const S=new E.Shrinker({tt:t,ops:p}); while(!S.done) S.step(1e9); if(E.offer(S.ops,'hand')){ took++; saved+=cur-S.ops.length; got.push(t); } } }
console.log('נלקחו מהכתיבה-ביד:',took,'· נחסכו',saved,'· סך עכשיו',[...E.lib.values()].reduce((a,b)=>a+b.ops.length,0));
fs.writeFileSync('core2-state.json',JSON.stringify({...st,eng:E.state()})); fs.writeFileSync('hand-got.json',JSON.stringify(got));
