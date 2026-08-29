// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__studio__panes__theme_pane:_Label (בנייה-חכמה main)
import 'package:flutter/material.dart';

class Label extends StatelessWidget {
  const Label(this.text);

  final String text;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: BsTokens.space2),
        child: Text(
          text,
          style: const TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: BsTokens.typeSubhead,
            color: BsTokens.inkLight,
          ),
        ),
      );
}
