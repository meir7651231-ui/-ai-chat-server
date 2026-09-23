// ✨ Sparkline — קו-מגמה זעיר עם מילוי-גרדיאנט ונקודת-קצה מודגשת (CustomPainter)
import 'dart:ui';
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class Sparkline extends StatelessWidget {
  const Sparkline({super.key, required this.values, this.height = 56});

  final List<double> values;
  final double height;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      child: CustomPaint(
        painter: _SparkPainter(values),
        size: Size.infinite,
      ),
    );
  }
}

class _SparkPainter extends CustomPainter {
  _SparkPainter(this.values);

  final List<double> values;

  static const _cyan0 = DsAtomColors.premiumDatavizSparkline1;

  static Color _cyan(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizSparkline1, (l) => l.success);   // לובש עור · _cyan0 = הערך-הכהה
  static const _violet0 = DsAtomColors.premiumDatavizSparkline2;
  static Color _violet(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizSparkline2, (l) => l.accent);   // לובש עור · _violet0 = הערך-הכהה
  static const _magenta0 = DsAtomColors.premiumDatavizSparkline3;
  static Color _magenta(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizSparkline3, (l) => l.accentDark);   // לובש עור · _magenta0 = הערך-הכהה

  @override
  void paint(Canvas canvas, Size size) {
    if (values.length < 2) return;

    double lo = values.first, hi = values.first;
    for (final v in values) {
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
    final double span = (hi - lo).abs() < 1e-9 ? 1 : (hi - lo);
    double pad = 5;
    final double h = size.height - pad * 2;
    final double dx = size.width / (values.length - 1);

    final List<Offset> pts = <Offset>[];
    for (int i = 0; i < values.length; i++) {
      final double t = (values[i] - lo) / span;
      pts.add(Offset(i * dx, pad + (1 - t) * h));
    }

    final Path line = Path()..moveTo(pts.first.dx, pts.first.dy);
    for (int i = 1; i < pts.length; i++) {
      final Offset p0 = pts[i - 1];
      final Offset p1 = pts[i];
      final double mx = (p0.dx + p1.dx) / 2;
      line.cubicTo(mx, p0.dy, mx, p1.dy, p1.dx, p1.dy);
    }

    final Rect rect = Offset.zero & size;
    Gradient grad = LinearGradient(
      colors: [_cyan0, _violet0, _magenta0],
    );

    final Path fill = Path.from(line)
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();
    canvas.drawPath(
      fill,
      Paint()
        ..shader = LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [_violet0.withValues(alpha: 0.28), _violet0.withValues(alpha: 0.0)],
        ).createShader(rect),
    );

    final Paint glow = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 6
      ..strokeCap = StrokeCap.round
      ..shader = grad.createShader(rect)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 6);
    canvas.drawPath(line, glow);

    final Paint stroke = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.4
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..shader = grad.createShader(rect);
    canvas.drawPath(line, stroke);

    final Offset end = pts.last;
    canvas.drawCircle(end, 8, Paint()..color = _magenta0.withValues(alpha: 0.28));
    canvas.drawCircle(end, 4.5, Paint()..color = _magenta0);
    canvas.drawCircle(end, 2, Paint()..color = DsAtomColors.premiumDatavizSparkline4);
  }

  @override
  bool shouldRepaint(covariant _SparkPainter old) => old.values != values;
}
