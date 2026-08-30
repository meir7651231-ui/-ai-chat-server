#!/usr/bin/env node
/** 🧼 מחצב · טיהור-קופסה מנועי — עברית + enum-מחרוזות ⇒ אטום-דאטה (צורת-דאטה טהורה,
 *  פטור-טוהר-עומק) + חוזה + בדיקת-צילום + חיווט-מחדש בקופסה. הערכים ביט-זהים ⇒ golden עומד.
 *  מטפל גם בתבניות-עם-שיבוץ (`לפני ${n} ימים`): החלקים-הליטרליים מורמים ל-${S.kN} —
 *  סמנטיקת-התבנית (כפיית-מחרוזת) נשמרת ביט-לביט. AST-אמת (TS). שימוש: node box-purify.mjs <box.mjs> */
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
const wanted = (t) => HEB.test(t) || enumSet.has(t);
const all = [];      // מחרוזות-ליטרל {start,end,text}
const tmpls = [];    // תבניות-עם-שיבוץ {start,end,node}
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
  } else if (ts.isTemplateExpression(n)) {
    const parts = [n.head.text, ...n.templateSpans.map(s => s.literal.text)];
    if (parts.some(t => HEB.test(t))) tmpls.push({ start: n.getStart(sf), end: n.getEnd(), node: n });
  }
  ts.forEachChild(n, walk);
};
walk(sf);
// ליטרלים-לטיהור: עברית/enum, שאינם בתוך תבנית שכבר נתפסת (מניעת-חפיפה)
const inTmpl = (pos) => tmpls.some(t => pos >= t.start && pos < t.end);
const lits = all.filter(l => wanted(l.text) && !inTmpl(l.start));
if (!lits.length && !tmpls.length) { console.log(`~ ${base}: אין עברית/enum לטיהור`); process.exit(0); }

// מפת-מפתחות משותפת (מחרוזות + חלקי-תבנית עברית/enum)
const key = {}; let ki = 0;
const reg = (t) => { if (!(t in key)) key[t] = 'k' + ki++; return key[t]; };
for (const l of lits) reg(l.text);
const escT = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');   // בריחת-תבנית לחלק-לא-מורם
const purifyExpr = (exprNode) => {   // שיבוץ ${...}: מחרוזות-עברית/enum שבתוכו מורמות ל-S.kN
  const es = exprNode.getStart(sf), ee = exprNode.getEnd();
  const inner = all.filter(l => l.start >= es && l.start < ee && wanted(l.text)).sort((a, b) => b.start - a.start);
  let x = src.slice(es, ee);
  for (const l of inner) x = x.slice(0, l.start - es) + 'S.' + reg(l.text) + x.slice(l.end - es);
  return x;
};
const rebuildTmpl = (node) => {   // תבנית⇒תבנית: חלק-עברית/enum ⇒ ${S.kN}, שיבוץ⇒${expr-מטוהר}, אחר⇒טקסט-מוברח
  const emit = (text) => text ? (wanted(text) ? '${S.' + reg(text) + '}' : escT(text)) : '';
  let t = '`' + emit(node.head.text);
  for (const s of node.templateSpans) t += '${' + purifyExpr(s.expression) + '}' + emit(s.literal.text);
  return t + '`';
};

const uniq = Object.keys(key);
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
const atomsDir = path.join(dir, '..', 'atoms');                     // אטום-דאטה חי ב-atoms (קופסה מייבאת אטום — חוקי)
fs.writeFileSync(path.join(atomsDir, base + '-strings.mjs'),
  `/** אטום-דאטה · ${base}-strings — מחרוזות-עברית/enum של הקופסה (הכרעה 19: מחרוזת-דומיין = דאטה).\n *  חולץ מנועית מ-${base} · צורת-דאטה טהורה (פטור-טוהר-עומק). חוזה: ${base}-strings.contract.md */\nexport const S = {\n`
  + uniq.map(t => `  ${key[t]}: '${esc(t)}',`).join('\n') + '\n};\n');
fs.writeFileSync(path.join(atomsDir, base + '-strings.contract.md'),
  `# חוזה · ${base}-strings\nאטום-דאטה שחולץ מנועית מקופסת ${base} (הכרעה 19) — מחרוזות-עברית/enum (כולל חלקי-תבנית). שינוי = שינוי-מודע בקופסה.\n\n## דוגמאות-זהב\nצילום-ערך ב-${base}-strings.test.mjs.\n`);
const snap = JSON.stringify(Object.fromEntries(uniq.map(t => [key[t], t])));
fs.writeFileSync(path.join(atomsDir, base + '-strings.test.mjs'),
  `// בדיקת-צילום · ${base}-strings\nimport { S } from '../atoms/${base}-strings.mjs';\nimport assert from 'node:assert';\nassert.strictEqual(JSON.stringify(S), ${JSON.stringify(snap)});\nconsole.log('OK ${base}-strings');\n`);

// חיווט-מחדש: תבניות + ליטרלים, מהסוף להתחלה (טווחים לא-חופפים)
const edits = [...lits.map(l => ({ start: l.start, end: l.end, repl: 'S.' + key[l.text] })),
  ...tmpls.map(t => ({ start: t.start, end: t.end, repl: rebuildTmpl(t.node) }))].sort((a, b) => b.start - a.start);
let out = src;
for (const e of edits) out = out.slice(0, e.start) + e.repl + out.slice(e.end);
out = out.replace(/^(\/\*\*[\s\S]*?\*\/\n)?/, (m) => (m || '') + `import { S } from '../atoms/${base}-strings.mjs';\n`);
fs.writeFileSync(file, out);
console.log(`✅ ${base}: ${lits.length} מחרוזות + ${tmpls.length} תבניות (${uniq.length} מפתחות · ${enumSet.size} enum) ⇒ ${base}-strings + חיווט`);
