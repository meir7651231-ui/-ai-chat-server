// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מחבר-ישות-למסך: רשומות-ישות ⇒ מסך-Composed מפורק (סורק-אוטומטי). אל תערוך ידנית.
import '../dart-screens-bs/tasks_screen.g.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';

class GenAppBind11Screen extends StatelessWidget {
  const GenAppBind11Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => TasksScreenComposed(
          onTap: () {},
          approvalCardItems: appStore.records('app_ent11').map((r) => ApprovalCardItem(name: r.entries.firstWhere((e) => !e.key.startsWith('__') && e.value.trim().isNotEmpty, orElse: () => MapEntry('', r['__id'] ?? '')).value.trim(), workerLabel: '', onApprove: () {}, onReject: () {})).toList(),
          children: const [],
          detail: '',
          proposalCardItems: const [],
          text: '',
          title: '',
          titleId: '',
          t: const TasksScreenTokens(),
        ),
      );
}
