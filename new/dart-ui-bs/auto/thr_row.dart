// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__finance_hub_sheets:_ThrRow (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';
import 'package:buildsmart/theme/config_theme.dart';

class ThrRow extends StatelessWidget {
  const ThrRow({required this.label, required this.hit});
  final String label;
  final bool hit;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: BsTokens.space2),
      padding: const EdgeInsets.symmetric(
        horizontal: BsTokens.space3,
        vertical: BsTokens.space3,
      ),
      decoration: BoxDecoration(
        color: hit ? dsWear(context, DsAtomColors.autoThrRow1, (l) => l.ink) : dsWear(context, DsAtomColors.autoThrRow2, (l) => l.chipBg),
        borderRadius: BorderRadius.circular(cfgRadius(context)),
        border: Border.all(
          color: hit ? dsWear(context, DsAtomColors.autoThrRow3, (l) => l.ink) : dsWear(context, DsAtomColors.autoThrRow4, (l) => l.ink),
        ),
      ),
      child: Row(
        children: [
          // proto: hit ? '⚠️' : '○'
          Text(hit ? '⚠️' : '○', style: const TextStyle(fontSize: 16)),
          const SizedBox(width: BsTokens.space2),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(color: BsTokens.inkLight, fontSize: 13.5),
            ),
          ),
        ],
      ),
    );
  }
}
