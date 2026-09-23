// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__courier_settings_screen:_SectionTile (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';
import 'package:buildsmart/theme/app_theme.dart';

class SectionTile extends StatelessWidget {
  const SectionTile({
    required this.emoji,
    required this.title,
    required this.children,
  });

  final String emoji;
  final String title;
  final List<Widget> children;

  int get _activeCount => children.length;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      color: Theme.of(context).colorScheme.surface,
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          tilePadding: const EdgeInsets.symmetric(horizontal: 16),
          childrenPadding: const EdgeInsets.only(bottom: 8),
          iconColor: dsWear(context, DsAtomColors.autoSectionTile1, (l) => l.bg.withValues(alpha: 0.541)),
          collapsedIconColor: dsWear(context, DsAtomColors.autoSectionTile1, (l) => l.bg.withValues(alpha: 0.541)),
          leading: Text(emoji, style: const TextStyle(fontSize: 22)),
          trailing:
              _activeCount == 0
                  ? null
                  : Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: dsWear(context, BsTokens.brand, (l) => l.accent),
                      borderRadius: BorderRadius.circular(11),
                    ),
                    child: Text(
                      '$_activeCount',
                      style: TextStyle(
                        // F-28 — bsOnAccent על מילוי-מותג (לא לבן קשיח): מכבד
                        // את מתג הניגודיות-הגבוהה שנמצא במסך הזה עצמו.
                        color: bsOnAccent(context),
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
          title: Text(
            title,
            style: const TextStyle(
              color: BsTokens.inkLight,
              fontSize: 15,
              fontWeight: FontWeight.w600,
            ),
          ),
          children: children,
        ),
      ),
    );
  }
}
