// 🏗️ חולל ע"י המנוע-המרכיב (gen-screen) — אל תערוך ידנית; ערוך את המניפסט.
// מקור: screens__studio__panes__theme_pane.manifest.json · המסך = דאטה; הקוד הזה = חיווט-בלבד (חוק-2).
// שערים/callbacks/טוקנים מוזרקים ע"י הלוח — אפס-IO, אפס-תוכן, אפס-הכרעות כאן.
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/label.dart';
import '../dart-ui-bs/auto/swatch.dart';
import '../dart-data-bs/auto/screens__studio__panes__theme_pane_content.dart';

/// טוקני-העיצוב שהמסך צורך — הלוח מזרים מקטלוג-הטוקנים.
class StudioPanesThemePaneTokens {
  const StudioPanesThemePaneTokens({required this.color});
  final Color color;
}

class StudioPanesThemePaneComposed extends StatelessWidget {
  const StudioPanesThemePaneComposed({required this.onTap, required this.selected, required this.text, required this.t, super.key});

  final VoidCallback onTap;
  final bool selected;
  final String text;
  final StudioPanesThemePaneTokens t;

  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          const SizedBox(height: 8),
          Label(
            text: text,
          ),
          Swatch(
            label: swatch_label,
            color: t.color,
            selected: selected,
            onTap: onTap,
          ),
        ],
      );
}
