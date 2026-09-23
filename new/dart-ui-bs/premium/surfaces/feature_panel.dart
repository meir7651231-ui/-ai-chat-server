// ✨ FeaturePanel — פאנל-פיצ'ר: אייקון-glyph זוהר, כותרת וגוף-טקסט; מקבל title/body/glyph
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class FeaturePanel extends StatelessWidget {
  FeaturePanel({
    super.key,
    required this.title,
    required this.body,
    required this.glyph,
  });

  final String title;
  final String body;
  final String glyph;

  static const _surface0 = DsAtomColors.premiumSurfacesFeaturePanel1;

  static Color _surface(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesFeaturePanel1, (l) => l.card);   // לובש עור · _surface0 = הערך-הכהה
  static const _surfaceLow0 = DsAtomColors.premiumSurfacesFeaturePanel2;
  static Color _surfaceLow(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesFeaturePanel2, (l) => l.bg);   // לובש עור · _surfaceLow0 = הערך-הכהה
  static const _border0 = DsAtomColors.premiumSurfacesFeaturePanel3;
  static Color _border(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesFeaturePanel3, (l) => l.onAccent.withValues(alpha: 0.122));   // לובש עור · _border0 = הערך-הכהה
  static const _title0 = DsAtomColors.premiumSurfacesFeaturePanel4;
  static Color _title(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesFeaturePanel4, (l) => l.chipBg);   // לובש עור · _title0 = הערך-הכהה
  static const _body0 = DsAtomColors.premiumSurfacesFeaturePanel5;
  static Color _body(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesFeaturePanel5, (l) => l.muted);   // לובש עור · _body0 = הערך-הכהה
  static const _glyphA0 = DsAtomColors.premiumSurfacesFeaturePanel6;
  static Color _glyphA(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesFeaturePanel6, (l) => l.success);   // לובש עור · _glyphA0 = הערך-הכהה
  static const _glyphB0 = DsAtomColors.premiumSurfacesFeaturePanel7;
  static Color _glyphB(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesFeaturePanel7, (l) => l.accent);   // לובש עור · _glyphB0 = הערך-הכהה
  static const _glyphGlow0 = DsAtomColors.premiumSurfacesFeaturePanel8;
  static Color _glyphGlow(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesFeaturePanel8, (l) => l.successSoft.withValues(alpha: 0.251));   // לובש עור · _glyphGlow0 = הערך-הכהה
  static const _shadow0 = DsAtomColors.premiumSurfacesFeaturePanel9;
  static Color _shadow(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesFeaturePanel9, (l) => l.bg.withValues(alpha: 0.349));   // לובש עור · _shadow0 = הערך-הכהה

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(22),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [_surface(context), _surfaceLow(context)],
          ),
          border: Border.all(color: _border(context), width: 1),
          boxShadow: [
            BoxShadow(color: _shadow(context), blurRadius: 26, offset: Offset(0, 14)),
          ],
        ),
        child: Padding(
          padding: EdgeInsets.all(22),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(15),
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [_glyphA(context), _glyphB(context)],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: _glyphGlow(context),
                      blurRadius: 22,
                      spreadRadius: -2,
                    ),
                  ],
                ),
                alignment: Alignment.center,
                child: Text(
                  glyph,
                  style: TextStyle(fontSize: 26, color: dsWear(context, DsAtomColors.premiumSurfacesFeaturePanel10, (l) => l.onAccent)),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                title,
                style: TextStyle(
                  color: _title(context),
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.2,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                body,
                style: TextStyle(
                  color: _body(context),
                  fontSize: 14,
                  height: 1.5,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
