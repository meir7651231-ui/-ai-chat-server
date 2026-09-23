// ✨ NeonCard — כרטיס עם טבעת-גרדיאנט-ניאון זוהרת סביב גוף כהה; מקבל child כתוכן
import 'package:flutter/material.dart';
import '../../ds/ds_atoms.dart';

class NeonCard extends StatelessWidget {
  const NeonCard({super.key, required this.child});

  final Widget child;

  static const Color _bg = DsAtomColors.premiumSurfacesNeonCard1;
  static const Color _ringA = DsAtomColors.premiumSurfacesNeonCard2;
  static const Color _ringB = DsAtomColors.premiumSurfacesNeonCard3;
  static const Color _ringC = DsAtomColors.premiumSurfacesNeonCard4;
  static const Color _glowPurple = DsAtomColors.premiumSurfacesNeonCard5;
  static const Color _glowCyan = DsAtomColors.premiumSurfacesNeonCard6;

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          boxShadow: const [
            BoxShadow(color: _glowPurple, blurRadius: 34, spreadRadius: -4),
            BoxShadow(color: _glowCyan, blurRadius: 44, spreadRadius: -8),
          ],
        ),
        child: Container(
          padding: const EdgeInsets.all(1.6),
          decoration: const BoxDecoration(
            borderRadius: BorderRadius.all(Radius.circular(24)),
            gradient: SweepGradient(
              colors: [_ringA, _ringB, _ringC, _ringA],
              stops: [0.0, 0.4, 0.75, 1.0],
            ),
          ),
          child: Container(
            decoration: BoxDecoration(
              color: _bg,
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
