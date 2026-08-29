// 🏗️ חולל ע"י המנוע-המרכיב (gen-screen) — אל תערוך ידנית; ערוך את המניפסט.
// מקור: screens__store_profile_screen.manifest.json · המסך = דאטה; הקוד הזה = חיווט-בלבד (חוק-2).
// שערים/callbacks/טוקנים מוזרקים ע"י הלוח — אפס-IO, אפס-תוכן, אפס-הכרעות כאן.
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/sstat.dart';

/// טוקני-העיצוב שהמסך צורך — הלוח מזרים מקטלוג-הטוקנים.
class StoreProfileScreenTokens {
  const StoreProfileScreenTokens();

}

class StoreProfileScreenComposed extends StatelessWidget {
  const StoreProfileScreenComposed({required this.label, required this.value, required this.t, super.key});


  final String label;
  final String value;
  final StoreProfileScreenTokens t;

  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          const SizedBox(height: 8),
          SStat(
            value: value,
            label: label,
          ),
        ],
      );
}
