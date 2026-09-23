// ✨ ElevatedCard — כרטיס-כהה עם ראמפת-צל-עמוקה כפולה ותאורת-קצה עדינה; מקבל child כתוכן
import 'package:flutter/material.dart';
import '../../ds/ds_atoms.dart';

class ElevatedCard extends StatelessWidget {
  const ElevatedCard({super.key, required this.child});

  final Widget child;

  static const Color _surface = DsAtomColors.premiumSurfacesElevatedCard1;
  static const Color _surfaceLow = DsAtomColors.premiumSurfacesElevatedCard2;
  static const Color _edge = DsAtomColors.premiumSurfacesElevatedCard3;
  static const Color _shadowDeep = DsAtomColors.premiumSurfacesElevatedCard4;
  static const Color _shadowMid = DsAtomColors.premiumSurfacesElevatedCard5;
  static const Color _ambient = DsAtomColors.premiumSurfacesElevatedCard6;

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [_surface, _surfaceLow],
          ),
          border: Border.all(color: _edge, width: 1),
          boxShadow: const [
            BoxShadow(color: _shadowDeep, blurRadius: 40, offset: Offset(0, 24)),
            BoxShadow(color: _shadowMid, blurRadius: 16, offset: Offset(0, 8)),
            BoxShadow(color: _ambient, blurRadius: 50, spreadRadius: -12),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(22),
          child: child,
        ),
      ),
    );
  }
}
