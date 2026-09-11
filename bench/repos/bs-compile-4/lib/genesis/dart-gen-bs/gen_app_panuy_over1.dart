// ✨ חולל ע"י מנוע-ההרכבה (render-ds/compose) — אטום+אטום ⇒ מסך-סקירה מורכב מנתוני-הישות. אל תערוך ידנית.
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/kv_row.dart';
import '../dart-ui-bs/premium/lists/expandable_tile.dart';
import '../dart-ui-bs/ds/ds_bars.dart';
import '../dart-ui-bs/auto/trade_builder_accessory_rule_editor_pill_button.dart';
import 'gen_app_panuy_rec1.dart';
import '../dart-data-bs/auto/gen_app_panuy_over1_content.dart';
import '../dart-forge-bs/dataviz/dataviz.dart'; // G12c · עור-forge במודול (skin.stat/hero) — אטומי-DS הוחלפו באטומי-forge עם fields; צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים (האטום לובש את החריץ)

class GenAppPanuyOver1Screen extends StatelessWidget {
  const GenAppPanuyOver1Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Wrap(spacing: 10, runSpacing: 10, children: [
              KvRow(value: appStore.count('app_panuy_ent1').toString(), label: gen_app_panuy_over1_c0),
              KvRow(value: appStore.sum('app_panuy_ent1', gen_app_panuy_over1_c1).toStringAsFixed(0), label: gen_app_panuy_over1_c2),
              KvRow(value: appStore.sum('app_panuy_ent1', gen_app_panuy_over1_c3).toStringAsFixed(0), label: gen_app_panuy_over1_c4),
              KvRow(value: appStore.sum('app_panuy_ent1', gen_app_panuy_over1_c5).toStringAsFixed(0), label: gen_app_panuy_over1_c6),
            ]),
          ),
          if (appStore.records('app_panuy_ent1').isNotEmpty)
            Padding(
              padding: const EdgeInsets.all(12),
              child: Builder(builder: (context) {
                final r = appStore.records('app_panuy_ent1').first;
                return ExpandableTile(title: r[gen_app_panuy_over1_c7] ?? '', body: r[gen_app_panuy_over1_c8] ?? '');
              }),
            ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: ForgeWaveformBars(fields: ['', ''], values: (() { final _vs = appStore.records('app_panuy_ent1').take(12).map((r) => double.tryParse(r[gen_app_panuy_over1_c9] ?? '') ?? 0).toList(); final _m = _vs.fold<double>(0.0, (a, b) => a > b ? a : b); return [for (final v in _vs) _m == 0 ? 0.0 : v / _m]; })()),
          ),
          Expanded(
            child: ListView(
              children: [
                for (final r in appStore.records('app_panuy_ent1'))
                  Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 3), child: TradeBuilderAccessoryRuleEditorPillButton(label: (r[gen_app_panuy_over1_c11] ?? '').isEmpty ? (r['__id'] ?? '') : (r[gen_app_panuy_over1_c11] ?? ''), onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => GenAppPanuyRec1Screen(initialId: r['__id'] ?? ''))))),
              ],
            ),
          ),
          ],
        ),
      );
}
