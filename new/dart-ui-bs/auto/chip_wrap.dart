// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__catalog_screen:_ChipWrap (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';
import 'package:buildsmart/theme/app_theme.dart';

class ChipWrap extends StatelessWidget {
  const ChipWrap({
    required this.options,
    required this.selected,
    required this.onSelect,
  });
  final List<String> options;
  final String? selected;
  final void Function(String) onSelect;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        for (final o in options)
          GestureDetector(
            onTap: () => onSelect(o),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: selected == o ? dsWear(context, BsTokens.brand, (l) => l.accent) : Colors.transparent,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: selected == o
                      ? dsWear(context, BsTokens.brand, (l) => l.accent)
                      : dsWear(context, DsAtomColors.autoChipWrap1, (l) => l.ink),
                ),
              ),
              child: Text(
                o,
                style: TextStyle(
                  color: selected == o ? bsOnAccent(context) : dsWear(context, DsAtomColors.autoChipWrap2, (l) => l.faint),
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
      ],
    );
  }
}
