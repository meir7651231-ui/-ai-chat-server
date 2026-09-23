// ✨ FeaturePanel — פאנל-פיצ'ר: אייקון-glyph זוהר, כותרת וגוף-טקסט; מקבל title/body/glyph
import 'package:flutter/material.dart';
import '../../ds/ds_atoms.dart';

class FeaturePanel extends StatelessWidget {
  const FeaturePanel({
    super.key,
    required this.title,
    required this.body,
    required this.glyph,
  });

  final String title;
  final String body;
  final String glyph;

  static const Color _surface = DsAtomColors.premiumSurfacesFeaturePanel1;
  static const Color _surfaceLow = DsAtomColors.premiumSurfacesFeaturePanel2;
  static const Color _border = DsAtomColors.premiumSurfacesFeaturePanel3;
  static const Color _title = DsAtomColors.premiumSurfacesFeaturePanel4;
  static const Color _body = DsAtomColors.premiumSurfacesFeaturePanel5;
  static const Color _glyphA = DsAtomColors.premiumSurfacesFeaturePanel6;
  static const Color _glyphB = DsAtomColors.premiumSurfacesFeaturePanel7;
  static const Color _glyphGlow = DsAtomColors.premiumSurfacesFeaturePanel8;
  static const Color _shadow = DsAtomColors.premiumSurfacesFeaturePanel9;

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(22),
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [_surface, _surfaceLow],
          ),
          border: Border.all(color: _border, width: 1),
          boxShadow: const [
            BoxShadow(color: _shadow, blurRadius: 26, offset: Offset(0, 14)),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(22),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(15),
                  gradient: const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [_glyphA, _glyphB],
                  ),
                  boxShadow: const [
                    BoxShadow(
                      color: _glyphGlow,
                      blurRadius: 22,
                      spreadRadius: -2,
                    ),
                  ],
                ),
                alignment: Alignment.center,
                child: Text(
                  glyph,
                  style: const TextStyle(fontSize: 26, color: DsAtomColors.premiumSurfacesFeaturePanel10),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                title,
                style: const TextStyle(
                  color: _title,
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.2,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                body,
                style: const TextStyle(
                  color: _body,
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
