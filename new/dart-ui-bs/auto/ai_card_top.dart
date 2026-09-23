// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__ai_hub_screen:AiCardTop (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class AiCardTop extends StatelessWidget {
  const AiCardTop({
    required this.title,
    required this.pill,
    this.danger = false,
    super.key,
  });

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
            style: const TextStyle(
              color: BsTokens.inkLight,
              fontWeight: FontWeight.w800,
              fontSize: 14,
            ),
          ),
        ),
        const SizedBox(width: BsTokens.space2),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: danger ? dsWear(context, DsAtomColors.autoAiCardTop1, (l) => l.chipBg) : dsWear(context, DsAtomColors.autoAiCardTop2, (l) => l.chipBg),
            borderRadius: BorderRadius.circular(BsTokens.radiusPill),
          ),
          child: Text(
            pill,
            style: TextStyle(
              color: danger ? dsWear(context, DsAtomColors.autoAiCardTop3, (l) => l.danger) : BsTokens.inkLight,
              fontWeight: FontWeight.w700,
              fontSize: 12,
            ),
          ),
        ),
      ],
    );
  }
}
