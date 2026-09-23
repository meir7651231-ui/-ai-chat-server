// 🧽 לוטש ע"י מנוע-המטרות (data-lift v3) — דאטה/מודל/תבנית הורמו ל-props לפי מטרתם, אל תערוך ידנית.
// מוצא: screens__persona_picking_sheet:_DecisionLine (בנייה-חכמה main) · צרור-1 · props-שורש: label, label2, fallback, fallback2
// התוכן: new/dart-data-bs/auto/screens__persona_picking_sheet_content.dart
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'package:buildsmart/widgets/studio/cfg_visible.dart';
import 'package:buildsmart/widgets/studio/cfg_text.dart';
import 'bs_tokens.dart';

class DecisionLine extends StatelessWidget {
  DecisionLine({required this.label, required this.label2, required this.fallback, required this.fallback2, 
    required this.name,
    required this.qty,
    required this.onReplace,
    required this.onRemove,
  });
  final String label;
  final String label2;
  final String fallback;
  final String fallback2;

  final String name;
  final int qty;
  final VoidCallback onReplace;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: BsTokens.space2),
      child: Container(
        padding: const EdgeInsets.all(BsTokens.space3),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(BsTokens.radiusCard),
          border: Border.all(color: dsWear(context, DsAtomColors.autoDecisionLine1, (l) => l.ink)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              name,
              style: TextStyle(
                color: dsWear(context, BsTokens.inkLight, (l) => l.ink),
                fontWeight: FontWeight.w700,
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              '${label}$qty${label2}',
              style: TextStyle(
                color: dsWear(context, DsAtomColors.autoDecisionLine2, (l) => l.faint),
                fontSize: 12.5,
              ),
            ),
            const SizedBox(height: BsTokens.space2),
            Row(
              children: [
                Expanded(
                  // composite-hide: hiding this element drops the whole button.
                  child: CfgVisible(
                    'persona_picking_sheet.t08',
                    child: FilledButton(
                      onPressed: onReplace,
                      style: FilledButton.styleFrom(
                        backgroundColor: dsWear(context, BsTokens.brand, (l) => l.accent),
                        padding: const EdgeInsets.symmetric(vertical: 13),
                        shape: RoundedRectangleBorder(
                          borderRadius:
                              BorderRadius.circular(BsTokens.radiusPill),
                        ),
                      ),
                      child: CfgText(
                        'persona_picking_sheet.t08',
                        fallback,
                        style: TextStyle(
                          fontWeight: FontWeight.w800,
                          fontSize: 13.5,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: BsTokens.space2),
                Expanded(
                  // composite-hide: hiding this element drops the whole button.
                  child: CfgVisible(
                    'persona_picking_sheet.t09',
                    child: OutlinedButton(
                      onPressed: onRemove,
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 13),
                        side: BorderSide(color: dsWear(context, DsAtomColors.autoDecisionLine3, (l) => l.ink)),
                        shape: RoundedRectangleBorder(
                          borderRadius:
                              BorderRadius.circular(BsTokens.radiusPill),
                        ),
                      ),
                      child: CfgText(
                        'persona_picking_sheet.t09',
                        fallback2,
                        style: TextStyle(
                          color: dsWear(context, BsTokens.inkLight, (l) => l.ink),
                          fontWeight: FontWeight.w700,
                          fontSize: 13.5,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
