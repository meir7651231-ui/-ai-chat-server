// כמה יחידות-קורפוס מכילות מילה שהמנוע לא פותר, אך קילוף תחילית **שנייה** כן פותר?
process.env.YESHIVA_LEDGER='/dev/null'; process.env.YESHIVA_LEDGER_CAP='500000';
import fs from 'node:fs';
const { scanUnits } = await import('../../../../machtzev/generator/behavior-plan.mjs');
const T = await import('../../../../machtzev/generator/tzinor.mjs');
const SPL = JSON.parse(fs.readFileSync('../../../../machtzev/generator/spec-lang.data.json','utf8'));
const PFX = SPL.prefixLetters||'';
const hits = new Map();
for (const u of scanUnits()) {
  for (const w of [...String(u.text).matchAll(/[א-ת]+/g)].map(m=>m[0])) {
    if (w.length < 5) continue;
    const a = T.soleClassOf(w); if (a && a.cls) continue;             // המנוע כבר פותר
    if (!PFX.includes(w[0]) || !PFX.includes(w[1])) continue;          // לא שתי תחיליות
    const b = T.soleClassOf(w.slice(2));                              // אחרי קילוף שני
    if (b && b.cls) { const k=u.id; if(!hits.has(k)) hits.set(k,[]); hits.get(k).push(`${w}⇒${w.slice(2)}(${b.cls})`); }
  }
}
console.log('יחידות שבהן מילה נפתרת רק אחרי קילוף תחילית שנייה:', hits.size);
for (const [k,v] of [...hits].slice(0,15)) console.log('  ', k, [...new Set(v)].join(' '));
