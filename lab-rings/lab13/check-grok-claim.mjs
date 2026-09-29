// בדיקת הטענה של Grok: האם התוכנית תלויה בתוכן תא 3? כל ערך של תא 3 (0–15), כל שאר הזבל, כל A/P, עם ובלי ערבוב.
import fs from 'fs'; import { run } from './machine2.mjs';
const src=fs.readFileSync('grok55.txt','utf8'); const parts=src.split(/\n/).map(x=>x.trim()).filter(Boolean); const labels={}, raw=[];
for(let p of parts){ const m=p.match(/^(\w+):\s*(.*)$/); if(m){ labels[m[1]]=raw.length; p=m[2]; } if(p) raw.push(p); }
const prog=raw.map(p=>{ const [op,a]=p.split(/\s+/); if(op==='WHERE@') return ['WHERE@']; if(op==='WHERE') return a.startsWith('@')?['WHERE',labels[a.slice(1)],'c']:['WHERE',+a]; return [op]; });
const lists=[[15,8],[14,13,12,8],[12,8,15,9],[8],[],[15,14,13,12,11,10,9,8],[8,9,10,11,12,13,14,15]];
let n=0,bad=0;
for(const l of lists) for(let c3=0;c3<16;c3++) for(let pa=0;pa<16;pa++) for(let aa=0;aa<16;aa++) for(const sc of [0,7,12345]){
  const m=new Array(16).fill(0); m[1]=l[0]||0; l.forEach((x,i)=>{ m[x]=l[i+1]||0; }); for(const c of [2,4,5,6,7,0]) m[c]=(c*5+pa+aa)&15; m[3]=c3; if(true) m[0]=(pa*3+aa)&15;
  const before=m.slice(); const q=[['WHERE',pa],['GO'],['WHERE',aa],...prog.map(([o,k,c])=>o==='WHERE'?['WHERE',c?k+3:k]:[o])]; n++;
  const r=run(q,m,{maxSteps:20000,scramble:sc}); const want=l.length?Math.max(...l):0;
  if(!r||r.st.length||r.mem[2]!==want||[0,1,8,9,10,11,12,13,14,15].some(c=>r.mem[c]!==before[c])){ bad++; if(bad<4) console.log('נכשל:',JSON.stringify(l),'תא3=',c3); } }
console.log(`רשימות שGrok הזכיר + קצוות · כל 16 ערכי תא 3 · כל A/P · 3 סוגי ערבוב: ${n-bad}/${n} עברו`);
