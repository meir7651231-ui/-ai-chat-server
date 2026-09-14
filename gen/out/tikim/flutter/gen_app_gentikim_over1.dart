// ✨ חולל ע"י מנוע-ההרכבה (render-ds/compose) — אטום+אטום ⇒ מסך-סקירה מורכב מנתוני-הישות. אל תערוך ידנית.
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/callout.dart';
import '../dart-ui-bs/premium/lists/expandable_tile.dart';
import '../dart-ui-bs/auto/bar.dart';
import '../dart-ui-bs/ds/ds_bars.dart';
import '../dart-ui-bs/ds/ds_board.dart';
import '../dart-data-bs/auto/gen_app_gentikim_over1_content.dart';

class GenAppGentikimOver1Screen extends StatelessWidget {
  const GenAppGentikimOver1Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Wrap(spacing: 10, runSpacing: 10, children: [
              Callout(value: appStore.count('app_gentikim_ent2').toString(), label: gen_app_gentikim_over1_c0),
              Callout(value: appStore.sum('app_gentikim_ent2', gen_app_gentikim_over1_c1).toStringAsFixed(0), label: gen_app_gentikim_over1_c2),
            ]),
          ),
          if (appStore.records('app_gentikim_ent2').isNotEmpty)
            Padding(
              padding: const EdgeInsets.all(12),
              child: Builder(builder: (context) {
                final r = appStore.records('app_gentikim_ent2').first;
                return ExpandableTile(title: r[gen_app_gentikim_over1_c3] ?? '', body: r[gen_app_gentikim_over1_c4] ?? '');
              }),
            ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Bar(pct: appStore.count('app_gentikim_ent2') == 0 ? 0 : (appStore.records('app_gentikim_ent2').where((r) => appStore.stageOf('app_gentikim_ent2', r['__id'] ?? '') >= 2).length * 100 ~/ appStore.count('app_gentikim_ent2'))),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: DsBars(labels: appStore.records('app_gentikim_ent2').take(12).map((r) => r[gen_app_gentikim_over1_c6] ?? '').toList(), values: appStore.records('app_gentikim_ent2').take(12).map((r) => double.tryParse(r[gen_app_gentikim_over1_c5] ?? '') ?? 0).toList()),
          ),
          Expanded(child: DsBoard(stages: const [gen_app_gentikim_over1_c7, gen_app_gentikim_over1_c8, gen_app_gentikim_over1_c9], records: appStore.records('app_gentikim_ent2'), stageOf: (r) => appStore.stageOf('app_gentikim_ent2', r['__id'] ?? ''), titleOf: (r) => r[gen_app_gentikim_over1_c10] ?? '', onMove: (id, to) => appStore.setStage('app_gentikim_ent2', id, to))),
          ],
        ),
      );
}
