// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__rewards_hub_screen:_CoinBanner (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';
import 'package:buildsmart/theme/config_theme.dart';

class CoinBanner extends StatelessWidget {
  const CoinBanner({required this.coins, required this.sub});

  final int coins;
  final String sub;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(BsTokens.space4),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [dsWear(context, DsAtomColors.autoCoinBanner1, (l) => l.ink), dsWear(context, DsAtomColors.autoCoinBanner2, (l) => l.ink)],
        ),
        borderRadius: BorderRadius.circular(cfgRadius(context)),
        border: Border.all(color: dsWear(context, DsAtomColors.autoCoinBanner3, (l) => l.ink)),
      ),
      child: Row(
        children: [
          const Text('🪙', style: TextStyle(fontSize: 34)),
          const SizedBox(width: BsTokens.space3),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '$coins BuildCoins',
                style: const TextStyle(
                  color: BsTokens.inkLight,
                  fontWeight: FontWeight.w800,
                  fontSize: 20,
                ),
              ),
              const SizedBox(height: 2),
              Text(sub,
                  style: const TextStyle(color: BsTokens.mutedLight, fontSize: 13)),
            ],
          ),
        ],
      ),
    );
  }
}
