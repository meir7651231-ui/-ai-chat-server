// 🏗️ חולל ע"י המנוע-המרכיב (gen-screen) — אל תערוך ידנית; ערוך את המניפסט.
// מקור: screens__courier_certs_screen.manifest.json · המסך = דאטה; הקוד הזה = חיווט-בלבד (חוק-2).
// שערים/callbacks/טוקנים מוזרקים ע"י הלוח — אפס-IO, אפס-תוכן, אפס-הכרעות כאן.
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/preset_chip.dart';

/// טוקני-העיצוב שהמסך צורך — הלוח מזרים מקטלוג-הטוקנים.
class CourierCertsScreenTokens {
  const CourierCertsScreenTokens();

}

class CourierCertsScreenComposed extends StatelessWidget {
  const CourierCertsScreenComposed({required this.onTap, required this.label, required this.selected, required this.t, super.key});

  final VoidCallback onTap;
  final String label;
  final bool selected;
  final CourierCertsScreenTokens t;

  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          const SizedBox(height: 8),
          PresetChip(
            label: label,
            selected: selected,
            onTap: onTap,
          ),
        ],
      );
}
