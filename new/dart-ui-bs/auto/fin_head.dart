// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__finance_hub_sheets:_FinHead (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import 'bs_tokens.dart';

class FinHead extends StatelessWidget {
  const FinHead({required this.ic, required this.title, required this.sub});
  final String ic;
  final String title;
  final String sub;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          children: [
            Text(ic, style: const TextStyle(fontSize: 26)),
            const SizedBox(width: BsTokens.space2),
            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  color: dsWear(context, BsTokens.inkLight, (l) => l.ink),
                  fontWeight: FontWeight.w800,
                  fontSize: 19,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          sub,
          style: TextStyle(color: dsWear(context, BsTokens.mutedLight, (l) => l.muted), fontSize: 13),
        ),
        const SizedBox(height: BsTokens.space4),
      ],
    );
  }
}
