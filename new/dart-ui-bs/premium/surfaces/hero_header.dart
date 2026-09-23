// ✨ HeroHeader — כותרת-על עם אייקון-גרדיאנט זוהר ורקע-רדיאלי; מקבל title/subtitle/glyph
import 'package:flutter/material.dart';
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

  static const Color _bg = DsAtomColors.premiumSurfacesHeroHeader1;
  static const Color _radialCore = DsAtomColors.premiumSurfacesHeroHeader2;
  static const Color _radialEdge = DsAtomColors.premiumSurfacesHeroHeader3;
  static const Color _text = DsAtomColors.premiumSurfacesHeroHeader4;
  static const Color _sub = DsAtomColors.premiumSurfacesHeroHeader5;
  static const Color _glyphA = DsAtomColors.premiumSurfacesHeroHeader6;
  static const Color _glyphB = DsAtomColors.premiumSurfacesHeroHeader7;
  static const Color _glyphGlow = DsAtomColors.premiumSurfacesHeroHeader8;
  static const Color _border = DsAtomColors.premiumSurfacesHeroHeader9;

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(26),
          color: _bg,
          border: Border.all(color: _border, width: 1),
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
                padding: const EdgeInsets.all(26),
                child: Row(
                  children: [
                    Container(
                      width: 62,
                      height: 62,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(18),
                        gradient: const LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [_glyphA, _glyphB],
                        ),
                        boxShadow: const [
                          BoxShadow(
                            color: _glyphGlow,
                            blurRadius: 26,
                            spreadRadius: -2,
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        glyph,
                        style: const TextStyle(fontSize: 30, color: DsAtomColors.premiumSurfacesHeroHeader10),
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
                            style: const TextStyle(
                              color: _text,
                              fontSize: 24,
                              fontWeight: FontWeight.w800,
                              height: 1.1,
                              letterSpacing: -0.4,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            subtitle,
                            style: const TextStyle(
                              color: _sub,
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
      decoration: const BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          colors: [HeroHeader._radialCore, HeroHeader._radialEdge],
        ),
      ),
    );
  }
}
