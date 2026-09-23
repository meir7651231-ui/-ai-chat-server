// ✨ GlassListTile — שורת-זכוכית: BackdropFilter מטושטש + כותרת/תת + trailing
import 'dart:ui';
import 'package:flutter/material.dart';
import '../../ds/ds_atoms.dart';

class GlassListTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final String? trailing;

  const GlassListTile({
    super.key,
    required this.title,
    required this.subtitle,
    this.trailing,
  });

  static const Color _accent = DsAtomColors.premiumListsGlassListTile1;
  static const Color _text = DsAtomColors.premiumListsGlassListTile2;
  static const Color _muted = DsAtomColors.premiumListsGlassListTile3;

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(18),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () {},
              child: Container(
                padding:
                    const EdgeInsetsDirectional.fromSTEB(16, 14, 16, 14),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(18),
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      DsAtomColors.premiumListsGlassListTile4.withValues(alpha: 0.10),
                      DsAtomColors.premiumListsGlassListTile4.withValues(alpha: 0.03),
                    ],
                  ),
                  border: Border.all(
                    color: DsAtomColors.premiumListsGlassListTile4.withValues(alpha: 0.14),
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 10,
                      height: 40,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(6),
                        gradient: const LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [_accent, DsAtomColors.premiumListsGlassListTile5],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: _accent.withValues(alpha: 0.5),
                            blurRadius: 12,
                            spreadRadius: -2,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              color: _text,
                              fontSize: 15.5,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            subtitle,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              color: _muted,
                              fontSize: 12.5,
                              height: 1.2,
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (trailing != null) ...[
                      const SizedBox(width: 10),
                      Text(
                        trailing!,
                        style: const TextStyle(
                          color: DsAtomColors.premiumListsGlassListTile6,
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
