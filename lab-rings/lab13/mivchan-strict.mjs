// בודק למבחן «הגדול ברשימה»: node mivchan.mjs תשובה.txt
// התוכנית בקובץ: פקודה בכל שורה (או מופרדות ב-;). אפשר תוויות: "L:" ולקפוץ אליהן: "WHERE @L".
// פקודות: WHERE k · WHERE@ · GO · TAKE · PUT · CALC · ADD · JUMP  (או בעברית: לאן k · לאן@ · לך · קח · שים · חשב · חבר · קפוץ)
import fs from 'fs'; import { run } from './machine2s.mjs';
const HE={'לאן':'WHERE','לאן@':'WHERE@','לך':'GO','קח':'TAKE','שים':'PUT','חשב':'CALC','חבר':'ADD','קפוץ':'JUMP'};
const src=fs.readFileSync(process.argv[2],'utf8').replace(/\/\/.*$/gm,'');
const parts=src.split(/[;\n]/).map(x=>x.trim()).filter(Boolean); const labels={}, raw=[];
for(let p of parts){ const m=p.match(/^([\w֐-׿]+):\s*(.*)$/); if(m){ labels[m[1]]=raw.length; p=m[2]; } if(p) raw.push(p); }
const prog=raw.map(p=>{ let [op,a]=p.split(/\s+/); op=HE[op]||op.toUpperCase(); if(op==='WHERE'&&a==='@') return ['WHERE@']; if(op==='WHERE'){ if(a.startsWith('@')){ if(!(a.slice(1) in labels)) throw new Error('תווית לא ידועה '+a); return ['WHERE',labels[a.slice(1)],'code']; } return ['WHERE',+a]; } if(!['WHERE@','GO','TAKE','PUT','CALC','ADD','JUMP'].includes(op)) throw new Error('פקודה לא מוכרת: '+p); return [op]; });
let s=12345; const R=(n)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%n; };
const shuf=()=>{ const q=[8,9,10,11,12,13,14,15]; for(let i=7;i>0;i--){ const j=R(i+1); [q[i],q[j]]=[q[j],q[i]]; } return q; };
const KEEP=[0,1,8,9,10,11,12,13,14,15]; let bad=0, n=0, first=null;
for(let pa=0;pa<16;pa++) for(let aa=0;aa<16;aa++) for(let t=0;t<20;t++){ const m=new Array(16).fill(0); const l=shuf().slice(0,R(9)); m[1]=l[0]||0; l.forEach((x,i)=>{ m[x]=l[i+1]||0; });
  const mem=m.map((v,k)=>KEEP.includes(k)?v:R(16)); const want=l.length?Math.max(...l):0; const sc=t%2?1+R(1e5):0;
  const q=[['WHERE',pa],['GO'],['WHERE',aa],...prog.map(([o,k,c])=>o==='WHERE'?['WHERE',c?k+3:k]:[o])]; n++;
  const r=run(q,mem,{maxSteps:20000,scramble:sc}); const why=!r?'לא הסתיימה / מחסנית ריקה':r.st.length?'נשאר משהו במחסנית':r.mem[2]!==want?`תשובה ${r.mem[2]} במקום ${want}`:KEEP.some(c=>r.mem[c]!==mem[c])?'שינתה תא שאסור לשנות':null;
  if(why){ bad++; if(!first) first=`רשימה [${l.join(',')}], לאן=${aa} איפה=${pa}: ${why}`; } }
console.log(`אורך: ${prog.length} פקודות · עברו ${n-bad}/${n}`); console.log(bad?`✗ נכשלה. דוגמה: ${first}`:`✓ עוברת הכל. (שלי ביד: 74 · המנוע: 53)`);
