// הצורף — «רשימה שחורה»: המכונה מוצאת לבד כל צירוף פעולות (זוג / שלישייה) שאף פעם לא עושה משהו חדש.
// צירוף נחסם אם בכל מצב בעולם הוא (א) נשבר, או (ב) עושה בדיוק מה שעושה צירוף קצר יותר (או באותו אורך, «קודם במילון»).
// למה זה בטוח: התוכנית הכי קצרה אף פעם לא מכילה צירוף חסום — אחרת הייתה תוכנית קצרה ממנה. אז לא מפסידים אף פתרון.
// נבדק על הרבה מצבים אקראיים (תאים, מחסנית בכל גובה, לאן/איפה, «עצרה»). נשמר ל-tzoref-rules.json — פעם אחת, לתמיד.
import fs from 'fs'; import { add4 } from './lifted-add.mjs'; import { shr4 } from './lifted-shr.mjs';
const SMAX=6;
export const TOK=['W0','W1','W2','W3','W4','W5','W6','W7','W@','GO','TAKE','PUT','CALC','ADD','SHR','J'];   // J = «אם לא-אפס — לסוף»
function run(seq,s0){ const mem=s0.mem.slice(), st=s0.st.slice(); let A=s0.A,P=s0.P,halt=s0.halt;
  for(const t of seq){ if(halt) break;
    switch(t){ case 'W@': if(!st.length) return null; A=st.pop()&15; break; case 'GO': P=A; break;
      case 'TAKE': if(st.length>=SMAX) return null; st.push(mem[P]); break; case 'PUT': if(!st.length) return null; mem[P]=st.pop(); break;
      case 'CALC': { if(st.length<2) return null; const b=st.pop(),a=st.pop(); st.push(~(a&b)&15); break; }
      case 'ADD': { if(st.length<2) return null; const b=st.pop(),a=st.pop(); st.push(add4(a,b)); break; }
      case 'SHR': if(!st.length) return null; st.push(shr4(st.pop())); break;
      case 'J': { if(!st.length) return null; if(st.pop()!==0) halt=1; break; }
      default: A=+t.slice(1); } }
  return halt?mem.join(',')+'|'+st.join(',')+'|H':mem.join(',')+'|'+st.join(',')+'|'+A+','+P; }   // «עצרה» ⇒ לאן/איפה לא משנים
function states(n,seed){ let s=seed; const R=k=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%k; };
  return Array.from({length:n},()=>({mem:Array.from({length:16},()=>R(4)===0?R(3):R(16)),st:Array.from({length:R(SMAX+1)},()=>R(4)===0?0:R(16)),A:R(16),P:R(16),halt:0})); }
const sig=(seq,S)=>S.map(s=>run(seq,s)??'X').join('/');
export function discover({n1=300,n2=4000}={}){ const S1=states(n1,7), S2=states(n2,99);
  const all=[[]]; for(let L=1;L<=3;L++){ const prev=all.filter(x=>x.length===L-1); for(const p of prev) for(const t of TOK) all.push([...p,t]); }
  const bySig=new Map(); for(const q of all){ const k=sig(q,S1); if(!bySig.has(k)) bySig.set(k,[]); bySig.get(k).push(q); }
  const less=(a,b)=>a.length<b.length;   // רק «קצר יותר» (לא «אותו אורך בסדר אחר» — זה שינה את סדר הצעדים והזיק לחיפוש)
  const strictOk=(s,t)=>S2.every(st=>{ const a=run(s,st); if(a==null) return true; return a===run(t,st); });   // s נשבר — או זהה ל-t
  const blocked=[];
  for(const s of all){ if(s.length<2) continue;
    // אם חלק ממנו כבר חסום — לא צריך כלל חדש
    if(s.length===3&&blocked.some(b=>b.length===2&&((b[0]===s[0]&&b[1]===s[1])||(b[0]===s[1]&&b[1]===s[2])))) continue;
    const cand=(bySig.get(sig(s,S1))||[]).filter(t=>less(t,s));
    // גם: s תמיד נשבר או שווה לריק/קצר — מועמדים מכל הקבוצות שבהן s «נשבר או שווה»
    let hit=cand.find(t=>strictOk(s,t));
    if(!hit){ for(const t of all){ if(!less(t,s)||t.length>=s.length) break; } }
    if(hit) blocked.push([...s]); }
  return blocked; }
if(import.meta.url==='file://'+process.argv[1]){ const t=Date.now(); const B=discover();
  const pairs=B.filter(b=>b.length===2), triples=B.filter(b=>b.length===3);
  fs.writeFileSync('tzoref-rules.json',JSON.stringify({pairs,triples}));
  console.log(`נבדקו 256 זוגות ו-4,096 שלישיות · ${((Date.now()-t)/1000).toFixed(1)} שנ׳`);
  console.log(`נחסמו: ${pairs.length} זוגות (${(100*pairs.length/256).toFixed(0)}%) · ${triples.length} שלישיות נוספות`);
  console.log('דוגמאות לזוגות חסומים:',pairs.slice(0,14).map(p=>p.join('→')).join(' · '));
  console.log('דוגמאות לשלישיות:',triples.slice(0,8).map(p=>p.join('→')).join(' · ')); }
