// ✨ חולל ע"י מנוע-הרינדור (render-ds) — דשבורד מנתוני-הישויות החיים (drill-down). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_scr72_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/ds/ds_bars.dart';
import 'gen_app_ent11.dart';
import 'gen_app_ent16.dart';
import 'gen_app_ent24.dart';
import 'gen_app_ent28.dart';
import 'gen_app_ent34.dart';
import 'package:flutter/material.dart';

class GenAppScr72Screen extends StatelessWidget {
  const GenAppScr72Screen({super.key});

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_scr72_c0,
      subtitle: gen_app_scr72_c17,
      icon: gen_app_scr72_c1,
      children: [
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr72_c2, value: appStore.count('app_ent11').toString(), sub: gen_app_scr72_c3, glyph: gen_app_scr72_c4, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt11Screen()))))), const SizedBox(width: 12), Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr72_c5, value: appStore.count('app_ent16').toString(), sub: gen_app_scr72_c6, glyph: gen_app_scr72_c7, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt16Screen())))))]))),
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr72_c8, value: appStore.count('app_ent24').toString(), sub: gen_app_scr72_c9, glyph: gen_app_scr72_c10, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt24Screen()))))), const SizedBox(width: 12), Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr72_c11, value: appStore.count('app_ent28').toString(), sub: gen_app_scr72_c12, glyph: gen_app_scr72_c13, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt28Screen())))))]))),
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr72_c14, value: appStore.count('app_ent34').toString(), sub: gen_app_scr72_c15, glyph: gen_app_scr72_c16, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt34Screen()))))), const SizedBox(width: 12), const Expanded(child: SizedBox())]))),
      AnimatedBuilder(animation: appStore, builder: (context, _) => DsBars(title: gen_app_scr72_c18, labels: const [gen_app_scr72_c2, gen_app_scr72_c5, gen_app_scr72_c8, gen_app_scr72_c11, gen_app_scr72_c14], values: [appStore.count('app_ent11').toDouble(), appStore.count('app_ent16').toDouble(), appStore.count('app_ent24').toDouble(), appStore.count('app_ent28').toDouble(), appStore.count('app_ent34').toDouble()])),
      ],
    );
  }
}
