// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__rewards_hub_screen:_CaTop (בנייה-חכמה main) · צרור-2
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class CaTop extends StatelessWidget {
  const CaTop({required this.title, required this.pill, this.danger = false});

  final String title;
  final String pill;
  final bool danger;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Text(
            title,
            style: TextStyle(
              color: dsWear(context, BsTokens.inkLight, (l) => l.ink),
              fontWeight: FontWeight.w800,
              fontSize: 14,
            ),
          ),
        ),
        const SizedBox(width: BsTokens.space2),
        _Pill(pill, danger: danger),
      ],
    );
  }
}

class _Pill extends StatelessWidget {
  const _Pill(this.text, {this.danger = false});

  final String text;
  final bool danger;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: danger ? dsWear(context, DsAtomColors.autoCaTop1, (l) => l.chipBg) : dsWear(context, DsAtomColors.autoCaTop2, (l) => l.chipBg),
        borderRadius: BorderRadius.circular(BsTokens.radiusPill),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: danger ? dsWear(context, DsAtomColors.autoCaTop3, (l) => l.danger) : dsWear(context, BsTokens.inkLight, (l) => l.ink),
          fontWeight: FontWeight.w700,
          fontSize: 12,
        ),
      ),
    );
  }
}
