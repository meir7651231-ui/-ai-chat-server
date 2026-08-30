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

// ── ישות: workflow + כרטיס-טופס + כפתור-שמירה + רשומות ──
export function renderEntity(slug, { name, icon = '🗂️', schema, stages = [] }) {
  const { k, dump } = makeConsts(slug);
  const cTitle = k(name);
  const cSub = k(`${schema.length} שדות${stages.length ? ` · ${stages.length} שלבים` : ''}`);
  const cIcon = k(icon);
  const cSave = k('שמירה');
  const cForm = k('פרטי הרשומה');
  const cRecords = k('רשומות');
  const cEmpty = k(`אין ${name} עדיין — הרשומה הראשונה תופיע כאן`);
  const body = [];
  if (stages.length >= 2) {
    const stepConsts = stages.map((s) => k(s));
    const cur = Math.min(2, stages.length - 1);
    body.push(`      DsWorkflow(steps: const [${stepConsts.join(', ')}], current: ${cur}),`);
  }
  const inputImports = new Set();
  const fileOf = (cls) => `../dart-ui-bs/ds/${cls.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()}.dart`;
  const fieldWidgets = schema.map((s) => {
    const cls = pickInput(s.label);   // אטום-הקלט נבחר לפי-משמעות מהאטומים (טהור)
    inputImports.add(`import '${fileOf(cls)}';`);
    const cl = k(s.label);
    if (cls === 'DsField') return `        DsField(label: ${cl}, hint: '', value: '', onChanged: (_) {}),`;
    return `        ${cls}(label: ${cl}),`;
  });
  body.push(`      DsSection(title: ${cForm}, children: [\n${fieldWidgets.join('\n')}\n      ]),`);
  body.push(`      DsSection(title: ${cRecords}, children: const [DsEmpty(label: ${cEmpty})]),`);

  const cls = pascal(slug);
  const code = `// ✨ חולל ע"י מנוע-הרינדור (render-ds) על מערכת-העיצוב — סכמה ⇒ מסך-פרימיום. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
${[...inputImports].sort().join('\n')}
import 'package:flutter/material.dart';

class ${cls} extends StatelessWidget {
  const ${cls}({super.key});

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: ${cTitle},
      subtitle: ${cSub},
      icon: ${cIcon},
      bottomBar: DsPrimaryButton(label: ${cSave}),
      children: [
${body.join('\n')}
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
    const val = k('0');
    const sub = k(`${e.fields} שדות${e.stages ? ` · ${e.stages} שלבים` : ''}`);
    const g = k(e.icon || '🗂️');
    return `DsStat(label: ${lbl}, value: ${val}, sub: ${sub}, glyph: ${g})`;
  });
  const rows = [];
  for (let i = 0; i < tiles.length; i += 2) {
    const a = tiles[i], b = tiles[i + 1];
    const second = b ? `Expanded(child: ${b})` : 'const Expanded(child: SizedBox())';
    rows.push(`      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: ${a}), const SizedBox(width: 12), ${second}]))),`);
  }
  const cls = pascal(slug);
  const code = `// ✨ חולל ע"י מנוע-הרינדור (render-ds) — דשבורד מנתוני-הישויות. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
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
