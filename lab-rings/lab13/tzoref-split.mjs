// «פגישה באמצע»: משימה שצריכה שני שלבים. הצורף לא יודע מה צריך לקרות באמצע — אז הוא בונה את כל «השלבים הראשונים»
// (לולאה על הרשימה), רושם אילו «מצבי-אמצע» שונים הם משאירים, ואז מחפש «שלב שני» (לולאה על המספרים 15..8) שממשיך מאחד מהם לתשובה.
// הפעולות הקטנות: העתק · עקוב-חץ · שנה-חץ · אפס · סמן (חץ ⇐ 15) · «אם התא לא אפס — עשה את K הבאות».
const R1=[1,2,3], R2=[1,2,3,4];   // בשלב השני תא 4 = המספר הנוכחי (15, 14, … 8)
function ops(regs,withIf){ const O=[]; for(const i of regs){ O.push({t:'zero',i}); O.push({t:'mark',i}); for(const j of regs){ if(i!==j) O.push({t:'copy',i,j}); O.push({t:'load',i,j}); if(i!==j) O.push({t:'store',i,j}); } if(withIf) for(const k of [1,2]) O.push({t:'if',i,k}); } return O; }
const nm=o=>o.t==='zero'?`תא${o.i}⇐0`:o.t==='mark'?`חץ(תא${o.i})⇐15`:o.t==='copy'?`תא${o.i}⇐תא${o.j}`:o.t==='load'?`תא${o.i}⇐חץ(תא${o.j})`:o.t==='store'?`חץ(תא${o.i})⇐תא${o.j}`:`אם תא${o.i}≠0: ${o.k} הבאות`;
function exec(ops,m){ for(let p=0;p<ops.length;p++){ const o=ops[p]; switch(o.t){ case 'zero': m[o.i]=0; break; case 'mark': m[m[o.i]&15]=15; break; case 'copy': m[o.i]=m[o.j]; break;
      case 'load': m[o.i]=m[m[o.j]&15]; break; case 'store': m[m[o.i]&15]=m[o.j]; break; case 'if': if(m[o.i]===0) p+=o.k; break; } } }
const listLoop=(init,body,cond,m)=>{ exec(init,m); let k=0; while(m[cond]!==0){ if(++k>12) return false; exec(body,m); } return true; };
const valueLoop=(init,body,fin,m)=>{ exec(init,m); for(let v=15;v>=8;v--){ m[4]=v; exec(body,m); } exec(fin,m); };
function* bodies(O,L,need){ const idx=new Array(L).fill(0); while(true){ const b=idx.map(k=>O[k]); if(need(b)) yield b; let p=L-1; while(p>=0&&++idx[p]===O.length){ idx[p]=0; p--; } if(p<0) return; } }
const PART=+(process.env.PART||0), PARTS=+(process.env.PARTS||1);
export function splitBuild(gen,{N=16,maxA=3,maxB=4,ms=3600000,log=()=>{}}={}){ const t0=Date.now(); const ex=Array.from({length:N},()=>gen());
  // בדיקה על 400 דוגמאות חדשות — כדי לא לקבל פתרון שעובד רק במקרה
  const V=Array.from({length:400},()=>gen()); const verify=(a,b)=>V.every(e=>{ const m=e.mem.slice(); if(!listLoop(a.init,a.body,a.cond,m)) return false; valueLoop(b.init,b.body,b.fin,m); return e.ok(m); });
  // שלב 1: כל הלולאות על הרשימה ⇒ מצבי-אמצע שונים
  const OA=ops(R1,false); const IA=[[],...OA.filter(o=>o.t==='zero'||o.t==='copy').map(o=>[o])]; const mids=new Map(); let na=0;
  for(let L=1;L<=maxA;L++) for(const body of bodies(OA,L,b=>b.some(o=>o.t==='load'))) for(const cond of R1){ if(!body.some(o=>(o.t==='copy'||o.t==='load'||o.t==='zero')&&o.i===cond)) continue;
      for(const init of IA){ na++; const M=[]; let ok=true; for(const e of ex){ const m=e.mem.slice(); if(!listLoop(init,body,cond,m)){ ok=false; break; } M.push(m); } if(!ok) continue;
        const k=M.map(m=>m.slice(1).join(',')).join('|'); if(!mids.has(k)) mids.set(k,{M,a:{init,body,cond}}); } }
  log(`שלב 1: ${na.toLocaleString()} לולאות נבדקו ⇒ ${mids.size.toLocaleString()} מצבי-אמצע שונים · ${((Date.now()-t0)/1000).toFixed(0)} שנ׳`);
  // «מצבי-אמצע» לפי הדוגמה הראשונה — כדי לפסול שלב-שני מהר
  // «מצב-אמצע טוב» = לא מאבד מידע (שתי רשימות שונות ⇒ שני מצבים שונים) + «נקי» (מעט ערכים שונים בכל תא)
  const walk=m=>{ const l=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ l.push(a); a=m[a]; } return l; };
  const tgt=ex.map(e=>[...walk(e.mem)].sort((a,b)=>a-b).join(','));
  const score=v=>{ const seen=new Map(); for(let i=0;i<ex.length;i++){ const k=v.M[i].slice(1).join(','); if(seen.has(k)&&seen.get(k)!==tgt[i]) return Infinity; seen.set(k,tgt[i]); }
    let d=0; for(let c=1;c<16;c++){ const S=new Set(v.M.map(m=>m[c])); d+=S.size; } return d; };
  const TOPK=+process.env.TOPK||60; const ranked=[...mids.values()].map(v=>({v,s:score(v)})).filter(x=>x.s<Infinity).sort((a,b)=>a.s-b.s);
  const simple=ranked.slice(0,TOPK).map(x=>x.v); log(`   שומרים מידע: ${ranked.length.toLocaleString()} · הכי «נקיים»: ${ranked.slice(0,3).map(x=>x.s).join(', ')}`);
  const byFirst=new Map(); for(const v of simple){ const k=v.M[0].slice(1).join(','); if(!byFirst.has(k)) byFirst.set(k,[]); byFirst.get(k).push(v); }
  log(`   מתוכם שונים כבר בדוגמה הראשונה: ${byFirst.size.toLocaleString()}`);
  const OB=ops(R2,true); const IB=[[],...R2.map(i=>[{t:'zero',i}])]; const FB=[[],...R2.filter(i=>i!==1).map(j=>[{t:'copy',i:1,j}])]; let nb=0;
  for(let L=1;L<=maxB;L++){ for(const body of bodies(OB,L,b=>{ if(!(b.some(o=>o.i===4||o.j===4)&&b[b.length-1].t!=='if')) return false;
          if(PARTS>1&&(OB.indexOf(b[0])%PARTS)!==PART) return false;                                   // כל עובד — חלק אחר
          const W=o=>o.t==='zero'||o.t==='copy'||o.t==='load'; const RD=(o,r)=>(o.t==='copy'&&o.j===r)||(o.t==='load'&&o.j===r)||((o.t==='store'||o.t==='mark')&&(o.i===r||o.j===r))||(o.t==='if'&&o.i===r)||(o.t==='load'&&o.j===r);
          for(let x=0;x<b.length;x++){ const o=b[x]; if(W(o)&&o.i===4) return false;                        // לא נוגעים במונה
            if(x+1<b.length){ const q=b[x+1]; if(q===o) return false; if(W(o)&&W(q)&&q.i===o.i&&!RD(q,o.i)) return false; } }   // כתיבה שנדרסת מיד — מיותר
          return true; })){ for(const init of IB) for(const fin of FB){ nb++;
        for(const [k0,group] of byFirst){ const m=group[0].M[0].slice(); valueLoop(init,body,fin,m); if(!ex[0].ok(m)) continue;
          for(const g of group){ let ok=true; for(let i=1;i<ex.length&&ok;i++){ const mm=g.M[i].slice(); valueLoop(init,body,fin,mm); if(!ex[i].ok(mm)) ok=false; }
            if(ok&&verify(g.a,{init,body,fin})) return {a:g.a,b:{init,body,fin},na,nb,mids:mids.size,ms:Date.now()-t0}; } }
        if(nb%200000===0){ log(`   שלב 2: ${nb.toLocaleString()} נבדקו (אורך ${L}) · ${((Date.now()-t0)/1000).toFixed(0)} שנ׳`); if(Date.now()-t0>ms) return {na,nb,mids:mids.size,ms:Date.now()-t0}; } } } }
  return {na,nb,mids:mids.size,ms:Date.now()-t0}; }
export const showSplit=r=>`שלב 1 — לפני: ${r.a.init.map(nm).join(', ')||'-'} · כל עוד תא${r.a.cond}≠0: ${r.a.body.map(nm).join(', ')}  ‖  שלב 2 — לפני: ${r.b.init.map(nm).join(', ')||'-'} · לכל מספר 15..8 (בתא 4): ${r.b.body.map(nm).join(', ')} · בסוף: ${r.b.fin.map(nm).join(', ')||'-'}`;
if(import.meta.url==='file://'+process.argv[1]){ const { goals, goalFor }=await import('./tzoref-goals.mjs'); const G=goals(); const nmT=process.argv[2]; const gen=goalFor(nmT,{},G);
  const r=splitBuild(gen,{ms:(+process.env.MIN||55)*60000,log:s=>console.log(s)});
  console.log(r.a?`✓ ${nmT}: ${showSplit(r)} · ${((r.ms)/1000).toFixed(0)} שנ׳`:`✗ ${nmT}: לא נמצא · ${r.nb.toLocaleString()} שלבים-שניים נבדקו · ${(r.ms/1000).toFixed(0)} שנ׳`); process.exit(0); }
// ─── הפיכה לתוכנית: שתי לולאות. לולאה 1 על הרשימה (בדיקה בסוף), לולאה 2: תא4 = 15, 14, … 8 (עוצרים כש-תא4 ⇐ 7: הזזה-ימינה ×3 נותנת 0)
const PP=s=>s.split(';').map(x=>x.trim()).filter(Boolean).map(x=>{ const [o,a]=x.split(' '); return a==null?[o]:[o,+a]; });
const F15='TAKE; TAKE; CALC; TAKE; CALC';   // בכל תא: x NAND (NOT x) = 15
function opCode(o){ switch(o.t){ case 'zero': return PP(`WHERE ${o.i}; GO; ${F15}; PUT; TAKE; TAKE; CALC; PUT`); case 'mark': return PP(`WHERE ${o.i}; GO; TAKE; WHERE@; GO; ${F15}; PUT`);
  case 'copy': return PP(`WHERE ${o.j}; GO; TAKE; WHERE ${o.i}; GO; PUT`); case 'load': return PP(`WHERE ${o.j}; GO; TAKE; WHERE@; GO; TAKE; WHERE ${o.i}; GO; PUT`);
  case 'store': return PP(`WHERE ${o.j}; GO; TAKE; WHERE ${o.i}; GO; TAKE; WHERE@; GO; PUT`); } }
const sh=(p,o)=>p.map(x=>x[2]==='code'?['WHERE',x[1]+o,'code']:x);
function block(ops){ const out=[]; for(let i=0;i<ops.length;i++){ const o=ops[i];
    if(o.t!=='if'){ out.push(...sh(opCode(o),out.length)); continue; }
    const inner=block(ops.slice(i+1,i+1+o.k)); i+=o.k;   // אם תא≠0 ⇒ קפוץ ל«עשה»; אחרת 15 ⇒ קפוץ מעל
    const head=PP(`WHERE ${o.i}; GO; TAKE`); const doAt=out.length+head.length+2+PP(F15).length+2; const skipAt=doAt+inner.length;
    out.push(...head,['WHERE',doAt,'code'],['JUMP'],...PP(F15),['WHERE',skipAt,'code'],['JUMP'],...sh(inner,doAt)); }
  return out; }
export function compileSplit(r){ const out=[]; const add=p=>out.push(...sh(p,out.length));
  add(block(r.a.init)); add(PP(F15)); const j1=out.length; out.push(null,['JUMP']); const b1=out.length; add(block(r.a.body)); const t1=out.length;
  add(PP(`WHERE ${r.a.cond}; GO; TAKE`)); out.push(['WHERE',b1,'code'],['JUMP']); out[j1]=['WHERE',t1,'code'];
  add(block(r.b.init)); add(PP(`WHERE 4; GO; ${F15}; PUT`)); const b2=out.length; add(block(r.b.body));
  add(PP(`WHERE 4; GO; TAKE; TAKE; TAKE; CALC; TAKE; CALC; ADD; PUT; TAKE; SHR; SHR; SHR`)); out.push(['WHERE',b2,'code'],['JUMP']); add(block(r.b.fin)); return out; }
