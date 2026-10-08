// «סינון נסתר»: התשובה היא מספר, ולא רואים אילו איברים הוצאו. המכונה מנסה את כל 256 התנאים האפשריים על 8..15
// יחד עם כל מחשב-מספר מהמדף, מוצאת זוג שמסביר את כל הדוגמאות, לומדת את התנאי (אם חסר), ובונה: סנן ⇒ חשב.
import fs from 'fs'; import { run } from './machine3s.mjs'; import { makeChecker, finalCheck, shorten, movable, placements } from './tzoref.mjs'; import { listGen } from './listcomp.mjs'; import { pipeCompose } from './pipeline.mjs';
import { filterFrame } from './filtcomp.mjs'; import { valueBuild } from './tzoref-value.mjs';
const R=k=>Math.floor(Math.random()*k); const walk=m=>{ const o=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ o.push(a); a=m[a]; } return o; };
const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x); const Z=[['WHERE',0],['GO']]; const RUN=(p,m)=>run(p,m,{maxSteps:600000});
const relink=(m,l)=>{ const q=m.slice(); for(let c=8;c<16;c++) q[c]=0; q[1]=l[0]||0; l.forEach((a,i)=>{ q[a]=l[i+1]||0; }); return q; };
const usedC=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]));
async function ensureCond(tt){ const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const G=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8'));
  // כבר יש כלי עם אותה טבלה על 8..15 (השאר לא משנה)? — משתמשים בו
  for(const b of sh.named){ if((b.ins||[]).length!==1||b.prog.length>200) continue; const q=placements(b,6000).find(z=>z.ins.join()==='4'&&z.out===2&&[...usedC(z.prog)].every(c=>c<8)); if(!q) continue;
    let ok=true; for(let v=8;v<16&&ok;v++) for(let t=0;t<3&&ok;t++){ const m=Array.from({length:16},()=>R(16)); m[4]=v; const r=RUN(q.prog,m); if(!r||!!(r.mem[2]&15)!==!!tt[v]) ok=false; } if(ok) return {name:b.name,prog:q.prog,learned:false}; }
  const name='תנאי: '+tt.slice(8).map((x,i)=>x?String(i+8):'').filter(Boolean).join(','); const gen=()=>{ const mem=Array.from({length:16},()=>R(16)); const w=tt[mem[0]]; const keep=mem[0]; return {mem,want:w,ok:r=>r[2]===w&&r[0]===keep}; };
  const v=valueBuild(gen,{name,ins:[0],out:2,ms:90000}); if(!v.prog) return null; let s=v.prog; try{ s=shorten(v.prog,gen,{minutes:1,quiet:9}).prog; }catch{} if(finalCheck(s,gen).bad) return null;
  sh.named.push({name,prog:s,ins:[0],out:2,movable:movable(s,gen),by:'נלמד: סינון נסתר'}); fs.writeFileSync('shelf3.json',JSON.stringify(sh)); G[name]={ins:[0],tt}; fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(G));
  const b={name,prog:s,ins:[0],out:2}; const q=placements(b,6000).find(z=>z.ins.join()==='4'&&z.out===2&&[...usedC(z.prog)].every(c=>c<8)); return q?{name,prog:q.prog,learned:true,len:s.length}:null; }
export async function hiddenFilter(gen,{N=80,ms=+process.env.HFMS||300000}={}){ const DEAD=Date.now()+ms; const direct=pipeCompose(gen); if(direct.prog) return {...direct,via:'שרשרת מהמדף'};
  const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const ex=Array.from({length:N},()=>gen()); const Ls=ex.map(e=>walk(e.mem));
  const V=sh.named.filter(b=>b.prog.some(x=>x[0]==='WHERE@')&&b.prog.length<=200&&!/^(בלי|רק) /.test(b.name));
  // ערכי כל מחשב על כל רשימה-מסוננת אפשרית — מחושב לפי דרישה ונשמר
  const cache=new Map(); const val=(v,i,S)=>{ const l=Ls[i].filter(x=>S>>(x-8)&1); const k=v.name+'|'+i+'|'+l.join(','); if(cache.has(k)) return cache.get(k); const r=RUN(v.prog,relink(ex[i].mem,l)); const y=r&&!r.st.length?r.mem[2]&15:-1; cache.set(k,y); return y; };
  for(let S=1;S<255;S++) for(const v of V){ if(Date.now()>DEAD) return {prog:null,timeout:true}; let ok=true; for(let i=0;i<N&&ok;i++) if(val(v,i,S)!==ex[i].want) ok=false; if(!ok) continue;
    const tt=Array.from({length:16},(_,x)=>x>=8&&!(S>>(x-8)&1)?15:0);   // 15 = להוציא
    const c=await ensureCond(tt); if(!c) continue; let p=filterFrame(c.prog,true); p=[...p,...Z,...shift(v.prog,p.length+2)];
    if(makeChecker(gen,300,600000)(p)) return {prog:p,how:`סנן: הוצא איברים ש[${c.name}] ⇒ ${v.name}`,via:c.learned?`למד תנאי חדש (${c.len} פקודות)`:'תנאי מהמדף'}; }
  return {prog:null}; }
if((process.argv[1]||'').endsWith('hiddenfilter.mjs')){ let s=(+(process.env.SEED||3))>>>0; const rnd=()=>{ s=(s+0x6D2B79F5)>>>0; let t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; };
  const FIN=[['סכום',l=>l.reduce((a,b)=>a+b,0)&15],['הגדול',l=>l.length?Math.max(...l):0],['כמה',l=>l.length],['הקטן',l=>l.length?Math.min(...l):15]];
  for(let t=0;t<+(process.env.N||8);t++){ const keepSet=[8,9,10,11,12,13,14,15].filter(()=>rnd()<0.5); if(keepSet.length<2||keepSet.length>6){ t--; continue; } const [fn,ff]=FIN[Math.floor(rnd()*FIN.length)];
    const name=`${fn} של [${keepSet.join(',')}] בלבד`; const f=l=>ff(l.filter(x=>keepSet.includes(x))); const gen=listGen(f); const t0=Date.now(); const r=await hiddenFilter(gen); let bad=null;
    if(r.prog){ bad=0; for(let k=0;k<20000;k++){ const e=gen(); const z=RUN(r.prog,e.mem); if(!z||z.st.length||z.mem[2]!==e.want) bad++; } }
    console.log(`${r.prog&&!bad?'✓':'✗'} ${name}: ${r.prog?r.prog.length+' פקודות · '+r.how+' · '+r.via+' · בדיקה-עצמאית '+bad+' שגויים מ-20000':'לא נמצא'} · ${((Date.now()-t0)/1000).toFixed(0)} שנ׳`); }
  process.exit(0); }
