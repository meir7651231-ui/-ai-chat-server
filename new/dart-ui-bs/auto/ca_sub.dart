// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__rewards_hub_screen:_CaSub (בנייה-חכמה main)
import 'package:flutter/material.dart';

class CaSub extends StatelessWidget {
  const CaSub(this.text);

  final String text;

  @override
  Widget build(BuildContext context) => Text(
        text,
        style: const TextStyle(color: BsTokens.mutedLight, fontSize: 13),
      );
}
