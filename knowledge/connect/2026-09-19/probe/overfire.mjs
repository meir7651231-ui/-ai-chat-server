// כמה «פועלי-מטרה» שזוהו הם בעצם שמות-עצם ברבים? (מבחן-דאטה: שם-פועל לעולם אינו מסתיים בסיומת-ריבוי)
process.env.YESHIVA_LEDGER='/dev/null'; process.env.YESHIVA_LEDGER_CAP='500000';
import fs from 'node:fs';
const { scanUnits } = await import('../../../../machtzev/generator/behavior-plan.mjs');
const Y = await import('../../../../yeshiva/purpose.mjs');
const PL = JSON.parse(fs.readFileSync('../../../../machtzev/generator/nl-lang.data.json','utf8')).pluralSuffixes;
let units=0, tot=0, plural=0; const ex=new Map();
for (const u of scanUnits()) {
  const d = Y.demandsOf(u.text); if(!d.length) continue;
  tot += d.length;
  const bad = d.filter(x=>PL.some(s=>x.verb.endsWith(s)) && !x.declared);
  if (bad.length){ units++; plural+=bad.length; for(const x of bad) ex.set(x.verb,(ex.get(x.verb)||0)+1); }
}
console.log('תביעות שזוהו בסך הכל:', tot);
console.log('מהן «פועל» שמסתיים בסיומת-ריבוי (nl-lang.pluralSuffixes) ⇒ שם-עצם, לא שם-פועל:', plural, 'ב-'+units+' יחידות');
console.log([...ex].sort((a,b)=>b[1]-a[1]).slice(0,25).map(([k,v])=>v+'× '+k).join(' | '));
