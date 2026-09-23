// ✨ StatRow — שורת-סטטיסטיקה: תווית + פס-התקדמות-ניאון (fraction 0..1) + ערך
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class StatRow extends StatelessWidget {
  final String label;
  final String value;
  final double fraction;

  const StatRow({
    super.key,
    required this.label,
    required this.value,
    required this.fraction,
  });

  static const _card0 = DsAtomColors.premiumListsStatRow1;

  static Color _card(BuildContext context) => dsWear(context, DsAtomColors.premiumListsStatRow1, (l) => l.card);   // לובש עור · _card0 = הערך-הכהה
  static const _accent0 = DsAtomColors.premiumListsStatRow2;
  static Color _accent(BuildContext context) => dsWear(context, DsAtomColors.premiumListsStatRow2, (l) => l.accent);   // לובש עור · _accent0 = הערך-הכהה
  static const _text0 = DsAtomColors.premiumListsStatRow3;
  static Color _text(BuildContext context) => dsWear(context, DsAtomColors.premiumListsStatRow3, (l) => l.chipBg);   // לובש עור · _text0 = הערך-הכהה
  static const _muted0 = DsAtomColors.premiumListsStatRow4;
  static Color _muted(BuildContext context) => dsWear(context, DsAtomColors.premiumListsStatRow4, (l) => l.muted);   // לובש עור · _muted0 = הערך-הכהה

  @override
  Widget build(BuildContext context) {
    final double f = fraction.clamp(0.0, 1.0);
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        padding: const EdgeInsetsDirectional.fromSTEB(14, 12, 14, 12),
        decoration: BoxDecoration(
          color: _card(context),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: dsWear(context, DsAtomColors.premiumListsStatRow5, (l) => l.onAccent).withValues(alpha: 0.06)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    label,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      color: _muted(context),
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Text(
                  value,
                  style: TextStyle(
                    color: _text(context),
                    fontSize: 14.5,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            LayoutBuilder(
              builder: (context, constraints) {
                return Stack(
                  children: [
                    Container(
                      height: 8,
                      decoration: BoxDecoration(
                        color: dsWear(context, DsAtomColors.premiumListsStatRow5, (l) => l.onAccent).withValues(alpha: 0.06),
                        borderRadius: BorderRadius.circular(6),
                      ),
                    ),
                    Container(
                      height: 8,
                      width: constraints.maxWidth * f,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(6),
                        gradient: LinearGradient(
                          colors: [_accent(context), dsWear(context, DsAtomColors.premiumListsStatRow6, (l) => l.muted)],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: _accent(context).withValues(alpha: 0.55),
                            blurRadius: 10,
                            spreadRadius: -1,
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
