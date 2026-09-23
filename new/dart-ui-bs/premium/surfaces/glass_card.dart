// ✨ GlassCard — כרטיס-זכוכית (BackdropFilter+blur) עם highlight עליון; מקבל child כתוכן
import 'dart:ui';
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class GlassCard extends StatelessWidget {
  GlassCard({super.key, required this.child});

  final Widget child;

  static const _tint0 = DsAtomColors.premiumSurfacesGlassCard1;

  static Color _tint(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesGlassCard1, (l) => l.onAccent.withValues(alpha: 0.078));   // לובש עור · _tint0 = הערך-הכהה
  static const _tintLow0 = DsAtomColors.premiumSurfacesGlassCard2;
  static Color _tintLow(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesGlassCard2, (l) => l.onAccent.withValues(alpha: 0.031));   // לובש עור · _tintLow0 = הערך-הכהה
  static const _border0 = DsAtomColors.premiumSurfacesGlassCard3;
  static Color _border(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesGlassCard3, (l) => l.onAccent.withValues(alpha: 0.2));   // לובש עור · _border0 = הערך-הכהה
  static const _highlight0 = DsAtomColors.premiumSurfacesGlassCard4;
  static Color _highlight(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesGlassCard4, (l) => l.onAccent.withValues(alpha: 0.4));   // לובש עור · _highlight0 = הערך-הכהה
  static const _glow0 = DsAtomColors.premiumSurfacesGlassCard5;
  static Color _glow(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesGlassCard5, (l) => l.accentSoft.withValues(alpha: 0.2));   // לובש עור · _glow0 = הערך-הכהה
  static const _shadow0 = DsAtomColors.premiumSurfacesGlassCard6;
  static Color _shadow(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesGlassCard6, (l) => l.bg.withValues(alpha: 0.4));   // לובש עור · _shadow0 = הערך-הכהה

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(color: _shadow(context), blurRadius: 30, offset: Offset(0, 18)),
            BoxShadow(color: _glow(context), blurRadius: 40, spreadRadius: -6),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 22, sigmaY: 22),
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(24),
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [_tint(context), _tintLow(context)],
                ),
                border: Border.all(color: _border(context), width: 1),
              ),
              child: Stack(
                children: [
                  Positioned(
                    top: 0,
                    left: 0,
                    right: 0,
                    child: Container(
                      height: 1.5,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            dsWear(context, DsAtomColors.premiumSurfacesGlassCard7, (l) => l.onAccent.withValues(alpha: 0.0)),
                            _highlight(context),
                            dsWear(context, DsAtomColors.premiumSurfacesGlassCard7, (l) => l.onAccent.withValues(alpha: 0.0)),
                          ],
                        ),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(22),
                    child: child,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
