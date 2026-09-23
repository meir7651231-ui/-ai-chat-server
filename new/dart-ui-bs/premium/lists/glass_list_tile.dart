// ✨ GlassListTile — שורת-זכוכית: BackdropFilter מטושטש + כותרת/תת + trailing
import 'dart:ui';
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
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

  static const _accent0 = DsAtomColors.premiumListsGlassListTile1;

  static Color _accent(BuildContext context) => dsWear(context, DsAtomColors.premiumListsGlassListTile1, (l) => l.accent);   // לובש עור · _accent0 = הערך-הכהה
  static const _text0 = DsAtomColors.premiumListsGlassListTile2;
  static Color _text(BuildContext context) => dsWear(context, DsAtomColors.premiumListsGlassListTile2, (l) => l.chipBg);   // לובש עור · _text0 = הערך-הכהה
  static const _muted0 = DsAtomColors.premiumListsGlassListTile3;
  static Color _muted(BuildContext context) => dsWear(context, DsAtomColors.premiumListsGlassListTile3, (l) => l.muted);   // לובש עור · _muted0 = הערך-הכהה

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
                      dsWear(context, DsAtomColors.premiumListsGlassListTile4, (l) => l.onAccent).withValues(alpha: 0.10),
                      dsWear(context, DsAtomColors.premiumListsGlassListTile4, (l) => l.onAccent).withValues(alpha: 0.03),
                    ],
                  ),
                  border: Border.all(
                    color: dsWear(context, DsAtomColors.premiumListsGlassListTile4, (l) => l.onAccent).withValues(alpha: 0.14),
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 10,
                      height: 40,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(6),
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [_accent(context), dsWear(context, DsAtomColors.premiumListsGlassListTile5, (l) => l.muted)],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: _accent(context).withValues(alpha: 0.5),
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
                            style: TextStyle(
                              color: _text(context),
                              fontSize: 15.5,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            subtitle,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              color: _muted(context),
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
                        style: TextStyle(
                          color: dsWear(context, DsAtomColors.premiumListsGlassListTile6, (l) => l.accentDark),
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
