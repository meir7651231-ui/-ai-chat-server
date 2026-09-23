// ✨ ElevatedCard — כרטיס-כהה עם ראמפת-צל-עמוקה כפולה ותאורת-קצה עדינה; מקבל child כתוכן
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class ElevatedCard extends StatelessWidget {
  ElevatedCard({super.key, required this.child});

  final Widget child;

  static const _surface0 = DsAtomColors.premiumSurfacesElevatedCard1;

  static Color _surface(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesElevatedCard1, (l) => l.card);   // לובש עור · _surface0 = הערך-הכהה
  static const _surfaceLow0 = DsAtomColors.premiumSurfacesElevatedCard2;
  static Color _surfaceLow(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesElevatedCard2, (l) => l.bg);   // לובש עור · _surfaceLow0 = הערך-הכהה
  static const _edge0 = DsAtomColors.premiumSurfacesElevatedCard3;
  static Color _edge(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesElevatedCard3, (l) => l.onAccent.withValues(alpha: 0.133));   // לובש עור · _edge0 = הערך-הכהה
  static const _shadowDeep0 = DsAtomColors.premiumSurfacesElevatedCard4;
  static Color _shadowDeep(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesElevatedCard4, (l) => l.bg.withValues(alpha: 0.6));   // לובש עור · _shadowDeep0 = הערך-הכהה
  static const _shadowMid0 = DsAtomColors.premiumSurfacesElevatedCard5;
  static Color _shadowMid(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesElevatedCard5, (l) => l.bg.withValues(alpha: 0.302));   // לובש עור · _shadowMid0 = הערך-הכהה
  static const _ambient0 = DsAtomColors.premiumSurfacesElevatedCard6;
  static Color _ambient(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesElevatedCard6, (l) => l.accentSoft.withValues(alpha: 0.102));   // לובש עור · _ambient0 = הערך-הכהה

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [_surface(context), _surfaceLow(context)],
          ),
          border: Border.all(color: _edge(context), width: 1),
          boxShadow: [
            BoxShadow(color: _shadowDeep(context), blurRadius: 40, offset: Offset(0, 24)),
            BoxShadow(color: _shadowMid(context), blurRadius: 16, offset: Offset(0, 8)),
            BoxShadow(color: _ambient(context), blurRadius: 50, spreadRadius: -12),
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
