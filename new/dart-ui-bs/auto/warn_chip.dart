// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__trade_builder__attribute_schema_editor:_WarnChip (בנייה-חכמה main) · צרור-2
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class WarnChip extends StatelessWidget {
  const WarnChip({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: _kWarnColor(context).withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(BsTokens.radiusPill),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: _kWarnColor(context),
          fontSize: 12,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}


Color _kWarnColor(BuildContext context) => dsWear(context, DsAtomColors.autoWarnChip1, (l) => l.danger);   // לובש עור · _kWarnColor0 = הערך-הכהה
