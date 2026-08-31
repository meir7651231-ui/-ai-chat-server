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
  // '|' מפריד שדות משלבי-workflow — אבל רק ה-'|' שלפני "שלבים:" (כדי ש-'|' בתוך enum
  // ‏{א|ב|ג} לא יישבר). "ישות X עם <שדות> | שלבים: a, b, c"
  const stM = text.match(/\|\s*(?=שלבים|סטטוסים|מצבים)/);
  const main = stM ? text.slice(0, stM.index) : text;
  const stagesPart = stM ? text.slice(stM.index + 1) : '';
  // שם-הישות + רשימת-השדות (בלי \b — לא עובד על עברית ב-JS)
  const body = main.replace(/^\s*(צור|תוסיף|בנה|הוסף)?\s*(ישות|טבלה|טופס)\s+/, '');
  const [namePart, ...rest] = body.split(/\s+עם\s+|\s+שדות[:\s]+|\s*:\s*/);
  const entity = clean(namePart).slice(0, 40) || 'רשומה';
  const fieldsPart = rest.join(' ') || '';
  // אין חיתוך-שקט: כל השדות נשמרים (קודם נחתך ל-20 ⇒ 'סטטוס'/'התאמות' נעלמו). תקרת-שפיות בלבד.
  // 🔤 פעלי-שפה (תואמי-לאחור): שדה* = חובה · שדה{א|ב|ג} = ערכים-מותרים · שדה=נוסחה = מחושב.
  const rawFields = fieldsPart.split(/[,\n]/).map((s) => s.trim()).filter(Boolean).slice(0, 200);
  const annots = [];   // { label, required, enumVals, formula }
  for (const raw of rawFields) {
    let f = raw;
    let required = false, enumVals = null, formula = null;
    const eq = f.indexOf('=');
    if (eq > 0) { formula = f.slice(eq + 1).trim(); f = f.slice(0, eq); }          // שדה=נוסחה
    const em = f.match(/\{([^}]*)\}/);
    if (em) { enumVals = em[1].split('|').map((x) => clean(x)).filter((x) => x.length > 0); f = f.replace(/\{[^}]*\}/, ''); }   // {א|ב|ג}
    if (/\*/.test(f)) { required = true; f = f.replace(/\*/g, ''); }               // שדה*
    const label = clean(f);
    if (label.length > 1) annots.push({ label, required, enumVals: enumVals && enumVals.length ? enumVals : null, formula });
  }
  const fields = annots.map((a) => a.label);
  // 🔄 שלבי-workflow (אם ניתנו): שרשרת-סטטוס. בלי '|' ⇒ אין workflow (לא ברירת-מחדל).
  // אין חיתוך ל-8 (קודם הפיל 'ועדה/התקבל/נדחה' — שלבי-ההכרעה שה-workflow קיים בשבילם).
  const stages = stagesPart
    ? stagesPart.replace(/^\s*(שלבים|סטטוסים|מצבים)[:\s]*/, '').split(/[,\n]|\s*→\s*/).map((s) => heWords(s).join(' ').trim()).filter((s) => s.length > 1).slice(0, 30)
    : [];

  const schema = annots.map((a) => ({ label: a.label, type: inferType(a.label), required: a.required, enumVals: a.enumVals, formula: a.formula }));
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

  return { spec: lines.join('\n'), entity, schema, stages, rules: rules.map((r) => r.name) };
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
