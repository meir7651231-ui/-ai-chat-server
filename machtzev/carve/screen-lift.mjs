#!/usr/bin/env node
/** מחצב · מנוע-חילוץ-תוכן (screen-lift) — הכרעה-11: מנוע עדיף על נחיל.
 *  קלט: קובץ-מסך Flutter ⇒ פלט דטרמיניסטי:
 *   1) <שם>.content.dart — כל הדאטה-הצרובה (עברית/גליפים) פר-widget, ממופתחת.
 *   2) <שם>.props-plan.json — תוכנית-props לכל widget: מה מוחלף במה (לסוכן-המלטש
 *      נשאר רק: מיזוג-חתימות + התרת-סבך + איחוד-מנגנונים).
 *  מפתח דטרמיניסטי: CfgText('a.b', …) ⇒ הסיומת; אחרת slug מהמילים הראשונות.
 *  שימוש: node screen-lift.mjs <screen.dart> <out-dir> */
import fs from 'node:fs';
import path from 'node:path';
const [file, outDir] = process.argv.slice(2);
if (!file || !outDir) { console.error('שימוש: screen-lift.mjs <screen.dart> <out-dir>'); process.exit(1); }
const src = fs.readFileSync(file, 'utf8');
const noComments = src.replace(/\/\/[^\n]*/g, '');

function bodyOf(startIdx, s) {
  let i = s.indexOf('{', startIdx); if (i < 0) return ['', i, i];
  let d = 0, j = i;
  for (; j < s.length; j++) { if (s[j] === '{') d++; else if (s[j] === '}') { d--; if (!d) break; } }
  return [s.slice(i, j + 1), i, j];
}
const HEB = /[\u0590-\u05FF]/, GLYPH = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
const slug = (t) => t.replace(/[^\u0590-\u05FFA-Za-z0-9 ]/gu, '').trim().split(/\s+/).slice(0, 3).join('_')
  .replace(/[\u0590-\u05FF]/g, (c) => 'אבגדהוזחטיכלמנסעפצקרשתםןףץך'.includes(c) ? 'abgdhwzjtyklmnsefxqrct__'[('אבגדהוזחטיכלמנסעפצקרשת'.indexOf(c) + 23) % 23] || 'x' : 'x') || 'txt';

const decl = /class\s+(_?[A-Za-z0-9]+)\s+extends\s+(?:Stateless|Stateful|Consumer|ConsumerStateful)Widget/g;
const content = {}, plan = {}; let m, total = 0;
while ((m = decl.exec(noComments))) {
  const widget = m[1];
  const [body] = bodyOf(m.index, noComments);
  const entries = [];
  // CfgText('key','fallback') — המפתח כבר קיים במקור
  for (const c of body.matchAll(/CfgText\(\s*'([^']+)'\s*,\s*'([^']*)'/g))
    entries.push({ key: c[1].split('.').pop(), value: c[2], from: 'CfgText' });
  // מחרוזות עבריות/גליפיות רגילות (לא-אינטרפולציה מורכבת)
  for (const s of body.matchAll(/'([^'\n\\]*[\u0590-\u05FF\u{1F300}-\u{1FAFF}][^'\n\\]*)'/gu)) {
    const v = s[1];
    if (entries.some(e => e.value === v)) continue;
    const interp = v.includes('$');
    entries.push({ key: (interp ? 'tpl_' : '') + slug(v).slice(0, 24) + '_' + (entries.length + 1), value: v, from: interp ? 'template' : 'literal' });
  }
  if (!entries.length) continue;
  content[widget] = entries; total += entries.length;
  plan[widget] = {
    addProps: entries.map(e => ({ name: propName(e.key), type: 'String', replaces: e.value })),
    note: entries.some(e => e.from === 'template') ? 'תבניות-$: הקופסה מפרמטת, המנגנון מקבל מחרוזת-מוכנה' : '',
  };
}
function propName(k) { return k.replace(/[^A-Za-z0-9_]/g, '_').replace(/^([0-9])/, '_$1').replace(/_+(.)/g, (_, c) => c.toUpperCase()); }

// ── פלט 1: קובץ-תוכן Dart ──
const base = path.basename(file, '.dart');
let dart = `// 📦 דאטה-תוכן (חולל ע"י screen-lift, הכרעה-11: מנוע-לא-נחיל) · ${base}\n// מוצא: ${base}.dart — כל מחרוזת-תוכן שהייתה צרובה ב-widget, ממופתחת פר-מנגנון.\n\n`;
for (const [w, es] of Object.entries(content)) {
  dart += `const ${propName(w.replace(/^_/, '')).replace(/^[A-Z]/, c => c.toLowerCase())}Content = (\n`;
  const seen = new Set();
  for (const e of es) {
    let k = propName(e.key); while (seen.has(k)) k += '_'; seen.add(k);
    dart += `  ${k}: '${e.value.replace(/'/g, "\\'")}',\n`;
  }
  dart += ');\n\n';
}
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, base + '.content.dart'), dart);
fs.writeFileSync(path.join(outDir, base + '.props-plan.json'), JSON.stringify(plan, null, 1));

console.log(`⛏️  screen-lift · ${base}: ${Object.keys(content).length} widgets עם דאטה · ${total} פריטי-תוכן חולצו`);
for (const [w, es] of Object.entries(content)) console.log(`   ${w}: ${es.length} (${es.map(e => e.from === 'CfgText' ? '🔑' : e.from === 'template' ? '§' : '·').join('')})`);
console.log(`   ⇒ ${base}.content.dart + ${base}.props-plan.json`);
