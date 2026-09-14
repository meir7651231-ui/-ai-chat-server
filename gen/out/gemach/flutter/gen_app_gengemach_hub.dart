// ✨ חולל ע"י מנוע-הרינדור (render-ds) — לוח-ניווט + שער-הרשאות (בורר-תפקיד חי · נשמר). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_gengemach_hub_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import 'gen_app_gengemach_audit.dart';
import 'gen_app_gengemach_bind1.dart';
import 'gen_app_gengemach_bind2.dart';
import 'gen_app_gengemach_ent1.dart';
import 'gen_app_gengemach_ent2.dart';
import 'gen_app_gengemach_flags.dart';
import 'gen_app_gengemach_over1.dart';
import 'gen_app_gengemach_over2.dart';
import 'gen_app_gengemach_rec1.dart';
import 'gen_app_gengemach_rec2.dart';
import 'gen_app_gengemach_scr3.dart';
import 'gen_app_gengemach_settings.dart';
import 'package:flutter/material.dart';

class GenAppGengemachHubScreen extends StatefulWidget {
  const GenAppGengemachHubScreen({super.key});

  @override
  State<GenAppGengemachHubScreen> createState() => _GenAppGengemachHubScreenState();
}

class _GenAppGengemachHubScreenState extends State<GenAppGengemachHubScreen> {
  static const List<List<int>> _vis = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]];

  List<Widget> _tiles(BuildContext context) => [
        DsNavTile(glyph: gen_app_gengemach_hub_c2, title: gen_app_gengemach_hub_c3, sub: gen_app_gengemach_hub_c4, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppGengemachEnt1Screen()))),
        DsNavTile(glyph: gen_app_gengemach_hub_c5, title: gen_app_gengemach_hub_c6, sub: gen_app_gengemach_hub_c7, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppGengemachEnt2Screen()))),
        DsNavTile(glyph: gen_app_gengemach_hub_c8, title: gen_app_gengemach_hub_c9, sub: gen_app_gengemach_hub_c10, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppGengemachScr3Screen()))),
        DsNavTile(glyph: gen_app_gengemach_hub_c11, title: gen_app_gengemach_hub_c12, sub: gen_app_gengemach_hub_c13, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppGengemachOver1Screen()))),
        DsNavTile(glyph: gen_app_gengemach_hub_c14, title: gen_app_gengemach_hub_c15, sub: gen_app_gengemach_hub_c16, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppGengemachOver2Screen()))),
        DsNavTile(glyph: gen_app_gengemach_hub_c17, title: gen_app_gengemach_hub_c18, sub: gen_app_gengemach_hub_c19, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppGengemachRec1Screen()))),
        DsNavTile(glyph: gen_app_gengemach_hub_c20, title: gen_app_gengemach_hub_c21, sub: gen_app_gengemach_hub_c22, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppGengemachRec2Screen()))),
        DsNavTile(glyph: gen_app_gengemach_hub_c23, title: gen_app_gengemach_hub_c24, sub: gen_app_gengemach_hub_c25, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppGengemachBind1Screen()))),
        DsNavTile(glyph: gen_app_gengemach_hub_c26, title: gen_app_gengemach_hub_c27, sub: gen_app_gengemach_hub_c28, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppGengemachBind2Screen()))),
        DsNavTile(glyph: gen_app_gengemach_hub_c29, title: gen_app_gengemach_hub_c30, sub: gen_app_gengemach_hub_c31, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppGengemachAuditScreen()))),
        DsNavTile(glyph: gen_app_gengemach_hub_c32, title: gen_app_gengemach_hub_c33, sub: gen_app_gengemach_hub_c34, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppGengemachFlagsScreen()))),
        DsNavTile(glyph: gen_app_gengemach_hub_c35, title: gen_app_gengemach_hub_c36, sub: gen_app_gengemach_hub_c37, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppGengemachSettingsScreen()))),
  ];

  @override
  Widget build(BuildContext context) {
    final all = _tiles(context);
    final vis = _vis[appStore.role.clamp(0, _vis.length - 1)];
    return DsScaffold(
      title: gen_app_gengemach_hub_c0,
      subtitle: '${vis.length} מסכים גלויים',
      icon: gen_app_gengemach_hub_c1,
      children: [
        for (final i in vis) all[i],
      ],
    );
  }
}
