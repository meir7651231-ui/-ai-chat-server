#!/usr/bin/env node
/** מחצב · דדופ-widgets (הכרעה-5: דדופ אחרי הפירוק) — לפני גל-הליטוש.
 *  משווה את כל ה-widgets מכל המסכים לפי **מבנה** (מחרוזות/מספרים מסונוורים):
 *  קבוצת-מבנה-זהה = מנגנון-אחד + N שורות-דאטה ⇒ מלטשים פעם-אחת.
 *  שימוש: node widget-dedup.mjs <dir-of-screens> */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const dir = process.argv[2];
const files = fs.readdirSync(dir).filter(f => f.endsWith('.dart'));

function bodyOf(startIdx, s) {
  let i = s.indexOf('{', startIdx); if (i < 0) return '';
  let d = 0, j = i;
  for (; j < s.length; j++) { if (s[j] === '{') d++; else if (s[j] === '}') { d--; if (!d) break; } }
  return s.slice(i, j + 1);
}
const all = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8').replace(/\/\/[^\n]*/g, '');
  const decl = /class\s+(_?[A-Za-z0-9]+)\s+extends\s+((?:Stateless|Stateful|Consumer|ConsumerStateful)Widget)/g;
  let m;
  while ((m = decl.exec(src))) {
    let b = bodyOf(m.index, src);
    const loc = b.split('\n').length;
    // סינוור: המחרוזות, המספרים, ושם-המחלקה-עצמה ⇒ נשאר רק המבנה
    let norm = b
      .replace(/'[^'\n]*'/g, 'S').replace(/"[^"\n]*"/g, 'S')
      .replace(/\b[0-9]+(\.[0-9]+)?\b/g, 'N')
      .replaceAll(m[1], 'W')
      .replace(/\s+/g, ' ');
    // רופף: גם מזהי-שדות מסונוורים (לזיהוי משפחות-קרובות)
    const loose = norm.replace(/\b[a-z][A-Za-z0-9]*\b/g, 'x');
    all.push({ screen: f.replace('.dart', ''), name: m[1], loc,
      exact: crypto.createHash('sha1').update(norm).digest('hex').slice(0, 10),
      loose: crypto.createHash('sha1').update(loose).digest('hex').slice(0, 10) });
  }
}
const by = (k) => { const g = {}; for (const w of all) (g[w[k]] ??= []).push(w); return g; };
const eg = by('exact'), lg = by('loose');
const exactDup = Object.values(eg).filter(g => g.length > 1);
const looseOnly = Object.values(lg).filter(g => g.length > 1 && new Set(g.map(x => x.exact)).size > 1);
const uniqueMech = Object.keys(eg).length;
const inDup = exactDup.reduce((a, g) => a + g.length, 0);

console.log(`🔁 דדופ-widgets · ${all.length} widgets מ-${files.length} מסכים`);
console.log(`   מנגנונים ייחודיים (לפי-מבנה): ${uniqueMech} ⇒ חיסכון: ${all.length - uniqueMech} widgets הם שכפול-מבני`);
console.log(`   קבוצות-זהות-מבנה: ${exactDup.length} (מכסות ${inDup} widgets) · משפחות-קרובות (רופף): ${looseOnly.length}`);
console.log('\n🔝 קבוצות-הכפילות הגדולות (מנגנון-אחד + דאטה):');
for (const g of exactDup.sort((a, b) => b.length - a.length).slice(0, 15)) {
  const names = [...new Set(g.map(x => x.name))].slice(0, 4).join(',');
  const screens = new Set(g.map(x => x.screen)).size;
  console.log(`   ×${g.length} (${g[0].loc}ש, ${screens} מסכים): ${names}${g.length > 4 ? '…' : ''}`);
}
// פלט-JSON לגל-הליטוש
fs.writeFileSync('screens-seed/widget-dedup.json', JSON.stringify({ total: all.length, uniqueMech, groups: exactDup.map(g => ({ n: g.length, loc: g[0].loc, members: g.map(x => x.screen + ':' + x.name) })) }, null, 1));
console.log('\n⇒ screens-seed/widget-dedup.json');
