// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__intel__intel_tab:_LiveDot (בנייה-חכמה main)
import 'package:flutter/material.dart';

class LiveDot extends StatelessWidget {
  const LiveDot();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 8,
      height: 8,
      decoration: const BoxDecoration(
        color: BsTokens.success,
        shape: BoxShape.circle,
      ),
    );
  }
}
