#!/usr/bin/env node
/** 🃏 מנוע-עיצוב 4 · ds-variants — מטריצת-סגנון → וריאנטי-משטח (הכרעה 19: מטריצה=דאטה).
 *  מחולל ds_surface.dart: לכל תא-מטריצה (מוגבה/מתאר/זכוכית/גרדיאנט) עוטף-כרטיס עוטף child
 *  בעיצוב מטוקני-DsTokens/DsElev/DsGradient/DsRadii/DsSpace. הווידג'ט עיוור, העיצוב דאטה.
 *  שימוש: node machtzev/ds-variants.mjs [--check] */
import fs from 'node:fs';
import path from 'node:path';
const DS = new URL('../new/dart-ui-bs/ds/', import.meta.url).pathname;
const CHECK = process.argv.includes('--check');

// מטריצת-הסגנון (הזרע): שם · תיאור-עברי · גוף-build (משתמש ב-p=padding, child)
const variants = [
  ['DsCardElevated', 'כרטיס-מוגבה — משטח לבן, צל-e2, פינות-lg (ברירת-המחדל)',
    `Container(
        padding: const EdgeInsets.all(DsSpace.lg),
        decoration: BoxDecoration(
          color: DsTokens.card,
          borderRadius: BorderRadius.circular(DsRadii.lg),
          boxShadow: DsElev.e2,
        ),
        child: child,
      )`],
  ['DsCardOutlined', 'כרטיס-מתאר — קו-גבול עדין, בלי-צל, שטוח',
    `Container(
        padding: const EdgeInsets.all(DsSpace.lg),
        decoration: BoxDecoration(
          color: DsTokens.card,
          borderRadius: BorderRadius.circular(DsRadii.lg),
          border: Border.all(color: DsTokens.line),
        ),
        child: child,
      )`],
  ['DsCardGlass', 'כרטיס-זכוכית — שקיפות+טשטוש-רקע, מסגרת-אור (glassmorphism)',
    `ClipRRect(
        borderRadius: BorderRadius.circular(DsRadii.lg),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
          child: Container(
            padding: const EdgeInsets.all(DsSpace.lg),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.55),
              borderRadius: BorderRadius.circular(DsRadii.lg),
              border: Border.all(color: Colors.white.withValues(alpha: 0.5)),
            ),
            child: child,
          ),
        ),
      )`],
  ['DsCardGradient', 'כרטיס-גרדיאנט — רקע גרדיאנט-מבטא, טקסט-בהיר',
    `Container(
        padding: const EdgeInsets.all(DsSpace.lg),
        decoration: BoxDecoration(
          gradient: DsGradient.accent,
          borderRadius: BorderRadius.circular(DsRadii.lg),
          boxShadow: DsElev.e2,
        ),
        child: DefaultTextStyle.merge(style: const TextStyle(color: Colors.white), child: child),
      )`],
];

const vWidget = ([name, he, body]) =>
  `// ── ${he} ──
class ${name} extends StatelessWidget {
  const ${name}({required this.child, super.key});
  final Widget child;
  @override
  Widget build(BuildContext context) => ${body};
}`;

const out = `// ✨ מאגר-העיצוב · וריאנטי-משטח (Surface Variants) — **מחולל ע"י machtzev/ds-variants.mjs.**
// אל תערוך ידנית. כל וריאנט עוטף child בעיצוב מטוקני-הליבה (הכרעה 19: מטריצה=דאטה).
// material בלבד; המחולל בוחר סגנון לפי "המראה שאני רוצה" (הכרעה 17).
import 'dart:ui' show ImageFilter;
import 'package:flutter/material.dart';
import 'ds.dart';
import 'ds_scale.dart';

${variants.map(vWidget).join('\n\n')}
`;

const target = path.join(DS, 'ds_surface.dart');
if (CHECK) {
  if (!(fs.existsSync(target) && fs.readFileSync(target, 'utf8') === out)) { console.error('🚨 ds_surface.dart אינו-טרי — הרץ node machtzev/ds-variants.mjs'); process.exit(1); }
  console.log('✓ ds-variants: טרי'); process.exit(0);
}
fs.writeFileSync(target, out);
console.log(`🃏 ds-variants: ${variants.length} וריאנטי-משטח ⇒ ds_surface.dart`);
