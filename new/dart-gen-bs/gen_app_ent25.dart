// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent25_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_search.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/advance-status.dart';
import 'package:flutter/material.dart';

class GenAppEnt25Screen extends StatefulWidget {
  const GenAppEnt25Screen({super.key});

  @override
  State<GenAppEnt25Screen> createState() => _GenAppEnt25ScreenState();
}

class _GenAppEnt25ScreenState extends State<GenAppEnt25Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת
  String _q = '';    // מחרוזת-חיפוש (סינון-רשומות חי)


  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent25_c9: _v[0] ?? '', gen_app_ent25_c10: _v[1] ?? '', gen_app_ent25_c11: _v[2] ?? '', gen_app_ent25_c12: _v[3] ?? '', gen_app_ent25_c13: _v[4] ?? '', gen_app_ent25_c14: _v[5] ?? '', gen_app_ent25_c15: _v[6] ?? '', gen_app_ent25_c16: _v[7] ?? '', gen_app_ent25_c17: _v[8] ?? '', gen_app_ent25_c18: _v[9] ?? '', gen_app_ent25_c19: _v[10] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent25', _editId!, map);
    } else {
      appStore.add('app_ent25', <String, String>{...map, '__stage': '0'});
    }
    setState(() { _v.clear(); _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent25_c9] ?? '', 1: r[gen_app_ent25_c10] ?? '', 2: r[gen_app_ent25_c11] ?? '', 3: r[gen_app_ent25_c12] ?? '', 4: r[gen_app_ent25_c13] ?? '', 5: r[gen_app_ent25_c14] ?? '', 6: r[gen_app_ent25_c15] ?? '', 7: r[gen_app_ent25_c16] ?? '', 8: r[gen_app_ent25_c17] ?? '', 9: r[gen_app_ent25_c18] ?? '', 10: r[gen_app_ent25_c19] ?? ''};
    });
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_ent25_c9, gen_app_ent25_c10, gen_app_ent25_c11, gen_app_ent25_c12, gen_app_ent25_c13, gen_app_ent25_c14, gen_app_ent25_c15, gen_app_ent25_c16, gen_app_ent25_c17, gen_app_ent25_c18, gen_app_ent25_c19], values: [appStore.displayOf('app_ent21', r[gen_app_ent25_c9] ?? ''), appStore.displayOf('app_ent5', r[gen_app_ent25_c10] ?? ''), r[gen_app_ent25_c11] ?? '', r[gen_app_ent25_c12] ?? '', r[gen_app_ent25_c13] ?? '', r[gen_app_ent25_c14] ?? '', r[gen_app_ent25_c15] ?? '', r[gen_app_ent25_c16] ?? '', r[gen_app_ent25_c17] ?? '', r[gen_app_ent25_c18] ?? '', r[gen_app_ent25_c19] ?? ''], stage: (const [gen_app_ent25_c21, gen_app_ent25_c22])[appStore.stageOf('app_ent25', rid)], stageDone: appStore.stageOf('app_ent25', rid) >= 1, onAdvance: () => appStore.advance('app_ent25', rid, 2), onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent25', rid));
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
      title: gen_app_ent25_c0,
      subtitle: gen_app_ent25_c1,
      icon: gen_app_ent25_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent25_c3 : gen_app_ent25_c4, onTap: _save),
      children: [
        DsWorkflow(steps: const [gen_app_ent25_c21, gen_app_ent25_c22], current: 0),
        DsSection(title: gen_app_ent25_c5, children: [
          DsSelect(label: gen_app_ent25_c9, entity: 'app_ent21', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsSelect(label: gen_app_ent25_c10, entity: 'app_ent5', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsField(label: gen_app_ent25_c11, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent25_c12, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent25_c13, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent25_c14, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsField(label: gen_app_ent25_c15, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsField(label: gen_app_ent25_c16, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsField(label: gen_app_ent25_c17, hint: '', value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
          DsField(label: gen_app_ent25_c18, hint: '', value: _v[9] ?? '', onChanged: (v) => setState(() => _v[9] = v)),
          DsField(label: gen_app_ent25_c19, hint: '', value: _v[10] ?? '', onChanged: (v) => setState(() => _v[10] = v)),
          if ((_v[10] ?? '').trim().isNotEmpty) _live(gen_app_ent25_c20, advanceStatus((_v[10] ?? ''))),
        ]),
        DsSection(title: gen_app_ent25_c6, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final all = appStore.records('app_ent25');
              if (all.isEmpty) return const DsEmpty(label: gen_app_ent25_c7);
              final q = _q.trim().toLowerCase();
              final rs = q.isEmpty ? all : all.where((r) => r.entries.any((e) => !e.key.startsWith('__') && e.value.toLowerCase().contains(q))).toList();
              return Column(children: [
                DsSearch(value: _q, onChanged: (v) => setState(() => _q = v)),
                if (rs.isEmpty) const DsEmpty(label: gen_app_ent25_c8),
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
