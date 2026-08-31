// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent55_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_search.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_date_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/advance-status.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class GenAppEnt55Screen extends StatefulWidget {
  const GenAppEnt55Screen({super.key});

  @override
  State<GenAppEnt55Screen> createState() => _GenAppEnt55ScreenState();
}

class _GenAppEnt55ScreenState extends State<GenAppEnt55Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת
  String _q = '';    // מחרוזת-חיפוש (סינון-רשומות חי)


  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent55_c9: _v[0] ?? '', gen_app_ent55_c10: _v[1] ?? '', gen_app_ent55_c11: _v[2] ?? '', gen_app_ent55_c12: _v[3] ?? '', gen_app_ent55_c13: _v[4] ?? '', gen_app_ent55_c14: _v[5] ?? '', gen_app_ent55_c15: _v[6] ?? '', gen_app_ent55_c16: _v[7] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent55', _editId!, map);
    } else {
      appStore.add('app_ent55', <String, String>{...map});
    }
    setState(() { _v.clear(); _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent55_c9] ?? '', 1: r[gen_app_ent55_c10] ?? '', 2: r[gen_app_ent55_c11] ?? '', 3: r[gen_app_ent55_c12] ?? '', 4: r[gen_app_ent55_c13] ?? '', 5: r[gen_app_ent55_c14] ?? '', 6: r[gen_app_ent55_c15] ?? '', 7: r[gen_app_ent55_c16] ?? ''};
    });
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_ent55_c9, gen_app_ent55_c10, gen_app_ent55_c11, gen_app_ent55_c12, gen_app_ent55_c13, gen_app_ent55_c14, gen_app_ent55_c15, gen_app_ent55_c16], values: [appStore.displayOf('app_ent11', r[gen_app_ent55_c9] ?? ''), r[gen_app_ent55_c10] ?? '', r[gen_app_ent55_c11] ?? '', r[gen_app_ent55_c12] ?? '', r[gen_app_ent55_c13] ?? '', r[gen_app_ent55_c14] ?? '', appStore.displayOf('app_ent12', r[gen_app_ent55_c15] ?? ''), r[gen_app_ent55_c16] ?? ''], onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent55', rid), footer: Wrap(spacing: 6, runSpacing: 6, children: [_backChip(gen_app_ent55_c18, appStore.referencing('app_ent12', gen_app_ent55_c19, rid).length)]));
  }

  Widget _backChip(String label, int n) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
        decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(20)),
        child: Text('$label · $n', style: const TextStyle(color: DsTokens.muted, fontSize: 11.5, fontWeight: FontWeight.w700)),
      );


  String _csv() {
    final b = StringBuffer();
    b.writeln(const [gen_app_ent55_c9, gen_app_ent55_c10, gen_app_ent55_c11, gen_app_ent55_c12, gen_app_ent55_c13, gen_app_ent55_c14, gen_app_ent55_c15, gen_app_ent55_c16].map((h) => '"' + h.replaceAll('"', '""') + '"').join(','));
    for (final r in appStore.records('app_ent55')) {
      b.writeln([appStore.displayOf('app_ent11', r[gen_app_ent55_c9] ?? ''), r[gen_app_ent55_c10] ?? '', r[gen_app_ent55_c11] ?? '', r[gen_app_ent55_c12] ?? '', r[gen_app_ent55_c13] ?? '', r[gen_app_ent55_c14] ?? '', appStore.displayOf('app_ent12', r[gen_app_ent55_c15] ?? ''), r[gen_app_ent55_c16] ?? ''].map((v) => '"' + v.replaceAll('"', '""') + '"').join(','));
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
      title: gen_app_ent55_c0,
      subtitle: gen_app_ent55_c1,
      icon: gen_app_ent55_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent55_c3 : gen_app_ent55_c4, onTap: _save),
      children: [
        DsSection(title: gen_app_ent55_c5, children: [
          DsSelect(label: gen_app_ent55_c9, entity: 'app_ent11', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_ent55_c10, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsField(label: gen_app_ent55_c11, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsDateField(label: gen_app_ent55_c12, value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent55_c13, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent55_c14, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsSelect(label: gen_app_ent55_c15, entity: 'app_ent12', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsField(label: gen_app_ent55_c16, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          if ((_v[7] ?? '').trim().isNotEmpty) _live(gen_app_ent55_c17, advanceStatus((_v[7] ?? ''))),
        ]),
        DsSection(title: gen_app_ent55_c6, trailing: _csvBtn(context), children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final all = appStore.records('app_ent55');
              if (all.isEmpty) return const DsEmpty(label: gen_app_ent55_c7);
              final q = _q.trim().toLowerCase();
              final rs = q.isEmpty ? all : all.where((r) => r.entries.any((e) => !e.key.startsWith('__') && e.value.toLowerCase().contains(q))).toList();
              return Column(children: [
                DsSearch(value: _q, onChanged: (v) => setState(() => _q = v)),
                if (rs.isEmpty) const DsEmpty(label: gen_app_ent55_c8),
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
