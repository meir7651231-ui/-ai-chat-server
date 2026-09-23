// ✨ NavRow — שורת-ניווט: אייקון-גרדיאנט + כותרת/תת + chevron לוגי + onTap
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class NavRow extends StatelessWidget {
  final String glyph;
  final String title;
  final String sub;
  final VoidCallback? onTap;

  const NavRow({
    super.key,
    required this.glyph,
    required this.title,
    required this.sub,
    this.onTap,
  });

  static const _card0 = DsAtomColors.premiumListsNavRow1;

  static Color _card(BuildContext context) => dsWear(context, DsAtomColors.premiumListsNavRow1, (l) => l.card);   // לובש עור · _card0 = הערך-הכהה
  static const _accent0 = DsAtomColors.premiumListsNavRow2;
  static Color _accent(BuildContext context) => dsWear(context, DsAtomColors.premiumListsNavRow2, (l) => l.accent);   // לובש עור · _accent0 = הערך-הכהה
  static const _text0 = DsAtomColors.premiumListsNavRow3;
  static Color _text(BuildContext context) => dsWear(context, DsAtomColors.premiumListsNavRow3, (l) => l.chipBg);   // לובש עור · _text0 = הערך-הכהה
  static const _muted0 = DsAtomColors.premiumListsNavRow4;
  static Color _muted(BuildContext context) => dsWear(context, DsAtomColors.premiumListsNavRow4, (l) => l.muted);   // לובש עור · _muted0 = הערך-הכהה

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsetsDirectional.fromSTEB(14, 12, 10, 12),
            decoration: BoxDecoration(
              color: _card(context),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: dsWear(context, DsAtomColors.premiumListsNavRow5, (l) => l.onAccent).withValues(alpha: 0.05)),
            ),
            child: Row(
              children: [
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        _accent(context).withValues(alpha: 0.9),
                        dsWear(context, DsAtomColors.premiumListsNavRow6, (l) => l.accent).withValues(alpha: 0.9),
                      ],
                    ),
                  ),
                  alignment: Alignment.center,
                  child: Text(glyph, style: const TextStyle(fontSize: 19)),
                ),
                const SizedBox(width: 13),
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
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        sub,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: _muted(context),
                          fontSize: 12,
                          height: 1.2,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.chevron_left,
                  color: _muted(context),
                  size: 24,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
