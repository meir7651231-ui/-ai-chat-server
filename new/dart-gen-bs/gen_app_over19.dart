// ✨ חולל ע"י מנוע-ההרכבה (render-ds/compose) — אטום+אטום ⇒ מסך-סקירה מורכב מנתוני-הישות. אל תערוך ידנית.
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/callout.dart';
import '../dart-ui-bs/auto/ai_bar.dart';
import '../dart-ui-bs/ds/ds_board.dart';
import '../dart-data-bs/auto/gen_app_over19_content.dart';

class GenAppOver19Screen extends StatelessWidget {
  const GenAppOver19Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Wrap(spacing: 10, runSpacing: 10, children: [
              Callout(value: appStore.count('app_ent19').toString(), label: gen_app_over19_c0),
            ]),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: AiBar(pct: appStore.count('app_ent19') == 0 ? 0 : (appStore.records('app_ent19').where((r) => appStore.stageOf('app_ent19', r['__id'] ?? '') >= 4).length * 100 ~/ appStore.count('app_ent19'))),
          ),
          Expanded(child: DsBoard(stages: const [gen_app_over19_c1, gen_app_over19_c2, gen_app_over19_c3, gen_app_over19_c4, gen_app_over19_c5], records: appStore.records('app_ent19'), stageOf: (r) => appStore.stageOf('app_ent19', r['__id'] ?? ''), titleOf: (r) => r[gen_app_over19_c6] ?? '', onMove: (id, to) => appStore.setStage('app_ent19', id, to))),
          ],
        ),
      );
}
