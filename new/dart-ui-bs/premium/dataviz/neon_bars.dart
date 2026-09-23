// ✨ NeonBars — עמודות אופקיות גרדיאנט-ניאון מנורמלות-למקסימום + ערך טבלאי
import 'package:flutter/material.dart';
import '../../ds/ds_atoms.dart';

class NeonBars extends StatelessWidget {
  const NeonBars({super.key, required this.labels, required this.values, this.tone = 0});

  final List<String> labels;
  final List<double> values;
  final int tone; // 0=ניאון(ברירת-מחדל, ביט-זהה) · 1=success · 2=danger · 3=warning — פיגמנט מוזרק (חוק-6)

  static const Color _bg = DsAtomColors.premiumDatavizNeonBars1;
  static const Color _track = DsAtomColors.premiumDatavizNeonBars2;
  static const Color _cyan = DsAtomColors.premiumDatavizNeonBars3;
  static const Color _violet = DsAtomColors.premiumDatavizNeonBars4;
  static const Color _magenta = DsAtomColors.premiumDatavizNeonBars5;
  static const Color _ink = DsAtomColors.premiumDatavizNeonBars6;
  static const Color _mute = DsAtomColors.premiumDatavizNeonBars7;

  // גרדיאנטי-tone לפס-המילוי — הצבע מגיב-למצב במקום קשיח.
  static const List<List<Color>> tones = [
    [_cyan, _violet, _magenta],                                       // 0 ניאון
    [DsAtomColors.premiumDatavizNeonBars8, DsAtomColors.premiumDatavizNeonBars9, DsAtomColors.premiumDatavizNeonBars10],        // 1 success
    [DsAtomColors.premiumDatavizNeonBars11, DsAtomColors.premiumDatavizNeonBars12, DsAtomColors.premiumDatavizNeonBars13],        // 2 danger
    [DsAtomColors.premiumDatavizNeonBars14, DsAtomColors.premiumDatavizNeonBars15, DsAtomColors.premiumDatavizNeonBars16],        // 3 warning
  ];

  @override
  Widget build(BuildContext context) {
    final int n = labels.length < values.length ? labels.length : values.length;
    double maxV = 0;
    for (int i = 0; i < n; i++) {
      if (values[i] > maxV) maxV = values[i];
    }
    if (maxV <= 0) maxV = 1;

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        decoration: BoxDecoration(
          color: _bg,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: DsAtomColors.premiumDatavizNeonBars17.withValues(alpha: 0.06)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            for (int i = 0; i < n; i++)
              Padding(
                padding: EdgeInsets.only(bottom: i == n - 1 ? 0 : 16),
                child: _Row(
                  label: labels[i],
                  value: values[i],
                  fraction: (values[i] / maxV).clamp(0.0, 1.0),
                  tone: tone,
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _Row extends StatelessWidget {
  const _Row({required this.label, required this.value, required this.fraction, this.tone = 0});

  final String label;
  final double value;
  final double fraction;
  final int tone;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 7),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: NeonBars._mute,
                    fontSize: 12.5,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.2,
                  ),
                ),
              ),
              Text(
                _fmt(value),
                style: const TextStyle(
                  color: NeonBars._ink,
                  fontSize: 13.5,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.4,
                  fontFeatures: [FontFeature.tabularFigures()],
                ),
              ),
            ],
          ),
        ),
        LayoutBuilder(
          builder: (context, c) {
            final double w = c.maxWidth * fraction;
            return Stack(
              children: [
                Container(
                  height: 12,
                  decoration: BoxDecoration(
                    color: NeonBars._track,
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                Container(
                  height: 12,
                  width: w < 12 ? 12 : w,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(8),
                    gradient: LinearGradient(
                      colors: NeonBars.tones[tone % NeonBars.tones.length],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: NeonBars.tones[tone % NeonBars.tones.length][1].withValues(alpha: 0.55),
                        blurRadius: 14,
                        spreadRadius: -2,
                      ),
                      BoxShadow(
                        color: NeonBars.tones[tone % NeonBars.tones.length][0].withValues(alpha: 0.35),
                        blurRadius: 8,
                        offset: const Offset(0, 0),
                      ),
                    ],
                  ),
                ),
              ],
            );
          },
        ),
      ],
    );
  }

  static String _fmt(double v) {
    if (v == v.roundToDouble()) return v.toStringAsFixed(0);
    return v.toStringAsFixed(1);
  }
}
