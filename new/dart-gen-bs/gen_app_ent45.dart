// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent45_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_date_field.dart';
import '../dart-ui-bs/ds/ds_number_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/advance-status.dart';
import 'package:flutter/material.dart';

class GenAppEnt45Screen extends StatefulWidget {
  const GenAppEnt45Screen({super.key});

  @override
  State<GenAppEnt45Screen> createState() => _GenAppEnt45ScreenState();
}

class _GenAppEnt45ScreenState extends State<GenAppEnt45Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת


  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent45_c8: _v[0] ?? '', gen_app_ent45_c9: _v[1] ?? '', gen_app_ent45_c10: _v[2] ?? '', gen_app_ent45_c11: _v[3] ?? '', gen_app_ent45_c12: _v[4] ?? '', gen_app_ent45_c13: _v[5] ?? '', gen_app_ent45_c14: _v[6] ?? '', gen_app_ent45_c15: _v[7] ?? '', gen_app_ent45_c16: _v[8] ?? '', gen_app_ent45_c17: _v[9] ?? '', gen_app_ent45_c18: _v[10] ?? '', gen_app_ent45_c19: _v[11] ?? '', gen_app_ent45_c20: _v[12] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent45', _editId!, map);
    } else {
      appStore.add('app_ent45', <String, String>{...map, '__stage': '0'});
    }
    setState(() { _v.clear(); _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent45_c8] ?? '', 1: r[gen_app_ent45_c9] ?? '', 2: r[gen_app_ent45_c10] ?? '', 3: r[gen_app_ent45_c11] ?? '', 4: r[gen_app_ent45_c12] ?? '', 5: r[gen_app_ent45_c13] ?? '', 6: r[gen_app_ent45_c14] ?? '', 7: r[gen_app_ent45_c15] ?? '', 8: r[gen_app_ent45_c16] ?? '', 9: r[gen_app_ent45_c17] ?? '', 10: r[gen_app_ent45_c18] ?? '', 11: r[gen_app_ent45_c19] ?? '', 12: r[gen_app_ent45_c20] ?? ''};
    });
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_ent45_c8, gen_app_ent45_c9, gen_app_ent45_c10, gen_app_ent45_c11, gen_app_ent45_c12, gen_app_ent45_c13, gen_app_ent45_c14, gen_app_ent45_c15, gen_app_ent45_c16, gen_app_ent45_c17, gen_app_ent45_c18, gen_app_ent45_c19, gen_app_ent45_c20], values: [r[gen_app_ent45_c8] ?? '', appStore.displayOf('app_ent13', r[gen_app_ent45_c9] ?? ''), appStore.displayOf('app_ent11', r[gen_app_ent45_c10] ?? ''), appStore.displayOf('app_ent44', r[gen_app_ent45_c11] ?? ''), r[gen_app_ent45_c12] ?? '', r[gen_app_ent45_c13] ?? '', appStore.displayOf('app_ent47', r[gen_app_ent45_c14] ?? ''), r[gen_app_ent45_c15] ?? '', r[gen_app_ent45_c16] ?? '', r[gen_app_ent45_c17] ?? '', r[gen_app_ent45_c18] ?? '', appStore.displayOf('app_ent70', r[gen_app_ent45_c19] ?? ''), r[gen_app_ent45_c20] ?? ''], stage: (const [gen_app_ent45_c22, gen_app_ent45_c23, gen_app_ent45_c24, gen_app_ent45_c25])[appStore.stageOf('app_ent45', rid)], stageDone: appStore.stageOf('app_ent45', rid) >= 3, onAdvance: () => appStore.advance('app_ent45', rid, 4), onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent45', rid));
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
      title: gen_app_ent45_c0,
      subtitle: gen_app_ent45_c1,
      icon: gen_app_ent45_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent45_c3 : gen_app_ent45_c4, onTap: _save),
      children: [
        DsWorkflow(steps: const [gen_app_ent45_c22, gen_app_ent45_c23, gen_app_ent45_c24, gen_app_ent45_c25], current: 0),
        DsSection(title: gen_app_ent45_c5, children: [
          DsNumberField(label: gen_app_ent45_c8, value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsSelect(label: gen_app_ent45_c9, entity: 'app_ent13', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsSelect(label: gen_app_ent45_c10, entity: 'app_ent11', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsSelect(label: gen_app_ent45_c11, entity: 'app_ent44', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsNumberField(label: gen_app_ent45_c12, value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent45_c13, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsSelect(label: gen_app_ent45_c14, entity: 'app_ent47', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsField(label: gen_app_ent45_c15, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsDateField(label: gen_app_ent45_c16, value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
          DsDateField(label: gen_app_ent45_c17, value: _v[9] ?? '', onChanged: (v) => setState(() => _v[9] = v)),
          DsField(label: gen_app_ent45_c18, hint: '', value: _v[10] ?? '', onChanged: (v) => setState(() => _v[10] = v)),
          DsSelect(label: gen_app_ent45_c19, entity: 'app_ent70', value: _v[11] ?? '', onChanged: (v) => setState(() => _v[11] = v)),
          DsField(label: gen_app_ent45_c20, hint: '', value: _v[12] ?? '', onChanged: (v) => setState(() => _v[12] = v)),
          if ((_v[12] ?? '').trim().isNotEmpty) _live(gen_app_ent45_c21, advanceStatus((_v[12] ?? ''))),
        ]),
        DsSection(title: gen_app_ent45_c6, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final rs = appStore.records('app_ent45');
              if (rs.isEmpty) return const DsEmpty(label: gen_app_ent45_c7);
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
