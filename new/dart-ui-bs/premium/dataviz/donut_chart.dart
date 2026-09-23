// ✨ DonutChart — טבעת-דונאט מפולחת פלטת-ניאון + סכום במרכז (CustomPainter)
import 'dart:math' as math;
import 'dart:ui';
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class DonutChart extends StatelessWidget {
  DonutChart({super.key, required this.values, this.size = 176});

  final List<double> values;
  final double size;

  static List<Color> palette = [
    DsAtomColors.premiumDatavizDonutChart1,
    DsAtomColors.premiumDatavizDonutChart2,
    DsAtomColors.premiumDatavizDonutChart3,
    DsAtomColors.premiumDatavizDonutChart4,
    DsAtomColors.premiumDatavizDonutChart5,
    DsAtomColors.premiumDatavizDonutChart6,
  ];

  @override
  Widget build(BuildContext context) {
    double total = 0;
    for (final v in values) {
      if (v > 0) total += v;
    }
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          CustomPaint(size: Size.square(size), painter: _DonutPainter(values)),
          ShaderMask(
            shaderCallback: (r) => LinearGradient(
              colors: [dsWear(context, DsAtomColors.premiumDatavizDonutChart1, (l) => l.success), dsWear(context, DsAtomColors.premiumDatavizDonutChart3, (l) => l.accentDark)],
            ).createShader(r),
            child: Text(
              _fmt(total),
              style: TextStyle(
                color: dsWear(context, DsAtomColors.premiumDatavizDonutChart7, (l) => l.onAccent),
                fontSize: size * 0.19,
                fontWeight: FontWeight.w900,
                letterSpacing: -1.5,
                height: 1,
                fontFeatures: const [FontFeature.tabularFigures()],
              ),
            ),
          ),
        ],
      ),
    );
  }

  static String _fmt(double v) {
    if (v >= 1000000) return '${(v / 1000000).toStringAsFixed(1)}M';
    if (v >= 1000) return '${(v / 1000).toStringAsFixed(1)}K';
    if (v == v.roundToDouble()) return v.toStringAsFixed(0);
    return v.toStringAsFixed(1);
  }
}

class _DonutPainter extends CustomPainter {
  _DonutPainter(this.values);

  final List<double> values;

  static const _track0 = DsAtomColors.premiumDatavizDonutChart8;

  static Color _track(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizDonutChart8, (l) => l.track);   // לובש עור · _track0 = הערך-הכהה

  @override
  void paint(Canvas canvas, Size size) {
    final Offset c = size.center(Offset.zero);
    final double stroke = size.width * 0.15;
    final double r = (size.width - stroke) / 2;
    final Rect box = Rect.fromCircle(center: c, radius: r);

    canvas.drawCircle(
      c,
      r,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = stroke
        ..color = _track0,
    );

    double total = 0;
    for (final v in values) {
      if (v > 0) total += v;
    }
    if (total <= 0) return;

    const double gap = 0.045; // רווח בין פלחים ברדיאנים
    double a = -math.pi / 2;
    for (int i = 0; i < values.length; i++) {
      final double v = values[i];
      if (v <= 0) continue;
      final double sweep = (v / total) * (2 * math.pi);
      final double drawSweep = math.max(sweep - gap, 0.01);
      final Color col = DonutChart.palette[i % DonutChart.palette.length];

      canvas.drawArc(
        box,
        a + gap / 2,
        drawSweep,
        false,
        Paint()
          ..style = PaintingStyle.stroke
          ..strokeWidth = stroke
          ..strokeCap = StrokeCap.round
          ..color = col.withValues(alpha: 0.55)
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 6),
      );
      canvas.drawArc(
        box,
        a + gap / 2,
        drawSweep,
        false,
        Paint()
          ..style = PaintingStyle.stroke
          ..strokeWidth = stroke
          ..strokeCap = StrokeCap.round
          ..color = col,
      );
      a += sweep;
    }
  }

  @override
  bool shouldRepaint(covariant _DonutPainter old) => old.values != values;
}
