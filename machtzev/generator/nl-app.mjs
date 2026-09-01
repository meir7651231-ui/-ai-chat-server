#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  nl-app.mjs — מתאם-המחולל (פאזה E1+E2 · §22 · §20-ד): משפט-עברית ⇒ האטומים
//  האמיתיים שהכי-מתאימים-למטרה. **אפס מילון-דומייני, אפס תבניות-שלי** — ההתאמה
//  נגזרת מחפיפת-מילים בין המשפט לבין ה-`he` (התיאור-העצמי) של כל אטום, שנחצב
//  מבייטי-המקור. בדיוק המנגנון של render-ds.pickInput ("אפס רשימת-מילים במנוע").
//
//  שימוש:  node nl-app.mjs "<משפט>"           # מדרג את האטומים המתאימים
//          node nl-app.mjs "<משפט>" --json     # פלט-מכונה
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { stem } from './match.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const atlas = JSON.parse(fs.readFileSync(path.join(HERE, 'atlas.json'), 'utf8'));

// טוקניזציה זהה ל-render-ds: מילים-עבריות ≥2 אותיות ⇒ גזם.
const heToks = (s) => [...String(s || '').matchAll(/[֐-׿]{2,}/g)].map((m) => stem(m[0])).filter((t) => t.length > 1);

// כל אטום עם קבוצת-הטוקנים של התיאור-העצמי שלו (he). זה אוצר-המילים — מהאטומים, לא ממני.
const ATOMS = [
  ...atlas.widgets.map((w) => ({ id: w.cls, layer: 'display', file: w.file, st: new Set((w.he || []).flatMap(heToks)) })),
  ...atlas.functions.map((f) => ({ id: f.name, layer: 'logic', file: f.file, st: new Set((f.he || []).flatMap(heToks)) })),
].filter((a) => a.st.size);

// ── E1+E2: פירוק-המשפט לטוקנים, וניקוד כל אטום לפי חפיפה (§20-א: הכי-טוב-למטרה) ──
export function match(sentence) {
  const q = [...new Set(heToks(sentence))];
  const scored = [];
  for (const a of ATOMS) {
    const hit = q.filter((t) => a.st.has(t));
    if (hit.length) scored.push({ id: a.id, layer: a.layer, file: a.file, score: hit.length, words: hit });
  }
  scored.sort((x, y) => y.score - x.score || x.id.localeCompare(y.id));
  return { q, scored };
}

const args = process.argv.slice(2);
const sentence = args.find((a) => !a.startsWith('--'));
if (!sentence) { console.error('שימוש: node nl-app.mjs "<משפט>" [--json]'); process.exit(1); }

const { q, scored } = match(sentence);
if (args.includes('--json')) { console.log(JSON.stringify({ q, top: scored.slice(0, 20) }, null, 0)); process.exit(0); }

console.log(`\n📝 המשפט: "${sentence}"`);
console.log(`🔤 טוקנים (גזם): ${q.join(' · ') || '—'}`);
const disp = scored.filter((s) => s.layer === 'display').slice(0, 8);
const log = scored.filter((s) => s.layer === 'logic').slice(0, 8);
console.log(`\n🎨 אטומי-תצוגה מתאימים (${scored.filter((s) => s.layer === 'display').length}):`);
for (const s of disp) console.log(`   ${String(s.score).padStart(2)}  ${s.id.padEnd(24)} ← ${s.words.join(', ')}`);
console.log(`\n⚙️  אטומי-לוגיקה מתאימים (${scored.filter((s) => s.layer === 'logic').length}):`);
for (const s of log) console.log(`   ${String(s.score).padStart(2)}  ${s.id.padEnd(24)} ← ${s.words.join(', ')}`);

const max = scored[0] ? scored[0].score : 0;
console.log(`\n📊 כיסוי: ציון-שיא ${max} · ${scored.length} אטומים נגעו.`);
if (max >= 2) console.log('   ✅ הקטלוג מכסה — יש אטומים-אמיתיים למשפט הזה.');
else if (max === 1) console.log('   🟡 כיסוי-חלש — נגיעה במילה-אחת בלבד. ייתכן שהמשפט מחוץ-לתחום-הקטלוג.');
else console.log('   🔴 אפס-כיסוי — אף אטום לא מתאר את המשפט. הקטלוג (עסקי) לא מכיל את זה.');
