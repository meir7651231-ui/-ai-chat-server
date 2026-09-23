// ✨ NavRow — שורת-ניווט: אייקון-גרדיאנט + כותרת/תת + chevron לוגי + onTap
import 'package:flutter/material.dart';
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

  static const Color _card = DsAtomColors.premiumListsNavRow1;
  static const Color _accent = DsAtomColors.premiumListsNavRow2;
  static const Color _text = DsAtomColors.premiumListsNavRow3;
  static const Color _muted = DsAtomColors.premiumListsNavRow4;

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
              color: _card,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: DsAtomColors.premiumListsNavRow5.withValues(alpha: 0.05)),
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
                        _accent.withValues(alpha: 0.9),
                        DsAtomColors.premiumListsNavRow6.withValues(alpha: 0.9),
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
                        style: const TextStyle(
                          color: _text,
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        sub,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: _muted,
                          fontSize: 12,
                          height: 1.2,
                        ),
                      ),
                    ],
                  ),
                ),
                const Icon(
                  Icons.chevron_left,
                  color: _muted,
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
