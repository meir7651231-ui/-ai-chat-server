// ✨ HeroHeader — כותרת-על עם אייקון-גרדיאנט זוהר ורקע-רדיאלי; מקבל title/subtitle/glyph
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class HeroHeader extends StatelessWidget {
  const HeroHeader({
    super.key,
    required this.title,
    required this.subtitle,
    required this.glyph,
  });

  final String title;
  final String subtitle;
  final String glyph;

  static const _bg0 = DsAtomColors.premiumSurfacesHeroHeader1;

  static Color _bg(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesHeroHeader1, (l) => l.bg);   // לובש עור · _bg0 = הערך-הכהה
  static const _radialCore0 = DsAtomColors.premiumSurfacesHeroHeader2;
  static Color _radialCore(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesHeroHeader2, (l) => l.accentSoft.withValues(alpha: 0.333));   // לובש עור · _radialCore0 = הערך-הכהה
  static const _radialEdge0 = DsAtomColors.premiumSurfacesHeroHeader3;
  static Color _radialEdge(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesHeroHeader3, (l) => l.bg.withValues(alpha: 0.0));   // לובש עור · _radialEdge0 = הערך-הכהה
  static const _text0 = DsAtomColors.premiumSurfacesHeroHeader4;
  static Color _text(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesHeroHeader4, (l) => l.chipBg);   // לובש עור · _text0 = הערך-הכהה
  static const _sub0 = DsAtomColors.premiumSurfacesHeroHeader5;
  static Color _sub(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesHeroHeader5, (l) => l.muted);   // לובש עור · _sub0 = הערך-הכהה
  static const _glyphA0 = DsAtomColors.premiumSurfacesHeroHeader6;
  static Color _glyphA(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesHeroHeader6, (l) => l.accent);   // לובש עור · _glyphA0 = הערך-הכהה
  static const _glyphB0 = DsAtomColors.premiumSurfacesHeroHeader7;
  static Color _glyphB(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesHeroHeader7, (l) => l.muted);   // לובש עור · _glyphB0 = הערך-הכהה
  static const _glyphGlow0 = DsAtomColors.premiumSurfacesHeroHeader8;
  static Color _glyphGlow(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesHeroHeader8, (l) => l.muted.withValues(alpha: 0.4));   // לובש עור · _glyphGlow0 = הערך-הכהה
  static const _border0 = DsAtomColors.premiumSurfacesHeroHeader9;
  static Color _border(BuildContext context) => dsWear(context, DsAtomColors.premiumSurfacesHeroHeader9, (l) => l.onAccent.withValues(alpha: 0.102));   // לובש עור · _border0 = הערך-הכהה

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(26),
          color: _bg(context),
          border: Border.all(color: _border(context), width: 1),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(26),
          child: Stack(
            children: [
              const Positioned(
                top: -70,
                right: -40,
                child: _RadialBlob(),
              ),
              Padding(
                padding: EdgeInsets.all(26),
                child: Row(
                  children: [
                    Container(
                      width: 62,
                      height: 62,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(18),
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [_glyphA(context), _glyphB(context)],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: _glyphGlow(context),
                            blurRadius: 26,
                            spreadRadius: -2,
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        glyph,
                        style: TextStyle(fontSize: 30, color: dsWear(context, DsAtomColors.premiumSurfacesHeroHeader10, (l) => l.onAccent)),
                      ),
                    ),
                    const SizedBox(width: 18),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            title,
                            style: TextStyle(
                              color: _text(context),
                              fontSize: 24,
                              fontWeight: FontWeight.w800,
                              height: 1.1,
                              letterSpacing: -0.4,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            subtitle,
                            style: TextStyle(
                              color: _sub(context),
                              fontSize: 14,
                              height: 1.3,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _RadialBlob extends StatelessWidget {
  const _RadialBlob();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 220,
      height: 220,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          colors: [HeroHeader._radialCore(context), HeroHeader._radialEdge(context)],
        ),
      ),
    );
  }
}
