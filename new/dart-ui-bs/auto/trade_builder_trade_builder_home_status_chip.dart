// 🧽 לוטש ע"י מנוע-הליטוש (data-lift) — הדאטה הורמה ל-props, אל תערוך ידנית.
// מוצא: screens__trade_builder__trade_builder_home:_StatusChip (בנייה-חכמה main) · 2 props: label, label2
// התוכן: new/dart-data-bs/auto/screens__trade_builder__trade_builder_home_content.dart
import 'package:flutter/material.dart';
import 'bs_tokens.dart';

class TradeBuilderTradeBuilderHomeStatusChip extends StatelessWidget {
  const TradeBuilderTradeBuilderHomeStatusChip({required this.label, required this.label2, required this.published});
  final String label;
  final String label2;

  final bool published;

  @override
  Widget build(BuildContext context) {
    final color =
        published ? const Color(0xFF1F8A4C) : const Color(0xFFB45309);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(BsTokens.radiusPill),
      ),
      child: Text(
        published ? label : label2,
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}
