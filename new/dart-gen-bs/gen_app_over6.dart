// ✨ חולל ע"י מנוע-ההרכבה (render-ds/compose) — אטום+אטום ⇒ מסך-סקירה מורכב מנתוני-הישות. אל תערוך ידנית.
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/callout.dart';
import '../dart-ui-bs/ds/ds_bars.dart';
import '../dart-ui-bs/ds/ds_table.dart';
import '../dart-data-bs/auto/gen_app_over6_content.dart';

class GenAppOver6Screen extends StatelessWidget {
  const GenAppOver6Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Wrap(spacing: 10, runSpacing: 10, children: [
              Callout(value: appStore.count('app_ent6').toString(), label: gen_app_over6_c0),
              Callout(value: appStore.sum('app_ent6', gen_app_over6_c1).toStringAsFixed(0), label: gen_app_over6_c2),
              Callout(value: appStore.sum('app_ent6', gen_app_over6_c3).toStringAsFixed(0), label: gen_app_over6_c4),
              Callout(value: appStore.sum('app_ent6', gen_app_over6_c5).toStringAsFixed(0), label: gen_app_over6_c6),
            ]),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: DsBars(labels: appStore.records('app_ent6').take(12).map((r) => r[gen_app_over6_c8] ?? '').toList(), values: appStore.records('app_ent6').take(12).map((r) => double.tryParse(r[gen_app_over6_c7] ?? '') ?? 0).toList()),
          ),
          Expanded(
            child: SingleChildScrollView(
              child: DsTable(labels: const [gen_app_over6_c9, gen_app_over6_c10, gen_app_over6_c11, gen_app_over6_c12, gen_app_over6_c13, gen_app_over6_c14, gen_app_over6_c15, gen_app_over6_c16, gen_app_over6_c17], rows: appStore.records('app_ent6').map((r) => [r[gen_app_over6_c18] ?? '', r[gen_app_over6_c19] ?? '', r[gen_app_over6_c20] ?? '', r[gen_app_over6_c21] ?? '', r[gen_app_over6_c22] ?? '', r[gen_app_over6_c23] ?? '', r[gen_app_over6_c24] ?? '', r[gen_app_over6_c25] ?? '', r[gen_app_over6_c26] ?? '']).toList()),
            ),
          ),
          ],
        ),
      );
}
