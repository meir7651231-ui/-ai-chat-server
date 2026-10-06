import { encode, runCode, MEM } from './machine3f.mjs'; import { W, H, alloc, MEMO } from './machine3w.mjs';
const R=k=>Math.floor(Math.random()*k); const OPS=['WHERE','WHERE@','GO','JUMP','TAKE','PUT','ADD','SHR','CALC'];
const OPN={WHERE:0,'WHERE@':1,GO:2,JUMP:3,TAKE:4,PUT:5,ADD:6,SHR:7,CALC:8};
const pO=alloc(512), pA=alloc(512), pM=alloc(16); let dis=0, n=0;
for(let t=0;t<1000000;t++){ const L=3+R(25); const p=[]; for(let i=0;i<L;i++){ const o=OPS[R(9)]; p.push(o==='WHERE'?(R(4)?['WHERE',R(16)]:['WHERE',R(L),'code']):[o]); }
  const code=encode(p); const mem=Array.from({length:16},()=>R(16)); const pa=R(16), aa=R(16), sc=R(2)?0:1+R(1e6);
  const r1=runCode(code,pa,aa,mem,2000,sc); const m1=Array.from(MEM);
  for(let i=0;i<code.n;i++){ H[(pO>>2)+i]=code.ops[i]; H[(pA>>2)+i]=code.args[i]; } for(let i=0;i<16;i++) H[(pM>>2)+i]=mem[i];
  const r2=W.runone(pO,pA,code.n,pa,aa,pM,2000,sc); n++;
  if(r1!==r2||(r1>0&&m1.some((v,i)=>v!==H[MEMO+i]))){ dis++; if(dis<4) console.log('שונה',r1,r2,JSON.stringify(p)); } }
console.log('ריצות',n,'· אי-הסכמות',dis); process.exit(0);
