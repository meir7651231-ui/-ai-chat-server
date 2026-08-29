// 🏗️ חולל ע"י המנוע-המרכיב (gen-screen) — אל תערוך ידנית; ערוך את המניפסט.
// מקור: screens__contractor_hr_sheet.manifest.json · המסך = דאטה; הקוד הזה = חיווט-בלבד (חוק-2).
// שערים/callbacks/טוקנים מוזרקים ע"י הלוח — אפס-IO, אפס-תוכן, אפס-הכרעות כאן.
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/decide_button.dart';
import '../dart-ui-bs/auto/status_chip.dart';
import '../dart-ui-bs/auto/vacation_row.dart';
import '../dart-data-bs/auto/screens__contractor_hr_sheet_content.dart';

/// טוקני-העיצוב שהמסך צורך — הלוח מזרים מקטלוג-הטוקנים.
class ContractorHrSheetTokens {
  const ContractorHrSheetTokens({required this.color, required this.textColor});
  final Color color;
  final Color textColor;
}

class ContractorHrSheetComposed extends StatelessWidget {
  const ContractorHrSheetComposed({required this.onApprove, required this.onPressed, required this.bordered, required this.label, required this.reason, required this.status, required this.t, super.key});

  final VoidCallback onApprove;
  final VoidCallback onPressed;
  final bool bordered;
  final String label;
  final String reason;
  final String status;
  final ContractorHrSheetTokens t;

  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          const SizedBox(height: 8),
          VacationRow(
            label: vacation_row_label,
            label2: vacation_row_label2,
            status: status,
            reason: reason,
            label3: vacation_row_label3,
            label4: vacation_row_label4,
            onApprove: onApprove,
          ),
          DecideButton(
            label: label,
            color: t.color,
            textColor: t.textColor,
            bordered: bordered,
            onPressed: onPressed,
          ),
          StatusChip(
            label: status_chip_label,
            label2: status_chip_label2,
            status: status,
          ),
        ],
      );
}
