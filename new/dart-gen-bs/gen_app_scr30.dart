// ✨ חולל ע"י מנוע-הרינדור (render-ds) — דשבורד מנתוני-הישויות החיים (drill-down). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_scr30_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/ds/ds_bars.dart';
import 'gen_app_ent3.dart';
import 'gen_app_ent9.dart';
import 'package:flutter/material.dart';

class GenAppScr30Screen extends StatelessWidget {
  const GenAppScr30Screen({super.key});

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_scr30_c0,
      subtitle: gen_app_scr30_c8,
      icon: gen_app_scr30_c1,
      children: [
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr30_c2, value: appStore.count('app_ent3').toString(), sub: gen_app_scr30_c3, glyph: gen_app_scr30_c4, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt3Screen()))))), const SizedBox(width: 12), Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr30_c5, value: appStore.count('app_ent9').toString(), sub: gen_app_scr30_c6, glyph: gen_app_scr30_c7, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt9Screen())))))]))),
      AnimatedBuilder(animation: appStore, builder: (context, _) => DsBars(title: gen_app_scr30_c9, labels: const [gen_app_scr30_c2, gen_app_scr30_c5], values: [appStore.count('app_ent3').toDouble(), appStore.count('app_ent9').toDouble()])),
      ],
    );
  }
}
