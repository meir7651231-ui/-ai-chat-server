#!/usr/bin/env node
/** 🔢 מחצב · הרמת-מספרי-קסם מנועית (המנגנון-ההפוך, הכרעה 19: "קבועים = דאטה").
 *  כל מספר-קסם אינ-ליין שטוהר-העומק מסמן (val≥10 · לא-הקס · לא-חזקת-2 · לא-סיבי ·
 *  לא-פטור-חוק-6) — סף-דומיין/ניקוד/גבול = דאטה — מורם אנונימית (m0,m1..) לאטום
 *  new/atoms/<base>-nums.mjs; המנגנון נעשה עיוור (M.m0). רץ אחרי autoPurify ⇒ קבועים
 *  מכניים כבר-מסומנים ומדולגים; רק סף-דומיין-אמיתי מורם. ביט-זהה ⇒ golden עומד.
 *  ⚠️ אנונימי: הערך נשמר, המשמעות נשארת בהקשר-המנגנון (כמו העברית ב-box-purify).
 *  AST-אמת (TS, מראה מדויקת של deep-purity-scan). שימוש: node box-magic-lift.mjs <box.mjs> */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { requireTs } from './lib-ts.mjs';
const ts = requireTs();
const file = process.argv[2];
if (!file || !fs.existsSync(file)) { console.error('usage: box-magic-lift.mjs <box.mjs>'); process.exit(2); }
const base = path.basename(file).replace(/\.mjs$/, '');
const dir = path.dirname(file);
const src = fs.readFileSync(file, 'utf8');
const sf = ts.createSourceFile('b.mjs', src, ts.ScriptTarget.ES2022, true);
const rawLines = src.split('\n');
const lineOf = (pos) => src.slice(0, pos).split('\n').length - 1;
const isLaw6 = (pos) => { const ln = lineOf(pos); for (let q = Math.max(0, ln - 2); q <= ln; q++) if (rawLines[q] && (rawLines[q].includes('חוק-6') || rawLines[q].includes('פרוטוקול-חיצוני') || rawLines[q].includes('קבוע-מתמטי'))) return true; return false; };

const hits = [];   // {start,end,text,val}
const walk = (n) => {
  if (ts.isImportDeclaration(n)) return;
  if (ts.isNumericLiteral(n)) {
    const val = parseFloat(n.text);
    if (val >= 10 && !/^0[xbo]/i.test(n.getText(sf)) && !(Number.isInteger(val) && (val & (val - 1)) === 0)) {
      const p = n.parent;
      const bitwise = p && ts.isBinaryExpression(p) && /[&|^]|<<|>>/.test(p.operatorToken.getText(sf));
      if (!bitwise && !isLaw6(n.getStart(sf))) hits.push({ start: n.getStart(sf), end: n.getEnd(), text: n.text, val });
    }
    return;
  }
  ts.forEachChild(n, walk);
};
walk(sf);
if (!hits.length) { console.log(`~ ${base}: אין מספרי-קסם-דומיין להרמה`); process.exit(0); }

const uniq = [...new Set(hits.map(h => h.text))];
const key = {}; uniq.forEach((t, i) => key[t] = 'm' + i);
const atomsDir = path.join(dir, '..', 'atoms');
const numsFile = path.join(atomsDir, base + '-nums.mjs');
fs.writeFileSync(numsFile,
  `/** אטום-דאטה · ${base}-nums — סִפֵּי-דומיין מספריים של הקופסה (הכרעה 19: קבוע-דומיין = דאטה).\n *  חולץ מנועית מ-${base} · אנונימי (הערך נשמר, המשמעות בהקשר-המנגנון). פטור-טוהר-עומק. */\nexport const M = {\n`
  + uniq.map(t => `  ${key[t]}: ${t},`).join('\n') + '\n};\n');
fs.writeFileSync(path.join(atomsDir, base + '-nums.contract.md'),
  `# חוזה · ${base}-nums\nאטום-דאטה שהורם מנועית מקופסת ${base} (הכרעה 19) — סִפֵּי-דומיין מספריים אינ-ליין. שינוי = שינוי-מודע בקופסה.\n\n## דוגמאות-זהב\nצילום-ערך ב-${base}-nums.test.mjs.\n`);
const snap = JSON.stringify(Object.fromEntries(uniq.map(t => [key[t], parseFloat(t)])));
fs.writeFileSync(path.join(atomsDir, base + '-nums.test.mjs'),
  `// בדיקת-צילום · ${base}-nums (ערכים מלאים — מוטציה מאדימה)\nimport { M } from '../atoms/${base}-nums.mjs';\nimport assert from 'node:assert';\nassert.strictEqual(JSON.stringify(M), ${JSON.stringify(snap)});\nconsole.log('OK ${base}-nums');\n`);

let out = src;
for (const h of hits.sort((a, b) => b.start - a.start)) out = out.slice(0, h.start) + `M.${key[h.text]}` + out.slice(h.end);
out = out.replace(/^(\/\*\*[\s\S]*?\*\/\n)?/, (m) => (m || '') + `import { M } from '../atoms/${base}-nums.mjs';\n`);
fs.writeFileSync(file, out);
console.log(`✅ ${base}: ${hits.length} מספרי-קסם (${uniq.length} ייחודיים) ⇒ ${base}-nums + חיווט`);
