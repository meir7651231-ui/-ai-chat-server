// ✨ TrendStat — ערך + תווית + צ׳יפ-מגמה (delta>0 ירוק↑ / <0 אדום↓)
import 'dart:ui';
import 'package:flutter/material.dart';
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

  static const Color _bg = DsAtomColors.premiumDatavizTrendStat1;
  static const Color _ink = DsAtomColors.premiumDatavizTrendStat2;
  static const Color _mute = DsAtomColors.premiumDatavizTrendStat3;
  static const Color _up = DsAtomColors.premiumDatavizTrendStat4;
  static const Color _down = DsAtomColors.premiumDatavizTrendStat5;

  @override
  Widget build(BuildContext context) {
    final bool flat = delta == 0;
    final bool up = delta > 0;
    final Color accent = flat ? _mute : (up ? _up : _down);
    final String arrow = flat ? '→' : (up ? '↑' : '↓');
    final String pct = '${delta.abs().toStringAsFixed(1)}%';

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        decoration: BoxDecoration(
          color: _bg,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: DsAtomColors.premiumDatavizTrendStat6.withValues(alpha: 0.06)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              label,
              style: const TextStyle(
                color: _mute,
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
                  style: const TextStyle(
                    color: _ink,
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
