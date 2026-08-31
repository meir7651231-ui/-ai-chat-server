// ✨ חולל ע"י מנוע-הרינדור (render-ds) — דשבורד מנתוני-הישויות החיים (drill-down). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_scr76_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/ds/ds_bars.dart';
import 'gen_app_ent42.dart';
import 'gen_app_ent59.dart';
import 'gen_app_ent65.dart';
import 'gen_app_ent66.dart';
import 'package:flutter/material.dart';

class GenAppScr76Screen extends StatelessWidget {
  const GenAppScr76Screen({super.key});

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_scr76_c0,
      subtitle: gen_app_scr76_c14,
      icon: gen_app_scr76_c1,
      children: [
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr76_c2, value: appStore.count('app_ent42').toString(), sub: gen_app_scr76_c3, glyph: gen_app_scr76_c4, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt42Screen()))))), const SizedBox(width: 12), Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr76_c5, value: appStore.count('app_ent59').toString(), sub: gen_app_scr76_c6, glyph: gen_app_scr76_c7, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt59Screen())))))]))),
      Padding(padding: const EdgeInsets.only(bottom: 12), child: IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr76_c8, value: appStore.count('app_ent65').toString(), sub: gen_app_scr76_c9, glyph: gen_app_scr76_c10, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt65Screen()))))), const SizedBox(width: 12), Expanded(child: AnimatedBuilder(animation: appStore, builder: (context, _) => DsStat(label: gen_app_scr76_c11, value: appStore.count('app_ent66').toString(), sub: gen_app_scr76_c12, glyph: gen_app_scr76_c13, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt66Screen())))))]))),
      AnimatedBuilder(animation: appStore, builder: (context, _) => DsBars(title: gen_app_scr76_c15, labels: const [gen_app_scr76_c2, gen_app_scr76_c5, gen_app_scr76_c8, gen_app_scr76_c11], values: [appStore.count('app_ent42').toDouble(), appStore.count('app_ent59').toDouble(), appStore.count('app_ent65').toDouble(), appStore.count('app_ent66').toDouble()])),
      ],
    );
  }
}
