// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__ai_hub_screen:AiBar (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class AiBar extends StatelessWidget {
  const AiBar({required this.pct, this.danger = false, super.key});

  final int pct;
  final bool danger;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(BsTokens.radiusPill),
      child: LinearProgressIndicator(
        value: pct / 100,
        minHeight: 8,
        backgroundColor: Theme.of(context).colorScheme.surfaceContainerHighest,
        valueColor: AlwaysStoppedAnimation<Color>(
          danger ? dsWear(context, DsAtomColors.autoAiBar1, (l) => l.danger) : dsWear(context, BsTokens.brand, (l) => l.accent),
        ),
      ),
    );
  }
}
