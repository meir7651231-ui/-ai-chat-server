// 🧽 לוטש ע"י מנוע-המטרות (data-lift v3) — דאטה/מודל/תבנית הורמו ל-props לפי מטרתם, אל תערוך ידנית.
// מוצא: screens__studio__panes__find_replace_pane:_WideWarning (בנייה-חכמה main) · צרור-1 · props-שורש: label
// התוכן: new/dart-data-bs/auto/screens__studio__panes__find_replace_pane_content.dart
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class WideWarning extends StatelessWidget {
  WideWarning({required this.label, required this.count});
  final String label;

  final int count;

  @override
  Widget build(BuildContext context) => Container(
        margin: const EdgeInsets.symmetric(horizontal: BsTokens.space4),
        padding: const EdgeInsets.all(BsTokens.space3),
        decoration: BoxDecoration(
          color: dsWear(context, DsAtomColors.autoWideWarning1, (l) => l.ink),
          borderRadius: BorderRadius.circular(BsTokens.radiusCard),
          border: Border.all(color: dsWear(context, DsAtomColors.autoWideWarning2, (l) => l.warn)),
        ),
        child: Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: dsWear(context, DsAtomColors.autoWideWarning3, (l) => l.danger)),
            const SizedBox(width: BsTokens.space2),
            Expanded(
              child: Text(
                '$count${label}',
                style: TextStyle(color: dsWear(context, DsAtomColors.autoWideWarning4, (l) => l.track)),
              ),
            ),
          ],
        ),
      );
}
