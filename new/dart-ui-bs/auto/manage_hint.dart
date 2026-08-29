// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__manager_dashboard_screen:_ManageHint (בנייה-חכמה main)
import 'package:flutter/material.dart';

class ManageHint extends StatelessWidget {
  const ManageHint(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: BsTokens.space2),
      child: Text(
        text,
        style: const TextStyle(
          color: BsTokens.mutedLight,
          fontSize: 12,
          height: 1.3,
        ),
      ),
    );
  }
}
