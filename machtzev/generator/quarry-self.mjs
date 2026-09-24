#!/usr/bin/env node
// ⛏️ quarry-self — חציבה-עצמית של המחולל (הכרעת-בעלים 23.9 «תסיים את הכל» · סעיף 8): אותו עיקרון של quarry-golden, על קוד-המנוע.
//   ההרכבות של צורות-המשפט (תנאי · ותק · שוויון · וגם · או · מדרגות · קבוצות · הגדרות) יושבות בקבצי-המנוע תחת סמן `// ═══ <מטרה> = A ⊕ B`.
//   כאן הקבצים נחתכים **מכנית** לשברים (סמן / הצהרה ברמת-הקובץ), כל שבר = רשומה {מזהה · קובץ · טווח · כותרת · הרכבה-מוצהרת · סמלים-בשימוש},
//   והקטלוג נכתב ל-knowledge/compositions.json. סיבוב-מלא: הרכבת-השברים חזרה = הקובץ ביט-לביט (הוכחת-המכניקה). --check = הקטלוג ≡ טרי.
//   מה שזה נותן: «איזו הרכבה מממשת צורה» היא רשומה, לא ידע-בראש. מה שזה עדיין לא: מפרש שמריץ רשומות במקום קוד.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const FILES = ['machtzev/generator/capability.mjs', 'machtzev/generator/live-expr.mjs', 'machtzev/generator/app-ds.mjs', 'machtzev/generator/insight.mjs', 'yeshiva/ein.mjs'];
const OUT = path.join(HERE, 'knowledge/compositions.json');
const isMarker = (l) => /^\s*\/\/ ═══/.test(l);
const isTop = (l) => /^(export\s+)?(async\s+)?(function|const|let|class)\s+\w+/.test(l);
const symsOf = (code) => [...new Set([...code.matchAll(/\b(live[A-Z]\w*|detect\w+Clause|detectAllClauses|judge|synthDisplay|valueSearch|planNeeds|planBehaviors|synthesize|remember|recall|carriersOf|sameStem|leadOf|emitInsight|forgeCands|wireForge)\b/g)].map((m) => m[1]))].sort();
function quarry(rel) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8'); const lines = src.split('\n');
  const cuts = []; for (let i = 1; i < lines.length; i++) if (isMarker(lines[i]) || isTop(lines[i])) { if (isTop(lines[i]) && i > 0 && isMarker(lines[i - 1])) continue; cuts.push(i); }   // סמן + ההצהרה שאחריו = שבר אחד
  const frags = []; let start = 0; for (const c of cuts) { frags.push([start, c]); start = c; } frags.push([start, lines.length]);
  const base = path.basename(rel, '.mjs');
  return { file: rel, lines: lines.length, fragments: frags.map(([a, b], i) => { const code = lines.slice(a, b); const mk = code.find(isMarker); const m = mk && mk.match(/═══\s*(.+?)\s*=\s*(.+?)\s*$/); const head = code.find((l) => isTop(l)) || '';
    return { id: `${base}#${i}`, range: [a, b], marker: m ? m[1].trim() : null, composed: m ? m[2].split('⊕').map((x) => x.trim()) : [], declares: (head.match(/(?:function|const|let|class)\s+(\w+)/) || [])[1] || null, uses: symsOf(code.join('\n')) }; }) };
}
const fresh = { _: 'קטלוג-ההרכבות של המחולל עצמו (quarry-self): שבר = טווח-שורות בקובץ-מנוע; סמן ═══ = הרכבה מוצהרת (A ⊕ B). נגזר; אל תערוך ידנית.', files: FILES.map(quarry) };
// סיבוב-מלא: השברים רציפים ומכסים ⇒ הרכבה חזרה = המקור ביט-לביט
let rt = 0; for (const f of fresh.files) { const src = fs.readFileSync(path.join(ROOT, f.file), 'utf8'); const back = f.fragments.map((g) => src.split('\n').slice(g.range[0], g.range[1]).join('\n')).join('\n'); if (back !== src) { console.log(`❌ סיבוב-מלא נכשל: ${f.file}`); process.exitCode = 1; } else rt++; }
const marked = fresh.files.flatMap((f) => f.fragments.filter((g) => g.marker));
if (process.argv.includes('--check')) { const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : ''; if (cur !== JSON.stringify(fresh, null, 1) + '\n') { console.log('🔴 quarry-self: compositions.json ≠ טרי (הרץ node machtzev/generator/quarry-self.mjs)'); process.exit(1); } }
else fs.writeFileSync(OUT, JSON.stringify(fresh, null, 1) + '\n');
console.log(`⛏️ quarry-self: ${fresh.files.length} קבצים · ${fresh.files.reduce((a, f) => a + f.fragments.length, 0)} שברים · ${marked.length} הרכבות מוצהרות · סיבוב-מלא ${rt}/${fresh.files.length}`);
for (const g of marked) console.log(`  ${g.marker} = ${g.composed.join(' ⊕ ')}  [${g.id} · שורות ${g.range[0] + 1}–${g.range[1]}]`);
