// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__tasks_screen:_DoneAll (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import 'bs_tokens.dart';

class DoneAll extends StatelessWidget {
  const DoneAll(this.text);
  final String text;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(vertical: BsTokens.space4),
        child: Text(
          text,
          textAlign: TextAlign.center,
          style: TextStyle(
            color: dsWear(context, BsTokens.inkLight, (l) => l.ink),
            fontWeight: FontWeight.w800,
            fontSize: 16,
          ),
        ),
      );
}
