// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent30_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';

import 'package:flutter/material.dart';

class GenAppEnt30Screen extends StatefulWidget {
  const GenAppEnt30Screen({super.key});

  @override
  State<GenAppEnt30Screen> createState() => _GenAppEnt30ScreenState();
}

class _GenAppEnt30ScreenState extends State<GenAppEnt30Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת

  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent30_c8: _v[0] ?? '', gen_app_ent30_c9: _v[1] ?? '', gen_app_ent30_c10: _v[2] ?? '', gen_app_ent30_c11: _v[3] ?? '', gen_app_ent30_c12: _v[4] ?? '', gen_app_ent30_c13: _v[5] ?? '', gen_app_ent30_c14: _v[6] ?? '', gen_app_ent30_c15: _v[7] ?? '', gen_app_ent30_c16: _v[8] ?? '', gen_app_ent30_c17: _v[9] ?? '', gen_app_ent30_c18: _v[10] ?? '', gen_app_ent30_c19: _v[11] ?? '', gen_app_ent30_c20: _v[12] ?? '', gen_app_ent30_c21: _v[13] ?? '', gen_app_ent30_c22: _v[14] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent30', _editId!, map);
    } else {
      appStore.add('app_ent30', <String, String>{...map, '__stage': '0'});
    }
    setState(() { _v.clear(); _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent30_c8] ?? '', 1: r[gen_app_ent30_c9] ?? '', 2: r[gen_app_ent30_c10] ?? '', 3: r[gen_app_ent30_c11] ?? '', 4: r[gen_app_ent30_c12] ?? '', 5: r[gen_app_ent30_c13] ?? '', 6: r[gen_app_ent30_c14] ?? '', 7: r[gen_app_ent30_c15] ?? '', 8: r[gen_app_ent30_c16] ?? '', 9: r[gen_app_ent30_c17] ?? '', 10: r[gen_app_ent30_c18] ?? '', 11: r[gen_app_ent30_c19] ?? '', 12: r[gen_app_ent30_c20] ?? '', 13: r[gen_app_ent30_c21] ?? '', 14: r[gen_app_ent30_c22] ?? ''};
    });
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_ent30_c8, gen_app_ent30_c9, gen_app_ent30_c10, gen_app_ent30_c11, gen_app_ent30_c12, gen_app_ent30_c13, gen_app_ent30_c14, gen_app_ent30_c15, gen_app_ent30_c16, gen_app_ent30_c17, gen_app_ent30_c18, gen_app_ent30_c19, gen_app_ent30_c20, gen_app_ent30_c21, gen_app_ent30_c22], values: [r[gen_app_ent30_c8] ?? '', appStore.displayOf('app_ent18', r[gen_app_ent30_c9] ?? ''), appStore.displayOf('app_ent15', r[gen_app_ent30_c10] ?? ''), r[gen_app_ent30_c11] ?? '', r[gen_app_ent30_c12] ?? '', r[gen_app_ent30_c13] ?? '', r[gen_app_ent30_c14] ?? '', r[gen_app_ent30_c15] ?? '', r[gen_app_ent30_c16] ?? '', appStore.displayOf('app_ent31', r[gen_app_ent30_c17] ?? ''), r[gen_app_ent30_c18] ?? '', r[gen_app_ent30_c19] ?? '', r[gen_app_ent30_c20] ?? '', r[gen_app_ent30_c21] ?? '', r[gen_app_ent30_c22] ?? ''], stage: (const [gen_app_ent30_c23, gen_app_ent30_c24, gen_app_ent30_c25])[appStore.stageOf('app_ent30', rid)], stageDone: appStore.stageOf('app_ent30', rid) >= 2, onAdvance: () => appStore.advance('app_ent30', rid, 3), onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent30', rid));
  }

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_ent30_c0,
      subtitle: gen_app_ent30_c1,
      icon: gen_app_ent30_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent30_c3 : gen_app_ent30_c4, onTap: _save),
      children: [
        DsWorkflow(steps: const [gen_app_ent30_c23, gen_app_ent30_c24, gen_app_ent30_c25], current: 0),
        DsSection(title: gen_app_ent30_c5, children: [
          DsField(label: gen_app_ent30_c8, hint: '', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsSelect(label: gen_app_ent30_c9, entity: 'app_ent18', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsSelect(label: gen_app_ent30_c10, entity: 'app_ent15', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent30_c11, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent30_c12, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent30_c13, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsField(label: gen_app_ent30_c14, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsField(label: gen_app_ent30_c15, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsField(label: gen_app_ent30_c16, hint: '', value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
          DsSelect(label: gen_app_ent30_c17, entity: 'app_ent31', value: _v[9] ?? '', onChanged: (v) => setState(() => _v[9] = v)),
          DsField(label: gen_app_ent30_c18, hint: '', value: _v[10] ?? '', onChanged: (v) => setState(() => _v[10] = v)),
          DsField(label: gen_app_ent30_c19, hint: '', value: _v[11] ?? '', onChanged: (v) => setState(() => _v[11] = v)),
          DsField(label: gen_app_ent30_c20, hint: '', value: _v[12] ?? '', onChanged: (v) => setState(() => _v[12] = v)),
          DsField(label: gen_app_ent30_c21, hint: '', value: _v[13] ?? '', onChanged: (v) => setState(() => _v[13] = v)),
          DsField(label: gen_app_ent30_c22, hint: '', value: _v[14] ?? '', onChanged: (v) => setState(() => _v[14] = v)),
        ]),
        DsSection(title: gen_app_ent30_c6, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final rs = appStore.records('app_ent30');
              if (rs.isEmpty) return const DsEmpty(label: gen_app_ent30_c7);
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
