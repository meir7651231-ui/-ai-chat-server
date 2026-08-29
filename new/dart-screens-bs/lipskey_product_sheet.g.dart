// 🏗️ חולל ע"י המנוע-המרכיב (gen-screen) — אל תערוך ידנית; ערוך את המניפסט.
// מקור: screens__lipskey_product_sheet.manifest.json · המסך = דאטה; הקוד הזה = חיווט-בלבד (חוק-2).
// שערים/callbacks/טוקנים מוזרקים ע"י הלוח — אפס-IO, אפס-תוכן, אפס-הכרעות כאן.
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/divider.dart';
import '../dart-ui-bs/auto/empty_hint.dart';
import '../dart-ui-bs/auto/picker_option.dart';
import '../dart-ui-bs/auto/qty_stepper.dart';
import '../dart-ui-bs/auto/section_title.dart';
import '../dart-ui-bs/auto/stage_row.dart';
import '../dart-ui-bs/auto/zoom_hint.dart';
import '../dart-data-bs/auto/screens__lipskey_product_sheet_content.dart';
import '../dart-data-bs/screens__lipskey_product_sheet_content.dart';

/// טוקני-העיצוב שהמסך צורך — הלוח מזרים מקטלוג-הטוקנים.
class LipskeyProductSheetTokens {
  const LipskeyProductSheetTokens();

}

class LipskeyProductSheetComposed extends StatelessWidget {
  const LipskeyProductSheetComposed({required this.onChanged, required this.onMarkDone, required this.onTap, required this.body, required this.body2, required this.emoji, required this.emphasized, required this.isSelected, required this.label, required this.label2, required this.message, required this.name, required this.qty, required this.subtitle, required this.tag, required this.text, required this.title2, required this.value, required this.t, super.key});

  final VoidCallback onChanged;
  final VoidCallback onMarkDone;
  final VoidCallback onTap;
  final String body;
  final String body2;
  final String emoji;
  final bool emphasized;
  final bool isSelected;
  final String label;
  final String label2;
  final String message;
  final String name;
  final int qty;
  final String? subtitle;
  final String tag;
  final String text;
  final String title2;
  final String value;
  final LipskeyProductSheetTokens t;

  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          const SizedBox(height: 8),
          Divider(
            
          ),
          SectionTitle(
            emoji: emoji,
            title: sheetChrome.title,
            subtitle: subtitle,
          ),
          StageRow(
            title: sheetChrome.title,
            body: body,
            label: label,
            title2: title2,
            body2: body2,
            label2: label2,
            message: message,
            name: name,
            onTap: onTap,
            tag: tag,
            emphasized: emphasized,
            onMarkDone: onMarkDone,
          ),
          QtyStepper(
            qty: qty,
            onChanged: onChanged,
          ),
          ZoomHint(
            fallback: zoom_hint_fallback,
          ),
          EmptyHint(
            text: text,
          ),
          PickerOption(
            value: value,
            isSelected: isSelected,
            onTap: onTap,
          ),
        ],
      );
}
