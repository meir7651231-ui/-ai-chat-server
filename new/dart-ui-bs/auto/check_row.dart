// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__trade_builder__trade_publish_sheet:_CheckRow (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import 'bs_tokens.dart';

class CheckRow extends StatelessWidget {
  const CheckRow({required this.pass, required this.label});

  final bool pass;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Text(
          pass ? '✓' : '✗',
          style: TextStyle(
            color: pass ? dsWear(context, BsTokens.successDark, (l) => l.success) : dsWear(context, BsTokens.dangerDark, (l) => l.danger),
            fontSize: 15,
            fontWeight: FontWeight.w800,
          ),
        ),
        const SizedBox(width: BsTokens.space2),
        Expanded(
          child: Text(
            label,
            style: TextStyle(
              color: dsWear(context, BsTokens.inkLight, (l) => l.ink),
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }
}
