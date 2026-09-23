// ✨ GlassCard — כרטיס-זכוכית (BackdropFilter+blur) עם highlight עליון; מקבל child כתוכן
import 'dart:ui';
import 'package:flutter/material.dart';
import '../../ds/ds_atoms.dart';

class GlassCard extends StatelessWidget {
  const GlassCard({super.key, required this.child});

  final Widget child;

  static const Color _tint = DsAtomColors.premiumSurfacesGlassCard1;
  static const Color _tintLow = DsAtomColors.premiumSurfacesGlassCard2;
  static const Color _border = DsAtomColors.premiumSurfacesGlassCard3;
  static const Color _highlight = DsAtomColors.premiumSurfacesGlassCard4;
  static const Color _glow = DsAtomColors.premiumSurfacesGlassCard5;
  static const Color _shadow = DsAtomColors.premiumSurfacesGlassCard6;

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          boxShadow: const [
            BoxShadow(color: _shadow, blurRadius: 30, offset: Offset(0, 18)),
            BoxShadow(color: _glow, blurRadius: 40, spreadRadius: -6),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 22, sigmaY: 22),
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(24),
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [_tint, _tintLow],
                ),
                border: Border.all(color: _border, width: 1),
              ),
              child: Stack(
                children: [
                  Positioned(
                    top: 0,
                    left: 0,
                    right: 0,
                    child: Container(
                      height: 1.5,
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            DsAtomColors.premiumSurfacesGlassCard7,
                            _highlight,
                            DsAtomColors.premiumSurfacesGlassCard7,
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
