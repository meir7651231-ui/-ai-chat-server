// ✨ חולל ע"י מנוע-ההרכבה (render-ds/compose) — אטום+אטום ⇒ מסך-סקירה מורכב מנתוני-הישות. אל תערוך ידנית.
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/callout.dart';
import '../dart-ui-bs/ds/ds_bars.dart';
import '../dart-ui-bs/ds/ds_table.dart';
import '../dart-data-bs/auto/gen_app_over4_content.dart';

class GenAppOver4Screen extends StatelessWidget {
  const GenAppOver4Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Wrap(spacing: 10, runSpacing: 10, children: [
              Callout(value: appStore.count('app_ent4').toString(), label: gen_app_over4_c0),
              Callout(value: appStore.sum('app_ent4', gen_app_over4_c1).toStringAsFixed(0), label: gen_app_over4_c2),
              Callout(value: appStore.sum('app_ent4', gen_app_over4_c3).toStringAsFixed(0), label: gen_app_over4_c4),
              Callout(value: appStore.sum('app_ent4', gen_app_over4_c5).toStringAsFixed(0), label: gen_app_over4_c6),
            ]),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: DsBars(labels: appStore.records('app_ent4').take(12).map((r) => r[gen_app_over4_c8] ?? '').toList(), values: appStore.records('app_ent4').take(12).map((r) => double.tryParse(r[gen_app_over4_c7] ?? '') ?? 0).toList()),
          ),
          Expanded(
            child: SingleChildScrollView(
              child: DsTable(labels: const [gen_app_over4_c9, gen_app_over4_c10, gen_app_over4_c11, gen_app_over4_c12, gen_app_over4_c13, gen_app_over4_c14, gen_app_over4_c15, gen_app_over4_c16, gen_app_over4_c17, gen_app_over4_c18], rows: appStore.records('app_ent4').map((r) => [r[gen_app_over4_c19] ?? '', r[gen_app_over4_c20] ?? '', r[gen_app_over4_c21] ?? '', r[gen_app_over4_c22] ?? '', r[gen_app_over4_c23] ?? '', r[gen_app_over4_c24] ?? '', r[gen_app_over4_c25] ?? '', r[gen_app_over4_c26] ?? '', r[gen_app_over4_c27] ?? '', r[gen_app_over4_c28] ?? '']).toList()),
            ),
          ),
          ],
        ),
      );
}
