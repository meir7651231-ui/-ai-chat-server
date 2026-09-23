// ✨ AvatarTile — אריח-אווטאר: ראשי-תיבות בגרדיאנט זוהר + כותרת/תת-כותרת
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class AvatarTile extends StatelessWidget {
  final String initials;
  final String title;
  final String subtitle;

  const AvatarTile({
    super.key,
    required this.initials,
    required this.title,
    required this.subtitle,
  });

  static const _card0 = DsAtomColors.premiumListsAvatarTile1;

  static Color _card(BuildContext context) => dsWear(context, DsAtomColors.premiumListsAvatarTile1, (l) => l.card);   // לובש עור · _card0 = הערך-הכהה
  static const _accent0 = DsAtomColors.premiumListsAvatarTile2;
  static Color _accent(BuildContext context) => dsWear(context, DsAtomColors.premiumListsAvatarTile2, (l) => l.accent);   // לובש עור · _accent0 = הערך-הכהה
  static const _text0 = DsAtomColors.premiumListsAvatarTile3;
  static Color _text(BuildContext context) => dsWear(context, DsAtomColors.premiumListsAvatarTile3, (l) => l.chipBg);   // לובש עור · _text0 = הערך-הכהה
  static const _muted0 = DsAtomColors.premiumListsAvatarTile4;
  static Color _muted(BuildContext context) => dsWear(context, DsAtomColors.premiumListsAvatarTile4, (l) => l.muted);   // לובש עור · _muted0 = הערך-הכהה

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {},
          borderRadius: BorderRadius.circular(20),
          child: Container(
            padding: EdgeInsetsDirectional.fromSTEB(14, 13, 14, 13),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: AlignmentDirectional.centerEnd,
                end: AlignmentDirectional.centerStart,
                colors: [_card(context), dsWear(context, DsAtomColors.premiumListsAvatarTile5, (l) => l.card)],
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: dsWear(context, DsAtomColors.premiumListsAvatarTile6, (l) => l.onAccent).withValues(alpha: 0.06)),
            ),
            child: Row(
              children: [
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: SweepGradient(
                      colors: [
                        _accent(context),
                        dsWear(context, DsAtomColors.premiumListsAvatarTile7, (l) => l.muted),
                        dsWear(context, DsAtomColors.premiumListsAvatarTile8, (l) => l.accent),
                        _accent(context),
                      ],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: _accent(context).withValues(alpha: 0.5),
                        blurRadius: 18,
                        spreadRadius: -2,
                      ),
                    ],
                  ),
                  alignment: Alignment.center,
                  child: Container(
                    width: 46,
                    height: 46,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: dsWear(context, DsAtomColors.premiumListsAvatarTile5, (l) => l.card),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      initials,
                      style: TextStyle(
                        color: _text(context),
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.5,
                      ),
                    ),
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
              ],
            ),
          ),
        ),
      ),
    );
  }
}
