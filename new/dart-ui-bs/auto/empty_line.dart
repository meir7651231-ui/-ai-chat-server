// 🧽 לוטש ע"י מנוע-המטרות (data-lift v2) — הדאטה הורמה ל-props לפי מטרתה, אל תערוך ידנית.
// מוצא: screens__intel__intel_tab:_EmptyLine (בנייה-חכמה main) · צרור-1 · props-שורש: text
// התוכן: new/dart-data-bs/auto/screens__intel__intel_tab_content.dart
import 'package:flutter/material.dart';
import 'bs_tokens.dart';

class EmptyLine extends StatelessWidget {
  EmptyLine({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(color: BsTokens.mutedLight, fontSize: 13),
    );
  }
}
