// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__manager_dashboard_screen:_JourneyEmpty (בנייה-חכמה main)
import 'package:flutter/material.dart';

class JourneyEmpty extends StatelessWidget {
  const JourneyEmpty({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) => Text(
        text,
        style: const TextStyle(color: BsTokens.mutedLight, fontSize: 13),
      );
}
