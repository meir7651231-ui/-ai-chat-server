// 🧭 חולל ע"י ניווט-מקשרים (app-shell · G26 · הכרעה-27) — השלד: סרגל-תחתון בית · אדם · עוד. השורש נגזר מגרף-הקשרים. אל תערוך ידנית.

import '../dart-data-bs/auto/gen_app_panuy_shell_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/premium/actions/segmented_switch.dart';
import 'gen_app_panuy_ent1.dart';
import 'gen_app_panuy_hub.dart';
import 'gen_app_panuy_root.dart';
import 'gen_app_panuy_scr2.dart';
import 'package:flutter/material.dart';
import '../dart-forge-bs/card/card.dart'; // G12c · עור-forge במודול (skin.stat/hero) — אטומי-DS הוחלפו באטומי-forge עם fields; צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים (האטום לובש את החריץ)
import '../dart-forge-bs/selection/selection.dart'; // G12c · עור-forge במודול (skin.stat/hero) — אטומי-DS הוחלפו באטומי-forge עם fields; צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים (האטום לובש את החריץ)
import '../dart-forge-bs/header/header.dart'; // G12c · עור-forge במודול (skin.stat/hero) — אטומי-DS הוחלפו באטומי-forge עם fields; צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים (האטום לובש את החריץ)


class GenAppPanuyShellScreen extends StatefulWidget {
  const GenAppPanuyShellScreen({super.key});
  @override
  State<GenAppPanuyShellScreen> createState() => _GenAppPanuyShellScreenState();
}

class _GenAppPanuyShellScreenState extends State<GenAppPanuyShellScreen> {
  int _t = 0;
  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: DsLook.of(context).bg,
    body: IndexedStack(index: _t.clamp(0, 2), children: [const GenAppPanuyScr2Screen(), _RootTab(), const GenAppPanuyHubScreen()]),
    bottomNavigationBar: SafeArea(child: Padding(padding: const EdgeInsets.fromLTRB(12, 6, 12, 10), child: Center(heightFactor: 1.0, child: ForgeSegPickerSelection(bare: true, items: [for (final s in [gen_app_panuy_shell_c0, gen_app_panuy_shell_c1, gen_app_panuy_shell_c2]) [s]], selected: {_t}, onSelect: (i) => setState(() => _t = i))))),   // heightFactor: Center ללא-גובה מתפשט לכל הגובה שה-Scaffold מציע ⇒ הגוף נעלם
  );
}

class _RootTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) {
    final rs = appStore.records('app_panuy_ent1');
    return DsScaffold(title: gen_app_panuy_shell_c10, subtitle: rs.length.toString() + ' ' + gen_app_panuy_shell_c11, icon: gen_app_panuy_shell_c12, header: false, children: [ForgeCenteredPageHeader(fields: ['', gen_app_panuy_shell_c10, rs.length.toString() + ' ' + gen_app_panuy_shell_c11]), ...[
      Padding(padding: const EdgeInsets.only(bottom: 10), child: DsChipButton(label: gen_app_panuy_shell_c4, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppPanuyEnt1Screen())))),
      
      
      for (final r in rs) GestureDetector(behavior: HitTestBehavior.opaque, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => GenAppPanuyRootScreen(id: r[AppStore.idKey] ?? ''))), child: ForgeGridHubCard(fields: [(r[gen_app_panuy_shell_c6] ?? ''), (r[gen_app_panuy_shell_c7] ?? '')])),
    ]]);
  });
}
