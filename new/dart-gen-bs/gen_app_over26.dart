// ✨ חולל ע"י מנוע-ההרכבה (render-ds/compose) — אטום+אטום ⇒ מסך-סקירה מורכב מנתוני-הישות. אל תערוך ידנית.
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/callout.dart';
import '../dart-ui-bs/auto/ai_bar.dart';
import '../dart-ui-bs/ds/ds_board.dart';
import '../dart-data-bs/auto/gen_app_over26_content.dart';

class GenAppOver26Screen extends StatelessWidget {
  const GenAppOver26Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Wrap(spacing: 10, runSpacing: 10, children: [
              Callout(value: appStore.count('app_ent27').toString(), label: gen_app_over26_c0),
            ]),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: AiBar(pct: appStore.count('app_ent27') == 0 ? 0 : (appStore.records('app_ent27').where((r) => appStore.stageOf('app_ent27', r['__id'] ?? '') >= 3).length * 100 ~/ appStore.count('app_ent27'))),
          ),
          Expanded(child: DsBoard(stages: const [gen_app_over26_c1, gen_app_over26_c2, gen_app_over26_c3, gen_app_over26_c4], records: appStore.records('app_ent27'), stageOf: (r) => appStore.stageOf('app_ent27', r['__id'] ?? ''), titleOf: (r) => r[gen_app_over26_c5] ?? '', onMove: (id, to) => appStore.setStage('app_ent27', id, to))),
          ],
        ),
      );
}
