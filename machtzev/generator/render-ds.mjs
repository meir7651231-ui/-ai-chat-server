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

// 🔗 זיהוי שדה-קשר: שדה שכל-מילות-שם-ישות-אחרת מופיעות בו כמילים-שלמות ⇒ הפניה חיה.
// התאמה-מדויקת (לא קידומת) — 'כיתה נוכחית'→ישות 'כיתה', אבל 'תאריך לידה'≠'ליד' (מונע
// גלישת-קידומת לידה→ליד ומחזיר את השדה ללוגיקת-תאריך). טהור-מבני: נגזר משמות-האפיון.
function pickRelation(label, selfName, entityNames) {
  const fw = new Set(heWords(label));
  for (const en of entityNames) {
    if (en === selfName) continue;
    const ew = heWords(en);
    if (ew.length && ew.every((w) => fw.has(w))) return en;
  }
  return null;
}

// 🧮 מהדר-נוסחה (שורש-4): 'סכום - הנחה - תשלום' ⇒ ביטוי-Dart מספרי מעל שדות-האחות.
// שמות-שדה (הארוך-קודם) ⇒ קריאת-הערך; אופרטורים/מספרים/סוגריים עוברים. שארית לא-מזוהה ⇒ null
// (השדה נשאר רגיל — כנות > קוד-שבור). דטרמיניסטי, קומפילציית-זמן, אפס-eval בזמן-ריצה.
function compileFormula(formula, labels) {
  const sorted = labels.slice().sort((a, b) => b.label.length - a.label.length);
  let e = ' ' + formula + ' ';
  for (const f of sorted) e = e.split(f.label).join(` @${f.idx}@ `);
  const residue = e.replace(/@\d+@/g, ' ').replace(/[0-9.+\-*/()\s]/g, '');
  if (residue.trim().length) return null;                       // מילה לא-מזוהה ⇒ לא נוסחה-בטוחה
  const dart = e.replace(/@(\d+)@/g, "(num.tryParse(_v[$1] ?? '') ?? 0)").trim();
  return /@|[֐-׿]/.test(dart) ? null : (dart || null);
}

// ── ישות: מסך-חי מחווט — טופס→שמירה→חנות→טבלה→דשבורד, + קשרים(מזהה) + מסע + עריכה/מחיקה ──
export function renderEntity(slug, { name, icon = '🗂️', schema, stages = [], entityNames = [], nameToSlug = {}, backRefs = [] }) {
  const { k, dump } = makeConsts(slug);
  const cTitle = k(name);
  const cSub = k(`${schema.length} שדות${stages.length ? ` · ${stages.length} שלבים` : ''}`);
  const cIcon = k(icon);
  const cSave = k('שמירה');
  const cUpdate = k('עדכון');
  const cForm = k('פרטי הרשומה');
  const cRecords = k('רשומות');
  const cEmpty = k(`אין ${name} עדיין — הרשומה הראשונה תופיע כאן`);
  const cNoMatch = k('לא נמצאו רשומות תואמות');
  const SK = `'${slug}'`;   // מפתח-חנות = slug יציב (לא שם-תצוגה חתוך ⇒ אפס דליפת-נתונים בין ישויות)

  const funcImports = new Set();
  const typedImports = new Set();
  const labelConst = [];
  const fieldBlocks = [];
  const recValsR = [];   // ערך-תצוגה בטבלה פר-שדה
  const mapVals = [];    // ערך-שמירה פר-שדה (מחושב ⇒ תוצאת-הנוסחה; אחר ⇒ _v[i])
  const requiredIdx = [];
  let hasLive = false, hasRel = false, hasEnum = false, hasCalc = false, usedField = false;
  const labelIdx = schema.map((s, i) => ({ label: s.label, idx: i }));
  schema.forEach((s, i) => {
    const cl = k(s.label); labelConst.push(cl);
    const bind = `value: _v[${i}] ?? '', onChanged: (v) => setState(() => _v[${i}] = v)`;
    if (s.required) requiredIdx.push(i);
    // (0) שדה-מחושב (שורש-4): נוסחה מעל שדות-אחות ⇒ ערך-נגזר קריאה-בלבד (לא קלט).
    if (s.formula) {
      const expr = compileFormula(s.formula, labelIdx);
      if (expr) {
        hasCalc = true;
        fieldBlocks.push(`          _calc(${cl}, ${expr}),`);
        recValsR.push(`r[${cl}] ?? ''`); mapVals.push(`${cl}: (${expr}).toStringAsFixed(2)`);
        return;
      }
    }
    // (1) ערכים-מותרים (enum, שורש-6): בורר על קבוצה-סגורה מהאפיון (לא טקסט-חופשי).
    if (s.enumVals && s.enumVals.length) {
      hasEnum = true;
      const opts = s.enumVals.map((v) => k(v)).join(', ');
      fieldBlocks.push(`          DsEnumField(label: ${cl}, options: const [${opts}], ${bind}),`);
      recValsR.push(`r[${cl}] ?? ''`); mapVals.push(`${cl}: _v[${i}] ?? ''`);
      return;
    }
    // (2) שדה-קשר: השדה נוקב בישות-אחרת ⇒ בורר-רשומה ששומר מזהה-יעד יציב.
    const rel = pickRelation(s.label, name, entityNames);
    const tslug = rel ? (nameToSlug[rel] || null) : null;
    if (tslug) {
      hasRel = true;
      fieldBlocks.push(`          DsSelect(label: ${cl}, entity: '${tslug}', ${bind}),`);
      recValsR.push(`appStore.displayOf('${tslug}', r[${cl}] ?? '')`); mapVals.push(`${cl}: _v[${i}] ?? ''`);
      return;
    }
    // (3) טיפוס נאחז-מהאטומים ⇒ הווידג'ט האמיתי: תאריך→בורר · מספר→מקלדת · דו-ערכי→מתג.
    const ft = typeOf(s.label);
    if (ft === 'date') { typedImports.add("import '../dart-ui-bs/ds/ds_date_field.dart';"); fieldBlocks.push(`          DsDateField(label: ${cl}, ${bind}),`); recValsR.push(`r[${cl}] ?? ''`); mapVals.push(`${cl}: _v[${i}] ?? ''`); return; }
    if (ft === 'num')  { typedImports.add("import '../dart-ui-bs/ds/ds_number_field.dart';"); fieldBlocks.push(`          DsNumberField(label: ${cl}, ${bind}),`); recValsR.push(`r[${cl}] ?? ''`); mapVals.push(`${cl}: _v[${i}] ?? ''`); return; }
    if (ft === 'bool') { typedImports.add("import '../dart-ui-bs/ds/ds_toggle_tile.dart';"); fieldBlocks.push(`          DsToggleTile(label: ${cl}, ${bind}),`); recValsR.push(`r[${cl}] ?? ''`); mapVals.push(`${cl}: _v[${i}] ?? ''`); return; }
    // (4) טקסט: שדה חופשי + לוגיקת-אימפריה חיה מכוונת-מטרה (טיפוס+IDF+קידומת+מובהקות).
    usedField = true;
    fieldBlocks.push(`          DsField(label: ${cl}, hint: '', ${bind}),`);
    recValsR.push(`r[${cl}] ?? ''`); mapVals.push(`${cl}: _v[${i}] ?? ''`);
    const xf = pickXform(s.label, ft);
    if (xf) {
      funcImports.add(`import '../${xf.shelf.replace(/^new\//, '')}/${xf.file}';`);
      const cx = k(xf.label);   // תווית עברית מתיאור-האטום — לא מזהה-קוד גולמי (טוהר-תצוגה)
      const nt = xf.inType.replace(/\?$/, '');
      const arg = nt === 'int' ? `(int.tryParse(_v[${i}] ?? '') ?? 0)`
        : nt === 'double' ? `(double.tryParse(_v[${i}] ?? '') ?? 0)`
        : nt === 'num' ? `(num.tryParse(_v[${i}] ?? '') ?? 0)`
        : `(_v[${i}] ?? '')`;
      fieldBlocks.push(`          if ((_v[${i}] ?? '').trim().isNotEmpty) _live(${cx}, ${xf.name}(${arg})),`);
      hasLive = true;
    }
  });
  const reqChecks = requiredIdx.map((i) => `if ((_v[${i}] ?? '').trim().isEmpty) miss.add(${labelConst[i]});`).join('\n      ');
  const enumImport = hasEnum ? "import '../dart-ui-bs/ds/ds_enum_field.dart';\n" : '';
  const hasStages = stages.length >= 2;
  const stageConsts = hasStages ? stages.map((x) => k(x)) : [];
  const stageList = `[${stageConsts.join(', ')}]`;
  const stepsDart = hasStages
    ? `        DsWorkflow(steps: const ${stageList}, current: 0),\n`
    : '';
  const mapEntries = mapVals.join(', ');                                                  // שדות ⇒ מפה (מחושב=נוסחה)
  const editLoad = labelConst.map((cl, i) => `${i}: r[${cl}] ?? ''`).join(', ');         // רשומה ⇒ טופס (עריכה)
  const recValues = recValsR.join(', ');
  const labelsList = labelConst.join(', ');
  // קשר-הפוך: שבב פר-ישות-מצביעה עם מונה-חי (appStore.referencing).
  const backChips = backRefs.map((b) => `_backChip(${k(b.fname)}, appStore.referencing('${b.fslug}', ${k(b.ffield)}, rid).length)`).join(', ');
  const backFooter = backRefs.length ? `, footer: Wrap(spacing: 6, runSpacing: 6, children: [${backChips}])` : '';
  const stageArgs = hasStages
    ? `stage: (const ${stageList})[appStore.stageOf(${SK}, rid)], stageDone: appStore.stageOf(${SK}, rid) >= ${stages.length - 1}, stages: const ${stageList}, stageIndex: appStore.stageOf(${SK}, rid), onStage: (i) => appStore.setStage(${SK}, rid, i), onAdvance: () => appStore.advance(${SK}, rid, ${stages.length}), `
    : '';

  const relImport = hasRel ? "import '../dart-ui-bs/ds/ds_select.dart';\n" : '';
  const cls = pascal(slug);
  const code = `// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_search.dart';
${usedField ? "import '../dart-ui-bs/ds/ds_field.dart';\n" : ''}${[...typedImports].sort().map((x) => x + '\n').join('')}${enumImport}${relImport}import '../dart-ui-bs/ds/ds_store.dart';
${[...funcImports].sort().join('\n')}
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});

  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת
  String _q = '';    // מחרוזת-חיפוש (סינון-רשומות חי)
${requiredIdx.length ? '  String? _err;      // שגיאת-ולידציה (שדות-חובה חסרים)\n' : ''}

  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
${requiredIdx.length ? `    final miss = <String>[];
      ${reqChecks}
    if (miss.isNotEmpty) { setState(() => _err = 'יש למלא: ' + miss.join(', ')); return; }
` : ''}    final map = <String, String>{${mapEntries}};
    if (_editId != null) {
      appStore.update(${SK}, _editId!, map);
    } else {
      appStore.add(${SK}, <String, String>{...map${hasStages ? `, '__stage': '0'` : ''}});
    }
    setState(() { _v.clear(); _editId = null;${requiredIdx.length ? ' _err = null;' : ''} });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {${editLoad}};
    });
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [${labelsList}], values: [${recValues}], ${stageArgs}onEdit: () => _edit(r), onDelete: () => appStore.removeById(${SK}, rid)${backFooter});
  }
${backRefs.length ? `
  Widget _backChip(String label, int n) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
        decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(20)),
        child: Text('\$label · \$n', style: const TextStyle(color: DsTokens.muted, fontSize: 11.5, fontWeight: FontWeight.w700)),
      );
` : ''}

  String _csv() {
    final b = StringBuffer();
    b.writeln(const [${labelsList}].map((h) => '"' + h.replaceAll('"', '""') + '"').join(','));
    for (final r in appStore.records(${SK})) {
      b.writeln([${recValues}].map((v) => '"' + v.replaceAll('"', '""') + '"').join(','));
    }
    return b.toString();
  }

  Widget _csvBtn(BuildContext context) => Material(
        color: const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(9),
        child: InkWell(
          borderRadius: BorderRadius.circular(9),
          onTap: () {
            Clipboard.setData(ClipboardData(text: _csv()));
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('הועתק כ-CSV'), duration: Duration(seconds: 2)));
          },
          child: const Padding(
            padding: EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            child: Row(mainAxisSize: MainAxisSize.min, children: [
              Icon(Icons.copy_all_outlined, size: 15, color: DsTokens.muted),
              SizedBox(width: 5),
              Text('CSV', style: TextStyle(color: DsTokens.muted, fontSize: 12, fontWeight: FontWeight.w700)),
            ]),
          ),
        ),
      );

${hasCalc ? `  Widget _calc(String label, num v) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Container(
          padding: const EdgeInsets.all(13),
          decoration: BoxDecoration(color: DsTokens.successSoft, borderRadius: BorderRadius.circular(DsTokens.rSm)),
          child: Row(children: [
            const Icon(Icons.calculate_outlined, size: 16, color: DsTokens.success),
            const SizedBox(width: 8),
            Expanded(child: Text(label, style: const TextStyle(color: DsTokens.ink, fontSize: 13.5, fontWeight: FontWeight.w700))),
            Text(v.toStringAsFixed(2), style: const TextStyle(color: DsTokens.success, fontSize: 15.5, fontWeight: FontWeight.w800)),
          ]),
        ),
      );

` : ''}${hasLive ? `  Widget _live(String label, String out) => Padding(
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
      bottomBar: DsPrimaryButton(label: _editId == null ? ${cSave} : ${cUpdate}, onTap: _save),
      children: [
${stepsDart}${requiredIdx.length ? `        if (_err != null) Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: const Color(0x14DC2626), borderRadius: BorderRadius.circular(DsTokens.rSm), border: Border.all(color: const Color(0x40DC2626))),
          child: Row(children: [const Icon(Icons.error_outline, size: 16, color: Color(0xFFDC2626)), const SizedBox(width: 8), Expanded(child: Text(_err!, style: const TextStyle(color: Color(0xFFDC2626), fontSize: 13, fontWeight: FontWeight.w600)))]),
        ),
` : ''}        DsSection(title: ${cForm}, children: [
${fieldBlocks.join('\n')}
        ]),
        DsSection(title: ${cRecords}, trailing: _csvBtn(context), children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final all = appStore.records(${SK});
              if (all.isEmpty) return const DsEmpty(label: ${cEmpty});
              final q = _q.trim().toLowerCase();
              final rs = q.isEmpty ? all : all.where((r) => r.entries.any((e) => !e.key.startsWith('__') && e.value.toLowerCase().contains(q))).toList();
              return Column(children: [
                DsSearch(value: _q, onChanged: (v) => setState(() => _q = v)),
                if (rs.isEmpty) const DsEmpty(label: ${cNoMatch}),
                for (var i = 0; i < rs.length; i++)
                  _card(rs[i]),
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

// ── דשבורד: רשת אריחי-KPI מנתוני-הישויות. metrics = המילים אחרי 'עם' באפיון ⇒ מציג
//    בדיוק את המדדים שביקשת (מותאמים-קידומת לישויות-אמת), לא את כל-הישויות. נופל-לכל אם אין. ──
export function renderDashboard(slug, { title, icon = '📊', entities, metrics = [], aggs = [] }) {
  const { k, dump } = makeConsts(slug);
  const cTitle = k(title);
  let shown = entities;
  if (metrics.length) {
    const mw = metrics.flatMap(heWords);
    const picked = entities.filter((e) => heWords(e.name).some((n) => mw.some((m) => prefixMatch(m, n))));
    shown = picked.length ? picked : (aggs.length ? [] : entities);
  } else if (aggs.length) {
    shown = [];   // רק אגרגטים בוקשו ⇒ בלי אריחי-מונה של כל-הישויות
  }
  const cIcon = k(icon);
  const imports = new Set();
  // drill-down: הקשה על אריח ⇒ מסך-הישות שלו (Navigator). מחייב ייבוא-המסך.
  const nav = (tslug) => {
    if (!tslug) return '';
    imports.add(`import 'gen_${tslug}.dart';`);
    return `, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const ${pascal(tslug)}()))`;
  };
  // אריחי-אגרגט (שורש-4): סכום/ממוצע על שדה-מספרי · מונה על ישות — ערך-אמת, לא ספירה עיוורת.
  const tiles = [];
  const barLabels = [];   // תוויות לתרשים-העמודות
  const barVals = [];     // ביטויי-double חיים לתרשים
  for (const a of aggs.filter((a) => a.slug && (a.kind === 'מונה' || a.field))) {
    const lbl = k(a.field || a.entityName);
    const sub = k(`${a.kind} · ${a.entityName}`);
    const g = k(a.kind === 'ממוצע' ? '📈' : a.kind === 'סכום' ? '🧮' : '🔢');
    const cf = a.field ? k(a.field) : null;
    const num = a.kind === 'סכום' ? `appStore.sum('${a.slug}', ${cf})`
      : a.kind === 'ממוצע' ? `appStore.avg('${a.slug}', ${cf})`
      : `appStore.count('${a.slug}').toDouble()`;
    const disp = a.kind === 'ממוצע' ? `${num}.toStringAsFixed(1)` : `${num}.toStringAsFixed(0)`;
    tiles.push(`AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: ${lbl}, value: ${disp}, sub: ${sub}, glyph: ${g}${nav(a.slug)}))`);
    barLabels.push(lbl); barVals.push(num);
  }
  for (const e of shown) {
    const lbl = k(e.name);
    const sub = k(`${e.fields} שדות${e.stages ? ` · ${e.stages} שלבים` : ''}`);
    const g = k(e.icon || '🗂️');
    tiles.push(`AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: ${lbl}, value: appStore.count('${e.slug || ''}').toString(), sub: ${sub}, glyph: ${g}${nav(e.slug)}))`);
    barLabels.push(lbl); barVals.push(`appStore.count('${e.slug || ''}').toDouble()`);
  }
  const cSub = k(`${tiles.length} מדדים · סקירת-על`);
  const cChart = k('השוואה חיה');
  const barsBlock = barVals.length >= 2
    ? `      AnimatedBuilder(animation: appStore, builder: (context, _) => DsBars(title: ${cChart}, labels: const [${barLabels.join(', ')}], values: [${barVals.join(', ')}])),\n`
    : '';
  const rows = [];
  for (let i = 0; i < tiles.length; i += 2) {
    const a = tiles[i], b = tiles[i + 1];
    const second = b ? `Expanded(child: ${b})` : 'const Expanded(child: SizedBox())';
    rows.push(`      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: ${a}), const SizedBox(width: 12), ${second}]))),`);
  }
  const cls = pascal(slug);
  const code = `// ✨ חולל ע"י מנוע-הרינדור (render-ds) — דשבורד מנתוני-הישויות החיים (drill-down). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
${barsBlock ? "import '../dart-ui-bs/ds/ds_bars.dart';\n" : ''}${[...imports].sort().join('\n')}
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
${barsBlock}      ],
    );
  }
}
`;
  write(slug, code, dump());
  return { slug, cls };
}

// ── לוח-ניווט + שער-הרשאות: בורר-תפקיד מסנן את המסכים-הגלויים (אכיפה חיה) ──
//    roles = [{name, all, ents}] מהאפיון. גלוּת פר-תפקיד מחושבת-מראש (התאמת-קידומת
//    שם-הישות ↔ הרשאות-התפקיד; 'הכל'⇒כל · 'דוחות'⇒דשבורדים · מערכת רק ל-'הכל'). טהור-מבני.
export function renderHub(slug, { title, icon = '🏗️', screens, roles = [] }) {
  const { k, dump } = makeConsts(slug);
  const cTitle = k(title);
  const cIcon = k(icon);
  const imports = new Set();
  const tiles = screens.map((s) => {
    const g = k(s.icon || '🗂️');
    const t = k(s.name);
    const sub = k(s.sub || '');
    imports.add(`import 'gen_${s.slug}.dart';`);
    return `        DsNavTile(glyph: ${g}, title: ${t}, sub: ${sub}, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const ${s.cls}()))),`;
  });

  const effRoles = roles.length ? roles : [{ name: 'הכל', all: true, ents: [] }];
  const roleVis = effRoles.map((role) => {
    if (role.all) return screens.map((_, i) => i);
    const out = [];
    screens.forEach((s, i) => {
      if (s.kind === 'system') return;                                   // מסכי-מערכת רק למנהל-על
      if (s.kind === 'dashboard') { if (role.ents.some((e) => /דוח/.test(e))) out.push(i); return; }
      const nw = heWords(s.name);
      if (role.ents.some((e) => { const ew = heWords(e); return ew.length && ew.every((w) => nw.some((x) => prefixMatch(x, w))); })) out.push(i);
    });
    return out;
  });
  const showChips = effRoles.length >= 2;
  const visList = `[${roleVis.map((v) => `[${v.join(', ')}]`).join(', ')}]`;
  const roleChips = effRoles.map((r, i) => `_roleChip(${i}, ${k(r.name || 'הכל')})`).join(', ');

  const cls = pascal(slug);
  const code = `// ✨ חולל ע"י מנוע-הרינדור (render-ds) — לוח-ניווט + שער-הרשאות (בורר-תפקיד חי · נשמר). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
${[...imports].sort().join('\n')}
import 'package:flutter/material.dart';

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});

  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  static const List<List<int>> _vis = ${visList};

  List<Widget> _tiles(BuildContext context) => [
${tiles.join('\n')}
  ];
${showChips ? `
  Widget _roleChip(int i, String label) {
    final sel = appStore.role == i;
    return Padding(
      padding: const EdgeInsets.only(left: 8, bottom: 8),
      child: Material(
        color: sel ? DsTokens.accent : const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(20),
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: () => setState(() => appStore.setRole(i)),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            child: Text(label, style: TextStyle(color: sel ? Colors.white : DsTokens.muted, fontSize: 13, fontWeight: FontWeight.w700)),
          ),
        ),
      ),
    );
  }
` : ''}
  @override
  Widget build(BuildContext context) {
    final all = _tiles(context);
    final vis = _vis[appStore.role.clamp(0, _vis.length - 1)];
    return DsScaffold(
      title: ${cTitle},
      subtitle: '\${vis.length} מסכים גלויים',
      icon: ${cIcon},
      children: [
${showChips ? `        Container(
          margin: const EdgeInsets.only(bottom: 4),
          child: Wrap(children: [${roleChips}]),
        ),
` : ''}        for (final i in vis) all[i],
      ],
    );
  }
}
`;
  write(slug, code, dump());
  return { slug, cls };
}

// ── שורש-האפליקציה: main() + MaterialApp + ערכת-נושא + RTL ⇒ אפליקציה עצמאית שלמה ──
//    (טהור: דטרמיניסטי, אפס-סודות, אפס-דאטה. פותח את לוח-הניווט; ה-DS נותן את המראה.)
export function renderMain(slug, { title, hubSlug, hubCls }) {
  const { k, dump } = makeConsts(slug);
  const cTitle = k(title);
  const cls = pascal(slug);
  const code = `// ✨ חולל ע"י מנוע-הרינדור (render-ds) — שורש-האפליקציה (main + MaterialApp + theme + RTL). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import 'gen_${hubSlug}.dart';
import 'package:flutter/material.dart';

void main() => runApp(const ${cls}());

class ${cls} extends StatelessWidget {
  const ${cls}({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp(
        title: ${cTitle},
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          fontFamily: 'Heebo',
          scaffoldBackgroundColor: DsTokens.bg,
          colorScheme: ColorScheme.fromSeed(seedColor: DsTokens.accent),
        ),
        builder: (context, child) => Directionality(
          textDirection: TextDirection.rtl,
          child: child ?? const SizedBox.shrink(),
        ),
        home: const ${hubCls}(),
      );
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
