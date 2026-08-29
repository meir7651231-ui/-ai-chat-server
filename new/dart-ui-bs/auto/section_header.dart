// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__trade_builder__connection_rule_studio:_SectionHeader (בנייה-חכמה main)
// משרת-גם (זהה-מבנית): screens__trade_builder__product_authoring_screen:_SectionHeader
import 'package:flutter/material.dart';

class SectionHeader extends StatelessWidget {
  const SectionHeader(this.title);

  final String title;

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: const TextStyle(
        color: BsTokens.inkLight,
        fontWeight: FontWeight.w800,
        fontSize: 15,
      ),
    );
  }
}
