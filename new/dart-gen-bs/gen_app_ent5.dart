// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent5_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/fmt-date.dart';
import 'package:flutter/material.dart';

class GenAppEnt5Screen extends StatefulWidget {
  const GenAppEnt5Screen({super.key});

  @override
  State<GenAppEnt5Screen> createState() => _GenAppEnt5ScreenState();
}

class _GenAppEnt5ScreenState extends State<GenAppEnt5Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת

  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent5_c8: _v[0] ?? '', gen_app_ent5_c9: _v[1] ?? '', gen_app_ent5_c10: _v[2] ?? '', gen_app_ent5_c11: _v[3] ?? '', gen_app_ent5_c13: _v[4] ?? '', gen_app_ent5_c15: _v[5] ?? '', gen_app_ent5_c16: _v[6] ?? '', gen_app_ent5_c18: _v[7] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent5', _editId!, map);
    } else {
      appStore.add('app_ent5', <String, String>{...map});
    }
    setState(() { _v.clear(); _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent5_c8] ?? '', 1: r[gen_app_ent5_c9] ?? '', 2: r[gen_app_ent5_c10] ?? '', 3: r[gen_app_ent5_c11] ?? '', 4: r[gen_app_ent5_c13] ?? '', 5: r[gen_app_ent5_c15] ?? '', 6: r[gen_app_ent5_c16] ?? '', 7: r[gen_app_ent5_c18] ?? ''};
    });
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_ent5_c8, gen_app_ent5_c9, gen_app_ent5_c10, gen_app_ent5_c11, gen_app_ent5_c13, gen_app_ent5_c15, gen_app_ent5_c16, gen_app_ent5_c18], values: [appStore.displayOf('app_ent4', r[gen_app_ent5_c8] ?? ''), r[gen_app_ent5_c9] ?? '', r[gen_app_ent5_c10] ?? '', r[gen_app_ent5_c11] ?? '', r[gen_app_ent5_c13] ?? '', appStore.displayOf('app_ent34', r[gen_app_ent5_c15] ?? ''), r[gen_app_ent5_c16] ?? '', r[gen_app_ent5_c18] ?? ''], onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent5', rid));
  }

  Widget _live(String label, String out) => Padding(
        padding: const EdgeInsets.only(top: 2, bottom: 6),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(11),
          decoration: BoxDecoration(color: DsTokens.accentSoft, borderRadius: BorderRadius.circular(DsTokens.rSm)),
          child: Row(children: [
            const Icon(Icons.bolt, size: 15, color: DsTokens.accentDark),
            const SizedBox(width: 7),
            Expanded(child: Text('$label · $out', style: const TextStyle(color: DsTokens.accentDark, fontSize: 13, fontWeight: FontWeight.w700))),
          ]),
        ),
      );

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_ent5_c0,
      subtitle: gen_app_ent5_c1,
      icon: gen_app_ent5_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent5_c3 : gen_app_ent5_c4, onTap: _save),
      children: [
        DsSection(title: gen_app_ent5_c5, children: [
          DsSelect(label: gen_app_ent5_c8, entity: 'app_ent4', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_ent5_c9, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsField(label: gen_app_ent5_c10, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent5_c11, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          if ((_v[3] ?? '').trim().isNotEmpty) _live(gen_app_ent5_c12, fmtDate((_v[3] ?? ''))),
          DsField(label: gen_app_ent5_c13, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          if ((_v[4] ?? '').trim().isNotEmpty) _live(gen_app_ent5_c14, fmtDate((_v[4] ?? ''))),
          DsSelect(label: gen_app_ent5_c15, entity: 'app_ent34', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsField(label: gen_app_ent5_c16, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          if ((_v[6] ?? '').trim().isNotEmpty) _live(gen_app_ent5_c17, fmtDate((_v[6] ?? ''))),
          DsField(label: gen_app_ent5_c18, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
        ]),
        DsSection(title: gen_app_ent5_c6, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final rs = appStore.records('app_ent5');
              if (rs.isEmpty) return const DsEmpty(label: gen_app_ent5_c7);
              return Column(children: [
                for (var i = 0; i < rs.length; i++)
                  _card(rs[i]),
              ]);
            },
          ),
        ]),
      ],
    );
  }
}
