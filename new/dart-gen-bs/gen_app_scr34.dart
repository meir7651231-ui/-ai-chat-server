// ✨ חולל ע"י מנוע-הרינדור (render-ds) — דשבורד מנתוני-הישויות החיים (drill-down). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_scr34_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/ds/ds_bars.dart';
import 'gen_app_ent21.dart';
import 'gen_app_ent22.dart';
import 'gen_app_ent23.dart';
import 'package:flutter/material.dart';

class GenAppScr34Screen extends StatelessWidget {
  const GenAppScr34Screen({super.key});

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_scr34_c0,
      subtitle: gen_app_scr34_c11,
      icon: gen_app_scr34_c1,
      children: [
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr34_c2, value: appStore.count('app_ent21').toString(), sub: gen_app_scr34_c3, glyph: gen_app_scr34_c4, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt21Screen()))))), const SizedBox(width: 12), Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr34_c5, value: appStore.count('app_ent22').toString(), sub: gen_app_scr34_c6, glyph: gen_app_scr34_c7, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt22Screen())))))]))),
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr34_c8, value: appStore.count('app_ent23').toString(), sub: gen_app_scr34_c9, glyph: gen_app_scr34_c10, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt23Screen()))))), const SizedBox(width: 12), const Expanded(child: SizedBox())]))),
      AnimatedBuilder(animation: appStore, builder: (context, _) => DsBars(title: gen_app_scr34_c12, labels: const [gen_app_scr34_c2, gen_app_scr34_c5, gen_app_scr34_c8], values: [appStore.count('app_ent21').toDouble(), appStore.count('app_ent22').toDouble(), appStore.count('app_ent23').toDouble()])),
      ],
    );
  }
}
