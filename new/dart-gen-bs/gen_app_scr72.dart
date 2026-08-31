// ✨ חולל ע"י מנוע-הרינדור (render-ds) — דשבורד מנתוני-הישויות החיים. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_scr72_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
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
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr72_c2, value: appStore.count('app_ent11').toString(), sub: gen_app_scr72_c3, glyph: gen_app_scr72_c4))), const SizedBox(width: 12), Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr72_c5, value: appStore.count('app_ent16').toString(), sub: gen_app_scr72_c6, glyph: gen_app_scr72_c7)))]))),
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr72_c8, value: appStore.count('app_ent24').toString(), sub: gen_app_scr72_c9, glyph: gen_app_scr72_c10))), const SizedBox(width: 12), Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr72_c11, value: appStore.count('app_ent28').toString(), sub: gen_app_scr72_c12, glyph: gen_app_scr72_c13)))]))),
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr72_c14, value: appStore.count('app_ent34').toString(), sub: gen_app_scr72_c15, glyph: gen_app_scr72_c16))), const SizedBox(width: 12), const Expanded(child: SizedBox())]))),
      ],
    );
  }
}
