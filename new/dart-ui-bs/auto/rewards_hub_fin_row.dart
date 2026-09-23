// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__rewards_hub_screen:_FinRow (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class RewardsHubFinRow extends StatelessWidget {
  const RewardsHubFinRow({required this.label, required this.value, this.up = false});

  final String label;
  final String value;
  final bool up;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: TextStyle(color: dsWear(context, BsTokens.inkLight, (l) => l.ink), fontSize: 14)),
          Text(value,
              style: TextStyle(
                color: up ? dsWear(context, DsAtomColors.autoRewardsHubFinRow1, (l) => l.faint) : dsWear(context, BsTokens.inkLight, (l) => l.ink),
                fontWeight: FontWeight.w800,
                fontSize: 14,
              )),
        ],
      ),
    );
  }
}
