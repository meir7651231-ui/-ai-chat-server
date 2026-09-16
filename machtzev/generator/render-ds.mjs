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
const selfContained = (shelf, file) => { try { return !/^import\s+'(?!dart:|package:flutter)/m.test(fs.readFileSync(path.join(ROOT, shelf, file), 'utf8')); } catch { return false; } };
// ניתן-להרצה-על-ערך-בודד: אחרי הפרמטר הראשון אין *פרמטר-חובה* נוסף. נבדק מהחתימה
// עצמה (הזנב חייב להתחיל ב-[ או ב-{), ולא מעצם קיומו של סוגר-אופציונלי אי-שם —
// חתימה כמו amountInWords(amount, ONES, …, [currency]) נושאת 9 חובות ונדחית.
const oneArgCallable = (f) => {
  const sig = String(f.sig || '');
  const inner = sig.slice(sig.indexOf('(') + 1, sig.lastIndexOf(')')).trim();
  if (!inner) return false;
  if (inner.startsWith('{')) return false;   // הכל פרמטרי-שם — אין ארגומנט-מיקום כלל
  if (inner.startsWith('[')) return true;    // הפרמטר-המיקומי הראשון אופציונלי
  let d = 0;
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if ('(<[{'.includes(c)) d++;
    else if (')>]}'.includes(c)) d--;
    else if (c === ',' && d === 0) {
      const tail = inner.slice(i + 1).trim();
      if (tail.startsWith('[')) return true;                                  // זנב אופציונלי-מיקום
      return tail.startsWith('{') && !/(^|[{,\s])required\s/.test(tail);       // זנב-שם בלי חובה
    }
  }
  return true;                               // פרמטר-מיקום יחיד
};
const XFORM = atlas.functions
  .filter((f) => f.ret === 'String' && (f.params || []).length >= 1 && PRIM.has(f.params[0].type) && oneArgCallable(f) && (f.he || []).length && selfContained(f.shelf, f.file))
  .map((f) => ({ name: f.name, file: f.file, shelf: f.shelf, inType: f.params[0].type, st: [...new Set((f.he || []).flatMap(heToks))] }));
// בוחר מנוע-טרנספורם לשדה לפי-משמעות (אחזור טהור, אפס regex). דורש התאמה ברורה.
function pickXform(label, used) {
  const q = [...new Set(heToks(label))];
  let best = null, bs = 0;
  for (const f of XFORM) {
    if (used.has(f.name)) continue;
    let s = 0;
    for (const t of q) if (f.st.includes(t)) s++;
    if (s > bs) { bs = s; best = f; }
  }
  return bs >= 1 ? best : null;
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
  const usedX = new Set();
  const labelConst = [];
  const fieldBlocks = [];
  schema.forEach((s, i) => {
    const cl = k(s.label); labelConst.push(cl);
    fieldBlocks.push(`          DsField(label: ${cl}, hint: '', value: _v[${i}] ?? '', onChanged: (v) => setState(() => _v[${i}] = v)),`);
    const xf = pickXform(s.label, usedX);   // 🔌 מנוע-אימפריה נבחר לשדה לפי-משמעות (אחזור טהור)
    if (xf) {
      usedX.add(xf.name);
      funcImports.add(`import '../${xf.shelf.replace(/^new\//, '')}/${xf.file}';`);
      const cx = k(xf.name);
      // המרת-קלט לפי-חתימה: מנוע-מספרי מקבל מספר בטיפוסו המדויק, אחר מקבל טקסט (טהור מהחוזה).
      const nt = xf.inType.replace(/\?$/, '');
      const arg = nt === 'int' ? `(int.tryParse(_v[${i}] ?? '') ?? 0)`
        : nt === 'double' ? `(double.tryParse(_v[${i}] ?? '') ?? 0)`
        : nt === 'num' ? `(num.tryParse(_v[${i}] ?? '') ?? 0)`
        : `(_v[${i}] ?? '')`;
      fieldBlocks.push(`          if ((_v[${i}] ?? '').trim().isNotEmpty) _live(${cx}, ${xf.name}(${arg})),`);
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

  Widget _live(String label, String out) => Padding(
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

  @override
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
    return `      DsNavTile(glyph: ${g}, title: ${t}, sub: ${sub}, onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const ${s.cls}()))),`;
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

// ── 🧙 אשף-הבעלים: שלב-תחום (13 חבילות-ורטיקל) · שלב לכל ישות (כל מועמד = אפשרות
//    בנויה + מתג) · שלב-שדות (כל שדה = מתג דלוק) · סרגל-חי. הרכבה מעל אטומי-המדף
//    בלבד — לכל אפשרות נרשם מקורה (spec / קובץ-אטום); "המצאה" = אפשרות בלי מקור,
//    והסרגל סופר אותן. חוק-הבעלים: כל ספק ⇒ שתי האפשרויות נבנות ⇒ מתג דלוק.
// ── מועמדי-הקלט של שדה: כל אטומי-הקלט שמצהירים-עצמית על משמעות-התווית (אחזור
//    טהור, אותו ניקוד של pickInput) + אטום-ברירת-המחדל שהמנוע היה בוחר בלעדיהם.
export function rankInputs(label) {
  const q = [...new Set(heToks(label))];
  return INPUTS.map((w) => ({ cls: w.cls, file: w.file, s: q.filter((t) => w.st.includes(t)).length }))
    .filter((x) => x.s > 0).sort((a, b) => b.s - a.s || a.cls.localeCompare(b.cls));
}
// ── מועמדי-מנוע-החוקים של שדה: כל מנוע-טרנספורם שחולק משמעות עם התווית. ──
export function rankXforms(label) {
  const q = [...new Set(heToks(label))];
  return XFORM.map((f) => ({ ...f, s: q.filter((t) => f.st.includes(t)).length }))
    .filter((x) => x.s > 0).sort((a, b) => b.s - a.s || a.name.localeCompare(b.name));
}

const DS_INPUT_IMPORT = { DsField: 'ds/ds_field.dart', DsNumberField: 'ds/ds_number_field.dart', DsDateField: 'ds/ds_date_field.dart', DsToggleTile: 'ds/ds_toggle_tile.dart' };

export function renderWizard(slug, { entities, screenCount }) {
  const { k, dump } = makeConsts(slug);
  const cls = pascal(slug);

  const opts = [];                                  // כל מתג: {src} — src ריק = המצאה
  const addOpt = (src) => { opts.push({ src }); return opts.length - 1; };
  const imports = new Set(["import '../dart-ui-bs/auto/switch_row.dart';"]);
  const seenX = new Map();                          // שם-פונקציה ⇒ האטום שנבחר (מניעת התנגשות-שם)

  // ── שלב 0 — תחום: 13 כפתורים, כל אחד חבילת-ורטיקל בנויה מהאטום (בזמן-ריצה). ──
  const stepTitles = [k('תחום העסק')];
  const stepBodies = [`        if (_err() != null) DsEmpty(label: _err()!),
        if ((_w['industry'] as String).isNotEmpty) DsChip(label: _w['industry'] as String, tone: 1),
        for (final p in _industries)
          DsNavTile(
            glyph: p['emoji'] as String,
            title: p['label'] as String,
            sub: p['sub'] as String,
            onTap: () => setState(() => _w['industry'] = p['id']),
          ),`];

  // ── שלב לכל ישות — כל מועמד שהמנוע שקל, בנוי, עם מתג דלוק. ──
  const fieldIdx = [];                              // פר-ישות: מדדי-מתגי-השדות (לסרגל החי)
  let trial = 0;                                    // מונה שדות-ניסיון (ערך חי למנועי-החוקים)
  entities.forEach((e) => {
    const kids = [];
    e.schema.forEach((s) => {
      const t = trial++;
      const rows = [];
      const cands = rankInputs(s.label);
      if (!cands.some((c) => c.cls === 'DsField')) cands.push({ cls: 'DsField', file: DS_INPUT_IMPORT.DsField, s: 0 });
      for (const c of cands) {
        if (!DS_INPUT_IMPORT[c.cls]) continue;
        imports.add(`import '../dart-ui-bs/${DS_INPUT_IMPORT[c.cls]}';`);
        const i = addOpt(`dart-ui-bs/${DS_INPUT_IMPORT[c.cls]}`);
        rows.push(`          SwitchRow(label: ${k(`${c.cls} · dart-ui-bs/${DS_INPUT_IMPORT[c.cls]}`)}, value: _on[${i}], onChanged: (v) => setState(() => _on[${i}] = v)),`);
        const lbl = k(s.label);
        rows.push(c.cls === 'DsField'
          ? `          if (_on[${i}]) DsField(label: ${lbl}, hint: '', value: _t[${t}] ?? '', onChanged: (v) => setState(() => _t[${t}] = v)),`
          : `          if (_on[${i}]) ${c.cls}(label: ${lbl}),`);
      }
      for (const f of rankXforms(s.label)) {
        if (seenX.has(f.name) && seenX.get(f.name) !== f.file) continue;   // שם תפוס ע"י אטום אחר
        seenX.set(f.name, f.file);
        imports.add(`import '../${f.shelf.replace(/^new\//, '')}/${f.file}';`);
        const i = addOpt(`${f.shelf.replace(/^new\//, '')}/${f.file}`);
        rows.push(`          SwitchRow(label: ${k(`${f.name} · ${f.shelf.replace(/^new\//, '')}/${f.file}`)}, value: _on[${i}], onChanged: (v) => setState(() => _on[${i}] = v)),`);
        const nt = f.inType.replace(/\?$/, '');
        const arg = nt === 'int' ? `(int.tryParse(_t[${t}] ?? '') ?? 0)`
          : nt === 'double' ? `(double.tryParse(_t[${t}] ?? '') ?? 0)`
          : nt === 'num' ? `(num.tryParse(_t[${t}] ?? '') ?? 0)`
          : `(_t[${t}] ?? '')`;
        rows.push(`          if (_on[${i}] && (_t[${t}] ?? '').trim().isNotEmpty) _live(${k(f.name)}, ${f.name}(${arg})),`);
      }
      kids.push(`        DsSection(title: ${k(s.label)}, children: [\n${rows.join('\n')}\n        ]),`);
    });
    if ((e.stages || []).length >= 2) {
      const i = addOpt(`spec:${e.name}|שלבים`);
      kids.push(`        SwitchRow(label: ${k(`DsWorkflow · ${e.stages.length} שלבים (מהאפיון)`)}, value: _on[${i}], onChanged: (v) => setState(() => _on[${i}] = v)),`);
      kids.push(`        if (_on[${i}]) DsWorkflow(steps: const [${e.stages.map((x) => k(x)).join(', ')}], current: 0),`);
    }
    stepTitles.push(k(e.name));
    stepBodies.push(kids.join('\n'));
  });

  // ── שלב אחרון — שדות: כל שדה שהמחולל מכיר, מתג דלוק (הבעלים מכבה את המיותר). ──
  const fieldKids = [];
  entities.forEach((e) => {
    const mine = [];
    const rows = e.schema.map((s) => {
      const i = addOpt(`spec:${e.name}|${s.label}`);
      mine.push(i);
      return `          SwitchRow(label: ${k(`${s.label} · ${s.type}`)}, value: _on[${i}], onChanged: (v) => setState(() => _on[${i}] = v)),`;
    });
    fieldIdx.push(mine);
    fieldKids.push(`        DsSection(title: ${k(e.name)}, children: [\n${rows.join('\n')}\n        ]),`);
  });
  stepTitles.push(k('שדות'));
  stepBodies.push(fieldKids.join('\n'));

  const inventions = opts.filter((o) => !o.src).length;
  const bodies = stepBodies.map((b, i) => `  List<Widget> _s${i}() => [\n${b}\n      ];`).join('\n');
  const cases = stepBodies.map((_, i) => `      case ${i}: return _s${i}();`).join('\n');

  const code = `// ✨ חולל ע"י מנוע-הרינדור (render-ds) — אשף-הבעלים של האפליקציה. אל תערוך ידנית.
// הרכבה מעל אטומי-המדף בלבד (אפס קוד-חדש): wizard-industries · vertical-packs ·
// wizard-steps · empty-wizard · wizard-step-error + שקעיו · switch_row · ds/*.
// חוק-הבעלים: כל ספק ⇒ שתי האפשרויות נבנות ⇒ מתג דלוק כברירת-מחדל.
// "המצאה" = אפשרות שהוצעה לבעלים ואין לה מקור (אפיון או קובץ-אטום). כל מתג נושא
// את מקורו בתווית שלו, והסרגל-החי סופר — ${inventions} המצאות.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-maor/vertical-packs.dart' as vp;
import '../dart-maor/wizard-industries.dart' as wi;
import '../dart-maor/wizard-steps.dart' as ws;
import '../dart-maor/empty-wizard.dart' as ew;
import '../dart-maor/wizard-step-error.dart' as wse;
import '../dart-data-maor/wizard-step-error-sockets.dart' as wset;
${[...imports].sort().join('\n')}
import 'package:flutter/material.dart';

/// מספר-האפשרויות שאין להן מקור — חייב 0 (נמדד בזמן-החילול, לא מוצהר).
const int _kInventions = ${inventions};
const int _kScreens = ${screenCount};
/// מדדי-מתגי-השדות פר-ישות (הסרגל החי סופר מהם).
const List<List<int>> _kFieldOpts = [${fieldIdx.map((a) => `[${a.join(', ')}]`).join(', ')}];

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});

  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  /// מצב-האפס מהאטום empty-wizard — שדה industry הוא שלב-התחום.
  final Map<String, dynamic> _w = ew.emptyWizard();
  /// כל מתג דלוק כברירת-מחדל: הבעלים מכבה את המיותר, לא מדליק את החסר.
  final List<bool> _on = List<bool>.filled(${opts.length}, true);
  /// ערכי-ניסיון פר-שדה — מזינים את מנועי-החוקים החיים.
  final Map<int, String> _t = {};
  int _step = 0;

  /// 13 תחומי-העסק מהמדף: wizardIndustries(verticalPacks) — מקור-אמת יחיד.
  static final List<Map<String, dynamic>> _industries = wi.wizardIndustries(vp.verticalPacks);

  /// שקע-ולידציה שאינו נקרא: שלב-החשבון (4) של חוזה-המקור אינו חלק מאשף-זה.
  static dynamic _noSignUp(dynamic a, dynamic b, dynamic c, dynamic d, dynamic e, dynamic f) => null;

  /// ולידציה מהמדף. שלב-התחום = שלב 0 של החוזה (wizard-step-error). כל שלב אחר
  /// נמסר מעל גבול-החוזה (wizardSteps) ⇒ ענף-ברירת-המחדל של האטום מחזיר null —
  /// שלבי-הישויות והשדות הם רשות, כי הכל דלוק מראש.
  String? _err() => wse.wizardStepError(
      _step == 0 ? 0 : ws.wizardSteps, _w, _noSignUp, wset.wizardStepError_T) as String?;

  int get _liveFields => _kFieldOpts.fold(0, (n, g) => n + g.where((i) => _on[i]).length);
  int get _liveEntities => _kFieldOpts.where((g) => g.any((i) => _on[i])).length;

  Widget _live(String label, String out) => Padding(
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

  Widget _bar() => IntrinsicHeight(
        child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Expanded(child: DsStat(label: ${k('ישויות')}, value: _liveEntities.toString(), sub: ${k('דלוקות מתוך האפיון')}, glyph: '🗂️')),
          const SizedBox(width: 12),
          Expanded(child: DsStat(label: ${k('שדות')}, value: _liveFields.toString(), sub: ${k('מתגים דלוקים')}, glyph: '🔤')),
          const SizedBox(width: 12),
          Expanded(child: DsStat(label: ${k('מסכים')}, value: '\$_kScreens', sub: ${k('ייבנו לבעלים')}, glyph: '🖥️')),
          const SizedBox(width: 12),
          Expanded(child: DsStat(label: ${k('המצאות')}, value: '\$_kInventions', sub: ${k('אפשרות בלי מקור')}, glyph: '🚫')),
        ]),
      );

${bodies}

  List<Widget> _body() {
    switch (_step) {
${cases}
    }
    return const [];
  }

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: ${k('אשף האפליקציה')},
      subtitle: ${k(`${stepTitles.length} שלבים · הכל דלוק, כבו את המיותר`)},
      icon: '🧙',
      bottomBar: Row(children: [
        Expanded(child: DsPrimaryButton(label: ${k('הקודם')}, onTap: _step == 0 ? null : () => setState(() => _step--))),
        const SizedBox(width: 12),
        Expanded(child: DsPrimaryButton(label: ${k('הבא')}, onTap: (_step >= ${stepTitles.length - 1} || _err() != null) ? null : () => setState(() => _step++))),
      ]),
      children: [
        DsWorkflow(steps: const [${stepTitles.join(', ')}], current: _step),
        _bar(),
        ..._body(),
      ],
    );
  }
}
`;
  write(slug, code, dump());
  return { slug, cls, steps: stepTitles.length, options: opts.length, inventions };
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
