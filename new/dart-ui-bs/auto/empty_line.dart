// 🧽 לוטש ע"י מנוע-הליטוש (data-lift) — הדאטה הורמה ל-props, אל תערוך ידנית.
// מוצא: screens__intel__intel_tab:_EmptyLine (בנייה-חכמה main) · 1 props: text
// התוכן: new/dart-data-bs/auto/screens__intel__intel_tab_content.dart
import 'package:flutter/material.dart';
import 'bs_tokens.dart';

class EmptyLine extends StatelessWidget {
  const EmptyLine({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(color: BsTokens.mutedLight, fontSize: 13),
    );
  }
}
