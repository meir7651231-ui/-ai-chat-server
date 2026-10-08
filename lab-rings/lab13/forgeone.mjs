// הצינור המלא של הצורף על מטרה אחת: בנייה (שלד+גוף · רגיל · עם קפיצות) ⇒ קיצור ⇒ בדיקה ⇒ מדף
import { forge } from './tzoref.mjs'; const name=process.argv[2];
const r=forge(name,{buildMs:+process.env.BMS||300000,minutes:+process.env.MIN||3,cascade:false}); console.log(r.ok?`✓ ${name}: ${r.prog.length} פקודות · ${r.how} · ${(r.ms/1000).toFixed(0)} שנ׳`:`✗ ${name}: ${r.why}`); process.exit(0);
