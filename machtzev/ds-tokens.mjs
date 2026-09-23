#!/usr/bin/env node
/** 🎨 מנוע-עיצוב 1 · ds-tokens — זרע→מערכת-טוקנים מלאה (הכרעה 19: זרע=דאטה, מנוע=נוסחה עיוורת).
 *  קורא new/dart-ui-bs/ds/design-seed.json ומחולל דטרמיניסטית את ds_scale.dart:
 *  DsType (סולם בסיס×יחס) · DsSpace (רשת) · DsRadii · DsElev (ראמפת-צל) · DsGradient
 *  (זוגות-פלטה) · DsMotion · DsDark (טרנספורם-מהבהיר). אפס-Date.now · אפס-Dart-ידני.
 *  שימוש: node machtzev/ds-tokens.mjs [--check]   (--check: מוודא ש-ds_scale.dart טרי, יציאה-1 אם לא) */
import fs from 'node:fs';
import path from 'node:path';
const DS = new URL('../new/dart-ui-bs/ds/', import.meta.url).pathname;
const seed = JSON.parse(fs.readFileSync(path.join(DS, 'design-seed.json'), 'utf8'));
const CHECK = process.argv.includes('--check');

// ── עזרי-צבע (טהורים, דטרמיניסטיים) ──
const hx = (h) => [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
const toHex = (r, g, b) => [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0').toUpperCase()).join('');
const scaleRgb = (hex, f) => { const [r, g, b] = hx(hex); return toHex(r * f, g * f, b * f); };          // כהוי/הבהרה ליניארי
const mix = (a, b, t) => { const A = hx(a), B = hx(b); return toHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); };
const argb = (aa, hex) => `Color(0x${aa}${hex})`;                                                          // Dart Color עם אלפא
const P = seed.palette;

// ── טיפוגרפיה: בסיס×יחס^n, מעוגל לחצי-נקודה ──
const R = seed.typeRatio, B = seed.typeBase;
const sz = (n) => Math.max(11, Math.round(B * Math.pow(R, n) * 2) / 2);   // רצפת-a11y 11px (design-judge)
const type = [
  ['display', sz(3), 'w800', 1.12, -0.5, 'ink'],
  ['title', sz(2), 'w700', 1.2, -0.3, 'ink'],
  ['subtitle', sz(1), 'w600', 1.3, 0, 'ink'],
  ['body', sz(0), 'w500', 1.45, 0, 'ink'],
  ['bodyMuted', sz(0), 'w500', 1.45, 0, 'muted'],
  ['caption', sz(-1), 'w500', 1.35, 0, 'muted'],
  ['label', sz(-2), 'w700', 1.2, 0.4, 'faint'],
];
const tStyle = ([name, size, w, h, ls, col]) =>
  `  static const ${name} = TextStyle(fontSize: ${size}, fontWeight: FontWeight.${w}, height: ${h}${ls ? `, letterSpacing: ${ls}` : ''}, color: DsTokens.${col});`;

// ── מרווחים: רשת × [1,2,3,4,6,8,12] ──
const g = seed.gridUnit;
const space = [['xs', g], ['sm', g * 2], ['md', g * 3], ['lg', g * 4], ['xl', g * 6], ['xxl', g * 8], ['huge', g * 12]];

// ── רדיוסים: בסיס × [1, 1.5, 2, 2.75] + pill ──
const rb = seed.radiusBase;
const radii = [['sm', rb], ['md', rb * 1.5], ['lg', rb * 2], ['xl', Math.round(rb * 2.75)], ['pill', 999]];

// ── הגבהות: ראמפת-צל e0..e4 (אלפא/blur/offset עולים בנוסחה) ──
const et = seed.elevTint;
const elev = [0, 1, 2, 3, 4].map(lvl => {
  if (lvl === 0) return `  static const List<BoxShadow> e0 = [];`;
  const a1 = (0x0A + lvl * 5).toString(16).padStart(2, '0').toUpperCase();
  const a2 = (0x08 + lvl * 3).toString(16).padStart(2, '0').toUpperCase();
  const blur1 = 2 * lvl * lvl, y1 = lvl * lvl, blur2 = lvl + 1, y2 = Math.max(1, lvl - 1);
  return `  static const List<BoxShadow> e${lvl} = [\n    BoxShadow(color: ${argb(a1, et)}, blurRadius: ${blur1}, offset: Offset(0, ${y1})),\n    BoxShadow(color: ${argb(a2, et)}, blurRadius: ${blur2}, offset: Offset(0, ${y2})),\n  ];`;
});

// ── גרדיאנטים: accent (פלטה) + זוגות-hue מהזרע ──
const grad = (name, cols, begin = 'topLeft', end = 'bottomRight') =>
  `  static const ${name} = LinearGradient(begin: Alignment.${begin}, end: Alignment.${end}, colors: [${cols.map(c => `Color(0xFF${c})`).join(', ')}]);`;
const gradients = [
  grad('accent', [P.accent, scaleRgb(P.accent, 0.86)]),
  ...Object.entries(seed.gradientHues).map(([n, cols]) => grad(n, cols, n === 'aurora' ? 'topCenter' : 'topLeft', n === 'aurora' ? 'bottomCenter' : 'bottomRight')),
];

// ── מצב-כהה: טרנספורם דטרמיניסטי מהבהיר — הבסיסים והיחסים מהזרע (seed.dark); היו קשיחים כאן (הכרעת-בעלים 23.9: «לא קשיח, לא דעה קדומה») ──
const D = seed.dark;
const dark = {
  bg: D.bg, card: D.card, ink: D.ink,
  muted: mix(P.muted, 'FFFFFF', D.mutedMix), faint: mix(P.faint, D.bg, D.faintMix),
  line: D.line, accent: mix(P.accent, 'FFFFFF', D.accentMix), accentDark: P.accent,
  success: mix(P.success, 'FFFFFF', D.successMix),
};
const shadowRow = (tint) => ([a, blur, dy]) => `BoxShadow(color: ${argb(a, tint)}, blurRadius: ${blur}, offset: Offset(0, ${dy}))`;

// ── זהות-הניאון (seed.identity): הצבעים שישבו ביד בתוך ds.dart ⇒ DsIdentity. המנוע עיוור: פולט מה שבזרע, בסדר קבוע ──
const I = seed.identity;
const c = (v) => Array.isArray(v) ? argb(v[0], v[1]) : `Color(0xFF${v})`;
const identity = [
  `  static const accentSoft = ${c(I.accentSoft)};`,
  `  static const magenta = ${c(I.magenta)};`,
  `  static const cyan = ${c(I.cyan)};`,
  `  static const success = ${c(I.success)};`,
  `  static const successSoft = ${c(I.successSoft)};`,
  `  static const List<Color> inkGrad = [${I.inkGrad.map((h) => `Color(0xFF${h})`).join(', ')}];`,
  `  static const List<BoxShadow> shadowSm = [${I.shadowSm.map(shadowRow(I.shadowTint)).join(', ')}];`,
  `  static const List<BoxShadow> shadow = [${I.shadow.map(shadowRow(I.shadowTint)).join(', ')}];`,
  `  static const List<BoxShadow> shadowLg = [${I.shadowLg.map(shadowRow(I.shadowTint)).join(', ')}];`,
  `  static const List<BoxShadow> glow = [${I.glow.map(([a, h, blur, dy]) => `BoxShadow(color: ${argb(a, h)}, blurRadius: ${blur}, offset: Offset(0, ${dy}))`).join(', ')}];`,
  `  static const List<Color> scaffoldGlow = [${I.scaffoldGlow.map(c).join(', ')}];`,
  `  static const List<Color> tones = [${I.tones.map(c).join(', ')}];`,
  `  static const warn = ${c(I.warn)};`,
  `  static const List<Color> panelGrad = [${I.panelGrad.map(c).join(', ')}];`,
  `  static const List<Color> cardGrad = [${I.cardGrad.map(c).join(', ')}];`,
  `  static const hairline = ${c(I.hairline)};`,
  `  static const chipBorderSuccess = ${c(I.chipBorderSuccess)};`,
  `  static const chipBorderAccent = ${c(I.chipBorderAccent)};`,
  `  static const statGlyphBorder = ${c(I.statGlyphBorder)};`,
  `  static const lookWarn = ${c(I.lookWarn)};`,
  `  static const danger = ${c(I.danger)};`,
  `  static const dangerSoft = ${c(I.dangerSoft)};`,
  `  static const dangerLine = ${c(I.dangerLine)};`,
  `  static const chipBg = ${c(I.chipBg)};`,
  `  static const barGlow = ${c(I.barGlow)};`,
  `  static const graphMid = ${c(I.graphMid)};`,
  `  static const graphHalo = ${c(I.graphHalo)};`,
  `  static const surfaceHi = ${c(I.surfaceHi)};`,
];

const out = `// ✨ מאגר-העיצוב · סקאלות-טוקנים (Design Tokens) — **מחולל ע"י machtzev/ds-tokens.mjs מ-design-seed.json.**
// אל תערוך ידנית: שנה את הזרע והרץ את המנוע. הכרעה 17 (מראה-רצוי) + 19 (טוקן=דאטה). material בלבד.
import 'package:flutter/material.dart';
import 'ds.dart';

// ── טיפוגרפיה · סולם בסיס×יחס (display→label) ──
class DsType {
${type.map(tStyle).join('\n')}
  static const numeric = TextStyle(fontSize: ${sz(1)}, fontWeight: FontWeight.w800, height: 1.1, fontFeatures: [FontFeature.tabularFigures()], color: DsTokens.ink);
}

// ── מרווחים · רשת ${g} נקודות ──
class DsSpace {
${space.map(([n, v]) => `  static const ${n} = ${v}.0;`).join('\n')}
}

// ── רדיוסים · דרגות ──
class DsRadii {
${radii.map(([n, v]) => `  static const ${n} = ${v}.0;`).join('\n')}
}

// ── הגבהות · ראמפת-צל e0→e4 ──
class DsElev {
${elev.join('\n')}
}

// ── גרדיאנטים · ספרייה נקובה ──
class DsGradient {
${gradients.join('\n')}
}

// ── מוֹשֶׁן · משכים + עקומות ──
class DsMotion {
  static const Duration fast = Duration(milliseconds: ${seed.motion.fast});
  static const Duration base = Duration(milliseconds: ${seed.motion.base});
  static const Duration slow = Duration(milliseconds: ${seed.motion.slow});
  static const Duration ambient = Duration(milliseconds: ${seed.motion.ambient});
  static const Curve standard = Curves.easeOutCubic;
  static const Curve emphasized = Cubic(0.2, 0.0, 0.0, 1.0);
  static const Curve decelerate = Curves.easeOut;
  static const Curve spring = Cubic(0.34, 1.56, 0.64, 1.0);
}

// ── מצב-כהה · פלטה-מקבילה (טרנספורם-מהבהיר) ──
class DsDark {
  static const bg = Color(0xFF${dark.bg});
  static const card = Color(0xFF${dark.card});
  static const ink = Color(0xFF${dark.ink});
  static const muted = Color(0xFF${dark.muted});
  static const faint = Color(0xFF${dark.faint});
  static const line = Color(0xFF${dark.line});
  static const accent = Color(0xFF${dark.accent});
  static const accentDark = Color(0xFF${dark.accentDark});
  static const success = Color(0xFF${dark.success});
  static const List<BoxShadow> shadow = [
${D.shadow.map((s) => '    ' + shadowRow(I.shadowTint)(s) + ',').join('\n')}
  ];
}

// ── זהות-הניאון · מהזרע (seed.identity) — ds.dart מפנה לכאן במקום צבעים כתובים ביד (הכרעת-בעלים 23.9) ──
class DsIdentity {
${identity.join('\n')}
}
`;

const target = path.join(DS, 'ds_scale.dart');
if (CHECK) {
  const cur = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
  if (cur !== out) { console.error('🚨 ds_scale.dart אינו-טרי — הרץ node machtzev/ds-tokens.mjs (הזרע השתנה?)'); process.exit(1); }
  console.log('✓ ds-tokens: ds_scale.dart טרי (תואם-זרע)'); process.exit(0);
}
fs.writeFileSync(target, out);
console.log(`🎨 ds-tokens: זרע ⇒ 7 מחלקות-טוקן (${type.length + 1} טיפו · ${space.length} מרווח · ${radii.length} רדיוס · 5 הגבהות · ${gradients.length} גרדיאנט · כהה) ⇒ ds_scale.dart`);
