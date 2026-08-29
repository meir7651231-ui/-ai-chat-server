#!/usr/bin/env node
/** 🏗️ מחצב · המנוע-המרכיב (gen-screen) — חוזה: GEN-SCREEN-CONTRACT.md.
 *  מניפסט-דאטה ⇒ קומפוזר-מסך Dart. דטרמיניסטי, מאמת-מול-המדף, אפס-עברית-בפלט.
 *  שימוש: node gen-screen.mjs <manifest.json> [out-dir=new/dart-screens-bs] */
import fs from 'node:fs';
import path from 'node:path';
const ROOT = new URL('../../', import.meta.url).pathname;
const manifestPath = process.argv[2];
const OUT = process.argv[3] || path.join(ROOT, 'new/dart-screens-bs');
if (!manifestPath) { console.error('שימוש: gen-screen.mjs <manifest.json>'); process.exit(1); }
const M = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const die = (msg) => { console.error('🚨 המרכיב: ' + msg); process.exit(1); };

// ── חובה 4: אפס-עברית במניפסט (תוכן רק דרך $:) ──
if (/[֐-׿]/.test(JSON.stringify(M.sections))) die('עברית-ליטרלית במניפסט — תוכן חייב לעבור דרך "$:" מקובץ-הדאטה');

// ── חובה 2: קריאת חתימות-המדף האמיתיות ──
const SHELF = path.join(ROOT, 'new/dart-ui-bs');
const shelf = {}; // ClassName ⇒ {file, props:Set, className}
for (const f of fs.readdirSync(SHELF, { recursive: true }).map(String)) {
  if (!f.endsWith('.dart') || !fs.statSync(path.join(SHELF, f)).isFile()) continue;
  const src = fs.readFileSync(path.join(SHELF, f), 'utf8');
  const cm = src.match(/class\s+([A-Za-z0-9]+)\s+extends\s+(?:StatelessWidget|StatefulWidget)/);
  if (!cm) continue;
  const props = new Set([...src.matchAll(/this\.([a-zA-Z0-9]+)/g)].map(x => x[1]));
  const types = new Map([...src.matchAll(/final\s+([A-Za-z_][\w<>,? ]*?)\s+([a-zA-Z0-9_]+)\s*;/g)].map(x => [x[2], x[1].trim()]));
  // חתימת-הבנאי: מיקומיים (לפני '{') בסדרם · required-בשמות
  let positional = [], requiredNamed = [];
  const ctm = src.match(new RegExp('(?:const\\s+)?' + cm[1] + '\\s*\\(([^)]*)\\)', 's'));
  if (ctm) {
    const [posPart, namedPart = ''] = ctm[1].split('{');
    positional = [...posPart.matchAll(/this\.(\w+)/g)].map(x => x[1]);
    requiredNamed = [...namedPart.matchAll(/required\s+this\.(\w+)/g)].map(x => x[1]);
  }
  shelf[cm[1]] = { file: f, props, types, positional, requiredNamed };
}
// TitledSection נצרך אוטומטית ע"י `title` על סקציה
if (!shelf.TitledSection) die('אין TitledSection במדף');

// ── פירוק ערך-prop לביטוי-Dart + רישום פרמטרים ──
const tokens = new Map();   // name ⇒ dartType
const callbacks = new Set();
const gates = new Set();
const params = new Map();   // חורי-נתוני-ריצה: name ⇒ type (הלוח מזרים)
const itemClasses = new Map(); // 🔁 repeat: ItemClass ⇒ [{name,type}]
function expr(v, scopeVar) {
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (typeof v !== 'string') die('ערך-prop לא-נתמך: ' + JSON.stringify(v));
  if (v.startsWith('$:')) {
    const e = v.slice(2).trim();
    if (scopeVar && (e === scopeVar || e.startsWith(scopeVar + '.'))) return e;
    return e; // הפניה לקבועי-קובץ-התוכן
  }
  if (v.startsWith('@:')) { const n = v.slice(2).trim(); callbacks.add(n); return n; }
  if (v.startsWith('?:')) { return null; } // מטופל ב-sectionCode (צריך את שם-ה-prop)
  if (v.startsWith('#:')) {
    const n = v.slice(2).trim();
    const t = /radius|size|width|height|space|pill/i.test(n) ? 'double' : 'Color';
    tokens.set(n, t); return 't.' + n;
  }
  if (/[֐-׿]/.test(v)) die('עברית-ליטרלית ב-prop: ' + v);
  return "'" + v.replace(/'/g, "\\'") + "'";
}

// ── חיבור סקציה-אחת ⇒ קוד-widget ──
const usedAtoms = new Set();
function sectionCode(s) {
  const A = shelf[s.atom] || die(`אטום "${s.atom}" לא-קיים במדף (new/dart-ui-bs)`);
  usedAtoms.add(s.atom);
  const scope = s.repeat?.as;
  for (const p of Object.keys(s.props || {}))
    if (!A.props.has(p)) die(`prop "${p}" לא-קיים בבנאי ${s.atom} — props-אמיתיים: ${[...A.props].join(',')}`);
  const rptItem = s.repeat?.item;
  if (rptItem) {
    const fields = Object.entries(s.props || {}).filter(([, v]) => v === '~:')
      .map(([k]) => ({ name: k, type: (A.types.get(k) || 'String').replace(/\?$/, '') }));
    itemClasses.set(rptItem, fields);
    const listName = rptItem.charAt(0).toLowerCase() + rptItem.slice(1) + 's';
    params.set(listName, `List<${rptItem}>`);
    s.repeat.in = '$: ' + listName;
  }
  const valOf = (k, v) => {
    if (v === '~:') return `${s.repeat.as}.${k}`;
    if (typeof v === 'string' && v.startsWith('?:')) {
      const t = v.slice(2).trim() || 'String';
      let n = k; while (params.has(n) && params.get(n) !== t) n += '2';
      params.set(n, t);
      return n;
    }
    return expr(v, scope);
  };
  for (const rq of [...A.positional, ...A.requiredNamed])
    if (!(rq in (s.props || {}))) die(`מניפסט-חסר: prop-חובה "${rq}" של ${s.atom} לא-סופק (סנכרן gen-manifest מול המדף)`);
  const posLines = A.positional.map(k => `${valOf(k, s.props[k])},`);
  const namedLines = Object.entries(s.props || {}).filter(([k]) => !A.positional.includes(k)).map(([k, v]) => `${k}: ${valOf(k, v)},`);
  const propLines = [...posLines, ...namedLines];
  let w = `${s.atom}(\n            ${propLines.join('\n            ')}\n          )`;
  if (s.repeat) {
    const listE = expr(s.repeat.in, null);
    w = `for (final ${scope} in ${listE}) ...[\n          ${w},\n          const SizedBox(height: 8),\n        ]`;
  }
  if (s.title) {
    usedAtoms.add('TitledSection');
    const inner = s.repeat ? `Column(children: [\n        ${w}\n      ])` : w;
    tokens.set('ink', 'Color');
    w = `TitledSection(\n          title: ${expr(s.title, null)},\n          inkColor: t.ink,\n          child: ${inner},\n        )`;
  }
  if (s.gate) { gates.add(s.gate); w = `if (${s.gate}) ${s.repeat && !s.title ? '...[' + w + ']' : w}`; }
  return w;
}
const sectionSnippets = (M.sections || []).map(sectionCode);

// ── חובה 3: פליטת-הקומפוזר ──
const cls = M.screen.replace(/(^|[_-])([a-z])/g, (_, __, c) => c.toUpperCase());
const imports = [...usedAtoms].map(a => `import '../dart-ui-bs/${shelf[a].file}';`).sort();
for (const c of M.content || []) imports.push(`import '../dart-data-bs/${c}';`);
const tokFields = [...tokens.entries()].sort().map(([n, t]) => `  final ${t} ${n};`).join('\n');
const tokCtor = [...tokens.keys()].sort().map(n => `required this.${n}`).join(', ');
const cbFields = [...callbacks].sort().map(n => `  final VoidCallback ${n};`).join('\n');
const gateFields = [...gates].sort().map(n => `  final bool ${n};`).join('\n');
const paramFields = [...params.entries()].sort().map(([n, t]) => `  final ${t} ${n};`).join('\n');
const ctorParams = [
  ...[...gates].sort().map(n => `required this.${n}`),
  ...[...callbacks].sort().map(n => `required this.${n}`),
  ...[...params.keys()].sort().map(n => `required this.${n}`),
  'required this.t',
].join(', ');

const out = `// 🏗️ חולל ע"י המנוע-המרכיב (gen-screen) — אל תערוך ידנית; ערוך את המניפסט.
// מקור: ${path.basename(manifestPath)} · המסך = דאטה; הקוד הזה = חיווט-בלבד (חוק-2).
// שערים/callbacks/טוקנים מוזרקים ע"י הלוח — אפס-IO, אפס-תוכן, אפס-הכרעות כאן.
import 'package:flutter/material.dart';
${imports.join('\n')}

${[...itemClasses.entries()].map(([ic, fs2]) => `/// שורת-נתונים לסקציית-repeat — הלוח ממפה את הרשימה-החיה לפריטים.
class ${ic} {
  const ${ic}({${fs2.map(f2 => 'required this.' + f2.name).join(', ')}});
${fs2.map(f2 => `  final ${f2.type} ${f2.name};`).join('\n')}
}
`).join('\n')}
/// טוקני-העיצוב שהמסך צורך — הלוח מזרים מקטלוג-הטוקנים.
class ${cls}Tokens {
  const ${cls}Tokens(${tokCtor ? '{' + tokCtor + '}' : ''});
${tokFields}
}

class ${cls}Composed extends StatelessWidget {
  const ${cls}Composed({${ctorParams}, super.key});
${gateFields}
${cbFields}
${paramFields}
  final ${cls}Tokens t;

  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          const SizedBox(height: 8),
          ${sectionSnippets.join(',\n          ')},
        ],
      );
}
`;
const codeOnly = out.split('\n').filter(l => !l.trim().startsWith('//')).join('\n');
if (/[֐-׿]/.test(codeOnly)) die('עברית דלפה לקוד-הפלט — הפרת-טוהר (תוכן חייב $: מקובץ-דאטה)');
fs.mkdirSync(OUT, { recursive: true });
const outFile = path.join(OUT, M.screen + '.g.dart');
fs.writeFileSync(outFile, out);
console.log(`🏗️ הורכב: ${path.relative(ROOT, outFile)} · ${M.sections.length} סקציות · ${usedAtoms.size} אטומי-מדף · ${tokens.size} טוקנים · ${callbacks.size} callbacks · ${params.size} פרמטרי-לוח · ${gates.size} שערים`);
