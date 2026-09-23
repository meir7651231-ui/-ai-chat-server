// ✨ GradientCard — כרטיס משטח גרדיאנט-כהה + צל רך; מקבל child כתוכן
import 'package:flutter/material.dart';
import '../../ds/ds_atoms.dart';

class GradientCard extends StatelessWidget {
  const GradientCard({super.key, required this.child});

  final Widget child;

  static const Color _top = DsAtomColors.premiumSurfacesGradientCard1;
  static const Color _mid = DsAtomColors.premiumSurfacesGradientCard2;
  static const Color _bottom = DsAtomColors.premiumSurfacesGradientCard3;
  static const Color _border = DsAtomColors.premiumSurfacesGradientCard4;
  static const Color _shadow = DsAtomColors.premiumSurfacesGradientCard5;
  static const Color _accentGlow = DsAtomColors.premiumSurfacesGradientCard6;

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(22),
          gradient: const LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [_top, _mid, _bottom],
            stops: [0.0, 0.55, 1.0],
          ),
          border: Border.all(color: _border, width: 1),
          boxShadow: const [
            BoxShadow(color: _shadow, blurRadius: 28, offset: Offset(0, 16)),
            BoxShadow(color: _accentGlow, blurRadius: 34, spreadRadius: -10),
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
