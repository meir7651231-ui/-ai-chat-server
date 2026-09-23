// ✨ NeonCard — כרטיס עם טבעת-גרדיאנט-ניאון זוהרת סביב גוף כהה; מקבל child כתוכן
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class NeonCard extends StatelessWidget {
  NeonCard({super.key, required this.child});

  final Widget child;

  static const _bg0 = DsAtomColors.premiumSurfacesNeonCard1;

  static Color _bg(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesNeonCard1, (l) => l.bg);   // לובש עור · _bg0 = הערך-הכהה
  static const _ringA0 = DsAtomColors.premiumSurfacesNeonCard2;
  static Color _ringA(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesNeonCard2, (l) => l.accent);   // לובש עור · _ringA0 = הערך-הכהה
  static const _ringB0 = DsAtomColors.premiumSurfacesNeonCard3;
  static Color _ringB(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesNeonCard3, (l) => l.muted);   // לובש עור · _ringB0 = הערך-הכהה
  static const _ringC0 = DsAtomColors.premiumSurfacesNeonCard4;
  static Color _ringC(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesNeonCard4, (l) => l.success);   // לובש עור · _ringC0 = הערך-הכהה
  static const _glowPurple0 = DsAtomColors.premiumSurfacesNeonCard5;
  static Color _glowPurple(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesNeonCard5, (l) => l.accentSoft.withValues(alpha: 0.333));   // לובש עור · _glowPurple0 = הערך-הכהה
  static const _glowCyan0 = DsAtomColors.premiumSurfacesNeonCard6;
  static Color _glowCyan(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesNeonCard6, (l) => l.successSoft.withValues(alpha: 0.251));   // לובש עור · _glowCyan0 = הערך-הכהה

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(color: _glowPurple(context), blurRadius: 34, spreadRadius: -4),
            BoxShadow(color: _glowCyan(context), blurRadius: 44, spreadRadius: -8),
          ],
        ),
        child: Container(
          padding: const EdgeInsets.all(1.6),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.all(Radius.circular(24)),
            gradient: SweepGradient(
              colors: [_ringA(context), _ringB(context), _ringC(context), _ringA(context)],
              stops: [0.0, 0.4, 0.75, 1.0],
            ),
          ),
          child: Container(
            decoration: BoxDecoration(
              color: _bg(context),
              borderRadius: BorderRadius.circular(22.5),
            ),
            child: Padding(
              padding: const EdgeInsets.all(22),
              child: child,
            ),
          ),
        ),
      ),
    );
  }
}
