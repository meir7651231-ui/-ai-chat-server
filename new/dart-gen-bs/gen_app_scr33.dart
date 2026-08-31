// ✨ חולל ע"י מנוע-הרינדור (render-ds) — דשבורד מנתוני-הישויות החיים (drill-down). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_scr33_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import 'gen_app_ent9.dart';
import 'package:flutter/material.dart';

class GenAppScr33Screen extends StatelessWidget {
  const GenAppScr33Screen({super.key});

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_scr33_c0,
      subtitle: gen_app_scr33_c5,
      icon: gen_app_scr33_c1,
      children: [
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr33_c2, value: appStore.count('app_ent9').toString(), sub: gen_app_scr33_c3, glyph: gen_app_scr33_c4, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt9Screen()))))), const SizedBox(width: 12), const Expanded(child: SizedBox())]))),
      ],
    );
  }
}
