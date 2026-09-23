// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__profile_screen:_SectionLabel (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import 'bs_tokens.dart';

class SectionLabel extends StatelessWidget {
  const SectionLabel(this.text);

  final String text;

  @override
  Widget build(BuildContext context) => Text(
        text,
        style: TextStyle(
          color: dsWear(context, BsTokens.mutedLight, (l) => l.muted),
          fontWeight: FontWeight.w800,
          fontSize: 13,
          letterSpacing: 0.5,
        ),
      );
}
