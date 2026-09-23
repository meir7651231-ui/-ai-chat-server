// 🧽 לוטש ע"י מנוע-המטרות (data-lift v3) — דאטה/מודל/תבנית הורמו ל-props לפי מטרתם, אל תערוך ידנית.
// מוצא: screens__lipskey_product_sheet:_ZoomHint (בנייה-חכמה main) · צרור-1 · props-שורש: fallback
// התוכן: new/dart-data-bs/auto/screens__lipskey_product_sheet_content.dart
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'package:buildsmart/widgets/studio/cfg_text.dart';

class ZoomHint extends StatelessWidget {
  ZoomHint({required this.fallback});
  final String fallback;
  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: dsWear(context, DsAtomColors.autoZoomHint1, (l) => l.bg.withValues(alpha: 0.541)),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: dsWear(context, DsAtomColors.autoZoomHint2, (l) => l.bg.withValues(alpha: 0.122))),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.zoom_in, color: dsWear(context, DsAtomColors.autoZoomHint1, (l) => l.bg.withValues(alpha: 0.541)), size: 14),
            SizedBox(width: 4),
            CfgText('lipskey_product_sheet.zoom',
                fallback,
                style: TextStyle(
                    color: dsWear(context, DsAtomColors.autoZoomHint1, (l) => l.bg.withValues(alpha: 0.541)),
                    fontSize: 10,
                    fontWeight: FontWeight.w600)),
          ],
        ),
      );
}
