// ✨ חולל ע"י מנוע-הרינדור (render-ds) — לוח-ניווט + שער-הרשאות (בורר-תפקיד חי · נשמר). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_hub_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import 'gen_app_audit.dart';
import 'gen_app_bind.dart';
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
import 'gen_app_ent30.dart';
import 'gen_app_ent31.dart';
import 'gen_app_ent32.dart';
import 'gen_app_ent33.dart';
import 'gen_app_ent34.dart';
import 'gen_app_ent35.dart';
import 'gen_app_ent36.dart';
import 'gen_app_ent37.dart';
import 'gen_app_ent38.dart';
import 'gen_app_ent39.dart';
import 'gen_app_ent4.dart';
import 'gen_app_ent40.dart';
import 'gen_app_ent41.dart';
import 'gen_app_ent42.dart';
import 'gen_app_ent43.dart';
import 'gen_app_ent44.dart';
import 'gen_app_ent45.dart';
import 'gen_app_ent46.dart';
import 'gen_app_ent47.dart';
import 'gen_app_ent48.dart';
import 'gen_app_ent49.dart';
import 'gen_app_ent5.dart';
import 'gen_app_ent50.dart';
import 'gen_app_ent51.dart';
import 'gen_app_ent52.dart';
import 'gen_app_ent53.dart';
import 'gen_app_ent54.dart';
import 'gen_app_ent55.dart';
import 'gen_app_ent56.dart';
import 'gen_app_ent57.dart';
import 'gen_app_ent58.dart';
import 'gen_app_ent59.dart';
import 'gen_app_ent6.dart';
import 'gen_app_ent60.dart';
import 'gen_app_ent61.dart';
import 'gen_app_ent62.dart';
import 'gen_app_ent63.dart';
import 'gen_app_ent64.dart';
import 'gen_app_ent65.dart';
import 'gen_app_ent66.dart';
import 'gen_app_ent67.dart';
import 'gen_app_ent68.dart';
import 'gen_app_ent69.dart';
import 'gen_app_ent7.dart';
import 'gen_app_ent70.dart';
import 'gen_app_ent71.dart';
import 'gen_app_ent8.dart';
import 'gen_app_ent9.dart';
import 'gen_app_flags.dart';
import 'gen_app_scr72.dart';
import 'gen_app_scr73.dart';
import 'gen_app_scr74.dart';
import 'gen_app_scr75.dart';
import 'gen_app_scr76.dart';
import 'gen_app_scr77.dart';
import 'gen_app_settings.dart';
import 'package:flutter/material.dart';

class GenAppHubScreen extends StatefulWidget {
  const GenAppHubScreen({super.key});

  @override
  State<GenAppHubScreen> createState() => _GenAppHubScreenState();
}

class _GenAppHubScreenState extends State<GenAppHubScreen> {
  static const List<List<int>> _vis = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80], [10, 14, 15, 20, 21, 23, 24, 25, 27, 33, 41, 58, 65, 71, 72, 73, 74, 75, 76], [6, 7, 12, 16, 69], [14, 23, 27, 28, 29, 33], [14, 23, 27, 33, 37], [35, 37, 38], [40, 41, 42], [43, 44, 45, 46], [10, 15, 23, 27, 33, 45, 59], [23, 27, 28, 29, 31, 33]];

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
        DsNavTile(glyph: gen_app_hub_c89, title: gen_app_hub_c90, sub: gen_app_hub_c91, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt30Screen()))),
        DsNavTile(glyph: gen_app_hub_c92, title: gen_app_hub_c93, sub: gen_app_hub_c94, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt31Screen()))),
        DsNavTile(glyph: gen_app_hub_c95, title: gen_app_hub_c96, sub: gen_app_hub_c97, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt32Screen()))),
        DsNavTile(glyph: gen_app_hub_c98, title: gen_app_hub_c99, sub: gen_app_hub_c100, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt33Screen()))),
        DsNavTile(glyph: gen_app_hub_c101, title: gen_app_hub_c102, sub: gen_app_hub_c103, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt34Screen()))),
        DsNavTile(glyph: gen_app_hub_c104, title: gen_app_hub_c105, sub: gen_app_hub_c106, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt35Screen()))),
        DsNavTile(glyph: gen_app_hub_c107, title: gen_app_hub_c108, sub: gen_app_hub_c109, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt36Screen()))),
        DsNavTile(glyph: gen_app_hub_c110, title: gen_app_hub_c111, sub: gen_app_hub_c112, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt37Screen()))),
        DsNavTile(glyph: gen_app_hub_c113, title: gen_app_hub_c114, sub: gen_app_hub_c115, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt38Screen()))),
        DsNavTile(glyph: gen_app_hub_c116, title: gen_app_hub_c117, sub: gen_app_hub_c118, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt39Screen()))),
        DsNavTile(glyph: gen_app_hub_c119, title: gen_app_hub_c120, sub: gen_app_hub_c121, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt40Screen()))),
        DsNavTile(glyph: gen_app_hub_c122, title: gen_app_hub_c123, sub: gen_app_hub_c124, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt41Screen()))),
        DsNavTile(glyph: gen_app_hub_c125, title: gen_app_hub_c126, sub: gen_app_hub_c127, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt42Screen()))),
        DsNavTile(glyph: gen_app_hub_c128, title: gen_app_hub_c129, sub: gen_app_hub_c130, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt43Screen()))),
        DsNavTile(glyph: gen_app_hub_c131, title: gen_app_hub_c132, sub: gen_app_hub_c133, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt44Screen()))),
        DsNavTile(glyph: gen_app_hub_c134, title: gen_app_hub_c135, sub: gen_app_hub_c136, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt45Screen()))),
        DsNavTile(glyph: gen_app_hub_c137, title: gen_app_hub_c138, sub: gen_app_hub_c139, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt46Screen()))),
        DsNavTile(glyph: gen_app_hub_c140, title: gen_app_hub_c141, sub: gen_app_hub_c142, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt47Screen()))),
        DsNavTile(glyph: gen_app_hub_c143, title: gen_app_hub_c144, sub: gen_app_hub_c145, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt48Screen()))),
        DsNavTile(glyph: gen_app_hub_c146, title: gen_app_hub_c147, sub: gen_app_hub_c148, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt49Screen()))),
        DsNavTile(glyph: gen_app_hub_c149, title: gen_app_hub_c150, sub: gen_app_hub_c151, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt50Screen()))),
        DsNavTile(glyph: gen_app_hub_c152, title: gen_app_hub_c153, sub: gen_app_hub_c154, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt51Screen()))),
        DsNavTile(glyph: gen_app_hub_c155, title: gen_app_hub_c156, sub: gen_app_hub_c157, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt52Screen()))),
        DsNavTile(glyph: gen_app_hub_c158, title: gen_app_hub_c159, sub: gen_app_hub_c160, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt53Screen()))),
        DsNavTile(glyph: gen_app_hub_c161, title: gen_app_hub_c162, sub: gen_app_hub_c163, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt54Screen()))),
        DsNavTile(glyph: gen_app_hub_c164, title: gen_app_hub_c165, sub: gen_app_hub_c166, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt55Screen()))),
        DsNavTile(glyph: gen_app_hub_c167, title: gen_app_hub_c168, sub: gen_app_hub_c169, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt56Screen()))),
        DsNavTile(glyph: gen_app_hub_c170, title: gen_app_hub_c171, sub: gen_app_hub_c172, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt57Screen()))),
        DsNavTile(glyph: gen_app_hub_c173, title: gen_app_hub_c174, sub: gen_app_hub_c175, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt58Screen()))),
        DsNavTile(glyph: gen_app_hub_c176, title: gen_app_hub_c177, sub: gen_app_hub_c178, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt59Screen()))),
        DsNavTile(glyph: gen_app_hub_c179, title: gen_app_hub_c180, sub: gen_app_hub_c181, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt60Screen()))),
        DsNavTile(glyph: gen_app_hub_c182, title: gen_app_hub_c183, sub: gen_app_hub_c184, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt61Screen()))),
        DsNavTile(glyph: gen_app_hub_c185, title: gen_app_hub_c186, sub: gen_app_hub_c187, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt62Screen()))),
        DsNavTile(glyph: gen_app_hub_c188, title: gen_app_hub_c189, sub: gen_app_hub_c190, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt63Screen()))),
        DsNavTile(glyph: gen_app_hub_c191, title: gen_app_hub_c192, sub: gen_app_hub_c193, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt64Screen()))),
        DsNavTile(glyph: gen_app_hub_c194, title: gen_app_hub_c195, sub: gen_app_hub_c196, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt65Screen()))),
        DsNavTile(glyph: gen_app_hub_c197, title: gen_app_hub_c198, sub: gen_app_hub_c199, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt66Screen()))),
        DsNavTile(glyph: gen_app_hub_c200, title: gen_app_hub_c201, sub: gen_app_hub_c202, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt67Screen()))),
        DsNavTile(glyph: gen_app_hub_c203, title: gen_app_hub_c204, sub: gen_app_hub_c205, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt68Screen()))),
        DsNavTile(glyph: gen_app_hub_c206, title: gen_app_hub_c207, sub: gen_app_hub_c208, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt69Screen()))),
        DsNavTile(glyph: gen_app_hub_c209, title: gen_app_hub_c210, sub: gen_app_hub_c211, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt70Screen()))),
        DsNavTile(glyph: gen_app_hub_c212, title: gen_app_hub_c213, sub: gen_app_hub_c214, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppEnt71Screen()))),
        DsNavTile(glyph: gen_app_hub_c215, title: gen_app_hub_c216, sub: gen_app_hub_c217, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppScr72Screen()))),
        DsNavTile(glyph: gen_app_hub_c218, title: gen_app_hub_c219, sub: gen_app_hub_c220, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppScr73Screen()))),
        DsNavTile(glyph: gen_app_hub_c221, title: gen_app_hub_c222, sub: gen_app_hub_c223, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppScr74Screen()))),
        DsNavTile(glyph: gen_app_hub_c224, title: gen_app_hub_c225, sub: gen_app_hub_c226, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppScr75Screen()))),
        DsNavTile(glyph: gen_app_hub_c227, title: gen_app_hub_c228, sub: gen_app_hub_c229, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppScr76Screen()))),
        DsNavTile(glyph: gen_app_hub_c230, title: gen_app_hub_c231, sub: gen_app_hub_c232, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppScr77Screen()))),
        DsNavTile(glyph: gen_app_hub_c233, title: gen_app_hub_c234, sub: gen_app_hub_c235, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppBindScreen()))),
        DsNavTile(glyph: gen_app_hub_c236, title: gen_app_hub_c237, sub: gen_app_hub_c238, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppAuditScreen()))),
        DsNavTile(glyph: gen_app_hub_c239, title: gen_app_hub_c240, sub: gen_app_hub_c241, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppFlagsScreen()))),
        DsNavTile(glyph: gen_app_hub_c242, title: gen_app_hub_c243, sub: gen_app_hub_c244, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppSettingsScreen()))),
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
          child: Wrap(children: [_roleChip(0, gen_app_hub_c245), _roleChip(1, gen_app_hub_c246), _roleChip(2, gen_app_hub_c247), _roleChip(3, gen_app_hub_c248), _roleChip(4, gen_app_hub_c249), _roleChip(5, gen_app_hub_c250), _roleChip(6, gen_app_hub_c251), _roleChip(7, gen_app_hub_c252), _roleChip(8, gen_app_hub_c253), _roleChip(9, gen_app_hub_c254)]),
        ),
        for (final i in vis) all[i],
      ],
    );
  }
}
