// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent11_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_search.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_date_field.dart';
import '../dart-ui-bs/ds/ds_number_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/advance-status.dart';
import '../dart/angle_digits.dart';
import 'package:flutter/material.dart';

class GenAppEnt11Screen extends StatefulWidget {
  const GenAppEnt11Screen({super.key});

  @override
  State<GenAppEnt11Screen> createState() => _GenAppEnt11ScreenState();
}

class _GenAppEnt11ScreenState extends State<GenAppEnt11Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת
  String _q = '';    // מחרוזת-חיפוש (סינון-רשומות חי)


  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent11_c9: _v[0] ?? '', gen_app_ent11_c10: _v[1] ?? '', gen_app_ent11_c12: _v[2] ?? '', gen_app_ent11_c13: _v[3] ?? '', gen_app_ent11_c14: _v[4] ?? '', gen_app_ent11_c15: _v[5] ?? '', gen_app_ent11_c16: _v[6] ?? '', gen_app_ent11_c17: _v[7] ?? '', gen_app_ent11_c18: _v[8] ?? '', gen_app_ent11_c19: _v[9] ?? '', gen_app_ent11_c20: _v[10] ?? '', gen_app_ent11_c21: _v[11] ?? '', gen_app_ent11_c22: _v[12] ?? '', gen_app_ent11_c23: _v[13] ?? '', gen_app_ent11_c24: _v[14] ?? '', gen_app_ent11_c25: _v[15] ?? '', gen_app_ent11_c26: _v[16] ?? '', gen_app_ent11_c27: _v[17] ?? '', gen_app_ent11_c28: _v[18] ?? '', gen_app_ent11_c29: _v[19] ?? '', gen_app_ent11_c30: _v[20] ?? '', gen_app_ent11_c31: _v[21] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent11', _editId!, map);
    } else {
      appStore.add('app_ent11', <String, String>{...map, '__stage': '0'});
    }
    setState(() { _v.clear(); _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent11_c9] ?? '', 1: r[gen_app_ent11_c10] ?? '', 2: r[gen_app_ent11_c12] ?? '', 3: r[gen_app_ent11_c13] ?? '', 4: r[gen_app_ent11_c14] ?? '', 5: r[gen_app_ent11_c15] ?? '', 6: r[gen_app_ent11_c16] ?? '', 7: r[gen_app_ent11_c17] ?? '', 8: r[gen_app_ent11_c18] ?? '', 9: r[gen_app_ent11_c19] ?? '', 10: r[gen_app_ent11_c20] ?? '', 11: r[gen_app_ent11_c21] ?? '', 12: r[gen_app_ent11_c22] ?? '', 13: r[gen_app_ent11_c23] ?? '', 14: r[gen_app_ent11_c24] ?? '', 15: r[gen_app_ent11_c25] ?? '', 16: r[gen_app_ent11_c26] ?? '', 17: r[gen_app_ent11_c27] ?? '', 18: r[gen_app_ent11_c28] ?? '', 19: r[gen_app_ent11_c29] ?? '', 20: r[gen_app_ent11_c30] ?? '', 21: r[gen_app_ent11_c31] ?? ''};
    });
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_ent11_c9, gen_app_ent11_c10, gen_app_ent11_c12, gen_app_ent11_c13, gen_app_ent11_c14, gen_app_ent11_c15, gen_app_ent11_c16, gen_app_ent11_c17, gen_app_ent11_c18, gen_app_ent11_c19, gen_app_ent11_c20, gen_app_ent11_c21, gen_app_ent11_c22, gen_app_ent11_c23, gen_app_ent11_c24, gen_app_ent11_c25, gen_app_ent11_c26, gen_app_ent11_c27, gen_app_ent11_c28, gen_app_ent11_c29, gen_app_ent11_c30, gen_app_ent11_c31], values: [r[gen_app_ent11_c9] ?? '', r[gen_app_ent11_c10] ?? '', appStore.displayOf('app_ent13', r[gen_app_ent11_c12] ?? ''), r[gen_app_ent11_c13] ?? '', r[gen_app_ent11_c14] ?? '', r[gen_app_ent11_c15] ?? '', r[gen_app_ent11_c16] ?? '', r[gen_app_ent11_c17] ?? '', r[gen_app_ent11_c18] ?? '', r[gen_app_ent11_c19] ?? '', r[gen_app_ent11_c20] ?? '', r[gen_app_ent11_c21] ?? '', r[gen_app_ent11_c22] ?? '', appStore.displayOf('app_ent15', r[gen_app_ent11_c23] ?? ''), r[gen_app_ent11_c24] ?? '', appStore.displayOf('app_ent2', r[gen_app_ent11_c25] ?? ''), appStore.displayOf('app_ent3', r[gen_app_ent11_c26] ?? ''), r[gen_app_ent11_c27] ?? '', r[gen_app_ent11_c28] ?? '', r[gen_app_ent11_c29] ?? '', r[gen_app_ent11_c30] ?? '', r[gen_app_ent11_c31] ?? ''], stage: (const [gen_app_ent11_c33, gen_app_ent11_c34, gen_app_ent11_c35, gen_app_ent11_c36, gen_app_ent11_c37, gen_app_ent11_c38, gen_app_ent11_c39])[appStore.stageOf('app_ent11', rid)], stageDone: appStore.stageOf('app_ent11', rid) >= 6, onAdvance: () => appStore.advance('app_ent11', rid, 7), onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent11', rid));
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
      title: gen_app_ent11_c0,
      subtitle: gen_app_ent11_c1,
      icon: gen_app_ent11_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent11_c3 : gen_app_ent11_c4, onTap: _save),
      children: [
        DsWorkflow(steps: const [gen_app_ent11_c33, gen_app_ent11_c34, gen_app_ent11_c35, gen_app_ent11_c36, gen_app_ent11_c37, gen_app_ent11_c38, gen_app_ent11_c39], current: 0),
        DsSection(title: gen_app_ent11_c5, children: [
          DsNumberField(label: gen_app_ent11_c9, value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_ent11_c10, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          if ((_v[1] ?? '').trim().isNotEmpty) _live(gen_app_ent11_c11, angleDigits((_v[1] ?? ''))),
          DsSelect(label: gen_app_ent11_c12, entity: 'app_ent13', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent11_c13, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsDateField(label: gen_app_ent11_c14, value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsDateField(label: gen_app_ent11_c15, value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsNumberField(label: gen_app_ent11_c16, value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsField(label: gen_app_ent11_c17, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsField(label: gen_app_ent11_c18, hint: '', value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
          DsField(label: gen_app_ent11_c19, hint: '', value: _v[9] ?? '', onChanged: (v) => setState(() => _v[9] = v)),
          DsField(label: gen_app_ent11_c20, hint: '', value: _v[10] ?? '', onChanged: (v) => setState(() => _v[10] = v)),
          DsField(label: gen_app_ent11_c21, hint: '', value: _v[11] ?? '', onChanged: (v) => setState(() => _v[11] = v)),
          DsField(label: gen_app_ent11_c22, hint: '', value: _v[12] ?? '', onChanged: (v) => setState(() => _v[12] = v)),
          DsSelect(label: gen_app_ent11_c23, entity: 'app_ent15', value: _v[13] ?? '', onChanged: (v) => setState(() => _v[13] = v)),
          DsField(label: gen_app_ent11_c24, hint: '', value: _v[14] ?? '', onChanged: (v) => setState(() => _v[14] = v)),
          DsSelect(label: gen_app_ent11_c25, entity: 'app_ent2', value: _v[15] ?? '', onChanged: (v) => setState(() => _v[15] = v)),
          DsSelect(label: gen_app_ent11_c26, entity: 'app_ent3', value: _v[16] ?? '', onChanged: (v) => setState(() => _v[16] = v)),
          DsField(label: gen_app_ent11_c27, hint: '', value: _v[17] ?? '', onChanged: (v) => setState(() => _v[17] = v)),
          DsField(label: gen_app_ent11_c28, hint: '', value: _v[18] ?? '', onChanged: (v) => setState(() => _v[18] = v)),
          DsField(label: gen_app_ent11_c29, hint: '', value: _v[19] ?? '', onChanged: (v) => setState(() => _v[19] = v)),
          DsField(label: gen_app_ent11_c30, hint: '', value: _v[20] ?? '', onChanged: (v) => setState(() => _v[20] = v)),
          DsField(label: gen_app_ent11_c31, hint: '', value: _v[21] ?? '', onChanged: (v) => setState(() => _v[21] = v)),
          if ((_v[21] ?? '').trim().isNotEmpty) _live(gen_app_ent11_c32, advanceStatus((_v[21] ?? ''))),
        ]),
        DsSection(title: gen_app_ent11_c6, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final all = appStore.records('app_ent11');
              if (all.isEmpty) return const DsEmpty(label: gen_app_ent11_c7);
              final q = _q.trim().toLowerCase();
              final rs = q.isEmpty ? all : all.where((r) => r.entries.any((e) => !e.key.startsWith('__') && e.value.toLowerCase().contains(q))).toList();
              return Column(children: [
                DsSearch(value: _q, onChanged: (v) => setState(() => _q = v)),
                if (rs.isEmpty) const DsEmpty(label: gen_app_ent11_c8),
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
