// Dedup for suite6 (modeled on suite5/dedup5.mjs). Three checks against suite/, suite2/, suite3/, suite4/, suite5/
// (plus suite-smoke/, suite-numfail-dir/) and within suite6:
// 1. names: every task name is new.
// 2. sources: every source is new up to renaming variables and trivial syntax
//    (whitespace, let/const/var, ===/==, !==/!=, ';' before '}').
//    Sources one token edit away from an older source are printed as a warning only.
// 3. behaviour: outputs must differ from every older task of the same kind.
//    num: full input space, functions lifted to 3 args, all 6 argument orders.
//    list: 4500 random lists of distinct values 8..15 (500 per length 0..8, a seed independent of check6).
//    FAIL when the outputs are identical, or agree on more than 80% of the inputs.
import fs from 'fs';
const B='/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad/';
const OLD=['suite','suite2','suite3','suite4','suite5','suite-smoke','suite-numfail-dir'];
const TH=0.8;
const load=d=>fs.readdirSync(B+d).filter(x=>x.endsWith('.json')).sort().flatMap(fn=>{
  const j=JSON.parse(fs.readFileSync(B+d+'/'+fn,'utf8'));
  return Array.isArray(j.tasks)?j.tasks.map(t=>({t,where:d+'/'+fn})):[]; });
const KEEP=new Set(['let','const','var','return','for','of','in','if','else','while','do','break','continue','new','true','false',
  'null','undefined','function','typeof','Math','Set','Map','Array','Number','JSON','Infinity','NaN','String','Object']);
const TOK=/\s+|(\d+(?:\.\d+)?)|([A-Za-z_$][\w$]*)|('(?:\\.|[^'])*'|"(?:\\.|[^"])*")|(===|!==|=>|\.\.\.|\?\?|&&|\|\||[<>=!]=|<<|>>>|>>|\+\+|--|[-+*\/%&|^~!<>=?:;,.(){}\[\]])/y;
function tokens(src){ const out=[]; TOK.lastIndex=0; let m;
  while(TOK.lastIndex<src.length){ const at=TOK.lastIndex; m=TOK.exec(src); if(!m||TOK.lastIndex===at) throw new Error('tokenize at '+at+': '+src);
    if(m[0].trim()==='') continue; out.push(m[0]); }
  return out; }
function normalize(src){ const t=tokens(src), map=new Map(), r=[];
  for(let i=0;i<t.length;i++){ let x=t[i];
    if(/^[A-Za-z_$]/.test(x)&&!KEEP.has(x)&&t[i-1]!=='.'){ if(!map.has(x)) map.set(x,'v'+map.size); x=map.get(x); }
    if(x==='const'||x==='var') x='let';
    if(x==='===') x='=='; if(x==='!==') x='!=';
    if(x===';'&&t[i+1]==='}') continue;
    r.push(x); }
  return r; }
const ed=(a,b)=>{ if(Math.abs(a.length-b.length)>1) return 2; const d=Array.from({length:a.length+1},(_,i)=>[i]);
  for(let j=1;j<=b.length;j++) d[0][j]=j;
  for(let i=1;i<=a.length;i++) for(let j=1;j<=b.length;j++) d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  return d[a.length][b.length]; };
// behaviour signatures
let s=987654321; const rnd=()=>(s=(s*1103515245+12345)&0x7fffffff)/0x80000000;
const LISTS=[]; for(let n=0;n<=8;n++) for(let k=0;k<500;k++){ const p=[8,9,10,11,12,13,14,15];
  for(let i=7;i>0;i--){ const j=Math.floor(rnd()*(i+1)); [p[i],p[j]]=[p[j],p[i]]; } LISTS.push(p.slice(0,n)); }
const A3=[]; for(let n=0;n<4096;n++) A3.push([n&15,(n>>4)&15,(n>>8)&15]);
const PERMS=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
const run=(f,x)=>{ try{ return JSON.stringify(f(...x)); }catch{ return 'ERR'; } };
const sigs=t=>{ const f=eval(t.src);
  if(t.kind==='num') return PERMS.map(p=>A3.map(a=>run(f,p.map(i=>a[i]))));
  return [LISTS.map(l=>run(f,[[...l]]))]; };
const agree=(a,b)=>{ let c=0; for(let i=0;i<a.length;i++) if(a[i]===b[i]) c++; return c/a.length; };

const old=OLD.flatMap(load), mine=load('suite6');
for(const o of [...old,...mine]){ o.N=normalize(o.t.src); o.K=o.N.join(' '); o.S=sigs(o.t); }
const byKey=new Map(), byName=new Map(); const seen=[...old];
for(const o of old){ byKey.set(o.K,o); byName.set(o.t.name,o); }
let bad=0, warn=0, maxA=0, maxW='';
for(const o of mine){ const t=o.t;
  if(byName.has(t.name)){ bad++; console.log('FAIL name',JSON.stringify(t.name),'repeats',byName.get(t.name).where); }
  if(byKey.has(o.K)){ bad++; const q=byKey.get(o.K); console.log('FAIL source',o.where,t.name,'==',q.where,q.t.name,'::',t.src); }
  for(const q of seen){ if(q.K!==o.K&&ed(o.N,q.N)<=1){ warn++; console.log('warn near',o.where,t.name,'~',q.where,q.t.name,'::',t.src,'|',q.t.src); } }
  let mx=0, mw='';
  for(const q of seen){ if(q.t.kind!==t.kind) continue;
    for(const qs of q.S){ const r=agree(o.S[0],qs); if(r>mx){ mx=r; mw=q.where+':'+q.t.name; } } }
  if(mx===1){ bad++; console.log('FAIL behaviour identical',o.where,t.name,'==',mw,'::',t.src); }
  else if(mx>TH){ bad++; console.log(`FAIL behaviour agree ${mx.toFixed(3)}`,o.where,t.name,'~',mw,'::',t.src); }
  if(mx>maxA){ maxA=mx; maxW=t.name+' ~ '+mw; }
  if(process.env.VERBOSE) console.log(mx.toFixed(3),o.where,t.name,'~',mw);
  byName.set(t.name,o); byKey.set(o.K,o); seen.push(o);
}
console.log(`DEDUP checked ${mine.length} suite6 tasks against ${old.length} older tasks: ${bad} duplicates (name/source/behaviour), ${warn} one-token near-misses (warning only); max behaviour agreement ${maxA.toFixed(3)} (${maxW}) on ${LISTS.length} lists / full num space`);
process.exit(bad?1:0);
