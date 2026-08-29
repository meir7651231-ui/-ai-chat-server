#!/usr/bin/env node
/** 🧬 מחצב · המחולל (genesis-gen) — הכרעות 17+18: בקשה ⇒ בחירת-אטומים ⇒ חיווט ⇒ מסך עובד.
 *
 *  מנוע-טהור (חוק-1): אפס-דאטה בקובץ הזה. כל הידע בקבצים:
 *    knowledge/lexicon.json — מילת-צורה-בעברית ⇒ תפקיד
 *    knowledge/roles.json   — שם-מחלקה ⇒ תפקיד-צורני
 *    knowledge/tokens.json  — שם-prop-צבע ⇒ טוקן
 *    atlas.mjs              — כל האטומים: widgets + functions + data
 *
 *  ‏spec = machtzev/generator/specs/<slug>.txt — רב-שורתי:
 *    שורה 1: כותרת-המסך  ·  כל שורה אחריה: חלק אחד (מילת-צורה + תווית).
 *    תחבירים: 'בחירה X: א / ב / ג' (אופציות) · 'הירו X | תת-כותרת' · 'נתון ⚛️ 42 תווית' (ערך).
 *
 *  שימוש: node genesis-gen.mjs                  ⇒ מחולל את כל ה-specs
 *         node genesis-gen.mjs <slug> "<spec>"  ⇒ שומר spec ומחולל
 */
import fs from 'node:fs';
import path from 'node:path';
import { stripComments, snake } from '../assemble/lift-lib.mjs';
import { buildAtlas, writeAtlas } from './atlas.mjs';

const ROOT = new URL('../../', import.meta.url).pathname;
const HERE = new URL('.', import.meta.url).pathname;
const OUT = path.join(ROOT, 'new/dart-gen-bs');
const DATA = path.join(ROOT, 'new/dart-data-bs/auto');
const SPECS = path.join(HERE, 'specs');

// ── הידע — נטען, לא-מוטמע ──
const LEX_RAW = JSON.parse(fs.readFileSync(path.join(HERE, 'knowledge/lexicon.json'), 'utf8'));
const LEXICON = new Map(Object.entries(LEX_RAW).filter(([k]) => !k.startsWith('_')));
const HERO_WORD = LEX_RAW._hero || '';
const ROLE_RULES = JSON.parse(fs.readFileSync(path.join(HERE, 'knowledge/roles.json'), 'utf8')).rules.map(r => ({ re: new RegExp(r.pattern), role: r.role }));
const TOKEN_RULES = JSON.parse(fs.readFileSync(path.join(HERE, 'knowledge/tokens.json'), 'utf8')).rules.map(r => ({ re: new RegExp(r.pattern, 'i'), token: r.token }));
const roleOf = (cls) => ROLE_RULES.find(r => r.re.test(cls))?.role || 'other';
const tokenFor = (n) => TOKEN_RULES.find(r => r.re.test(n)).token;
let termKeyOf = new Map();
try {
  for (const t of JSON.parse(fs.readFileSync(path.join(ROOT, 'screens-seed/terms-catalog.json'), 'utf8')).terms || [])
    if (!termKeyOf.has(t.he)) termKeyOf.set(t.he, t.key);
} catch { }

const atlas = buildAtlas();
writeAtlas(atlas);

// ── פירוק-בקשה: שורה ⇒ חלק {role,label,options,emoji,sub,hero,value} ──
function parsePart(txt) {
  let body = txt, options = null;
  const ci = txt.indexOf(':');
  if (ci > 0) { body = txt.slice(0, ci).trim(); options = txt.slice(ci + 1).split('/').map(s => s.trim()).filter(Boolean); }
  const em = body.match(/(\p{Extended_Pictographic}(?:️)?)/u);
  const emoji = em ? em[1] : null;
  if (emoji) body = body.replace(emoji, '').replace(/\s+/g, ' ').trim();
  let sub = null;
  const pi = body.indexOf('|');
  if (pi > 0) { sub = body.slice(pi + 1).trim(); body = body.slice(0, pi).trim(); }
  const vm = body.match(/\d[\d,.]*[%+]?/);
  const value = vm ? vm[0] : null;
  if (value) body = body.replace(value, '').replace(/\s+/g, ' ').trim();
  const words = body.split(/\s+/);
  return {
    role: LEXICON.get(words[0]) || 'row',
    hero: words[0] === HERO_WORD,
    label: (LEXICON.has(words[0]) ? words.slice(1) : words).join(' ') || body,
    txt, options, emoji, sub, value,
  };
}

// ── בחירה: האטום-הוויזואלי המנוקד-הכי-גבוה שכל ה-required שלו ניתנים-למילוי ──
const FILLABLE = /^(String|bool|int|double|Color|IconData|TextEditingController|VoidCallback|void Function\(\)|ValueChanged<(bool|int|String)>|void Function\((bool|int|String)\)|List<String>)/;
const INTERACTIVE = new Set(['textfield', 'number', 'switch', 'radio', 'chip', 'button', 'slider']);
function pickAtom(part) {
  let best = null, bestScore = -1;
  for (const a of atlas.widgets) {
    const role = roleOf(a.cls);
    let score = role === part.role ? 5 : role === 'row' ? 1 : 0;
    if (score === 0) continue;
    // תפקיד-אינטראקטיבי ⇒ האטום חייב יכולת-תגובה (on*) — תווית-דוממת לא משמשת שדה/מתג
    if (INTERACTIVE.has(part.role) && ![...a.types.keys()].some(n => /^on[A-Z]/.test(n))) continue;
    let fillable = true, widgetFills = 0;
    for (const rq of [...a.required, ...a.positional]) {
      const t = (a.types.get(rq) || '').replace(/\?$/, '');
      if (/^Widget\b/.test(t) || /^List<Widget>/.test(t)) { widgetFills++; continue; }
      if (/^List<\(\{/.test(t)) { if (!part.options?.length) { fillable = false; break; } continue; }
      if (!FILLABLE.test(t)) { fillable = false; break; }
    }
    if (!fillable) continue;
    if (part.options?.length && [...a.types.entries()].some(([n, t]) => /^(options|items)$/.test(n) && /^List</.test(t))) score += 2;
    if (part.hero && /Hero/.test(a.cls)) score += 4;
    if (part.sub && a.types.has('sub')) score += 2;
    score -= widgetFills + 0.05 * (a.required.size + a.positional.length);
    if (score > bestScore) { bestScore = score; best = a; }
  }
  return best;
}

// ── חילול מסך אחד ──
function generate(slug, specText) {
  const lines = specText.split('\n').map(s => s.trim().replace(/,$/, '')).filter(Boolean);
  const first = lines[0];
  const oneLine = lines.length === 1;
  const title = (oneLine ? (first.includes(':') ? first.slice(0, first.indexOf(':')) : '') : first.replace(/:$/, '')).trim();
  const partTexts = oneLine
    ? (first.includes(':') ? first.slice(first.indexOf(':') + 1) : first).split(',').map(s => s.trim()).filter(Boolean)
    : lines.slice(1);
  const parts = partTexts.map(parsePart);

  const cls = 'Gen' + slug.replace(/(^|[_-])([a-z])/g, (_, __, c) => c.toUpperCase()) + 'Screen';
  const consts = [];
  const usedNames = new Set();
  const constFor = (v, purpose) => {
    let n = 'gen_' + slug + '_' + (purpose || 'text'), i = 2;
    while (usedNames.has(n)) n = 'gen_' + slug + '_' + (purpose || 'text') + i++;
    usedNames.add(n);
    consts.push([n, v]);
    return n;
  };
  const stateDecls = [];
  const imports = new Set(["import 'package:flutter/material.dart';", "import '../dart-ui-bs/auto/bs_tokens.dart';", `import '../dart-data-bs/auto/gen_${slug}_content.dart';`]);
  let sIdx = 0;

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
    if (t === 'int' && /^(value|selectedIndex|activeIndex|selected|qty|count)$/.test(name)) { if (!shared.i) { shared.i = '_n' + (++sIdx); stateDecls.push(`int ${shared.i} = 0;`); } return { expr: shared.i }; }
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
    const rm2 = t.match(/^List<(\(\{[^}]*\}\))>$/);
    if (rm2 && part.options?.length) {
      const recT = rm2[1];
      const fields2 = [...recT.matchAll(/(String|bool|int)\s+(\w+)/g)];
      const items = part.options.map(o => '(' + fields2.map(([, ft, fn]) => `${fn}: ${ft === 'String' ? constFor(o, part.role + '_option') : ft === 'bool' ? 'true' : '0'}`).join(', ') + ')');
      return { expr: `const <${recT}>[${items.join(', ')}]` };
    }
    if (t === 'Widget') return { expr: 'const SizedBox(height: 4)' };
    if (/^List<Widget>/.test(t)) return { expr: 'const <Widget>[]' };
    return null;
  };

  const chosen = parts.map(part => ({ part, atom: pickAtom(part) })).filter(c => c.atom);
  if (!chosen.length) { console.log(`🧬 ${slug}: אף אטום לא נבחר`); return null; }

  const calls = [];
  for (const { part, atom } of chosen) {
    imports.add(`import '../dart-ui-bs/${atom.file}';`);
    const shared = {};
    const argsOut = [];
    for (const pn of atom.positional) { const r = fillProp(atom, pn, part, shared); argsOut.push(r ? r.expr : "''"); }
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
  fs.writeFileSync(path.join(DATA, `gen_${slug}_content.dart`),
    '// 📦 דאטה · תוכן-המחולל (genesis-gen) — התוויות מן-הבקשה, verbatim. אל תערוך ידנית.\n' +
    consts.map(([n, v]) => `const String ${n} = '${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}';${termKeyOf.has(v) ? ' // ' + termKeyOf.get(v) : ''}`).join('\n') + '\n');

  const code = `// 🧬 חולל ע"י המחולל (genesis-gen, הכרעות 17+18) — בקשה ⇒ בחירת-אטומים ⇒ חיווט ⇒ מסך. אל תערוך ידנית.
// 🧬 שם: ${title}
// 🧬 בקשה: ${lines.join(' · ')}
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
  // 🚨 שער-עצמי (הכרעה 16): קוד-המסך נקי — אפס-עברית ואפס-אימוג'י מחוץ להערות
  const codeOnly = stripComments(code);
  if (/[֐-׿]/.test(codeOnly) || /\p{Extended_Pictographic}/u.test(codeOnly)) {
    throw new Error(`🧬 ${slug}: עברית/אימוג'י דלפו לקוד-המסך — הפרת-טוהר`);
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
console.log(`🧬 המחולל · ${n} מסכים · אטלס-מלא: ${atlas.widgets.length} widgets · ${atlas.functions.length} functions · ${atlas.data.length} data`);
