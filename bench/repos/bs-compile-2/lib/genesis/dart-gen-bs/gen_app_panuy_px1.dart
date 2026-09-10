// 🧩 חולל ע"י מפרק-החלקיקים הפתוח (particles · הכרעה-27): כל חלקיק נמצא בכל הקטלוג ומורכב מחדש. אל תערוך ידנית.
//   טבלה = [טבלה] ⇒ table ⇒ [table] ⇒ DsTable
//   שם = שם ⇒ raw ⇒ [fact] ⇒ DsChip
//   זמין = זמין ⇒ partition ⇒ [group, alert] ⇒ DsSection + ToastCard
//   פנויים עכשיו = מונה(זמין=כן) ⇒ count ⇒ [headline] ⇒ KpiTile
//   הפרש רוחב = קו רוחב - קו רוחב שלי ⇒ − ⇒ [diff] ⇒ KpiTile
//   הפרש אורך = קו אורך - קו אורך שלי ⇒ − ⇒ [diff] ⇒ KpiTile
//   מרחק בריבוע = מרחק בריבוע ⇒ raw ⇒ [fact] ⇒ DsChip
//   מחיר לשעה = מחיר לשעה ⇒ raw ⇒ [fact] ⇒ DsChip
//   מחיר לשעתיים = מחיר לשעתיים ⇒ raw ⇒ [fact] ⇒ DsChip
//   ריק אין אף אחד פנוי לידך עכשיו = [ריק] אין אף אחד פנוי לידך עכשיו ⇒ empty ⇒ [empty] ⇒ EmptyState@premium/feedback
//   פעולה הזמן עכשיו = [פעולה] הזמן עכשיו ⇒ act ⇒ [action] ⇒ BigButton
//   מחיר לשעתיים בשורה = מחיר לשעה × שעות ⇒ × ⇒ [magnitude, magnitude, diff] ⇒ KpiTile

import '../dart-data-bs/auto/gen_app_panuy_px1_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/auto/big_button.dart';
import '../dart-ui-bs/auto/empty_state.dart';
import '../dart-ui-bs/ds/ds_table.dart';
import '../dart-ui-bs/premium/dataviz/kpi_tile.dart';
import '../dart-ui-bs/premium/feedback/toast_card.dart';
import 'gen_app_panuy_ent1.dart';
import 'package:flutter/material.dart';
import '../dart-forge-bs/card/card.dart'; // G12c · עור-forge במודול (skin.stat/hero) — אטומי-DS הוחלפו באטומי-forge עם fields; צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים (האטום לובש את החריץ)
import '../dart-forge-bs/header/header.dart'; // G12c · עור-forge במודול (skin.stat/hero) — אטומי-DS הוחלפו באטומי-forge עם fields; צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים (האטום לובש את החריץ)
import '../dart-forge-bs/spatial/spatial.dart'; // G12c · עור-forge במודול (skin.stat/hero) — אטומי-DS הוחלפו באטומי-forge עם fields; צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים (האטום לובש את החריץ)
import '../dart-forge-bs/status/status.dart'; // G12c · עור-forge במודול (skin.stat/hero) — אטומי-DS הוחלפו באטומי-forge עם fields; צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים (האטום לובש את החריץ)

class GenAppPanuyPx1Screen extends StatelessWidget {
  const GenAppPanuyPx1Screen({super.key});
  @override
  Widget build(BuildContext context) => DsScaffold(title: gen_app_panuy_px1_c94, subtitle: gen_app_panuy_px1_c95, icon: gen_app_panuy_px1_c96, header: false, children: [ForgeCenteredPageHeader(fields: ['', gen_app_panuy_px1_c94, gen_app_panuy_px1_c95]), ...[
    Padding(padding: const EdgeInsets.only(bottom: 10), child: AnimatedBuilder(animation: appStore, builder: (context, _) => ForgeDataGrid(bare: true, columns: [gen_app_panuy_px1_c1, gen_app_panuy_px1_c2, gen_app_panuy_px1_c3, gen_app_panuy_px1_c4, gen_app_panuy_px1_c5, gen_app_panuy_px1_c6, gen_app_panuy_px1_c7, gen_app_panuy_px1_c8, gen_app_panuy_px1_c9, gen_app_panuy_px1_c10, gen_app_panuy_px1_c11, gen_app_panuy_px1_c12, gen_app_panuy_px1_c13, gen_app_panuy_px1_c14], items: [for (final r in appStore.records('app_panuy_ent1')) [(r[gen_app_panuy_px1_c15] ?? ''), (r[gen_app_panuy_px1_c16] ?? ''), (r[gen_app_panuy_px1_c17] ?? ''), (r[gen_app_panuy_px1_c18] ?? ''), (r[gen_app_panuy_px1_c19] ?? ''), (r[gen_app_panuy_px1_c20] ?? ''), (r[gen_app_panuy_px1_c21] ?? ''), (r[gen_app_panuy_px1_c22] ?? ''), (r[gen_app_panuy_px1_c23] ?? ''), (r[gen_app_panuy_px1_c24] ?? ''), (r[gen_app_panuy_px1_c25] ?? ''), (r[gen_app_panuy_px1_c26] ?? ''), (r[gen_app_panuy_px1_c27] ?? ''), (r[gen_app_panuy_px1_c28] ?? '')]]))),
    Padding(padding: const EdgeInsets.only(bottom: 10), child: AnimatedBuilder(animation: appStore, builder: (context, _) => Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [for (final r in appStore.records('app_panuy_ent1').where((r) => (r[gen_app_panuy_px1_c34] ?? '').toString().trim().isNotEmpty)) Padding(padding: const EdgeInsets.only(bottom: 8), child: ForgeStatusChip(items: [[(r[gen_app_panuy_px1_c30] ?? '')]], variants: const <int>[0]))]))),
    Padding(padding: const EdgeInsets.only(bottom: 10), child: AnimatedBuilder(animation: appStore, builder: (context, _) => Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [ForgeTitledSection(fields: [gen_app_panuy_px1_c41 + ' · ' + appStore.records('app_panuy_ent1').where((r) => (r[gen_app_panuy_px1_c39] ?? '') == gen_app_panuy_px1_c40).toList().length.toString(), '', '', ''], child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [...[for (final r in appStore.records('app_panuy_ent1').where((r) => (r[gen_app_panuy_px1_c39] ?? '') == gen_app_panuy_px1_c40).toList()) ToastCard(message: (r[gen_app_panuy_px1_c36] ?? ''), tone: 0)]])), ForgeTitledSection(fields: [gen_app_panuy_px1_c46 + ' · ' + appStore.records('app_panuy_ent1').where((r) => (r[gen_app_panuy_px1_c44] ?? '') == gen_app_panuy_px1_c45).toList().length.toString(), '', '', ''], child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [...[for (final r in appStore.records('app_panuy_ent1').where((r) => (r[gen_app_panuy_px1_c44] ?? '') == gen_app_panuy_px1_c45).toList()) ToastCard(message: (r[gen_app_panuy_px1_c36] ?? ''), tone: 0)]]))]))),
    Padding(padding: const EdgeInsets.only(bottom: 10), child: AnimatedBuilder(animation: appStore, builder: (context, _) => ForgeStatPlain(fields: [gen_app_panuy_px1_c49, appStore.records('app_panuy_ent1').where((r) => (r[gen_app_panuy_px1_c51] ?? '') == gen_app_panuy_px1_c52).length.toDouble().toStringAsFixed(0)]))),
    Padding(padding: const EdgeInsets.only(bottom: 10), child: AnimatedBuilder(animation: appStore, builder: (context, _) => Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [for (final r in appStore.records('app_panuy_ent1')) Padding(padding: const EdgeInsets.only(bottom: 8), child: ForgeStatPlain(fields: [gen_app_panuy_px1_c55, ((num.tryParse(r[gen_app_panuy_px1_c56] ?? '') ?? 0) - (num.tryParse(r[gen_app_panuy_px1_c57] ?? '') ?? 0)).toStringAsFixed(0)]))]))),
    Padding(padding: const EdgeInsets.only(bottom: 10), child: AnimatedBuilder(animation: appStore, builder: (context, _) => Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [for (final r in appStore.records('app_panuy_ent1')) Padding(padding: const EdgeInsets.only(bottom: 8), child: ForgeStatPlain(fields: [gen_app_panuy_px1_c60, ((num.tryParse(r[gen_app_panuy_px1_c61] ?? '') ?? 0) - (num.tryParse(r[gen_app_panuy_px1_c62] ?? '') ?? 0)).toStringAsFixed(0)]))]))),
    Padding(padding: const EdgeInsets.only(bottom: 10), child: AnimatedBuilder(animation: appStore, builder: (context, _) => Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [for (final r in appStore.records('app_panuy_ent1').where((r) => (r[gen_app_panuy_px1_c70] ?? '').toString().trim().isNotEmpty)) Padding(padding: const EdgeInsets.only(bottom: 8), child: ForgeStatusChip(items: [[(r[gen_app_panuy_px1_c66] ?? '')]], variants: const <int>[0]))]))),
    Padding(padding: const EdgeInsets.only(bottom: 10), child: AnimatedBuilder(animation: appStore, builder: (context, _) => Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [for (final r in appStore.records('app_panuy_ent1').where((r) => (r[gen_app_panuy_px1_c76] ?? '').toString().trim().isNotEmpty)) Padding(padding: const EdgeInsets.only(bottom: 8), child: ForgeStatusChip(items: [[(r[gen_app_panuy_px1_c72] ?? '')]], variants: const <int>[0]))]))),
    Padding(padding: const EdgeInsets.only(bottom: 10), child: AnimatedBuilder(animation: appStore, builder: (context, _) => Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [for (final r in appStore.records('app_panuy_ent1').where((r) => (r[gen_app_panuy_px1_c82] ?? '').toString().trim().isNotEmpty)) Padding(padding: const EdgeInsets.only(bottom: 8), child: ForgeStatusChip(items: [[(r[gen_app_panuy_px1_c78] ?? '')]], variants: const <int>[0]))]))),
    Padding(padding: const EdgeInsets.only(bottom: 10), child: AnimatedBuilder(animation: appStore, builder: (context, _) => appStore.records('app_panuy_ent1').isEmpty ? EmptyState(label: gen_app_panuy_px1_c83) : const SizedBox.shrink())),
    Padding(padding: const EdgeInsets.only(bottom: 10), child: BigButton(label: gen_app_panuy_px1_c87, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const GenAppPanuyEnt1Screen())))),
    Padding(padding: const EdgeInsets.only(bottom: 10), child: AnimatedBuilder(animation: appStore, builder: (context, _) => Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [for (final r in appStore.records('app_panuy_ent1')) Padding(padding: const EdgeInsets.only(bottom: 8), child: ForgeStatPlain(fields: [gen_app_panuy_px1_c89, ((num.tryParse(r[gen_app_panuy_px1_c90] ?? '') ?? 0) * (num.tryParse(r[gen_app_panuy_px1_c91] ?? '') ?? 0)).toStringAsFixed(0)]))]))),
  ]]);
}
