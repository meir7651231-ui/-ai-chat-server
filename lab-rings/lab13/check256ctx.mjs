import { run } from './machine2.mjs'; import fs from 'fs';
const L=JSON.parse(fs.readFileSync('logic256.json','utf8')); let s=3; const R=(n)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%n; };
let ok=0, bad=0, extra=0;
for(const b of L){ let good=true; for(let t=0;t<300&&good;t++){ const a=R(16),bb=R(16),c=R(16); const mem=Array.from({length:16},()=>R(16)); mem[0]=a; mem[1]=bb; mem[3]=c;
    const q=[['WHERE',R(16)],['GO'],['WHERE',R(16)],...b.prog]; const r=run(q,mem); let w=0; for(let k=0;k<4;k++){ const idx=(((a>>k)&1)<<2)|(((bb>>k)&1)<<1)|((c>>k)&1); w|=((b.tt>>idx)&1)<<k; } if(!r||r.mem[2]!==w) good=false; }
  if(good) ok++; else { bad++; const p2=[['WHERE',0],['GO'],...b.prog]; extra+=2; } }
console.log('עובדות גם באמצע תוכנית:',ok,'· תלויות בהתחלה מ-0:',bad);
