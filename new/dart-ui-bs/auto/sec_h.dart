// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__tasks_screen:_SecH (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import 'bs_tokens.dart';

class SecH extends StatelessWidget {
  const SecH(this.text);
  final String text;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: 4),
        child: Text(text,
            style: TextStyle(
                color: dsWear(context, BsTokens.inkLight, (l) => l.ink),
                fontWeight: FontWeight.w800,
                fontSize: 13.5)),
      );
}
