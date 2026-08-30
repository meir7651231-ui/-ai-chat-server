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
import { retrieve, matchClass } from './match.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const heWords = (s) => [...(s || '').matchAll(/[֐-׿][֐-׿״׳]*/g)].map((m) => m[0]);
const clean = (s) => heWords(s).join(' ').slice(0, 28) || 'שדה';

// הסקת-טיפוס מרמזי-שפה (לינגוויסטי, לא פר-ישות) — כמו stemmer.
function inferType(field) {
  if (/תאריך|מועד|יום|לידה|תוקף|התחלה|סיום/.test(field)) return 'date';
  if (/מחיר|סכום|תקציב|עלות|כמות|מספר|אחוז|שעות|שטח|רווח|יתרה|מ״ר|מ"ר/.test(field)) return 'num';
  if (/האם|פעיל|סטטוס|מצב|חסום|מאושר|נכלל/.test(field)) return 'bool';
  if (/תיאור|הערה|הערות|פירוט/.test(field)) return 'multiline';
  return 'text';
}
// טיפוס ⇒ אטום-קלט אמיתי (לפי שם-מחלקה, לא לפי-תצוגה) — matchClass מהמדף.
const TYPE_ATOM = { text: 'InlineTextRow', multiline: 'InlineTextRow', num: 'NumberStepper', bool: 'SwitchRow', date: 'DatePills' };
const inputAtom = (type, used) => {
  // מנסה כמה מועמדי-קלט מוכרים ובוחר את הראשון שקיים ולא-נוצל.
  // bool: AnimatedToggle (מצויר, נקי) לפני SwitchRow — כל ה-*SwitchRow משתמשים ב-activeColor הדפרקייטד.
  const cands = { text: ['InlineTextRow', 'TextRow', 'GlowField'], multiline: ['InlineTextRow', 'TextRow'], num: ['NumberStepper', 'QtyStepper', 'Stepper'], bool: ['AnimatedToggle', 'Toggle'], date: ['DatePills', 'DatePicker', 'MiniCalendar'] }[type] || ['InlineTextRow'];
  for (const c of cands) { const hit = matchClass(c); if (hit && !used.has(hit.cls)) return hit.cls; }
  const hit = matchClass(TYPE_ATOM[type] || 'InlineTextRow'); return (hit && hit.cls) || 'InlineTextRow';
};

export function interpret(text) {
  // שם-הישות + רשימת-השדות (בלי \b — לא עובד על עברית ב-JS)
  const body = text.replace(/^\s*(צור|תוסיף|בנה|הוסף)?\s*(ישות|טבלה|טופס)\s+/, '');
  const [namePart, ...rest] = body.split(/\s+עם\s+|\s+שדות[:\s]+|\s*:\s*/);
  const entity = clean(namePart).slice(0, 20) || 'רשומה';
  const fieldsPart = rest.join(' ') || '';
  const fields = fieldsPart.split(/[,\n]|\s+ו(?=[א-ת])/).map((s) => clean(s)).filter((s) => s.length > 1).slice(0, 20);

  const schema = fields.map((f) => ({ label: f, type: inferType(f) }));
  const used = new Set();
  const lines = [`הירו 🗂️ ${entity} | ישות מורכבת — טופס + טבלה`];
  // טופס: אטום-קלט פר-שדה
  lines.push(`כותרת טופס ${entity}`);
  for (const s of schema) { const a = inputAtom(s.type, used); used.add(a); s.atom = a; lines.push(`אטום ${a} ${s.label}`); }
  // כפתור-שמירה + טבלת-רשומות
  const btn = retrieve('כפתור שמירה שלח', 2)[0]?.cls || 'NeonButton';
  lines.push(`אטום ${btn} שמירה`);
  lines.push(`כותרת רשומות ${entity}`);
  lines.push(`אטום DataGrid ${entity}`);
  lines.push(`באנר ישות ${entity}: ${schema.length} שדות · טופס + טבלה מהמדף`);

  return { spec: lines.join('\n'), entity, schema };
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
