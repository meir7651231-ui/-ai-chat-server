// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent21_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_date_field.dart';
import '../dart-ui-bs/ds/ds_toggle_tile.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/advance-status.dart';
import '../dart-maor/norm-email.dart';
import 'package:flutter/material.dart';

class GenAppEnt21Screen extends StatefulWidget {
  const GenAppEnt21Screen({super.key});

  @override
  State<GenAppEnt21Screen> createState() => _GenAppEnt21ScreenState();
}

class _GenAppEnt21ScreenState extends State<GenAppEnt21Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת

  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent21_c8: _v[0] ?? '', gen_app_ent21_c9: _v[1] ?? '', gen_app_ent21_c10: _v[2] ?? '', gen_app_ent21_c11: _v[3] ?? '', gen_app_ent21_c12: _v[4] ?? '', gen_app_ent21_c14: _v[5] ?? '', gen_app_ent21_c15: _v[6] ?? '', gen_app_ent21_c16: _v[7] ?? '', gen_app_ent21_c17: _v[8] ?? '', gen_app_ent21_c18: _v[9] ?? '', gen_app_ent21_c19: _v[10] ?? '', gen_app_ent21_c20: _v[11] ?? '', gen_app_ent21_c21: _v[12] ?? '', gen_app_ent21_c22: _v[13] ?? '', gen_app_ent21_c23: _v[14] ?? '', gen_app_ent21_c24: _v[15] ?? '', gen_app_ent21_c25: _v[16] ?? '', gen_app_ent21_c26: _v[17] ?? '', gen_app_ent21_c27: _v[18] ?? '', gen_app_ent21_c28: _v[19] ?? '', gen_app_ent21_c29: _v[20] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent21', _editId!, map);
    } else {
      appStore.add('app_ent21', <String, String>{...map});
    }
    setState(() { _v.clear(); _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent21_c8] ?? '', 1: r[gen_app_ent21_c9] ?? '', 2: r[gen_app_ent21_c10] ?? '', 3: r[gen_app_ent21_c11] ?? '', 4: r[gen_app_ent21_c12] ?? '', 5: r[gen_app_ent21_c14] ?? '', 6: r[gen_app_ent21_c15] ?? '', 7: r[gen_app_ent21_c16] ?? '', 8: r[gen_app_ent21_c17] ?? '', 9: r[gen_app_ent21_c18] ?? '', 10: r[gen_app_ent21_c19] ?? '', 11: r[gen_app_ent21_c20] ?? '', 12: r[gen_app_ent21_c21] ?? '', 13: r[gen_app_ent21_c22] ?? '', 14: r[gen_app_ent21_c23] ?? '', 15: r[gen_app_ent21_c24] ?? '', 16: r[gen_app_ent21_c25] ?? '', 17: r[gen_app_ent21_c26] ?? '', 18: r[gen_app_ent21_c27] ?? '', 19: r[gen_app_ent21_c28] ?? '', 20: r[gen_app_ent21_c29] ?? ''};
    });
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_ent21_c8, gen_app_ent21_c9, gen_app_ent21_c10, gen_app_ent21_c11, gen_app_ent21_c12, gen_app_ent21_c14, gen_app_ent21_c15, gen_app_ent21_c16, gen_app_ent21_c17, gen_app_ent21_c18, gen_app_ent21_c19, gen_app_ent21_c20, gen_app_ent21_c21, gen_app_ent21_c22, gen_app_ent21_c23, gen_app_ent21_c24, gen_app_ent21_c25, gen_app_ent21_c26, gen_app_ent21_c27, gen_app_ent21_c28, gen_app_ent21_c29], values: [r[gen_app_ent21_c8] ?? '', r[gen_app_ent21_c9] ?? '', r[gen_app_ent21_c10] ?? '', r[gen_app_ent21_c11] ?? '', r[gen_app_ent21_c12] ?? '', r[gen_app_ent21_c14] ?? '', r[gen_app_ent21_c15] ?? '', r[gen_app_ent21_c16] ?? '', r[gen_app_ent21_c17] ?? '', r[gen_app_ent21_c18] ?? '', r[gen_app_ent21_c19] ?? '', r[gen_app_ent21_c20] ?? '', r[gen_app_ent21_c21] ?? '', r[gen_app_ent21_c22] ?? '', r[gen_app_ent21_c23] ?? '', r[gen_app_ent21_c24] ?? '', r[gen_app_ent21_c25] ?? '', r[gen_app_ent21_c26] ?? '', r[gen_app_ent21_c27] ?? '', r[gen_app_ent21_c28] ?? '', r[gen_app_ent21_c29] ?? ''], onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent21', rid));
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
      title: gen_app_ent21_c0,
      subtitle: gen_app_ent21_c1,
      icon: gen_app_ent21_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent21_c3 : gen_app_ent21_c4, onTap: _save),
      children: [
        DsSection(title: gen_app_ent21_c5, children: [
          DsField(label: gen_app_ent21_c8, hint: '', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_ent21_c9, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsField(label: gen_app_ent21_c10, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent21_c11, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent21_c12, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          if ((_v[4] ?? '').trim().isNotEmpty) _live(gen_app_ent21_c13, normEmail((_v[4] ?? ''))),
          DsField(label: gen_app_ent21_c14, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsDateField(label: gen_app_ent21_c15, value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsDateField(label: gen_app_ent21_c16, value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsField(label: gen_app_ent21_c17, hint: '', value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
          DsField(label: gen_app_ent21_c18, hint: '', value: _v[9] ?? '', onChanged: (v) => setState(() => _v[9] = v)),
          DsField(label: gen_app_ent21_c19, hint: '', value: _v[10] ?? '', onChanged: (v) => setState(() => _v[10] = v)),
          DsField(label: gen_app_ent21_c20, hint: '', value: _v[11] ?? '', onChanged: (v) => setState(() => _v[11] = v)),
          DsField(label: gen_app_ent21_c21, hint: '', value: _v[12] ?? '', onChanged: (v) => setState(() => _v[12] = v)),
          DsField(label: gen_app_ent21_c22, hint: '', value: _v[13] ?? '', onChanged: (v) => setState(() => _v[13] = v)),
          DsField(label: gen_app_ent21_c23, hint: '', value: _v[14] ?? '', onChanged: (v) => setState(() => _v[14] = v)),
          DsField(label: gen_app_ent21_c24, hint: '', value: _v[15] ?? '', onChanged: (v) => setState(() => _v[15] = v)),
          DsField(label: gen_app_ent21_c25, hint: '', value: _v[16] ?? '', onChanged: (v) => setState(() => _v[16] = v)),
          DsToggleTile(label: gen_app_ent21_c26, value: _v[17] ?? '', onChanged: (v) => setState(() => _v[17] = v)),
          DsField(label: gen_app_ent21_c27, hint: '', value: _v[18] ?? '', onChanged: (v) => setState(() => _v[18] = v)),
          DsField(label: gen_app_ent21_c28, hint: '', value: _v[19] ?? '', onChanged: (v) => setState(() => _v[19] = v)),
          DsField(label: gen_app_ent21_c29, hint: '', value: _v[20] ?? '', onChanged: (v) => setState(() => _v[20] = v)),
          if ((_v[20] ?? '').trim().isNotEmpty) _live(gen_app_ent21_c30, advanceStatus((_v[20] ?? ''))),
        ]),
        DsSection(title: gen_app_ent21_c6, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final rs = appStore.records('app_ent21');
              if (rs.isEmpty) return const DsEmpty(label: gen_app_ent21_c7);
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
