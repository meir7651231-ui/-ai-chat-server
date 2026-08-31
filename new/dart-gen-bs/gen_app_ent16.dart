// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent16_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_search.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/advance-status.dart';
import 'package:flutter/material.dart';

class GenAppEnt16Screen extends StatefulWidget {
  const GenAppEnt16Screen({super.key});

  @override
  State<GenAppEnt16Screen> createState() => _GenAppEnt16ScreenState();
}

class _GenAppEnt16ScreenState extends State<GenAppEnt16Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת
  String _q = '';    // מחרוזת-חיפוש (סינון-רשומות חי)


  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent16_c9: _v[0] ?? '', gen_app_ent16_c10: _v[1] ?? '', gen_app_ent16_c11: _v[2] ?? '', gen_app_ent16_c12: _v[3] ?? '', gen_app_ent16_c13: _v[4] ?? '', gen_app_ent16_c14: _v[5] ?? '', gen_app_ent16_c15: _v[6] ?? '', gen_app_ent16_c16: _v[7] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent16', _editId!, map);
    } else {
      appStore.add('app_ent16', <String, String>{...map});
    }
    setState(() { _v.clear(); _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent16_c9] ?? '', 1: r[gen_app_ent16_c10] ?? '', 2: r[gen_app_ent16_c11] ?? '', 3: r[gen_app_ent16_c12] ?? '', 4: r[gen_app_ent16_c13] ?? '', 5: r[gen_app_ent16_c14] ?? '', 6: r[gen_app_ent16_c15] ?? '', 7: r[gen_app_ent16_c16] ?? ''};
    });
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_ent16_c9, gen_app_ent16_c10, gen_app_ent16_c11, gen_app_ent16_c12, gen_app_ent16_c13, gen_app_ent16_c14, gen_app_ent16_c15, gen_app_ent16_c16], values: [r[gen_app_ent16_c9] ?? '', r[gen_app_ent16_c10] ?? '', appStore.displayOf('app_ent14', r[gen_app_ent16_c11] ?? ''), r[gen_app_ent16_c12] ?? '', r[gen_app_ent16_c13] ?? '', r[gen_app_ent16_c14] ?? '', r[gen_app_ent16_c15] ?? '', r[gen_app_ent16_c16] ?? ''], onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent16', rid));
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
      title: gen_app_ent16_c0,
      subtitle: gen_app_ent16_c1,
      icon: gen_app_ent16_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent16_c3 : gen_app_ent16_c4, onTap: _save),
      children: [
        DsSection(title: gen_app_ent16_c5, children: [
          DsField(label: gen_app_ent16_c9, hint: '', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_ent16_c10, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsSelect(label: gen_app_ent16_c11, entity: 'app_ent14', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent16_c12, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent16_c13, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent16_c14, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsField(label: gen_app_ent16_c15, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsField(label: gen_app_ent16_c16, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          if ((_v[7] ?? '').trim().isNotEmpty) _live(gen_app_ent16_c17, advanceStatus((_v[7] ?? ''))),
        ]),
        DsSection(title: gen_app_ent16_c6, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final all = appStore.records('app_ent16');
              if (all.isEmpty) return const DsEmpty(label: gen_app_ent16_c7);
              final q = _q.trim().toLowerCase();
              final rs = q.isEmpty ? all : all.where((r) => r.entries.any((e) => !e.key.startsWith('__') && e.value.toLowerCase().contains(q))).toList();
              return Column(children: [
                DsSearch(value: _q, onChanged: (v) => setState(() => _q = v)),
                if (rs.isEmpty) const DsEmpty(label: gen_app_ent16_c8),
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
