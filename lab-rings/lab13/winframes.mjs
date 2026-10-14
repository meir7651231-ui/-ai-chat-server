// «חלונות ומקומות» (winframes.mjs, KEY=win) — רשימה ⇒ מספר: תשובה מחלון / ממקום שמוגדר ביחס לרשימה או לסטטיסטיקה.
// אני כותב רק שלדים + חיפוש; כל חריץ (k, צד, סדר-עדיפות, קבוע, מטרה, כלי, לוח) — המכונה ממלאת מהדוגמאות בלבד:
//   קבועים וסדרים נלמדים בסימולציה על הדוגמאות, כלים מהמדף לפי הלוח שלהם, ולוח שאין לו כלי — נבנה ע"י בונה-הערכים.
// המסגרות:
//   חלון (W):        k האחרונים / הראשונים ⇒ מקסימום / מינימום / סכום / ממוצע-מעוגל-למטה (מצב-רחב) · רשימה ריקה ⇒ קבוע.
//   עדיפות (PR):     סדר-עדיפות π על 8..15 (נלמד: חיפוש על כל 40320 הסדרים) · ה-r-י (1/2) הנוכח ברשימה ⇒ ערכו / הבא אחריו / מקומו / הקודם לו.
//                    (מקסימום = π יורד, «הקרוב ל-t» = π לפי מרחק — לא כתוב בשום מקום, נלמד).
//   מצביע (PT):      j = g(מקור) (מקור: ראשון / אחרון / אורך; g: +c או כלי-מספר מהמדף) ⇒ האיבר במקום j (מחוץ לתחום ⇒ קבוע).
//   זוג-שכנים (AP):  ניקוד s(x, הבא) (חיבור או כלי-שניים מהמדף) ⇒ מקום / ערך של הזוג הטוב (מקס/מינ, שוויון: ראשון/אחרון).
//   חלק-מהסכום (HF): המקום הראשון שבו m·(סכום-רץ) ≥ הסכום (או >), m נלמד.
//   לפי-איבר (CS):   אם P(ראשון/אחרון) — כלי-רשימה A, אחרת B (P = לוח שנלמד, A/B מכלי-הרשימה שבמדף).
//   חתוך (TM):       ממוצע-מעוגל-למטה אחרי הוצאת קבוצה נלמדת מתוך {מקס, מינ, ראשון, אחרון}.
//   מכסה (QT):       max(0, Σ(x − q)) או max(0, Σ(q − x)) — q נלמד (מצב-רחב).
//   בין-שתיים (BT):  כמה איברים x ש-T[השוואה(x,A), השוואה(x,B)] — A,B סטטיסטיקות, T לוח-אמת שנלמד (9 כניסות).
//   רצף (RN):        הרצף הארוך ביותר / מספר הרצפים של איברים ב-S (S ⊆ 8..15 נלמד).
// החיפוש: סימולציה ב-JS על הדוגמאות ⇒ מועמדים ⇒ קוד-מכונה ⇒ 60 במכונה ⇒ בודק ⇒ בדיקה 2000.
import fs from 'fs'; import { run } from './machine3s.mjs'; import { makeChecker, finalCheck } from './tzoref.mjs';
import { scanTools, shift, dataCells, remap } from './scan-tools.mjs'; import { assemble } from './posframes.mjs';
import { valueBuild } from './tzoref-value.mjs'; import { _test as W2 } from './wide2frames.mjs'; import { lenOk } from './ladder-order.mjs';
const { ADDW, SUBW, JNE, CONST, SET, T_, P_, MV } = W2;
const R=k=>Math.floor(Math.random()*k); const J=JSON.stringify;
const walk=m=>{ const o=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ o.push(a); a=m[a]; } return o; };

// ─── 1. אבני-שלד ─────────────────────────────────────────────────────────────
const P15=[['TAKE'],['TAKE'],['CALC'],['TAKE'],['CALC']];
const GOTO=l=>[...P15,['J',l]];
const INC=c=>[...T_(c),...CONST[1],['ADD'],...P_(c)];
const DEC=c=>[...T_(c),...P15,['ADD'],...P_(c)];
const NEXTX=X=>[...T_(X),['WHERE@'],['GO'],['TAKE'],...P_(X)];
const BIT3=c=>[...T_(c),['SHR'],['SHR'],['SHR']];
const NEXTV=X=>[...T_(X),['WHERE@'],['GO'],['TAKE']];                       // דוחף mem[mem[X]]
// דוחף 1 אם a<b — לערכים שההפרש ביניהם ≤ 7 (איברי רשימה 8..15): ביט 3 של a−b
const LT8=(a,b)=>[...T_(a),...T_(b),['TAKE'],['CALC'],['ADD'],...CONST[1],['ADD'],['SHR'],['SHR'],['SHR']];
// דוחף 1 אם a<b לכל 0..15 (שאילה של a−b = ביט 3 של רוב(לא a, b, d)); s = תא-עזר
const LT4=(a,b,s)=>[...T_(a),...T_(b),['TAKE'],['CALC'],['ADD'],...CONST[1],['ADD'],...P_(s),
  ...T_(a),['TAKE'],['CALC'],...T_(b),['CALC'],
  ...T_(s),...T_(a),...T_(b),['TAKE'],['CALC'],['CALC'],['CALC'],
  ['CALC'],['SHR'],['SHR'],['SHR']];
let UID=0; const U_=p=>p+(++UID);
// כלי-מספר מהמדף במקומו (כמו ב-wide2frames): תאי-עבודה ⇒ תאים פנויים, או תאים חיים שנשמרים במחסנית סביבו
function callTool(f,inCells,outC,live){ const map={}; f.ins.forEach((c,i)=>{ map[c]=inCells[i]; }); map[f.out]=outC; const taken=new Set([...inCells,outC]);
  const scratch=dataCells(f.prog).filter(c=>map[c]==null); const cells=[0,2,3,4,5,6,7]; const free=cells.filter(c=>!taken.has(c)&&!live.has(c)), busy=cells.filter(c=>!taken.has(c)&&live.has(c)); const save=[];
  for(const c of scratch){ if(c>7) return null; if(free.length) map[c]=free.shift(); else if(busy.length){ const b=busy.shift(); map[c]=b; save.push(b); } else return null; }
  return [...save.flatMap(c=>T_(c)),{code:[['WHERE',0],['GO'],...shift(remap(f.prog,map),2)]},...[...save].reverse().flatMap(c=>P_(c))]; }
const EMPTY=(e,END)=>{ const u=U_('ne'); return [...T_(1),['J',u],...SET(2,e),...GOTO(END),u]; };
// מקור/סטטיסטיקה לתא c (X = הולך-עזר): ראשון / אחרון / מקסימום / מינימום / אורך
function statTo(kind,c,X){ const u=U_('st');
  if(kind==='first') return MV(1,c);
  if(kind==='last') return [...MV(1,c),u,...NEXTV(c),['J',u+'n'],...GOTO(u+'e'),u+'n',...NEXTX(c),...GOTO(u),u+'e'];
  if(kind==='n') return [...SET(c,0),...MV(1,X),u,...T_(X),['J',u+'n'],...GOTO(u+'e'),u+'n',...INC(c),...NEXTX(X),...GOTO(u),u+'e'];
  const better=kind==='max'?LT8(c,X):LT8(X,c);
  return [...MV(1,c),...MV(1,X),u,...T_(X),['J',u+'n'],...GOTO(u+'e'),u+'n',...better,['J',u+'u'],...GOTO(u+'x'),u+'u',...MV(X,c),u+'x',...NEXTX(X),...GOTO(u),u+'e']; }
const statSim={first:l=>l[0],last:l=>l[l.length-1],max:l=>Math.max(...l),min:l=>Math.min(...l),n:l=>l.length};

// ─── 2. המסגרות: סימולציה + קוד ──────────────────────────────────────────────
const FR={};
// W — חלון
FR.W={ sim(p,l){ const w=p.side==='last'?l.slice(-p.k):l.slice(0,p.k); if(!w.length) return p.e; const s=w.reduce((a,b)=>a+b,0);
    return (p.agg==='max'?Math.max(...w):p.agg==='min'?Math.min(...w):p.agg==='sum'?s:Math.floor(s/w.length))&15; },
  code(p){ const E='END'; const out=[...EMPTY(p.e,E)];
    if(p.side==='last') out.push(...MV(1,3),...MV(1,4),...SET(5,p.k),'A1',...T_(5),['J','A2'],...GOTO('B0'),'A2',...T_(4),['J','A3'],...GOTO('C0'),'A3',...NEXTX(4),...DEC(5),...GOTO('A1'),
      'B0',...T_(4),['J','B1'],...GOTO('C0'),'B1',...NEXTX(4),...NEXTX(3),...GOTO('B0'),'C0');
    else out.push(...MV(1,3));
    out.push(...SET(5,p.k));
    const loop=(body)=>['L',...T_(3),['J','L1'],...GOTO('LE'),'L1',...T_(5),['J','L2'],...GOTO('LE'),'L2',...body,...NEXTX(3),...DEC(5),...GOTO('L'),'LE'];
    if(p.agg==='max'||p.agg==='min') out.push(...MV(3,2),...loop([...(p.agg==='max'?LT8(2,3):LT8(3,2)),['J','UP'],...GOTO('NX'),'UP',...MV(3,2),'NX']));
    else if(p.agg==='sum') out.push(...SET(2,0),...loop([...T_(2),...T_(3),['ADD'],...P_(2)]));
    else out.push(...SET(4,0),...SET(6,0),...SET(7,0),...loop([...ADDW(4,6,3,0),...INC(7)]),...SET(2,0),'DV',...SUBW(4,6,7,0,E),...INC(2),...GOTO('DV'));
    out.push(E); return assemble(out); },
  desc:p=>`חלון: ${p.agg} של ${p.k} ה${p.side==='last'?'אחרונים':'ראשונים'} (ריק ⇒ ${p.e})` };
// PR — סדר-עדיפות
FR.PR={ sim(p,l){ const pres=p.pi.filter(v=>l.includes(v)); if(pres.length<p.r) return p.e; const v=pres[p.r-1], i=l.indexOf(v);
    return p.out==='val'?v:p.out==='next'?(l[i+1]||0):p.out==='idx'?i:(i?l[i-1]:0); },
  code(p){ const E='END', out=[]; if(p.r===2) out.push(...SET(5,0));
    p.pi.forEach((v,i)=>{ out.push(...SET(4,v),...MV(1,3),'m'+i,...T_(3),['J','b'+i],...GOTO('n'+i),'b'+i,...JNE(3,4,6,'c'+i),...GOTO('f'+i),'c'+i,...NEXTX(3),...GOTO('m'+i),'f'+i);
      if(p.r===2) out.push(...T_(5),['J','CH'],...SET(5,1)); else out.push(...GOTO('CH')); out.push('n'+i); });
    out.push(...SET(2,p.e),...GOTO(E),'CH');
    if(p.out==='val') out.push(...MV(4,2));
    else if(p.out==='next') out.push(...NEXTV(4),...P_(2));
    else if(p.out==='idx') out.push(...SET(2,0),...MV(1,3),'q',...JNE(3,4,6,'q1'),...GOTO(E),'q1',...NEXTX(3),...INC(2),...GOTO('q'));
    else out.push(...SET(2,0),...MV(1,3),'q',...JNE(3,4,6,'q1'),...GOTO(E),'q1',...MV(3,2),...NEXTX(3),...GOTO('q'));
    out.push(E); return assemble(out); },
  desc:p=>`עדיפות π=${p.pi.join('>')}: ה-${p.r} הנוכח ⇒ ${p.out} (אין ⇒ ${p.e})` };
// PT — מצביע
FR.PT={ sim(p,l){ if(!l.length) return p.e; const s=statSim[p.src](l); const j=p.g.kind==='add'?(s+p.g.c)&15:p.g.T[s]; return j<l.length?l[j]:p.d; },
  code(p){ const E='END', out=[...EMPTY(p.e,E),...statTo(p.src,5,3)];
    if(p.g.kind==='add') out.push(...T_(5),...CONST[p.g.c],['ADD'],...P_(4)); else { const t=callTool(p.g.tool,[5],4,new Set()); if(!t) throw new Error('אין מקום ל-g'); out.push(...t); }
    out.push(...MV(1,3),'L',...T_(4),['J','L1'],...MV(3,2),...GOTO(E),'L1',...NEXTX(3),...DEC(4),...T_(3),['J','L'],...SET(2,p.d),E); return assemble(out); },
  desc:p=>`מצביע: j=${p.g.kind==='add'?p.src+'+'+p.g.c:p.g.name+'('+p.src+')'} ⇒ האיבר במקום j (מחוץ ⇒ ${p.d}, ריק ⇒ ${p.e})` };
// AP — זוג-שכנים
FR.AP={ sim(p,l){ if(l.length<2) return p.e; let b=0, bs=-1;
    for(let i=0;i+1<l.length;i++){ const s=p.s.kind==='add'?(l[i]+l[i+1])&15:p.s.T[l[i]*16+l[i+1]]; if(bs<0) { b=i; bs=s; continue; }
      const better=p.sel==='max'?(p.tie==='first'?s>bs:s>=bs):(p.tie==='first'?s<bs:s<=bs); if(better){ b=i; bs=s; } }
    return p.out==='idx'?b:p.out==='a'?l[b]:l[b+1]; },
  code(p){ const E='END', out=[...EMPTY(p.e,E),...NEXTV(1),['J','a2'],...SET(2,p.e),...GOTO(E),'a2'];
    const score=()=>p.s.kind==='add'?[...T_(3),...NEXTV(3),['ADD'],...P_(6)]:(()=>{ const t=callTool(p.s.tool,[3,0],6,new Set([2,3,4,5])); if(!t) throw new Error('אין מקום ל-s'); return [...NEXTV(3),...P_(0),...t]; })();
    const keep=p.out==='idx'?MV(4,2):MV(3,2);
    out.push(...MV(1,3),...SET(4,0),...keep,...score(),...MV(6,5),
      'L',...NEXTX(3),...INC(4),...NEXTV(3),['J','L1'],...GOTO('FIN'),
      'L1',...score());
    const cmp=p.sel==='max'?(p.tie==='first'?{lt:[5,6],neg:false}:{lt:[6,5],neg:true}):(p.tie==='first'?{lt:[6,5],neg:false}:{lt:[5,6],neg:true});
    out.push(...LT4(cmp.lt[0],cmp.lt[1],7),['J',cmp.neg?'L':'UP'],...(cmp.neg?[]:GOTO('L')),'UP',...MV(6,5),...keep,...GOTO('L'),'FIN');
    if(p.out==='b') out.push(...NEXTV(2),...P_(2));
    out.push(E); return assemble(out); },
  desc:p=>`זוג-שכנים: ${p.sel} של ${p.s.kind==='add'?'x+הבא':p.s.name} (שוויון: ${p.tie}) ⇒ ${p.out} (פחות משניים ⇒ ${p.e})` };
// HF — חלק-מהסכום
FR.HF={ sim(p,l){ if(!l.length) return p.e; const t=l.reduce((a,b)=>a+b,0); let s=0; for(let i=0;i<l.length;i++){ s+=l[i]; if(p.strict?p.m*s>t:p.m*s>=t) return p.out==='idx'?i:l[i]; } return p.e; },
  code(p){ const E='END', base=p.strict?128:127; const out=[...EMPTY(p.e,E),...SET(4,base&15),...SET(5,base>>4),...MV(1,3),
      'T',...T_(3),['J','T1'],...GOTO('P0'),'T1',...ADDW(4,5,3,6),...NEXTX(3),...GOTO('T'),
      'P0',...MV(1,3),...SET(2,0),
      'P',...Array.from({length:p.m},()=>SUBW(4,5,3,6,'HIT')).flat(),...BIT3(5),['J','NO'],...GOTO('HIT'),
      'NO',...NEXTX(3),...INC(2),...T_(3),['J','P'],...SET(2,p.e),...GOTO(E),
      'HIT',...(p.out==='val'?MV(3,2):[]),E];
    return assemble(out); },
  desc:p=>`חלק-מהסכום: הראשון שבו ${p.m}·קידומת ${p.strict?'>':'≥'} סכום ⇒ ${p.out} (ריק ⇒ ${p.e})` };
// CS — לפי-איבר
FR.CS={ sim(p,l,ex){ if(!l.length) return p.e; const s=statSim[p.src](l); return p.tt[s]?ex.va[p.A]:ex.va[p.B]; },
  code(p){ const E='END'; const pred=callTool(p.pred,[3],0,new Set()); if(!pred) throw new Error('אין מקום ל-P');
    const Z=[['WHERE',0],['GO']];
    return assemble([...EMPTY(p.e,E),...statTo(p.src,3,4),...pred,...T_(0),['J','AA'],{code:[...Z,...shift(p.toolB.prog,2)]},...GOTO(E),'AA',{code:[...Z,...shift(p.toolA.prog,2)]},E]); },
  desc:p=>`לפי-איבר: P(${p.src}) ? «${p.toolA.name}» : «${p.toolB.name}» · P=${p.pred.name}` };
// TM — ממוצע אחרי הוצאה
FR.TM={ sim(p,l){ if(l.length<=p.drop.length) return p.e; let s=l.reduce((a,b)=>a+b,0); for(const d of p.drop) s-=statSim[d](l); return Math.floor(s/(l.length-p.drop.length))&15; },
  code(p){ const E='END'; const out=[...EMPTY(p.e,E),...SET(4,0),...SET(5,0),...SET(6,0),...MV(1,3),
      'T',...T_(3),['J','T1'],...GOTO('D0'),'T1',...ADDW(4,5,3,7),...INC(6),...NEXTX(3),...GOTO('T'),'D0'];
    p.drop.forEach((d,i)=>{ out.push(...T_(6),['J','ok'+i],...SET(2,p.e),...GOTO(E),'ok'+i,...statTo(d,2,3),...SUBW(4,5,2,7,E),...DEC(6)); });
    out.push(...T_(6),['J','DV0'],...SET(2,p.e),...GOTO(E),'DV0',...SET(2,0),'DV',...SUBW(4,5,6,7,E),...INC(2),...GOTO('DV'),E); return assemble(out); },
  desc:p=>`חתוך: ממוצע אחרי הוצאת {${p.drop.join(',')}} (קצר מדי ⇒ ${p.e})` };
// QT — מכסה לפריט
FR.QT={ sim(p,l){ const d=l.reduce((a,x)=>a+(p.neg?p.q-x:x-p.q),0); return Math.max(0,d)&15; },
  code(p){ const E='END'; return assemble([...SET(4,0),...SET(5,8),...SET(7,p.q),...MV(1,3),
      'L',...T_(3),['J','B'],...GOTO('E'),
      'B',...(p.neg?[...ADDW(4,5,7,6),...SUBW(4,5,3,6,'E')]:[...ADDW(4,5,3,6),...SUBW(4,5,7,6,'E')]),...NEXTX(3),...GOTO('L'),
      'E',...BIT3(5),['J','PS'],...SET(2,0),...GOTO(E),'PS',...MV(4,2),E]); },
  desc:p=>`מכסה: max(0, Σ(${p.neg?p.q+'−x':'x−'+p.q}))` };
// BT — כמה איברים לפי השוואה לשתי סטטיסטיקות
const cmp3=(x,a)=>x===a?0:x<a?1:2;
FR.BT={ sim(p,l){ if(!l.length) return p.e; const A=statSim[p.A](l), B=statSim[p.B](l); let c=0; for(const x of l) c+=p.T[cmp3(x,A)+3*cmp3(x,B)]; return c&15; },
  code(p){ const E='END'; const tl=callTool(p.tool,[6],7,new Set([2,3,4,5])); if(!tl) throw new Error('אין מקום ל-T');
    return assemble([...EMPTY(p.e,E),...statTo(p.A,4,3),...statTo(p.B,5,3),...SET(2,0),...MV(1,3),
      'L',...T_(3),['J','B'],...GOTO(E),
      'B',...LT8(3,5),...LT8(5,3),...LT8(5,3),['ADD'],['ADD'],...P_(6),
      ...LT8(3,4),...LT8(4,3),...LT8(4,3),['ADD'],['ADD'],...T_(6),['ADD'],...T_(6),['ADD'],...T_(6),['ADD'],...P_(6),
      ...tl,...T_(2),...T_(7),['ADD'],...P_(2),...NEXTX(3),...GOTO('L'),E]); },
  desc:p=>`בין-שתיים: כמה x עם T[x?${p.A}, x?${p.B}] · T=${p.T.join('')}` };
const btKey=(ca,cb)=>ca+3*cb;   // מפתח בקוד: השוואה ל-A + 3·השוואה ל-B (0..8)
// RN — רצפים
FR.RN={ sim(p,l){ let b=0,c=0,k=0; for(const x of l){ if(p.S[x]){ c++; if(c===1) k++; if(c>b) b=c; } else c=0; } return (p.out==='longest'?b:k)&15; },
  code(p){ const E='END'; const pred=p.pred.kind==='ge'?[...SET(7,p.pred.t-1),...LT8(7,3)]:p.pred.kind==='le'?[...SET(7,p.pred.t+1),...LT8(3,7)]
      :(()=>{ const t=callTool(p.pred.tool,[3],6,new Set([2,3,4])); if(!t) throw new Error('אין מקום ל-S'); return [...t,...T_(6)]; })();
    const onTrue=p.out==='longest'?[...INC(4),...LT4(2,4,5),['J','U'],...GOTO('N'),'U',...MV(4,2)]:[...T_(4),['J','N'],...SET(4,1),...INC(2)];
    return assemble([...SET(2,0),...SET(4,0),...MV(1,3),
      'L',...T_(3),['J','B'],...GOTO(E),
      'B',...pred,['J','Y'],...SET(4,0),...GOTO('N'),
      'Y',...onTrue,
      'N',...NEXTX(3),...GOTO('L'),E]); },
  desc:p=>`רצף: ${p.out==='longest'?'הארוך ביותר':'מספר הרצפים'} של איברים ב-{${p.S.map((v,i)=>v?i:null).filter(x=>x!=null).join(',')}} (${p.pred.name||p.pred.kind+' '+p.pred.t})` };

// ─── 3. למידת החריצים מהדוגמאות ──────────────────────────────────────────────
// קבוע ל«מקרה-קצה» (cond): כל הדוגמאות שבהן הוא חל חייבות להסכים; אין כאלה ⇒ 0
const edge=(ex,cond)=>{ let e=null; for(const x of ex) if(cond(x.l)){ if(e==null) e=x.want; else if(e!==x.want) return null; } return e??0; };
const fits=(fr,p,ex)=>{ for(const x of ex) if(FR[fr].sim(p,x.l,x)!==x.want) return false; return true; };
let PERMS=null; const perms=()=>{ if(PERMS) return PERMS; const out=[]; const a=[8,9,10,11,12,13,14,15]; const rec=(k)=>{ if(k===8){ out.push(a.slice()); return; } for(let i=k;i<8;i++){ [a[k],a[i]]=[a[i],a[k]]; rec(k+1); [a[k],a[i]]=[a[i],a[k]]; } }; rec(0); PERMS=out; return out; };
function* plans(ex,ctx){
  const {U,B}=ctx;
  // W
  for(const agg of ['max','min','sum','mean']) for(const side of ['last','first']) for(let k=1;k<=7;k++){ const e=edge(ex,l=>!l.length); if(e==null) continue; const p={fr:'W',side,k,agg,e}; if(fits('W',p,ex)) yield p; }
  // QT
  for(const neg of [false,true]) for(let q=0;q<16;q++){ const p={fr:'QT',q,neg}; if(fits('QT',p,ex)) yield p; }
  // HF
  for(const out of ['idx','val']) for(const strict of [false,true]) for(let m=1;m<=4;m++){ const e=edge(ex,l=>!l.length); if(e==null) continue; const p={fr:'HF',m,strict,out,e}; if(fits('HF',p,ex)) yield p; }
  // TM
  for(const drop of [['max','min'],['max'],['min'],['first','last'],['first'],['last'],['max','first'],['max','last'],['min','first'],['min','last']]){ const e=edge(ex,l=>l.length<=drop.length); if(e==null) continue; const p={fr:'TM',drop,e}; if(fits('TM',p,ex)) yield p; }
  // PT
  for(const src of ['first','last','n']){ const e=edge(ex,l=>!l.length); if(e==null) continue;
    const gs=[...Array.from({length:16},(_,c)=>({kind:'add',c})),...U.map(t=>({kind:'tool',T:t.T,tool:t,name:t.name}))];
    for(const g of gs){ // d: the value when j is out of range — learned
      let d=null, ok=true; for(const x of ex){ const l=x.l; if(!l.length) continue; const s=statSim[src](l); const j=g.kind==='add'?(s+g.c)&15:g.T[s]; if(j<0){ ok=false; break; } if(j>=l.length){ if(d==null) d=x.want; else if(d!==x.want){ ok=false; break; } } }
      if(!ok) continue; const p={fr:'PT',src,g,d:d??0,e}; if(fits('PT',p,ex)) yield p; } }
  // AP
  { const e=edge(ex,l=>l.length<2); if(e!=null){ const ss=[{kind:'add'},...B.map(t=>({kind:'tool',T:t.T,tool:t,name:t.name}))];
    for(const s of ss) for(const sel of ['max','min']) for(const tie of ['first','last']) for(const out of ['idx','a','b']){ const p={fr:'AP',s,sel,tie,out,e}; if(fits('AP',p,ex)) yield p; } } }
  // RN (S ⊆ 8..15: all 256)
  for(const out of ['longest','runs']) for(let mask=1;mask<256;mask++){ const S=Array.from({length:16},(_,v)=>v>=8&&(mask>>(v-8))&1?1:0); const p={fr:'RN',S,out,mask}; if(fits('RN',p,ex)) yield p; }
  // BT (A,B סטטיסטיקות; T: 512 לוחות על 9 צירופים — נפתר מהספירות)
  { const st=['first','last','max','min']; const e=edge(ex,l=>!l.length);
    if(e!=null) for(let i=0;i<st.length;i++) for(let j=i+1;j<st.length;j++){ const A=st[i], Bs=st[j];
      const rows=ex.filter(x=>x.l.length).map(x=>{ const a=statSim[A](x.l), b=statSim[Bs](x.l); const N=new Array(9).fill(0); for(const v of x.l) N[cmp3(v,a)+3*cmp3(v,b)]++; return {N,w:x.want}; });
      for(let t=1;t<512;t++){ let ok=true; for(const r of rows){ let c=0; for(let q=0;q<9;q++) if((t>>q)&1) c+=r.N[q]; if((c&15)!==r.w){ ok=false; break; } } if(!ok) continue;
        const T=Array.from({length:9},(_,q)=>(t>>q)&1); const p={fr:'BT',A,B:Bs,T,e}; if(fits('BT',p,ex)) yield p; } } }
  // PR (סדר-עדיפות: כל 40320 הסדרים)
  //   סדר שלא נקבע לגמרי מהדוגמאות (זוג שכמעט לא נפגש) ⇒ בודקים על עוד 3000 דוגמאות (סימולציה בלבד) — כך הסדר הנכון נקבע
  for(const r of [1,2]){ const e=edge(ex,l=>l.length<r); if(e==null) continue; const E2=ex.filter(x=>x.l.length>=r); let E3=null;
    for(const out of ['val','next','idx','prev']){ let n=0;
      for(const pi of perms()){ const p={fr:'PR',pi,r,out,e}; let ok=true; for(const x of E2) if(FR.PR.sim(p,x.l)!==x.want){ ok=false; break; } if(!ok) continue;
        if(!E3) E3=ctx.more().filter(x=>x.l.length>=r); for(const x of E3) if(FR.PR.sim(p,x.l)!==x.want){ ok=false; break; } if(!ok) continue;
        yield p; if(++n>=3) break; } } }
  // CS (לפי-איבר) — כלי-רשימה מהמדף
  if(ctx.LT.length){ const e=edge(ex,l=>!l.length); if(e!=null) for(const src of ['first','last']) for(let a=0;a<ctx.LT.length;a++) for(let b=0;b<ctx.LT.length;b++){ if(a===b) continue;
      const tt=new Array(16).fill(-1); let ok=true;
      for(const x of ex){ if(!x.l.length) continue; const s=statSim[src](x.l); const okA=x.va[a]===x.want, okB=x.va[b]===x.want; if(!okA&&!okB){ ok=false; break; }
        if(okA&&okB) continue; const need=okA?1:0; if(tt[s]>=0&&tt[s]!==need){ ok=false; break; } tt[s]=need; }
      if(!ok||!tt.some(v=>v===1)||!tt.some(v=>v===0)) continue; yield {fr:'CS',src,A:a,B:b,tt:tt.map(v=>v===1?1:0),known:tt,e}; } }
}

// כלי-רשימה בטוחים מהמדף (עונים בתא 2, לא נוגעים ברשימה, ניידים) — כמו ב-listcomp
function listTools(ex){ const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const out=[];
  const PAD=[['WHERE',0],['GO'],['WHERE',0],['GO'],['WHERE',0],['GO']];
  for(const b of sh.named){ if(b.bad||!b.prog.some(x=>x[0]==='WHERE@')||!lenOk(b,+process.env.MAXTOOL||400)) continue; let ok=true; const v=[]; const moved=[...PAD,...shift(b.prog,PAD.length)];
    for(const x of ex){ const r=run(b.prog,x.e.mem,{maxSteps:20000}); if(!r||r.st.length||[1,8,9,10,11,12,13,14,15].some(c=>r.mem[c]!==x.e.mem[c])){ ok=false; break; } const r2=run(moved,x.e.mem,{maxSteps:20000}); if(!r2||r2.st.length||r2.mem[2]!==r.mem[2]){ ok=false; break; } v.push(r.mem[2]&15); }
    if(ok&&!out.some(t=>J(t.v)===J(v))) out.push({name:b.name,prog:b.prog,v}); }
  return out; }
// לוח שנלמד (keys ⇒ ערך) ⇒ כלי: קודם כלי-מספר מהמדף שמסכים על כל המפתחות, אחרת בונה-הערכים בונה אותו
function tableTool(tab,keys,U,{exact=true,ms=60000,name='לוח שנלמד (חלונות)'}={}){
  for(const t of U) if(keys.every(k=>exact?t.T[k]===tab[k]:(t.T[k]>=0&&!!t.T[k]===!!tab[k]))) return {...t,name:t.name};
  if(ms<5000) return null;
  const g=()=>{ const k=keys[R(keys.length)]; const m=Array.from({length:16},()=>R(16)); m[3]=k; const w=tab[k]; return {mem:m,want:w,ok:r=>r[2]===w&&r[3]===k}; };
  const v=valueBuild(g,{name,ins:[3],out:2,ms}); if(!v.prog) return null; return {ins:[3],out:2,prog:v.prog,name:'לוח שנבנה ['+keys.map(k=>k+':'+tab[k]).join(' ')+']'}; }

// ─── 4. החיפוש ───────────────────────────────────────────────────────────────
export function winCompose(gen,{N=400,ms=+process.env.WINMS||150000,say=()=>{},maxTry=30}={}){ const T0=Date.now(), DEAD=T0+ms;
  const raw=Array.from({length:N},()=>gen()); if(typeof raw[0].want!=='number') return {prog:null,cands:0,ms:0};
  const ex=raw.map(e=>({l:walk(e.mem),want:e.want&15,e}));
  const {U,B}=scanTools(); const LT=listTools(ex.slice(0,150));
  // ערכי כלי-הרשימה על כל הדוגמאות (CS)
  for(const x of ex) x.va=LT.map(t=>{ const r=run(t.prog,x.e.mem,{maxSteps:20000}); return r?r.mem[2]&15:-1; });
  let MORE=null; const more=()=>MORE||(MORE=Array.from({length:3000},()=>{ const e=gen(); return {l:walk(e.mem),want:e.want&15}; }));
  const ctx={U,B,LT,more}; const chk=makeChecker(gen,300,60000); let tried=0, cands=0; const seen=new Set();
  for(const p0 of plans(ex,ctx)){ if(Date.now()>DEAD||tried>=maxTry) break; cands++; let p=p0;
    try{
      if(p.fr==='CS'){ const keys=[]; for(let v=8;v<16;v++) if(p.known[v]>=0) keys.push(v); const t=tableTool(p.tt,keys,U,{exact:false,ms:Math.min(60000,DEAD-Date.now()-10000)}); if(!t) continue; p={...p,pred:t,toolA:LT[p.A],toolB:LT[p.B]}; }
      if(p.fr==='BT'){ const keys=[], tab=new Array(16).fill(0); for(let a=0;a<3;a++) for(let b=0;b<3;b++){ const k=btKey(a,b); keys.push(k); tab[k]=p.T[a+3*b]; } const t=tableTool(tab,keys,U,{ms:Math.min(60000,DEAD-Date.now()-10000)}); if(!t) continue; p={...p,tool:t}; }
      if(p.fr==='RN'){ const vs=[8,9,10,11,12,13,14,15], inS=vs.filter(v=>p.S[v]); let pred=null;
        const ge=vs.find(t=>vs.every(v=>!!p.S[v]===(v>=t))), le=vs.slice().reverse().find(t=>vs.every(v=>!!p.S[v]===(v<=t)));
        if(ge>8) pred={kind:'ge',t:ge}; else if(le!=null&&le<15) pred={kind:'le',t:le};
        else { const t=tableTool(p.S,vs,U,{exact:false,ms:Math.min(60000,DEAD-Date.now()-10000)}); if(!t) continue; pred={kind:'tool',tool:t,name:t.name}; }
        if(!inS.length) continue; p={...p,pred}; }
    }catch(err){ say('  חריץ: '+err.message); continue; }
    let prog; try{ prog=FR[p.fr].code(p); }catch(err){ say('  קוד: '+err.message); continue; }
    const key=J(prog); if(seen.has(key)) continue; seen.add(key); tried++;
    const bad=ex.slice(0,60).filter(x=>{ const r=run(prog,x.e.mem,{maxSteps:60000}); return !r||r.st.length||!x.e.ok(r.mem); }).length;
    if(bad){ say(`  ✗ במכונה (${bad}/60): ${FR[p.fr].desc(p)}`); continue; }
    if(!chk(prog)){ say('  ✗ בבודק: '+FR[p.fr].desc(p)); continue; }
    const fc=finalCheck(prog,gen,2000); if(fc.bad){ say(`  ✗ בבדיקה (${fc.bad}/2000): ${FR[p.fr].desc(p)}`); continue; }
    return {prog,how:'חלונות: '+FR[p.fr].desc(p),cands,tried,ms:Date.now()-T0}; }
  return {prog:null,cands,tried,ms:Date.now()-T0}; }
export const _win={callTool,FR,LT8,LT4,assemble,statTo,plans};
