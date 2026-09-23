// ✨ TrendStat — ערך + תווית + צ׳יפ-מגמה (delta>0 ירוק↑ / <0 אדום↓)
import 'dart:ui';
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class TrendStat extends StatelessWidget {
  const TrendStat({
    super.key,
    required this.value,
    required this.delta,
    required this.label,
  });

  final String value;
  final double delta;
  final String label;

  static const _bg0 = DsAtomColors.premiumDatavizTrendStat1;

  static Color _bg(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizTrendStat1, (l) => l.cardAlt);   // לובש עור · _bg0 = הערך-הכהה
  static const _ink0 = DsAtomColors.premiumDatavizTrendStat2;
  static Color _ink(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizTrendStat2, (l) => l.chipBg);   // לובש עור · _ink0 = הערך-הכהה
  static const _mute0 = DsAtomColors.premiumDatavizTrendStat3;
  static Color _mute(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizTrendStat3, (l) => l.muted);   // לובש עור · _mute0 = הערך-הכהה
  static const _up0 = DsAtomColors.premiumDatavizTrendStat4;
  static Color _up(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizTrendStat4, (l) => l.success);   // לובש עור · _up0 = הערך-הכהה
  static const _down0 = DsAtomColors.premiumDatavizTrendStat5;
  static Color _down(BuildContext context) => dsWear(context, DsAtomColors.premiumDatavizTrendStat5, (l) => l.danger);   // לובש עור · _down0 = הערך-הכהה

  @override
  Widget build(BuildContext context) {
    final bool flat = delta == 0;
    final bool up = delta > 0;
    final Color accent = flat ? _mute(context) : (up ? _up(context) : _down(context));
    final String arrow = flat ? '→' : (up ? '↑' : '↓');
    final String pct = '${delta.abs().toStringAsFixed(1)}%';

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        decoration: BoxDecoration(
          color: _bg(context),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: dsWear(context, DsAtomColors.premiumDatavizTrendStat6, (l) => l.onAccent).withValues(alpha: 0.06)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              label,
              style: TextStyle(
                color: _mute(context),
                fontSize: 12,
                fontWeight: FontWeight.w600,
                letterSpacing: 0.3,
              ),
            ),
            const SizedBox(height: 10),
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  value,
                  style: TextStyle(
                    color: _ink(context),
                    fontSize: 30,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -1.4,
                    height: 1,
                    fontFeatures: [FontFeature.tabularFigures()],
                  ),
                ),
                const SizedBox(width: 10),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: accent.withValues(alpha: 0.14),
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(color: accent.withValues(alpha: 0.4)),
                  ),
                  child: Text(
                    '$arrow $pct',
                    textDirection: TextDirection.ltr,
                    style: TextStyle(
                      color: accent,
                      fontSize: 12.5,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -0.2,
                      fontFeatures: const [FontFeature.tabularFigures()],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
