// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent50_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_store.dart';

import 'package:flutter/material.dart';

class GenAppEnt50Screen extends StatefulWidget {
  const GenAppEnt50Screen({super.key});

  @override
  State<GenAppEnt50Screen> createState() => _GenAppEnt50ScreenState();
}

class _GenAppEnt50ScreenState extends State<GenAppEnt50Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת

  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent50_c8: _v[0] ?? '', gen_app_ent50_c9: _v[1] ?? '', gen_app_ent50_c10: _v[2] ?? '', gen_app_ent50_c11: _v[3] ?? '', gen_app_ent50_c12: _v[4] ?? '', gen_app_ent50_c13: _v[5] ?? '', gen_app_ent50_c14: _v[6] ?? '', gen_app_ent50_c15: _v[7] ?? '', gen_app_ent50_c16: _v[8] ?? '', gen_app_ent50_c17: _v[9] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent50', _editId!, map);
    } else {
      appStore.add('app_ent50', <String, String>{...map});
    }
    setState(() { _v.clear(); _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent50_c8] ?? '', 1: r[gen_app_ent50_c9] ?? '', 2: r[gen_app_ent50_c10] ?? '', 3: r[gen_app_ent50_c11] ?? '', 4: r[gen_app_ent50_c12] ?? '', 5: r[gen_app_ent50_c13] ?? '', 6: r[gen_app_ent50_c14] ?? '', 7: r[gen_app_ent50_c15] ?? '', 8: r[gen_app_ent50_c16] ?? '', 9: r[gen_app_ent50_c17] ?? ''};
    });
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_ent50_c8, gen_app_ent50_c9, gen_app_ent50_c10, gen_app_ent50_c11, gen_app_ent50_c12, gen_app_ent50_c13, gen_app_ent50_c14, gen_app_ent50_c15, gen_app_ent50_c16, gen_app_ent50_c17], values: [r[gen_app_ent50_c8] ?? '', r[gen_app_ent50_c9] ?? '', r[gen_app_ent50_c10] ?? '', r[gen_app_ent50_c11] ?? '', r[gen_app_ent50_c12] ?? '', r[gen_app_ent50_c13] ?? '', r[gen_app_ent50_c14] ?? '', r[gen_app_ent50_c15] ?? '', r[gen_app_ent50_c16] ?? '', r[gen_app_ent50_c17] ?? ''], onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent50', rid));
  }

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_ent50_c0,
      subtitle: gen_app_ent50_c1,
      icon: gen_app_ent50_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent50_c3 : gen_app_ent50_c4, onTap: _save),
      children: [
        DsSection(title: gen_app_ent50_c5, children: [
          DsField(label: gen_app_ent50_c8, hint: '', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_ent50_c9, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsField(label: gen_app_ent50_c10, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent50_c11, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent50_c12, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent50_c13, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsField(label: gen_app_ent50_c14, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsField(label: gen_app_ent50_c15, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsField(label: gen_app_ent50_c16, hint: '', value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
          DsField(label: gen_app_ent50_c17, hint: '', value: _v[9] ?? '', onChanged: (v) => setState(() => _v[9] = v)),
        ]),
        DsSection(title: gen_app_ent50_c6, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final rs = appStore.records('app_ent50');
              if (rs.isEmpty) return const DsEmpty(label: gen_app_ent50_c7);
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
