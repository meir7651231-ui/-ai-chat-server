// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__contractor_hr_sheet:_DecideButton (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class DecideButton extends StatelessWidget {
  const DecideButton({
    required this.label,
    required this.color,
    required this.onPressed,
    this.textColor,
    this.bordered = false,
    super.key,
  });

  final String label;
  final Color color;
  final Color? textColor;
  final bool bordered;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: color,
      borderRadius: BorderRadius.circular(BsTokens.radiusPill),
      shape: bordered
          ? RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(BsTokens.radiusPill),
              side: BorderSide(color: dsWear(context, DsAtomColors.autoDecideButton1, (l) => l.ink)),
            )
          : null,
      child: InkWell(
        borderRadius: BorderRadius.circular(BsTokens.radiusPill),
        onTap: onPressed,
        child: Container(
          constraints: const BoxConstraints(minHeight: 48),
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(
              color: textColor ?? dsWear(context, DsAtomColors.autoDecideButton2, (l) => l.onAccent),
              fontWeight: FontWeight.w800,
              fontSize: 14,
            ),
          ),
        ),
      ),
    );
  }
}
