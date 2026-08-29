// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__finance_hub_sheets:_CaEmpty (בנייה-חכמה main)
import 'package:flutter/material.dart';

class CaEmpty extends StatelessWidget {
  const CaEmpty(this.text);
  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 28),
      alignment: Alignment.center,
      child: Text(
        text,
        style: const TextStyle(color: BsTokens.mutedLight, fontSize: 14),
      ),
    );
  }
}
