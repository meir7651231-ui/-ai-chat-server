// 🧭 חולל ע"י ניווט-מקשרים (app-shell · G26 · הכרעה-27) — עמוד-השורש: עובדות · ישויות-בנות (מסוננות לרשומה) · דוח. אל תערוך ידנית.

import '../dart-data-bs/auto/gen_app_panuy_root_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/premium/surfaces/stat_hero.dart';
import 'gen_app_panuy_ent1.dart';



import 'package:flutter/material.dart';
import '../dart-forge-bs/card/card.dart'; // G12c · עור-forge במודול (skin.stat/hero) — אטומי-DS הוחלפו באטומי-forge עם fields; צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים (האטום לובש את החריץ)
import '../dart-forge-bs/header/header.dart'; // G12c · עור-forge במודול (skin.stat/hero) — אטומי-DS הוחלפו באטומי-forge עם fields; צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים (האטום לובש את החריץ)

/// 8000 ⇒ 8,000 · 12.5 ⇒ 12.5 — סכום קריא בתיק (רק תצוגה; הרשומה נשארת ספרות)
/// ב׳-מג · תאריך בתיק כמו שאומרים: היום (9.9) · מחר (10.9) · יום שני 21.9 · 3.10.2027 — ISO נשאר בנתונים
String _fmtDate(String s) { final t = s.trim(); final d = DateTime.tryParse(t.length == 10 ? '${t}T12:00:00' : t); if (d == null) return t; final now = DateTime.now(); final n = DateTime(d.year, d.month, d.day).difference(DateTime(now.year, now.month, now.day)).inDays; final dm = '${d.day}.${d.month}'; if (n == 0) return gen_app_panuy_root_c72 + ' (' + dm + ')'; if (n == 1) return gen_app_panuy_root_c73 + ' (' + dm + ')'; if (n == -1) return gen_app_panuy_root_c74 + ' (' + dm + ')'; if (n.abs() <= 6) return gen_app_panuy_root_c75.replaceAll('{day}', gen_app_panuy_root_c76.split(',')[d.weekday % 7]) + ' ' + dm; return dm + '.${d.year}'; }
/// ב׳-נד · שורות «מה קרה מאז?» — «2026-09-01 · טקסט» ⇒ «יום שלישי 1.9 · טקסט»
String _noteText(String s) => s.split('\n').map((l) { final m = RegExp(r'^(\d{4}-\d{2}-\d{2}) · (.*)$').firstMatch(l); return m == null ? l : _fmtDate(m.group(1)!) + ' · ' + m.group(2)!; }).join('\n');
String _fmtNum(String s) { final t = s.trim(); final v = num.tryParse(t.replaceAll(',', '')); if (v == null) return t; final parts = t.replaceAll(',', '').split('.'); final ip = parts[0].replaceAllMapped(RegExp(r'\B(?=(\d{3})+(?!\d))'), (m) => ','); return parts.length > 1 ? ip + '.' + parts[1] : ip; }

class GenAppPanuyRootScreen extends StatelessWidget {
  const GenAppPanuyRootScreen({required this.id, super.key});
  final String id;   // ignore: unused_element
  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) {
    final r0 = appStore.byId('app_panuy_ent1', id);
    if (r0 == null) return DsScaffold(title: gen_app_panuy_root_c77, subtitle: gen_app_panuy_root_c78, icon: gen_app_panuy_root_c79, header: false, children: [ForgeCenteredPageHeader(fields: ['', gen_app_panuy_root_c77, gen_app_panuy_root_c78]), ...const []]);
    return DsScaffold(title: appStore.displayOf('app_panuy_ent1', id), subtitle: gen_app_panuy_root_c71, icon: gen_app_panuy_root_c80, header: false, children: [ForgeCenteredPageHeader(fields: ['', appStore.displayOf('app_panuy_ent1', id), gen_app_panuy_root_c71]), ...[
      Padding(padding: const EdgeInsets.only(bottom: 12), child: ForgeTitledSection(fields: [gen_app_panuy_root_c70, '', '', ''], child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [...[if ((r0[gen_app_panuy_root_c56] ?? '').trim().isNotEmpty) ConstrainedBox(constraints: const BoxConstraints(maxWidth: 420), child: ForgeStatPlain(fields: [gen_app_panuy_root_c0, (r0[gen_app_panuy_root_c1] ?? '')])), if ((r0[gen_app_panuy_root_c57] ?? '').trim().isNotEmpty) ConstrainedBox(constraints: const BoxConstraints(maxWidth: 420), child: ForgeStatPlain(fields: [gen_app_panuy_root_c4, (r0[gen_app_panuy_root_c5] ?? '')])), if ((r0[gen_app_panuy_root_c58] ?? '').trim().isNotEmpty) ConstrainedBox(constraints: const BoxConstraints(maxWidth: 420), child: ForgeStatPlain(fields: [gen_app_panuy_root_c8, (r0[gen_app_panuy_root_c9] ?? '')])), if ((r0[gen_app_panuy_root_c59] ?? '').trim().isNotEmpty) ConstrainedBox(constraints: const BoxConstraints(maxWidth: 420), child: ForgeStatPlain(fields: [gen_app_panuy_root_c12, (r0[gen_app_panuy_root_c13] ?? '')])), if ((r0[gen_app_panuy_root_c60] ?? '').trim().isNotEmpty) ConstrainedBox(constraints: const BoxConstraints(maxWidth: 420), child: ForgeStatPlain(fields: [gen_app_panuy_root_c16, (r0[gen_app_panuy_root_c17] ?? '')])), if ((r0[gen_app_panuy_root_c61] ?? '').trim().isNotEmpty) ConstrainedBox(constraints: const BoxConstraints(maxWidth: 420), child: ForgeStatPlain(fields: [gen_app_panuy_root_c20, (r0[gen_app_panuy_root_c21] ?? '')])), if ((r0[gen_app_panuy_root_c62] ?? '').trim().isNotEmpty) ConstrainedBox(constraints: const BoxConstraints(maxWidth: 420), child: ForgeStatPlain(fields: [gen_app_panuy_root_c24, _fmtNum(r0[gen_app_panuy_root_c25] ?? '')])), if ((r0[gen_app_panuy_root_c63] ?? '').trim().isNotEmpty) ConstrainedBox(constraints: const BoxConstraints(maxWidth: 420), child: ForgeStatPlain(fields: [gen_app_panuy_root_c28, _fmtNum(r0[gen_app_panuy_root_c29] ?? '')])), if ((r0[gen_app_panuy_root_c64] ?? '').trim().isNotEmpty) ConstrainedBox(constraints: const BoxConstraints(maxWidth: 420), child: ForgeStatPlain(fields: [gen_app_panuy_root_c32, (r0[gen_app_panuy_root_c33] ?? '')])), if ((r0[gen_app_panuy_root_c65] ?? '').trim().isNotEmpty) ConstrainedBox(constraints: const BoxConstraints(maxWidth: 420), child: ForgeStatPlain(fields: [gen_app_panuy_root_c36, (r0[gen_app_panuy_root_c37] ?? '')])), if ((r0[gen_app_panuy_root_c66] ?? '').trim().isNotEmpty) ConstrainedBox(constraints: const BoxConstraints(maxWidth: 420), child: ForgeStatPlain(fields: [gen_app_panuy_root_c40, (r0[gen_app_panuy_root_c41] ?? '')])), if ((r0[gen_app_panuy_root_c67] ?? '').trim().isNotEmpty) ConstrainedBox(constraints: const BoxConstraints(maxWidth: 420), child: ForgeStatPlain(fields: [gen_app_panuy_root_c44, (r0[gen_app_panuy_root_c45] ?? '')])), if ((r0[gen_app_panuy_root_c68] ?? '').trim().isNotEmpty) ConstrainedBox(constraints: const BoxConstraints(maxWidth: 420), child: ForgeStatPlain(fields: [gen_app_panuy_root_c48, (r0[gen_app_panuy_root_c49] ?? '')])), if ((r0[gen_app_panuy_root_c69] ?? '').trim().isNotEmpty) ConstrainedBox(constraints: const BoxConstraints(maxWidth: 420), child: ForgeStatPlain(fields: [gen_app_panuy_root_c52, _fmtNum(r0[gen_app_panuy_root_c53] ?? '')]))]]))),
    ]]);
  });
}
