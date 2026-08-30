// 🧬 חולל ע"י המחולל (genesis-gen, הכרעות 17+18) — בקשה ⇒ בחירת-אטומים ⇒ חיווט ⇒ מסך. אל תערוך ידנית.
// 🧬 שם: 🗂️ ליד
// 🧬 בקשה: הירו 🗂️ ליד | ישות מורכבת — טופס + טבלה · כותרת טופס ליד · אטום InlineTextRow שם · אטום GlowField טלפון · אטום NumberStepper תקציב · אטום DatePills תאריך · אטום FabMenu שמירה · כותרת חוקים פר-שדה · חישוב אין שקעים שם פרטי (kForType) · חישוב נרמול טלפון למפתח דדופ (normPhone) · חישוב תאריך לתצוגה (fmtDate) · כותרת רשומות ליד · אטום DataGrid ליד · באנר ישות ליד: 4 שדות · 3 חוקים · מהמדף
// 🧬 אטומים שנבחרו: CaSubTitle · InlineTextRow · GlowField · NumberStepper · DatePills · FabMenu · CaSubTitle · RStat · RStat · RStat · CaSubTitle · DataGrid · CoinBanner
import '../dart-data-bs/auto/gen_entity_content.dart';
import '../dart-maor/fmt-date.dart';
import '../dart-maor/norm-phone.dart';
import '../dart-ui-bs/auto/bs_tokens.dart';
import '../dart-ui-bs/auto/ca_sub_title.dart';
import '../dart-ui-bs/auto/coin_banner.dart';
import '../dart-ui-bs/auto/inline_text_row.dart';
import '../dart-ui-bs/auto/rstat.dart';
import '../dart-ui-bs/data_grid.dart';
import '../dart-ui-bs/date_pills.dart';
import '../dart-ui-bs/fab_menu.dart';
import '../dart-ui-bs/glow_field.dart';
import '../dart-ui-bs/number_stepper.dart';
import '../dart/k_for_type.dart';
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
          CaSubTitle(gen_entity_header_text),
          InlineTextRow(label: gen_entity_textfield_label, hint: gen_entity_textfield_hint, value: _t1, onChanged: (v) => setState(() => _t1 = v)),
          GlowField(hint: gen_entity_glowfield_hint, height: 16, radius: 12, accentColor: BsTokens.brand, baseColor: BsTokens.inkLight, fillColor: BsTokens.cardLight),
          NumberStepper(label: gen_entity_numstep_label, height: 16, target: 0, radius: 12, accentColor: BsTokens.brand, baseColor: BsTokens.inkLight, fillColor: BsTokens.cardLight),
          DatePills(height: 16, days: 0, radius: 12, accentColor: BsTokens.brand, baseColor: BsTokens.inkLight, fillColor: BsTokens.cardLight),
          FabMenu(height: 16, radius: 12, accentColor: BsTokens.brand, baseColor: BsTokens.inkLight, fillColor: BsTokens.cardLight),
          CaSubTitle(gen_entity_header_text2),
          Padding(padding: const EdgeInsets.symmetric(horizontal: 12), child: Row(children: [RStat(value: kForType(null).toString(), label: gen_entity_stat_label), RStat(value: normPhone(null), label: gen_entity_stat_label2), RStat(value: fmtDate(null), label: gen_entity_stat_label3)])),
          CaSubTitle(gen_entity_header_text3),
          DataGrid(height: 16, rows: 0, radius: 12, accentColor: BsTokens.brand, baseColor: BsTokens.inkLight, fillColor: BsTokens.cardLight),
          CoinBanner(coins: 0, sub: gen_entity_banner_sub),
          ],
        ),
      ),
    );
  }
}
