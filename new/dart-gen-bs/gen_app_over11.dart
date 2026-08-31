// ✨ חולל ע"י מנוע-ההרכבה (render-ds/compose) — אטום+אטום ⇒ מסך-סקירה מורכב מנתוני-הישות. אל תערוך ידנית.
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/callout.dart';
import '../dart-ui-bs/ds/ds_bars.dart';
import '../dart-ui-bs/auto/action_row.dart';
import 'gen_app_rec11.dart';
import '../dart-data-bs/auto/gen_app_over11_content.dart';

class GenAppOver11Screen extends StatelessWidget {
  const GenAppOver11Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Wrap(spacing: 10, runSpacing: 10, children: [
              Callout(value: appStore.count('app_ent11').toString(), label: gen_app_over11_c0),
              Callout(value: appStore.sum('app_ent11', gen_app_over11_c1).toStringAsFixed(0), label: gen_app_over11_c2),
              Callout(value: appStore.sum('app_ent11', gen_app_over11_c3).toStringAsFixed(0), label: gen_app_over11_c4),
            ]),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: DsBars(labels: appStore.records('app_ent11').take(12).map((r) => r[gen_app_over11_c6] ?? '').toList(), values: appStore.records('app_ent11').take(12).map((r) => double.tryParse(r[gen_app_over11_c5] ?? '') ?? 0).toList()),
          ),
          Expanded(
            child: ListView(
              children: [
                for (final r in appStore.records('app_ent11'))
                  Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 3), child: ActionRow(label: (r[gen_app_over11_c7] ?? '').isEmpty ? (r['__id'] ?? '') : (r[gen_app_over11_c7] ?? ''), onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => GenAppRec11Screen(initialId: r['__id'] ?? ''))))),
              ],
            ),
          ),
          ],
        ),
      );
}
