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
      subtitle: gen_app_scr72_c1,
      icon: gen_app_scr72_c2,
      children: [
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr72_c3, value: appStore.count(gen_app_scr72_c3).toString(), sub: gen_app_scr72_c4, glyph: gen_app_scr72_c5))), const SizedBox(width: 12), Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr72_c6, value: appStore.count(gen_app_scr72_c6).toString(), sub: gen_app_scr72_c7, glyph: gen_app_scr72_c8)))]))),
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr72_c9, value: appStore.count(gen_app_scr72_c9).toString(), sub: gen_app_scr72_c10, glyph: gen_app_scr72_c11))), const SizedBox(width: 12), Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr72_c12, value: appStore.count(gen_app_scr72_c12).toString(), sub: gen_app_scr72_c13, glyph: gen_app_scr72_c14)))]))),
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr72_c15, value: appStore.count(gen_app_scr72_c15).toString(), sub: gen_app_scr72_c16, glyph: gen_app_scr72_c17))), const SizedBox(width: 12), const Expanded(child: SizedBox())]))),
      ],
    );
  }
}
