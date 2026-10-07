// הצורף — רשימת המטרות: לכל לבנה, מה היא צריכה להוציא (מחולל דוגמאות) ואילו תאים אסור לה לשנות.
// מקור אחד לכל המטרות — במקום עותקים מפוזרים בכל קובץ (שם נולדו טעויות: בודק אחד בדק קלט, אחר לא).
const LIST=[0,1,8,9,10,11,12,13,14,15];
const R=(k)=>Math.floor(Math.random()*k);
const shuf=()=>{ const p=[8,9,10,11,12,13,14,15]; for(let i=7;i>0;i--){ const j=R(i+1); [p[i],p[j]]=[p[j],p[i]]; } return p; };
// שתי כניסות (תא 0, תא 1) ⇒ תשובה בתא 2
const M=(f)=>()=>{ const m=Array.from({length:16},()=>R(16)); if(Math.random()<0.25) m[1]=m[0]; const w=f(m[0],m[1]); return {mem:m,want:w,ok:r=>r[2]===w}; };
// רשימה מקושרת (ראש בתא 1, «הבא» של כל איבר בתא שלו, 0 = סוף) ⇒ תשובה בתא 2
const LG=(f,key)=>()=>{ const m=new Array(16).fill(0); const l=shuf().slice(0,R(9)); m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; }); if(key) m[0]=8+R(8);
  const w=f(l,m); const mem=m.map((v,k)=>LIST.includes(k)?v:R(16)); return {mem,want:w,ok:r=>r[2]===w}; };
const mx=l=>l.length?Math.max(...l):0, mn=l=>l.length?Math.min(...l):15;
// טבלת-אמת של 3 כניסות (תאים 0,1,3), ביט אחרי ביט ⇒ תא 2
export const truth=(t)=>()=>{ const m=Array.from({length:16},()=>R(16)); const a=m[0],b=m[1],c=m[3]; let w=0;
  for(let k=0;k<4;k++){ const idx=(((a>>k)&1)<<2)|(((b>>k)&1)<<1)|((c>>k)&1); w|=((t>>idx)&1)<<k; } return {mem:m,want:w,ok:r=>r[2]===w}; };
const walk=(mem)=>{ const out=[]; let a=mem[1]; for(let i=0;a&&i<10;i++){ out.push(a); a=mem[a]; } return out; };
// מטרה של תא אחד: תשובה בתא 2 (want = התשובה הנכונה — הבונה משתמש בה כדי לזהות מבוי סתום)
const cell=(f,prep)=>()=>{ const m=Array.from({length:16},()=>R(16)); if(prep) prep(m); const w=f(m); return {mem:m,want:w,ok:r=>r[2]===w}; };
// מטרה של רשימה באורך עד maxLen
const list=(maxLen,f,key)=>()=>{ const m=new Array(16).fill(0); const l=shuf().slice(0,R(maxLen+1)); m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; }); if(key) m[0]=8+R(8);
  const w=f(l,m); const mem=m.map((v,k)=>LIST.includes(k)?v:R(16)); return typeof w==='function'?{mem,ok:w}:{mem,want:w,ok:r=>r[2]===w}; };
// מטרות-עזר שהצורף גילה בעצמו («מה חסר לי») — טבלה של זוגות (תא0, תא1) ⇒ תשובה בתא 2
import fs from 'fs';
export function learnedGoals(){ try{ return JSON.parse(fs.readFileSync(new URL('./tzoref-learned-goals.json',import.meta.url),'utf8')); }catch{ return {}; } }
const tableGoal=(pairs)=>()=>{ const [a,b,w]=pairs[R(pairs.length)]; const m=Array.from({length:16},()=>R(16)); m[0]=a; m[1]=b; return {mem:m,want:w,ok:r=>r[2]===w}; };
// מטרה-נלמדת עם טבלה מלאה על תאי-קלט כלשהם (משימה שהמכונה בנתה ושמה במדף)
const tableGoalN=(ins,tt)=>()=>{ const m=Array.from({length:16},()=>R(16)); let i=0; for(const c of ins) i=i*16+m[c]; const w=tt[i]; return {mem:m,want:w,ok:r=>r[2]===w}; };
export function goals(){ const G={}; for(const [n,g] of Object.entries(learnedGoals())) G[n]=g.listlf?{gen:list(8,(l=>{ const F=new Function('l','return ('+g.listlf+')(l)'); return l2=>(mem)=>JSON.stringify(walk(mem))===JSON.stringify(F(l2)); })())}:g.listf?{gen:list(8,new Function('l','return ('+g.listf+')(l)&15'))}:g.tt?{gen:tableGoalN(g.ins,g.tt),ins:g.ins,out:2}:{gen:tableGoal(g.pairs),ins:[0,1],out:2};   /* listf: מטרת-רשימה שנלמדה (מקור הפונקציה כטקסט) */
  Object.assign(G,{
    'העתק':{gen:cell(m=>m[0])}, 'לא (מספר)':{gen:cell(m=>~m[0]&15)}, 'וגם (מספרים)':{gen:cell(m=>m[0]&m[1])}, 'נאנד (מספרים)':{gen:cell(m=>~(m[0]&m[1])&15)}, 'או (מספרים)':{gen:cell(m=>m[0]|m[1])}, 'שונה (מספרים)':{gen:cell(m=>m[0]^m[1])},
    'קבוע 15':{gen:cell(()=>15)}, 'קבוע 14 (15 ועוד 15)':{gen:cell(()=>14)}, 'קבוע 1':{gen:cell(()=>1)}, 'ועוד 1':{gen:cell(m=>(m[0]+1)&15)}, 'חיבור מספרים':{gen:cell(m=>(m[0]+m[1])&15)},
    'שווה (מספרים)':{gen:cell(m=>m[0]===m[1]?15:0,m=>{ if(R(2)) m[1]=m[0]; })},
    'קח מהכתובת שבתא':{gen:cell(m=>m[m[0]],m=>{ m[0]=8+R(8); })},
    'כתוב לכתובת שבתא':{gen:()=>{ const m=Array.from({length:16},()=>R(16)); m[0]=8+R(8); m[1]=1+R(15); const a=m[0],w=m[1]; return {mem:m,ok:r=>r[a]===w}; }},
    'דלג אם לא-אפס (תא0 אפס ⇒ העתק תא1)':{gen:cell(m=>m[0]?0:m[1],m=>{ m[0]=R(2)?1+R(15):0; m[1]=1+R(15); m[2]=0; })},
    'אם (תא0 לא-אפס ⇒ תא1, אחרת תא3)':{gen:cell(m=>m[0]?m[1]:m[3],m=>{ m[0]=R(2)?1+R(15):0; m[1]=1+R(15); m[3]=1+R(15); })},
    'ועוד 1 באותו תא':{gen:cell(m=>(m[2]+1)&15),ins:[2],out:2},
    // מדרגות-ביניים לסולם (כמו ב-27/9: קודם «לא-וגם», אחר כך «לא» באותו תא, ורק אז «וגם»)
    'לא-וגם (מספרים)':{gen:cell(m=>~(m[0]&m[1])&15),ins:[0,1],out:2}, 'לא באותו תא':{gen:cell(m=>~m[2]&15),ins:[2],out:2},
    'צעד ברשימה (הראשון, או 0)':{gen:list(3,l=>l[0]||0)},
    'סוף רשימה באורך עד 2':{gen:list(2,l=>l.length?l[l.length-1]:0)},
    'סוף רשימה (לולאה, עד 6)':{gen:list(6,l=>l.length?l[l.length-1]:0)},
    'אורך רשימה (לולאה + ספירה)':{gen:list(8,l=>l.length)},
    'חפש ברשימה':{gen:list(8,(l,m)=>l.includes(m[0])?15:0,true)},
    'סכום רשימה':{gen:list(8,l=>l.reduce((a,b)=>a+b,0)&15)},
    'הגדול ברשימה':{gen:list(8,l=>l.length?Math.max(...l):0)},
    'הפוך רשימה':{gen:list(8,l=>(mem)=>JSON.stringify(walk(mem))===JSON.stringify([...l].reverse()))},
    'מיין רשימה':{gen:list(8,l=>(mem)=>JSON.stringify(walk(mem))===JSON.stringify([...l].sort((a,b)=>a-b)))},
  });
  Object.assign(G,{'חיסור':{gen:M((a,b)=>(a-b)&15)},'ועוד 2':{gen:M(a=>(a+2)&15)},'קטן מ-':{gen:M((a,b)=>a<b?15:0)},'גדול מ-':{gen:M((a,b)=>a>b?15:0)},
    'מינימום':{gen:M((a,b)=>Math.min(a,b))},'מקסימום':{gen:M((a,b)=>Math.max(a,b))},
    'הקטן ברשימה':{gen:LG(l=>mn(l))},'ספור גדולים מ-X':{gen:LG((l,m)=>l.filter(x=>x>m[0]).length,true)},
    'סכום בלי הגדול':{gen:LG(l=>(l.reduce((a,b)=>a+b,0)-mx(l))&15)},
    'כמה מעל האמצע':{gen:LG(l=>{ const a=mx(l),b=mn(l),mid=(b+(((a-b)&15)>>1))&15; return l.filter(x=>x>mid).length; })},
    'טווח הרשימה':{gen:LG(l=>(mx(l)-mn(l))&15)},
    // «גדול וקטן»: שתי תשובות — תא 6 = הגדול, תא 7 = הקטן
    'גדול וקטן':{gen:()=>{ const e=LG(()=>0)(); const l=[]; let a=e.mem[1]; while(a){ l.push(a); a=e.mem[a]; } return {mem:e.mem,ok:r=>r[6]===mx(l)&&r[7]===mn(l)}; }},
  });
  // לבנים חדשות (שעוד אין במדף) — משימות לצורף
  Object.assign(G,{
    'כפול 2':{gen:cell(m=>(m[0]*2)&15),ins:[0],out:2}, 'חצי':{gen:cell(m=>m[0]>>1),ins:[0],out:2}, 'פחות 1':{gen:cell(m=>(m[0]+15)&15),ins:[0],out:2},
    'אפס?':{gen:cell(m=>m[0]===0?15:0,m=>{ if(R(2)) m[0]=0; }),ins:[0],out:2}, 'זוגי?':{gen:cell(m=>(m[0]&1)?0:15),ins:[0],out:2},
    'גדול או שווה':{gen:cell(m=>m[0]>=m[1]?15:0,m=>{ if(R(4)===0) m[1]=m[0]; }),ins:[0,1],out:2},
    'הפרש מוחלט':{gen:cell(m=>Math.abs(m[0]-m[1])),ins:[0,1],out:2},
    'הגדול מבין שלושה':{gen:cell(m=>Math.max(m[0],m[1],m[3])),ins:[0,1,3],out:2}, 'הקטן מבין שלושה':{gen:cell(m=>Math.min(m[0],m[1],m[3])),ins:[0,1,3],out:2},
    // מבחן קשה: משימות שצריכות 3 חלקים ומעלה
    'חציון של שלושה':{gen:cell(m=>[m[0],m[1],m[3]].sort((a,b)=>a-b)[1]),ins:[0,1,3],out:2}, 'ממוצע':{gen:cell(m=>(m[0]+m[1])>>1),ins:[0,1],out:2},
    'הגבל לתחום':{gen:cell(m=>Math.min(Math.max(m[0],m[1]),m[3])),ins:[0,1,3],out:2}, 'חיסור רווי':{gen:cell(m=>m[0]>m[1]?m[0]-m[1]:0),ins:[0,1],out:2},
    'מרחק מ-8':{gen:cell(m=>Math.abs(m[0]-8)),ins:[0],out:2}, 'סכום רווי':{gen:cell(m=>Math.min(m[0]+m[1],15)),ins:[0,1],out:2},
    'הגדול כפול 2':{gen:cell(m=>(Math.max(m[0],m[1])*2)&15),ins:[0,1],out:2}, 'שלושה שווים?':{gen:cell(m=>m[0]===m[1]&&m[1]===m[3]?15:0,m=>{ if(R(2)){ m[1]=m[0]; if(R(2)) m[3]=m[0]; } }),ins:[0,1,3],out:2},
    // ── מבחן גדול: 20 משימות חדשות (הצורף לא ראה אותן) ──
    'מ1 שלוש פעמים':{gen:cell(m=>(3*m[0])&15),ins:[0],out:2}, 'מ2 כפול 4':{gen:cell(m=>(4*m[0])&15),ins:[0],out:2},
    'מ3 הפרש ריבועים':{gen:cell(m=>(m[0]*m[0]-m[1]*m[1])&15),ins:[0,1],out:2}, 'מ4 חיבור אם זוגי אחרת חיסור':{gen:cell(m=>(m[0]%2===0?m[0]+m[1]:m[0]-m[1])&15),ins:[0,1],out:2},
    'מ5 הקטן מבין א ו-ב+1':{gen:cell(m=>Math.min(m[0],(m[1]+1)&15)),ins:[0,1],out:2}, 'מ6 אפס או שלוש?':{gen:cell(m=>(m[0]===0||m[0]===3)?15:0,m=>{ if(R(2)) m[0]=[0,3][R(2)]; }),ins:[0],out:2},
    'מ7 חזקת 3':{gen:cell(m=>(m[0]*m[0]*m[0])&15),ins:[0],out:2}, 'מ8 שארית ב-3':{gen:cell(m=>m[0]%3),ins:[0],out:2},
    'מ9 חצי מעוגל למעלה':{gen:cell(m=>(m[0]+1)>>1),ins:[0],out:2}, 'מ10 טווח של שלושה':{gen:cell(m=>Math.max(m[0],m[1],m[3])-Math.min(m[0],m[1],m[3])),ins:[0,1,3],out:2},
    'ר1 סכום הזוגיים':{gen:list(8,l=>l.filter(x=>x%2===0).reduce((a,b)=>a+b,0)&15)}, 'ר2 ספור גדולים מ-12':{gen:list(8,l=>l.filter(x=>x>12).length)},
    'ר3 האחרון פחות הראשון':{gen:list(8,l=>l.length?(l[l.length-1]-l[0])&15:0)}, 'ר4 הקטן פחות 8':{gen:list(8,l=>l.length?Math.min(...l)-8:7)},
    'ר5 האם כולם אי-זוגיים?':{gen:list(8,l=>l.every(x=>x%2)?15:0)}, 'ר6 כמה גדולים מהראשון':{gen:list(8,l=>l.filter(x=>l.length&&x>l[0]).length)},
    'ר7 סכום כפול 2':{gen:list(8,l=>(2*l.reduce((a,b)=>a+b,0))&15)}, 'ר8 הגדול פחות האורך':{gen:list(8,l=>((l.length?Math.max(...l):0)-l.length)&15)},
    'ר9 האם יש שניים עוקבים?':{gen:list(8,l=>l.some((x,i)=>i&&x===l[i-1]+1)?15:0)}, 'ר10 האם יורדת?':{gen:list(8,l=>l.every((x,i)=>!i||l[i-1]>x)?15:0)},
    'חילוק':{gen:cell(m=>Math.floor(m[0]/m[1]),m=>{ if(!m[1]) m[1]=1+R(15); }),ins:[0,1],out:2}, 'שארית':{gen:cell(m=>m[0]%m[1],m=>{ if(!m[1]) m[1]=1+R(15); }),ins:[0,1],out:2},
    'כפל':{gen:cell(m=>(m[0]*m[1])&15),ins:[0,1],out:2}, 'חזקת 2 (תא0 בריבוע)':{gen:cell(m=>(m[0]*m[0])&15),ins:[0],out:2},
    'בחר לפי זוגי':{gen:cell(m=>(m[0]&1)?m[3]:m[1]),ins:[0,1,3],out:2},
    'ועוד 3':{gen:cell(m=>(m[0]+3)&15),ins:[0],out:2}, 'סכום שלושה':{gen:cell(m=>(m[0]+m[1]+m[3])&15),ins:[0,1,3],out:2},
    'השני ברשימה':{gen:list(8,l=>l[1]||0)},
    'ספור זוגיים ברשימה':{gen:list(8,l=>l.filter(x=>x%2===0).length)}, 'האם ממוינת?':{gen:list(8,l=>l.every((x,i)=>!i||l[i-1]<x)?15:0)}, 'הגדול כפול הקטן':{gen:list(8,l=>l.length?(Math.max(...l)*Math.min(...l))&15:0)}, 'ספור עליות':{gen:list(8,l=>l.filter((x,i)=>i&&x>l[i-1]).length)}, 'השני בגודלו':{gen:list(8,l=>[...l].sort((a,b)=>b-a)[1]||0)}, 'ספור ירידות':{gen:list(8,l=>l.filter((x,i)=>i&&x<l[i-1]).length)}, 'ממוצע הרשימה (בערך)':{gen:list(8,l=>l.length?Math.floor(l.reduce((a,b)=>a+b,0)/l.length)&15:0)},
    'מקסימום נייד':{gen:cell(m=>Math.max(m[4],m[3]),m=>{ if(R(4)===0) m[3]=m[4]; }),ins:[4,3],out:2},   // «מקסימום» על תאים אחרים (4,3) — הקיים מוברג ל-0/1, אז כאן אי אפשר סתם להעתיק אותו
  });
  const I1=['העתק','לא (מספר)','ועוד 1','ועוד 2','קח מהכתובת שבתא'], I2=['נאנד (מספרים)','וגם (מספרים)','או (מספרים)','שונה (מספרים)','חיבור מספרים','שווה (מספרים)','חיסור','קטן מ-','גדול מ-','מינימום','מקסימום','דלג אם לא-אפס (תא0 אפס ⇒ העתק תא1)'];
  for(const n of I1) if(G[n]) Object.assign(G[n],{ins:[0],out:2}); for(const n of I2) if(G[n]) Object.assign(G[n],{ins:[0,1],out:2});
  for(const n of ['קבוע 15','קבוע 14 (15 ועוד 15)','קבוע 1']) Object.assign(G[n],{ins:[],out:2}); Object.assign(G['אם (תא0 לא-אפס ⇒ תא1, אחרת תא3)'],{ins:[0,1,3],out:2});
  return G; }
// אילו תאים אסור לשנות: לבני-רשימה — כל הרשימה ותאים 0,1; הפוך/מיין משנים את הרשימה בכוונה; אחרות — הכניסות שלהן
export function keepOf(name,block){ if(/הפוך|מיין|כתוב לכתובת/.test(name)) return []; if(/רשימה|ספור|בלי|אמצע|וקטן/.test(name)) return LIST;
  if(block&&block.tt!=null) return [0,1,3]; return ((block&&block.ins)||[]).filter(c=>c!==2); }
// מטרה מלאה: מחולל + שמירת-קלט
export function goalFor(name,block,G){ const base=block&&block.tt!=null?truth(block.tt):G[name]&&G[name].gen; if(!base) return null; const keep=keepOf(name,block);
  return ()=>{ const e=base(); const b=e.mem.slice(); return {mem:e.mem,want:e.want,ok:r=>e.ok(r)&&keep.every(c=>r[c]===b[c])}; }; }
