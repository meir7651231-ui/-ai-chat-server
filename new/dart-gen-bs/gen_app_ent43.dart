// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent43_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_date_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';

import 'package:flutter/material.dart';

class GenAppEnt43Screen extends StatefulWidget {
  const GenAppEnt43Screen({super.key});

  @override
  State<GenAppEnt43Screen> createState() => _GenAppEnt43ScreenState();
}

class _GenAppEnt43ScreenState extends State<GenAppEnt43Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת


  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent43_c8: _v[0] ?? '', gen_app_ent43_c9: _v[1] ?? '', gen_app_ent43_c10: _v[2] ?? '', gen_app_ent43_c11: _v[3] ?? '', gen_app_ent43_c12: _v[4] ?? '', gen_app_ent43_c13: _v[5] ?? '', gen_app_ent43_c14: _v[6] ?? '', gen_app_ent43_c15: _v[7] ?? '', gen_app_ent43_c16: _v[8] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent43', _editId!, map);
    } else {
      appStore.add('app_ent43', <String, String>{...map});
    }
    setState(() { _v.clear(); _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent43_c8] ?? '', 1: r[gen_app_ent43_c9] ?? '', 2: r[gen_app_ent43_c10] ?? '', 3: r[gen_app_ent43_c11] ?? '', 4: r[gen_app_ent43_c12] ?? '', 5: r[gen_app_ent43_c13] ?? '', 6: r[gen_app_ent43_c14] ?? '', 7: r[gen_app_ent43_c15] ?? '', 8: r[gen_app_ent43_c16] ?? ''};
    });
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_ent43_c8, gen_app_ent43_c9, gen_app_ent43_c10, gen_app_ent43_c11, gen_app_ent43_c12, gen_app_ent43_c13, gen_app_ent43_c14, gen_app_ent43_c15, gen_app_ent43_c16], values: [appStore.displayOf('app_ent11', r[gen_app_ent43_c8] ?? ''), r[gen_app_ent43_c9] ?? '', r[gen_app_ent43_c10] ?? '', r[gen_app_ent43_c11] ?? '', r[gen_app_ent43_c12] ?? '', r[gen_app_ent43_c13] ?? '', r[gen_app_ent43_c14] ?? '', appStore.displayOf('app_ent70', r[gen_app_ent43_c15] ?? ''), r[gen_app_ent43_c16] ?? ''], onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent43', rid));
  }

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_ent43_c0,
      subtitle: gen_app_ent43_c1,
      icon: gen_app_ent43_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent43_c3 : gen_app_ent43_c4, onTap: _save),
      children: [
        DsSection(title: gen_app_ent43_c5, children: [
          DsSelect(label: gen_app_ent43_c8, entity: 'app_ent11', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_ent43_c9, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsField(label: gen_app_ent43_c10, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent43_c11, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent43_c12, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent43_c13, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsDateField(label: gen_app_ent43_c14, value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsSelect(label: gen_app_ent43_c15, entity: 'app_ent70', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsField(label: gen_app_ent43_c16, hint: '', value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
        ]),
        DsSection(title: gen_app_ent43_c6, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final rs = appStore.records('app_ent43');
              if (rs.isEmpty) return const DsEmpty(label: gen_app_ent43_c7);
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
