import { gemYear } from './gem-year.mjs';
// שקע-גימטריה מוזרק (העתק התנהגות חוט gematria — בדיקה מייבאת רק את האטום שלה):
const gem=(n)=>{n=Math.floor(+n);if(!Number.isFinite(n)||n<=0)return '';
const U=['','א','ב','ג','ד','ה','ו','ז','ח','ט'],T=['','י','כ','ל','מ','נ','ס','ע','פ','צ'],
H=['','ק','ר','ש','ת','תק','תר','תש','תת','תתק'];let s=H[Math.floor(n/100)]||'';const r=n%100;
if(r===15)s+='טו';else if(r===16)s+='טז';else s+=T[Math.floor(r/10)]+U[r%10];
return s.length===1?s+'׳':s.slice(0,-1)+'״'+s.slice(-1);};
const C=[[5786,'תשפ״ו'],['5786','תשפ״ו'],[5715,'תשט״ו'],[786,'תשפ״ו'],[5000,'']];
let f=0; for(const [a,w] of C){const g=gemYear(a,gem); if(g!==w){console.error(`✗ ${JSON.stringify(a)} ⇒ "${g}" ≠ "${w}"`);f=1;}}
if(f)process.exit(1); console.log(`✓ gem-year: ${C.length} דוגמאות-חוזה — ירוק`);
