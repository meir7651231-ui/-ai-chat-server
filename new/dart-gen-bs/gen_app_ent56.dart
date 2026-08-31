// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent56_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/fmt-date.dart';
import 'package:flutter/material.dart';

class GenAppEnt56Screen extends StatefulWidget {
  const GenAppEnt56Screen({super.key});

  @override
  State<GenAppEnt56Screen> createState() => _GenAppEnt56ScreenState();
}

class _GenAppEnt56ScreenState extends State<GenAppEnt56Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת

  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent56_c8: _v[0] ?? '', gen_app_ent56_c9: _v[1] ?? '', gen_app_ent56_c10: _v[2] ?? '', gen_app_ent56_c12: _v[3] ?? '', gen_app_ent56_c13: _v[4] ?? '', gen_app_ent56_c14: _v[5] ?? '', gen_app_ent56_c15: _v[6] ?? '', gen_app_ent56_c16: _v[7] ?? '', gen_app_ent56_c17: _v[8] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent56', _editId!, map);
    } else {
      appStore.add('app_ent56', <String, String>{...map, '__stage': '0'});
    }
    setState(() { _v.clear(); _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent56_c8] ?? '', 1: r[gen_app_ent56_c9] ?? '', 2: r[gen_app_ent56_c10] ?? '', 3: r[gen_app_ent56_c12] ?? '', 4: r[gen_app_ent56_c13] ?? '', 5: r[gen_app_ent56_c14] ?? '', 6: r[gen_app_ent56_c15] ?? '', 7: r[gen_app_ent56_c16] ?? '', 8: r[gen_app_ent56_c17] ?? ''};
    });
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_ent56_c8, gen_app_ent56_c9, gen_app_ent56_c10, gen_app_ent56_c12, gen_app_ent56_c13, gen_app_ent56_c14, gen_app_ent56_c15, gen_app_ent56_c16, gen_app_ent56_c17], values: [appStore.displayOf('app_ent11', r[gen_app_ent56_c8] ?? ''), r[gen_app_ent56_c9] ?? '', r[gen_app_ent56_c10] ?? '', r[gen_app_ent56_c12] ?? '', r[gen_app_ent56_c13] ?? '', r[gen_app_ent56_c14] ?? '', r[gen_app_ent56_c15] ?? '', r[gen_app_ent56_c16] ?? '', r[gen_app_ent56_c17] ?? ''], stage: (const [gen_app_ent56_c18, gen_app_ent56_c19, gen_app_ent56_c20])[appStore.stageOf('app_ent56', rid)], stageDone: appStore.stageOf('app_ent56', rid) >= 2, onAdvance: () => appStore.advance('app_ent56', rid, 3), onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent56', rid));
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
      title: gen_app_ent56_c0,
      subtitle: gen_app_ent56_c1,
      icon: gen_app_ent56_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent56_c3 : gen_app_ent56_c4, onTap: _save),
      children: [
        DsWorkflow(steps: const [gen_app_ent56_c18, gen_app_ent56_c19, gen_app_ent56_c20], current: 0),
        DsSection(title: gen_app_ent56_c5, children: [
          DsSelect(label: gen_app_ent56_c8, entity: 'app_ent11', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_ent56_c9, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsField(label: gen_app_ent56_c10, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          if ((_v[2] ?? '').trim().isNotEmpty) _live(gen_app_ent56_c11, fmtDate((_v[2] ?? ''))),
          DsField(label: gen_app_ent56_c12, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent56_c13, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent56_c14, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsField(label: gen_app_ent56_c15, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsField(label: gen_app_ent56_c16, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsField(label: gen_app_ent56_c17, hint: '', value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
        ]),
        DsSection(title: gen_app_ent56_c6, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final rs = appStore.records('app_ent56');
              if (rs.isEmpty) return const DsEmpty(label: gen_app_ent56_c7);
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
