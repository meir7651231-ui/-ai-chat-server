// ✨ StatHero — מספר-ענק בגרדיאנט-טקסט (ShaderMask) עם תווית מתחת; מקבל value/label
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class StatHero extends StatelessWidget {
  StatHero({super.key, required this.value, required this.label});

  final String value;
  final String label;

  static const _shaderA0 = DsAtomColors.premiumSurfacesStatHero1;

  static Color _shaderA(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesStatHero1, (l) => l.success);   // לובש עור · _shaderA0 = הערך-הכהה
  static const _shaderB0 = DsAtomColors.premiumSurfacesStatHero2;
  static Color _shaderB(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesStatHero2, (l) => l.accent);   // לובש עור · _shaderB0 = הערך-הכהה
  static const _shaderC0 = DsAtomColors.premiumSurfacesStatHero3;
  static Color _shaderC(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesStatHero3, (l) => l.muted);   // לובש עור · _shaderC0 = הערך-הכהה
  static const _label0 = DsAtomColors.premiumSurfacesStatHero4;
  static Color _label(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesStatHero4, (l) => l.muted);   // לובש עור · _label0 = הערך-הכהה

  static Gradient _grad = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [_shaderA0, _shaderB0, _shaderC0],
  );

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ShaderMask(
            shaderCallback: (bounds) => _grad.createShader(
              Rect.fromLTWH(0, 0, bounds.width, bounds.height),
            ),
            blendMode: BlendMode.srcIn,
            child: Text(
              value,
              style: TextStyle(
                color: dsWear(context, DsAtomColors.premiumSurfacesStatHero5, (l) => l.onAccent),
                fontSize: 54,
                fontWeight: FontWeight.w900,
                height: 1.0,
                letterSpacing: -1.5,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: TextStyle(
              color: _label(context),
              fontSize: 14,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );
  }
}
