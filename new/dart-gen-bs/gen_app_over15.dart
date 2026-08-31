// ✨ חולל ע"י מנוע-ההרכבה (render-ds/compose) — אטום+אטום ⇒ מסך-סקירה מורכב מנתוני-הישות. אל תערוך ידנית.
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/callout.dart';
import '../dart-ui-bs/ds/ds_bars.dart';
import '../dart-ui-bs/ds/ds_table.dart';
import '../dart-data-bs/auto/gen_app_over15_content.dart';

class GenAppOver15Screen extends StatelessWidget {
  const GenAppOver15Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Wrap(spacing: 10, runSpacing: 10, children: [
              Callout(value: appStore.count('app_ent15').toString(), label: gen_app_over15_c0),
              Callout(value: appStore.sum('app_ent15', gen_app_over15_c1).toStringAsFixed(0), label: gen_app_over15_c2),
            ]),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: DsBars(labels: appStore.records('app_ent15').take(12).map((r) => r[gen_app_over15_c4] ?? '').toList(), values: appStore.records('app_ent15').take(12).map((r) => double.tryParse(r[gen_app_over15_c3] ?? '') ?? 0).toList()),
          ),
          Expanded(
            child: SingleChildScrollView(
              child: DsTable(labels: const [gen_app_over15_c5, gen_app_over15_c6, gen_app_over15_c7, gen_app_over15_c8, gen_app_over15_c9, gen_app_over15_c10, gen_app_over15_c11], rows: appStore.records('app_ent15').map((r) => [r[gen_app_over15_c12] ?? '', r[gen_app_over15_c13] ?? '', r[gen_app_over15_c14] ?? '', r[gen_app_over15_c15] ?? '', r[gen_app_over15_c16] ?? '', r[gen_app_over15_c17] ?? '', r[gen_app_over15_c18] ?? '']).toList()),
            ),
          ),
          ],
        ),
      );
}
