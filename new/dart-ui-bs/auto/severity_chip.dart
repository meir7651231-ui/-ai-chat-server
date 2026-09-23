// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__defects_sheet:_SeverityChip (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class SeverityChip extends StatelessWidget {
  const SeverityChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? dsWear(context, BsTokens.brand, (l) => l.accent) : Theme.of(context).colorScheme.surface,
      borderRadius: BorderRadius.circular(BsTokens.radiusPill),
      child: InkWell(
        borderRadius: BorderRadius.circular(BsTokens.radiusPill),
        onTap: onTap,
        child: Container(
          constraints: const BoxConstraints(minHeight: 48),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(BsTokens.radiusPill),
            border: Border.all(
              color: selected ? dsWear(context, BsTokens.brand, (l) => l.accent) : dsWear(context, DsAtomColors.autoSeverityChip1, (l) => l.ink),
            ),
          ),
          child: Text(
            label,
            style: TextStyle(
              color: selected ? dsWear(context, DsAtomColors.autoSeverityChip2, (l) => l.onAccent) : BsTokens.inkLight,
              fontWeight: FontWeight.w700,
              fontSize: 13.5,
            ),
          ),
        ),
      ),
    );
  }
}
