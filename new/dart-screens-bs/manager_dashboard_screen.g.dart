// 🏗️ חולל ע"י המנוע-המרכיב (gen-screen) — אל תערוך ידנית; ערוך את המניפסט.
// מקור: screens__manager_dashboard_screen.manifest.json · המסך = דאטה; הקוד הזה = חיווט-בלבד (חוק-2).
// שערים/callbacks/טוקנים מוזרקים ע"י הלוח — אפס-IO, אפס-תוכן, אפס-הכרעות כאן.
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/advance_button.dart';
import '../dart-ui-bs/auto/dot.dart';
import '../dart-ui-bs/auto/manager_dashboard_credit_bar.dart';
import '../dart-ui-bs/auto/mini_tracker.dart';
import '../dart-ui-bs/auto/pipeline_row.dart';
import '../dart-ui-bs/auto/sheet_advance_button.dart';
import '../dart-ui-bs/auto/stage_pill.dart';
import '../dart-data-bs/auto/screens__manager_dashboard_screen_content.dart';
import '../dart-data-bs/screens__manager_dashboard_screen_content.dart';

/// טוקני-העיצוב שהמסך צורך — הלוח מזרים מקטלוג-הטוקנים.
class ManagerDashboardScreenTokens {
  const ManagerDashboardScreenTokens({required this.color});
  final Color color;
}

class ManagerDashboardScreenComposed extends StatelessWidget {
  const ManagerDashboardScreenComposed({required this.onPressed, required this.onTap, required this.count, required this.max, required this.pct, required this.stageIdx, required this.t, super.key});

  final VoidCallback onPressed;
  final VoidCallback onTap;
  final int count;
  final int max;
  final int pct;
  final int stageIdx;
  final ManagerDashboardScreenTokens t;

  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          const SizedBox(height: 8),
          Dot(
            color: t.color,
          ),
          PipelineRow(
            label: managerShellContent.label,
            count: count,
            max: max,
            color: t.color,
            onTap: onTap,
          ),
          StagePill(
            label: managerShellContent.label,
            color: t.color,
          ),
          MiniTracker(
            stageIdx: stageIdx,
          ),
          AdvanceButton(
            fallback: advance_button_fallback,
            onPressed: onPressed,
          ),
          SheetAdvanceButton(
            title: sheet_advance_button_title,
            body: sheet_advance_button_body,
            label: managerShellContent.label,
            onPressed: onPressed,
          ),
          ManagerDashboardCreditBar(
            label: manager_dashboard_credit_bar_label,
            pct: pct,
            color: t.color,
          ),
        ],
      );
}
