// 🧭 חולל ע"י ניווט-מקשרים (app-shell · G26 · הכרעה-27) — השלד: סרגל-תחתון בית · לקוח · עוד. השורש נגזר מגרף-הקשרים. אל תערוך ידנית.

import '../dart-data-bs/auto/gen_app_gentikim_shell_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/premium/actions/segmented_switch.dart';
import 'gen_app_gentikim_ent1.dart';
import 'gen_app_gentikim_hub.dart';
import 'gen_app_gentikim_root.dart';
import 'gen_app_gentikim_scr3.dart';
import 'package:flutter/material.dart';


class GenAppGentikimShellScreen extends StatefulWidget {
  const GenAppGentikimShellScreen({super.key});
  @override
  State<GenAppGentikimShellScreen> createState() => _GenAppGentikimShellScreenState();
}

class _GenAppGentikimShellScreenState extends State<GenAppGentikimShellScreen> {
  int _t = 0;
  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: DsLook.of(context).bg,
    body: IndexedStack(index: _t.clamp(0, 2), children: [const GenAppGentikimScr3Screen(), _RootTab(), const GenAppGentikimHubScreen()]),
    bottomNavigationBar: SafeArea(child: Padding(padding: const EdgeInsets.fromLTRB(12, 6, 12, 10), child: Center(heightFactor: 1.0, child: SegmentedSwitch(items: [gen_app_gentikim_shell_c0, gen_app_gentikim_shell_c1, gen_app_gentikim_shell_c2], selected: _t, onSelect: (i) => setState(() => _t = i))))),   // heightFactor: Center ללא-גובה מתפשט לכל הגובה שה-Scaffold מציע ⇒ הגוף נעלם
  );
}

class _RootTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) {
    final rs = appStore.records('app_gentikim_ent1');
    return DsScaffold(title: gen_app_gentikim_shell_c10, subtitle: rs.length.toString() + ' ' + gen_app_gentikim_shell_c11, icon: gen_app_gentikim_shell_c12, children: [
      Padding(padding: const EdgeInsets.only(bottom: 10), child: DsChipButton(label: gen_app_gentikim_shell_c4, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppGentikimEnt1Screen())))),
      
      
      for (final r in rs) DsNavTile(glyph: gen_app_gentikim_shell_c13, title: (r[gen_app_gentikim_shell_c6] ?? ''), sub: (r[gen_app_gentikim_shell_c7] ?? ''), onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => GenAppGentikimRootScreen(id: r[AppStore.idKey] ?? '')))),
    ]);
  });
}
