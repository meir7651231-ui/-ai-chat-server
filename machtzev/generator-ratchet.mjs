#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  generator-ratchet.mjs — נועל את יכולות-המחולל שנבנו (הכרעות 20+21).
//  מריץ buildApp על אפיונים-מכוונים ומוודא שהפלט מכיל את דפוסי-החיווט הצפויים
//  (בחירת-אטום · הרכבה · מנוע-רשומה · מיפוי-שדות-למפתחות · RLS). מריץ ⇒ שגיאה=exit 1.
//  משחזר את פלט-הקנון (erp-full) בסוף כדי לא להשאיר את העץ במצב-בדיקה.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs'; import path from 'node:path';
import { buildApp } from './generator/app-ds.mjs';
import { SCREEN_REGISTRY, selectAtom } from './generator/render-ds.mjs';

const ROOT = new URL('../new/', import.meta.url).pathname;
const GEN = path.join(ROOT, 'dart-gen-bs');
const DATA = path.join(ROOT, 'dart-data-bs/auto');
const read = (f) => { try { return fs.readFileSync(path.join(GEN, f), 'utf8'); } catch { return ''; } };
const all = () => fs.readdirSync(GEN).filter((f) => /^gen_app_.*\.dart$/.test(f)).map(read).join('\n');
// צילום פלט-הקנון (gen+data) לשחזור-מדויק בסוף — ללא תלות ב-/tmp (בטוח-CI).
const snap = (dir, re) => Object.fromEntries(fs.readdirSync(dir).filter((f) => re.test(f)).map((f) => [f, fs.readFileSync(path.join(dir, f), 'utf8')]));
const restore = (dir, re, snapshot) => { for (const f of fs.readdirSync(dir)) if (re.test(f)) fs.unlinkSync(path.join(dir, f)); for (const [f, c] of Object.entries(snapshot)) fs.writeFileSync(path.join(dir, f), c); };
const GRE = /^gen_app_.*\.dart$/, DRE = /^gen_app_.*_content\.dart$/;
const genSnap = snap(GEN, GRE), dataSnap = snap(DATA, DRE);
let fails = 0;
const ok = (cond, msg) => { if (!cond) { console.log('  🚨 ' + msg); fails++; } else console.log('  ✓ ' + msg); };

// 1) מצע-התצוגה + הבורר מכוון-המטרה חיים
ok(SCREEN_REGISTRY.length >= 12, `מצע-מסכים: ${SCREEN_REGISTRY.length} ≥ 12`);
const kpi = selectAtom({ value: { re: /^(value|val|count)$/, ty: /^String\??$/ }, label: { re: /^(label|title|name)$/, ty: /^String\??$/ } }, (a) => a.caps.includes('kpi') && a.seam === 'fields');
ok(kpi && kpi.cls, `בורר-מטרה מחזיר אטום-KPI (${kpi && kpi.cls})`);
const bad = selectAtom({ title: { re: /^title$/, ty: /^String\??$/ } }, (a) => a.cls === 'ActionCard');
ok(bad === null, 'בורר פוסל אטום עם שקע-דאטה לא-ממופה (אנטי-זיוף)');

// 2) הרכבה + ניווט + מנוע-רשומה + מיפוי-מפתחות
buildApp('ישות סעיף עם קוד, כמות, מחיר, סכום=boqLineAmount(כמות→qty, מחיר→price)\nישות תורם עם שם, טלפון, חידוש=isRenewed');
const s2 = all();
ok(/Callout\(|DsTable\(|DsBoard\(/.test(s2), 'מסך-הרכבה מרכיב אטומי-אמת');
ok(/boqLineAmount\(<String, String>\{/.test(s2), 'מנוע-רשומה מחווט על הרשומה');
ok(/isRenewed\(<String, String>\{/.test(s2) && /\? gen_app_\w+ : gen_app_\w+\)/.test(s2), 'מנוע-bool ⇒ כן/לא');
ok(/Navigator\.of\(context\)\.push/.test(s2), 'ניווט שורה⇒כרטיס');

// 3) RLS — scoped כשיש שדה-היקף
buildApp('ישות חוג עם שם, מורה, מחיר, סטטוס | שלבים: פתוח, מלא\nישות תלמיד עם שם, מורה, ממוצע\nתפקיד מזכירה: הכל\nתפקיד מורה: חוג, תלמיד | היקף: חוג.מורה, תלמיד.מורה');
const s3 = all();
ok(/appStore\.scoped\('app_ent\d+',/.test(s3), 'RLS: מסכי-חיווט מכבדים scoped');

// שחזור פלט-הקנון מהצילום (בטוח-CI, מדויק)
restore(GEN, GRE, genSnap); restore(DATA, DRE, dataSnap);

if (fails) { console.log(`\n🚨 רַצֶ'ט-המחולל: ${fails} כשלים`); process.exit(1); }
console.log('\n✅ רַצֶ\'ט-המחולל: כל יכולות-המחולל נעולות');
