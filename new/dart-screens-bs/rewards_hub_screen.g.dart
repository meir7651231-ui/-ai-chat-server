// 🏗️ חולל ע"י המנוע-המרכיב (gen-screen) — אל תערוך ידנית; ערוך את המניפסט.
// מקור: screens__rewards_hub_screen.manifest.json · המסך = דאטה; הקוד הזה = חיווט-בלבד (חוק-2).
// שערים/callbacks/טוקנים מוזרקים ע"י הלוח — אפס-IO, אפס-תוכן, אפס-הכרעות כאן.
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/coin_banner.dart';
import '../dart-ui-bs/auto/fin_tile.dart';
import '../dart-ui-bs/auto/md_head.dart';
import '../dart-data-bs/auto/screens__rewards_hub_screen_content.dart';

/// טוקני-העיצוב שהמסך צורך — הלוח מזרים מקטלוג-הטוקנים.
class RewardsHubScreenTokens {
  const RewardsHubScreenTokens();

}

class RewardsHubScreenComposed extends StatelessWidget {
  const RewardsHubScreenComposed({required this.onTap, required this.coins, required this.ic, required this.sub, required this.title, required this.t, super.key});

  final VoidCallback onTap;
  final int coins;
  final String ic;
  final String sub;
  final String title;
  final RewardsHubScreenTokens t;

  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          const SizedBox(height: 8),
          MdHead(
            ic: ic,
            title: title,
            sub: sub,
          ),
          CoinBanner(
            coins: coins,
            sub: sub,
          ),
          FinTile(
            ic: ic,
            title: title,
            sub: sub,
            onTap: onTap,
          ),
        ],
      );
}
