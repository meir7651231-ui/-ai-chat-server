// אבחון: בתוכנית שהחלק העליון שלה הוא «חבר(A,B)» — האם A או B כבר נבנים מאפס? ובאיזה מקום מדורגת השארית האמיתית?
import { basicBuild } from './tzoref-basic.mjs';
const sz=e=>e.c!=null?0:1+sz(e.a)+(e.b?sz(e.b):0);
function complexity(v){ const cnt=new Int32Array(16); for(const x of v) cnt[x]++; let d=0; for(const c of cnt) if(c) d++; let H=0; for(const c of cnt) if(c){ const p=c/v.length; H-=p*Math.log2(p); } return H*100+d; }
export function diag(e,tt,ev,show){ const tab=x=>{ const t=[]; for(let a=0;a<16;a++) for(let b=0;b<16;b++) t.push(ev(x,a,b)); return t; };
  if(e.o!=='ADD'){ console.log(`עליון ${e.o} · גודל ${sz(e)} · (לא חבר — מדלג)`); return; }
  const A=tab(e.a), B=tab(e.b); const ra=basicBuild(A,{ms:15000}), rb=basicBuild(B,{ms:15000});
  const rc=v=>{ let s=0; for(let a=0;a<16;a++){ let m=new Set(); for(let b=0;b<16;b++) m.add(v[a*16+b]); s+=m.size; } for(let b=0;b<16;b++){ let m=new Set(); for(let a=0;a<16;a++) m.add(v[a*16+b]); s+=m.size; } return s; };
  console.log(`שורות-עמודות: A=${rc(A)} B=${rc(B)} יעד=${rc(tt)}`); console.log(`חבר · גודל כולל ${sz(e)} · A גודל ${sz(e.a)} ${ra.expr?'✓נבנה':'✗'} · B גודל ${sz(e.b)} ${rb.expr?'✓נבנה':'✗'} · מורכבות-שארית A=${complexity(A).toFixed(0)} B=${complexity(B).toFixed(0)} · יעד=${complexity(tt).toFixed(0)}`); }

export function diag2(e,tt,ev){ if(e.o!=='ADD') return; const tab=x=>{ const t=[]; for(let a=0;a<16;a++) for(let b=0;b<16;b++) t.push(ev(x,a,b)); return t; };
  const A=tab(e.a), B=tab(e.b); const r=basicBuild(tt,{ms:20000,keepBank:true}); const key=v=>Array.from(v).join(',');
  const rc=v=>{ let s=0; for(let a=0;a<16;a++){ let m=new Set(); for(let b=0;b<16;b++) m.add(v[a*16+b]); s+=m.size; } for(let b=0;b<16;b++){ let m=new Set(); for(let a=0;a<16;a++) m.add(v[a*16+b]); s+=m.size; } return s; };
  const kA=key(A), kB=key(B); let inA=false, inB=false, total=0; const scores=[];
  for(const L of r.lev) for(const x of L||[]){ total++; const k=key(x.v); if(k===kA) inA=true; if(k===kB) inB=true; const res=x.v.map((v,i)=>(tt[i]-v)&15); scores.push(rc(res)); }
  scores.sort((a,b)=>a-b); const rank=(v)=>scores.findIndex(s=>s>=v);
  const t=Date.now(); const bB=basicBuild(B,{ms:3000}); const tB=Date.now()-t; const t2=Date.now(); const bA=basicBuild(A,{ms:3000}); const tA=Date.now()-t2;
  console.log(`מחסן ${total} · A במחסן ${inA} · B במחסן ${inB} · דירוג השארית B: ${rank(rc(B))} (ציון ${rc(B)}) · דירוג A: ${rank(rc(A))} · B נבנה ב-3 שנ׳: ${!!bB.expr} (${tB}ms) · A: ${!!bA.expr} (${tA}ms) · 40 הטובים: ${scores.slice(0,40).join(',')}`); }
