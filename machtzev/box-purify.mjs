#!/usr/bin/env node
/** 🧼 מחצב · טיהור-קופסה מנועי — עברית + enum-מחרוזות ⇒ אטום-דאטה (צורת-דאטה טהורה,
 *  פטור-טוהר-עומק) + חוזה + בדיקת-צילום + חיווט-מחדש בקופסה. הערכים ביט-זהים ⇒ golden עומד.
 *  AST-אמת (TS). שימוש: node box-purify.mjs new/boxes/<name>.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const ts = createRequire('/home/user/maor-system/')('typescript');
const HEB = /[֐-׿]/;
const file = process.argv[2];
if (!file || !fs.existsSync(file)) { console.error('usage: box-purify.mjs <box.mjs>'); process.exit(2); }
const base = path.basename(file).replace(/\.mjs$/, '');
const dir = path.dirname(file);
const src = fs.readFileSync(file, 'utf8');
const sf = ts.createSourceFile('b.mjs', src, ts.ScriptTarget.ES2022, true);

const isEnumLatin = (t) => /^[a-z][a-z0-9_.-]{2,}$/i.test(t) && !/^https?|\.(ts|mjs|dart)$/.test(t);
const all = [];      // כל הליטרלים {start,end,text}
const enumSet = new Set();
const walk = (n) => {
  if (ts.isImportDeclaration(n)) return;
  if (ts.isStringLiteral(n) || n.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
    all.push({ start: n.getStart(sf), end: n.getEnd(), text: n.text });
    if (isEnumLatin(n.text)) {
      const p = n.parent;
      if ((ts.isBinaryExpression(p) && /===|!==|==|!=/.test(p.operatorToken.getText(sf)))
        || ts.isCaseClause(p) || (ts.isPropertyAssignment(p) && p.initializer === n) || ts.isReturnStatement(p)
        || (ts.isConditionalExpression(p)) || (ts.isArrayLiteralExpression(p))) enumSet.add(n.text);
    }
    return;
  }
  ts.forEachChild(n, walk);
};
walk(sf);
// ליטרלים-לטיהור: עברית (תמיד) או ערך שזוהה כ-enum (כל מופעיו)
const lits = all.filter(l => HEB.test(l.text) || enumSet.has(l.text));
if (!lits.length) { console.log(`~ ${base}: אין עברית/enum לטיהור`); process.exit(0); }

const uniq = [...new Set(lits.map(l => l.text))];
const key = {}; uniq.forEach((t, i) => key[t] = 'k' + i);
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
const atomsDir = path.join(dir, '..', 'atoms');                     // אטום-דאטה חי ב-atoms (קופסה מייבאת אטום — חוקי)
const dataFile = path.join(atomsDir, base + '-strings.mjs');
fs.writeFileSync(dataFile,
  `/** אטום-דאטה · ${base}-strings — מחרוזות-עברית/enum של הקופסה (הכרעה 19: מחרוזת-דומיין = דאטה).\n *  חולץ מנועית מ-${base} · צורת-דאטה טהורה (פטור-טוהר-עומק). חוזה: ${base}-strings.contract.md */\nexport const S = {\n`
  + uniq.map(t => `  ${key[t]}: '${esc(t)}',`).join('\n') + '\n};\n');
fs.writeFileSync(path.join(atomsDir, base + '-strings.contract.md'),
  `# חוזה · ${base}-strings\nאטום-דאטה שחולץ מנועית מקופסת ${base} (הכרעה 19) — מחרוזות-עברית/enum. שינוי = שינוי-מודע בקופסה.\n\n## דוגמאות-זהב\nצילום-ערך ב-${base}-strings.test.mjs.\n`);
const snap = JSON.stringify(Object.fromEntries(uniq.map(t => [key[t], t])));
fs.writeFileSync(path.join(atomsDir, base + '-strings.test.mjs'),
  `// בדיקת-צילום · ${base}-strings\nimport { S } from '../atoms/${base}-strings.mjs';\nimport assert from 'node:assert';\nassert.strictEqual(JSON.stringify(S), ${JSON.stringify(snap)});\nconsole.log('OK ${base}-strings');\n`);

// חיווט-מחדש (מהסוף להתחלה)
let out = src;
for (const l of lits.sort((a, b) => b.start - a.start)) out = out.slice(0, l.start) + `S.${key[l.text]}` + out.slice(l.end);
out = out.replace(/^(\/\*\*[\s\S]*?\*\/\n)?/, (m) => (m || '') + `import { S } from '../atoms/${base}-strings.mjs';\n`);
fs.writeFileSync(file, out);
console.log(`✅ ${base}: ${lits.length} מחרוזות (${uniq.length} ייחודיות · ${enumSet.size} enum) ⇒ ${base}-strings + חיווט`);
