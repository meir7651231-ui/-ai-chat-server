// ✨ חולל ע"י מנוע-הרינדור (render-ds) — דשבורד מנתוני-הישויות החיים (drill-down). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_gengemach_scr3_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/premium/showcase/premium_stat.dart';
import '../dart-ui-bs/premium/dataviz/neon_bars.dart';
import '../dart-ui-bs/premium/dataviz/kpi_tile.dart';
import 'gen_app_gengemach_ent1.dart';
import 'gen_app_gengemach_ent2.dart';
import 'package:flutter/material.dart';

class GenAppGengemachScr3Screen extends StatelessWidget {
  const GenAppGengemachScr3Screen({super.key});

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_gengemach_scr3_c0,
      subtitle: gen_app_gengemach_scr3_c14,
      icon: gen_app_gengemach_scr3_c1,
      children: [
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => KpiTile(glyph: gen_app_gengemach_scr3_c4, value: appStore.sum('app_gengemach_ent1', gen_app_gengemach_scr3_c5).toStringAsFixed(0), label: gen_app_gengemach_scr3_c2))), const SizedBox(width: 12), Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => KpiTile(glyph: gen_app_gengemach_scr3_c8, value: appStore.sum('app_gengemach_ent2', gen_app_gengemach_scr3_c9).toStringAsFixed(0), label: gen_app_gengemach_scr3_c6)))]))),
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => KpiTile(glyph: gen_app_gengemach_scr3_c12, value: appStore.count('app_gengemach_ent1').toDouble().toStringAsFixed(0), label: gen_app_gengemach_scr3_c10))), const SizedBox(width: 12), const Expanded(child: SizedBox())]))),
      AnimatedBuilder(animation: appStore, builder: (context, _) => NeonBars(labels: const [gen_app_gengemach_scr3_c2, gen_app_gengemach_scr3_c6, gen_app_gengemach_scr3_c10], values: [appStore.sum('app_gengemach_ent1', gen_app_gengemach_scr3_c5), appStore.sum('app_gengemach_ent2', gen_app_gengemach_scr3_c9), appStore.count('app_gengemach_ent1').toDouble()])),
      ],
    );
  }
}
