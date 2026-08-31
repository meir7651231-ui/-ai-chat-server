#!/usr/bin/env node
/** 🌌 מנוע-עיצוב 2 · ds-graphics — פלטה+גרדיאנטים → רקעים-גנרטיביים נוסחתיים (הכרעה 19).
 *  מחולל ds_graphics.dart: CustomPainter דטרמיניסטיים (אורורה/מֶש/גלים/רשת-נקודות/זוהר),
 *  כולם מושכים מ-DsGradient/DsTokens (דאטה) · params מוזרקים · shouldRepaint=false.
 *  שימוש: node machtzev/ds-graphics.mjs [--check] */
import fs from 'node:fs';
import path from 'node:path';
const DS = new URL('../new/dart-ui-bs/ds/', import.meta.url).pathname;
const CHECK = process.argv.includes('--check');

// כל רקע: שם · תיאור-עברי · גוף-paint (Canvas canvas, Size size) — משתמש בפלטה/גרדיאנטים
const bgs = [
  ['AuroraBg', 'רקע-אורורה נושם — גרדיאנט-אורורה + הילות רכות',
    `final rect = Offset.zero & size;
    canvas.drawRect(rect, Paint()..shader = DsGradient.aurora.createShader(rect));
    for (var i = 0; i < 3; i++) {
      final c = Offset(size.width * (0.2 + i * 0.3), size.height * (0.3 + (i.isEven ? 0.1 : -0.1)));
      canvas.drawCircle(c, size.width * 0.22, Paint()..color = Colors.white.withValues(alpha: 0.06)..maskFilter = const MaskFilter.blur(BlurStyle.normal, 40));
    }`],
  ['MeshBg', 'רקע-מֶש — שלוש כתמי-גרדיאנט רדיאליים',
    `final rect = Offset.zero & size;
    canvas.drawRect(rect, Paint()..color = DsTokens.bg);
    const cols = [DsTokens.accent, Color(0xFF6366F1), DsTokens.success];
    for (var i = 0; i < cols.length; i++) {
      final c = Offset(size.width * (0.25 + i * 0.28), size.height * (i.isEven ? 0.28 : 0.66));
      final r = size.width * 0.4;
      canvas.drawCircle(c, r, Paint()..shader = RadialGradient(colors: [cols[i].withValues(alpha: 0.22), cols[i].withValues(alpha: 0.0)]).createShader(Rect.fromCircle(center: c, radius: r)));
    }`],
  ['WaveBg', 'רקע-גלים — פס-גל תחתון בגרדיאנט-מבטא',
    `final rect = Offset.zero & size;
    final p = Path()..moveTo(0, size.height * 0.7);
    p.quadraticBezierTo(size.width * 0.25, size.height * 0.6, size.width * 0.5, size.height * 0.72);
    p.quadraticBezierTo(size.width * 0.75, size.height * 0.84, size.width, size.height * 0.7);
    p.lineTo(size.width, size.height);
    p.lineTo(0, size.height);
    p.close();
    canvas.drawPath(p, Paint()..shader = DsGradient.accent.createShader(rect));`],
  ['DotGridBg', 'רקע-רשת-נקודות — נקודות עדינות בריווח-קבוע',
    `canvas.drawRect(Offset.zero & size, Paint()..color = DsTokens.bg);
    final dot = Paint()..color = DsTokens.line;
    const gap = 24.0;
    for (var x = gap; x < size.width; x += gap) {
      for (var y = gap; y < size.height; y += gap) {
        canvas.drawCircle(Offset(x, y), 1.4, dot);
      }
    }`],
  ['GlowBg', 'רקע-זוהר — הילת-מבטא רדיאלית יחידה מלמעלה',
    `canvas.drawRect(Offset.zero & size, Paint()..color = DsTokens.bg);
    final c = Offset(size.width * 0.5, size.height * 0.1);
    final r = size.width * 0.7;
    canvas.drawCircle(c, r, Paint()..shader = RadialGradient(colors: [DsTokens.accent.withValues(alpha: 0.18), DsTokens.accent.withValues(alpha: 0.0)]).createShader(Rect.fromCircle(center: c, radius: r)));`],
];

const bgWidget = ([name, he, body]) =>
  `// ── ${he} ──
class ${name} extends StatelessWidget {
  const ${name}({this.height = 220, super.key});
  final double height;
  @override
  Widget build(BuildContext context) => SizedBox(
        height: height,
        width: double.infinity,
        child: CustomPaint(painter: _${name}Painter()),
      );
}

class _${name}Painter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    ${body}
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}`;

const out = `// ✨ מאגר-העיצוב · רקעים-גנרטיביים (Graphics) — **מחולל ע"י machtzev/ds-graphics.mjs.**
// אל תערוך ידנית. CustomPainter דטרמיניסטיים המושכים מהפלטה/הגרדיאנטים (דאטה, הכרעה 19).
// material בלבד; shouldRepaint=false (רקע-סטטי); height מוזרק.
import 'package:flutter/material.dart';
import 'ds.dart';
import 'ds_scale.dart';

${bgs.map(bgWidget).join('\n\n')}
`;

const target = path.join(DS, 'ds_graphics.dart');
if (CHECK) {
  if (!(fs.existsSync(target) && fs.readFileSync(target, 'utf8') === out)) { console.error('🚨 ds_graphics.dart אינו-טרי — הרץ node machtzev/ds-graphics.mjs'); process.exit(1); }
  console.log('✓ ds-graphics: טרי'); process.exit(0);
}
fs.writeFileSync(target, out);
console.log(`🌌 ds-graphics: ${bgs.length} רקעים-גנרטיביים ⇒ ds_graphics.dart`);
