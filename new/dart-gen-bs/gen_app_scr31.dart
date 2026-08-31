// ✨ חולל ע"י מנוע-הרינדור (render-ds) — דשבורד מנתוני-הישויות החיים (drill-down). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_scr31_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/ds/ds_bars.dart';
import 'gen_app_ent22.dart';
import 'gen_app_ent9.dart';
import 'package:flutter/material.dart';

class GenAppScr31Screen extends StatelessWidget {
  const GenAppScr31Screen({super.key});

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_scr31_c0,
      subtitle: gen_app_scr31_c8,
      icon: gen_app_scr31_c1,
      children: [
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr31_c2, value: appStore.count('app_ent9').toString(), sub: gen_app_scr31_c3, glyph: gen_app_scr31_c4, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt9Screen()))))), const SizedBox(width: 12), Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr31_c5, value: appStore.count('app_ent22').toString(), sub: gen_app_scr31_c6, glyph: gen_app_scr31_c7, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt22Screen())))))]))),
      AnimatedBuilder(animation: appStore, builder: (context, _) => DsBars(title: gen_app_scr31_c9, labels: const [gen_app_scr31_c2, gen_app_scr31_c5], values: [appStore.count('app_ent9').toDouble(), appStore.count('app_ent22').toDouble()])),
      ],
    );
  }
}
