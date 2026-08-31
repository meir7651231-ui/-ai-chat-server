// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent58_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_date_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/advance-status.dart';
import 'package:flutter/material.dart';

class GenAppEnt58Screen extends StatefulWidget {
  const GenAppEnt58Screen({super.key});

  @override
  State<GenAppEnt58Screen> createState() => _GenAppEnt58ScreenState();
}

class _GenAppEnt58ScreenState extends State<GenAppEnt58Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת

  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent58_c8: _v[0] ?? '', gen_app_ent58_c9: _v[1] ?? '', gen_app_ent58_c10: _v[2] ?? '', gen_app_ent58_c11: _v[3] ?? '', gen_app_ent58_c12: _v[4] ?? '', gen_app_ent58_c13: _v[5] ?? '', gen_app_ent58_c14: _v[6] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent58', _editId!, map);
    } else {
      appStore.add('app_ent58', <String, String>{...map, '__stage': '0'});
    }
    setState(() { _v.clear(); _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent58_c8] ?? '', 1: r[gen_app_ent58_c9] ?? '', 2: r[gen_app_ent58_c10] ?? '', 3: r[gen_app_ent58_c11] ?? '', 4: r[gen_app_ent58_c12] ?? '', 5: r[gen_app_ent58_c13] ?? '', 6: r[gen_app_ent58_c14] ?? ''};
    });
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_ent58_c8, gen_app_ent58_c9, gen_app_ent58_c10, gen_app_ent58_c11, gen_app_ent58_c12, gen_app_ent58_c13, gen_app_ent58_c14], values: [appStore.displayOf('app_ent11', r[gen_app_ent58_c8] ?? ''), r[gen_app_ent58_c9] ?? '', r[gen_app_ent58_c10] ?? '', r[gen_app_ent58_c11] ?? '', appStore.displayOf('app_ent46', r[gen_app_ent58_c12] ?? ''), r[gen_app_ent58_c13] ?? '', r[gen_app_ent58_c14] ?? ''], stage: (const [gen_app_ent58_c16, gen_app_ent58_c17])[appStore.stageOf('app_ent58', rid)], stageDone: appStore.stageOf('app_ent58', rid) >= 1, onAdvance: () => appStore.advance('app_ent58', rid, 2), onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent58', rid));
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
      title: gen_app_ent58_c0,
      subtitle: gen_app_ent58_c1,
      icon: gen_app_ent58_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent58_c3 : gen_app_ent58_c4, onTap: _save),
      children: [
        DsWorkflow(steps: const [gen_app_ent58_c16, gen_app_ent58_c17], current: 0),
        DsSection(title: gen_app_ent58_c5, children: [
          DsSelect(label: gen_app_ent58_c8, entity: 'app_ent11', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_ent58_c9, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsField(label: gen_app_ent58_c10, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent58_c11, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsSelect(label: gen_app_ent58_c12, entity: 'app_ent46', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsDateField(label: gen_app_ent58_c13, value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsField(label: gen_app_ent58_c14, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          if ((_v[6] ?? '').trim().isNotEmpty) _live(gen_app_ent58_c15, advanceStatus((_v[6] ?? ''))),
        ]),
        DsSection(title: gen_app_ent58_c6, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final rs = appStore.records('app_ent58');
              if (rs.isEmpty) return const DsEmpty(label: gen_app_ent58_c7);
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
