#!/usr/bin/env node
/** מחצב · cross-source-check — שער `cross-source` (הכרעה 23-ד · "אין = לא-חיפשת" · LAW חוק-3 · THE-WAY 🔎).
 *  החלק המכני של 23-ד: קובץ-אטום **חדש** (staged A) ששמו-המנורמל כבר קיים באותה שפה בתיקייה אחרת תחת new/
 *  (atoms · boxes · logic · dart · dart-maor · dart-data* · dart-ui-bs …) ⇒ 🔴 המצאה-מחדש: לא סרקת את שני המקורות + האורקל.
 *  תאום חוצה-שפה (JS↔Dart באותו שם) = לגיטימי (twins) ⇒ ℹ️ בלבד. הכרעת-"חיבור-מודלים" עצמה אינה מכנית — נשארת ב-THE-WAY.
 *  שימוש: --files a,b (מ-pre-commit: קבצים שנוספו) · בלי ארגומנטים = 0. יציאה 0/1. */
import fs from 'node:fs';
import path from 'node:path';
import * as R from './root.mjs';
const argv = process.argv.slice(2);
const fi = argv.indexOf('--files');
const added = fi >= 0 ? argv[fi + 1].split(',').filter(Boolean).map((f) => path.resolve(R.ROOT, f)) : [];
const isAtom = (f) => /\.(mjs|dart)$/.test(f) && !/\.test\.mjs$|_test\.dart$|-proof\.dart$/.test(f) && f.startsWith(R.NEW.replace(/\/$/, ''));
const targets = added.filter(isAtom);
if (!targets.length) { console.log('✓ cross-source: אין אטומים חדשים ב-staged'); process.exit(0); }
const norm = (f) => path.basename(f).replace(/\.(mjs|dart)$/, '').replace(/[^a-z0-9]/gi, '').toLowerCase();
const lang = (f) => (f.endsWith('.dart') ? 'dart' : 'js');
// R3-5.11: השוואה רק בתוך אותו סוג — אטום מול אטום, קופסה מול קופסה; קופסה בשם-האטום שלה אינה המצאה-מחדש
const KIND = { atoms: 'atom', logic: 'atom', dart: 'atom', 'dart-maor': 'atom', boxes: 'box', 'dart-boxes': 'box', 'dart-boards-bs': 'screen', 'dart-screens-bs': 'screen', 'dart-ui-bs': 'ui', 'dart-gen-bs': 'ui' };
const kind = (f) => { const top = path.relative(R.NEW, f).split('/')[0]; return KIND[top] || (top.startsWith('dart-data') ? 'data' : top); };
const index = new Map(); // norm → [files]
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) { if (!/node_modules|quarantine/i.test(e.name)) walk(f); } else if (isAtom(f)) (index.get(norm(f)) || index.set(norm(f), []).get(norm(f))).push(f); } })(R.NEW);
const red = [], info = [];
for (const t of targets) {
  const others = (index.get(norm(t)) || []).filter((f) => f !== t && path.dirname(f) !== path.dirname(t));
  const same = others.filter((f) => lang(f) === lang(t) && kind(f) === kind(t)), twins = others.filter((f) => lang(f) !== lang(t) && kind(f) === kind(t));
  if (same.length) red.push(`${path.relative(R.ROOT, t)} ⇐ כבר קיים: ${same.map((f) => path.relative(R.ROOT, f)).join(' · ')}`);
  if (twins.length) info.push(`${path.relative(R.ROOT, t)} ~ תאום חוצה-שפה: ${twins.map((f) => path.relative(R.ROOT, f)).join(' · ')}`);
}
info.forEach((l) => console.log('  ℹ️ ' + l));
if (red.length) { console.log(`🔴 cross-source (23-ד "אין = לא-חיפשת"): ${red.length} אטומים חדשים שכבר קיימים במקור אחר — חבר/ייבא, אל תמציא:`); red.forEach((l) => console.log('   ✗ ' + l)); process.exit(1); }
console.log(`✓ cross-source: ${targets.length} אטומים חדשים · אף אחד לא קיים כבר במקור אחר (${index.size} שמות באורקל-הקבצים)`);
