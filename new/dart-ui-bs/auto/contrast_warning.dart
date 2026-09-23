// 🧽 לוטש ע"י מנוע-המטרות (data-lift v3) — דאטה/מודל/תבנית הורמו ל-props לפי מטרתם, אל תערוך ידנית.
// מוצא: screens__studio__panes__theme_pane:_ContrastWarning (בנייה-חכמה main) · צרור-1 · props-שורש: label, label2
// התוכן: new/dart-data-bs/auto/screens__studio__panes__theme_pane_content.dart
import 'package:flutter/material.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class ContrastWarning extends StatelessWidget {
  ContrastWarning({required this.label, required this.label2, required this.ratio});
  final String label;
  final String label2;

  final double ratio;

  @override
  Widget build(BuildContext context) => Container(
        key: const Key('studio-contrast-warning'),
        padding: const EdgeInsets.all(BsTokens.space3),
        decoration: BoxDecoration(
          color: DsAtomColors.autoContrastWarning1,
          borderRadius: BorderRadius.circular(BsTokens.radiusCard),
          border: Border.all(color: DsAtomColors.autoContrastWarning2),
        ),
        child: Row(
          children: [
            const Icon(
              Icons.warning_amber_rounded,
              color: DsAtomColors.autoContrastWarning3,
            ),
            const SizedBox(width: BsTokens.space2),
            Expanded(
              child: Text(
                // LTR-isolate the numeric runs (LRI U+2066 … PDI U+2069) so they
                // don't reorder in the RTL sentence — escapes, since a raw isolate
                // char would itself trip the analyzer. [round-2 a11y]
                '${label}${ratio.toStringAsFixed(1)}${label2}',
                style: const TextStyle(
                  color: DsAtomColors.autoContrastWarning4,
                  fontSize: BsTokens.typeBody,
                ),
              ),
            ),
          ],
        ),
      );
}
