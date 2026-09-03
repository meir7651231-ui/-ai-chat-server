#!/usr/bin/env node
/** 🗂️ מחצב · הרמת-דאטה-קופסה מנועית (המנגנון-ההפוך, הכרעה 19) — כל קבוע-דאטה ברמת-המודול
 *  (טבלה/מערך/אובייקט/סקלר-דומיין) מורם לאטום-דאטה new/atoms/<base>-data.mjs; הקופסה
 *  מייבאת אותו (קופסה→אטום=חוקי). השם+ההערה של הקבוע כבר מכריזים על המטרה ⇒ ההרמה מכנית.
 *  חלוקת-עבודה עם autoPurify: שורה שכבר מסומנת "קבוע-מתמטי" = מנגנון ⇒ מדולגת (לא-דאטה).
 *  ‏new Set/Map ומאתחל-לא-ליטרלי = לא-נגעים (v1). AST-אמת (TS). ביט-זהה ⇒ golden עומד.
 *  שימוש: node box-data-lift.mjs new/boxes/<name>.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { requireTs } from './lib-ts.mjs';
import { pathToFileURL } from 'node:url';
const ts = requireTs();
const file = process.argv[2];
if (!file || !fs.existsSync(file)) { console.error('usage: box-data-lift.mjs <box.mjs>'); process.exit(2); }
const base = path.basename(file).replace(/\.mjs$/, '');
const dir = path.dirname(file);
const src = fs.readFileSync(file, 'utf8');
const sf = ts.createSourceFile('b.mjs', src, ts.ScriptTarget.ES2022, true);

// ליטרל-דאטה טהור (רקורסיבי): מספר/מחרוזת/בוליאני/null · מינוס-מספר · מערך/אובייקט של-טהורים
const isPure = (n) => {
  if (!n) return false;
  if (n.kind === ts.SyntaxKind.NumericLiteral || ts.isStringLiteral(n) || n.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) return true;
  if (n.kind === ts.SyntaxKind.TrueKeyword || n.kind === ts.SyntaxKind.FalseKeyword || n.kind === ts.SyntaxKind.NullKeyword) return true;
  if (ts.isPrefixUnaryExpression(n) && n.operator === ts.SyntaxKind.MinusToken && n.operand.kind === ts.SyntaxKind.NumericLiteral) return true;
  if (ts.isArrayLiteralExpression(n)) return n.elements.every(isPure);
  if (ts.isObjectLiteralExpression(n)) return n.properties.every(p => ts.isPropertyAssignment(p) && !ts.isComputedPropertyName(p.name) && isPure(p.initializer));
  return false;
};
const lines = src.split('\n');
const annotatedMath = (startPos) => {   // האם השורה-הקודמת היא אנוטציית קבוע-מתמטי (⇒ מנגנון, לא-דאטה)
  const line = src.slice(0, startPos).split('\n').length - 1;   // אינדקס-שורה 0-בסיס של ההצהרה
  return /קבוע-מתמטי/.test(lines[line - 1] || '');
};

// איסוף קבועי-דאטה ברמת-המודול (VariableStatement ישיר תחת ה-source)
const picks = [];   // {name, exported, start, end, initText, isScalar}
for (const st of sf.statements) {
  if (!ts.isVariableStatement(st)) continue;
  const exported = st.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword) || false;
  for (const d of st.declarationList.declarations) {
    if (!ts.isIdentifier(d.name) || !d.initializer || !isPure(d.initializer)) continue;
    const scalar = !ts.isArrayLiteralExpression(d.initializer) && !ts.isObjectLiteralExpression(d.initializer);
    if (scalar && annotatedMath(st.getStart(sf))) continue;   // סקלר-מתמטי-מסומן ⇒ מנגנון, דלג
    picks.push({ name: d.name.text, exported, initText: d.initializer.getText(sf), isScalar: scalar, stStart: st.getStart(sf), stEnd: st.getEnd(), leadStart: st.getFullStart() });
  }
}
if (!picks.length) { console.log(`~ ${base}: אין קבועי-דאטה ברמת-המודול`); process.exit(0); }

// אטום-הדאטה: כל הקבועים כ-export const (צורת-דאטה טהורה ⇒ פטור-טוהר-עומק)
const atomsDir = path.join(dir, '..', 'atoms');
const dataAtom = path.join(atomsDir, base + '-data.mjs');
fs.writeFileSync(dataAtom,
  `/** אטום-דאטה · ${base}-data — קבועי-הדומיין של הקופסה (הכרעה 19: טבלה/סף-דומיין = דאטה).\n *  חולץ מנועית מ-${base} · צורת-דאטה טהורה (פטור-טוהר-עומק). חוזה: ${base}-data.contract.md */\n`
  + picks.map(p => `export const ${p.name} = ${p.initText};`).join('\n') + '\n');
fs.writeFileSync(path.join(atomsDir, base + '-data.contract.md'),
  `# חוזה · ${base}-data\nאטום-דאטה שהורם מנועית מקופסת ${base} (הכרעה 19) — קבועי-דומיין/טבלאות. שינוי = שינוי-מודע בקופסה.\n\n## דוגמאות-זהב\nצילום-ערך ב-${base}-data.test.mjs.\n`);
// בדיקת-צילום מלאה: ערכים (לא רק מפתחות) — מוטציית-ערך מאדימה (L27). נטען מהאטום עצמו.
const snapMod = await import(pathToFileURL(dataAtom).href + '?t=' + Date.now());
const snap = {}; for (const k of Object.keys(snapMod).sort()) snap[k] = snapMod[k] instanceof Set ? [...snapMod[k]] : snapMod[k] instanceof Map ? [...snapMod[k]] : snapMod[k];
fs.writeFileSync(path.join(atomsDir, base + '-data.test.mjs'),
  `// בדיקת-צילום · ${base}-data (ערכים מלאים — מוטציה מאדימה)\nimport * as D from '../atoms/${base}-data.mjs';\nimport assert from 'node:assert';\nconst norm = (v) => v instanceof Set || v instanceof Map ? [...v] : v;\nconst got = {}; for (const k of Object.keys(D).sort()) got[k] = norm(D[k]);\nassert.strictEqual(JSON.stringify(got), ${JSON.stringify(JSON.stringify(snap))});\nconsole.log('OK ${base}-data');\n`);

// חיווט-מחדש בקופסה: הסרת ההצהרות (מהסוף להתחלה) + יבוא-אטום בראש
let out = src;
for (const p of [...picks].sort((a, b) => b.stStart - a.stStart)) {
  // הסרה כולל הגדרה; אם היה export — הסמל עדיין-מיוצא דרך re-export מהאטום? לא: הקופסה מייבאת ומייצאת-מחדש.
  out = out.slice(0, p.stStart) + out.slice(p.stEnd).replace(/^;?\s*\n?/, '\n');
}
const names = picks.map(p => p.name);
const reExport = picks.filter(p => p.exported).map(p => p.name);
let inject = `import { ${names.join(', ')} } from '../atoms/${base}-data.mjs';\n`;
if (reExport.length) inject += `export { ${reExport.join(', ')} } from '../atoms/${base}-data.mjs';\n`;
out = out.replace(/^(\/\*\*[\s\S]*?\*\/\n)?/, (m) => (m || '') + inject);
fs.writeFileSync(file, out);
console.log(`✅ ${base}: ${picks.length} קבועי-דאטה (${picks.filter(p => !p.isScalar).length} טבלאות · ${picks.filter(p => p.isScalar).length} סקלרים) ⇒ ${base}-data + חיווט`);
