// Validator for suite7 (modeled on suite6/check6.mjs): fields, ranges, determinism, non-constant,
// no input mutation, list outputs valid for the encoding (distinct values taken from the input list),
// task counts and difficulty mix equal to suite6, and dedup (identical or >0.8 agreement)
// vs every task in suite/, suite2/ ... suite6/, suite-smoke/, suite-numfail-dir/ and within suite7.
// num: compared on full input space, functions lifted to 3 args, all argument orders.
// list: 2000 seeded random lists of distinct values 8..15, length 0..8.
// As in check6: list tasks are also validated (range, subset, mutation, determinism) on EVERY
// possible input list (all 109601 ordered selections of distinct values 8..15, length 0..8).
import fs from 'fs';
const B='/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad/';
const TH=0.8;
const OLD=['suite','suite2','suite3','suite4','suite5','suite6','suite-smoke','suite-numfail-dir'];
const FILES={'nums7.json':'num','agg7.json':'list2num','reorder7.json':'list2list'};
const REF={'nums7.json':'nums6.json','agg7.json':'agg6.json','reorder7.json':'reorder6.json'};
const load=d=>fs.readdirSync(B+d).filter(x=>x.endsWith('.json')).sort().flatMap(fn=>{
  const j=JSON.parse(fs.readFileSync(B+d+'/'+fn,'utf8'));
  return Array.isArray(j.tasks)?j.tasks.map(t=>({t,where:d+'/'+fn})):[]; });
const old=OLD.flatMap(load), mine=load('suite7');
const isN=v=>Number.isInteger(v)&&v>=0&&v<=15;
let s=67890; const rnd=()=>(s=(s*1103515245+12345)&0x7fffffff)/0x80000000;
const LISTS=[[]]; while(LISTS.length<2000){ const n=Math.floor(rnd()*9), p=[8,9,10,11,12,13,14,15];
  for(let i=7;i>0;i--){ const j=Math.floor(rnd()*(i+1)); [p[i],p[j]]=[p[j],p[i]]; } LISTS.push(p.slice(0,n)); }
// every length 0..8 must be present in the sample
for(let n=0;n<=8;n++) if(!LISTS.some(l=>l.length===n)) throw new Error('sample misses length '+n);
// all possible input lists
const ALL=[]; (function gen(cur,used){ ALL.push([...cur]); if(cur.length===8) return;
  for(let v=8;v<=15;v++) if(!used[v]){ used[v]=1; cur.push(v); gen(cur,used); cur.pop(); used[v]=0; } })([],[]);
if(ALL.length!==109601) throw new Error('enumeration size '+ALL.length);
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
  if(/[֐-׿]/.test(t.note||'')) e.push('note not English');
  if(!/[֐-׿]/.test(t.name||'')) e.push('name not Hebrew');
  if(names.has(t.name)) e.push('dup name'); names.add(t.name);
  const exp=FILES[o.where.split('/')[1]];
  if(t.kind!==exp) e.push('kind');
  if(t.kind!=='num'&&'ins' in t) e.push('ins on list task');
  let f; try{ f=eval(t.src); if(typeof f!=='function') e.push('not fn'); }catch(x){ e.push('parse'); }
  const outs=new Set();
  if(!e.length){
    if(t.kind==='num'){ const ins=t.ins;
      if(!Array.isArray(ins)||!ins.length||ins.length>3||!ins.every(c=>[0,1,3].includes(c))||ins.some((c,i)=>i&&c<=ins[i-1])) e.push('ins');
      else if(f.length!==ins.length) e.push('arity');
      else { const k=ins.length; for(let n=0;n<16**k;n++){ const a=[n&15,(n>>4)&15,(n>>8)&15].slice(0,k); let v,w;
        try{ v=f(...a); w=f(...a); }catch{ e.push('throw '+a); break; }
        if(!isN(v)){ e.push('range '+v+' at '+a); break; } if(v!==w){ e.push('nondet'); break; } outs.add(v); } } }
    else { if(f.length!==1) e.push('arity');
      for(const l of ALL){ const c=[...l]; let v,w; try{ v=f(c); w=f([...l]); }catch{ e.push('throw '+l); break; }
      if(JSON.stringify(c)!==JSON.stringify(l)){ e.push('mutates input'); break; }
      if(t.kind==='list2num'){ if(!isN(v)){ e.push('range '+v+' at '+l); break; } }
      else { if(!Array.isArray(v)||v.some(x=>!Number.isInteger(x)||x<8||x>15||!l.includes(x))||new Set(v).size!==v.length){ e.push('not subset '+JSON.stringify(v)+' of '+l); break; } }
      if(JSON.stringify(v)!==JSON.stringify(w)){ e.push('nondet'); break; } outs.add(JSON.stringify(v)); } }
    if(!e.length&&outs.size<2) e.push('constant');
  }
  let mx=0, mw='';
  if(!e.length){ o.S=sigs(o); const me=o.S[0];
    for(const q of [...old,...done]){ if(q.t.kind!==t.kind) continue;
      for(const qs of q.S){ const r=agree(me,qs); if(r>mx){ mx=r; mw=q.where+':'+q.t.name; } } }
    if(mx>TH) e.push(`agree ${mx.toFixed(3)} with ${mw}`); done.push(o);
    if(mx>maxA){ maxA=mx; maxW=t.name+' ~ '+mw; } }
  if(process.env.VERBOSE) console.log(mx.toFixed(3),o.where,t.name,'~',mw);
  if(e.length){ bad++; console.log('FAIL',o.where,t.name,t.src,'::',e.join('; ')); }
  const key=o.where.split('/')[1]+' '+t.difficulty; cnt[key]=(cnt[key]||0)+1;
}
// suite7 must hold exactly these three .json files (the runner loads every .json in the directory)
{ const js=fs.readdirSync(B+'suite7').filter(x=>x.endsWith('.json')).sort(), want=Object.keys(FILES).sort();
  if(JSON.stringify(js)!==JSON.stringify(want)){ bad++; console.log('FAIL json files in suite7:',js.join(' '),'(want',want.join(' ')+')'); } }
// counts and difficulty mix must equal suite6's
for(const [f7,f6] of Object.entries(REF)){
  const ref=JSON.parse(fs.readFileSync(B+'suite6/'+f6,'utf8')).tasks;
  if(!fs.existsSync(B+'suite7/'+f7)){ bad++; console.log('FAIL missing',f7); continue; }
  for(const d of ['easy','medium','hard']){ const want=ref.filter(t=>t.difficulty===d).length, got=cnt[f7+' '+d]||0;
    if(want!==got){ bad++; console.log(`FAIL mix ${f7} ${d}: ${got} (suite6 ${f6} has ${want})`); } } }
console.log(JSON.stringify(cnt,null,0));
console.log(`TOTAL ${mine.length} FAILED ${bad}; compared vs ${old.length} existing tasks; max agreement ${maxA.toFixed(3)} (${maxW})`);
process.exit(bad?1:0);
