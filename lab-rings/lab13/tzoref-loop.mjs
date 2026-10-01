// «בונה-לולאות»: כמעט כל משימה על רשימה היא «התחל ממספר, ובכל איבר עדכן אותו».
// הצורף מחפש רק שני דברים: במה להתחיל (0 / 15 / המפתח), ומה לעשות בכל צעד — צירוף חלקים על (צובר, איבר, מפתח).
// את השלד (מעבר על הרשימה) הוא כותב בעצמו, ובודק את התוכנית כולה בבודק הרגיל.
import { loadShelf, placements, makeChecker } from './tzoref.mjs'; import { partTables } from './tzoref-tables.mjs';
const ACC=2, X=3, KEY=0;                       // צובר בתא 2 (שם גם התשובה), האיבר הנוכחי בתא 3, המפתח בתא 0
const XS=[8,9,10,11,12,13,14,15], KS=[0,8,9,10,11,12,13,14,15];
const DOM=[]; for(let a=0;a<16;a++) for(const x of XS) for(const k of KS) DOM.push([a,x,k]);   // כל המצבים האפשריים של צעד
const walk=m=>{ const l=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ l.push(a); a=m[a]; } return l; };
export function loopBuild(gen,{name='',maxSize=3,ms=30000,N=64,tries=80}={}){ const t0=Date.now(); const sh=loadShelf(); const blocks=new Map(sh.named.map(b=>[b.name,b]));
  const TB=partTables(sh.named.filter(b=>!b.bad&&b.name!==name)).filter(t=>t.name!=='העתק');
  const ex=Array.from({length:N},()=>gen()).filter(e=>e.want!=null); if(ex.length<N/2) return {prog:null,why:'המטרה לא נותנת תשובה במספר'};
  const lists=ex.map(e=>walk(e.mem)), keys=ex.map(e=>e.mem[KEY]);
  // מנייה: ביטויים על (צובר, איבר, מפתח); שני ביטויים שנותנים אותו דבר בכל המצבים — אחד מהם נזרק
  const seen=new Set(), by=[[]]; let found=null, made=0; const D=DOM.length;
  const hkey=v=>{ let h1=2166136261, h2=5381; for(let i=0;i<D;i++){ h1=Math.imul(h1^v[i],16777619); h2=(Math.imul(h2,33)+v[i])|0; } return (h1>>>0).toString(36)+':'+(h2>>>0).toString(36); };
  const INITS=[{c:0,name:'0'},{c:15,name:'15'},{cell:KEY,name:'המפתח'}];
  const test=(v,expr)=>{ // מריצים את הלולאה על כל הדוגמאות עם כל נקודת-התחלה
    const idx=(a,x,k)=>(a*8+(x-8))*9+(k?k-7:0);
    for(const I of INITS){ let ok=true; for(let i=0;i<ex.length&&ok;i++){ let acc=I.cell!=null?ex[i].mem[I.cell]:I.c; for(const x of lists[i]) acc=v[idx(acc,x,keys[i])]; if(acc!==(ex[i].want&15)) ok=false; } if(ok){ found={step:expr,init:I}; return true; } } return false; };
  const add=(v,expr,s)=>{ const k=hkey(v); if(seen.has(k)) return false; seen.add(k); (by[s]||(by[s]=[])).push({v,expr}); made++; return test(v,expr); };
  add(Uint8Array.from(DOM.map(d=>d[0])),{cell:ACC},0); add(Uint8Array.from(DOM.map(d=>d[1])),{cell:X},0); add(Uint8Array.from(DOM.map(d=>d[2])),{cell:KEY},0);
  for(let s=1;s<=maxSize&&!found;s++) for(const tb of TB){ if(found||Date.now()-t0>ms) break; const F=tb.T;
    if(tb.k===1){ for(const a of by[s-1]||[]){ const v=new Uint8Array(D); for(let i=0;i<D;i++) v[i]=F[a.v[i]]; if(add(v,{f:tb.name,k:1,a:a.expr},s)) break; } }
    else for(let sa=0;sa<=s-1&&!found;sa++) for(const a of by[sa]||[]){ if(found) break; for(const b of by[s-1-sa]||[]){ if(a===b) continue; const v=new Uint8Array(D); for(let i=0;i<D;i++) v[i]=F[a.v[i]*16+b.v[i]]; if(add(v,{f:tb.name,k:2,a:a.expr,b:b.expr},s)) break; } } }
  // «לולאה ואחריה חישוב»: צבירה שהתשובה היא פונקציה שלה (למשל «הקטן» ⇒ «פחות 8») — מחפשים את החישוב שאחרי
  if(!found){ const U=[{v:Uint8Array.from([...Array(16).keys()]),e:{cell:ACC}}], useen=new Set([U[0].v.join()]); const lev=[[U[0]]];
    // חישובים-שאחרי: כל שכבה מצטרפת רק לפשוטות (לא «כולם עם כולם» — זה התפוצץ כשהמדף גדל), עד 6,000 בשכבה
    for(let s=1;s<=3;s++){ const L=[]; const push=(v,e)=>{ const k=v.join(); if(useen.has(k)||L.length>6000) return; useen.add(k); const u={v,e}; L.push(u); U.push(u); };
      for(const tb of TB){ const F=tb.T;
        if(tb.k===1){ for(const a of lev[s-1]) push(a.v.map(x=>F[x]),{f:tb.name,k:1,a:a.e}); }
        else for(const a of lev[s-1]) for(const b of [...lev[0],...(lev[1]||[]).slice(0,300)]){ if(a===b) continue; push(a.v.map((x,i)=>F[x*16+b.v[i]]),{f:tb.name,k:2,a:a.e,b:b.e}); push(a.v.map((x,i)=>F[b.v[i]*16+x]),{f:tb.name,k:2,a:b.e,b:a.e}); } }
      lev.push(L); }
    const idx=(a,x,k)=>(a*8+(x-8))*9+(k?k-7:0); const V=Array.from({length:1500},()=>gen()).filter(e=>e.want!=null); const VL=V.map(e=>walk(e.mem));
    const fold=(v,I,m,l)=>{ let acc=I.cell!=null?m[I.cell]:I.c; for(const x of l) acc=v[idx(acc,x,m[KEY])]; return acc; };
    outer: for(const st of by.slice(0,3).flat()) for(const I of INITS){ const r=ex.map((e,i)=>fold(st.v,I,e.mem,lists[i])); const M=new Map(); let ok=true;
        for(let i=0;i<ex.length&&ok;i++){ const w=ex[i].want&15; if(M.has(r[i])&&M.get(r[i])!==w) ok=false; M.set(r[i],w); } if(!ok||M.size<2) continue;
        for(const u of U){ let good=true; for(const [k,w] of M) if(u.v[k]!==w){ good=false; break; } if(!good) continue;
          if(V.every((e,i)=>u.v[fold(st.v,I,e.mem,VL[i])]===(e.want&15))){ found={step:st.expr,init:I,post:u.e}; break outer; } } } }
  if(!found) return {prog:null,made,ms:Date.now()-t0};
  // תוכנית: התחלה · ראש ⇒ תא 3 · אם ריק — לסוף · גוף: צעד ⇒ תא-עזר ⇒ תא 2 · הבא · חזור
  const EQ=new Map(); { const byT=new Map(); for(const t of TB){ const k=t.k+':'+t.T.join(','); if(!byT.has(k)) byT.set(k,[]); byT.get(k).push(t.name); } for(const L of byT.values()) for(const n of L) EQ.set(n,L); }
  const used=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]).filter(c=>c<8)); const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
  const P=s=>s.split(';').map(x=>x.trim()).filter(Boolean).map(x=>{ const [o,a]=x.split(' '); return a==null?[o]:[o,+a]; });
  const size=e=>e.cell!=null?0:1+size(e.a)+(e.b?size(e.b):0);
  const body=rnd=>exprToAcc(found.step,rnd);
  function exprToAcc(EXPR,rnd){ const prog=[], live=new Set(); const R=k=>rnd?Math.floor(Math.random()*k):0; const keep=[0,1,ACC,X];
    const emit=(e,target)=>{ if(e.cell!=null) return e.cell; const kids=e.b?[e.a,e.b]:[e.a]; const order=kids.map((k,i)=>i).sort((i,j)=>size(kids[j])-size(kids[i])); const cells=[];
      for(const i of order){ const c=emit(kids[i],null); if(c==null) return null; cells[i]=c; if(!keep.includes(c)) live.add(c); }
      const free=[4,5,6,7].filter(c=>!live.has(c)); const tgt=target??(free.length?free[R(free.length)]:null); if(tgt==null) return null;
      const C=(EQ.get(e.f)||[e.f]).map(n=>blocks.get(n)).flatMap(b=>b.movable===false?[{prog:b.prog,ins:(b.ins||[]).filter(c=>c<8),out:b.out??2}]:placements(b,6000));
      const ok=C.filter(p=>p.out===tgt&&p.ins.join()===cells.join()&&[...used(p.prog)].every(c=>c===tgt||cells.includes(c)||(!live.has(c)&&!keep.includes(c))));
      if(!ok.length) return null; const p=ok[R(ok.length)]; prog.push(...shift(p.prog,prog.length)); for(const c of cells) live.delete(c); return tgt; };
    if(EXPR.cell!=null){ const c=EXPR.cell; return c===ACC?[]:P(`WHERE ${c}; GO; TAKE; WHERE ${ACC}; GO; PUT`); }
    const t=emit(EXPR,null); if(t==null) return null; return [...prog,...P(`WHERE ${t}; GO; TAKE; WHERE ${ACC}; GO; PUT`)]; }
  const init=found.init.cell!=null?P(`WHERE ${found.init.cell}; GO; TAKE; WHERE ${ACC}; GO; PUT`):P(`WHERE ${ACC}; GO; TAKE; TAKE; CALC; TAKE; CALC; PUT`+(found.init.c===0?'; TAKE; TAKE; CALC; PUT':''));
  const chk=makeChecker(gen,300);
  // שלדים: הצורף מנסה כמה צורות של לולאה ושומר את הקצרה שעוברת (ומה שניצח — נזכר לפעם הבאה)
  const SK={
    'בדיקה בהתחלה':(B)=>{ const head=[...init,...P(`WHERE 1; GO; TAKE; WHERE ${X}; GO; PUT`)]; const pre=[...head,...P(`WHERE ${X}; GO; TAKE`)];
      const bodyAt=pre.length+2+P(`WHERE ${X}; GO; TAKE; TAKE; CALC`).length+2; const next=P(`WHERE ${X}; GO; TAKE; WHERE@; GO; TAKE; WHERE ${X}; GO; PUT; WHERE ${X}; GO; TAKE`);
      const endAt=bodyAt+B.length+next.length+2;
      return [...pre,['WHERE',bodyAt,'code'],['JUMP'],...P(`WHERE ${X}; GO; TAKE; TAKE; CALC`),['WHERE',endAt,'code'],['JUMP'],...shift(B,bodyAt),...next,['WHERE',bodyAt,'code'],['JUMP']]; },
    'בדיקה בסוף':(B)=>{ // התחלה · ראש⇒X · קפוץ לבדיקה · גוף · הבא · בדיקה: אם X לא אפס ⇒ לגוף
      const head=[...init,...P(`WHERE 1; GO; TAKE; WHERE ${X}; GO; PUT`)]; const jmpTest=head.length; const bodyAt=jmpTest+P(`TAKE; TAKE; CALC; TAKE; CALC`).length+2;
      const next=P(`WHERE ${X}; GO; TAKE; WHERE@; GO; TAKE; WHERE ${X}; GO; PUT`); const testAt=bodyAt+B.length+next.length;
      return [...head,...P(`TAKE; TAKE; CALC; TAKE; CALC`),['WHERE',testAt,'code'],['JUMP'],...shift(B,bodyAt),...next,...P(`WHERE ${X}; GO; TAKE`),['WHERE',bodyAt,'code'],['JUMP']]; },
    'בדיקה בסוף, בלי קפיצה':(B)=>{ // אם הרשימה ריקה: הגוף רץ פעם אחת על «איבר 0» — מותר רק אם הצעד על 0 לא משנה (הבודק יחליט)
      const head=[...init,...P(`WHERE 1; GO; TAKE; WHERE ${X}; GO; PUT`)]; const bodyAt=head.length;
      const next=P(`WHERE ${X}; GO; TAKE; WHERE@; GO; TAKE; WHERE ${X}; GO; PUT; TAKE`);
      return [...head,...shift(B,bodyAt),...next,['WHERE',bodyAt,'code'],['JUMP']]; },
  };
  const best=[]; for(const [nm,mk] of Object.entries(SK)) for(let t=0;t<Math.ceil(tries/3);t++){ const B=body(t>0); if(!B) continue; let prog=mk(B); if(found.post){ const Q=exprToAcc(found.post,t>0); if(!Q) continue; prog=[...prog,...shift(Q,prog.length)]; } if(chk(prog)){ best.push({prog,skel:nm}); break; } }
  if(best.length){ best.sort((a,b)=>a.prog.length-b.prog.length); return {prog:best[0].prog,skel:best[0].skel,all:best,step:found.step,post:found.post,init:found.init.name,made,ms:Date.now()-t0}; }
  return {prog:null,step:found.step,init:found.init.name,made,ms:Date.now()-t0,why:'נמצא צעד, אבל התוכנית לא עברה'}; }
export const showL=e=>e.cell!=null?(e.cell===ACC?'צובר':e.cell===X?'איבר':'מפתח'):`${e.f}(${showL(e.a)}${e.b?', '+showL(e.b):''})`;
if(import.meta.url==='file://'+process.argv[1]){ const { goals, goalFor }=await import('./tzoref-goals.mjs'); const G=goals();
  for(const name of process.argv.slice(2)){ const g=G[name]; const r=loopBuild(goalFor(name,{ins:g.ins},G),{name});
    console.log(`${r.prog?'✓':'✗'} ${name}: ${r.step?'התחל מ-'+r.init+' · בכל איבר: צובר ⇐ '+showL(r.step):'-'} · ${r.prog?r.prog.length+' פקודות':(r.why||'לא נמצא')} · ${r.made??'-'} צעדים שונים · ${((r.ms||0)/1000).toFixed(1)} שנ׳`); } }
