// ✨ חולל ע"י מנוע-ההרכבה (render-ds/compose) — אטום+אטום ⇒ מסך-סקירה מורכב מנתוני-הישות. אל תערוך ידנית.
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/callout.dart';
import '../dart-ui-bs/ds/ds_bars.dart';
import '../dart-ui-bs/ds/ds_table.dart';
import '../dart-data-bs/auto/gen_app_over5_content.dart';

class GenAppOver5Screen extends StatelessWidget {
  const GenAppOver5Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Wrap(spacing: 10, runSpacing: 10, children: [
              Callout(value: appStore.count('app_ent5').toString(), label: gen_app_over5_c0),
              Callout(value: appStore.sum('app_ent5', gen_app_over5_c1).toStringAsFixed(0), label: gen_app_over5_c2),
              Callout(value: appStore.sum('app_ent5', gen_app_over5_c3).toStringAsFixed(0), label: gen_app_over5_c4),
              Callout(value: appStore.sum('app_ent5', gen_app_over5_c5).toStringAsFixed(0), label: gen_app_over5_c6),
            ]),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: DsBars(labels: appStore.records('app_ent5').take(12).map((r) => r[gen_app_over5_c8] ?? '').toList(), values: appStore.records('app_ent5').take(12).map((r) => double.tryParse(r[gen_app_over5_c7] ?? '') ?? 0).toList()),
          ),
          Expanded(
            child: SingleChildScrollView(
              child: DsTable(labels: const [gen_app_over5_c9, gen_app_over5_c10, gen_app_over5_c11, gen_app_over5_c12, gen_app_over5_c13, gen_app_over5_c14, gen_app_over5_c15, gen_app_over5_c16], rows: appStore.records('app_ent5').map((r) => [r[gen_app_over5_c17] ?? '', r[gen_app_over5_c18] ?? '', r[gen_app_over5_c19] ?? '', r[gen_app_over5_c20] ?? '', r[gen_app_over5_c21] ?? '', r[gen_app_over5_c22] ?? '', r[gen_app_over5_c23] ?? '', r[gen_app_over5_c24] ?? '']).toList()),
            ),
          ),
          ],
        ),
      );
}
