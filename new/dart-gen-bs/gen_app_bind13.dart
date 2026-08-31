// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מחבר-ישות-למסך: רשומות-ישות ⇒ מסך-Composed מפורק (סורק-אוטומטי). אל תערוך ידנית.
import '../dart-screens-bs/worker_report_drilldowns.g.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';

class GenAppBind13Screen extends StatelessWidget {
  const GenAppBind13Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => WorkerReportDrilldownsComposed(
          kvLineItems: appStore.records('app_ent13').map((r) => KvLineItem(label: r.entries.firstWhere((e) => !e.key.startsWith('__') && e.value.trim().isNotEmpty, orElse: () => MapEntry('', r['__id'] ?? '')).value.trim(), value: '')).toList(),
          text: '',
          t: const WorkerReportDrilldownsTokens(),
        ),
      );
}
