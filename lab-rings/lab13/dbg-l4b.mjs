import { valueBuild, show } from './tzoref-value.mjs';
const R=k=>Math.floor(Math.random()*k); const mn=Math.min, mx=Math.max, m=x=>((x%16)+16)%16;
const e=(a,b,c)=>(c>=mn(a,b)&&c<=mx(a,b))?m(Math.abs(a-b)+c):0; const f=(a,b,c)=>m(mx(m(a+b),c)-((mx(a,b,c)+mn(a,b,c))>>1));
const d=(a,b,c)=>m(e(a,b,c)-f(a,b,c)); const G={d:(a,b,c)=>d(a,b,c),d2:(a,b,c)=>m(d(a,b,c)*2),full:(a,b,c)=>m(d(a,b,c)*2+c)}; const g=G[process.env.WHICH||'full']; const ins=[0,1,3];
const gen=()=>{ const mem=Array.from({length:16},()=>R(16)); const w=g(mem[0],mem[1],mem[3]); const k=ins.map(c=>mem[c]); return {mem,want:w,ok:r=>r[2]===w&&ins.every((c,i)=>r[c]===k[i])}; };
const v=valueBuild(gen,{name:'x',ins,out:2,ms:+process.env.VMS||90000,maxSize:+process.env.MS||5,maxBank:+process.env.MB||3000000}); console.log(v.prog?'✓ '+v.prog.length:'✗', v.why||'', v.expr?show(v.expr):'', 'made',v.made,'ms',v.ms); process.exit(0);
