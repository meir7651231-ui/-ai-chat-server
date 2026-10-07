// «פריסה ושיתוף»: כלי שנבנה מכלים (יש לו מתכון expr) — נפרס בחזרה לחלקי-הבסיס; חלק שמופיע כמה פעמים (אותו חישוב על אותם קלטים) מחושב פעם אחת בלבד.
// ואז הידור של «גרף» (לא עץ): כל חלק לתא, וכשאף אחד כבר לא צריך אותו — התא משתחרר. אם אין מקום — «מגירה» בתאים 8–14.
const key=e=>e.cell!=null?'c'+e.cell:e.f+'('+[e.a,e.b,e.c].filter(Boolean).map(key).join(',')+')';
export function flatten(e,blocks,depth=0,MAXD=+(process.env.MAXD||20)){ if(e.cell!=null) return e; const kids=[e.a,e.b,e.c].filter(Boolean).map(k=>flatten(k,blocks,depth,MAXD));
  const b=blocks.get(e.f); if(b&&b.expr&&depth<MAXD){ const ins=(b.ins||[]).filter(c=>c<8); const sub=x=>x.cell!=null?(ins.indexOf(x.cell)>=0?kids[ins.indexOf(x.cell)]:x):{f:x.f,a:sub(x.a),b:x.b?sub(x.b):undefined,c:x.c?sub(x.c):undefined};
    return flatten(sub(b.expr),blocks,depth+1,MAXD); }
  return {f:e.f,a:kids[0],b:kids[1],c:kids[2]}; }
export function countNodes(e,seen=new Set()){ if(e.cell!=null) return 0; const k=key(e); if(seen.has(k)) return 0; seen.add(k); return 1+[e.a,e.b,e.c].filter(Boolean).reduce((s,x)=>s+countNodes(x,seen),0); }
export function treeSize(e){ return e.cell!=null?0:1+[e.a,e.b,e.c].filter(Boolean).reduce((s,x)=>s+treeSize(x),0); }
export function compileDAG(root,{ins,out=2,blocks,placements,rnd=false,EQ=new Map()}){ const R=k=>rnd?Math.floor(Math.random()*k):0;
  const nodes=new Map(), uses=new Map(); const visit=e=>{ if(e.cell!=null) return; const k=key(e); uses.set(k,(uses.get(k)||0)+1); if(nodes.has(k)) return; nodes.set(k,e); for(const x of [e.a,e.b,e.c].filter(Boolean)) visit(x); };
  visit(root); const order=[]; const done=new Set(); const sz=e=>e.cell!=null?0:1+[e.a,e.b,e.c].filter(Boolean).reduce((s,x)=>s+sz(x),0);
  const post=e=>{ if(e.cell!=null) return; const k=key(e); if(done.has(k)) return; done.add(k); const kids=[e.a,e.b,e.c].filter(Boolean).sort((x,y)=>sz(y)-sz(x)); for(const x of kids) post(x); order.push(k); }; post(root);
  const prog=[]; const loc=new Map(); const LOW=[4,5,6,7,2].filter(c=>!ins.includes(c)&&c!==out).concat(ins.includes(out)?[]:[]); const HIGH=[14,13,12,11,10,9,8].filter(c=>!ins.includes(c));
  const usedC=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]));
  const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
  const mv=(a,b)=>prog.push(['WHERE',a],['GO'],['TAKE'],['WHERE',b],['GO'],['PUT']);
  const holders=()=>new Set(loc.values());
  const cellOf=e=>e.cell!=null?e.cell:loc.get(key(e));
  // תא נמוך פנוי; אם אין — מעבירים ערך חי (שאינו ארגומנט) למגירה
  const freeLow=(args,avoid=[])=>{ let fr=LOW.filter(c=>!holders().has(c)&&!args.includes(c)&&!avoid.includes(c)); if(fr.length) return fr[R(fr.length)];
    for(const [kk,v] of [...loc]){ if(v>=8||args.includes(v)||avoid.includes(v)||!LOW.includes(v)) continue; const hf=HIGH.filter(c=>!holders().has(c)&&!args.includes(c)); if(!hf.length) return null; mv(v,hf[0]); loc.set(kk,hf[0]); return v; }
    return null; };
  for(const k of order){ const e=nodes.get(k); const kids=[e.a,e.b,e.c].filter(Boolean); const isRoot=k===key(root);
    const cands=(EQ.get(e.f)||[e.f]).map(n=>blocks.get(n)).filter(Boolean);
    // ארגומנטים בתאים נמוכים (0–7): מה שבמגירה — מחזירים לתא פנוי
    let args=kids.map(cellOf);
    for(let i=0;i<args.length;i++) if(args[i]>=8){ const f=freeLow(args); if(f==null) { if(process.env.FDBG) console.log('נכשל#0',e&&e.f); return null; } mv(args[i],f); for(const [kk,v] of loc) if(v===args[i]) loc.set(kk,f); args[i]=f; }
    // אותו ערך פעמיים (למשל א+א): מעתיקים לתא פנוי נוסף
    for(let i=1;i<args.length;i++) if(args.indexOf(args[i])<i){ const f=freeLow(args,[out]); if(f==null) { if(process.env.FDBG) console.log('נכשל#1',e&&e.f); return null; } mv(args[i],f); args[i]=f; }
    // שורש: אם תא-התשובה תפוס בארגומנט — מעבירים אותו לתא פנוי קודם
    if(isRoot&&args.includes(out)){ const h=holders(); const fr=[4,5,6,7,...HIGH].filter(c=>![...h].includes(c)&&!args.includes(c)&&!ins.includes(c)); if(!fr.length) { if(process.env.FDBG) console.log('נכשל#2',e&&e.f); return null; } const f=fr[0]; mv(out,f); for(const [kk,v] of loc) if(v===out) loc.set(kk,f); args=args.map(a=>a===out?f:a);
      for(let i=0;i<args.length;i++) if(args[i]>=8){ const h2=holders(); const fr2=[4,5,6,7].filter(c=>![...h2].includes(c)&&!args.includes(c)&&!ins.includes(c)); if(!fr2.length) { if(process.env.FDBG) console.log('נכשל#3',e&&e.f); return null; } mv(args[i],fr2[0]); for(const [kk,v] of loc) if(v===args[i]) loc.set(kk,fr2[0]); args[i]=fr2[0]; } }
    const tryPlace=()=>{ const h=holders(); const busy=new Set([...h].filter(c=>!args.includes(c)));
      const tgts=isRoot?[out]:LOW.filter(c=>!busy.has(c)&&!args.includes(c)).concat(LOW.filter(c=>!busy.has(c)&&args.includes(c)));
      for(const b of cands){ const P=b.movable===false?[{prog:b.prog,ins:(b.ins||[]).filter(c=>c<8),out:b.out??2}]:placements(b,6000);
        const ok=P.filter(p=>p.ins.join()===args.join()&&tgts.includes(p.out)&&!(busy.has(p.out))&&[...usedC(p.prog)].every(c=>c===p.out||args.includes(c)||(!busy.has(c)&&!ins.includes(c))));
        // תשובה לתא של ארגומנט — רק אם אף אחד אחר כבר לא צריך אותו ארגומנט
        const ok2=ok.filter(p=>!args.includes(p.out)||kids.every((x,i)=>args[i]!==p.out||x.cell==null&&(uses.get(key(x))||0)<=1));
        if(ok2.length) return ok2[R(ok2.length)]; }
      { if(process.env.FDBG) console.log('נכשל#4',e&&e.f); return null; } };
    let p=tryPlace();
    // לחץ-תאים: מעבירים ערכים חיים (שאינם ארגומנטים) למגירה ומנסים שוב
    if(!p){ for(const [kk,v] of [...loc]){ if(v>=8||args.includes(v)) continue; const boltU=new Set(cands.flatMap(b=>b.movable===false?[...usedC(b.prog)]:[])); const fr=HIGH.filter(c=>![...holders()].includes(c)&&!boltU.has(c)); if(!fr.length) break; mv(v,fr[0]); loc.set(kk,fr[0]); p=tryPlace(); if(p) break; } }
    if(!p&&isRoot&&holders().has(out)){ { if(process.env.FDBG) console.log('נכשל#5',e&&e.f); return null; } }
    if(!p){ if(process.env.FDBG) console.log('נכשל בצומת',e.f,'ארג',args.join(),'תפוסים',[...holders()].join(),'שורש',isRoot); { if(process.env.FDBG) console.log('נכשל#6',e&&e.f); return null; } }
    prog.push(...shift(p.prog,prog.length)); 
    // משחררים ילדים שאף אחד כבר לא צריך
    for(const x of kids){ if(x.cell!=null) continue; const kk=key(x); const u=(uses.get(kk)||1)-1; uses.set(kk,u); if(u<=0) loc.delete(kk); }
    for(const [kk,v] of [...loc]) if(v===p.out) loc.delete(kk);   // נדרס
    loc.set(k,p.out); }
  return prog; }
export { key };
