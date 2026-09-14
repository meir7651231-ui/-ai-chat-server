// 🧭 חולל ע"י ניווט-מקשרים (app-shell · G26 · הכרעה-27) — עמוד-השורש: עובדות · ישויות-בנות (מסוננות לרשומה) · דוח. אל תערוך ידנית.

import '../dart-data-bs/auto/gen_app_gentikim_root_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/premium/surfaces/stat_hero.dart';
import 'gen_app_gentikim_ent1.dart';
import 'gen_app_gentikim_ent2.dart';
import 'gen_behaviors.dart';



import 'package:flutter/material.dart';

/// 8000 ⇒ 8,000 · 12.5 ⇒ 12.5 — סכום קריא בתיק (רק תצוגה; הרשומה נשארת ספרות)
/// ב׳-מג · תאריך בתיק כמו שאומרים: היום (9.9) · מחר (10.9) · יום שני 21.9 · 3.10.2027 — ISO נשאר בנתונים
String _fmtDate(String s) { final t = s.trim(); if (t.length < 10 || DateTime.tryParse(t.length == 10 ? '${t}T12:00:00' : t) == null) return t; final p = bhDayLabelParts(t.substring(0, 10), bhIso(DateTime.now())); switch (p[0]) { case 'today': return gen_app_gentikim_root_c25; case 'tomorrow': return gen_app_gentikim_root_c26; case 'yesterday': return gen_app_gentikim_root_c27; case 'weekday': return gen_app_gentikim_root_c28.replaceAll('{day}', gen_app_gentikim_root_c29.split(',')[int.parse(p[1])]) + ' ' + p[2]; default: return p[2]; } }   // ב׳-מג · תאריך במילים בתיק · G34ב · שכבת-ההרכבה
/// ב׳-נד · שורות «מה קרה מאז?» — «2026-09-01 · טקסט» ⇒ «יום שלישי 1.9 · טקסט»
String _noteText(String s) => s.split('\n').map((l) { final m = RegExp(r'^(\d{4}-\d{2}-\d{2}) · (.*)$').firstMatch(l); return m == null ? l : _fmtDate(m.group(1)!) + ' · ' + m.group(2)!; }).join('\n');
String _fmtNum(String s) { final t = s.trim(); final v = num.tryParse(t.replaceAll(',', '')); if (v == null) return t; final parts = t.replaceAll(',', '').split('.'); final ip = bhThousands(num.tryParse(parts[0]) ?? 0); return parts.length > 1 ? ip + '.' + parts[1] : ip; }   // G34 · חלקיק fMoney (מפרידי-אלפים)

class GenAppGentikimRootScreen extends StatelessWidget {
  const GenAppGentikimRootScreen({required this.id, super.key});
  final String id;   // ignore: unused_element
  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) {
    final r0 = appStore.byId('app_gentikim_ent1', id);
    if (r0 == null) return DsScaffold(title: gen_app_gentikim_root_c30, subtitle: gen_app_gentikim_root_c31, icon: gen_app_gentikim_root_c32, children: const []);
    return DsScaffold(title: appStore.displayOf('app_gentikim_ent1', id), subtitle: gen_app_gentikim_root_c24, icon: gen_app_gentikim_root_c33, children: [
      Padding(padding: const EdgeInsets.only(bottom: 12), child: DsSection(title: gen_app_gentikim_root_c15, children: [if ((r0[gen_app_gentikim_root_c12] ?? '').trim().isNotEmpty) StatHero(value: (r0[gen_app_gentikim_root_c1] ?? ''), label: gen_app_gentikim_root_c0), if ((r0[gen_app_gentikim_root_c13] ?? '').trim().isNotEmpty) StatHero(value: (r0[gen_app_gentikim_root_c5] ?? ''), label: gen_app_gentikim_root_c4), if ((r0[gen_app_gentikim_root_c14] ?? '').trim().isNotEmpty) StatHero(value: (r0[gen_app_gentikim_root_c9] ?? ''), label: gen_app_gentikim_root_c8)], tone: 0)),
      Padding(padding: const EdgeInsets.only(bottom: 12), child: DsSection(title: gen_app_gentikim_root_c23 + ' · ' + appStore.referencing('app_gentikim_ent2', gen_app_gentikim_root_c16, id).length.toString(), children: [for (final r in appStore.referencing('app_gentikim_ent2', gen_app_gentikim_root_c16, id)) DsNavTile(glyph: gen_app_gentikim_root_c22, title: (r[gen_app_gentikim_root_c17] ?? ''), sub: (r[gen_app_gentikim_root_c18] ?? ''), onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => GenAppGentikimEnt2Screen(scopeField: gen_app_gentikim_root_c19, scopeId: id)))), DsChipButton(label: gen_app_gentikim_root_c20, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => GenAppGentikimEnt2Screen(scopeField: gen_app_gentikim_root_c19, scopeId: id))))], tone: 0)),
    ]);
  });
}
