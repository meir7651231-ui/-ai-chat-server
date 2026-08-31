// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent4_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_search.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_date_field.dart';
import '../dart-ui-bs/ds/ds_toggle_tile.dart';
import '../dart-ui-bs/ds/ds_multi_select.dart';
import '../dart-ui-bs/ds/ds_board.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/advance-status.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class GenAppEnt4Screen extends StatefulWidget {
  const GenAppEnt4Screen({super.key});

  @override
  State<GenAppEnt4Screen> createState() => _GenAppEnt4ScreenState();
}

class _GenAppEnt4ScreenState extends State<GenAppEnt4Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת
  String _q = '';    // מחרוזת-חיפוש (סינון-רשומות חי)
  bool _board = false;   // מתג תצוגת-לוח מול רשימה


  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent4_c9: _v[0] ?? '', gen_app_ent4_c10: _v[1] ?? '', gen_app_ent4_c11: _v[2] ?? '', gen_app_ent4_c12: _v[3] ?? '', gen_app_ent4_c13: _v[4] ?? '', gen_app_ent4_c14: _v[5] ?? '', gen_app_ent4_c15: _v[6] ?? '', gen_app_ent4_c16: _v[7] ?? '', gen_app_ent4_c17: _v[8] ?? '', gen_app_ent4_c18: _v[9] ?? '', gen_app_ent4_c19: _v[10] ?? '', gen_app_ent4_c20: _v[11] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent4', _editId!, map);
    } else {
      appStore.add('app_ent4', <String, String>{...map, '__stage': '0'});
    }
    setState(() { _v = {}; _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent4_c9] ?? '', 1: r[gen_app_ent4_c10] ?? '', 2: r[gen_app_ent4_c11] ?? '', 3: r[gen_app_ent4_c12] ?? '', 4: r[gen_app_ent4_c13] ?? '', 5: r[gen_app_ent4_c14] ?? '', 6: r[gen_app_ent4_c15] ?? '', 7: r[gen_app_ent4_c16] ?? '', 8: r[gen_app_ent4_c17] ?? '', 9: r[gen_app_ent4_c18] ?? '', 10: r[gen_app_ent4_c19] ?? '', 11: r[gen_app_ent4_c20] ?? ''};
    });
  }

  Widget _viewToggle(BuildContext context) => AnimatedBuilder(
    animation: appStore,
    builder: (context, _) => Material(
      color: const Color(0xFFF1F5F9),
      borderRadius: BorderRadius.circular(20),
      child: InkWell(
        borderRadius: BorderRadius.circular(20),
        onTap: () => setState(() => _board = !_board),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          child: Text(_board ? '☰ רשימה' : '📋 לוח', style: const TextStyle(color: DsTokens.muted, fontSize: 12.5, fontWeight: FontWeight.w700)),
        ),
      ),
    ),
  );

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_ent4_c9, gen_app_ent4_c10, gen_app_ent4_c11, gen_app_ent4_c12, gen_app_ent4_c13, gen_app_ent4_c14, gen_app_ent4_c15, gen_app_ent4_c16, gen_app_ent4_c17, gen_app_ent4_c18, gen_app_ent4_c19, gen_app_ent4_c20], values: [r[gen_app_ent4_c9] ?? '', r[gen_app_ent4_c10] ?? '', r[gen_app_ent4_c11] ?? '', r[gen_app_ent4_c12] ?? '', r[gen_app_ent4_c13] ?? '', r[gen_app_ent4_c14] ?? '', r[gen_app_ent4_c15] ?? '', r[gen_app_ent4_c16] ?? '', r[gen_app_ent4_c17] ?? '', appStore.displayList('app_ent32', r[gen_app_ent4_c18] ?? ''), appStore.displayList('app_ent35', r[gen_app_ent4_c19] ?? ''), r[gen_app_ent4_c20] ?? ''], stage: (const [gen_app_ent4_c22, gen_app_ent4_c23, gen_app_ent4_c24, gen_app_ent4_c25, gen_app_ent4_c26])[appStore.stageOf('app_ent4', rid)], stageDone: appStore.stageOf('app_ent4', rid) >= 4, stages: const [gen_app_ent4_c22, gen_app_ent4_c23, gen_app_ent4_c24, gen_app_ent4_c25, gen_app_ent4_c26], stageIndex: appStore.stageOf('app_ent4', rid), onStage: (i) => appStore.setStage('app_ent4', rid, i), onAdvance: () => appStore.advance('app_ent4', rid, 5), onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent4', rid), footer: Wrap(spacing: 6, runSpacing: 6, children: [_backChip(gen_app_ent4_c27, appStore.referencing('app_ent2', gen_app_ent4_c28, rid).length), _backChip(gen_app_ent4_c29, appStore.referencing('app_ent5', gen_app_ent4_c30, rid).length), _backChip(gen_app_ent4_c31, appStore.referencing('app_ent7', gen_app_ent4_c32, rid).length), _backChip(gen_app_ent4_c33, appStore.referencing('app_ent8', gen_app_ent4_c34, rid).length), _backChip(gen_app_ent4_c35, appStore.referencing('app_ent9', gen_app_ent4_c36, rid).length), _backChip(gen_app_ent4_c37, appStore.referencing('app_ent10', gen_app_ent4_c38, rid).length), _backChip(gen_app_ent4_c39, appStore.referencing('app_ent14', gen_app_ent4_c40, rid).length), _backChip(gen_app_ent4_c41, appStore.referencing('app_ent15', gen_app_ent4_c42, rid).length), _backChip(gen_app_ent4_c43, appStore.referencing('app_ent26', gen_app_ent4_c44, rid).length), _backChip(gen_app_ent4_c45, appStore.referencing('app_ent44', gen_app_ent4_c46, rid).length), _backChip(gen_app_ent4_c47, appStore.referencing('app_ent70', gen_app_ent4_c48, rid).length)]));
  }

  Widget _backChip(String label, int n) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
        decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(20)),
        child: Text('$label · $n', style: const TextStyle(color: DsTokens.muted, fontSize: 11.5, fontWeight: FontWeight.w700)),
      );


  String _csv() {
    final b = StringBuffer();
    b.writeln(const [gen_app_ent4_c9, gen_app_ent4_c10, gen_app_ent4_c11, gen_app_ent4_c12, gen_app_ent4_c13, gen_app_ent4_c14, gen_app_ent4_c15, gen_app_ent4_c16, gen_app_ent4_c17, gen_app_ent4_c18, gen_app_ent4_c19, gen_app_ent4_c20].map((h) => '"' + h.replaceAll('"', '""') + '"').join(','));
    for (final r in appStore.records('app_ent4')) {
      b.writeln([r[gen_app_ent4_c9] ?? '', r[gen_app_ent4_c10] ?? '', r[gen_app_ent4_c11] ?? '', r[gen_app_ent4_c12] ?? '', r[gen_app_ent4_c13] ?? '', r[gen_app_ent4_c14] ?? '', r[gen_app_ent4_c15] ?? '', r[gen_app_ent4_c16] ?? '', r[gen_app_ent4_c17] ?? '', appStore.displayList('app_ent32', r[gen_app_ent4_c18] ?? ''), appStore.displayList('app_ent35', r[gen_app_ent4_c19] ?? ''), r[gen_app_ent4_c20] ?? ''].map((v) => '"' + v.replaceAll('"', '""') + '"').join(','));
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
      title: gen_app_ent4_c0,
      subtitle: gen_app_ent4_c1,
      icon: gen_app_ent4_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent4_c3 : gen_app_ent4_c4, onTap: _save),
      children: [
        DsWorkflow(steps: const [gen_app_ent4_c22, gen_app_ent4_c23, gen_app_ent4_c24, gen_app_ent4_c25, gen_app_ent4_c26], current: 0),
        DsSection(title: gen_app_ent4_c5, children: [
          DsField(label: gen_app_ent4_c9, hint: '', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsDateField(label: gen_app_ent4_c10, value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsDateField(label: gen_app_ent4_c11, value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent4_c12, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent4_c13, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent4_c14, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsField(label: gen_app_ent4_c15, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsField(label: gen_app_ent4_c16, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsToggleTile(label: gen_app_ent4_c17, value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
          DsMultiSelect(label: gen_app_ent4_c18, entity: 'app_ent32', value: _v[9] ?? '', onChanged: (v) => setState(() => _v[9] = v)),
          DsMultiSelect(label: gen_app_ent4_c19, entity: 'app_ent35', value: _v[10] ?? '', onChanged: (v) => setState(() => _v[10] = v)),
          DsField(label: gen_app_ent4_c20, hint: '', value: _v[11] ?? '', onChanged: (v) => setState(() => _v[11] = v)),
          if ((_v[11] ?? '').trim().isNotEmpty) _live(gen_app_ent4_c21, advanceStatus((_v[11] ?? ''))),
        ]),
        DsSection(title: gen_app_ent4_c6, trailing: Row(mainAxisSize: MainAxisSize.min, children: [_viewToggle(context), const SizedBox(width: 8), _csvBtn(context)]), children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final all = appStore.records('app_ent4');
              if (all.isEmpty) return const DsEmpty(label: gen_app_ent4_c7);
              final q = _q.trim().toLowerCase();
              final rs = q.isEmpty ? all : all.where((r) => r.entries.any((e) => !e.key.startsWith('__') && e.value.toLowerCase().contains(q))).toList();
              if (_board) return DsBoard(stages: const [gen_app_ent4_c22, gen_app_ent4_c23, gen_app_ent4_c24, gen_app_ent4_c25, gen_app_ent4_c26], records: rs, stageOf: (r) => appStore.stageOf('app_ent4', r['__id'] ?? ''), titleOf: (r) => r[gen_app_ent4_c9] ?? '', onMove: (id, to) => appStore.setStage('app_ent4', id, to));
              return Column(children: [
                DsSearch(value: _q, onChanged: (v) => setState(() => _q = v)),
                if (rs.isEmpty) const DsEmpty(label: gen_app_ent4_c8),
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
