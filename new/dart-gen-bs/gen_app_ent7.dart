// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent7_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_number_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/advance-status.dart';
import '../dart-maor/norm-email.dart';
import 'package:flutter/material.dart';

class GenAppEnt7Screen extends StatefulWidget {
  const GenAppEnt7Screen({super.key});

  @override
  State<GenAppEnt7Screen> createState() => _GenAppEnt7ScreenState();
}

class _GenAppEnt7ScreenState extends State<GenAppEnt7Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת

  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent7_c8: _v[0] ?? '', gen_app_ent7_c9: _v[1] ?? '', gen_app_ent7_c10: _v[2] ?? '', gen_app_ent7_c11: _v[3] ?? '', gen_app_ent7_c12: _v[4] ?? '', gen_app_ent7_c13: _v[5] ?? '', gen_app_ent7_c15: _v[6] ?? '', gen_app_ent7_c16: _v[7] ?? '', gen_app_ent7_c17: _v[8] ?? '', gen_app_ent7_c18: _v[9] ?? '', gen_app_ent7_c19: _v[10] ?? '', gen_app_ent7_c20: _v[11] ?? '', gen_app_ent7_c21: _v[12] ?? '', gen_app_ent7_c22: _v[13] ?? '', gen_app_ent7_c23: _v[14] ?? '', gen_app_ent7_c24: _v[15] ?? '', gen_app_ent7_c25: _v[16] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent7', _editId!, map);
    } else {
      appStore.add('app_ent7', <String, String>{...map, '__stage': '0'});
    }
    setState(() { _v.clear(); _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent7_c8] ?? '', 1: r[gen_app_ent7_c9] ?? '', 2: r[gen_app_ent7_c10] ?? '', 3: r[gen_app_ent7_c11] ?? '', 4: r[gen_app_ent7_c12] ?? '', 5: r[gen_app_ent7_c13] ?? '', 6: r[gen_app_ent7_c15] ?? '', 7: r[gen_app_ent7_c16] ?? '', 8: r[gen_app_ent7_c17] ?? '', 9: r[gen_app_ent7_c18] ?? '', 10: r[gen_app_ent7_c19] ?? '', 11: r[gen_app_ent7_c20] ?? '', 12: r[gen_app_ent7_c21] ?? '', 13: r[gen_app_ent7_c22] ?? '', 14: r[gen_app_ent7_c23] ?? '', 15: r[gen_app_ent7_c24] ?? '', 16: r[gen_app_ent7_c25] ?? ''};
    });
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_ent7_c8, gen_app_ent7_c9, gen_app_ent7_c10, gen_app_ent7_c11, gen_app_ent7_c12, gen_app_ent7_c13, gen_app_ent7_c15, gen_app_ent7_c16, gen_app_ent7_c17, gen_app_ent7_c18, gen_app_ent7_c19, gen_app_ent7_c20, gen_app_ent7_c21, gen_app_ent7_c22, gen_app_ent7_c23, gen_app_ent7_c24, gen_app_ent7_c25], values: [r[gen_app_ent7_c8] ?? '', r[gen_app_ent7_c9] ?? '', r[gen_app_ent7_c10] ?? '', appStore.displayOf('app_ent11', r[gen_app_ent7_c11] ?? ''), r[gen_app_ent7_c12] ?? '', r[gen_app_ent7_c13] ?? '', r[gen_app_ent7_c15] ?? '', r[gen_app_ent7_c16] ?? '', appStore.displayOf('app_ent2', r[gen_app_ent7_c17] ?? ''), appStore.displayOf('app_ent4', r[gen_app_ent7_c18] ?? ''), appStore.displayOf('app_ent14', r[gen_app_ent7_c19] ?? ''), appStore.displayOf('app_ent15', r[gen_app_ent7_c20] ?? ''), r[gen_app_ent7_c21] ?? '', r[gen_app_ent7_c22] ?? '', r[gen_app_ent7_c23] ?? '', r[gen_app_ent7_c24] ?? '', r[gen_app_ent7_c25] ?? ''], stage: (const [gen_app_ent7_c27, gen_app_ent7_c28, gen_app_ent7_c29, gen_app_ent7_c30, gen_app_ent7_c31, gen_app_ent7_c32, gen_app_ent7_c33, gen_app_ent7_c34, gen_app_ent7_c35, gen_app_ent7_c36, gen_app_ent7_c37, gen_app_ent7_c38])[appStore.stageOf('app_ent7', rid)], stageDone: appStore.stageOf('app_ent7', rid) >= 11, onAdvance: () => appStore.advance('app_ent7', rid, 12), onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent7', rid));
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
      title: gen_app_ent7_c0,
      subtitle: gen_app_ent7_c1,
      icon: gen_app_ent7_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent7_c3 : gen_app_ent7_c4, onTap: _save),
      children: [
        DsWorkflow(steps: const [gen_app_ent7_c27, gen_app_ent7_c28, gen_app_ent7_c29, gen_app_ent7_c30, gen_app_ent7_c31, gen_app_ent7_c32, gen_app_ent7_c33, gen_app_ent7_c34, gen_app_ent7_c35, gen_app_ent7_c36, gen_app_ent7_c37, gen_app_ent7_c38], current: 0),
        DsSection(title: gen_app_ent7_c5, children: [
          DsNumberField(label: gen_app_ent7_c8, value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_ent7_c9, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsField(label: gen_app_ent7_c10, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsSelect(label: gen_app_ent7_c11, entity: 'app_ent11', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent7_c12, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent7_c13, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          if ((_v[5] ?? '').trim().isNotEmpty) _live(gen_app_ent7_c14, normEmail((_v[5] ?? ''))),
          DsField(label: gen_app_ent7_c15, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsField(label: gen_app_ent7_c16, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsSelect(label: gen_app_ent7_c17, entity: 'app_ent2', value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
          DsSelect(label: gen_app_ent7_c18, entity: 'app_ent4', value: _v[9] ?? '', onChanged: (v) => setState(() => _v[9] = v)),
          DsSelect(label: gen_app_ent7_c19, entity: 'app_ent14', value: _v[10] ?? '', onChanged: (v) => setState(() => _v[10] = v)),
          DsSelect(label: gen_app_ent7_c20, entity: 'app_ent15', value: _v[11] ?? '', onChanged: (v) => setState(() => _v[11] = v)),
          DsNumberField(label: gen_app_ent7_c21, value: _v[12] ?? '', onChanged: (v) => setState(() => _v[12] = v)),
          DsField(label: gen_app_ent7_c22, hint: '', value: _v[13] ?? '', onChanged: (v) => setState(() => _v[13] = v)),
          DsField(label: gen_app_ent7_c23, hint: '', value: _v[14] ?? '', onChanged: (v) => setState(() => _v[14] = v)),
          DsField(label: gen_app_ent7_c24, hint: '', value: _v[15] ?? '', onChanged: (v) => setState(() => _v[15] = v)),
          DsField(label: gen_app_ent7_c25, hint: '', value: _v[16] ?? '', onChanged: (v) => setState(() => _v[16] = v)),
          if ((_v[16] ?? '').trim().isNotEmpty) _live(gen_app_ent7_c26, advanceStatus((_v[16] ?? ''))),
        ]),
        DsSection(title: gen_app_ent7_c6, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final rs = appStore.records('app_ent7');
              if (rs.isEmpty) return const DsEmpty(label: gen_app_ent7_c7);
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
