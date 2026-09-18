#!/usr/bin/env node
/** מחצב · cross-source-check — שער `cross-source` (הכרעה 23-ד · "אין = לא-חיפשת" · LAW חוק-3 · THE-WAY 🔎).
 *  החלק המכני של 23-ד: קובץ-אטום **חדש** (staged A) ששמו-המנורמל כבר קיים באותה שפה בתיקייה אחרת תחת new/
 *  (atoms · boxes · logic · dart · dart-maor · dart-data* · dart-ui-bs …) ⇒ 🔴 המצאה-מחדש: לא סרקת את שני המקורות + האורקל.
 *  תאום חוצה-שפה (JS↔Dart באותו שם) = לגיטימי (twins) ⇒ ℹ️ בלבד. הכרעת-"חיבור-מודלים" עצמה אינה מכנית — נשארת ב-THE-WAY.
 *  שימוש: --files a,b (מ-pre-commit: קבצים שנוספו) · בלי ארגומנטים = 0. יציאה 0/1. */
import fs from 'node:fs';
import path from 'node:path';
import * as R from './root.mjs';
import { rminhu, had, pliga, lo, printNotes } from '../yeshiva/rminhu.mjs';   // 🕯️ «אין» = «לא-חיפשת» (הכרעה-23)
const argv = process.argv.slice(2);
const fi = argv.indexOf('--files');
const added = fi >= 0 ? argv[fi + 1].split(',').filter(Boolean).map((f) => path.resolve(R.ROOT, f)) : [];
const isAtom = (f) => /\.(mjs|dart)$/.test(f) && !/\.test\.mjs$|_test\.dart$|-proof\.dart$/.test(f) && f.startsWith(R.NEW.replace(/\/$/, ''));
const targets = added.filter(isAtom);
// 🕯️ למה קובץ-staged אינו «אטום חדש» — שלוש דחיות שונות שהדפיסו שורה אחת זהה. `--files` ריק
//    ו-`--files` עם חמישה קבצים-שאינם-אטומים הפיקו את אותו «✓ אין אטומים חדשים», וזה מונה ולא פסק.
const whyNotAtom = (f) => (!/\.(mjs|dart)$/.test(f)
  ? `סיומת ${path.extname(f) || '(אין)'} — המנוע סורק .mjs/.dart בלבד, ולכן אינו אטום שיכול להיות המצאה-מחדש`
  : /\.test\.mjs$|_test\.dart$|-proof\.dart$/.test(f)
    ? 'בדיקה/הוכחה ולא אטום (‏.test.mjs · _test.dart · -proof.dart) — שם-כפול בהן אינו המצאה-מחדש'
    : `מחוץ ל-new/ (${path.relative(R.ROOT, f)}) — המדף שהמנוע מכיר הוא new/ בלבד (‏L113: מה שלא במדף אינו נשאל)`);
if (!targets.length) {
  const r = rminhu({ engine: 'cross-source', matter: `${added.length} קבצים ב---files ⇒ אילו מהם אטומים חדשים`,
    searched: [`--files (${added.length} נתיבים) · הגדר-האטום: סיומת .mjs/.dart · לא-בדיקה · תחת ${path.relative(R.ROOT, R.NEW) || 'new/'}`],
    rulings: added.map((f) => lo(path.relative(R.ROOT, f), whyNotAtom(f))),
    none: 'לא הועבר אף נתיב ב---files — אין staged-added לבדוק (זה לא «נסרק ונמצא נקי»)' });
  void r;
  printNotes('cross-source');
  console.log('✓ cross-source: אין אטומים חדשים ב-staged');
  process.exit(0);
}
const norm = (f) => path.basename(f).replace(/\.(mjs|dart)$/, '').replace(/[^a-z0-9]/gi, '').toLowerCase();
const lang = (f) => (f.endsWith('.dart') ? 'dart' : 'js');
// R3-5.11: השוואה רק בתוך אותו סוג — אטום מול אטום, קופסה מול קופסה; קופסה בשם-האטום שלה אינה המצאה-מחדש
const KIND = { atoms: 'atom', logic: 'atom', dart: 'atom', 'dart-maor': 'atom', boxes: 'box', 'dart-boxes': 'box', 'dart-boards-bs': 'screen', 'dart-screens-bs': 'screen', 'dart-ui-bs': 'ui', 'dart-gen-bs': 'ui' };
const kind = (f) => { const top = path.relative(R.NEW, f).split('/')[0]; return KIND[top] || (top.startsWith('dart-data') ? 'data' : top); };
const index = new Map(); // norm → [files]
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) { if (!/node_modules|quarantine/i.test(e.name)) walk(f); } else if (isAtom(f)) (index.get(norm(f)) || index.set(norm(f), []).get(norm(f))).push(f); } })(R.NEW);
const red = [], info = [];
for (const t of targets) {
  // 🕯️ ורמינהו **לפני** הירוק: כל קובץ שהאינדקס העלה על השם-המנורמל נפסק בשמו. שלושת המסננים
  //    (אותה תיקייה · שפה · סוג) הפילו מקורות בשתיקה — ובפרט **אותו שם בסוג אחר** נשר גם
  //    מ-`same` וגם מ-`twins` ולא הודפס מעולם. «✓ אף אחד לא קיים במקור אחר» הודפס זהה כשלא
  //    נמצא כלום וכשנמצא-ונדחה, וזה בדיוק המונה-שמתחזה-לפסק של L110 §1.
  const hits = (index.get(norm(t)) || []).filter((f) => f !== t);
  const rel = (f) => path.relative(R.ROOT, f);
  const r = rminhu({ engine: 'cross-source', matter: `אטום חדש «${rel(t)}» (שם-מנורמל «${norm(t)}» · סוג ${kind(t)} · ${lang(t)})`,
    searched: [`new/ (${index.size} שמות-מנורמלים · ${[...index.values()].reduce((a, v) => a + v.length, 0)} קבצים)`],
    rulings: hits.map((f) => (path.dirname(f) === path.dirname(t)
      ? lo(rel(f), `אותה תיקייה (${path.relative(R.NEW, path.dirname(f))}) — שכן, והשאלה היא על **מקור אחר**`)
      : kind(f) !== kind(t)
        ? pliga(rel(f), `אותו שם בסוג אחר: ${kind(f)} מול ${kind(t)} — R3-5.11 משווה אטום-מול-אטום; קופסה בשם-האטום שלה אינה המצאה-מחדש`)
        : lang(f) !== lang(t)
          ? pliga(rel(f), `תאום חוצה-שפה ${lang(f)}↔${lang(t)} באותו סוג (${kind(t)}) — לגיטימי (twins), ולכן ℹ️ ולא 🔴`)
          : had(rel(f), `אותה שפה (${lang(t)}) ואותו סוג (${kind(t)}) בתיקייה אחרת (${path.relative(R.NEW, path.dirname(f))}) — המצאה-מחדש: חבר/ייבא`))),
    none: `לא מצינו: השם-המנורמל «${norm(t)}» אינו מופיע באף קובץ אחר תחת new/ (${index.size} שמות נסרקו)` });
  const others = hits.filter((f) => path.dirname(f) !== path.dirname(t));
  const same = others.filter((f) => lang(f) === lang(t) && kind(f) === kind(t)), twins = others.filter((f) => lang(f) !== lang(t) && kind(f) === kind(t));
  if (same.length) red.push(`${rel(t)} ⇐ כבר קיים: ${same.map(rel).join(' · ')}`);
  if (twins.length) info.push(`${rel(t)} ~ תאום חוצה-שפה: ${twins.map(rel).join(' · ')}`);
  void r;   // הפסק נשמר בפנקס ובשורות; הערך המוחזר של המנוע אינו זז (חוק-7)
}
printNotes('cross-source');
info.forEach((l) => console.log('  ℹ️ ' + l));
if (red.length) { console.log(`🔴 cross-source (23-ד "אין = לא-חיפשת"): ${red.length} אטומים חדשים שכבר קיימים במקור אחר — חבר/ייבא, אל תמציא:`); red.forEach((l) => console.log('   ✗ ' + l)); process.exit(1); }
console.log(`✓ cross-source: ${targets.length} אטומים חדשים · אף אחד לא קיים כבר במקור אחר (${index.size} שמות באורקל-הקבצים)`);
