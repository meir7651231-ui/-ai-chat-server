// ✨ חולל ע"י מנוע-הרינדור (render-ds) — לוח-ניווט + שער-הרשאות (בורר-תפקיד חי · נשמר). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_panuy_hub_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import 'gen_app_panuy_audit.dart';
import 'gen_app_panuy_bind1.dart';
import 'gen_app_panuy_ent1.dart';
import 'gen_app_panuy_flags.dart';
import 'gen_app_panuy_over1.dart';
import 'gen_app_panuy_px1.dart';
import 'gen_app_panuy_rec1.dart';
import 'gen_app_panuy_scr2.dart';
import 'gen_app_panuy_settings.dart';
import 'package:flutter/material.dart';
import '../dart-forge-bs/card/card.dart'; // G12c · עור-forge במודול (skin.stat/hero) — אטומי-DS הוחלפו באטומי-forge עם fields; צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים (האטום לובש את החריץ)
import '../dart-forge-bs/header/header.dart'; // G12c · עור-forge במודול (skin.stat/hero) — אטומי-DS הוחלפו באטומי-forge עם fields; צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים (האטום לובש את החריץ)

class GenAppPanuyHubScreen extends StatefulWidget {
  const GenAppPanuyHubScreen({super.key});

  @override
  State<GenAppPanuyHubScreen> createState() => _GenAppPanuyHubScreenState();
}

class _GenAppPanuyHubScreenState extends State<GenAppPanuyHubScreen> {
  static const List<List<int>> _vis = [[0, 1, 2, 3, 4, 5, 6, 7, 8]];

  List<Widget> _tiles(BuildContext context) => [
        GestureDetector(behavior: HitTestBehavior.opaque, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppPanuyEnt1Screen())), child: ForgeGridHubCard(fields: [gen_app_panuy_hub_c3, gen_app_panuy_hub_c4])),
        GestureDetector(behavior: HitTestBehavior.opaque, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppPanuyScr2Screen())), child: ForgeGridHubCard(fields: [gen_app_panuy_hub_c6, gen_app_panuy_hub_c7])),
        GestureDetector(behavior: HitTestBehavior.opaque, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppPanuyPx1Screen())), child: ForgeGridHubCard(fields: [gen_app_panuy_hub_c9, gen_app_panuy_hub_c10])),
        GestureDetector(behavior: HitTestBehavior.opaque, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppPanuyOver1Screen())), child: ForgeGridHubCard(fields: [gen_app_panuy_hub_c12, gen_app_panuy_hub_c13])),
        GestureDetector(behavior: HitTestBehavior.opaque, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppPanuyRec1Screen())), child: ForgeGridHubCard(fields: [gen_app_panuy_hub_c15, gen_app_panuy_hub_c16])),
        GestureDetector(behavior: HitTestBehavior.opaque, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppPanuyBind1Screen())), child: ForgeGridHubCard(fields: [gen_app_panuy_hub_c18, gen_app_panuy_hub_c19])),
        GestureDetector(behavior: HitTestBehavior.opaque, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppPanuyAuditScreen())), child: ForgeGridHubCard(fields: [gen_app_panuy_hub_c21, gen_app_panuy_hub_c22])),
        GestureDetector(behavior: HitTestBehavior.opaque, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppPanuyFlagsScreen())), child: ForgeGridHubCard(fields: [gen_app_panuy_hub_c24, gen_app_panuy_hub_c25])),
        GestureDetector(behavior: HitTestBehavior.opaque, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppPanuySettingsScreen())), child: ForgeGridHubCard(fields: [gen_app_panuy_hub_c27, gen_app_panuy_hub_c28])),
  ];

  @override
  Widget build(BuildContext context) {
    final all = _tiles(context);
    final vis = _vis[appStore.role.clamp(0, _vis.length - 1)];
    return DsScaffold(title: gen_app_panuy_hub_c0, subtitle: '${vis.length} מסכים גלויים', icon: gen_app_panuy_hub_c1, header: false, children: [ForgeCenteredPageHeader(fields: ['', gen_app_panuy_hub_c0, '${vis.length} מסכים גלויים']), ...[
        for (final i in vis) all[i],
      ]]);
  }
}
