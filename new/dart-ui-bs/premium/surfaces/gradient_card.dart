// ✨ GradientCard — כרטיס משטח גרדיאנט-כהה + צל רך; מקבל child כתוכן
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class GradientCard extends StatelessWidget {
  GradientCard({super.key, required this.child});

  final Widget child;

  static const _top0 = DsAtomColors.premiumSurfacesGradientCard1;

  static Color _top(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesGradientCard1, (l) => l.track);   // לובש עור · _top0 = הערך-הכהה
  static const _mid0 = DsAtomColors.premiumSurfacesGradientCard2;
  static Color _mid(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesGradientCard2, (l) => l.card);   // לובש עור · _mid0 = הערך-הכהה
  static const _bottom0 = DsAtomColors.premiumSurfacesGradientCard3;
  static Color _bottom(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesGradientCard3, (l) => l.bg);   // לובש עור · _bottom0 = הערך-הכהה
  static const _border0 = DsAtomColors.premiumSurfacesGradientCard4;
  static Color _border(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesGradientCard4, (l) => l.onAccent.withValues(alpha: 0.102));   // לובש עור · _border0 = הערך-הכהה
  static const _shadow0 = DsAtomColors.premiumSurfacesGradientCard5;
  static Color _shadow(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesGradientCard5, (l) => l.bg.withValues(alpha: 0.451));   // לובש עור · _shadow0 = הערך-הכהה
  static const _accentGlow0 = DsAtomColors.premiumSurfacesGradientCard6;
  static Color _accentGlow(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesGradientCard6, (l) => l.muted.withValues(alpha: 0.149));   // לובש עור · _accentGlow0 = הערך-הכהה

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(22),
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [_top(context), _mid(context), _bottom(context)],
            stops: [0.0, 0.55, 1.0],
          ),
          border: Border.all(color: _border(context), width: 1),
          boxShadow: [
            BoxShadow(color: _shadow(context), blurRadius: 28, offset: Offset(0, 16)),
            BoxShadow(color: _accentGlow(context), blurRadius: 34, spreadRadius: -10),
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
