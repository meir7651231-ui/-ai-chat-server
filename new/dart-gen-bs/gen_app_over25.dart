// ✨ חולל ע"י מנוע-ההרכבה (render-ds/compose) — אטום+אטום ⇒ מסך-סקירה מורכב מנתוני-הישות. אל תערוך ידנית.
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/callout.dart';
import '../dart-ui-bs/auto/ai_bar.dart';
import '../dart-ui-bs/ds/ds_board.dart';
import '../dart-data-bs/auto/gen_app_over25_content.dart';

class GenAppOver25Screen extends StatelessWidget {
  const GenAppOver25Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Wrap(spacing: 10, runSpacing: 10, children: [
              Callout(value: appStore.count('app_ent26').toString(), label: gen_app_over25_c0),
            ]),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: AiBar(pct: appStore.count('app_ent26') == 0 ? 0 : (appStore.records('app_ent26').where((r) => appStore.stageOf('app_ent26', r['__id'] ?? '') >= 4).length * 100 ~/ appStore.count('app_ent26'))),
          ),
          Expanded(child: DsBoard(stages: const [gen_app_over25_c1, gen_app_over25_c2, gen_app_over25_c3, gen_app_over25_c4, gen_app_over25_c5], records: appStore.records('app_ent26'), stageOf: (r) => appStore.stageOf('app_ent26', r['__id'] ?? ''), titleOf: (r) => r[gen_app_over25_c6] ?? '', onMove: (id, to) => appStore.setStage('app_ent26', id, to))),
          ],
        ),
      );
}
