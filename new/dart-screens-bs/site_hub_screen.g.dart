// 🏗️ חולל ע"י המנוע-המרכיב (gen-screen) — אל תערוך ידנית; ערוך את המניפסט.
// מקור: screens__site_hub_screen.manifest.json · המסך = דאטה; הקוד הזה = חיווט-בלבד (חוק-2).
// שערים/callbacks/טוקנים מוזרקים ע"י הלוח — אפס-IO, אפס-תוכן, אפס-הכרעות כאן.
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/hub_tile.dart';
import '../dart-ui-bs/auto/site_server_note.dart';

/// טוקני-העיצוב שהמסך צורך — הלוח מזרים מקטלוג-הטוקנים.
class SiteHubScreenTokens {
  const SiteHubScreenTokens();

}

class SiteHubScreenComposed extends StatelessWidget {
  const SiteHubScreenComposed({required this.onTap, required this.ic, required this.s, required this.t, required this.text, required this.t, super.key});

  final VoidCallback onTap;
  final String ic;
  final String s;
  final String t;
  final String text;
  final SiteHubScreenTokens t;

  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          const SizedBox(height: 8),
          HubTile(
            ic: ic,
            t: t,
            s: s,
            onTap: onTap,
          ),
          SiteServerNote(
            text: text,
          ),
        ],
      );
}
