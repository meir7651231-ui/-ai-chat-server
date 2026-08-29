// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__ai_hub_screen:AiCardSub (בנייה-חכמה main)
import 'package:flutter/material.dart';

class AiCardSub extends StatelessWidget {
  const AiCardSub(this.text, {super.key});

  final String text;

  @override
  Widget build(BuildContext context) => Text(
    text,
    style: const TextStyle(color: BsTokens.mutedLight, fontSize: 13),
  );
}
