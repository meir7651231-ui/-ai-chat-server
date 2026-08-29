// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__intel__intel_tab:_IntelBar (בנייה-חכמה main)
import 'package:flutter/material.dart';

class IntelBar extends StatelessWidget {
  const IntelBar({
    required this.pct,
    required this.color,
    required this.semanticPrefix,
  });

  final int pct;
  final Color color;
  final String semanticPrefix;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: '$semanticPrefix $pct%',
      child: ClipRRect(
        borderRadius: BorderRadius.circular(BsTokens.radiusPill),
        child: LinearProgressIndicator(
          value: (pct / 100).clamp(0.0, 1.0),
          minHeight: 7,
          backgroundColor: Theme.of(context).colorScheme.surfaceContainerHighest,
          valueColor: AlwaysStoppedAnimation<Color>(color),
        ),
      ),
    );
  }
}
