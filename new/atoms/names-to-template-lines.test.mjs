import { namesToTemplateLines } from './names-to-template-lines.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
// 1) חיתוך-רווחים + מספור eyes
ok(eq(namesToTemplateLines([{ name: ' דוד ', eyes: '3', rate: 5 }]), [{ name: 'דוד', qty: 3, rate: 5 }]),
  'חיתוך+מספור נכשלו');
// 2) שם-רווחים בלבד ⇒ נופל
ok(eq(namesToTemplateLines([{ name: '  ', eyes: '2', rate: 9 }]), []), 'שם-ריק לא סונן');
// 3) eyes לא-מספרי ⇒ 0; rate חסר ⇒ 0
ok(eq(namesToTemplateLines([{ name: 'לוי', eyes: 'abc' }]), [{ name: 'לוי', qty: 0, rate: 0 }]),
  'נפילת NaN/חסר ל-0 נכשלה');
// 4) מספר עובר כמו-שהוא
ok(eq(namesToTemplateLines([{ name: 'כהן', eyes: 2.5, rate: 0 }]), [{ name: 'כהן', qty: 2.5, rate: 0 }]),
  'מספר-עשרוני לא עבר');
// 5) ריק ⇒ ריק · eyes='' ⇒ qty 0
ok(eq(namesToTemplateLines([]), []), 'מערך ריק');
ok(eq(namesToTemplateLines([{ name: 'א', eyes: '', rate: 7 }]), [{ name: 'א', qty: 0, rate: 7 }]),
  "eyes='' לא נפל ל-0");
if (f) process.exit(1);
console.log('✓ names-to-template-lines: 6 דוגמאות-חוזה — ירוק');
