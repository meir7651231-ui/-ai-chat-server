// probe-מורפולוגיה: מונח מוצהר בדאטה ⇒ האם המנוע מזהה את נטיותיו הטבעיות?
process.env.YESHIVA_LEDGER = '/dev/null'; process.env.YESHIVA_LEDGER_CAP='500000';
import fs from 'node:fs';
const T = await import('../../../../machtzev/generator/tzinor.mjs');
const SPL = JSON.parse(fs.readFileSync('../../../../machtzev/generator/spec-lang.data.json','utf8'));
const NLL = JSON.parse(fs.readFileSync('../../../../machtzev/generator/nl-lang.data.json','utf8'));
const TERMS = JSON.parse(fs.readFileSync('../../../../machtzev/generator/entity-terms.data.json','utf8')).terms;
const PL = NLL.pluralSuffixes;                       // ["ים","ות"] — מדאטה
const PFX = [...(SPL.prefixLetters||'')];            // "והבלמשכ" — מדאטה
// צורות-יחיד מוצהרות בלבד, מילה-אחת (כדי שהניסוי יבדוק מורפולוגיה ולא צירוף)
const forms = [...new Set(TERMS.filter(t=>t.entity).flatMap(t=>t.forms))]
  .filter(f=>/^[א-ת]{3,}$/.test(f) && !PL.some(s=>f.endsWith(s)));
const plural = (f)=> f.endsWith('ה') ? f.slice(0,-1)+'ות' : f+'ים';
const cases = [
  ['היחיד המוצהר',        (f)=>f],
  ['תחילית אחת',          (f)=>PFX.map(p=>p+f)],
  ['שתי תחיליות',         (f)=>['ול','שב','וה','ומ','מה','וב'].map(p=>p+f)],
  ['ריבוי (nl-lang)',     (f)=>plural(f)],
  ['תחילית+ריבוי',        (f)=>PFX.map(p=>p+plural(f))],
  ['שתי תחיליות+ריבוי',   (f)=>['ול','שב','וה','ומ'].map(p=>p+plural(f))],
];
const res = {};
for (const [name, gen] of cases) {
  let ok=0, bad=0; const ex=[];
  for (const f of forms) {
    const base = T.soleClassOf(f);            // המונח עצמו חייב להיפתר, אחרת לא ניסוי
    if (!base || !base.cls) continue;
    for (const x of [].concat(gen(f))) {
      const r = T.soleClassOf(x);
      if (r && r.cls === base.cls) ok++; else { bad++; if (ex.length<5) ex.push(`${x} (מ-«${f}» ⇒ ${base.cls})`); }
    }
  }
  res[name]={ok,bad,ex};
  console.log(`${name.padEnd(22)} ✓${String(ok).padStart(5)}  ✗${String(bad).padStart(5)}   ${bad?'נפילות: '+ex.join(' · '):''}`);
}
console.log('\nמונחי-יחיד שנבדקו:', forms.length);
