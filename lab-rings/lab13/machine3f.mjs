// machine3f — אותה מכונה קפדנית בדיוק (machine3s), רק מהירה:
//  (1) חיבור ו«הזז ימינה»: טבלה שמולאה פעם אחת ע"י הרצת התוכניות המורמות עצמן (אותן תשובות, לא מחושבות מחדש בכל פעם)
//  (2) runCode: התוכנית מקודדת פעם אחת למספרים, בלי לקרוא מחרוזות בכל צעד
import { add4 } from './lifted-add.mjs'; import { shr4 } from './lifted-shr.mjs';
const ADD=new Int32Array(256), SHR=new Int32Array(16); for(let a=0;a<16;a++){ SHR[a]=shr4(a); for(let b=0;b<16;b++) ADD[a*16+b]=add4(a,b); }
const OP={WHERE:0,'WHERE@':1,GO:2,JUMP:3,TAKE:4,PUT:5,ADD:6,SHR:7,CALC:8};
// קידוד עם 3 מקומות-פתיחה (WHERE pa; GO; WHERE aa) — כתובות-קוד מוזזות ב-3, בדיוק כמו בבודק הרגיל
export function encode(p){ const n=p.length+3, ops=new Int32Array(n), args=new Int32Array(n); ops[0]=0; ops[1]=2; ops[2]=0;
  for(let i=0;i<p.length;i++){ const [o,k,c]=p[i]; ops[i+3]=OP[o]; if(o==='WHERE') args[i+3]=c?k+3:k; } return {ops,args,n}; }
const STK=new Int32Array(1<<16); const MEM=new Int32Array(16);
// מחזיר: -1 = נכשל/נתקע, 1 = הסתיים עם מחסנית ריקה (הזיכרון ב-MEM), 2 = הסתיים ונשאר משהו במחסנית
export function runCode(code,pa,aa,mem0,maxSteps,scramble){ const {ops,args,n}=code; args[0]=pa; args[2]=aa; const cells=16;
  for(let i=0;i<16;i++) MEM[i]=mem0[i]|0; let A=0,P=0,pc=0,steps=0,sp=0,sd=scramble;
  while(pc<n){ if(++steps>maxSteps) return -1; const op=ops[pc], k=args[pc]; pc++;
    switch(op){
      case 0: A=k; break;
      case 1: if(sp===0) return -1; A=STK[--sp]%cells; break;
      case 2: P=A; break;
      case 3: { if(sp===0) return -1; if(STK[--sp]!==0){ const back=A<pc; pc=A; if(scramble&&back){ sd=(sd*1103515245+12345)%2147483648; A=Math.floor((sd/2147483648)*cells); sd=(sd*1103515245+12345)%2147483648; P=Math.floor((sd/2147483648)*cells); } } break; }
      case 4: if(P>=cells||P<0) return -1; if(sp>=STK.length) return -2; STK[sp++]=MEM[P]; break;
      case 5: if(sp===0||P>=cells||P<0) return -1; MEM[P]=STK[--sp]; break;
      case 6: { if(sp<2) return -1; const b=STK[--sp], a=STK[--sp]; STK[sp++]=ADD[a*16+b]; break; }
      case 7: if(sp===0) return -1; STK[sp-1]=SHR[STK[sp-1]]; break;
      case 8: { if(sp<2) return -1; const b=STK[--sp], a=STK[--sp]; STK[sp++]=~(a&b)&15; break; }
    } }
  return sp===0?1:2; }
export { MEM };
// חתימת-התנהגות (לאיחוד עריכות שמתנהגות אותו דבר): תוצאה + זיכרון + מה שנשאר במחסנית
export function sigOf(code,pa,aa,mem0,maxSteps){ const r=runCode(code,pa,aa,mem0,maxSteps,0); if(r<0) return 'x'; return MEM.join(',')+'|'+r; }
