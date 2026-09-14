// ✨ חולל ע"י מנוע-הרינדור (render-ds) — דשבורד מנתוני-הישויות החיים (drill-down). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_genhotzaot_scr2_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/premium/showcase/premium_stat.dart';
import '../dart-ui-bs/premium/dataviz/neon_bars.dart';
import '../dart-ui-bs/premium/dataviz/kpi_tile.dart';
import 'gen_app_genhotzaot_ent1.dart';
import 'package:flutter/material.dart';

class GenAppGenhotzaotScr2Screen extends StatelessWidget {
  const GenAppGenhotzaotScr2Screen({super.key});

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_genhotzaot_scr2_c0,
      subtitle: gen_app_genhotzaot_scr2_c10,
      icon: gen_app_genhotzaot_scr2_c1,
      children: [
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => KpiTile(glyph: gen_app_genhotzaot_scr2_c4, value: appStore.sum('app_genhotzaot_ent1', gen_app_genhotzaot_scr2_c5).toStringAsFixed(0), label: gen_app_genhotzaot_scr2_c2))), const SizedBox(width: 12), Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => KpiTile(glyph: gen_app_genhotzaot_scr2_c8, value: appStore.count('app_genhotzaot_ent1').toDouble().toStringAsFixed(0), label: gen_app_genhotzaot_scr2_c6)))]))),
      AnimatedBuilder(animation: appStore, builder: (context, _) => NeonBars(labels: const [gen_app_genhotzaot_scr2_c2, gen_app_genhotzaot_scr2_c6], values: [appStore.sum('app_genhotzaot_ent1', gen_app_genhotzaot_scr2_c5), appStore.count('app_genhotzaot_ent1').toDouble()])),
      ],
    );
  }
}
