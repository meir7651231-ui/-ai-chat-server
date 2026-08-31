// ✨ חולל ע"י מנוע-ההרכבה (render-ds/compose) — אטום+אטום ⇒ מסך-סקירה מורכב מנתוני-הישות. אל תערוך ידנית.
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/callout.dart';
import '../dart-ui-bs/ds/ds_bars.dart';
import '../dart-ui-bs/ds/ds_table.dart';
import '../dart-data-bs/auto/gen_app_over2_content.dart';

class GenAppOver2Screen extends StatelessWidget {
  const GenAppOver2Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Wrap(spacing: 10, runSpacing: 10, children: [
              Callout(value: appStore.count('app_ent2').toString(), label: gen_app_over2_c0),
              Callout(value: appStore.sum('app_ent2', gen_app_over2_c1).toStringAsFixed(0), label: gen_app_over2_c2),
            ]),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: DsBars(labels: appStore.records('app_ent2').take(12).map((r) => r[gen_app_over2_c4] ?? '').toList(), values: appStore.records('app_ent2').take(12).map((r) => double.tryParse(r[gen_app_over2_c3] ?? '') ?? 0).toList()),
          ),
          Expanded(
            child: SingleChildScrollView(
              child: DsTable(labels: const [gen_app_over2_c5, gen_app_over2_c6, gen_app_over2_c7, gen_app_over2_c8, gen_app_over2_c9, gen_app_over2_c10, gen_app_over2_c11, gen_app_over2_c12], rows: appStore.records('app_ent2').map((r) => [r[gen_app_over2_c13] ?? '', r[gen_app_over2_c14] ?? '', r[gen_app_over2_c15] ?? '', r[gen_app_over2_c16] ?? '', r[gen_app_over2_c17] ?? '', r[gen_app_over2_c18] ?? '', r[gen_app_over2_c19] ?? '', r[gen_app_over2_c20] ?? '']).toList()),
            ),
          ),
          ],
        ),
      );
}
