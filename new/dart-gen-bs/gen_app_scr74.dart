// ✨ חולל ע"י מנוע-הרינדור (render-ds) — דשבורד מנתוני-הישויות החיים (drill-down). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_scr74_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/ds/ds_bars.dart';
import 'gen_app_ent44.dart';
import 'gen_app_ent46.dart';
import 'package:flutter/material.dart';

class GenAppScr74Screen extends StatelessWidget {
  const GenAppScr74Screen({super.key});

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_scr74_c0,
      subtitle: gen_app_scr74_c8,
      icon: gen_app_scr74_c1,
      children: [
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr74_c2, value: appStore.count('app_ent44').toString(), sub: gen_app_scr74_c3, glyph: gen_app_scr74_c4, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt44Screen()))))), const SizedBox(width: 12), Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr74_c5, value: appStore.count('app_ent46').toString(), sub: gen_app_scr74_c6, glyph: gen_app_scr74_c7, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt46Screen())))))]))),
      AnimatedBuilder(animation: appStore, builder: (context, _) => DsBars(title: gen_app_scr74_c9, labels: const [gen_app_scr74_c2, gen_app_scr74_c5], values: [appStore.count('app_ent44').toDouble(), appStore.count('app_ent46').toDouble()])),
      ],
    );
  }
}
