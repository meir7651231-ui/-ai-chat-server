// ✨ MediaRow — שורת-מדיה: אייקון-גרדיאנט + כותרת/תת-כותרת + trailing אופציונלי
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class MediaRow extends StatelessWidget {
  final String title;
  final String subtitle;
  final String glyph;
  final String? trailing;

  const MediaRow({
    super.key,
    required this.title,
    required this.subtitle,
    required this.glyph,
    this.trailing,
  });

  static const _card0 = DsAtomColors.premiumListsMediaRow1;

  static Color _card(BuildContext context) => dsWear(context, DsAtomColors.premiumListsMediaRow1, (l) => l.card);   // לובש עור · _card0 = הערך-הכהה
  static const _accent0 = DsAtomColors.premiumListsMediaRow2;
  static Color _accent(BuildContext context) => dsWear(context, DsAtomColors.premiumListsMediaRow2, (l) => l.accent);   // לובש עור · _accent0 = הערך-הכהה
  static const _text0 = DsAtomColors.premiumListsMediaRow3;
  static Color _text(BuildContext context) => dsWear(context, DsAtomColors.premiumListsMediaRow3, (l) => l.chipBg);   // לובש עור · _text0 = הערך-הכהה
  static const _muted0 = DsAtomColors.premiumListsMediaRow4;
  static Color _muted(BuildContext context) => dsWear(context, DsAtomColors.premiumListsMediaRow4, (l) => l.muted);   // לובש עור · _muted0 = הערך-הכהה

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {},
          borderRadius: BorderRadius.circular(18),
          child: Container(
            padding: const EdgeInsetsDirectional.fromSTEB(14, 12, 14, 12),
            decoration: BoxDecoration(
              color: _card(context),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: dsWear(context, DsAtomColors.premiumListsMediaRow5, (l) => l.onAccent).withValues(alpha: 0.06)),
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(14),
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [_accent(context), dsWear(context, DsAtomColors.premiumListsMediaRow6, (l) => l.accent)],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: _accent(context).withValues(alpha: 0.45),
                        blurRadius: 16,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  alignment: Alignment.center,
                  child: Text(glyph, style: const TextStyle(fontSize: 22)),
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
                  Container(
                    padding: const EdgeInsetsDirectional.symmetric(
                        horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: _accent(context).withValues(alpha: 0.16),
                      borderRadius: BorderRadius.circular(9),
                    ),
                    child: Text(
                      trailing!,
                      style: TextStyle(
                        color: dsWear(context, DsAtomColors.premiumListsMediaRow7, (l) => l.accentDark),
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
