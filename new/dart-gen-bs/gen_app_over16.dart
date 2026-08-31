// ✨ חולל ע"י מנוע-ההרכבה (render-ds/compose) — אטום+אטום ⇒ מסך-סקירה מורכב מנתוני-הישות. אל תערוך ידנית.
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/callout.dart';
import '../dart-ui-bs/ds/ds_bars.dart';
import '../dart-ui-bs/ds/ds_table.dart';
import '../dart-data-bs/auto/gen_app_over16_content.dart';

class GenAppOver16Screen extends StatelessWidget {
  const GenAppOver16Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Wrap(spacing: 10, runSpacing: 10, children: [
              Callout(value: appStore.count('app_ent16').toString(), label: gen_app_over16_c0),
              Callout(value: appStore.sum('app_ent16', gen_app_over16_c1).toStringAsFixed(0), label: gen_app_over16_c2),
              Callout(value: appStore.sum('app_ent16', gen_app_over16_c3).toStringAsFixed(0), label: gen_app_over16_c4),
            ]),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: DsBars(labels: appStore.records('app_ent16').take(12).map((r) => r[gen_app_over16_c6] ?? '').toList(), values: appStore.records('app_ent16').take(12).map((r) => double.tryParse(r[gen_app_over16_c5] ?? '') ?? 0).toList()),
          ),
          Expanded(
            child: SingleChildScrollView(
              child: DsTable(labels: const [gen_app_over16_c7, gen_app_over16_c8, gen_app_over16_c9, gen_app_over16_c10, gen_app_over16_c11, gen_app_over16_c12, gen_app_over16_c13], rows: appStore.records('app_ent16').map((r) => [r[gen_app_over16_c14] ?? '', r[gen_app_over16_c15] ?? '', r[gen_app_over16_c16] ?? '', r[gen_app_over16_c17] ?? '', r[gen_app_over16_c18] ?? '', r[gen_app_over16_c19] ?? '', r[gen_app_over16_c20] ?? '']).toList()),
            ),
          ),
          ],
        ),
      );
}
