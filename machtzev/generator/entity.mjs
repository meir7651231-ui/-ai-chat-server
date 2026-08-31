#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  entity.mjs — מנוע-הישויות (ההפוך של schema.mjs · טהור)
//  "צור ישות <שם> עם <שדות>" ⇒ לכל שדה מוסק טיפוס ⇒ נבחר אטום-קלט לפי-משמעות
//  ⇒ מורכב טופס (קלט פר-שדה) + טבלה (עמודה פר-שדה). האטומים נאחזרים מהמדף;
//  טיפוסי-השדה נלמדים מרמזי-שפה + מקורפוס-הישויות. schema.mjs מפרק — זה מרכיב.
//  שימוש:  node entity.mjs "צור ישות פרויקט עם שם, כתובת, תקציב, תאריך התחלה, סטטוס"
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { retrieve, matchClass, retrieveLogic } from './match.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const heWords = (s) => [...(s || '').matchAll(/[֐-׿][֐-׿״׳]*/g)].map((m) => m[0]);
const clean = (s) => heWords(s).join(' ').slice(0, 60) || 'שדה';

// הסקת-טיפוס מרמזי-שפה (לינגוויסטי, לא פר-ישות) — כמו stemmer.
function inferType(field) {
  if (/תאריך|מועד|יום|לידה|תוקף|התחלה|סיום/.test(field)) return 'date';
  if (/מחיר|סכום|תקציב|עלות|כמות|מספר|אחוז|שעות|שטח|רווח|יתרה|מ״ר|מ"ר/.test(field)) return 'num';
  if (/האם|פעיל|סטטוס|מצב|חסום|מאושר|נכלל/.test(field)) return 'bool';
  if (/תיאור|הערה|הערות|פירוט/.test(field)) return 'multiline';
  return 'text';
}
// טיפוס ⇒ אטום-קלט אמיתי (לפי שם-מחלקה, לא לפי-תצוגה) — matchClass מהמדף.
// date → FieldRow גם כן: DatePills הוא רצועת-14-יום אופקית (נשברה בטופס). שדה-תאריך
// בטופס = שדה נקי ואחיד עם התווית ("תאריך התחלה") — קלט עקבי, אפס-גלישה.
const TYPE_ATOM = { text: 'FieldRow', multiline: 'InlineTextRow', num: 'NumberStepper', bool: 'AnimatedToggle', date: 'FieldRow' };
// 🎨 עיצוב טהור: אטום-קלט אחד ועקבי לכל טיפוס — טופס נקרא כטופס אחד, לא כתערוכת-אטומים.
// (הריבוי-לשם-ריבוי היה נכון לשואוקייס · לא לטופס. עקביות > מגוון.)
const inputAtom = (type) => {
  const hit = matchClass(TYPE_ATOM[type] || 'InlineTextRow');
  return (hit && hit.cls) || 'InlineTextRow';
};

export function interpret(text) {
  // סעיפי-'|' לפי מילת-מפתח בלבד (כדי ש-'|' בתוך enum {א|ב|ג} לא יישבר):
  // "ישות X עם <שדות> | שלבים: a,b | חוקים: תאריך יעד >= תאריך חיוב"
  const markers = [...text.matchAll(/\|\s*(שלבים|סטטוסים|מצבים|חוקים|ולידציה|מחיקה)/g)];
  const main = markers.length ? text.slice(0, markers[0].index) : text;
  let stagesPart = '', rulesPart = '', delPart = '';
  markers.forEach((m, mi) => {
    const start = m.index + m[0].length;
    const end = mi + 1 < markers.length ? markers[mi + 1].index : text.length;
    const content = text.slice(start, end).replace(/^[:\s]+/, '');
    if (m[1] === 'חוקים' || m[1] === 'ולידציה') rulesPart = content;
    else if (m[1] === 'מחיקה') delPart = content;
    else stagesPart = content;
  });
  // שם-הישות + רשימת-השדות (בלי \b — לא עובד על עברית ב-JS)
  const body = main.replace(/^\s*(צור|תוסיף|בנה|הוסף)?\s*(ישות|טבלה|טופס)\s+/, '');
  const [namePart, ...rest] = body.split(/\s+עם\s+|\s+שדות[:\s]+|\s*:\s*/);
  const entity = clean(namePart).slice(0, 40) || 'רשומה';
  const fieldsPart = rest.join(' ') || '';
  // אין חיתוך-שקט: כל השדות נשמרים (קודם נחתך ל-20 ⇒ 'סטטוס'/'התאמות' נעלמו). תקרת-שפיות בלבד.
  // 🔤 פעלי-שפה (תואמי-לאחור): שדה* = חובה · שדה{א|ב|ג} = ערכים-מותרים · שדה=נוסחה = מחושב.
  const rawFields = fieldsPart.split(/[,\n]/).map((s) => s.trim()).filter(Boolean).slice(0, 200);
  const annots = [];   // { label, required, unique, enumVals, formula, def }
  for (const raw of rawFields) {
    let f = raw;
    let required = false, unique = false, enumVals = null, formula = null, def = null, members = null;
    const eq = f.indexOf('=');
    if (eq > 0) { formula = f.slice(eq + 1).trim(); f = f.slice(0, eq); }          // שדה=נוסחה
    const dm = f.match(/\[([^\]]*)\]/);
    if (dm) { def = dm[1].trim() || null; f = f.replace(/\[[^\]]*\]/, ''); }        // שדה[ברירת-מחדל] (ערך-גלמי: מספר/מטבע/מילה)
    // שדה(תת/תת/תת) — אובייקט-מקונן (Value Object). עומק-1. תת-שדות = תוויות פשוטות
    // מופרדות-'/'. פרנתזה מספרית (טווח עתידי) ⇒ 0 חברים-עבריים ⇒ לא-מקונן (הפרדה טבעית).
    const pm = f.match(/\(([^)]*)\)/);
    if (pm) { const subs = pm[1].split('/').map((x) => clean(x)).filter((x) => x.length > 1); if (subs.length) { members = subs; f = f.replace(/\([^)]*\)/, ''); } }
    const em = f.match(/\{([^}]*)\}/);
    if (em) { enumVals = em[1].split('|').map((x) => clean(x)).filter((x) => x.length > 0); f = f.replace(/\{[^}]*\}/, ''); }   // {א|ב|ג}
    if (/\*/.test(f)) { required = true; f = f.replace(/\*/g, ''); }               // שדה* = חובה
    if (/!/.test(f)) { unique = true; f = f.replace(/!/g, ''); }                   // שדה! = ייחודי
    if (members) { required = false; unique = false; formula = null; enumVals = null; }   // מקונן: אין חובה/ייחודי/נוסחה/enum (v1)
    const label = clean(f);
    if (label.length > 1) annots.push({ label, required, unique, enumVals: enumVals && enumVals.length ? enumVals : null, formula, def, members });
  }
  const fields = annots.map((a) => a.label);
  // 🔄 שלבי-workflow (אם ניתנו): שרשרת-סטטוס. בלי '|' ⇒ אין workflow (לא ברירת-מחדל).
  // אין חיתוך ל-8 (קודם הפיל 'ועדה/התקבל/נדחה' — שלבי-ההכרעה שה-workflow קיים בשבילם).
  const stages = stagesPart
    ? stagesPart.replace(/^\s*(שלבים|סטטוסים|מצבים)[:\s]*/, '').split(/[,\n]|\s*→\s*/).map((s) => heWords(s).join(' ').trim()).filter((s) => s.length > 1).slice(0, 30)
    : [];

  const schema = annots.map((a) => ({ label: a.label, type: inferType(a.label), required: a.required, unique: a.unique, enumVals: a.enumVals, formula: a.formula, def: a.def, members: a.members }));
  const used = new Set();
  const lines = [`הירו 🗂️ ${entity} | ישות מורכבת — טופס + טבלה`];
  // 🔄 workflow: פס-שלבים מתוייג (BreadcrumbTrail labels) — מציג את מסע-הרשומה
  if (stages.length >= 2) lines.push(`אטום BreadcrumbTrail ${entity}: ${stages.join(' / ')}`);
  // טופס: אטום-קלט פר-שדה
  lines.push(`כותרת טופס ${entity}`);
  for (const s of schema) { const a = inputAtom(s.type); used.add(a); s.atom = a; lines.push(`אטום ${a} ${s.label}`); }
  // כפתור-שמירה (+ קידום-שלב אם workflow)
  const btn = retrieve('כפתור שמירה שלח', 2)[0]?.cls || 'NeonButton';
  lines.push(`אטום ${btn} שמירה`);
  if (stages.length >= 2) lines.push(`אטום NeonButton קדם ל${stages[1]}`);
  // 🔐 שכבת-חוקים פר-שדה: כל שדה מאחזר-לבד את אטום-הלוגיקה/פורמט/ולידציה שמתאים *לו*
  // (סכום→shekel · תאריך→fmtDate · טלפון→normPhone). אפס מיפוי-ידני. התאמת-טיפוס:
  // אטום-החוק חייב לקבל את טיפוס-השדה (date→DateTime · num→num · text→String).
  const TYPE_IN = { date: ['DateTime', 'String', 'Object'], num: ['num', 'int', 'double', 'Object', 'dynamic', 'String'], text: ['String', 'Object', 'dynamic'], multiline: ['String', 'Object'] };
  const rules = [];
  const usedR = new Set();
  for (const s of schema) {
    const ok = TYPE_IN[s.type] || ['String'];
    const hit = retrieveLogic(s.label, 6, true).find((l) => l.s >= 3 && !usedR.has(l.name) && l.inTypes.some((t) => ok.includes(t)));
    if (hit) { usedR.add(hit.name); s.rule = hit.name; rules.push({ field: s.label, name: hit.name, he: hit.he }); }
  }
  // טבלת-רשומות
  lines.push(`כותרת רשומות ${entity}`);
  lines.push(`אטום DataGrid ${entity}`);
  // 🔗 מנוע-החוקים החי — סקשן ברור בתחתית (לא אריחים מרחפים בתוך הטופס). כל חוק
  // מחווט חי מהמדף (role=calc, קריאת-פונקציה אמיתית) ומתויג בשם-מטרתו העברי.
  if (rules.length) {
    lines.push(`כותרת 🔗 מנוע-חוקים חי · ${rules.length} חוקים מהמדף`);
    for (const r of rules) lines.push(`חישוב ${r.he.slice(0, 4).join(' ')} (${r.name})`);
  }
  lines.push(`באנר ישות ${entity}: ${schema.length} שדות${stages.length ? ` · ${stages.length}-שלבי workflow` : ''}${rules.length ? ` · ${rules.length} חוקים חיים` : ''} · מהמדף`);

  const vrules = rulesPart ? rulesPart.split(/[,\n]/).map((s) => s.trim()).filter((s) => s.length > 2) : [];
  // 🗑 שלמות-קשר: '| מחיקה: כיתה=מפל, תלמיד=ניתוק' ⇒ מדיניות פר-שדה-קשר. מילות-מפתח
  // דו-לשוניות (מפל/cascade · ניתוק/set-null · חסימה/restrict); לא-מזוהה ⇒ חסימה (בטוח).
  const POL = { 'מפל': 1, cascade: 1, 'ניתוק': 2, 'נתק': 2, null: 2, 'חסימה': 0, 'חסום': 0, restrict: 0 };
  const delPolicy = delPart
    ? delPart.split(/[,\n]/).map((e) => { const m = e.match(/^(.+?)\s*=\s*(.+)$/); if (!m) return null; const field = clean(m[1]); const pk = m[2].trim(); return field.length > 1 ? { field, policy: pk in POL ? POL[pk] : 0 } : null; }).filter(Boolean)
    : [];
  return { spec: lines.join('\n'), entity, schema, stages, rules: rules.map((r) => r.name), vrules, delPolicy };
}

// ── CLI (רץ רק בהרצה ישירה, לא ביבוא) ──
if (import.meta.url === 'file://' + process.argv[1]) {
const text = process.argv.slice(2).join(' ').trim();
if (!text) { console.error('שימוש: node entity.mjs "צור ישות <שם> עם <שדות>"'); process.exit(1); }
const { spec, entity, schema } = interpret(text);
console.log(`🗂️ ישות: ${entity} · ${schema.length} שדות`);
for (const s of schema) console.log(`   ${s.label}  ⟨${s.type}⟩ → ${s.atom}`);
console.log('\n📋 הספק:');
console.log(spec.split('\n').map((l) => '   ' + l).join('\n'));
fs.writeFileSync(path.join(HERE, 'specs/entity.txt'), spec + '\n');
console.log('\n▶ מריץ את המחולל...');
const out = execFileSync('node', [path.join(HERE, 'genesis-gen.mjs'), 'entity', spec], { encoding: 'utf8' });
console.log(out.split('\n').filter((l) => /entity ·/.test(l)).join('\n'));
}
