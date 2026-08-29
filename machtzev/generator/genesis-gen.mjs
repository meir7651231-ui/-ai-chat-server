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
import { classBody, stripComments, snake } from '../assemble/lift-lib.mjs';

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
    // props: שדות-final — כולל טיפוסי-record מקוננים ורשימות-שמות (final Color a, b, c;)
    const types = new Map();
    for (const fm of body.matchAll(/final\s+([^;=]+?)\s+([a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)*)\s*;/g))
      for (const nm of fm[2].split(',')) types.set(nm.trim(), fm[1].trim());
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
            : /Radio|Segment|Toggle/.test(cls) ? 'radio'
              : /Slider/.test(cls) ? 'slider'
                : /Kpi|Stat(?!us|e)/.test(cls) ? 'stat'
                : /Chip/.test(cls) ? 'chip'
                  : /Card/.test(cls) ? 'card'
                    : /Header|Section|Title/.test(cls) ? 'header'
                      : /Row|Tile/.test(cls) ? 'row' : 'other';

// ── לקסיקון-הצורה: מילה-בעברית ⇒ תפקיד ──
const LEXICON = new Map(Object.entries({
  'מתג': 'switch', 'בורר': 'switch', 'הפעלה': 'switch',
  'שדה': 'textfield', 'קלט': 'textfield', 'טקסט': 'textfield', 'כתובת': 'textfield',
  'מספר': 'number', 'מונה': 'number', 'כמות': 'number',
  'כפתור': 'button', 'פעולה': 'button',
  'באנר': 'banner', 'הודעה': 'banner',
  'בחירה': 'radio', 'רדיו': 'radio', 'בורר': 'radio',
  'תגיות': 'chip', 'תגית': 'chip',
  'כרטיס': 'card', 'אריח': 'card', 'הירו': 'card',
  'כותרת': 'header', 'סקציה': 'header',
  'שורה': 'row',
  'נתון': 'stat', 'מדד': 'stat',
}));

// ── (3) חיווט: מילוי-prop לפי טיפוס+שם; מחזיר {expr, state?, needsLabel?} או null ──
const tokenFor = (n) =>
  /accent|cursor|active|brand/i.test(n) ? 'BsTokens.brand'
    : /muted|hint|subtitle/i.test(n) ? 'BsTokens.mutedLight'
      : /border|line|divider/i.test(n) ? 'BsTokens.divider'
        : /fill|surface|card|bg|background|chip/i.test(n) ? 'BsTokens.cardLight'
          : 'BsTokens.inkLight';

// ── קטלוג-המונחים: ערך-עברי ⇒ מפתח-קטלוג (מוער ליד כל קבוע — 'מונח-קיים ⇒ המפתח שלו') ──
let termKeyOf = new Map();
try {
  const tc = JSON.parse(fs.readFileSync(path.join(ROOT, 'screens-seed/terms-catalog.json'), 'utf8'));
  for (const t of tc.terms || []) if (!termKeyOf.has(t.he)) termKeyOf.set(t.he, t.key);
} catch { }

// ── חילול מסך אחד מ-spec ──────────────────────────────────────────────────
function generate(slug, spec) {
  const [titleRaw, restRaw] = spec.includes(':') ? [spec.slice(0, spec.indexOf(':')), spec.slice(spec.indexOf(':') + 1)] : ['מסך חדש', spec];
  const title = titleRaw.trim();
  const parts = restRaw.split(',').map(s => s.trim()).filter(Boolean).map(txt => {
    // תחביר-אופציות: 'בחירה סוג עסק: קבלן / חנות / ספק' ⇒ label + options[]
    let body = txt, options = null;
    const ci = txt.indexOf(':');
    if (ci > 0) { body = txt.slice(0, ci).trim(); options = txt.slice(ci + 1).split('/').map(s => s.trim()).filter(Boolean); }
    // אימוג'י בבקשה ⇒ glyph של האטום (למשל 'מתג 🔔 קבלת התראות')
    const em = body.match(/(\p{Extended_Pictographic}(?:️)?)/u);
    const emoji = em ? em[1] : null;
    if (emoji) body = body.replace(emoji, '').replace(/\s+/g, ' ').trim();
    // תת-כותרת: 'הירו 🧬 המחולל | משפט בעברית נהיה מסך' ⇒ label + sub
    let sub = null;
    const pi = body.indexOf('|');
    if (pi > 0) { sub = body.slice(pi + 1).trim(); body = body.slice(0, pi).trim(); }
    // נתון-מספרי בחלק ⇒ value של אטום-מדד ('נתון ⚛️ 381 אטומים...')
    const vm = body.match(/\d[\d,.]*[%+]?/);
    const value = vm ? vm[0] : null;
    if (value) body = body.replace(value, '').replace(/\s+/g, ' ').trim();
    const words = body.split(/\s+/);
    const role = LEXICON.get(words[0]) || 'row';
    const hero = words[0] === 'הירו';
    const label = (LEXICON.has(words[0]) ? words.slice(1) : words).join(' ') || body;
    return { role, label, txt, options, emoji, sub, hero, value };
  });

  const pascal = slug.replace(/(^|[_-])([a-z])/g, (_, __, c) => c.toUpperCase());
  const cls = 'Gen' + pascal + 'Screen';
  const consts = [];           // [name, value] — שם = מטרת-הנתון (תורת-המטרות, לא מספור סידורי)
  const usedNames = new Set();
  const constFor = (v, purpose) => {
    let n = 'gen_' + slug + '_' + (purpose || 'text');
    let i = 2;
    while (usedNames.has(n)) n = 'gen_' + slug + '_' + (purpose || 'text') + i++;
    usedNames.add(n);
    consts.push([n, v]);
    return n;
  };
  const stateDecls = [];       // הצהרות-State
  const imports = new Set(["import 'package:flutter/material.dart';", "import '../dart-ui-bs/auto/bs_tokens.dart';", `import '../dart-data-bs/auto/gen_${slug}_content.dart';`]);
  let sIdx = 0;

  // מילוי prop; part=החלק; פותח מצב-משותף value/onChanged דרך shared
  const fillProp = (a, name, part, shared) => {
    const t = (a.types.get(name) || 'String').replace(/\?$/, '');
    if (name === 'value' && part.value != null && t === 'String') return { expr: constFor(part.value, part.role + '_value') };
    if (name === 'value' && part.value != null && t === 'int') return { expr: String(parseInt(part.value.replace(/[^0-9]/g, ''))) };
    if (t === 'String' && /^(value|selected)$/.test(name)) { if (!shared.s) { shared.s = '_t' + (++sIdx); stateDecls.push(`String ${shared.s} = '';`); } return { expr: shared.s }; }
    if (t === 'String' && /^(glyph|emoji|icon)$/.test(name)) return { expr: constFor(part.emoji || '🔹', part.role + '_glyph') };
    if (t === 'String' && /^(sub|subtitle|caption|secondary)$/.test(name)) return { expr: constFor(part.sub || part.label, part.role + '_sub') };
    if (t === 'String') return { expr: constFor(part.label, part.role + '_' + snake(name)) };
    if (t === 'bool' && name === 'value') { if (!shared.b) { shared.b = '_v' + (++sIdx); stateDecls.push(`bool ${shared.b} = false;`); } return { expr: shared.b }; }
    if (t === 'bool') return { expr: 'false' };
    if (t === 'int' && /^(value|selectedIndex|activeIndex|selected)$/.test(name)) { if (!shared.i) { shared.i = '_n' + (++sIdx); stateDecls.push(`int ${shared.i} = 0;`); } return { expr: shared.i }; }
    if (t === 'int') return { expr: '0' };
    if (t === 'double') return { expr: /radius/i.test(name) ? '12' : '16' };
    if (t === 'Color') return { expr: tokenFor(name) };
    if (t === 'IconData') return { expr: 'Icons.tune' };
    if (t === 'TextEditingController') { const c = '_c' + (++sIdx); stateDecls.push(`final TextEditingController ${c} = TextEditingController();`); return { expr: c }; }
    if (t === 'VoidCallback' || t === 'void Function()') return { expr: `() => _toast(${constFor(part.label, part.role + '_toast')})` };
    if (/^ValueChanged<bool>$|^void Function\(bool\)$/.test(t)) { if (!shared.b) { shared.b = '_v' + (++sIdx); stateDecls.push(`bool ${shared.b} = false;`); } return { expr: `(v) => setState(() => ${shared.b} = v)` }; }
    if (/^ValueChanged<int>$|^void Function\(int\)$/.test(t)) { if (!shared.i) { shared.i = '_n' + (++sIdx); stateDecls.push(`int ${shared.i} = 0;`); } return { expr: `(v) => setState(() => ${shared.i} = v)` }; }
    if (/^ValueChanged<String>$|^void Function\(String\)$/.test(t)) { if (!shared.s) { shared.s = '_t' + (++sIdx); stateDecls.push(`String ${shared.s} = '';`); } return { expr: `(v) => setState(() => ${shared.s} = v)` }; }
    if (/^List<String>/.test(t)) return { expr: part.options?.length ? `const <String>[${part.options.map(o => constFor(o, part.role + '_option')).join(', ')}]` : 'const <String>[]' };
    // רשימת-record של אופציות (למשל List<({String label, bool enabled})>)
    const rm2 = t.match(/^List<(\(\{[^}]*\}\))>$/);
    if (rm2 && part.options?.length) {
      const recT = rm2[1];
      const fields2 = [...recT.matchAll(/(String|bool|int)\s+(\w+)/g)];
      const items = part.options.map(o => '(' + fields2.map(([, ft, fn]) => `${fn}: ${ft === 'String' ? constFor(o, part.role + '_option') : ft === 'bool' ? 'true' : '0'}`).join(', ') + ')');
      return { expr: `const <${recT}>[${items.join(', ')}]` };
    }
    if (t === 'Widget') return { expr: 'const SizedBox(height: 4)' };
    if (/^List<Widget>/.test(t)) return { expr: 'const <Widget>[]' };
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
      if (/Settings/.test(a.cls)) score += 0.2;
      // כל required חייב מילוי (בדיקה-יבשה, בלי לצרוך מונים); Widget-ריק נקנס — עדיף אטום פשוט
      let fillable = true, widgetFills = 0;
      for (const rq of [...a.required, ...a.positional]) {
        const t = (a.types.get(rq) || '').replace(/\?$/, '');
        if (/^Widget\b/.test(t) || /^List<Widget>/.test(t)) { widgetFills++; continue; }
        if (/^List<\(\{/.test(t)) { if (!part.options?.length) { fillable = false; break; } continue; }
        if (!/^(String|bool|int|double|Color|IconData|TextEditingController|VoidCallback|void Function\(\)|ValueChanged<(bool|int|String)>|void Function\((bool|int|String)\)|List<String>)/.test(t)) { fillable = false; break; }
      }
      if (!fillable) continue;
      if (part.options?.length && [...a.types.entries()].some(([n2, t2]) => /^(options|items)$/.test(n2) && /^List</.test(t2))) score += 2;
      if (part.hero && /Hero/.test(a.cls)) score += 4;                 // 'הירו' ⇒ העדפת אטומי-Hero
      if (part.sub && a.types.has('sub')) score += 2;                  // יש תת-כותרת ⇒ אטום עם sub
      score -= widgetFills;
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

  const titleConst = constFor(title, 'app_bar_title');
  // קובץ-התוכן (עברית רק כאן)
  fs.writeFileSync(path.join(DATA, `gen_${slug}_content.dart`),
    '// 📦 דאטה · תוכן-המחולל (genesis-gen) — התוויות מן-הבקשה, verbatim. אל תערוך ידנית.\n' +
    consts.map(([n, v]) => `const String ${n} = '${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}';${termKeyOf.has(v) ? ' // ' + termKeyOf.get(v) : ''}`).join('\n') + '\n');

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
  // 🚨 שער-עצמי (הכרעה 16 'אין דאטה נקודה'): קוד-המסך נקי — אפס-עברית ואפס-אימוג'י מחוץ להערות;
  // כל הדאטה חי רק בקובץ-התוכן. הפרה ⇒ המנוע נופל, לא כותב קובץ מלוכלך.
  const codeOnly = stripComments(code);
  if (/[֐-׿]/.test(codeOnly) || /\p{Extended_Pictographic}/u.test(codeOnly)) {
    throw new Error(`🧬 ${slug}: עברית/אימוג'י דלפו לקוד-המסך — הפרת-טוהר (הדאטה חייב בקובץ-התוכן)`);
  }
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
