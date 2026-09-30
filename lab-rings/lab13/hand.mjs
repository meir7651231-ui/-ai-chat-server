// תוכנית שכתבתי ביד: «בחר לפי זוגי» — אם תא 0 זוגי ⇒ תא 1, אחרת ⇒ תא 3
import { makeChecker, finalCheck } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const src=[
 'WHERE 0','GO','TAKE','TAKE','ADD',            // 2x
 'WHERE 4','GO','PUT','TAKE','TAKE','ADD','PUT',// תא4 = 4x
 'TAKE','TAKE','ADD',                           // 8x — לא אפס רק אם x אי-זוגי
 'WHERE @ODD','JUMP',
 'WHERE 1','GO','TAKE','WHERE 2','GO','PUT',     // זוגי: תא2 = תא1
 'TAKE','TAKE','CALC','TAKE','CALC',            // 15 (בטוח לא אפס)
 'WHERE @END','JUMP',
 'ODD:','WHERE 3','GO','TAKE','WHERE 2','GO','PUT', // אי-זוגי: תא2 = תא3
 'END:'];
const lab={}; let n=0; for(const l of src){ if(l.endsWith(':')) lab[l.slice(0,-1)]=n; else n++; }
const prog=src.filter(l=>!l.endsWith(':')).map(l=>{ const [o,a]=l.split(' '); if(a==null) return [o]; if(a.startsWith('@')) return ['WHERE',lab[a.slice(1)],'code']; return [o,+a]; });
const G=goals(), gen=goalFor('בחר לפי זוגי',{ins:G['בחר לפי זוגי'].ins},G);
console.log('אורך:',prog.length,'· בודק רגיל:',makeChecker(gen,300)(prog)); const fc=finalCheck(prog,gen); console.log('בדיקה סופית:',fc.n-fc.bad,'/',fc.n);
