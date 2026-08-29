// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__tasks_screen:_DoneAll (בנייה-חכמה main)
import 'package:flutter/material.dart';

class DoneAll extends StatelessWidget {
  const DoneAll(this.text);
  final String text;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(vertical: BsTokens.space4),
        child: Text(
          text,
          textAlign: TextAlign.center,
          style: const TextStyle(
            color: BsTokens.inkLight,
            fontWeight: FontWeight.w800,
            fontSize: 16,
          ),
        ),
      );
}
