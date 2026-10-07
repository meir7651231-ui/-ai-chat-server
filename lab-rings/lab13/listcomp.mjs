// «מרכיב-הרשימות»: משימה על רשימה = פעולה רגילה על התשובות של כלי-רשימה שכבר במדף.
// מריצים כלי א (שומרים קודם את ראש-הרשימה), מעבירים את התשובה לתא בטוח, מחזירים את הראש, מריצים כלי ב, ומחברים בפעולה.
import fs from 'fs'; import { run } from './machine3.mjs'; import { partTables } from './tzoref-tables.mjs'; import { placements, makeChecker, finalCheck } from './tzoref.mjs';
const R=k=>Math.floor(Math.random()*k); const LISTC=[0,1,8,9,10,11,12,13,14,15];
const shuf=()=>{ const p=[8,9,10,11,12,13,14,15]; for(let i=7;i>0;i--){ const j=R(i+1); [p[i],p[j]]=[p[j],p[i]]; } return p; };
export const listGen=f=>()=>{ const m=new Array(16).fill(0); const l=shuf().slice(0,R(9)); m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; }); const w=f(l)&15; const mem=m.map((v,k)=>LISTC.includes(k)?v:R(16)); return {mem,want:w,ok:r=>r[2]===w}; };
const usedC=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]));
const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
const mv=(a,b)=>[['WHERE',a],['GO'],['TAKE'],['WHERE',b],['GO'],['PUT']];
const Z=[['WHERE',0],['GO']];   // כל כלי מתחיל כאילו מההתחלה: המצביעים על תא 0
export function listCompose(gen,{N=200,ban=[]}={}){ const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8'));
  const ex=Array.from({length:N},()=>gen()); const want=ex.map(e=>e.want);
  // כלי-רשימה בטוחים: עונים בתא 2 ולא משנים את הרשימה (תאים 8–15)
  const tools=[]; for(const b of sh.named){ if(ban.includes(b.name)||!b.prog.some(x=>x[0]==='WHERE@')||b.prog.length>200) continue; let ok=true; const v=[];
    const PAD=[['WHERE',0],['GO'],['WHERE',0],['GO'],['WHERE',0],['GO'],['WHERE',0],['GO'],['WHERE',0],['GO'],['WHERE',0],['GO'],['WHERE',0],['GO']]; const moved=[...PAD,...shift(b.prog,PAD.length)];
    for(const e of ex){ const r=run(b.prog,e.mem,{maxSteps:20000}); if(!r||[8,9,10,11,12,13,14,15].some(c=>r.mem[c]!==e.mem[c])){ ok=false; break; } const r2=run(moved,e.mem,{maxSteps:20000}); if(!r2||(r2.mem[2]&15)!==(r.mem[2]&15)){ ok=false; break; } v.push(r.mem[2]&15); }   // «נייד»: עובד גם כשהוא לא בתחילת התוכנית
    if(ok) tools.push({b,v,prog:b.prog,name:b.name}); }
  // עלים נגזרים: פעולה חד-מקומית על תשובה של כלי (למשל «כפול 2» על «סכום רשימה»)
  const U1=partTables(sh.named.filter(b=>!b.bad)).filter(t=>t.k===1&&!t.partial); const base=tools.slice();
  for(const tb of U1){ const opB=sh.named.find(b=>b.name===tb.name); if(!opB) continue; const P=placements(opB,6000).filter(q=>q.ins.join()==='3'&&q.out===2); if(!P.length) continue;
    for(const t of base){ const prog=[...t.prog,...mv(2,3),...shift(P[0].prog,t.prog.length+6)]; tools.push({v:t.v.map(x=>tb.T[x]),prog,name:`${tb.name}(${t.name})`,b:{name:`${tb.name}(${t.name})`,prog}}); } }
  const TB=partTables(sh.named.filter(b=>!b.bad)).filter(t=>t.k<=2&&!t.partial); const eq=(v)=>v.every((x,i)=>x===want[i]);
  const cands=[];
  for(const t of tools) if(eq(t.v)) cands.push({kind:1,A:t});
  for(const tb of TB.filter(t=>t.k===1)) for(const t of tools) if(want.every((w,i)=>tb.T[t.v[i]]===w)) cands.push({kind:2,A:t,op:tb});
  for(const tb of TB.filter(t=>t.k===2)) for(const a of tools) for(const c of tools){ if(a===c) continue; let ok=true; for(let i=0;i<N;i++) if(tb.T[a.v[i]*16+c.v[i]]!==want[i]){ ok=false; break; } if(ok) cands.push({kind:3,A:a,B:c,op:tb}); }
  const chk=makeChecker(gen,300); const progs=[];
  for(const cd of cands){ let p=null;
    if(cd.kind===1) p=cd.A.b.prog;
    else { const opB=sh.named.find(b=>b.name===cd.op.name); if(!opB) continue;
      if(cd.kind===2){ const P=placements(opB,6000).filter(q=>q.ins.join()==='3'&&q.out===2); if(P.length) p=[...cd.A.b.prog,...mv(2,3),...shift(P[0].prog,cd.A.b.prog.length+6)]; }
      else { // תאי-שמירה: מנסים את כל הבחירות מ-3..7 (הכלים קוראים גם תאים בעקיפין) — הראשונה שעוברת את הבודק
        const C5=[3,4,5,6,7]; outer: for(const S of C5) for(const h1 of C5) for(const h0 of C5) for(const T2 of C5){ if(new Set([S,h1,h0]).size<3||T2===S) continue;
          let q=[...mv(1,h1),...mv(0,h0),...Z]; q=[...q,...shift(cd.A.b.prog,q.length)]; q=[...q,...mv(2,S),...mv(h1,1),...mv(h0,0),...Z]; q=[...q,...shift(cd.B.b.prog,q.length)]; q=[...q,...mv(2,T2)];
          const P=placements(opB,6000).filter(z=>z.ins.join()===S+','+T2&&z.out===2); if(!P.length) continue; const cand=[...q,...shift(P[0].prog,q.length)]; if(chk(cand)){ p=cand; break outer; } } } }
    if(process.env.LCDBG) console.log('  מועמד',cd.kind,cd.op?.name,cd.A.b.name,cd.B?.b.name,'⇒',p?(chk(p)?'עובר':'נכשל בבודק'):'לא הורכב');
    if(p&&chk(p)) progs.push({p,how:cd.kind===1?cd.A.b.name:cd.kind===2?`${cd.op.name}(${cd.A.b.name})`:`${cd.op.name}(${cd.A.b.name}, ${cd.B.b.name})`}); if(progs.length>=5) break; }
  progs.sort((x,y)=>x.p.length-y.p.length); return progs[0]?{prog:progs[0].p,how:progs[0].how,ntools:tools.length,ncands:cands.length}:{prog:null,ntools:tools.length,ncands:cands.length}; }
if((process.argv[1]||'').endsWith('listcomp.mjs')){
  const sum=l=>l.reduce((a,b)=>a+b,0), mx=l=>l.length?Math.max(...l):0, mnn=l=>l.length?Math.min(...l):0;
  const T=[
   ['רר1 סכום הזוגיים פחות ספור גדולים מ-12',l=>sum(l.filter(x=>x%2===0))-l.filter(x=>x>12).length],
   ['רר2 הגדול פחות הקטן',l=>mx(l)-mnn(l)],
   ['רר3 סכום כפול 2 ועוד האורך',l=>2*sum(l)+l.length],
   ['רר4 הגדול מבין סכום-הזוגיים והגדול',l=>Math.max(sum(l.filter(x=>x%2===0))&15,mx(l))],
   ['רר5 יורדת וגם כולם אי-זוגיים',l=>(l.every((x,i)=>!i||l[i-1]>x)&&l.every(x=>x%2))?15:0],
   ['רר6 כמה גדולים מהראשון ועוד ספור ירידות',l=>l.filter(x=>l.length&&x>l[0]).length+l.filter((x,i)=>i&&x<l[i-1]).length],
   ['רר7 האחרון פחות הראשון, כפול 2',l=>2*(l.length?(l[l.length-1]-l[0]):0)],
   ['רר8 סכום פחות (הגדול פחות האורך)',l=>sum(l)-(((l.length?Math.max(...l):0)-l.length)&15)],
  ];
  let ok=0; for(const [name,f] of T){ const gen=listGen(f); const t=Date.now(); const r=listCompose(gen); const good=r.prog&&!finalCheck(r.prog,gen,5000).bad; let indep=null; if(good){ let bad=0; const { run }=await import('./machine3.mjs'); for(let t=0;t<20000;t++){ const e=gen(); const z=run(r.prog,e.mem,{maxSteps:60000}); if(!z||z.mem[2]!==e.want||z.st.length) bad++; } indep=bad; } if(good) ok++;
    console.log(`${good?'✓':'✗'} ${name}: ${good?r.prog.length+' פקודות · '+r.how:'לא נמצא'} · בדיקה-עצמאית: ${indep===null?'-':indep+' שגויים מ-20000'} · כלים ${r.ntools} · מועמדים ${r.ncands} · ${((Date.now()-t)/1000).toFixed(1)} שנ׳`); }
  console.log(`סך: ${ok}/${T.length}`); process.exit(0); }
