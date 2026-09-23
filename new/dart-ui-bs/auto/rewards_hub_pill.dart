// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__rewards_hub_screen:_Pill (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class RewardsHubPill extends StatelessWidget {
  const RewardsHubPill(this.text, {this.danger = false});

  final String text;
  final bool danger;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: danger ? DsAtomColors.autoRewardsHubPill1 : DsAtomColors.autoRewardsHubPill2,
        borderRadius: BorderRadius.circular(BsTokens.radiusPill),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: danger ? DsAtomColors.autoRewardsHubPill3 : BsTokens.inkLight,
          fontWeight: FontWeight.w700,
          fontSize: 12,
        ),
      ),
    );
  }
}
