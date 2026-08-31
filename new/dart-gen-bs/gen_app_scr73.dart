// ✨ חולל ע"י מנוע-הרינדור (render-ds) — דשבורד מנתוני-הישויות החיים (drill-down). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_scr73_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import 'gen_app_ent30.dart';
import 'gen_app_ent32.dart';
import 'gen_app_ent34.dart';
import 'package:flutter/material.dart';

class GenAppScr73Screen extends StatelessWidget {
  const GenAppScr73Screen({super.key});

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_scr73_c0,
      subtitle: gen_app_scr73_c11,
      icon: gen_app_scr73_c1,
      children: [
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr73_c2, value: appStore.count('app_ent30').toString(), sub: gen_app_scr73_c3, glyph: gen_app_scr73_c4, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt30Screen()))))), const SizedBox(width: 12), Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr73_c5, value: appStore.count('app_ent32').toString(), sub: gen_app_scr73_c6, glyph: gen_app_scr73_c7, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt32Screen())))))]))),
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr73_c8, value: appStore.count('app_ent34').toString(), sub: gen_app_scr73_c9, glyph: gen_app_scr73_c10, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt34Screen()))))), const SizedBox(width: 12), const Expanded(child: SizedBox())]))),
      ],
    );
  }
}
