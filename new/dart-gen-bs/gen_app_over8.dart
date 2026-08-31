// ✨ חולל ע"י מנוע-ההרכבה (render-ds/compose) — אטום+אטום ⇒ מסך-סקירה מורכב מנתוני-הישות. אל תערוך ידנית.
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/callout.dart';
import '../dart-ui-bs/auto/ai_bar.dart';
import '../dart-ui-bs/ds/ds_bars.dart';
import '../dart-ui-bs/ds/ds_board.dart';
import '../dart-data-bs/auto/gen_app_over8_content.dart';

class GenAppOver8Screen extends StatelessWidget {
  const GenAppOver8Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Wrap(spacing: 10, runSpacing: 10, children: [
              Callout(value: appStore.count('app_ent8').toString(), label: gen_app_over8_c0),
              Callout(value: appStore.sum('app_ent8', gen_app_over8_c1).toStringAsFixed(0), label: gen_app_over8_c2),
              Callout(value: appStore.sum('app_ent8', gen_app_over8_c3).toStringAsFixed(0), label: gen_app_over8_c4),
            ]),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: AiBar(pct: appStore.count('app_ent8') == 0 ? 0 : (appStore.records('app_ent8').where((r) => appStore.stageOf('app_ent8', r['__id'] ?? '') >= 3).length * 100 ~/ appStore.count('app_ent8'))),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: DsBars(labels: appStore.records('app_ent8').take(12).map((r) => r[gen_app_over8_c6] ?? '').toList(), values: appStore.records('app_ent8').take(12).map((r) => double.tryParse(r[gen_app_over8_c5] ?? '') ?? 0).toList()),
          ),
          Expanded(child: DsBoard(stages: const [gen_app_over8_c7, gen_app_over8_c8, gen_app_over8_c9, gen_app_over8_c10], records: appStore.records('app_ent8'), stageOf: (r) => appStore.stageOf('app_ent8', r['__id'] ?? ''), titleOf: (r) => r[gen_app_over8_c11] ?? '', onMove: (id, to) => appStore.setStage('app_ent8', id, to))),
          ],
        ),
      );
}
