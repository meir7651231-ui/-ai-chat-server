// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent13_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_search.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_multi_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/advance-status.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class GenAppEnt13Screen extends StatefulWidget {
  const GenAppEnt13Screen({super.key});

  @override
  State<GenAppEnt13Screen> createState() => _GenAppEnt13ScreenState();
}

class _GenAppEnt13ScreenState extends State<GenAppEnt13Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת
  String _q = '';    // מחרוזת-חיפוש (סינון-רשומות חי)


  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent13_c9: _v[0] ?? '', gen_app_ent13_c10: _v[1] ?? '', gen_app_ent13_c11: _v[2] ?? '', gen_app_ent13_c12: _v[3] ?? '', gen_app_ent13_c13: _v[4] ?? '', gen_app_ent13_c14: _v[5] ?? '', gen_app_ent13_c15: _v[6] ?? '', gen_app_ent13_c16: _v[7] ?? '', gen_app_ent13_c17: _v[8] ?? '', gen_app_ent13_c18: _v[9] ?? '', gen_app_ent13_c19: _v[10] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent13', _editId!, map);
    } else {
      appStore.add('app_ent13', <String, String>{...map});
    }
    setState(() { _v.clear(); _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent13_c9] ?? '', 1: r[gen_app_ent13_c10] ?? '', 2: r[gen_app_ent13_c11] ?? '', 3: r[gen_app_ent13_c12] ?? '', 4: r[gen_app_ent13_c13] ?? '', 5: r[gen_app_ent13_c14] ?? '', 6: r[gen_app_ent13_c15] ?? '', 7: r[gen_app_ent13_c16] ?? '', 8: r[gen_app_ent13_c17] ?? '', 9: r[gen_app_ent13_c18] ?? '', 10: r[gen_app_ent13_c19] ?? ''};
    });
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_ent13_c9, gen_app_ent13_c10, gen_app_ent13_c11, gen_app_ent13_c12, gen_app_ent13_c13, gen_app_ent13_c14, gen_app_ent13_c15, gen_app_ent13_c16, gen_app_ent13_c17, gen_app_ent13_c18, gen_app_ent13_c19], values: [r[gen_app_ent13_c9] ?? '', appStore.displayList('app_ent11', r[gen_app_ent13_c10] ?? ''), appStore.displayList('app_ent12', r[gen_app_ent13_c11] ?? ''), r[gen_app_ent13_c12] ?? '', appStore.displayList('app_ent44', r[gen_app_ent13_c13] ?? ''), r[gen_app_ent13_c14] ?? '', appStore.displayList('app_ent47', r[gen_app_ent13_c15] ?? ''), appStore.displayList('app_ent46', r[gen_app_ent13_c16] ?? ''), appStore.displayList('app_ent70', r[gen_app_ent13_c17] ?? ''), r[gen_app_ent13_c18] ?? '', r[gen_app_ent13_c19] ?? ''], onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent13', rid), footer: Wrap(spacing: 6, runSpacing: 6, children: [_backChip(gen_app_ent13_c21, appStore.referencing('app_ent11', gen_app_ent13_c22, rid).length), _backChip(gen_app_ent13_c23, appStore.referencing('app_ent45', gen_app_ent13_c24, rid).length), _backChip(gen_app_ent13_c25, appStore.referencing('app_ent46', gen_app_ent13_c26, rid).length), _backChip(gen_app_ent13_c27, appStore.referencing('app_ent47', gen_app_ent13_c28, rid).length), _backChip(gen_app_ent13_c29, appStore.referencing('app_ent70', gen_app_ent13_c30, rid).length)]));
  }

  Widget _backChip(String label, int n) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
        decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(20)),
        child: Text('$label · $n', style: const TextStyle(color: DsTokens.muted, fontSize: 11.5, fontWeight: FontWeight.w700)),
      );


  String _csv() {
    final b = StringBuffer();
    b.writeln(const [gen_app_ent13_c9, gen_app_ent13_c10, gen_app_ent13_c11, gen_app_ent13_c12, gen_app_ent13_c13, gen_app_ent13_c14, gen_app_ent13_c15, gen_app_ent13_c16, gen_app_ent13_c17, gen_app_ent13_c18, gen_app_ent13_c19].map((h) => '"' + h.replaceAll('"', '""') + '"').join(','));
    for (final r in appStore.records('app_ent13')) {
      b.writeln([r[gen_app_ent13_c9] ?? '', appStore.displayList('app_ent11', r[gen_app_ent13_c10] ?? ''), appStore.displayList('app_ent12', r[gen_app_ent13_c11] ?? ''), r[gen_app_ent13_c12] ?? '', appStore.displayList('app_ent44', r[gen_app_ent13_c13] ?? ''), r[gen_app_ent13_c14] ?? '', appStore.displayList('app_ent47', r[gen_app_ent13_c15] ?? ''), appStore.displayList('app_ent46', r[gen_app_ent13_c16] ?? ''), appStore.displayList('app_ent70', r[gen_app_ent13_c17] ?? ''), r[gen_app_ent13_c18] ?? '', r[gen_app_ent13_c19] ?? ''].map((v) => '"' + v.replaceAll('"', '""') + '"').join(','));
    }
    return b.toString();
  }

  Widget _csvBtn(BuildContext context) => Material(
        color: const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(9),
        child: InkWell(
          borderRadius: BorderRadius.circular(9),
          onTap: () {
            Clipboard.setData(ClipboardData(text: _csv()));
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('הועתק כ-CSV'), duration: Duration(seconds: 2)));
          },
          child: const Padding(
            padding: EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            child: Row(mainAxisSize: MainAxisSize.min, children: [
              Icon(Icons.copy_all_outlined, size: 15, color: DsTokens.muted),
              SizedBox(width: 5),
              Text('CSV', style: TextStyle(color: DsTokens.muted, fontSize: 12, fontWeight: FontWeight.w700)),
            ]),
          ),
        ),
      );

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
      title: gen_app_ent13_c0,
      subtitle: gen_app_ent13_c1,
      icon: gen_app_ent13_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent13_c3 : gen_app_ent13_c4, onTap: _save),
      children: [
        DsSection(title: gen_app_ent13_c5, children: [
          DsField(label: gen_app_ent13_c9, hint: '', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsMultiSelect(label: gen_app_ent13_c10, entity: 'app_ent11', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsMultiSelect(label: gen_app_ent13_c11, entity: 'app_ent12', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent13_c12, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsMultiSelect(label: gen_app_ent13_c13, entity: 'app_ent44', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent13_c14, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsMultiSelect(label: gen_app_ent13_c15, entity: 'app_ent47', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsMultiSelect(label: gen_app_ent13_c16, entity: 'app_ent46', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsMultiSelect(label: gen_app_ent13_c17, entity: 'app_ent70', value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
          DsField(label: gen_app_ent13_c18, hint: '', value: _v[9] ?? '', onChanged: (v) => setState(() => _v[9] = v)),
          DsField(label: gen_app_ent13_c19, hint: '', value: _v[10] ?? '', onChanged: (v) => setState(() => _v[10] = v)),
          if ((_v[10] ?? '').trim().isNotEmpty) _live(gen_app_ent13_c20, advanceStatus((_v[10] ?? ''))),
        ]),
        DsSection(title: gen_app_ent13_c6, trailing: _csvBtn(context), children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final all = appStore.records('app_ent13');
              if (all.isEmpty) return const DsEmpty(label: gen_app_ent13_c7);
              final q = _q.trim().toLowerCase();
              final rs = q.isEmpty ? all : all.where((r) => r.entries.any((e) => !e.key.startsWith('__') && e.value.toLowerCase().contains(q))).toList();
              return Column(children: [
                DsSearch(value: _q, onChanged: (v) => setState(() => _q = v)),
                if (rs.isEmpty) const DsEmpty(label: gen_app_ent13_c8),
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
