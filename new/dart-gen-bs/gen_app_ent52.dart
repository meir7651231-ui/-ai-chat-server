// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent52_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_date_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';

import 'package:flutter/material.dart';

class GenAppEnt52Screen extends StatefulWidget {
  const GenAppEnt52Screen({super.key});

  @override
  State<GenAppEnt52Screen> createState() => _GenAppEnt52ScreenState();
}

class _GenAppEnt52ScreenState extends State<GenAppEnt52Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת

  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent52_c8: _v[0] ?? '', gen_app_ent52_c9: _v[1] ?? '', gen_app_ent52_c10: _v[2] ?? '', gen_app_ent52_c11: _v[3] ?? '', gen_app_ent52_c12: _v[4] ?? '', gen_app_ent52_c13: _v[5] ?? '', gen_app_ent52_c14: _v[6] ?? '', gen_app_ent52_c15: _v[7] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent52', _editId!, map);
    } else {
      appStore.add('app_ent52', <String, String>{...map});
    }
    setState(() { _v.clear(); _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent52_c8] ?? '', 1: r[gen_app_ent52_c9] ?? '', 2: r[gen_app_ent52_c10] ?? '', 3: r[gen_app_ent52_c11] ?? '', 4: r[gen_app_ent52_c12] ?? '', 5: r[gen_app_ent52_c13] ?? '', 6: r[gen_app_ent52_c14] ?? '', 7: r[gen_app_ent52_c15] ?? ''};
    });
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_ent52_c8, gen_app_ent52_c9, gen_app_ent52_c10, gen_app_ent52_c11, gen_app_ent52_c12, gen_app_ent52_c13, gen_app_ent52_c14, gen_app_ent52_c15], values: [appStore.displayOf('app_ent11', r[gen_app_ent52_c8] ?? ''), r[gen_app_ent52_c9] ?? '', r[gen_app_ent52_c10] ?? '', r[gen_app_ent52_c11] ?? '', r[gen_app_ent52_c12] ?? '', r[gen_app_ent52_c13] ?? '', appStore.displayOf('app_ent12', r[gen_app_ent52_c14] ?? ''), r[gen_app_ent52_c15] ?? ''], onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent52', rid));
  }

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_ent52_c0,
      subtitle: gen_app_ent52_c1,
      icon: gen_app_ent52_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent52_c3 : gen_app_ent52_c4, onTap: _save),
      children: [
        DsSection(title: gen_app_ent52_c5, children: [
          DsSelect(label: gen_app_ent52_c8, entity: 'app_ent11', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_ent52_c9, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsField(label: gen_app_ent52_c10, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent52_c11, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent52_c12, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsDateField(label: gen_app_ent52_c13, value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsSelect(label: gen_app_ent52_c14, entity: 'app_ent12', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsField(label: gen_app_ent52_c15, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
        ]),
        DsSection(title: gen_app_ent52_c6, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final rs = appStore.records('app_ent52');
              if (rs.isEmpty) return const DsEmpty(label: gen_app_ent52_c7);
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
