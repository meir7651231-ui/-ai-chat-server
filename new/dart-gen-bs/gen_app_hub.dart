// ✨ חולל ע"י מנוע-הרינדור (render-ds) — לוח-ניווט + שער-הרשאות (בורר-תפקיד חי · נשמר). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_hub_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import 'gen_app_audit.dart';
import 'gen_app_bind1.dart';
import 'gen_app_bind10.dart';
import 'gen_app_bind11.dart';
import 'gen_app_bind12.dart';
import 'gen_app_bind13.dart';
import 'gen_app_bind2.dart';
import 'gen_app_bind3.dart';
import 'gen_app_bind4.dart';
import 'gen_app_bind5.dart';
import 'gen_app_bind6.dart';
import 'gen_app_bind7.dart';
import 'gen_app_bind8.dart';
import 'gen_app_bind9.dart';
import 'gen_app_ent1.dart';
import 'gen_app_ent10.dart';
import 'gen_app_ent11.dart';
import 'gen_app_ent12.dart';
import 'gen_app_ent13.dart';
import 'gen_app_ent14.dart';
import 'gen_app_ent15.dart';
import 'gen_app_ent16.dart';
import 'gen_app_ent17.dart';
import 'gen_app_ent18.dart';
import 'gen_app_ent19.dart';
import 'gen_app_ent2.dart';
import 'gen_app_ent20.dart';
import 'gen_app_ent21.dart';
import 'gen_app_ent22.dart';
import 'gen_app_ent23.dart';
import 'gen_app_ent24.dart';
import 'gen_app_ent25.dart';
import 'gen_app_ent26.dart';
import 'gen_app_ent27.dart';
import 'gen_app_ent28.dart';
import 'gen_app_ent29.dart';
import 'gen_app_ent3.dart';
import 'gen_app_ent4.dart';
import 'gen_app_ent5.dart';
import 'gen_app_ent6.dart';
import 'gen_app_ent7.dart';
import 'gen_app_ent8.dart';
import 'gen_app_ent9.dart';
import 'gen_app_flags.dart';
import 'gen_app_scr30.dart';
import 'gen_app_scr31.dart';
import 'gen_app_scr32.dart';
import 'gen_app_scr33.dart';
import 'gen_app_scr34.dart';
import 'gen_app_settings.dart';
import 'package:flutter/material.dart';

class GenAppHubScreen extends StatefulWidget {
  const GenAppHubScreen({super.key});

  @override
  State<GenAppHubScreen> createState() => _GenAppHubScreenState();
}

class _GenAppHubScreenState extends State<GenAppHubScreen> {
  static const List<List<int>> _vis = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49], [2, 8, 9, 19, 21, 25, 36, 42, 43], [9, 10, 11, 14, 15, 20, 22, 29, 30, 31, 32, 33, 43, 44, 45], [5, 6, 8, 27, 28, 39, 40, 42], [20, 21, 22], [20, 21], [2, 21, 25, 27, 28, 36], [9, 23, 43]];

  List<Widget> _tiles(BuildContext context) => [
        DsNavTile(glyph: gen_app_hub_c2, title: gen_app_hub_c3, sub: gen_app_hub_c4, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt1Screen()))),
        DsNavTile(glyph: gen_app_hub_c5, title: gen_app_hub_c6, sub: gen_app_hub_c7, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt2Screen()))),
        DsNavTile(glyph: gen_app_hub_c8, title: gen_app_hub_c9, sub: gen_app_hub_c10, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt3Screen()))),
        DsNavTile(glyph: gen_app_hub_c11, title: gen_app_hub_c12, sub: gen_app_hub_c13, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt4Screen()))),
        DsNavTile(glyph: gen_app_hub_c14, title: gen_app_hub_c15, sub: gen_app_hub_c16, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt5Screen()))),
        DsNavTile(glyph: gen_app_hub_c17, title: gen_app_hub_c18, sub: gen_app_hub_c19, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt6Screen()))),
        DsNavTile(glyph: gen_app_hub_c20, title: gen_app_hub_c21, sub: gen_app_hub_c22, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt7Screen()))),
        DsNavTile(glyph: gen_app_hub_c23, title: gen_app_hub_c24, sub: gen_app_hub_c25, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt8Screen()))),
        DsNavTile(glyph: gen_app_hub_c26, title: gen_app_hub_c27, sub: gen_app_hub_c28, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt9Screen()))),
        DsNavTile(glyph: gen_app_hub_c29, title: gen_app_hub_c30, sub: gen_app_hub_c31, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt10Screen()))),
        DsNavTile(glyph: gen_app_hub_c32, title: gen_app_hub_c33, sub: gen_app_hub_c34, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt11Screen()))),
        DsNavTile(glyph: gen_app_hub_c35, title: gen_app_hub_c36, sub: gen_app_hub_c37, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt12Screen()))),
        DsNavTile(glyph: gen_app_hub_c38, title: gen_app_hub_c39, sub: gen_app_hub_c40, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt13Screen()))),
        DsNavTile(glyph: gen_app_hub_c41, title: gen_app_hub_c42, sub: gen_app_hub_c43, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt14Screen()))),
        DsNavTile(glyph: gen_app_hub_c44, title: gen_app_hub_c45, sub: gen_app_hub_c46, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt15Screen()))),
        DsNavTile(glyph: gen_app_hub_c47, title: gen_app_hub_c48, sub: gen_app_hub_c49, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt16Screen()))),
        DsNavTile(glyph: gen_app_hub_c50, title: gen_app_hub_c51, sub: gen_app_hub_c52, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt17Screen()))),
        DsNavTile(glyph: gen_app_hub_c53, title: gen_app_hub_c54, sub: gen_app_hub_c55, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt18Screen()))),
        DsNavTile(glyph: gen_app_hub_c56, title: gen_app_hub_c57, sub: gen_app_hub_c58, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt19Screen()))),
        DsNavTile(glyph: gen_app_hub_c59, title: gen_app_hub_c60, sub: gen_app_hub_c61, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt20Screen()))),
        DsNavTile(glyph: gen_app_hub_c62, title: gen_app_hub_c63, sub: gen_app_hub_c64, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt21Screen()))),
        DsNavTile(glyph: gen_app_hub_c65, title: gen_app_hub_c66, sub: gen_app_hub_c67, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt22Screen()))),
        DsNavTile(glyph: gen_app_hub_c68, title: gen_app_hub_c69, sub: gen_app_hub_c70, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt23Screen()))),
        DsNavTile(glyph: gen_app_hub_c71, title: gen_app_hub_c72, sub: gen_app_hub_c73, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt24Screen()))),
        DsNavTile(glyph: gen_app_hub_c74, title: gen_app_hub_c75, sub: gen_app_hub_c76, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt25Screen()))),
        DsNavTile(glyph: gen_app_hub_c77, title: gen_app_hub_c78, sub: gen_app_hub_c79, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt26Screen()))),
        DsNavTile(glyph: gen_app_hub_c80, title: gen_app_hub_c81, sub: gen_app_hub_c82, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt27Screen()))),
        DsNavTile(glyph: gen_app_hub_c83, title: gen_app_hub_c84, sub: gen_app_hub_c85, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt28Screen()))),
        DsNavTile(glyph: gen_app_hub_c86, title: gen_app_hub_c87, sub: gen_app_hub_c88, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt29Screen()))),
        DsNavTile(glyph: gen_app_hub_c89, title: gen_app_hub_c90, sub: gen_app_hub_c91, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppScr30Screen()))),
        DsNavTile(glyph: gen_app_hub_c92, title: gen_app_hub_c93, sub: gen_app_hub_c94, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppScr31Screen()))),
        DsNavTile(glyph: gen_app_hub_c95, title: gen_app_hub_c96, sub: gen_app_hub_c97, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppScr32Screen()))),
        DsNavTile(glyph: gen_app_hub_c98, title: gen_app_hub_c99, sub: gen_app_hub_c100, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppScr33Screen()))),
        DsNavTile(glyph: gen_app_hub_c101, title: gen_app_hub_c102, sub: gen_app_hub_c103, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppScr34Screen()))),
        DsNavTile(glyph: gen_app_hub_c104, title: gen_app_hub_c105, sub: gen_app_hub_c106, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppBind1Screen()))),
        DsNavTile(glyph: gen_app_hub_c107, title: gen_app_hub_c108, sub: gen_app_hub_c109, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppBind2Screen()))),
        DsNavTile(glyph: gen_app_hub_c110, title: gen_app_hub_c111, sub: gen_app_hub_c112, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppBind3Screen()))),
        DsNavTile(glyph: gen_app_hub_c113, title: gen_app_hub_c114, sub: gen_app_hub_c115, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppBind4Screen()))),
        DsNavTile(glyph: gen_app_hub_c116, title: gen_app_hub_c117, sub: gen_app_hub_c118, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppBind5Screen()))),
        DsNavTile(glyph: gen_app_hub_c119, title: gen_app_hub_c120, sub: gen_app_hub_c121, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppBind6Screen()))),
        DsNavTile(glyph: gen_app_hub_c122, title: gen_app_hub_c123, sub: gen_app_hub_c124, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppBind7Screen()))),
        DsNavTile(glyph: gen_app_hub_c125, title: gen_app_hub_c126, sub: gen_app_hub_c127, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppBind8Screen()))),
        DsNavTile(glyph: gen_app_hub_c128, title: gen_app_hub_c129, sub: gen_app_hub_c130, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppBind9Screen()))),
        DsNavTile(glyph: gen_app_hub_c131, title: gen_app_hub_c132, sub: gen_app_hub_c133, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppBind10Screen()))),
        DsNavTile(glyph: gen_app_hub_c134, title: gen_app_hub_c135, sub: gen_app_hub_c136, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppBind11Screen()))),
        DsNavTile(glyph: gen_app_hub_c137, title: gen_app_hub_c138, sub: gen_app_hub_c139, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppBind12Screen()))),
        DsNavTile(glyph: gen_app_hub_c140, title: gen_app_hub_c141, sub: gen_app_hub_c142, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppBind13Screen()))),
        DsNavTile(glyph: gen_app_hub_c143, title: gen_app_hub_c144, sub: gen_app_hub_c145, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppAuditScreen()))),
        DsNavTile(glyph: gen_app_hub_c146, title: gen_app_hub_c147, sub: gen_app_hub_c148, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppFlagsScreen()))),
        DsNavTile(glyph: gen_app_hub_c149, title: gen_app_hub_c150, sub: gen_app_hub_c151, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppSettingsScreen()))),
  ];

  Widget _roleChip(int i, String label) {
    final sel = appStore.role == i;
    return Padding(
      padding: const EdgeInsets.only(left: 8, bottom: 8),
      child: Material(
        color: sel ? DsTokens.accent : const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(20),
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: () => setState(() => appStore.setRole(i)),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            child: Text(label, style: TextStyle(color: sel ? Colors.white : DsTokens.muted, fontSize: 13, fontWeight: FontWeight.w700)),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final all = _tiles(context);
    final vis = _vis[appStore.role.clamp(0, _vis.length - 1)];
    return DsScaffold(
      title: gen_app_hub_c0,
      subtitle: '${vis.length} מסכים גלויים',
      icon: gen_app_hub_c1,
      children: [
        Container(
          margin: const EdgeInsets.only(bottom: 4),
          child: Wrap(children: [_roleChip(0, gen_app_hub_c152), _roleChip(1, gen_app_hub_c153), _roleChip(2, gen_app_hub_c154), _roleChip(3, gen_app_hub_c155), _roleChip(4, gen_app_hub_c156), _roleChip(5, gen_app_hub_c157), _roleChip(6, gen_app_hub_c158), _roleChip(7, gen_app_hub_c159)]),
        ),
        for (final i in vis) all[i],
      ],
    );
  }
}
