// «סריקה-עם-זיכרון» בשלבים: הספרייה של הסורק גדלה בחזקה (צירופים של עד 3 כלים) — כל כלי-סולם מאט את כל החיפוש.
// שלב 1: רק כלי-הבסיס (בדיוק כמו המדף הקר), חלק STAGEFRAC מהזמן — מה שהקר פותר נפתר גם כאן, באותה מהירות.
// שלב 2: אם לא נמצא — כל המדף (בסיס + מנת-הסולם, ladder-order.mjs) במה שנשאר מהזמן.
import { scanCompose } from './scanfold.mjs'; import { setScanMode, scanTools } from './scan-tools.mjs'; import { isLadder } from './ladder-order.mjs';
export function foldStaged(gen,{ms=150000,...o}={}){ const T0=Date.now(); const F=+process.env.STAGEFRAC||0.5;
  { const {U,B,T}=scanTools(); if(![...U,...B,...T].some(t=>isLadder(t.name))) return scanCompose(gen,{...o,ms}); }   // מדף בלי כלי-סולם (קר) ⇒ שלב אחד, בדיוק כמו קודם
  let r; setScanMode('base'); try{ r=scanCompose(gen,{...o,ms:Math.round(ms*F)}); } finally{ setScanMode('all'); }
  if(r&&r.prog) return {...r,phase:'base'};
  const left=ms-(Date.now()-T0); if(left<5000) return r;
  const r2=scanCompose(gen,{...o,ms:left}); return r2&&r2.prog?{...r2,phase:'ladder'}:r2; }
