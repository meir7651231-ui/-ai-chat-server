#!/usr/bin/env node
/** 🧬 מחצב · המחולל v1 (genesis-gen) — הכרעה 17: בקשה ⇒ בחירת-אטומים ⇒ חיווט ⇒ מסך עובד.
 *
 *  הצורה: כל spec = קובץ טקסט ב-machtzev/generator/specs/<slug>.txt, שורה אחת:
 *      <כותרת-המסך>: <חלק>, <חלק>, <חלק>...
 *  כל חלק = מילת-צורה (מתג/שדה/מספר/כפתור/באנר...) + התווית בעברית.
 *
 *  הצנרת: (1) אטלס-המדף — סריקת כל אטומי new/dart-ui-bs: מחלקה, props, בנאי, תפקיד-צורני.
 *          (2) בחירה — ניקוד התאמה-למטרה: תפקיד תואם + כל ה-required ניתנים-למילוי.
 *          (3) חיווט — מצב-מקומי אמיתי (מתג עובד, שדה כותב, כפתור מגיב) — מסך שלם, אפס-TODO.
 *  תוכן: רק דרך קובץ-דאטה (auto/gen_<slug>_content.dart) — אפס-עברית בקוד-המסך.
 *
 *  שימוש: node genesis-gen.mjs                     ⇒ מחולל-מחדש את כל ה-specs השמורים
 *         node genesis-gen.mjs <slug> "<spec>"     ⇒ שומר spec חדש ומחולל אותו
 */
import fs from 'node:fs';
import path from 'node:path';
import { classBody, stripComments } from '../assemble/lift-lib.mjs';

const ROOT = new URL('../../', import.meta.url).pathname;
const SHELF = path.join(ROOT, 'new/dart-ui-bs');
const OUT = path.join(ROOT, 'new/dart-gen-bs');
const DATA = path.join(ROOT, 'new/dart-data-bs/auto');
const SPECS = path.join(ROOT, 'machtzev/generator/specs');

// ── (1) אטלס-המדף ──────────────────────────────────────────────────────────
const atlas = [];
for (const f of fs.readdirSync(SHELF, { recursive: true }).map(String)) {
  const p = path.join(SHELF, f);
  if (!f.endsWith('.dart') || f.endsWith('_test.dart') || !fs.statSync(p).isFile()) continue;
  const src = stripComments(fs.readFileSync(p, 'utf8'));
  for (const cm of src.matchAll(/class\s+([A-Z][A-Za-z0-9]*)\s+extends\s+(?:StatelessWidget|StatefulWidget)\b/g)) {
    const cls = cm[1];
    const body = classBody(src, cm.index) || '';
    // props: שדות-final (כולל טיפוסי-פונקציה/record)
    const types = new Map();
    for (const fm of body.matchAll(/final\s+((?:\([^)]*\)\??|[A-Za-z_][\w<>,?() ]*?))\s+([a-zA-Z_]\w*)\s*;/g)) types.set(fm[2], fm[1].trim());
    // בנאי: מיקומיים + required
    const ctm = body.match(new RegExp('(?:const\\s+)?' + cls + '\\s*\\(([\\s\\S]*?)\\)\\s*[;:{]'));
    if (!ctm) continue;
    const sig = ctm[1];
    const positional = [];
    const namedPart = sig.includes('{') ? sig.slice(sig.indexOf('{')) : '';
    for (const pp of (sig.includes('{') ? sig.slice(0, sig.indexOf('{')) : sig).split(',')) {
      const mm = pp.match(/this\.(\w+)/); if (mm) positional.push(mm[1]);
    }
    const required = new Set([...namedPart.matchAll(/required\s+this\.(\w+)/g)].map(x => x[1]));
    const named = new Set([...namedPart.matchAll(/this\.(\w+)/g)].map(x => x[1]));
    atlas.push({ cls, file: f, types, positional, required, named });
  }
}
fs.mkdirSync(path.join(ROOT, 'machtzev/generator'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'machtzev/generator/atlas.json'), JSON.stringify(atlas.map(a => ({ cls: a.cls, file: a.file, props: [...a.types.keys()], required: [...a.required], positional: a.positional })), null, 1));

// ── תפקיד-צורני מהשם ──
const roleOf = (cls) =>
  /Switch/.test(cls) ? 'switch'
    : /Number|Stepper|Counter/.test(cls) ? 'number'
      : /Validated|TextRow|TextField|Input|Field/.test(cls) ? 'textfield'
        : /Button|Action/.test(cls) ? 'button'
          : /Banner/.test(cls) ? 'banner'
            : /Radio|Segment/.test(cls) ? 'radio'
              : /Slider/.test(cls) ? 'slider'
                : /Chip/.test(cls) ? 'chip'
                  : /Row|Tile/.test(cls) ? 'row' : 'other';

// ── לקסיקון-הצורה: מילה-בעברית ⇒ תפקיד ──
const LEXICON = new Map(Object.entries({
  'מתג': 'switch', 'בורר': 'switch', 'הפעלה': 'switch',
  'שדה': 'textfield', 'קלט': 'textfield', 'טקסט': 'textfield', 'כתובת': 'textfield',
  'מספר': 'number', 'מונה': 'number', 'כמות': 'number',
  'כפתור': 'button', 'פעולה': 'button',
  'באנר': 'banner', 'הודעה': 'banner',
  'בחירה': 'radio', 'רדיו': 'radio',
  'שורה': 'row',
}));

// ── (3) חיווט: מילוי-prop לפי טיפוס+שם; מחזיר {expr, state?, needsLabel?} או null ──
const tokenFor = (n) =>
  /accent|cursor|active|brand/i.test(n) ? 'BsTokens.brand'
    : /muted|hint|subtitle/i.test(n) ? 'BsTokens.mutedLight'
      : /border|line|divider/i.test(n) ? 'BsTokens.divider'
        : /fill|surface|card|bg|background|chip/i.test(n) ? 'BsTokens.cardLight'
          : 'BsTokens.inkLight';

// ── חילול מסך אחד מ-spec ──────────────────────────────────────────────────
function generate(slug, spec) {
  const [titleRaw, restRaw] = spec.includes(':') ? [spec.slice(0, spec.indexOf(':')), spec.slice(spec.indexOf(':') + 1)] : ['מסך חדש', spec];
  const title = titleRaw.trim();
  const parts = restRaw.split(',').map(s => s.trim()).filter(Boolean).map(txt => {
    const words = txt.split(/\s+/);
    const role = LEXICON.get(words[0]) || 'row';
    const label = (LEXICON.has(words[0]) ? words.slice(1) : words).join(' ') || txt;
    return { role, label, txt };
  });

  const pascal = slug.replace(/(^|[_-])([a-z])/g, (_, __, c) => c.toUpperCase());
  const cls = 'Gen' + pascal + 'Screen';
  const consts = [];           // [name, value]
  const constFor = (v) => {
    const n = 'gen_' + slug + '_t' + (consts.length + 1);
    consts.push([n, v]);
    return n;
  };
  const stateDecls = [];       // הצהרות-State
  const imports = new Set(["import 'package:flutter/material.dart';", "import '../dart-ui-bs/auto/bs_tokens.dart';", `import '../dart-data-bs/auto/gen_${slug}_content.dart';`]);
  let sIdx = 0;

  // מילוי prop; part=החלק; פותח מצב-משותף value/onChanged דרך shared
  const fillProp = (a, name, part, shared) => {
    const t = (a.types.get(name) || 'String').replace(/\?$/, '');
    if (t === 'String' && name === 'value') { if (!shared.s) { shared.s = '_t' + (++sIdx); stateDecls.push(`String ${shared.s} = '';`); } return { expr: shared.s }; }
    if (t === 'String') return { expr: constFor(part.label) };
    if (t === 'bool' && name === 'value') { if (!shared.b) { shared.b = '_v' + (++sIdx); stateDecls.push(`bool ${shared.b} = false;`); } return { expr: shared.b }; }
    if (t === 'bool') return { expr: 'false' };
    if (t === 'int' && name === 'value') { if (!shared.i) { shared.i = '_n' + (++sIdx); stateDecls.push(`int ${shared.i} = 0;`); } return { expr: shared.i }; }
    if (t === 'int') return { expr: '0' };
    if (t === 'double') return { expr: /radius/i.test(name) ? '12' : '16' };
    if (t === 'Color') return { expr: tokenFor(name) };
    if (t === 'IconData') return { expr: 'Icons.tune' };
    if (t === 'TextEditingController') { const c = '_c' + (++sIdx); stateDecls.push(`final TextEditingController ${c} = TextEditingController();`); return { expr: c }; }
    if (t === 'VoidCallback' || t === 'void Function()') return { expr: `() => _toast(${constFor(part.label)})` };
    if (/^ValueChanged<bool>$|^void Function\(bool\)$/.test(t)) { if (!shared.b) { shared.b = '_v' + (++sIdx); stateDecls.push(`bool ${shared.b} = false;`); } return { expr: `(v) => setState(() => ${shared.b} = v)` }; }
    if (/^ValueChanged<int>$|^void Function\(int\)$/.test(t)) { if (!shared.i) { shared.i = '_n' + (++sIdx); stateDecls.push(`int ${shared.i} = 0;`); } return { expr: `(v) => setState(() => ${shared.i} = v)` }; }
    if (/^ValueChanged<String>$|^void Function\(String\)$/.test(t)) { if (!shared.s) { shared.s = '_t' + (++sIdx); stateDecls.push(`String ${shared.s} = '';`); } return { expr: `(v) => setState(() => ${shared.s} = v)` }; }
    if (/^List<String>/.test(t)) return { expr: 'const <String>[]' };
    return null;               // לא-ניתן-למילוי
  };

  // (2) בחירה: לכל חלק — האטום המנוקד-הכי-גבוה שכל ה-required שלו ניתנים-למילוי
  const chosen = [];
  for (const part of parts) {
    let best = null, bestScore = -1;
    for (const a of atlas) {
      const role = roleOf(a.cls);
      let score = role === part.role ? 5 : role === 'row' ? 1 : 0;
      if (score === 0) continue;
      if (/^Settings|Row$/.test(a.cls) || /Settings/.test(a.cls)) score += 1;
      // כל required חייב מילוי (בדיקה-יבשה, בלי לצרוך מונים)
      let fillable = true;
      for (const rq of [...a.required, ...a.positional]) {
        const t = (a.types.get(rq) || '').replace(/\?$/, '');
        if (!/^(String|bool|int|double|Color|IconData|TextEditingController|VoidCallback|void Function\(\)|ValueChanged<(bool|int|String)>|void Function\((bool|int|String)\)|List<String>)/.test(t)) { fillable = false; break; }
      }
      if (!fillable) continue;
      score -= 0.05 * (a.required.size + a.positional.length);
      if (score > bestScore) { bestScore = score; best = a; }
    }
    if (best) chosen.push({ part, atom: best });
  }
  if (!chosen.length) { console.log(`🧬 ${slug}: אף אטום לא נבחר — spec ריק?`); return null; }

  // חיווט + פליטת-קריאות
  const calls = [];
  for (const { part, atom } of chosen) {
    imports.add(`import '../dart-ui-bs/${atom.file}';`);
    const shared = {};
    const argsOut = [];
    for (const pn of atom.positional) {
      const r = fillProp(atom, pn, part, shared);
      argsOut.push((r ? r.expr : "''"));
    }
    for (const pn of atom.named) {
      const req = atom.required.has(pn);
      const t = (atom.types.get(pn) || '').replace(/\?$/, '');
      if (!req && !(t === 'String' && /^(label|title|text|hint)$/.test(pn)) && !/^ValueChanged|^void Function\(/.test(t) && pn !== 'value' && pn !== 'onTap' && pn !== 'onPressed') continue;
      const r = fillProp(atom, pn, part, shared);
      if (r) argsOut.push(`${pn}: ${r.expr}`);
      else if (req) argsOut.push(`${pn}: (null as dynamic) /* לא-ממולא */`);
    }
    calls.push(`          ${atom.cls}(${argsOut.join(', ')}),`);
  }

  const titleConst = constFor(title);
  // קובץ-התוכן (עברית רק כאן)
  fs.writeFileSync(path.join(DATA, `gen_${slug}_content.dart`),
    '// 📦 דאטה · תוכן-המחולל (genesis-gen) — התוויות מן-הבקשה, verbatim. אל תערוך ידנית.\n' +
    consts.map(([n, v]) => `const String ${n} = '${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}';`).join('\n') + '\n');

  // קובץ-המסך (אפס-עברית בקוד)
  const code = `// 🧬 חולל ע"י המחולל (genesis-gen, הכרעה 17) — בקשה ⇒ בחירת-אטומים ⇒ חיווט ⇒ מסך. אל תערוך ידנית.
// 🧬 שם: ${title}
// 🧬 בקשה: ${spec}
// 🧬 אטומים שנבחרו: ${chosen.map(c => c.atom.cls).join(' · ')}
${[...imports].sort().join('\n')}

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});

  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  ${stateDecls.join('\n  ')}

  void _toast(String msg) => ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(msg), duration: const Duration(seconds: 2)),
      );

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: BsTokens.bgLight,
        appBar: AppBar(title: Text(${titleConst})),
        body: ListView(
          padding: const EdgeInsets.symmetric(vertical: 12),
          children: [
${calls.join('\n')}
          ],
        ),
      ),
    );
  }
}
`;
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, `gen_${slug}.dart`), code);
  console.log(`🧬 ${slug} · "${title}" · ${chosen.length}/${parts.length} חלקים ⇒ ${chosen.map(c => c.atom.cls).join(', ')}`);
  return cls;
}

// ── CLI ──
fs.mkdirSync(SPECS, { recursive: true });
const [slugArg, specArg] = process.argv.slice(2);
if (slugArg && specArg) fs.writeFileSync(path.join(SPECS, slugArg + '.txt'), specArg + '\n');
fs.rmSync(OUT, { recursive: true, force: true });
for (const f of fs.readdirSync(DATA)) if (/^gen_.*_content\.dart$/.test(f)) fs.unlinkSync(path.join(DATA, f));
let n = 0;
for (const f of fs.readdirSync(SPECS).filter(f => f.endsWith('.txt')).sort()) {
  const spec = fs.readFileSync(path.join(SPECS, f), 'utf8').trim();
  if (spec && generate(f.replace('.txt', ''), spec)) n++;
}
console.log(`🧬 המחולל · ${n} מסכים חוללו מ-${fs.readdirSync(SPECS).length} בקשות · אטלס: ${atlas.length} אטומים`);
