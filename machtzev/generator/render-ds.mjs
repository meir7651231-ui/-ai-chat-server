#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  render-ds.mjs — מנוע-רינדור על מערכת-העיצוב (ds/ds.dart). מקבל סכמה מובנית
//  (ישות/דשבורד/לוח) ⇒ פולט מסך-Flutter מעוצב-ברמת-מוצר. עברית ⇒ קובץ-תוכן
//  (const), קוד-המסך נקי (חוק-הטוהר). זהו מסלול-DS: שליטה-מלאה בפריסה = קפיצת-מדרגה.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { stem } from './match.mjs';

const ROOT = new URL('../../', import.meta.url).pathname;
const HERE = new URL('.', import.meta.url).pathname;
const OUT = path.join(ROOT, 'new/dart-gen-bs');
const DATA = path.join(ROOT, 'new/dart-data-bs/auto');

const pascal = (slug) => 'GenApp' + slug.replace(/^app_/, '').replace(/(^|[_-])([a-z0-9])/g, (_, __, c) => c.toUpperCase()) + 'Screen';

// 🧠 בחירת שדה-הקלט — טהורה, מהאטומים. אטומי-הקלט מצהירים על עצמם "שדה לנתון <סוג>"
// (ה-he שלהם, בקובץ-האטום). המנוע אוחז את סוג-הנתון לפי חפיפת-משמעות בין תווית-השדה
// לתיאור-העצמי — אפס regex, אפס רשימת-מילים במנוע. מבחן-קונכייה: מחליף אטום ⇒ לומד מחדש.
const atlas = JSON.parse(fs.readFileSync(path.join(HERE, 'atlas.json'), 'utf8'));
const heToks = (s) => [...String(s || '').matchAll(/[֐-׿]{2,}/g)].map((m) => stem(m[0])).filter((t) => t.length > 1);
// מילים-עבריות שלמות (לא-גזומות) — לאימות-חפיפה מול הגזם (הגזם מקבץ, המילה מאשרת).
const heWords = (s) => [...String(s || '').matchAll(/[֐-׿]{2,}/g)].map((m) => m[0]);
// שער-קידומת: גזם משותף נחשב-אמת רק אם המילים-המקוריות חולקות קידומת-אמת (≥3 · ≥70%).
// מבטל התנגשויות-גזם (מ/ה/ל נשמט ⇒ מספר→ספר · לידה→מידה · הורים→שורת) — טהור, מבני.
const prefixMatch = (a, b) => { let n = 0; const m = Math.min(a.length, b.length); while (n < m && a[n] === b[n]) n++; return n >= 3 && n >= 0.7 * m; };
// אטומי-קלט = אלה שמצהירים "שדה לנתון…" בתיאור-העצמי (הצהרת-האטום, לא כלל-מנוע).
const INPUTS = atlas.widgets
  .filter((w) => (w.he || []).slice(0, 2).join(' ') === 'שדה לנתון')
  .map((w) => ({ cls: w.cls, st: [...new Set((w.he || []).flatMap(heToks))] }));
function pickInput(label) {
  const q = [...new Set(heToks(label))];
  let best = null, bs = 0;
  for (const w of INPUTS) {
    let s = 0;
    for (const t of q) if (w.st.includes(t)) s++;
    if (s > bs) { bs = s; best = w; }
  }
  return (best && best.cls) || 'DsField';
}

// 🔌 מנועי-טרנספורם לשדה: פונקציה טהורה String f(קלט[, אופ]) — ניתן להריץ על ערך-שדה
// בודד. עצמאיות בלבד (אפס import חוצה-אטום ⇒ סינכרון בטוח). הידע (he) על הפונקציה.
const PRIM = new Set(['dynamic', 'String', 'num', 'int', 'double', 'String?', 'num?']);
const srcOf = (shelf, file) => { try { return fs.readFileSync(path.join(ROOT, shelf, file), 'utf8'); } catch { return null; } };
const selfContained = (shelf, file) => { const s = srcOf(shelf, file); return s != null && !/^import\s+'(?!dart:|package:flutter)/m.test(s); };
// 🧱 טרנספורם-סקלרי בלבד: אטום שמטיל את-קלטו ל-Map/List (‏as Map / as List) צורך אובייקט
// מובנה, לא ערך-שדה בודד — פוסלים אותו מבריכת-הטרנספורם (מבני-טהור, לא רשימת-שמות). זה גם
// מסלק את התאמות-הרעש (‎'מידע רפואי'→שורת-מידע-על-חדר) וגם מונע Map-גולמי בניתוח-הקפדני.
const scalarBody = (shelf, file) => { const s = srcOf(shelf, file); return s != null && !/\bas\s+(Map|List)\b/.test(s); };
const XFORM = atlas.functions
  .filter((f) => f.ret === 'String' && (f.params || []).length >= 1 && PRIM.has(f.params[0].type) && ((f.params.length === 1) || /\[/.test(f.sig || '')) && (f.he || []).length && selfContained(f.shelf, f.file) && scalarBody(f.shelf, f.file))
  .map((f) => {
    const hw = (f.he || []).filter((w) => w.length >= 2);            // מילות-ה-he המקוריות
    return {
      name: f.name, file: f.file, shelf: f.shelf, inType: f.params[0].type.replace(/\?$/, ''),
      hwords: hw,                                                    // לאימות-קידומת
      subj: stem(hw[0] || ''),                                       // נושא-האטום (המילה-הראשונה בתיאורו-העצמי)
      head: new Set(hw.slice(0, 2).flatMap(heToks)),                 // כותרת = שתי-המילים-הראשונות
      label: hw.slice(0, 2).join(' ') || f.name,                    // תווית-תצוגה עברית (מהאטום, לא מזהה-הקוד)
      st: [...new Set(hw.flatMap(heToks))],
    };
  });

// 🎯 שכבה-1 · בחירה מכוונת-מטרה (לא הכי-קרוב, הכי-מתאים) — שלושה אותות טהורים:
// (א) IDF: מילה-נדירה-ספציפית ('טלפון') שווה יותר ממילה-נפוצה ('מספר') ⇒ מסלק רעש.
const xdf = new Map();
for (const f of XFORM) for (const t of f.st) xdf.set(t, (xdf.get(t) || 0) + 1);
const XN = XFORM.length || 1;
const xidf = (t) => Math.log((XN + 1) / ((xdf.get(t) || 0) + 1)) + 1;
// (ב) התאמת-טיפוס: מנוע-מספרי לשדה-מספרי, מנוע-טקסט לשדה-טקסט.
const TYPE_COMPAT = { num: ['num', 'int', 'double', 'dynamic', 'Object'], text: ['String', 'dynamic', 'Object'], date: ['String', 'dynamic', 'DateTime', 'Object'], bool: ['dynamic'] };
const INPUT_TYPE = { DsNumberField: 'num', DsDateField: 'date', DsToggleTile: 'bool', DsField: 'text' };
const typeOf = (label) => INPUT_TYPE[pickInput(label)] || 'text';
// בוחר מנוע-טרנספורם מכוון-מטרה. ארבעה אותות-טהורים, מצטברים — כל אחד מסלק מחלקת-רעש:
//  (ב) שער-טיפוס · (שער-קידומת) מילה-מקורית מאשרת את הגזם (לא התנגשות-חיתוך) ·
//  (מובהקות) מילה נחשבת רק אם ספציפית (df≤3) או נושא-האטום (he[0]) — מסלק מילות-כמות
//  גנריות ('מספר') · (כותרת) מילה-חופפת בשתי-הראשונות · (מיקוד) תיאור-אטום קצר (≤6).
function pickXform(label, ftype) {
  const fw = heWords(label).filter((w) => w.length >= 2);
  const ok = TYPE_COMPAT[ftype] || TYPE_COMPAT.text;
  let best = null, bs = 0, second = 0, bestHead = false;
  for (const f of XFORM) {
    if (!ok.includes(f.inType)) continue;                      // (ב) שער-טיפוס
    let s = 0, hh = false;
    for (const w of fw) {
      const t = stem(w);
      if (!f.st.includes(t)) continue;
      if (!f.hwords.some((ew) => prefixMatch(w, ew))) continue;   // שער-קידומת: מילה-מקורית מאשרת
      if (!((xdf.get(t) || 0) <= 3 || t === f.subj)) continue;    // מובהקות: ספציפית או נושא-האטום
      s += xidf(t);
      if (f.head.has(t)) hh = true;                               // חפיפה-בכותרת
    }
    if (s > bs) { second = bs; bs = s; best = f; bestHead = hh; } else if (s > second) second = s;
  }
  // מחווט רק במטרה-מובהקת + חפיפה-בכותרת + אטום-ממוקד — אחרת אין-חיווט (כנות > רעש).
  return (best && bs >= 2.4 && bestHead && best.st.length <= 6) ? best : null;
}

// מחולל-תוכן: אוסף מחרוזות-עברית ⇒ const; מחזיר את שם-הקבוע לשיבוץ בקוד.
function makeConsts(slug) {
  const consts = [];
  const k = (s) => {
    const name = `gen_${slug}_c${consts.length}`;
    consts.push([name, String(s)]);
    return name;
  };
  const dump = () => consts.map(([n, v]) => `const String ${n} = '${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}';`).join('\n') + '\n';
  return { k, dump };
}

const write = (slug, code, content) => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(DATA, { recursive: true });
  fs.writeFileSync(path.join(OUT, `gen_${slug}.dart`), code);
  fs.writeFileSync(path.join(DATA, `gen_${slug}_content.dart`), '// 📦 תוכן-DS (render-ds) — verbatim מהבקשה. אל תערוך ידנית.\n' + content);
};

// ── ישות: מסך-חי מחווט — טופס→שמירה→חנות→טבלה→דשבורד, + לוגיקת-אימפריה פר-שדה ──
export function renderEntity(slug, { name, icon = '🗂️', schema, stages = [] }) {
  const { k, dump } = makeConsts(slug);
  const cTitle = k(name);
  const cSub = k(`${schema.length} שדות${stages.length ? ` · ${stages.length} שלבים` : ''}`);
  const cIcon = k(icon);
  const cSave = k('שמירה');
  const cForm = k('פרטי הרשומה');
  const cRecords = k('רשומות');
  const cEmpty = k(`אין ${name} עדיין — הרשומה הראשונה תופיע כאן`);
  const cEntity = k(name);

  const funcImports = new Set();
  const labelConst = [];
  const fieldBlocks = [];
  let hasLive = false;
  schema.forEach((s, i) => {
    const cl = k(s.label); labelConst.push(cl);
    fieldBlocks.push(`          DsField(label: ${cl}, hint: '', value: _v[${i}] ?? '', onChanged: (v) => setState(() => _v[${i}] = v)),`);
    const xf = pickXform(s.label, typeOf(s.label));   // 🎯 מנוע-אימפריה מכוון-מטרה (טיפוס+IDF+מרווח)
    if (xf) {
      funcImports.add(`import '../${xf.shelf.replace(/^new\//, '')}/${xf.file}';`);
      const cx = k(xf.label);   // תווית עברית מתיאור-האטום — לא מזהה-קוד גולמי (טוהר-תצוגה)
      // המרת-קלט לפי-חתימה: מנוע-מספרי מקבל מספר בטיפוסו המדויק, אחר מקבל טקסט (טהור מהחוזה).
      const nt = xf.inType.replace(/\?$/, '');
      const arg = nt === 'int' ? `(int.tryParse(_v[${i}] ?? '') ?? 0)`
        : nt === 'double' ? `(double.tryParse(_v[${i}] ?? '') ?? 0)`
        : nt === 'num' ? `(num.tryParse(_v[${i}] ?? '') ?? 0)`
        : `(_v[${i}] ?? '')`;
      fieldBlocks.push(`          if ((_v[${i}] ?? '').trim().isNotEmpty) _live(${cx}, ${xf.name}(${arg})),`);
      hasLive = true;
    }
  });
  const stepsDart = stages.length >= 2
    ? `        DsWorkflow(steps: const [${stages.map((x) => k(x)).join(', ')}], current: ${Math.min(2, stages.length - 1)}),\n`
    : '';
  const saveEntries = labelConst.map((cl, i) => `${cl}: _v[${i}] ?? ''`).join(', ');
  const recValues = labelConst.map((cl) => `r[${cl}] ?? ''`).join(', ');
  const labelsList = labelConst.join(', ');

  const cls = pascal(slug);
  const code = `// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_store.dart';
${[...funcImports].sort().join('\n')}
import 'package:flutter/material.dart';

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});

  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  final Map<int, String> _v = {};

  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    appStore.add(${cEntity}, <String, String>{${saveEntries}});
    setState(() => _v.clear());
  }

${hasLive ? `  Widget _live(String label, String out) => Padding(
        padding: const EdgeInsets.only(top: 2, bottom: 6),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(11),
          decoration: BoxDecoration(color: DsTokens.accentSoft, borderRadius: BorderRadius.circular(DsTokens.rSm)),
          child: Row(children: [
            const Icon(Icons.bolt, size: 15, color: DsTokens.accentDark),
            const SizedBox(width: 7),
            Expanded(child: Text('\$label · \$out', style: const TextStyle(color: DsTokens.accentDark, fontSize: 13, fontWeight: FontWeight.w700))),
          ]),
        ),
      );

` : ''}  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: ${cTitle},
      subtitle: ${cSub},
      icon: ${cIcon},
      bottomBar: DsPrimaryButton(label: ${cSave}, onTap: _save),
      children: [
${stepsDart}        DsSection(title: ${cForm}, children: [
${fieldBlocks.join('\n')}
        ]),
        DsSection(title: ${cRecords}, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final rs = appStore.records(${cEntity});
              if (rs.isEmpty) return const DsEmpty(label: ${cEmpty});
              return Column(children: [
                for (final r in rs)
                  DsRecordCard(labels: const [${labelsList}], values: [${recValues}]),
              ]);
            },
          ),
        ]),
      ],
    );
  }
}
`;
  write(slug, code, dump());
  return { slug, cls };
}

// ── דשבורד: רשת אריחי-KPI מנתוני-הישויות של האפליקציה (נתוני-אמת, לא משפט חוזר) ──
export function renderDashboard(slug, { title, icon = '📊', entities }) {
  const { k, dump } = makeConsts(slug);
  const cTitle = k(title);
  const cSub = k(`${entities.length} מודולים · סקירת-על`);
  const cIcon = k(icon);
  const tiles = entities.map((e) => {
    const lbl = k(e.name);
    const sub = k(`${e.fields} שדות${e.stages ? ` · ${e.stages} שלבים` : ''}`);
    const g = k(e.icon || '🗂️');
    // ערך-חי: סופר את הרשומות בחנות פר-ישות (מגיב לשמירה)
    return `AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: ${lbl}, value: appStore.count(${lbl}).toString(), sub: ${sub}, glyph: ${g}))`;
  });
  const rows = [];
  for (let i = 0; i < tiles.length; i += 2) {
    const a = tiles[i], b = tiles[i + 1];
    const second = b ? `Expanded(child: ${b})` : 'const Expanded(child: SizedBox())';
    rows.push(`      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: ${a}), const SizedBox(width: 12), ${second}]))),`);
  }
  const cls = pascal(slug);
  const code = `// ✨ חולל ע"י מנוע-הרינדור (render-ds) — דשבורד מנתוני-הישויות החיים. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';

class ${cls} extends StatelessWidget {
  const ${cls}({super.key});

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: ${cTitle},
      subtitle: ${cSub},
      icon: ${cIcon},
      children: [
${rows.join('\n')}
      ],
    );
  }
}
`;
  write(slug, code, dump());
  return { slug, cls };
}

// ── לוח-ניווט: כרטיסי-ניווט לכל המסכים ──
export function renderHub(slug, { title, icon = '🏗️', screens }) {
  const { k, dump } = makeConsts(slug);
  const cTitle = k(title);
  const cSub = k(`${screens.length} מסכים · אפליקציה שלמה`);
  const cIcon = k(icon);
  const imports = new Set();
  const tiles = screens.map((s) => {
    const g = k(s.icon || '🗂️');
    const t = k(s.name);
    const sub = k(s.sub || '');
    imports.add(`import 'gen_${s.slug}.dart';`);
    return `      DsNavTile(glyph: ${g}, title: ${t}, sub: ${sub}, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const ${s.cls}()))),`;
  });
  const cls = pascal(slug);
  const code = `// ✨ חולל ע"י מנוע-הרינדור (render-ds) — לוח-ניווט. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
${[...imports].sort().join('\n')}
import 'package:flutter/material.dart';

class ${cls} extends StatelessWidget {
  const ${cls}({super.key});

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: ${cTitle},
      subtitle: ${cSub},
      icon: ${cIcon},
      children: [
${tiles.join('\n')}
      ],
    );
  }
}
`;
  write(slug, code, dump());
  return { slug, cls };
}

// ── מסך-מערכת גנרי: כותרת + סקשן עם ילדים (מתגים/מצב-ריק) ──
export function renderSystem(slug, { title, icon, sectionTitle, kind, items = [] }) {
  const { k, dump } = makeConsts(slug);
  const cTitle = k(title);
  const cSub = k('שכבת-מערכת');
  const cIcon = k(icon);
  const cSection = k(sectionTitle);
  let kids, extraImport = '';
  if (kind === 'toggles') {
    kids = items.map((it) => `        DsToggleTile(label: ${k(it)}),`);
    extraImport = "import '../dart-ui-bs/ds/ds_toggle_tile.dart';\n";
  } else {
    kids = [`        DsEmpty(label: ${k(items[0] || 'אין נתונים עדיין')}),`];
  }
  const cls = pascal(slug);
  const code = `// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-מערכת. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
${extraImport}import 'package:flutter/material.dart';

class ${cls} extends StatelessWidget {
  const ${cls}({super.key});

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: ${cTitle},
      subtitle: ${cSub},
      icon: ${cIcon},
      children: [
        DsSection(title: ${cSection}, children: [
${kids.join('\n')}
        ]),
      ],
    );
  }
}
`;
  write(slug, code, dump());
  return { slug, cls };
}

// ── CLI לבדיקה מהירה: node render-ds.mjs ──
if (import.meta.url === 'file://' + process.argv[1]) {
  renderEntity('app_ent3', {
    name: 'פרויקט', icon: '🗂️',
    schema: [
      { label: 'מספר' }, { label: 'שם' }, { label: 'סוג' }, { label: 'לקוח' }, { label: 'כתובת' },
      { label: 'שטח' }, { label: 'מנהל פרויקט' }, { label: 'מחיר חוזה' }, { label: 'תקציב' },
      { label: 'תאריך התחלה' }, { label: 'תאריך סיום' }, { label: 'סטטוס' },
    ],
    stages: ['תכנון', 'הצעה', 'חוזה', 'ביצוע', 'מסירה', 'נסגר'],
  });
  console.log('✨ rendered app_ent3 (DS) — gen_app_ent3.dart + content');
}
