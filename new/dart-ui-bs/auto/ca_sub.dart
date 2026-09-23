// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__rewards_hub_screen:_CaSub (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import 'bs_tokens.dart';

class CaSub extends StatelessWidget {
  const CaSub(this.text);

  final String text;

  @override
  Widget build(BuildContext context) => Text(
        text,
        style: TextStyle(color: dsWear(context, BsTokens.mutedLight, (l) => l.muted), fontSize: 13),
      );
}
