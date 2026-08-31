// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent18_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_search.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_toggle_tile.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/gen-join-code.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class GenAppEnt18Screen extends StatefulWidget {
  const GenAppEnt18Screen({super.key});

  @override
  State<GenAppEnt18Screen> createState() => _GenAppEnt18ScreenState();
}

class _GenAppEnt18ScreenState extends State<GenAppEnt18Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת
  String _q = '';    // מחרוזת-חיפוש (סינון-רשומות חי)


  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent18_c9: _v[0] ?? '', gen_app_ent18_c10: _v[1] ?? '', gen_app_ent18_c12: _v[2] ?? '', gen_app_ent18_c13: _v[3] ?? '', gen_app_ent18_c14: _v[4] ?? '', gen_app_ent18_c15: _v[5] ?? '', gen_app_ent18_c16: _v[6] ?? '', gen_app_ent18_c17: _v[7] ?? '', gen_app_ent18_c18: _v[8] ?? '', gen_app_ent18_c19: _v[9] ?? '', gen_app_ent18_c20: _v[10] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent18', _editId!, map);
    } else {
      appStore.add('app_ent18', <String, String>{...map});
    }
    setState(() { _v.clear(); _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent18_c9] ?? '', 1: r[gen_app_ent18_c10] ?? '', 2: r[gen_app_ent18_c12] ?? '', 3: r[gen_app_ent18_c13] ?? '', 4: r[gen_app_ent18_c14] ?? '', 5: r[gen_app_ent18_c15] ?? '', 6: r[gen_app_ent18_c16] ?? '', 7: r[gen_app_ent18_c17] ?? '', 8: r[gen_app_ent18_c18] ?? '', 9: r[gen_app_ent18_c19] ?? '', 10: r[gen_app_ent18_c20] ?? ''};
    });
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_ent18_c9, gen_app_ent18_c10, gen_app_ent18_c12, gen_app_ent18_c13, gen_app_ent18_c14, gen_app_ent18_c15, gen_app_ent18_c16, gen_app_ent18_c17, gen_app_ent18_c18, gen_app_ent18_c19, gen_app_ent18_c20], values: [r[gen_app_ent18_c9] ?? '', r[gen_app_ent18_c10] ?? '', r[gen_app_ent18_c12] ?? '', r[gen_app_ent18_c13] ?? '', r[gen_app_ent18_c14] ?? '', r[gen_app_ent18_c15] ?? '', r[gen_app_ent18_c16] ?? '', r[gen_app_ent18_c17] ?? '', r[gen_app_ent18_c18] ?? '', r[gen_app_ent18_c19] ?? '', r[gen_app_ent18_c20] ?? ''], onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent18', rid), footer: Wrap(spacing: 6, runSpacing: 6, children: [_backChip(gen_app_ent18_c21, appStore.referencing('app_ent19', gen_app_ent18_c22, rid).length), _backChip(gen_app_ent18_c23, appStore.referencing('app_ent20', gen_app_ent18_c24, rid).length), _backChip(gen_app_ent18_c25, appStore.referencing('app_ent26', gen_app_ent18_c26, rid).length), _backChip(gen_app_ent18_c27, appStore.referencing('app_ent28', gen_app_ent18_c28, rid).length), _backChip(gen_app_ent18_c29, appStore.referencing('app_ent29', gen_app_ent18_c30, rid).length), _backChip(gen_app_ent18_c31, appStore.referencing('app_ent30', gen_app_ent18_c32, rid).length), _backChip(gen_app_ent18_c33, appStore.referencing('app_ent32', gen_app_ent18_c34, rid).length), _backChip(gen_app_ent18_c35, appStore.referencing('app_ent33', gen_app_ent18_c36, rid).length), _backChip(gen_app_ent18_c37, appStore.referencing('app_ent34', gen_app_ent18_c38, rid).length), _backChip(gen_app_ent18_c39, appStore.referencing('app_ent37', gen_app_ent18_c40, rid).length), _backChip(gen_app_ent18_c41, appStore.referencing('app_ent71', gen_app_ent18_c42, rid).length)]));
  }

  Widget _backChip(String label, int n) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
        decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(20)),
        child: Text('$label · $n', style: const TextStyle(color: DsTokens.muted, fontSize: 11.5, fontWeight: FontWeight.w700)),
      );


  String _csv() {
    final b = StringBuffer();
    b.writeln(const [gen_app_ent18_c9, gen_app_ent18_c10, gen_app_ent18_c12, gen_app_ent18_c13, gen_app_ent18_c14, gen_app_ent18_c15, gen_app_ent18_c16, gen_app_ent18_c17, gen_app_ent18_c18, gen_app_ent18_c19, gen_app_ent18_c20].map((h) => '"' + h.replaceAll('"', '""') + '"').join(','));
    for (final r in appStore.records('app_ent18')) {
      b.writeln([r[gen_app_ent18_c9] ?? '', r[gen_app_ent18_c10] ?? '', r[gen_app_ent18_c12] ?? '', r[gen_app_ent18_c13] ?? '', r[gen_app_ent18_c14] ?? '', r[gen_app_ent18_c15] ?? '', r[gen_app_ent18_c16] ?? '', r[gen_app_ent18_c17] ?? '', r[gen_app_ent18_c18] ?? '', r[gen_app_ent18_c19] ?? '', r[gen_app_ent18_c20] ?? ''].map((v) => '"' + v.replaceAll('"', '""') + '"').join(','));
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
      title: gen_app_ent18_c0,
      subtitle: gen_app_ent18_c1,
      icon: gen_app_ent18_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent18_c3 : gen_app_ent18_c4, onTap: _save),
      children: [
        DsSection(title: gen_app_ent18_c5, children: [
          DsField(label: gen_app_ent18_c9, hint: '', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_ent18_c10, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          if ((_v[1] ?? '').trim().isNotEmpty) _live(gen_app_ent18_c11, genJoinCode((_v[1] ?? ''))),
          DsField(label: gen_app_ent18_c12, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent18_c13, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent18_c14, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent18_c15, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsField(label: gen_app_ent18_c16, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsField(label: gen_app_ent18_c17, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsField(label: gen_app_ent18_c18, hint: '', value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
          DsField(label: gen_app_ent18_c19, hint: '', value: _v[9] ?? '', onChanged: (v) => setState(() => _v[9] = v)),
          DsToggleTile(label: gen_app_ent18_c20, value: _v[10] ?? '', onChanged: (v) => setState(() => _v[10] = v)),
        ]),
        DsSection(title: gen_app_ent18_c6, trailing: _csvBtn(context), children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final all = appStore.records('app_ent18');
              if (all.isEmpty) return const DsEmpty(label: gen_app_ent18_c7);
              final q = _q.trim().toLowerCase();
              final rs = q.isEmpty ? all : all.where((r) => r.entries.any((e) => !e.key.startsWith('__') && e.value.toLowerCase().contains(q))).toList();
              return Column(children: [
                DsSearch(value: _q, onChanged: (v) => setState(() => _q = v)),
                if (rs.isEmpty) const DsEmpty(label: gen_app_ent18_c8),
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
