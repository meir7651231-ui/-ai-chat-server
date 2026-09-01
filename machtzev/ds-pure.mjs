#!/usr/bin/env node
/** 🎨 מנוע-עיצוב 6 · ds-pure — זרע→שפת-Pure כמנוע-Dart (שכבה B בארכיטקטורת-ההטמעה).
 *  קורא את אטום-הזרע new/atoms/pure-look.mjs (PURE_LOOK) ומחולל דטרמיניסטית את ds_pure.dart:
 *  DsPure (נייטרל+סמנטי קבועים · שלוש ערכות-אקצנט מורפות) + DsPureTheme + themeOf().
 *  דורמנטי לצד DsScale/DsDark — הזהות מוזרקת בחיווט (חוק-6), לא באטום. material בלבד.
 *  אימות: מוזרק ל-buildsmart/app_flutter/lib/genesis ⇒ CI genesis-compile מריץ flutter analyze.
 *  שימוש: node machtzev/ds-pure.mjs [--check]   (--check: מוודא ש-ds_pure.dart טרי, יציאה-1 אם לא) */
import fs from 'node:fs';
import path from 'node:path';
import { PURE_LOOK } from '../new/atoms/pure-look.mjs';

const DS = new URL('../new/dart-ui-bs/ds/', import.meta.url).pathname;
const CHECK = process.argv.includes('--check');

// ── המרת-צבע דטרמיניסטית: #RRGGBB / rgba() → Dart Color(0xAARRGGBB) ──
const hx2 = n => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0').toUpperCase();
function color(v) {
  if (v.startsWith('#')) return `Color(0xFF${v.slice(1).toUpperCase()})`;
  const m = v.match(/rgba?\(([^)]+)\)/);
  const [r, g, b, a = '1'] = m[1].split(',').map(s => s.trim());
  return `Color(0x${hx2(parseFloat(a) * 255)}${hx2(+r)}${hx2(+g)}${hx2(+b)})`;
}
// --a-hi→aHi · --a-800→a800 · --raised2→raised2 · --canvas→canvas
const camel = k => k.replace(/^--/, '').replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const ACCENT = ['--a-hi', '--a', '--a-800', '--gl', '--c2', '--c3'];
const themeEntry = (t) => `DsPureTheme(${ACCENT.map(k => `${camel(k)}: ${color(t[k])}`).join(', ')})`;

const neutral = Object.entries(PURE_LOOK.neutral).map(([k, v]) => `  static const ${camel(k)} = ${color(v)};`).join('\n');
const semantic = Object.entries(PURE_LOOK.semantic).map(([k, v]) => `  static const ${camel(k)} = ${color(v)};`).join('\n');
const themeIds = Object.keys(PURE_LOOK.themes);
const themeConsts = themeIds.map(id => `  static const ${camel(id.replace('t-', ''))} = ${themeEntry(PURE_LOOK.themes[id])};`).join('\n');
const themeMap = themeIds.map(id => `'${id}': ${camel(id.replace('t-', ''))}`).join(', ');
const def = PURE_LOOK.themes[PURE_LOOK.defaultTheme]; // קיצורי-אקצנט לברירת-המחדל (טוקנים דורמנטיים)

const out = `// ✨ מאגר-העיצוב · שפת-Pure (Layer B · הטמעה) — **מחולל ע"י machtzev/ds-pure.mjs מ-new/atoms/pure-look.mjs.**
// אל תערוך ידנית: שנה את הזרע (pure-look) והרץ את המנוע. נייטרל+סמנטי **קבועים**; אקצנט **מורף**
// פר-ערכה (${themeIds.join(' / ')}). דורמנטי לצד DsScale/DsDark — הזהות מוזרקת בחיווט (חוק-6). material בלבד.
import 'package:flutter/material.dart';

/// ערכת-אקצנט אחת — מורפת יחד בהחלפת-ערכה (חוק-5: האטום לא יודע איזו ערכה).
@immutable
class DsPureTheme {
  final Color aHi;
  final Color a;
  final Color a800;
  final Color gl;
  final Color c2;
  final Color c3;
  const DsPureTheme({
    required this.aHi,
    required this.a,
    required this.a800,
    required this.gl,
    required this.c2,
    required this.c3,
  });
}

/// שפת-Pure כטוקני-Dart. נייטרל+סמנטי קבועים; ${themeIds.length} ערכות-אקצנט; themeOf() = resolver.
class DsPure {
  // ── נייטרל · סולם-רקע/דיו/קו — לא מורף בהחלפת-ערכה ──
${neutral}

  // ── סמנטי · ok/warn/err/gold — קבוע (error נשאר אדום, gold נשאר זהב) ──
${semantic}

  // ── ערכות-אקצנט · מורפות יחד ──
${themeConsts}

  // ── קיצורי-אקצנט לברירת-המחדל (Color ישיר — לטוקנים דורמנטיים כמו BsPure) ──
  static const accentHi = ${color(def['--a-hi'])};
  static const accent = ${color(def['--a'])};
  static const accentDark = ${color(def['--a-800'])};

  static const String defaultTheme = '${PURE_LOOK.defaultTheme}';
  static const Map<String, DsPureTheme> themes = {${themeMap}};

  /// resolver-הערכה (מקביל ל-pure-resolve בצד-ה-JS): id→ערכה, נפילה לברירת-המחדל.
  static DsPureTheme themeOf(String id) => themes[id] ?? themes[defaultTheme]!;
}
`;

const target = path.join(DS, 'ds_pure.dart');
if (CHECK) {
  const cur = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
  if (cur !== out) { console.error('🚨 ds_pure.dart אינו-טרי — הרץ node machtzev/ds-pure.mjs (הזרע pure-look השתנה?)'); process.exit(1); }
  console.log('✓ ds-pure: ds_pure.dart טרי (תואם-זרע)'); process.exit(0);
}
fs.writeFileSync(target, out);
console.log(`🎨 ds-pure: זרע pure-look ⇒ DsPure (${Object.keys(PURE_LOOK.neutral).length} נייטרל · ${Object.keys(PURE_LOOK.semantic).length} סמנטי · ${themeIds.length} ערכות×6 אקצנט) ⇒ ds_pure.dart`);
