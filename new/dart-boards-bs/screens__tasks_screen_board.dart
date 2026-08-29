// 🔌 חולל ע"י מחולל-הלוחות (board-gen) — הלוח = המקום-היחיד שנוגע-בחיווט (חוק-3).
// מקור-החיווט: screens__tasks_screen.dart (בנייה-חכמה main) · מחווט: 10 · TODO: 3.
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:buildsmart/data/persona_data.dart';
import 'package:buildsmart/data/phaseb_seeds.dart';
import 'package:buildsmart/screens/keyboard_tool_tree.dart';
import 'package:buildsmart/services/task_photo.dart';
import 'package:buildsmart/state/keyboard_overlay.dart';
import 'package:buildsmart/state/keyboard_screen_tools.dart';
import 'package:buildsmart/state/sys_chat.dart';
import 'package:buildsmart/state/tasks_engine.dart';
import 'package:buildsmart/theme/app_theme.dart';
import 'package:buildsmart/theme/tokens.dart';
import 'package:buildsmart/widgets/confirm_dialog.dart';
import 'package:buildsmart/widgets/reject_reason_dialog.dart';
import 'package:buildsmart/widgets/studio/cfg_text.dart';
import 'package:buildsmart/widgets/studio/cfg_visible.dart';
import 'package:buildsmart/widgets/toast.dart';
import '../dart-screens-bs/tasks_screen.g.dart';

class TasksScreenBoard extends ConsumerWidget {
  const TasksScreenBoard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return TasksScreenComposed(
      onApprove: () {} /* TODO-לוח */,
      onEdit: onEdit == null ? null : () => onEdit!(t),
      onReject: () {} /* TODO-לוח */,
      onTap: onApprove,
      days: t.days,
      detail: t.detail,
      id: t.id,
      label: onApprove.label,
      name: t.name,
      selected: 0 /* TODO-לוח: int */,
      status: t.status,
      text: 'אתה רואה את כל משימות הצוות. אשר עבודות שהוגשו ועקוב אחרי ההתקדמות.',
      workerLabel: _wk(t.worker),
      t: TasksScreenTokens(),
    );
  }
}
