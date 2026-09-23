// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__finance_hub_sheets:_ReportH2 (בנייה-חכמה main) · צרור-2
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import 'bs_tokens.dart';

class ReportH2 extends StatelessWidget {
  const ReportH2(this.text);
  final String text;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: BsTokens.space2),
    child: Text(
      text,
      style: TextStyle(
        color: _kBrandTeal(context),
        fontWeight: FontWeight.w700,
        fontSize: 14,
      ),
    ),
  );
}

const _kBrandTeal0 = BsTokens.brand;

Color _kBrandTeal(BuildContext context) => dsWear(context, BsTokens.brand, (l) => l.accent);   // לובש עור · _kBrandTeal0 = הערך-הכהה
