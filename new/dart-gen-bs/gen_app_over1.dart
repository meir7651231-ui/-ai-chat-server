// ✨ חולל ע"י מנוע-ההרכבה (render-ds/compose) — אטום+אטום ⇒ מסך-סקירה מורכב מנתוני-הישות. אל תערוך ידנית.
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/callout.dart';
import '../dart-ui-bs/auto/ai_bar.dart';
import '../dart-ui-bs/ds/ds_bars.dart';
import '../dart-ui-bs/ds/ds_board.dart';
import '../dart-data-bs/auto/gen_app_over1_content.dart';

class GenAppOver1Screen extends StatelessWidget {
  const GenAppOver1Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Wrap(spacing: 10, runSpacing: 10, children: [
              Callout(value: appStore.count('app_ent1').toString(), label: gen_app_over1_c0),
              Callout(value: appStore.sum('app_ent1', gen_app_over1_c1).toStringAsFixed(0), label: gen_app_over1_c2),
            ]),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: AiBar(pct: appStore.count('app_ent1') == 0 ? 0 : (appStore.records('app_ent1').where((r) => appStore.stageOf('app_ent1', r['__id'] ?? '') >= 6).length * 100 ~/ appStore.count('app_ent1'))),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: DsBars(labels: appStore.records('app_ent1').take(12).map((r) => r[gen_app_over1_c4] ?? '').toList(), values: appStore.records('app_ent1').take(12).map((r) => double.tryParse(r[gen_app_over1_c3] ?? '') ?? 0).toList()),
          ),
          Expanded(child: DsBoard(stages: const [gen_app_over1_c5, gen_app_over1_c6, gen_app_over1_c7, gen_app_over1_c8, gen_app_over1_c9, gen_app_over1_c10, gen_app_over1_c11], records: appStore.records('app_ent1'), stageOf: (r) => appStore.stageOf('app_ent1', r['__id'] ?? ''), titleOf: (r) => r[gen_app_over1_c12] ?? '', onMove: (id, to) => appStore.setStage('app_ent1', id, to))),
          ],
        ),
      );
}
