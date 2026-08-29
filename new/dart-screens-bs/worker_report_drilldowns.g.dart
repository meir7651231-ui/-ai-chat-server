// 🏗️ חולל ע"י המנוע-המרכיב (gen-screen) — אל תערוך ידנית; ערוך את המניפסט.
// מקור: screens__worker_report_drilldowns.manifest.json · המסך = דאטה; הקוד הזה = חיווט-בלבד (חוק-2).
// שערים/callbacks/טוקנים מוזרקים ע"י הלוח — אפס-IO, אפס-תוכן, אפס-הכרעות כאן.
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/kv_line.dart';
import '../dart-ui-bs/auto/mini_status_pill.dart';
import '../dart-ui-bs/auto/worker_equipment_checklist_sheet_sec_h.dart';

/// טוקני-העיצוב שהמסך צורך — הלוח מזרים מקטלוג-הטוקנים.
class WorkerReportDrilldownsTokens {
  const WorkerReportDrilldownsTokens();

}

class WorkerReportDrilldownsComposed extends StatelessWidget {
  const WorkerReportDrilldownsComposed({required this.label, required this.status, required this.text, required this.value, required this.t, super.key});


  final String label;
  final String status;
  final String text;
  final String value;
  final WorkerReportDrilldownsTokens t;

  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          const SizedBox(height: 8),
          MiniStatusPill(
            status: status,
          ),
          WorkerEquipmentChecklistSheetSecH(
            text: text,
          ),
          KvLine(
            label: label,
            value: value,
          ),
        ],
      );
}
