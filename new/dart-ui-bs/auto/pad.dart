// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__smart_home_screen:_Pad (בנייה-חכמה main)
import 'package:flutter/material.dart';

class Pad extends StatelessWidget {
  const Pad({required this.child});
  final Widget child;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: BsTokens.space4),
        child: child,
      );
}
