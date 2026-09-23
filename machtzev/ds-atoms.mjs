#!/usr/bin/env node
/** 🎨 מנוע-עיצוב 7 · ds-atoms — צבעי-האטומים כדאטה (הכרעת-בעלים 23.9: «תשנה את כולם ללא קשיח. נקודה»).
 *  הזרע: new/dart-ui-bs/atoms-colors.json — לכל קובץ-אטום רשימת הצבעים שישבו בו ביד (AARRGGBB, בסדר ההופעה, בלי כפילות).
 *  המנוע (עיוור, נוסחה): זרע ⇒ new/dart-ui-bs/ds/ds_atoms.dart — `class DsAtomColors { static const <קובץ><n> = Color(0x…); }`.
 *  האטום מפנה ל-DsAtomColors.<שם> במקום ליטרל. ביט-זהה: אותו ערך, אותו מקום — רק המקור זז לדאטה.
 *  אטום שצבעיו ב-DsAtomColors עדיין «לא לובש עור» (look.mjs HARD_COLOR מכיר DsAtomColors) — הדאטה לא הופכת אותו ללובש; רק מסמנת מאיפה הצבע.
 *  שימוש: node machtzev/ds-atoms.mjs [--check]
 *    --check: (א) ds_atoms.dart טרי מהזרע · (ב) אף קובץ-אטום (מלבד הפטורים) לא מחזיק ליטרל-צבע. יציאה-1 אם לא.
 *  פטורים מהסריקה (מוצהר): ds_scale/ds_pure/ds_atoms (פלט-טוקנים מזרע) · auto/bs_tokens.dart (אטום-דאטה: קטלוג-הפיגמנטים של buildsmart, הורם verbatim — הוא זרע בעצמו)
 *    · forged/ (ds-forge: ספק-forge ⇒ Dart, הצבע = דאטה של הספק). */
import fs from 'node:fs';
import path from 'node:path';
const UI = new URL('../new/dart-ui-bs/', import.meta.url).pathname;
const SEED = path.join(UI, 'atoms-colors.json');
const TARGET = path.join(UI, 'ds', 'ds_atoms.dart');
const CHECK = process.argv.includes('--check');
export const EXEMPT = /^(ds\/ds_scale\.dart|ds\/ds_pure\.dart|ds\/ds_atoms\.dart|auto\/bs_tokens\.dart|forged\/)/;
// ליטרל-צבע = מה ש-look.mjs HARD_COLOR מחשיב קשיח (בלי transparent) + Colors.<שם> של Flutter (ערך ידוע)
export const LITERAL_RE = /(?:const\s+)?Color\(0x(?!00000000)([0-9A-Fa-f]{8})\)|Colors\.(white70|white60|white54|white38|white30|white24|white12|white10|white|black87|black54|black45|black38|black26|black12|black|redAccent|red|grey)\b(?!\.shade|\[)/g;
export const FLUTTER_COLORS = { white: 'FFFFFFFF', white70: 'B3FFFFFF', white60: '99FFFFFF', white54: '8AFFFFFF', white38: '62FFFFFF', white30: '4DFFFFFF', white24: '3DFFFFFF', white12: '1FFFFFFF', white10: '1AFFFFFF', black: 'FF000000', black87: 'DD000000', black54: '8A000000', black45: '73000000', black38: '61000000', black26: '42000000', black12: '1F000000', redAccent: 'FFFF5252', red: 'FFF44336', grey: 'FF9E9E9E' };
export const constName = (rel, i) => rel.replace(/\.dart$/, '').split(/[\/_\-.]+/).filter(Boolean).map((w, k) => k ? w[0].toUpperCase() + w.slice(1) : w).join('').replace(/[^A-Za-z0-9]/g, '') + (i + 1);
export const stripComments = (code) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\s\/\/(?![^'"]*['"][^'"]*$).*$/gm, '');   // הערה אינה צבע (5 אטומים הזכירו ליטרל רק בתיעוד)
export const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.dart') ? [path.join(d, e.name)] : []);

const seed = fs.existsSync(SEED) ? JSON.parse(fs.readFileSync(SEED, 'utf8')) : { _: '', files: {} };
const lines = [];
for (const [rel, cols] of Object.entries(seed.files || {})) cols.forEach((hex, i) => lines.push(`  static const ${constName(rel, i)} = Color(0x${hex});   // ${rel}`));
const out = `// ✨ צבעי-האטומים · DsAtomColors — **מחולל ע"י machtzev/ds-atoms.mjs מ-new/dart-ui-bs/atoms-colors.json.**
// אל תערוך ידנית: שנה את הזרע והרץ את המנוע. הכרעת-בעלים 23.9 «לא קשיח»: כל צבע שישב ביד באטום — כאן, כדאטה. material בלבד.
import 'package:flutter/material.dart';

class DsAtomColors {
${lines.join('\n')}
}
`;

const isMain = process.argv[1] && import.meta.url === 'file://' + process.argv[1];   // ייבוא (ds-wear) לא מריץ את הבדיקה
if (CHECK && isMain) {
  const cur = fs.existsSync(TARGET) ? fs.readFileSync(TARGET, 'utf8') : '';
  let bad = 0;
  if (cur !== out) { console.error('🚨 ds-atoms: ds_atoms.dart אינו-טרי — הרץ node machtzev/ds-atoms.mjs'); bad++; }
  const hits = [];
  for (const f of walk(UI)) { const rel = path.relative(UI, f); if (EXEMPT.test(rel)) continue; const n = (stripComments(fs.readFileSync(f, 'utf8')).match(LITERAL_RE) || []).length; if (n) hits.push(`${rel}:${n}`); }
  if (hits.length) { console.error(`🚨 ds-atoms: ליטרלי-צבע באטומים (${hits.length} קבצים): ${hits.slice(0, 8).join(' · ')}${hits.length > 8 ? ' …' : ''}`); bad++; }
  if (bad) process.exit(1);
  console.log(`✓ ds-atoms: ds_atoms.dart טרי (${lines.length} צבעים · ${Object.keys(seed.files || {}).length} קבצים) · אפס ליטרלי-צבע באטומים (מלבד הפטורים המוצהרים)`); process.exit(0);
}
if (isMain) {
  fs.writeFileSync(TARGET, out);
  console.log(`🎨 ds-atoms: זרע ⇒ DsAtomColors (${lines.length} צבעים · ${Object.keys(seed.files || {}).length} קבצים) ⇒ ds_atoms.dart`);
}
