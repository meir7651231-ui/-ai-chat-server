// מבחן לכל אחת מ-25 הלבנים של lab13: מחולל דוגמאות + מה נחשב נכון. תאים שאינם קלט — מלוכלכים.
export function makeSpecs(seed=5){ let s=seed; const rnd=(k)=>{ s=(s*1103515245+12345)%2147483648; return Math.floor((s/2147483648)*k); };
  const shuffled=()=>{ const p=[8,9,10,11,12,13,14,15]; for(let i=7;i>0;i--){ const j=rnd(i+1); [p[i],p[j]]=[p[j],p[i]]; } return p; };
  const chain=(m,l)=>{ m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; }); return m; };
  const walk=(mem)=>{ const out=[]; let a=mem[1]; for(let i=0;a&&i<10;i++){ out.push(a); a=mem[a]; } return out; };
  const LIST=[0,1,8,9,10,11,12,13,14,15], CELL=[0,1,3];
  const dirt=(m,ins)=>m.map((v,k)=>ins.includes(k)?v:rnd(16));
  const cell=(f)=>()=>{ const m=Array.from({length:16},()=>rnd(16)); const w=f(m); return {mem:m,ok:(r)=>r[2]===w}; };
  const list=(maxLen,f,key,ins=LIST)=>()=>{ const m=new Array(16).fill(0); const l=shuffled().slice(0,rnd(maxLen+1)); chain(m,l); if(key) m[0]=8+rnd(8); const w=f(l,m); return {mem:dirt(m,ins),ok:typeof w==='function'?w:(r)=>r[2]===w}; };
  const S={
    'העתק':cell(m=>m[0]), 'לא (מספר)':cell(m=>~m[0]&15), 'וגם (מספרים)':cell(m=>m[0]&m[1]), 'או (מספרים)':cell(m=>m[0]|m[1]), 'שונה (מספרים)':cell(m=>m[0]^m[1]),
    'קבוע 15':cell(()=>15), 'קבוע 14 (15 ועוד 15)':cell(()=>14), 'קבוע 1':cell(()=>1), 'ועוד 1':cell(m=>(m[0]+1)&15), 'חיבור מספרים':cell(m=>(m[0]+m[1])&15),
    'שווה (מספרים)':()=>{ const m=Array.from({length:16},()=>rnd(16)); if(rnd(2)) m[1]=m[0]; const w=m[0]===m[1]?15:0; return {mem:m,ok:r=>r[2]===w}; },
    'קח מהכתובת שבתא':()=>{ const m=Array.from({length:16},()=>rnd(16)); m[0]=8+rnd(8); const w=m[m[0]]; return {mem:m,ok:r=>r[2]===w}; },
    'כתוב לכתובת שבתא':()=>{ const m=Array.from({length:16},()=>rnd(16)); m[0]=8+rnd(8); m[1]=1+rnd(15); const a=m[0],w=m[1]; return {mem:m,ok:r=>r[a]===w}; },
    'דלג אם לא-אפס (תא0 אפס ⇒ העתק תא1)':()=>{ const m=Array.from({length:16},()=>rnd(16)); m[0]=rnd(2)?1+rnd(15):0; m[1]=1+rnd(15); m[2]=0; const w=m[0]?0:m[1]; return {mem:m,ok:r=>r[2]===w}; },
    'אם (תא0 לא-אפס ⇒ תא1, אחרת תא3)':()=>{ const m=Array.from({length:16},()=>rnd(16)); m[0]=rnd(2)?1+rnd(15):0; m[1]=1+rnd(15); m[3]=1+rnd(15); const w=m[0]?m[1]:m[3]; return {mem:m,ok:r=>r[2]===w}; },
    'ועוד 1 באותו תא':()=>{ const m=Array.from({length:16},()=>rnd(16)); const w=(m[2]+1)&15; return {mem:m,ok:r=>r[2]===w}; },
    'צעד ברשימה (הראשון, או 0)':list(3,l=>l[0]||0),
    'סוף רשימה באורך עד 2':list(2,l=>l.length?l[l.length-1]:0),
    'סוף רשימה (לולאה, עד 6)':list(6,l=>l.length?l[l.length-1]:0),
    'אורך רשימה (לולאה + ספירה)':list(8,l=>l.length),
    'חפש ברשימה':list(8,(l,m)=>l.includes(m[0])?15:0,true),
    'סכום רשימה':list(8,l=>l.reduce((a,b)=>a+b,0)&15),
    'הגדול ברשימה':list(8,l=>l.length?Math.max(...l):0),
    'הפוך רשימה':list(8,l=>(mem)=>JSON.stringify(walk(mem))===JSON.stringify([...l].reverse())),
    'מיין רשימה':list(8,l=>(mem)=>JSON.stringify(walk(mem))===JSON.stringify([...l].sort((a,b)=>a-b))),
  };
  // הדלג-אם: בגרסה המקורית תא 2 מתחיל 0 (לא מלוכלך) — כך נבנתה; נשמר כדי לא לשנות את החוזה שלה
  return {S, rnd}; }
