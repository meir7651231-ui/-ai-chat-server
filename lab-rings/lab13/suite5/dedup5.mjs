// Source-level dedup for suite5: every task name and every source (up to renaming variables and
// trivial syntax: whitespace, let/const/var, ===/==, !==/!=, ';' before '}') must be new versus
// suite/, suite2/, suite3/, suite4/ (plus suite-smoke/, suite-numfail-dir/) and within suite5.
// Also prints, as a warning only, suite5 sources that are one token edit away from an older source
// (for example the same template with another constant).
import fs from 'fs';
const B='/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad/';
const OLD=['suite','suite2','suite3','suite4','suite-smoke','suite-numfail-dir'];
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
const old=OLD.flatMap(load), mine=load('suite5');
for(const o of [...old,...mine]){ o.N=normalize(o.t.src); o.K=o.N.join(' '); }
const byKey=new Map(), byName=new Map();
for(const o of old){ byKey.set(o.K,o); byName.set(o.t.name,o); }
let bad=0, warn=0;
for(const o of mine){ const t=o.t;
  if(byName.has(t.name)){ bad++; console.log('FAIL name',JSON.stringify(t.name),'repeats',byName.get(t.name).where); }
  if(byKey.has(o.K)){ bad++; const q=byKey.get(o.K); console.log('FAIL source',o.where,t.name,'==',q.where,q.t.name,'::',t.src); }
  for(const q of old){ if(q.K!==o.K&&ed(o.N,q.N)<=1){ warn++; console.log('warn near',o.where,t.name,'~',q.where,q.t.name,'::',t.src,'|',q.t.src); } }
  byName.set(t.name,o); byKey.set(o.K,o);
}
console.log(`DEDUP checked ${mine.length} suite5 tasks against ${old.length} older tasks: ${bad} duplicates, ${warn} one-token near-misses (warning only)`);
process.exit(bad?1:0);
