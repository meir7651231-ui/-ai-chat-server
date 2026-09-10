// ✨ חולל ע"י מנוע-הרינדור (render-ds) — דשבורד מנתוני-הישויות החיים (drill-down). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_panuy_scr2_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/premium/showcase/premium_stat.dart';
import '../dart-ui-bs/premium/dataviz/neon_bars.dart';
import '../dart-ui-bs/premium/dataviz/kpi_tile.dart';
import 'gen_app_panuy_ent1.dart';
import 'package:flutter/material.dart';
import '../dart-forge-bs/card/card.dart'; // G12c · עור-forge במודול (skin.stat/hero) — אטומי-DS הוחלפו באטומי-forge עם fields; צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים (האטום לובש את החריץ)
import '../dart-forge-bs/header/header.dart'; // G12c · עור-forge במודול (skin.stat/hero) — אטומי-DS הוחלפו באטומי-forge עם fields; צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים (האטום לובש את החריץ)
import '../dart-forge-bs/dataviz/dataviz.dart'; // G12c · עור-forge במודול (skin.stat/hero) — אטומי-DS הוחלפו באטומי-forge עם fields; צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים (האטום לובש את החריץ)

class GenAppPanuyScr2Screen extends StatelessWidget {
  const GenAppPanuyScr2Screen({super.key});

  @override
  Widget build(BuildContext context) {
    return DsScaffold(title: gen_app_panuy_scr2_c0, subtitle: gen_app_panuy_scr2_c15, icon: gen_app_panuy_scr2_c1, header: false, children: [ForgeCenteredPageHeader(fields: ['', gen_app_panuy_scr2_c0, gen_app_panuy_scr2_c15]), ...[
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => ForgeStatPlain(fields: [gen_app_panuy_scr2_c2, appStore.count('app_panuy_ent1').toDouble().toStringAsFixed(0)]))), const SizedBox(width: 12), Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => ForgeStatPlain(fields: [gen_app_panuy_scr2_c5, appStore.records('app_panuy_ent1').where((r) => (r[gen_app_panuy_scr2_c9] ?? '') == gen_app_panuy_scr2_c10).length.toDouble().toStringAsFixed(0)])))]))),
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => ForgeStatPlain(fields: [gen_app_panuy_scr2_c11, appStore.avg('app_panuy_ent1', gen_app_panuy_scr2_c14).toStringAsFixed(1)]))), const SizedBox(width: 12), const Expanded(child: SizedBox())]))),
      AnimatedBuilder(animation: appStore, builder: (context, _) => ForgeWaveformBars(fields: ['', ''], values: (() { final _vs = [appStore.count('app_panuy_ent1').toDouble(), appStore.records('app_panuy_ent1').where((r) => (r[gen_app_panuy_scr2_c9] ?? '') == gen_app_panuy_scr2_c10).length.toDouble(), appStore.avg('app_panuy_ent1', gen_app_panuy_scr2_c14)]; final _m = _vs.fold<double>(0.0, (a, b) => a > b ? a : b); return [for (final v in _vs) _m == 0 ? 0.0 : v / _m]; })())),
      ]]);
  }
}
