// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__profile_screen:_FieldLabel (בנייה-חכמה main) · צרור-2
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import 'bs_tokens.dart';

class FieldLabel extends StatelessWidget {
  const FieldLabel(this.text);

  final String text;

  @override
  Widget build(BuildContext context) => Text(
        text,
        style: TextStyle(
          color: _ink(context),
          fontWeight: FontWeight.w700,
          fontSize: 14,
        ),
      );
}

const _ink0 = BsTokens.inkLight;

Color _ink(BuildContext context) => dsWear(context, BsTokens.inkLight, (l) => l.ink);   // לובש עור · _ink0 = הערך-הכהה
