// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent12_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/advance-status.dart';
import '../dart-maor/norm-email.dart';
import 'package:flutter/material.dart';

class GenAppEnt12Screen extends StatefulWidget {
  const GenAppEnt12Screen({super.key});

  @override
  State<GenAppEnt12Screen> createState() => _GenAppEnt12ScreenState();
}

class _GenAppEnt12ScreenState extends State<GenAppEnt12Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת

  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent12_c8: _v[0] ?? '', gen_app_ent12_c9: _v[1] ?? '', gen_app_ent12_c10: _v[2] ?? '', gen_app_ent12_c11: _v[3] ?? '', gen_app_ent12_c13: _v[4] ?? '', gen_app_ent12_c14: _v[5] ?? '', gen_app_ent12_c15: _v[6] ?? '', gen_app_ent12_c16: _v[7] ?? '', gen_app_ent12_c17: _v[8] ?? '', gen_app_ent12_c18: _v[9] ?? '', gen_app_ent12_c19: _v[10] ?? '', gen_app_ent12_c20: _v[11] ?? '', gen_app_ent12_c21: _v[12] ?? '', gen_app_ent12_c22: _v[13] ?? '', gen_app_ent12_c23: _v[14] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent12', _editId!, map);
    } else {
      appStore.add('app_ent12', <String, String>{...map});
    }
    setState(() { _v.clear(); _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent12_c8] ?? '', 1: r[gen_app_ent12_c9] ?? '', 2: r[gen_app_ent12_c10] ?? '', 3: r[gen_app_ent12_c11] ?? '', 4: r[gen_app_ent12_c13] ?? '', 5: r[gen_app_ent12_c14] ?? '', 6: r[gen_app_ent12_c15] ?? '', 7: r[gen_app_ent12_c16] ?? '', 8: r[gen_app_ent12_c17] ?? '', 9: r[gen_app_ent12_c18] ?? '', 10: r[gen_app_ent12_c19] ?? '', 11: r[gen_app_ent12_c20] ?? '', 12: r[gen_app_ent12_c21] ?? '', 13: r[gen_app_ent12_c22] ?? '', 14: r[gen_app_ent12_c23] ?? ''};
    });
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_ent12_c8, gen_app_ent12_c9, gen_app_ent12_c10, gen_app_ent12_c11, gen_app_ent12_c13, gen_app_ent12_c14, gen_app_ent12_c15, gen_app_ent12_c16, gen_app_ent12_c17, gen_app_ent12_c18, gen_app_ent12_c19, gen_app_ent12_c20, gen_app_ent12_c21, gen_app_ent12_c22, gen_app_ent12_c23], values: [r[gen_app_ent12_c8] ?? '', r[gen_app_ent12_c9] ?? '', r[gen_app_ent12_c10] ?? '', r[gen_app_ent12_c11] ?? '', r[gen_app_ent12_c13] ?? '', r[gen_app_ent12_c14] ?? '', r[gen_app_ent12_c15] ?? '', r[gen_app_ent12_c16] ?? '', appStore.displayOf('app_ent55', r[gen_app_ent12_c17] ?? ''), r[gen_app_ent12_c18] ?? '', r[gen_app_ent12_c19] ?? '', appStore.displayOf('app_ent34', r[gen_app_ent12_c20] ?? ''), r[gen_app_ent12_c21] ?? '', r[gen_app_ent12_c22] ?? '', r[gen_app_ent12_c23] ?? ''], onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent12', rid));
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
      title: gen_app_ent12_c0,
      subtitle: gen_app_ent12_c1,
      icon: gen_app_ent12_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent12_c3 : gen_app_ent12_c4, onTap: _save),
      children: [
        DsSection(title: gen_app_ent12_c5, children: [
          DsField(label: gen_app_ent12_c8, hint: '', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_ent12_c9, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsField(label: gen_app_ent12_c10, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent12_c11, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          if ((_v[3] ?? '').trim().isNotEmpty) _live(gen_app_ent12_c12, normEmail((_v[3] ?? ''))),
          DsField(label: gen_app_ent12_c13, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent12_c14, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsField(label: gen_app_ent12_c15, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsField(label: gen_app_ent12_c16, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsSelect(label: gen_app_ent12_c17, entity: 'app_ent55', value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
          DsField(label: gen_app_ent12_c18, hint: '', value: _v[9] ?? '', onChanged: (v) => setState(() => _v[9] = v)),
          DsField(label: gen_app_ent12_c19, hint: '', value: _v[10] ?? '', onChanged: (v) => setState(() => _v[10] = v)),
          DsSelect(label: gen_app_ent12_c20, entity: 'app_ent34', value: _v[11] ?? '', onChanged: (v) => setState(() => _v[11] = v)),
          DsField(label: gen_app_ent12_c21, hint: '', value: _v[12] ?? '', onChanged: (v) => setState(() => _v[12] = v)),
          DsField(label: gen_app_ent12_c22, hint: '', value: _v[13] ?? '', onChanged: (v) => setState(() => _v[13] = v)),
          DsField(label: gen_app_ent12_c23, hint: '', value: _v[14] ?? '', onChanged: (v) => setState(() => _v[14] = v)),
          if ((_v[14] ?? '').trim().isNotEmpty) _live(gen_app_ent12_c24, advanceStatus((_v[14] ?? ''))),
        ]),
        DsSection(title: gen_app_ent12_c6, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final rs = appStore.records('app_ent12');
              if (rs.isEmpty) return const DsEmpty(label: gen_app_ent12_c7);
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
