// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__trade_builder__attribute_schema_editor:_ValueChip (בנייה-חכמה main)
import 'package:flutter/material.dart';

class ValueChip extends StatelessWidget {
  const ValueChip({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(BsTokens.radiusPill),
        border: Border.all(color: const Color(0xFFEDEDED)),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: BsTokens.inkLight,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
