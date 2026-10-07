// רשימה ⇒ רשימה: משימה = רצף של כלי-רשימה שמשנים את הרשימה (הפוך, מיין, דלג על הראשון…) — הפלט של אחד הוא הקלט של הבא
import fs from 'fs'; import { run } from './machine3.mjs'; import { makeChecker, finalCheck } from './tzoref.mjs';
const R=k=>Math.floor(Math.random()*k); const LISTC=[0,1,8,9,10,11,12,13,14,15];
const shuf=()=>{ const p=[8,9,10,11,12,13,14,15]; for(let i=7;i>0;i--){ const j=R(i+1); [p[i],p[j]]=[p[j],p[i]]; } return p; };
const walk=m=>{ const out=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ out.push(a); a=m[a]; } return out; };
export const llGen=f=>()=>{ const m=new Array(16).fill(0); const l=shuf().slice(0,R(9)); m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; }); const w=JSON.stringify(f(l)); const mem=m.map((v,k)=>LISTC.includes(k)?v:R(16)); return {mem,want:w,ok:r=>JSON.stringify(walk(r))===w}; };
const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x); const Z=[['WHERE',0],['GO']];
export function llCompose(gen,{maxLen=3,N=120}={}){ const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const ex=Array.from({length:N},()=>gen());
  // כלים שמשנים רשימה: מסתיימים תמיד, ובחלק מהדוגמאות הרשימה אחרי ≠ לפני; וגם «ניידים» (עובדים אחרי ריפוד)
  const PAD=[...Z,...Z,...Z,...Z,...Z,...Z,...Z]; const T=[];
  for(const b of sh.named){ if(b.prog.length>300) continue; let ok=true, changed=0; for(const e of ex){ const r=run(b.prog,e.mem,{maxSteps:300000}); if(!r||r.st.length){ ok=false; break; } const a=walk(r.mem); if(JSON.stringify(a)!==JSON.stringify(walk(e.mem))) changed++;
      const r2=run([...PAD,...shift(b.prog,PAD.length)],e.mem,{maxSteps:300000}); if(!r2||JSON.stringify(walk(r2.mem))!==JSON.stringify(a)){ ok=false; break; } }
    if(ok&&changed>N/4) T.push(b); }
  const chk=makeChecker(gen,300,600000); const seq=(names)=>{ let p=[]; for(const b of names){ p=[...p,...Z]; p=[...p,...shift(b.prog,p.length)]; } return p; };
  const okOn=p=>ex.every(e=>{ const r=run(p,e.mem,{maxSteps:600000}); return r&&!r.st.length&&e.ok(r.mem); });
  let level=[[]]; for(let L=1;L<=maxLen;L++){ const next=[]; for(const s of level) for(const b of T){ const ns=[...s,b]; const p=seq(ns); if(okOn(p)&&chk(p)) return {prog:p,how:ns.map(x=>x.name).join(' ⇒ '),tools:T.map(x=>x.name)}; next.push(ns); } level=next; }
  return {prog:null,tools:T.map(x=>x.name)}; }
if((process.argv[1]||'').endsWith('listlist.mjs')){
  const T=[
   ['רל1 מיין בסדר יורד',l=>[...l].sort((a,b)=>b-a)],
   ['רל2 בלי הראשון',l=>l.slice(1)],
   ['רל3 בלי האחרון, הפוך',l=>[...l].reverse().slice(1)],
   ['רל4 ממוינת בלי הקטן',l=>[...l].sort((a,b)=>a-b).slice(1)],
   ['רל5 ממוינת יורד בלי הגדול',l=>[...l].sort((a,b)=>b-a).slice(1)],
   ['רל6 בלי שני הראשונים',l=>l.slice(2)],
   ['רל7 בלי הזוגיים',l=>l.filter(x=>x%2)],
  ];
  let ok=0; for(const [name,f] of T){ const gen=llGen(f); const t0=Date.now(); const r=llCompose(gen); let good=!!r.prog, bad=null;
    if(good){ bad=0; for(let k=0;k<20000;k++){ const e=gen(); const z=run(r.prog,e.mem,{maxSteps:600000}); if(!z||z.st.length||!e.ok(z.mem)) bad++; } good=bad===0; } if(good) ok++;
    console.log(`${good?'✓':'✗'} ${name}: ${good?r.prog.length+' פקודות · '+r.how:'לא נמצא'+(bad?' (בדיקה עצמאית: '+bad+' שגויים)':'')} · ${((Date.now()-t0)/1000).toFixed(1)} שנ׳`); if(!ok&&name.startsWith('רל1')) console.log('   כלים-משני-רשימה במדף:',r.tools.join(' | ')); }
  console.log(`סך: ${ok}/${T.length}`); process.exit(0); }
