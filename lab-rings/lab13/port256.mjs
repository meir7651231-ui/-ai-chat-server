// העברת 256 הלבנים מהמכונה הקטנה (viz/core2) למכונה של lab13 — בלי לשנות אף פעולה, רק שם: W ⇒ WHERE. בדיקה על 16 תאים מלוכלכים.
import { run } from './machine2.mjs'; import fs from 'fs';
const st=JSON.parse(fs.readFileSync('../viz/core2-state.json','utf8')); let ok=0, bad=0, s=7; const R=(n)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%n; };
const out=[];
for(const b of st.eng.lib){ const prog=b.ops.map(([o,k])=>o==='W'?['WHERE',k]:[o]); let good=true;
  for(let t=0;t<500&&good;t++){ const a=R(16),bb=R(16),c=R(16); const mem=Array.from({length:16},()=>R(16)); mem[0]=a; mem[1]=bb; mem[3]=c;
    const r=run(prog,mem); let want=0; for(let bit=0;bit<4;bit++){ const idx=(((a>>bit)&1)<<2)|(((bb>>bit)&1)<<1)|((c>>bit)&1); want|=((b.tt>>idx)&1)<<bit; }
    if(!r||r.mem[2]!==want) good=false; }
  good?ok++:bad++; out.push({tt:b.tt,prog}); }
console.log('עובדות במכונה של lab13:',ok,'/ 256 · נכשלו',bad); fs.writeFileSync('logic256.json',JSON.stringify(out));
