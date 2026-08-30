// 🧬 חולל ע"י המחולל (genesis-gen, הכרעות 17+18) — בקשה ⇒ בחירת-אטומים ⇒ חיווט ⇒ מסך. אל תערוך ידנית.
// 🧬 שם: הירו 🗂️ פרויקט | ישות מורכבת — טופס + טבלה
// 🧬 בקשה: הירו 🗂️ פרויקט | ישות מורכבת — טופס + טבלה · אטום BreadcrumbTrail פרויקט: תכנון / הצעה / חוזה / ביצוע / מסירה · כותרת טופס פרויקט · אטום InlineTextRow שם · אטום NumberStepper תקציב · אטום AnimatedToggle סטטוס · אטום FabMenu שמירה · אטום NeonButton קדם להצעה · כותרת רשומות פרויקט · אטום DataGrid פרויקט · באנר ישות פרויקט: 3 שדות · 5-שלבי workflow · מהמדף
// 🧬 אטומים שנבחרו: BreadcrumbTrail · CaSubTitle · InlineTextRow · NumberStepper · AnimatedToggle · FabMenu · NeonButton · CaSubTitle · DataGrid · CoinBanner
import '../dart-data-bs/auto/gen_entity_content.dart';
import '../dart-ui-bs/animated_toggle.dart';
import '../dart-ui-bs/auto/bs_tokens.dart';
import '../dart-ui-bs/auto/ca_sub_title.dart';
import '../dart-ui-bs/auto/coin_banner.dart';
import '../dart-ui-bs/auto/inline_text_row.dart';
import '../dart-ui-bs/breadcrumb_trail.dart';
import '../dart-ui-bs/data_grid.dart';
import '../dart-ui-bs/fab_menu.dart';
import '../dart-ui-bs/neon_button.dart';
import '../dart-ui-bs/number_stepper.dart';
import 'package:flutter/material.dart';

class GenEntityScreen extends StatefulWidget {
  const GenEntityScreen({super.key});

  @override
  State<GenEntityScreen> createState() => _GenEntityScreenState();
}

class _GenEntityScreenState extends State<GenEntityScreen> {
  String _t1 = '';

  void _toast(String msg) => ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(msg), duration: const Duration(seconds: 2)),
      );

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: BsTokens.bgLight,
        appBar: AppBar(title: Text(gen_entity_app_bar_title)),
        body: ListView(
          padding: const EdgeInsets.symmetric(vertical: 12),
          children: [
          BreadcrumbTrail(labels: const <String>[gen_entity_crumbs_option, gen_entity_crumbs_option2, gen_entity_crumbs_option3, gen_entity_crumbs_option4, gen_entity_crumbs_option5], height: 16, radius: 12, accentColor: BsTokens.brand, baseColor: BsTokens.inkLight, fillColor: BsTokens.cardLight),
          CaSubTitle(gen_entity_header_text),
          InlineTextRow(label: gen_entity_textfield_label, hint: gen_entity_textfield_hint, value: _t1, onChanged: (v) => setState(() => _t1 = v)),
          NumberStepper(label: gen_entity_numstep_label, height: 16, target: 0, radius: 12, accentColor: BsTokens.brand, baseColor: BsTokens.inkLight, fillColor: BsTokens.cardLight),
          AnimatedToggle(label: gen_entity_toggle_label, height: 16, radius: 12, accentColor: BsTokens.brand, baseColor: BsTokens.inkLight, fillColor: BsTokens.cardLight),
          FabMenu(height: 16, radius: 12, accentColor: BsTokens.brand, baseColor: BsTokens.inkLight, fillColor: BsTokens.cardLight),
          NeonButton(label: gen_entity_neon_label, height: 16, radius: 12, accentColor: BsTokens.brand, baseColor: BsTokens.inkLight, onPressed: () => _toast(gen_entity_neon_toast)),
          CaSubTitle(gen_entity_header_text2),
          DataGrid(height: 16, rows: 0, radius: 12, accentColor: BsTokens.brand, baseColor: BsTokens.inkLight, fillColor: BsTokens.cardLight),
          CoinBanner(coins: 0, sub: gen_entity_banner_sub),
          ],
        ),
      ),
    );
  }
}
