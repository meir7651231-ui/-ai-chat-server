#!/usr/bin/env node
/** 🎬 מנוע-עיצוב 3 · ds-motion — מפרט-presets → עוטפי-מוֹשֶׁן גנריים (הכרעה 19: מפרט=דאטה,
 *  מנוע=נוסחה). מחולל ds_anim.dart: עוטף כל child במוֹשֶׁן-כניסה (הופעה/החלקה/הגדלה/החלקה-צד/
 *  בלוב-מלמטה) דרך TweenAnimationBuilder (חד-שוט, בטוח, בלי controller). משתמש ב-DsMotion.
 *  + motion-map.json (כוונה→preset/אטום-קיים). דטרמיניסטי · אפס-Dart-ידני.
 *  שימוש: node machtzev/ds-motion.mjs [--check] */
import fs from 'node:fs';
import path from 'node:path';
const DS = new URL('../new/dart-ui-bs/ds/', import.meta.url).pathname;
const CHECK = process.argv.includes('--check');

// מפרט-ה-presets (הזרע): שם · תיאור-עברי · ביטוי-בנייה מ-v∈[0,1] (0=התחלה,1=סוף)
const presets = [
  ['FadeInView', 'הופעה עדינה (opacity 0→1) — מוֹשֶׁן-כניסה לכל תוכן', 'Opacity(opacity: v, child: ch)'],
  ['SlideUpView', 'החלקה מלמטה-למעלה — כניסת-כרטיס/שורה', 'Transform.translate(offset: Offset(0, (1 - v) * 16), child: Opacity(opacity: v, child: ch))'],
  ['ScaleInView', 'הגדלה עדינה (0.92→1) — הופעת-כפתור/אייקון', 'Transform.scale(scale: 0.92 + v * 0.08, child: Opacity(opacity: v, child: ch))'],
  ['SlideInView', 'החלקה מהצד (RTL: ימין→שמאל) — כניסת-פריט-רשימה', 'Transform.translate(offset: Offset((1 - v) * 24, 0), child: Opacity(opacity: v, child: ch))'],
  ['RiseView', 'עלייה-מלמטה בולטת + הופעה — כניסת-הירו', 'Transform.translate(offset: Offset(0, (1 - v) * 40), child: Opacity(opacity: v, child: ch))'],
];
const widget = ([name, he, expr]) =>
  `// ── ${he} ──
class ${name} extends StatelessWidget {
  const ${name}({required this.child, this.duration = DsMotion.base, this.curve = DsMotion.standard, super.key});
  final Widget child;
  final Duration duration;
  final Curve curve;
  @override
  Widget build(BuildContext context) => TweenAnimationBuilder<double>(
        tween: Tween<double>(begin: 0, end: 1),
        duration: duration,
        curve: curve,
        builder: (context, v, ch) => ${expr},
        child: child,
      );
}`;

const out = `// ✨ מאגר-העיצוב · עוטפי-מוֹשֶׁן (Motion Presets) — **מחולל ע"י machtzev/ds-motion.mjs.**
// אל תערוך ידנית. עוטף כל child במוֹשֶׁן-כניסה חד-שוט (TweenAnimationBuilder, בלי controller).
// הכרעה 17 (מראה-רצוי) + 19 (מפרט=דאטה). material בלבד; מכבד duration/curve מוזרקים.
import 'package:flutter/material.dart';
import 'ds_scale.dart';

${presets.map(widget).join('\n\n')}
`;

// מפת-כוונה → preset/אטום (לאחזור ע"י nl.mjs/render-ds)
const motionMap = {
  '_': 'כוונת-מוֹשֶׁן → עוטף/אטום. presets=חד-שוט-כניסה (ds_anim); אטומי-repeat קיימים במדף.',
  entrance: { fade: 'FadeInView', slideUp: 'SlideUpView', scaleIn: 'ScaleInView', slideIn: 'SlideInView', rise: 'RiseView' },
  emphasis: { pulse: 'glow_pulse', shimmer: 'shimmer_skeleton', sweep: 'gradient_sweep' },
  he: { 'הופעה': 'FadeInView', 'החלקה': 'SlideUpView', 'הגדלה': 'ScaleInView', 'כניסה': 'SlideUpView', 'פעימה': 'glow_pulse', 'נצנוץ': 'shimmer_skeleton', 'הירו': 'RiseView' },
};

const dartFile = path.join(DS, 'ds_anim.dart');
const mapFile = path.join(DS, 'motion-map.json');
const mapStr = JSON.stringify(motionMap, null, 2) + '\n';
if (CHECK) {
  const okDart = fs.existsSync(dartFile) && fs.readFileSync(dartFile, 'utf8') === out;
  const okMap = fs.existsSync(mapFile) && fs.readFileSync(mapFile, 'utf8') === mapStr;
  if (!okDart || !okMap) { console.error('🚨 ds_anim.dart/motion-map.json אינם-טריים — הרץ node machtzev/ds-motion.mjs'); process.exit(1); }
  console.log('✓ ds-motion: טרי'); process.exit(0);
}
fs.writeFileSync(dartFile, out);
fs.writeFileSync(mapFile, mapStr);
console.log(`🎬 ds-motion: ${presets.length} עוטפי-מוֹשֶׁן ⇒ ds_anim.dart + motion-map.json (כוונה→preset)`);
