// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__ai_hub_screen:AiMdHead (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import 'bs_tokens.dart';

class AiMdHead extends StatelessWidget {
  const AiMdHead({
    required this.ic,
    required this.title,
    required this.sub,
    super.key,
  });

  final String ic;
  final String title;
  final String sub;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(ic, style: const TextStyle(fontSize: 30)),
        const SizedBox(height: 4),
        Text(
          title,
          style: TextStyle(
            color: dsWear(context, BsTokens.inkLight, (l) => l.ink),
            fontWeight: FontWeight.w800,
            fontSize: 20,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          sub,
          style: TextStyle(color: dsWear(context, BsTokens.mutedLight, (l) => l.muted), fontSize: 13),
        ),
      ],
    );
  }
}
