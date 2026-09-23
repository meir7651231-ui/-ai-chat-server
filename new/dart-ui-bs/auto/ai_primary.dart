// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__ai_hub_screen:AiPrimary (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class AiPrimary extends StatelessWidget {
  const AiPrimary({required this.label, required this.onTap, super.key});

  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: FilledButton(
        onPressed: onTap,
        style: FilledButton.styleFrom(
          backgroundColor: dsWear(context, BsTokens.brand, (l) => l.accent),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(BsTokens.radiusPill),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontWeight: FontWeight.w800,
            color: dsWear(context, DsAtomColors.autoAiPrimary1, (l) => l.onAccent),
          ),
        ),
      ),
    );
  }
}
