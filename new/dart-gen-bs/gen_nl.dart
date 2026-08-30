// 🧬 חולל ע"י המחולל (genesis-gen, הכרעות 17+18) — בקשה ⇒ בחירת-אטומים ⇒ חיווט ⇒ מסך. אל תערוך ידנית.
// 🧬 שם: הירו 🎯 לוח בקרה לניהול עסק עם הזמנות | נבנה מתיאור חופשי
// 🧬 בקשה: הירו 🎯 לוח בקרה לניהול עסק עם הזמנות | נבנה מתיאור חופשי · אטום HeroCard לוח בקרה לניהול עסק עם הזמנות · אטום EmptyStateCard לוח בקרה לניהול עסק עם הזמנות · אטום ManagerDashboardCountBadge לוח בקרה לניהול עסק עם הזמנות · אטום DataGrid לוח בקרה לניהול עסק עם הזמנות · אטום WorkerTaskDetailSheetPrimaryBtn לוח בקרה לניהול עסק עם הזמנות · אטום TitledSection לוח בקרה לניהול עסק עם הזמנות · אטום LiveStatusPill לוח בקרה לניהול עסק עם הזמנות · אטום OrderCard הזמנות · אטום CustomerCard לקוחות · אטום ProfileCard מדדים · באנר המחולל למד מהאטומים ומהלוחות ובחר לבד לפי משמעות
// 🧬 אטומים שנבחרו: HeroCard · EmptyStateCard · ManagerDashboardCountBadge · DataGrid · WorkerTaskDetailSheetPrimaryBtn · TitledSection · LiveStatusPill · OrderCard · CustomerCard · ProfileCard · CoinBanner
import '../dart-data-bs/auto/gen_nl_content.dart';
import '../dart-ui-bs/auto/bs_tokens.dart';
import '../dart-ui-bs/auto/coin_banner.dart';
import '../dart-ui-bs/auto/manager_dashboard_count_badge.dart';
import '../dart-ui-bs/auto/worker_task_detail_sheet_primary_btn.dart';
import '../dart-ui-bs/data_grid.dart';
import '../dart-ui-bs/empty_state_card.dart';
import '../dart-ui-bs/hero_card.dart';
import '../dart-ui-bs/order_card.dart';
import '../dart-ui-bs/profile_card.dart';
import '../dart-ui-bs/screens__manager_dashboard_screen/customer_card.dart';
import '../dart-ui-bs/screens__manager_dashboard_screen/live_status_pill.dart';
import '../dart-ui-bs/titled_section.dart';
import 'package:flutter/material.dart';

class GenNlScreen extends StatefulWidget {
  const GenNlScreen({super.key});

  @override
  State<GenNlScreen> createState() => _GenNlScreenState();
}

class _GenNlScreenState extends State<GenNlScreen> {
  int _n1 = 0;

  void _toast(String msg) => ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(msg), duration: const Duration(seconds: 2)),
      );

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: BsTokens.bgLight,
        appBar: AppBar(title: Text(gen_nl_app_bar_title)),
        body: ListView(
          padding: const EdgeInsets.symmetric(vertical: 12),
          children: [
          HeroCard(glyph: gen_nl_card_glyph, title: gen_nl_card_title, sub: gen_nl_card_sub, onTap: () => _toast(gen_nl_card_toast), cardColor: BsTokens.cardLight, inkColor: BsTokens.inkLight, mutedColor: BsTokens.mutedLight, borderColor: BsTokens.divider, radius: 12),
          EmptyStateCard(glyph: gen_nl_card_glyph2, message: gen_nl_card_message, surfaceColor: BsTokens.cardLight, mutedColor: BsTokens.mutedLight, borderColor: BsTokens.divider, radius: 12),
          ManagerDashboardCountBadge(label: gen_nl_other_label, count: _n1),
          DataGrid(height: 16, rows: 0, radius: 12, accentColor: BsTokens.brand, baseColor: BsTokens.inkLight, fillColor: BsTokens.cardLight),
          WorkerTaskDetailSheetPrimaryBtn(label: gen_nl_other_label2, onTap: () => _toast(gen_nl_other_toast)),
          TitledSection(title: gen_nl_header_title, inkColor: BsTokens.inkLight, child: const SizedBox(height: 4)),
          LiveStatusPill(text: gen_nl_other_text, textColor: BsTokens.inkLight, fillColor: BsTokens.cardLight, pillRadius: 12, horizontalPadding: 16),
          OrderCard(stageLabel: gen_nl_card_stage_label, itemsLabel: gen_nl_card_items_label, sumLabel: gen_nl_card_sum_label, onTap: () => _toast(gen_nl_card_toast2), cardColor: BsTokens.cardLight, inkColor: BsTokens.inkLight, mutedColor: BsTokens.mutedLight, borderColor: BsTokens.divider, radius: 12, width: 16),
          CustomerCard(glyph: gen_nl_card_glyph3, name: gen_nl_card_name, subLabel: gen_nl_card_sub_label, creditLine: gen_nl_card_credit_line, onTap: () => _toast(gen_nl_card_toast3), statusPill: const SizedBox(height: 4), creditBar: const SizedBox(height: 4), surfaceColor: BsTokens.cardLight, borderColor: BsTokens.divider, inkColor: BsTokens.inkLight, mutedColor: BsTokens.mutedLight, radius: 12, padding: (null as dynamic) /* לא-ממולא */, gap: 16, sectionGap: 16),
          ProfileCard(title: gen_nl_profile_title, sub: gen_nl_profile_sub, height: 16, radius: 12, accentColor: BsTokens.brand, baseColor: BsTokens.inkLight, fillColor: BsTokens.cardLight),
          CoinBanner(coins: 0, sub: gen_nl_banner_sub),
          ],
        ),
      ),
    );
  }
}
