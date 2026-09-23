// ✨ AvatarTile — אריח-אווטאר: ראשי-תיבות בגרדיאנט זוהר + כותרת/תת-כותרת
import 'package:flutter/material.dart';
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

  static const Color _card = DsAtomColors.premiumListsAvatarTile1;
  static const Color _accent = DsAtomColors.premiumListsAvatarTile2;
  static const Color _text = DsAtomColors.premiumListsAvatarTile3;
  static const Color _muted = DsAtomColors.premiumListsAvatarTile4;

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
            padding: const EdgeInsetsDirectional.fromSTEB(14, 13, 14, 13),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: AlignmentDirectional.centerEnd,
                end: AlignmentDirectional.centerStart,
                colors: [_card, DsAtomColors.premiumListsAvatarTile5],
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: DsAtomColors.premiumListsAvatarTile6.withValues(alpha: 0.06)),
            ),
            child: Row(
              children: [
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const SweepGradient(
                      colors: [
                        _accent,
                        DsAtomColors.premiumListsAvatarTile7,
                        DsAtomColors.premiumListsAvatarTile8,
                        _accent,
                      ],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: _accent.withValues(alpha: 0.5),
                        blurRadius: 18,
                        spreadRadius: -2,
                      ),
                    ],
                  ),
                  alignment: Alignment.center,
                  child: Container(
                    width: 46,
                    height: 46,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: DsAtomColors.premiumListsAvatarTile5,
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      initials,
                      style: const TextStyle(
                        color: _text,
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
              ],
            ),
          ),
        ),
      ),
    );
  }
}
