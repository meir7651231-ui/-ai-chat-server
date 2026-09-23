// 🧽 לוטש ע"י מנוע-המטרות (data-lift v3) — דאטה/מודל/תבנית הורמו ל-props לפי מטרתם, אל תערוך ידנית.
// מוצא: screens__contractor_tools_sheets:_SheetHandle (בנייה-חכמה main) · צרור-1 · props-שורש: label, tooltip, onPressed
// התוכן: new/dart-data-bs/auto/screens__contractor_tools_sheets_content.dart
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';

class ContractorToolsSheetsSheetHandle extends StatelessWidget {
  ContractorToolsSheetsSheetHandle({required this.label, required this.tooltip, required this.onPressed});
  final String label;
  final String tooltip;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        Container(
          width: 36,
          height: 4,
          decoration: BoxDecoration(
            color: dsWear(context, DsAtomColors.autoContractorToolsSheetsSheetHandle1, (l) => l.bg.withValues(alpha: 0.122)),
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        Align(
          alignment: Alignment.centerLeft,
          child: Semantics(
            button: true,
            label: label,
            child: IconButton(
              tooltip: tooltip,
              icon: Icon(Icons.close, color: dsWear(context, DsAtomColors.autoContractorToolsSheetsSheetHandle2, (l) => l.muted)),
              onPressed: onPressed,
            ),
          ),
        ),
      ],
    );
  }
}
