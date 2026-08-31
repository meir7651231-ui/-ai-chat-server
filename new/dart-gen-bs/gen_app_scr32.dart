// ✨ חולל ע"י מנוע-הרינדור (render-ds) — דשבורד מנתוני-הישויות החיים (drill-down). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_scr32_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/ds/ds_bars.dart';
import 'gen_app_ent10.dart';
import 'gen_app_ent11.dart';
import 'gen_app_ent12.dart';
import 'gen_app_ent13.dart';
import 'gen_app_ent15.dart';
import 'gen_app_ent16.dart';
import 'package:flutter/material.dart';

class GenAppScr32Screen extends StatelessWidget {
  const GenAppScr32Screen({super.key});

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_scr32_c0,
      subtitle: gen_app_scr32_c20,
      icon: gen_app_scr32_c1,
      children: [
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr32_c2, value: appStore.count('app_ent10').toString(), sub: gen_app_scr32_c3, glyph: gen_app_scr32_c4, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt10Screen()))))), const SizedBox(width: 12), Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr32_c5, value: appStore.count('app_ent11').toString(), sub: gen_app_scr32_c6, glyph: gen_app_scr32_c7, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt11Screen())))))]))),
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr32_c8, value: appStore.count('app_ent12').toString(), sub: gen_app_scr32_c9, glyph: gen_app_scr32_c10, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt12Screen()))))), const SizedBox(width: 12), Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr32_c11, value: appStore.count('app_ent13').toString(), sub: gen_app_scr32_c12, glyph: gen_app_scr32_c13, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt13Screen())))))]))),
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr32_c14, value: appStore.count('app_ent15').toString(), sub: gen_app_scr32_c15, glyph: gen_app_scr32_c16, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt15Screen()))))), const SizedBox(width: 12), Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr32_c17, value: appStore.count('app_ent16').toString(), sub: gen_app_scr32_c18, glyph: gen_app_scr32_c19, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt16Screen())))))]))),
      AnimatedBuilder(animation: appStore, builder: (context, _) => DsBars(title: gen_app_scr32_c21, labels: const [gen_app_scr32_c2, gen_app_scr32_c5, gen_app_scr32_c8, gen_app_scr32_c11, gen_app_scr32_c14, gen_app_scr32_c17], values: [appStore.count('app_ent10').toDouble(), appStore.count('app_ent11').toDouble(), appStore.count('app_ent12').toDouble(), appStore.count('app_ent13').toDouble(), appStore.count('app_ent15').toDouble(), appStore.count('app_ent16').toDouble()])),
      ],
    );
  }
}
