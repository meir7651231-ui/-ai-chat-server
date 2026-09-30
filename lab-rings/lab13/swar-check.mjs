// (א) הנוסחאות «8 במכה» מול המכונה: כל 256 הצירופים, בכל אחת מ-8 המשבצות
import { add4 } from './lifted-add.mjs'; import { shr4 } from './lifted-shr.mjs';
let bad=0; const LOW3=0x77777777|0, HIGH=0x88888888|0;
for(let a=0;a<16;a++) for(let b=0;b<16;b++) for(let s=0;s<8;s++){ const fill=(v,o)=>{ let w=0; for(let j=0;j<8;j++) w|=((j===s?v:(j*3+o)&15))<<(4*j); return w; };
  const x=fill(a,1), y=fill(b,5); const get=(w)=>(w>>>(4*s))&15;
  if(get(((x&LOW3)+(y&LOW3))^((x^y)&HIGH))!==add4(a,b)) bad++; if(get(~(x&y))!==(~(a&b)&15)) bad++; if(get((x>>>1)&LOW3)!==shr4(a)) bad++;
  // השכנים לא נפגעו
  for(let j=0;j<8;j++){ if(j===s) continue; const xa=(j*3+1)&15, yb=(j*3+5)&15; if((((((x&LOW3)+(y&LOW3))^((x^y)&HIGH))>>>(4*j))&15)!==add4(xa,yb)) bad++; } }
console.log('נוסחאות «8 במכה» מול המכונה:', bad?`✗ ${bad} הבדלים`:'✓ 0 הבדלים (חיבור, לא-וגם, הזז-ימינה, וגם שהשכנים לא נפגעים)');
