// מריץ מנוע 2 על קורפוס · מדד אוטומטי: (1) לא קורס (2) ≥1 דבר (3) כל מילה שאינה מסגרת/ספרה נמצאת בתווית-דבר או בשדה
import fs from 'node:fs';
import { formOf, spreadOf, toks } from '../../../yeshiva/mavin.mjs';
const file = process.argv[2];
const sents = fs.readFileSync(file, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
let ok = 0, lost = 0;
for (const s of sents) {
  let r; try { r = formOf(s); } catch (e) { console.log(`✗ קריסה «${s}»: ${e.message}`); continue; }
  const covered = new Set(r.things.flatMap((t) => [...toks(t.label), ...(t.refs || []), ...t.fields.flatMap((f) => toks(f.label))]));
  const frame = new Set(r.frame);
  const placed = (w) => frame.has(w) || covered.has(w);
  const miss = r.words.filter((w) => !/^\d+$/.test(w) && !placed(w) && !placed(w.slice(1)) && !placed(w.slice(2)));   // «ומצב» ⇒ «מצב» במסגרת
  const good = r.things.length > 0 && miss.length === 0; if (good) ok++; lost += miss.length;
  const th = r.things.map((t) => `${t.label}${t.many ? '⁺' : ''}${t.fields.length ? `[${t.fields.map((f) => f.label).join(',')}]` : ''}${t.under ? `⊂${t.under}` : ''}`).join(' · ');
  console.log(`${good ? '✓' : '✗'} «${s}»\n     ${th}${miss.length ? `\n     אבדו: ${miss.join(', ')}` : ''}`);
}
console.log(`\n${ok}/${sents.length} משפטים עברו את המדד · מילים שאבדו: ${lost}`);
