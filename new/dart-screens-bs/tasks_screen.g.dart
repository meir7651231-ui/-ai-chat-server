// 🏗️ חולל ע"י המנוע-המרכיב (gen-screen) — אל תערוך ידנית; ערוך את המניפסט.
// מקור: screens__tasks_screen.manifest.json · המסך = דאטה; הקוד הזה = חיווט-בלבד (חוק-2).
// שערים/callbacks/טוקנים מוזרקים ע"י הלוח — אפס-IO, אפס-תוכן, אפס-הכרעות כאן.
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/approval_card.dart';
import '../dart-ui-bs/auto/done_all.dart';
import '../dart-ui-bs/auto/intro.dart';
import '../dart-ui-bs/auto/log_button.dart';
import '../dart-ui-bs/auto/new_task_button.dart';
import '../dart-ui-bs/auto/primary_btn.dart';
import '../dart-ui-bs/auto/proposal_card.dart';
import '../dart-ui-bs/auto/sec_h.dart';
import '../dart-ui-bs/auto/tasks_card.dart';
import '../dart-ui-bs/auto/worker_pick.dart';
import '../dart-data-bs/auto/screens__tasks_screen_content.dart';

/// טוקני-העיצוב שהמסך צורך — הלוח מזרים מקטלוג-הטוקנים.
class TasksScreenTokens {
  const TasksScreenTokens();

}

class TasksScreenComposed extends StatelessWidget {
  const TasksScreenComposed({required this.onApprove, required this.onEdit, required this.onReject, required this.onTap, required this.days, required this.detail, required this.id, required this.label, required this.name, required this.selected, required this.status, required this.text, required this.workerLabel, required this.t, super.key});

  final VoidCallback onApprove;
  final VoidCallback onEdit;
  final VoidCallback onReject;
  final VoidCallback onTap;
  final int days;
  final String detail;
  final int id;
  final String label;
  final String name;
  final int selected;
  final String status;
  final String text;
  final String workerLabel;
  final TasksScreenTokens t;

  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          const SizedBox(height: 8),
          Intro(
            text: text,
          ),
          NewTaskButton(
            fallback: new_task_button_fallback,
            onTap: onTap,
          ),
          LogButton(
            fallback: log_button_fallback,
            onTap: onTap,
          ),
          DoneAll(
            text: text,
          ),
          ApprovalCard(
            label: approval_card_label,
            fallback: approval_card_fallback,
            label2: approval_card_label2,
            name: name,
            workerLabel: workerLabel,
            onApprove: onApprove,
            onReject: onReject,
          ),
          ProposalCard(
            label: proposal_card_label,
            fallback: proposal_card_fallback,
            label2: proposal_card_label2,
            id: id,
            name: name,
            detail: detail,
            workerLabel: workerLabel,
            days: days,
            onApprove: onApprove,
            onReject: onReject,
          ),
          WorkerPick(
            selected: selected,
          ),
          PrimaryBtn(
            label: label,
            onTap: onTap,
          ),
          TasksCard(
            fallback: tasks_card_fallback,
            label: tasks_card_label,
            label2: tasks_card_label2,
            status: status,
            name: name,
            detail: detail,
            onTap: onTap,
            onEdit: onEdit,
          ),
          SecH(
            text: text,
          ),
        ],
      );
}
