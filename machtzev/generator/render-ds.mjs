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

// 🔗🔗 קשר-רבים: שדה שהוא צורת-רבים של שם-ישות (‏תלמידים←תלמיד · מקצועות←מקצוע ·
// כיתות←כיתה) ⇒ בחירה-מרובה. מטפל בסופיות (ך→כ) ובסיומת ה→ות. טהור-מבני, נגזר מהאפיון.
const definal = (w) => w.replace(/ך$/, 'כ').replace(/ם$/, 'מ').replace(/ן$/, 'נ').replace(/ף$/, 'פ').replace(/ץ$/, 'צ');
function pluralForms(en) {
  const b = definal(en.replace(/ה$/, ''));
  const b2 = definal(en);
  return new Set([`${b}ים`, `${b}ות`, `${b2}ים`, `${b2}ות`]);
}
function pickMultiRelation(label, selfName, entityNames) {
  const fw = new Set(heWords(label));
  for (const en of entityNames) {
    if (en === selfName) continue;
    if (heWords(en).length !== 1) continue;          // ריבוי רק לישויות חד-מיליות
    const forms = pluralForms(en);
    for (const w of fw) if (forms.has(w)) return en;
  }
  return null;
}

// 📊 שדה-צבירה (Rollup): 'סכום(ישות.שדה)' — אותו דקדוק-אגרגט של הדשבורדים, אך מכוון
// לרשומה-הנוכחית דרך קשר-הבן הידוע. מובחן מנוסחת-אחות ('סכום - הנחה') לפי מילת-מפתח + '('.
const ROLLUP_RE = /^(סכום|ממוצע|מונה)\(([^.)]+)(?:\.([^)]+))?\)$/;

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

// ⚖️ מהדר-חוק-בין-שדות: 'תאריך יעד >= תאריך חיוב' ⇒ {li,op,ri}. השוואה מספרית אם שניהם
// מספר, אחרת לקסיקלית (ISO-תאריך מסתדר לקסיקלית). מילה-לא-מזוהה ⇒ null (מדולג בשקט).
function compileRule(rule, labels) {
  const m = rule.match(/^(.+?)\s*(>=|<=|>|<)\s*(.+)$/);
  if (!m) return null;
  const find = (name) => { const c = labels.find((l) => l.label === name.trim()); return c ? c.idx : -1; };
  const li = find(m[1]), ri = find(m[3]);
  if (li < 0 || ri < 0 || li === ri) return null;
  return { li, ri, op: m[2], text: rule.trim() };
}

// ⛔ מהדר-שער: תנאי-כניסה-לשלב מעל ההשוואה של compileRule + שתי הרחבות: אגף-ימני
// מספר-ליטרלי ('סכום > 0'), ותווית-בודדת = "חייב-מלא" ('תיאור'). מילה-לא-מזוהה ⇒ null.
function compileGuard(cond, labels) {
  const find = (name) => { const c = labels.find((l) => l.label === name.trim()); return c ? c.idx : -1; };
  const m = cond.match(/^(.+?)\s*(>=|<=|>|<)\s*(.+)$/);
  if (m) {
    const li = find(m[1]); if (li < 0) return null;
    const rlit = m[3].trim();
    if (/^-?\d+(\.\d+)?$/.test(rlit)) return { kind: 'num', li, op: m[2], num: rlit };
    const ri = find(rlit); if (ri < 0 || ri === li) return null;
    return { kind: 'ff', li, op: m[2], ri };
  }
  const bi = find(cond); if (bi < 0) return null;   // תווית-בודדת ⇒ חייב-מלא
  return { kind: 'filled', li: bi };
}

// ── ישות: מסך-חי מחווט — טופס→שמירה→חנות→טבלה→דשבורד, + קשרים(מזהה) + מסע + עריכה/מחיקה ──
export function renderEntity(slug, { name, icon = '🗂️', schema, stages = [], entityNames = [], nameToSlug = {}, backRefs = [], vrules = [], delGuard, guards = [], authz = null }) {
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
  const fieldBlocks = [];   // {i, expr, cond?} — expr בלי הזחה/פסיק (לעיטוף-גישה בטוח פר-תפקיד)
  // 🔩 עוזר-הוספה: שומר את ביטוי-הווידג'ט + אינדקס-השדה (+ תנאי-קיום ל-_live) ⇒ ניתן
  // לעטוף בהסתרה/נעילה פר-תפקיד. פלט-רגיל = ביט-זהה (אותה שורה שנפלטה קודם).
  const addField = (i, expr, cond = null) => fieldBlocks.push({ i, expr, cond });
  const recValsR = [];   // ערך-תצוגה בטבלה פר-שדה
  const mapVals = [];    // ערך-שמירה פר-שדה (מחושב ⇒ תוצאת-הנוסחה; אחר ⇒ _v[i])
  const requiredIdx = [];
  const uniqueIdx = [];
  const defEntries = [];   // ברירות-מחדל: {idx: 'ערך'} לזריעת-טופס-חדש
  let subCounter = schema.length;   // מקצה מקומות-_v לתת-שדות-מקוננים (מעל אינדקסי-הסכמה)
  const subEditLoad = [];  // טעינת תת-תאים לעריכה: `si: r['הורה/בן']`
  const rangeSpecs = [];   // ולידציית-טווח: {i, min, max}
  const patternSpecs = []; // ולידציית-תבנית: {i, pattern}
  let hasLive = false, hasRel = false, hasEnum = false, hasCalc = false, hasMulti = false, usedField = false;
  let firstDateConst = null;   // תפר-לוח-שנה: הקבוע של שדה-התאריך הראשון (null ⇒ אין תאריך)
  const labelIdx = schema.map((s, i) => ({ label: s.label, idx: i }));
  schema.forEach((s, i) => {
    const cl = k(s.label); labelConst.push(cl);
    const bind = `value: _v[${i}] ?? '', onChanged: (v) => setState(() => _v[${i}] = v)`;
    if (s.required) requiredIdx.push(i);
    if (s.unique) uniqueIdx.push(i);
    // ולידציית-שדה (טווח/תבנית) — רק על שדות-קלט חופשיים (לא נוסחה/מקונן/enum).
    const plain = !s.formula && !s.members && !(s.enumVals && s.enumVals.length);
    if (plain && s.range) rangeSpecs.push({ i, min: s.range.min, max: s.range.max });
    if (plain && s.pattern) patternSpecs.push({ i, pattern: s.pattern });
    // ברירת-מחדל ('שדה[ערך]'): ערך-פתיחה לרשומה-חדשה. לא על שדה-מחושב (נגזר ממילא).
    if (s.def != null && !s.formula) defEntries.push(`${i}: ${k(s.def)}`);
    // (0) שדה-מחושב (שורש-4): נוסחה מעל שדות-אחות ⇒ ערך-נגזר קריאה-בלבד (לא קלט).
    if (s.formula) {
      // (0-rollup) שדה-צבירה: 'סכום(הוצאה.סכום)' ⇒ אגרגט חי על רשומות-הבן המצביעות על
      // הרשומה-הזו. הקשר מתגלה מ-backRefs (שמות-האפיון) — טהור. אין קלט, לא-מתמיד.
      const rm = s.formula.match(ROLLUP_RE);
      if (rm) {
        const link = backRefs.find((b) => b.fname === rm[2].trim());
        if (link) {
          const col = k((rm[3] || '').trim() || s.label);
          const pid = `r['__id'] ?? ''`;
          const v = rm[1] === 'מונה'
            ? `appStore.countRef('${link.fslug}', ${k(link.ffield)}, ${pid}).toString()`
            : rm[1] === 'ממוצע'
            ? `appStore.avgRef('${link.fslug}', ${k(link.ffield)}, ${pid}, ${col}).toStringAsFixed(1)`
            : `appStore.sumRef('${link.fslug}', ${k(link.ffield)}, ${pid}, ${col}).toStringAsFixed(2)`;
          recValsR.push(v);   // ערך-כרטיס יחיד ⇒ נשמר labelConst[i]↔recValsR[i]; אין fieldBlocks/mapVals (נגזר)
          return;
        }
        // קשר-בן לא-נמצא ⇒ נפילה ל-compileFormula (התנהגות היום)
      }
      const expr = compileFormula(s.formula, labelIdx);
      if (expr) {
        hasCalc = true;
        addField(i, `_calc(${cl}, ${expr})`);
        recValsR.push(`r[${cl}] ?? ''`); mapVals.push(`${cl}: (${expr}).toStringAsFixed(2)`);
        return;
      }
    }
    // (0b) אובייקט-מקונן (Value Object): תת-טופס DsSection עם קלט פר-תת-שדה. אחסון שטוח
    // במפתח מורכב 'הורה/בן' (store נשאר טהור); בכרטיס/CSV מוצג כעמודה-אחת מחוברת (' · ')
    // ⇒ נשמר האינווריאנט labelConst[i] ↔ recValsR[i] (1:1), אפס refactor של תוויות-הכרטיס.
    if (s.members && s.members.length) {
      usedField = true;
      const subs = s.members.map((m) => {
        const si = subCounter++;
        const mk = k(`${s.label} · ${m}`);   // תווית-תצוגה לתת-שדה
        const sk = k(`${s.label}/${m}`);     // מפתח-אחסון "הורה/בן"
        subEditLoad.push(`${si}: r[${sk}] ?? ''`);
        mapVals.push(`${sk}: _v[${si}] ?? ''`);
        return { si, mk, sk };
      });
      const subLines = subs.map((x) => `            DsField(label: ${x.mk}, hint: '', value: _v[${x.si}] ?? '', onChanged: (v) => setState(() => _v[${x.si}] = v)),`).join('\n');
      addField(i, `DsSection(title: ${cl}, children: [\n${subLines}\n          ])`);
      recValsR.push(`[${subs.map((x) => `r[${x.sk}] ?? ''`).join(', ')}].where((x) => x.trim().isNotEmpty).join(' · ')`);
      return;
    }
    // (1) ערכים-מותרים (enum, שורש-6): בורר על קבוצה-סגורה מהאפיון (לא טקסט-חופשי).
    if (s.enumVals && s.enumVals.length) {
      hasEnum = true;
      const opts = s.enumVals.map((v) => k(v)).join(', ');
      addField(i, `DsEnumField(label: ${cl}, options: const [${opts}], ${bind})`);
      recValsR.push(`r[${cl}] ?? ''`); mapVals.push(`${cl}: _v[${i}] ?? ''`);
      return;
    }
    // (2) שדה-קשר: השדה נוקב בישות-אחרת ⇒ בורר-רשומה ששומר מזהה-יעד יציב.
    const rel = pickRelation(s.label, name, entityNames);
    const tslug = rel ? (nameToSlug[rel] || null) : null;
    if (tslug) {
      hasRel = true;
      addField(i, `DsSelect(label: ${cl}, entity: '${tslug}', ${bind})`);
      recValsR.push(`appStore.displayOf('${tslug}', r[${cl}] ?? '')`); mapVals.push(`${cl}: _v[${i}] ?? ''`);
      return;
    }
    // (2b) קשר-רבים: שדה בצורת-רבים של ישות ⇒ בחירה-מרובה ששומרת רשימת-מזהים.
    const mrel = pickMultiRelation(s.label, name, entityNames);
    const mslug = mrel ? (nameToSlug[mrel] || null) : null;
    if (mslug) {
      hasMulti = true;
      addField(i, `DsMultiSelect(label: ${cl}, entity: '${mslug}', ${bind})`);
      recValsR.push(`appStore.displayList('${mslug}', r[${cl}] ?? '')`); mapVals.push(`${cl}: _v[${i}] ?? ''`);
      return;
    }
    // (3) טיפוס נאחז-מהאטומים ⇒ הווידג'ט האמיתי: תאריך→בורר · מספר→מקלדת · דו-ערכי→מתג.
    const ft = typeOf(s.label);
    if (ft === 'date') { typedImports.add("import '../dart-ui-bs/ds/ds_date_field.dart';"); if (firstDateConst === null) firstDateConst = cl; addField(i, `DsDateField(label: ${cl}, ${bind})`); recValsR.push(`r[${cl}] ?? ''`); mapVals.push(`${cl}: _v[${i}] ?? ''`); return; }
    if (ft === 'num')  { typedImports.add("import '../dart-ui-bs/ds/ds_number_field.dart';"); addField(i, `DsNumberField(label: ${cl}, ${bind})`); recValsR.push(`r[${cl}] ?? ''`); mapVals.push(`${cl}: _v[${i}] ?? ''`); return; }
    if (ft === 'bool') { typedImports.add("import '../dart-ui-bs/ds/ds_toggle_tile.dart';"); addField(i, `DsToggleTile(label: ${cl}, ${bind})`); recValsR.push(`r[${cl}] ?? ''`); mapVals.push(`${cl}: _v[${i}] ?? ''`); return; }
    // (4) טקסט: שדה חופשי + לוגיקת-אימפריה חיה מכוונת-מטרה (טיפוס+IDF+קידומת+מובהקות).
    usedField = true;
    addField(i, `DsField(label: ${cl}, hint: '', ${bind})`);
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
      addField(i, `_live(${cx}, ${xf.name}(${arg}))`, `(_v[${i}] ?? '').trim().isNotEmpty`);
      hasLive = true;
    }
  });
  const reqChecks = requiredIdx.map((i) => `if ((_v[${i}] ?? '').trim().isEmpty) miss.add('חסר ' + ${labelConst[i]});`).join('\n      ');
  const uniqChecks = uniqueIdx.map((i) => `{ final v = (_v[${i}] ?? '').trim(); if (v.isNotEmpty && appStore.records(${SK}).any((r) => r['__id'] != _editId && (r[${labelConst[i]}] ?? '') == v)) miss.add('כפול ' + ${labelConst[i]}); }`).join('\n      ');
  // ⚖️ חוקי-בין-שדות מהאפיון ('| חוקים: תאריך יעד >= תאריך חיוב') ⇒ בדיקת-הצלבה בשמירה.
  // שני-הצדדים ריקים ⇒ מדולג (החוק חל רק על ערכים-מוזנים); מספר-מול-מספר=מספרי, אחרת לקסיקלי.
  const ruleSpecs = vrules.map((v) => compileRule(v, labelIdx)).filter(Boolean);
  const ruleChecks = ruleSpecs.map((rc) => `{ final l = (_v[${rc.li}] ?? '').trim(); final rr = (_v[${rc.ri}] ?? '').trim(); if (l.isNotEmpty && rr.isNotEmpty) { final nl = num.tryParse(l); final nr = num.tryParse(rr); final ok = (nl != null && nr != null) ? (nl ${rc.op} nr) : (l.compareTo(rr) ${rc.op} 0); if (!ok) miss.add(${k(rc.text)}); } }`).join('\n      ');
  // 🔢 ולידציית-טווח: ערך-מספרי בין min ל-max (גבול-חסר ⇒ מדולג). לא-מספר ⇒ נכשל. ריק ⇒ מדולג.
  const rangeChecks = rangeSpecs.map((r) => {
    const parts = [];
    if (r.min !== null) parts.push(`n < ${r.min}`);
    if (r.max !== null) parts.push(`n > ${r.max}`);
    const bound = r.min !== null && r.max !== null ? ` (${r.min}–${r.max})` : r.min !== null ? ` (≥${r.min})` : ` (≤${r.max})`;
    return `{ final v = (_v[${r.i}] ?? '').trim(); if (v.isNotEmpty) { final n = num.tryParse(v); if (n == null || ${parts.join(' || ')}) miss.add(${k(`טווח ${schema[r.i].label}${bound}`)}); } }`;
  }).join('\n      ');
  // 🔤 ולידציית-תבנית: regex גולמי מהאפיון ⇒ RegExp בזמן-קומפילציה (דרך k() לבריחה נכונה).
  // אימות בזמן-חילול: regex פסול ⇒ מדולג בשקט (כנות > קוד-שבור בזמן-ריצה). ריק ⇒ מדולג.
  const validPatterns = patternSpecs.filter((p) => { try { new RegExp(p.pattern); return true; } catch { return false; } });
  // מחרוזת-Dart בטוחה ל-regex: בורח \ · ' · $ (אינטרפולציה!) · שורה-חדשה. הרגקס אינליין
  // (ערך-קונפיג צמוד-קוד), לא דרך k()/dump שאינם בורחים '$' ⇒ היו שוברים עוגן-סוף '$'.
  const dartStr = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + "'";
  const patternChecks = validPatterns.map((p) => `{ final v = (_v[${p.i}] ?? '').trim(); if (v.isNotEmpty && !RegExp(${dartStr(p.pattern)}).hasMatch(v)) miss.add(${k(`תבנית שגויה: ${schema[p.i].label}`)}); }`).join('\n      ');
  const hasVal = requiredIdx.length + uniqueIdx.length + ruleSpecs.length + rangeSpecs.length + validPatterns.length > 0;
  const defInit = defEntries.length ? `{${defEntries.join(', ')}}` : '{}';   // זריעת-פתיחה (ריק ⇒ ביט-זהה לקודם)
  const enumImport = hasEnum ? "import '../dart-ui-bs/ds/ds_enum_field.dart';\n" : '';
  const hasStages = stages.length >= 2;
  const stageConsts = hasStages ? stages.map((x) => k(x)) : [];
  const stageList = `[${stageConsts.join(', ')}]`;
  const stepsDart = hasStages
    ? `        DsWorkflow(steps: const ${stageList}, current: 0),\n`
    : '';
  const mapEntries = mapVals.join(', ');                                                  // שדות ⇒ מפה (מחושב=נוסחה)
  const editLoad = [...labelConst.map((cl, i) => `${i}: r[${cl}] ?? ''`), ...subEditLoad].join(', ');   // רשומה ⇒ טופס (עריכה) + תת-תאים מקוננים
  const recValues = recValsR.join(', ');
  const labelsList = labelConst.join(', ');
  // קשר-הפוך: שבב פר-ישות-מצביעה עם מונה-חי (appStore.referencing).
  const backChips = backRefs.map((b) => `_backChip(${k(b.fname)}, appStore.referencing('${b.fslug}', ${k(b.ffield)}, rid).length)`).join(', ');
  const backFooter = backRefs.length ? `, footer: Wrap(spacing: 6, runSpacing: 6, children: [${backChips}])` : '';
  // 🗑 שער-מחיקה בכרטיס-ההורה (opt-in · רק אם הוכרז '| מחיקה:'): חסימה ⇒ blockedReason
  // (טוסט) · מפל ⇒ confirmMessage (דיאלוג-אישור). ניתוק/ברירת-מחדל ⇒ שקט (כמקודם).
  const refCount = `appStore.inboundRefs(${SK}, rid)`;
  const delArgs = delGuard === 0
    ? `, blockedReason: ${refCount} > 0 ? (${k('לא ניתן למחוק — ')} + ${refCount}.toString() + ${k(' רשומות מקושרות')}) : null`
    : delGuard === 1
    ? `, confirmMessage: ${refCount} > 0 ? (${k('מחיקה תמחק גם ')} + ${refCount}.toString() + ${k(' רשומות מקושרות. להמשיך?')}) : null`
    : '';
  // ⛔ שערי-מעבר (רק עם workflow): תנאי-כניסה פר-שלב-יעד, מהודרים מול הרשומה-השמורה r.
  // חוסמים רק קדימה (i > הנוכחי); נסיגה חופשית. חסימה ⇒ טוסט. ריק ⇒ stageArgs ביט-זהה.
  const guardSpecs = hasStages ? guards.map((g) => { const t = stages.indexOf(g.stage); const c = compileGuard(g.cond, labelIdx); return (t >= 0 && c) ? { t, c, reason: k(`${g.stage} · ${g.cond}`) } : null; }).filter(Boolean) : [];
  const hasGuards = guardSpecs.length > 0;
  const gExpr = (c) => c.kind === 'filled'
    ? `(r[${labelConst[c.li]}] ?? '').trim().isEmpty`
    : c.kind === 'num'
    ? `!((num.tryParse((r[${labelConst[c.li]}] ?? '').trim()) ?? double.nan) ${c.op} ${c.num})`
    : `!(() { final l = (r[${labelConst[c.li]}] ?? '').trim(); final rr = (r[${labelConst[c.ri]}] ?? '').trim(); final nl = num.tryParse(l); final nr = num.tryParse(rr); return (nl != null && nr != null) ? (nl ${c.op} nr) : (l.compareTo(rr) ${c.op} 0); }())`;
  const guardMethod = hasGuards
    ? `\n  String? _guard(int t, Map<String, String> r) {\n    switch (t) {\n${guardSpecs.map((g) => `      case ${g.t}: if (${gExpr(g.c)}) return ${g.reason}; return null;`).join('\n')}\n      default: return null;\n    }\n  }\n`
    : '';
  const onStageBody = hasGuards
    ? `(i) { if (i > appStore.stageOf(${SK}, rid)) { final g = _guard(i, r); if (g != null) { ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('חסום: ' + g))); return; } } appStore.setStage(${SK}, rid, i); }`
    : `(i) => appStore.setStage(${SK}, rid, i)`;
  const onAdvBody = hasGuards
    ? `() { final g = _guard(appStore.stageOf(${SK}, rid) + 1, r); if (g != null) { ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('חסום: ' + g))); return; } appStore.advance(${SK}, rid, ${stages.length}); }`
    : `() => appStore.advance(${SK}, rid, ${stages.length})`;
  const stageArgs = hasStages
    ? `stage: (const ${stageList})[appStore.stageOf(${SK}, rid)], stageDone: appStore.stageOf(${SK}, rid) >= ${stages.length - 1}, stages: const ${stageList}, stageIndex: appStore.stageOf(${SK}, rid), onStage: ${onStageBody}, onAdvance: ${onAdvBody}, `
    : '';

  // 🔒 RLS (read-side · סינון-תצוגה, לא אכיפה): היקף-שורה (scoped) + הסתרת-עמודות פר-תפקיד.
  // הכל מגודר — בלי scope/hide ⇒ אפס-פליטה ⇒ ביט-זהה. ייחודיות נשארת על כל-הרשומות.
  const nRoles = authz ? authz.scope.length : 0;
  const hasScope = !!(authz && authz.scope.some((f) => f));
  const hasHide = !!(authz && authz.hidden.some((h) => h.length));
  const hasRO = !!(authz && authz.readonly && authz.readonly.some((h) => h.length));
  const rlsActive = hasScope || hasHide;   // read-side (כרטיס/CSV/רשימה) — ללא זה ⇒ ביט-זהה
  const rlsWrite = hasHide || hasRO;       // write-side (טופס role-reactive: הסתרה/נעילת-קלט)
  const rlsTables = rlsActive || hasRO;    // האם לפלוט טבלאות-הרשאה + getters
  // כל טבלה נפלטת רק אם היא בשימוש (מונע unused_field שמפיל את שער-ה-analyze):
  // _rlsScope רק עם היקף · _rlsRO רק עם נעילה · _rlsHiddenSet רק בצד-הקריאה (כרטיס).
  const scopeTable = hasScope ? `\n  static const List<String> _rlsScope = [${authz.scope.map((f) => f ? k(f) : "''").join(', ')}];` : '';
  const hiddenTable = `\n  static const List<List<int>> _rlsHidden = [${(authz && authz.hidden || []).map((h) => `[${h.join(', ')}]`).join(', ')}];`;
  const roTable = hasRO ? `\n  static const List<List<int>> _rlsRO = [${authz.readonly.map((h) => `[${h.join(', ')}]`).join(', ')}];` : '';
  const hiddenSetGetter = rlsActive ? `\n  Set<int> get _rlsHiddenSet => _rlsHidden[_rlsRole].toSet();` : '';
  const rlsFields = rlsTables
    ? `${scopeTable}${hiddenTable}${roTable}\n  int get _rlsRole => appStore.role.clamp(0, ${Math.max(0, nRoles - 1)});${hiddenSetGetter}\n`
    : '';
  // טופס: פלט-רגיל (ביט-זהה) או פלט-מגודר-תפקיד (הסתרה=collection-if · נעילה=AbsorbPointer).
  const fieldsPlain = fieldBlocks.map((fb) => fb.cond ? `          if (${fb.cond}) ${fb.expr},` : `          ${fb.expr},`).join('\n');
  const fieldsGated = fieldBlocks.map((fb) => {
    const hideG = `!_rlsHidden[_rlsRole].contains(${fb.i})`;
    const inner = hasRO ? `AbsorbPointer(absorbing: _rlsRO[_rlsRole].contains(${fb.i}), child: ${fb.expr})` : fb.expr;
    const cond = fb.cond ? `${hideG} && (${fb.cond})` : hideG;
    return `          if (${cond}) ${inner},`;
  }).join('\n');
  const formSection = rlsWrite
    ? `AnimatedBuilder(animation: appStore, builder: (context, _) => DsSection(title: ${cForm}, children: [\n${fieldsGated}\n        ])),`
    : `DsSection(title: ${cForm}, children: [\n${fieldsPlain}\n        ]),`;
  const listRead = hasScope ? `appStore.scoped(${SK}, _rlsScope[_rlsRole])` : `appStore.records(${SK})`;
  const cardSig = rlsActive ? 'Widget _card(Map<String, String> r, Set<int> hidden) {' : 'Widget _card(Map<String, String> r) {';
  const cardHiddenArg = rlsActive ? ', hidden: hidden' : '';
  const cardCall = rlsActive ? '_card(rs[i], _rlsHiddenSet)' : '_card(rs[i])';
  const csvMethod = rlsActive
    ? `  String _csv() {
    final b = StringBuffer();
    final hid = _rlsHiddenSet;
    final labels = const [${labelsList}];
    b.writeln([for (var i = 0; i < labels.length; i++) if (!hid.contains(i)) labels[i]].map((h) => '"' + h.replaceAll('"', '""') + '"').join(','));
    for (final r in ${listRead}) {
      final vals = [${recValues}];
      b.writeln([for (var i = 0; i < vals.length; i++) if (!hid.contains(i)) vals[i]].map((v) => '"' + v.replaceAll('"', '""') + '"').join(','));
    }
    return b.toString();
  }`
    : `  String _csv() {
    final b = StringBuffer();
    b.writeln(const [${labelsList}].map((h) => '"' + h.replaceAll('"', '""') + '"').join(','));
    for (final r in appStore.records(${SK})) {
      b.writeln([${recValues}].map((v) => '"' + v.replaceAll('"', '""') + '"').join(','));
    }
    return b.toString();
  }`;
  const relImport = hasRel ? "import '../dart-ui-bs/ds/ds_select.dart';\n" : '';
  const multiImport = hasMulti ? "import '../dart-ui-bs/ds/ds_multi_select.dart';\n" : '';
  // 📋📅 מחליף-תצוגות (תפר-דאטה אמיתי): רשימה · לוח-Kanban (אם workflow) · לוח-שנה (אם שדה-תאריך).
  // כל תצוגה מקבלת records אמיתיים. בלי-טריגר ⇒ אין מחליף ⇒ ביט-זהה. מגודר hasBoard/hasCal.
  const hasBoard = hasStages;
  const hasCal = firstDateConst !== null;
  const hasTable = true;   // טבלה-ממוינת = יכולת אוניברסלית (כל ישות)
  const hasSwitch = hasBoard || hasCal || hasTable;
  const viewTitle = labelConst[0] || "''";
  const boardImport = hasBoard ? "import '../dart-ui-bs/ds/ds_board.dart';\n" : '';
  const calImport = hasCal ? "import '../dart-ui-bs/ds/ds_calendar.dart';\n" : '';
  const tableImport = hasTable ? "import '../dart-ui-bs/ds/ds_table.dart';\n" : '';
  const viewField = hasSwitch ? "  int _view = 0;   // 0=רשימה · לוח · לוח-שנה · טבלה\n" : '';
  const viewChips = ["'☰ רשימה'"];   // list תמיד
  const viewIdx = { board: -1, cal: -1, table: -1 };
  if (hasBoard) { viewIdx.board = viewChips.length; viewChips.push("'📋 לוח'"); }
  if (hasCal) { viewIdx.cal = viewChips.length; viewChips.push("'📅 לוח-שנה'"); }
  if (hasTable) { viewIdx.table = viewChips.length; viewChips.push("'▦ טבלה'"); }
  const viewToggle = hasSwitch
    ? `\n  Widget _viewBar(BuildContext context) {\n    const labels = [${viewChips.join(', ')}];\n    return Row(mainAxisSize: MainAxisSize.min, children: [\n      for (var i = 0; i < labels.length; i++)\n        Padding(\n          padding: const EdgeInsets.only(left: 6),\n          child: Material(\n            color: _view == i ? DsTokens.accentSoft : const Color(0xFFF1F5F9),\n            borderRadius: BorderRadius.circular(20),\n            child: InkWell(\n              borderRadius: BorderRadius.circular(20),\n              onTap: () => setState(() => _view = i),\n              child: Padding(\n                padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 6),\n                child: Text(labels[i], style: TextStyle(color: _view == i ? DsTokens.accentDark : DsTokens.muted, fontSize: 12, fontWeight: FontWeight.w700)),\n              ),\n            ),\n          ),\n        ),\n    ]);\n  }\n`
    : '';
  const recordsTrailing = hasSwitch ? 'Row(mainAxisSize: MainAxisSize.min, children: [_viewBar(context), const SizedBox(width: 8), _csvBtn(context)])' : '_csvBtn(context)';
  const boardBranch = (hasBoard ? `if (_view == ${viewIdx.board}) return DsBoard(stages: const ${stageList}, records: rs, stageOf: (r) => appStore.stageOf(${SK}, r['__id'] ?? ''), titleOf: (r) => r[${viewTitle}] ?? '', onMove: (id, to) => appStore.setStage(${SK}, id, to));\n              ` : '')
    + (hasCal ? `if (_view == ${viewIdx.cal}) return DsCalendar(records: rs, dateOf: (r) => r[${firstDateConst}] ?? '', titleOf: (r) => r[${viewTitle}] ?? '');\n              ` : '')
    + (hasTable ? `if (_view == ${viewIdx.table}) return DsTable(labels: const [${labelsList}], rows: rs.map((r) => [${recValues}]).toList());\n              ` : '');
  const cls = pascal(slug);
  const code = `// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_search.dart';
${usedField ? "import '../dart-ui-bs/ds/ds_field.dart';\n" : ''}${[...typedImports].sort().map((x) => x + '\n').join('')}${enumImport}${relImport}${multiImport}${boardImport}${calImport}${tableImport}import '../dart-ui-bs/ds/ds_store.dart';
${[...funcImports].sort().join('\n')}
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});

  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  Map<int, String> _v = ${defInit};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת
  String _q = '';    // מחרוזת-חיפוש (סינון-רשומות חי)
${viewField}${hasVal ? '  String? _err;      // שגיאת-ולידציה (שדות-חובה חסרים)\n' : ''}

  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
${hasVal ? `    final miss = <String>[];
      ${reqChecks}
      ${uniqChecks}
      ${ruleChecks}${rangeChecks ? '\n      ' + rangeChecks : ''}${patternChecks ? '\n      ' + patternChecks : ''}
    if (miss.isNotEmpty) { setState(() => _err = miss.join(' · ')); return; }
` : ''}    final map = <String, String>{${mapEntries}};
    if (_editId != null) {
      appStore.update(${SK}, _editId!, map);
    } else {
      appStore.add(${SK}, <String, String>{...map${hasStages ? `, '__stage': '0'` : ''}});
    }
    setState(() { _v = ${defInit}; _editId = null;${hasVal ? ' _err = null;' : ''} });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {${editLoad}};
    });
  }
${guardMethod}${rlsFields}${viewToggle}
  ${cardSig}
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [${labelsList}], values: [${recValues}], ${stageArgs}onEdit: () => _edit(r), onDelete: () => appStore.removeById(${SK}, rid)${backFooter}${delArgs}${cardHiddenArg});
  }
${backRefs.length ? `
  Widget _backChip(String label, int n) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
        decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(20)),
        child: Text('\$label · \$n', style: const TextStyle(color: DsTokens.muted, fontSize: 11.5, fontWeight: FontWeight.w700)),
      );
` : ''}

${csvMethod}

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
${stepsDart}${hasVal ? `        if (_err != null) Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: const Color(0x14DC2626), borderRadius: BorderRadius.circular(DsTokens.rSm), border: Border.all(color: const Color(0x40DC2626))),
          child: Row(children: [const Icon(Icons.error_outline, size: 16, color: Color(0xFFDC2626)), const SizedBox(width: 8), Expanded(child: Text(_err!, style: const TextStyle(color: Color(0xFFDC2626), fontSize: 13, fontWeight: FontWeight.w600)))]),
        ),
` : ''}        ${formSection}
        DsSection(title: ${cRecords}, trailing: ${recordsTrailing}, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final all = ${listRead};
              if (all.isEmpty) return const DsEmpty(label: ${cEmpty});
              final q = _q.trim().toLowerCase();
              final rs = q.isEmpty ? all : all.where((r) => r.entries.any((e) => !e.key.startsWith('__') && e.value.toLowerCase().contains(q))).toList();
              ${boardBranch}return Column(children: [
                DsSearch(value: _q, onChanged: (v) => setState(() => _q = v)),
                if (rs.isEmpty) const DsEmpty(label: ${cNoMatch}),
                for (var i = 0; i < rs.length; i++)
                  ${cardCall},
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
export function renderHub(slug, { title, icon = '🏗️', screens, roles = [], scopeFields = [] }) {
  const { k, dump } = makeConsts(slug);
  const cTitle = k(title);
  const cIcon = k(icon);
  // 🔒 RLS · בורר-"מי-אני" (סינון-תצוגה, לא אכיפה): אופציות = איחוד ערכי שדות-ההיקף.
  const hasActor = scopeFields.length > 0;
  const actorUnion = scopeFields.map((sf) => `...appStore.distinctValues('${sf.slug}', ${k(sf.field)})`).join(', ');
  const actorMethod = hasActor
    ? `\n  Widget _actorBar(BuildContext context) => AnimatedBuilder(\n    animation: appStore,\n    builder: (context, _) {\n      final opts = <String>{${actorUnion}}.toList()..sort();\n      return Container(\n        margin: const EdgeInsets.only(bottom: 8),\n        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),\n        decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(12)),\n        child: Row(children: [\n          const Text('מציג כ:', style: TextStyle(fontSize: 12.5, color: DsTokens.muted, fontWeight: FontWeight.w700)),\n          const SizedBox(width: 8),\n          DropdownButton<String>(\n            value: appStore.actor,\n            underline: const SizedBox.shrink(),\n            items: [const DropdownMenuItem<String>(value: '', child: Text('הכל')), for (final o in opts) if (o.isNotEmpty) DropdownMenuItem<String>(value: o, child: Text(o))],\n            onChanged: (v) => setState(() => appStore.setActor(v ?? '')),\n          ),\n          const Spacer(),\n          const Text('סינון-תצוגה', style: TextStyle(fontSize: 11, color: DsTokens.faint)),\n        ]),\n      );\n    },\n  );\n`
    : '';
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
${actorMethod}${showChips ? `
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
${hasActor ? `        _actorBar(context),
` : ''}${showChips ? `        Container(
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
export function renderMain(slug, { title, hubSlug, hubCls, edges = [] }) {
  const { k, dump } = makeConsts(slug);
  const cTitle = k(title);
  const cls = pascal(slug);
  // 🗑 קובץ-רישום-קשרים (רק אם יש קשתות-שלמות מוכרזות) — נטען פעם-אחת ב-main.
  // אין קשתות ⇒ אין קובץ, אין import, אין קריאה ⇒ main ביט-זהה לאפליקציה בלי '| מחיקה:'.
  const hasEdges = edges.length > 0;
  if (hasEdges) {
    const { k: rk, dump: rdump } = makeConsts('app_relations');
    const regs = edges.map((e) => `  s.registerRelation('${e.childSlug}', ${rk(e.field)}, '${e.parentSlug}', ${e.policy}, multi: ${e.multi});`).join('\n');
    const relCode = `// ✨ חולל ע"י מנוע-הרינדור (render-ds) — רישום גרף-הקשרים לשלמות-מחיקה. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_relations_content.dart';
import '../dart-ui-bs/ds/ds_store.dart';

void registerAppRelations(AppStore s) {
${regs}
}
`;
    write('app_relations', relCode, rdump());
  }
  const relImport = hasEdges ? "import 'gen_app_relations.dart';\nimport '../dart-ui-bs/ds/ds_store.dart';\n" : '';
  const mainLine = hasEdges ? `void main() { registerAppRelations(appStore); runApp(const ${cls}()); }` : `void main() => runApp(const ${cls}());`;
  const code = `// ✨ חולל ע"י מנוע-הרינדור (render-ds) — שורש-האפליקציה (main + MaterialApp + theme + RTL). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
${relImport}import 'gen_${hubSlug}.dart';
import 'package:flutter/material.dart';

${mainLine}

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
