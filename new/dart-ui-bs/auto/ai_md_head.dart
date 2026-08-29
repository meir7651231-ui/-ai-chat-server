// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__ai_hub_screen:AiMdHead (בנייה-חכמה main)
import 'package:flutter/material.dart';

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
          style: const TextStyle(
            color: BsTokens.inkLight,
            fontWeight: FontWeight.w800,
            fontSize: 20,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          sub,
          style: const TextStyle(color: BsTokens.mutedLight, fontSize: 13),
        ),
      ],
    );
  }
}
