// ✨ חולל ע"י מנוע-ההרכבה (render-ds/compose) — אטום+אטום ⇒ מסך-סקירה מורכב מנתוני-הישות. אל תערוך ידנית.
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/callout.dart';
import '../dart-ui-bs/ds/ds_table.dart';
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
          Expanded(
            child: SingleChildScrollView(
              child: DsTable(labels: const [gen_app_over1_c3, gen_app_over1_c4, gen_app_over1_c5, gen_app_over1_c6, gen_app_over1_c7, gen_app_over1_c8, gen_app_over1_c9, gen_app_over1_c10, gen_app_over1_c11], rows: appStore.records('app_ent1').map((r) => [r[gen_app_over1_c12] ?? '', r[gen_app_over1_c13] ?? '', r[gen_app_over1_c14] ?? '', r[gen_app_over1_c15] ?? '', r[gen_app_over1_c16] ?? '', r[gen_app_over1_c17] ?? '', r[gen_app_over1_c18] ?? '', r[gen_app_over1_c19] ?? '', r[gen_app_over1_c20] ?? '']).toList()),
            ),
          ),
          ],
        ),
      );
}
