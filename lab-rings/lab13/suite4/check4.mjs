// Validator for suite4: fields, ranges, determinism, non-constant, dedup (identical or >0.8 agreement)
// vs every task in suite/, suite2/, suite3/, suite-smoke/, suite-numfail-dir/ and within suite4.
// num: compared on full input space, functions lifted to 3 args, all argument orders.
// list: 2000 seeded random lists of distinct values 8..15, length 0..8.
import fs from 'fs';
const B='/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad/';
const TH=0.8;
const OLD=['suite','suite2','suite3','suite-smoke','suite-numfail-dir'];
const load=d=>fs.readdirSync(B+d).filter(x=>x.endsWith('.json')).sort().flatMap(fn=>
  JSON.parse(fs.readFileSync(B+d+'/'+fn,'utf8')).tasks.map(t=>({t,where:d+'/'+fn})));
const old=OLD.flatMap(load), mine=load('suite4');
const isN=v=>Number.isInteger(v)&&v>=0&&v<=15;
let s=12345; const rnd=()=>(s=(s*1103515245+12345)&0x7fffffff)/0x80000000;
const LISTS=[[]]; while(LISTS.length<2000){ const n=Math.floor(rnd()*9), p=[8,9,10,11,12,13,14,15];
  for(let i=7;i>0;i--){ const j=Math.floor(rnd()*(i+1)); [p[i],p[j]]=[p[j],p[i]]; } LISTS.push(p.slice(0,n)); }
const A3=[]; for(let n=0;n<4096;n++) A3.push([n&15,(n>>4)&15,(n>>8)&15]);
const PERMS=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
const run=(f,x)=>{ try{ return JSON.stringify(f(...x)); }catch{ return 'ERR'; } };
const sigs=(o)=>{ const f=eval(o.t.src);
  if(o.t.kind==='num') return PERMS.map(p=>A3.map(a=>run(f,p.map(i=>a[i]))));
  return [LISTS.map(l=>run(f,[[...l]]))]; };
for(const o of old) o.S=sigs(o);
const agree=(a,b)=>{ let c=0; for(let i=0;i<a.length;i++) if(a[i]===b[i]) c++; return c/a.length; };
const names=new Set(old.map(o=>o.t.name)); let bad=0, maxA=0, maxW=''; const done=[]; const cnt={};
for(const o of mine){ const t=o.t, e=[];
  for(const k of ['name','kind','src','difficulty','note']) if(typeof t[k]!=='string'||!t[k]) e.push('missing '+k);
  if(!['easy','medium','hard'].includes(t.difficulty)) e.push('difficulty');
  if(names.has(t.name)) e.push('dup name'); names.add(t.name);
  const exp={'nums4.json':'num','agg4.json':'list2num','reorder4.json':'list2list'}[o.where.split('/')[1]];
  if(t.kind!==exp) e.push('kind');
  let f; try{ f=eval(t.src); if(typeof f!=='function') e.push('not fn'); }catch(x){ e.push('parse'); }
  const outs=new Set();
  if(!e.length){
    if(t.kind==='num'){ const ins=t.ins;
      if(!Array.isArray(ins)||!ins.length||ins.length>3||!ins.every(c=>[0,1,3].includes(c))||ins.some((c,i)=>i&&c<=ins[i-1])) e.push('ins');
      else if(f.length!==ins.length) e.push('arity');
      else { const k=ins.length; for(let n=0;n<16**k;n++){ const a=[n&15,(n>>4)&15,(n>>8)&15].slice(0,k); let v,w;
        try{ v=f(...a); w=f(...a); }catch{ e.push('throw '+a); break; }
        if(!isN(v)){ e.push('range '+v+' at '+a); break; } if(v!==w){ e.push('nondet'); break; } outs.add(v); } } }
    else for(const l of LISTS){ const c=[...l]; let v,w; try{ v=f(c); w=f([...l]); }catch{ e.push('throw '+l); break; }
      if(JSON.stringify(c)!==JSON.stringify(l)){ e.push('mutates input'); break; }
      if(t.kind==='list2num'){ if(!isN(v)){ e.push('range '+v+' at '+l); break; } }
      else { if(!Array.isArray(v)||v.some(x=>!l.includes(x))||new Set(v).size!==v.length){ e.push('not subset '+JSON.stringify(v)+' of '+l); break; } }
      if(JSON.stringify(v)!==JSON.stringify(w)){ e.push('nondet'); break; } outs.add(JSON.stringify(v)); }
    if(!e.length&&outs.size<2) e.push('constant');
  }
  let mx=0, mw='';
  if(!e.length){ o.S=sigs(o); const me=o.S[0];
    for(const q of [...old,...done]){ if(q.t.kind!==t.kind) continue;
      for(const qs of q.S){ const r=agree(me,qs); if(r>mx){ mx=r; mw=q.where+':'+q.t.name; } } }
    if(mx>TH) e.push(`agree ${mx.toFixed(3)} with ${mw}`); done.push(o);
    if(mx>maxA){ maxA=mx; maxW=t.name+' ~ '+mw; } }
  if(e.length){ bad++; console.log('FAIL',o.where,t.name,t.src,'::',e.join('; ')); }
  const key=o.where.split('/')[1]+' '+t.difficulty; cnt[key]=(cnt[key]||0)+1;
}
console.log(JSON.stringify(cnt,null,0));
console.log(`TOTAL ${mine.length} FAILED ${bad}; compared vs ${old.length} existing tasks; max agreement ${maxA.toFixed(3)} (${maxW})`);
