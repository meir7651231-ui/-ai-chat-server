// ✨ NeonBars — עמודות אופקיות גרדיאנט-ניאון מנורמלות-למקסימום + ערך טבלאי
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class NeonBars extends StatelessWidget {
  NeonBars({super.key, required this.labels, required this.values, this.tone = 0});

  final List<String> labels;
  final List<double> values;
  final int tone; // 0=ניאון(ברירת-מחדל, ביט-זהה) · 1=success · 2=danger · 3=warning — פיגמנט מוזרק (חוק-6)

  static const _bg0 = DsAtomColors.premiumDatavizNeonBars1;

  static Color _bg(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizNeonBars1, (l) => l.card);   // לובש עור · _bg0 = הערך-הכהה
  static const _track0 = DsAtomColors.premiumDatavizNeonBars2;
  static Color _track(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizNeonBars2, (l) => l.track);   // לובש עור · _track0 = הערך-הכהה
  static const _cyan0 = DsAtomColors.premiumDatavizNeonBars3;
  static Color _cyan(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizNeonBars3, (l) => l.success);   // לובש עור · _cyan0 = הערך-הכהה
  static const _violet0 = DsAtomColors.premiumDatavizNeonBars4;
  static Color _violet(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizNeonBars4, (l) => l.accent);   // לובש עור · _violet0 = הערך-הכהה
  static const _magenta0 = DsAtomColors.premiumDatavizNeonBars5;
  static Color _magenta(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizNeonBars5, (l) => l.accentDark);   // לובש עור · _magenta0 = הערך-הכהה
  static const _ink0 = DsAtomColors.premiumDatavizNeonBars6;
  static Color _ink(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizNeonBars6, (l) => l.chipBg);   // לובש עור · _ink0 = הערך-הכהה
  static const _mute0 = DsAtomColors.premiumDatavizNeonBars7;
  static Color _mute(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizNeonBars7, (l) => l.muted);   // לובש עור · _mute0 = הערך-הכהה

  // גרדיאנטי-tone לפס-המילוי — הצבע מגיב-למצב במקום קשיח.
  static List<List<Color>> tones = [
    [_cyan0, _violet0, _magenta0],                                       // 0 ניאון
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
          color: _bg(context),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: dsWear(context, DsAtomColors.premiumDatavizNeonBars17, (l) => l.onAccent).withValues(alpha: 0.06)),
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
                  style: TextStyle(
                    color: NeonBars._mute(context),
                    fontSize: 12.5,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.2,
                  ),
                ),
              ),
              Text(
                _fmt(value),
                style: TextStyle(
                  color: NeonBars._ink(context),
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
                    color: NeonBars._track(context),
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
