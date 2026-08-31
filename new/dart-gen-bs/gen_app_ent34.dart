// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent34_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_search.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_date_field.dart';
import '../dart-ui-bs/ds/ds_toggle_tile.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_board.dart';
import '../dart-ui-bs/ds/ds_calendar.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/advance-status.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class GenAppEnt34Screen extends StatefulWidget {
  const GenAppEnt34Screen({super.key});

  @override
  State<GenAppEnt34Screen> createState() => _GenAppEnt34ScreenState();
}

class _GenAppEnt34ScreenState extends State<GenAppEnt34Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת
  String _q = '';    // מחרוזת-חיפוש (סינון-רשומות חי)
  int _view = 0;   // 0=רשימה · 1=לוח · 2=לוח-שנה


  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent34_c9: _v[0] ?? '', gen_app_ent34_c10: _v[1] ?? '', gen_app_ent34_c11: _v[2] ?? '', gen_app_ent34_c12: _v[3] ?? '', gen_app_ent34_c13: _v[4] ?? '', gen_app_ent34_c14: _v[5] ?? '', gen_app_ent34_c15: _v[6] ?? '', gen_app_ent34_c16: _v[7] ?? '', gen_app_ent34_c17: _v[8] ?? '', gen_app_ent34_c18: _v[9] ?? '', gen_app_ent34_c19: _v[10] ?? '', gen_app_ent34_c20: _v[11] ?? '', gen_app_ent34_c21: _v[12] ?? '', gen_app_ent34_c22: _v[13] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent34', _editId!, map);
    } else {
      appStore.add('app_ent34', <String, String>{...map, '__stage': '0'});
    }
    setState(() { _v = {}; _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent34_c9] ?? '', 1: r[gen_app_ent34_c10] ?? '', 2: r[gen_app_ent34_c11] ?? '', 3: r[gen_app_ent34_c12] ?? '', 4: r[gen_app_ent34_c13] ?? '', 5: r[gen_app_ent34_c14] ?? '', 6: r[gen_app_ent34_c15] ?? '', 7: r[gen_app_ent34_c16] ?? '', 8: r[gen_app_ent34_c17] ?? '', 9: r[gen_app_ent34_c18] ?? '', 10: r[gen_app_ent34_c19] ?? '', 11: r[gen_app_ent34_c20] ?? '', 12: r[gen_app_ent34_c21] ?? '', 13: r[gen_app_ent34_c22] ?? ''};
    });
  }

  Widget _viewBar(BuildContext context) {
    const labels = ['☰ רשימה', '📋 לוח', '📅 לוח-שנה'];
    return Row(mainAxisSize: MainAxisSize.min, children: [
      for (var i = 0; i < labels.length; i++)
        Padding(
          padding: const EdgeInsets.only(left: 6),
          child: Material(
            color: _view == i ? DsTokens.accentSoft : const Color(0xFFF1F5F9),
            borderRadius: BorderRadius.circular(20),
            child: InkWell(
              borderRadius: BorderRadius.circular(20),
              onTap: () => setState(() => _view = i),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 6),
                child: Text(labels[i], style: TextStyle(color: _view == i ? DsTokens.accentDark : DsTokens.muted, fontSize: 12, fontWeight: FontWeight.w700)),
              ),
            ),
          ),
        ),
    ]);
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_ent34_c9, gen_app_ent34_c10, gen_app_ent34_c11, gen_app_ent34_c12, gen_app_ent34_c13, gen_app_ent34_c14, gen_app_ent34_c15, gen_app_ent34_c16, gen_app_ent34_c17, gen_app_ent34_c18, gen_app_ent34_c19, gen_app_ent34_c20, gen_app_ent34_c21, gen_app_ent34_c22], values: [appStore.displayOf('app_ent11', r[gen_app_ent34_c9] ?? ''), appStore.displayOf('app_ent18', r[gen_app_ent34_c10] ?? ''), appStore.displayOf('app_ent15', r[gen_app_ent34_c11] ?? ''), appStore.displayOf('app_ent5', r[gen_app_ent34_c12] ?? ''), r[gen_app_ent34_c13] ?? '', r[gen_app_ent34_c14] ?? '', r[gen_app_ent34_c15] ?? '', r[gen_app_ent34_c16] ?? '', r[gen_app_ent34_c17] ?? '', r[gen_app_ent34_c18] ?? '', appStore.displayOf('app_ent37', r[gen_app_ent34_c19] ?? ''), r[gen_app_ent34_c20] ?? '', r[gen_app_ent34_c21] ?? '', r[gen_app_ent34_c22] ?? ''], stage: (const [gen_app_ent34_c24, gen_app_ent34_c25, gen_app_ent34_c26, gen_app_ent34_c27])[appStore.stageOf('app_ent34', rid)], stageDone: appStore.stageOf('app_ent34', rid) >= 3, stages: const [gen_app_ent34_c24, gen_app_ent34_c25, gen_app_ent34_c26, gen_app_ent34_c27], stageIndex: appStore.stageOf('app_ent34', rid), onStage: (i) => appStore.setStage('app_ent34', rid, i), onAdvance: () => appStore.advance('app_ent34', rid, 4), onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent34', rid), footer: Wrap(spacing: 6, runSpacing: 6, children: [_backChip(gen_app_ent34_c28, appStore.referencing('app_ent5', gen_app_ent34_c29, rid).length), _backChip(gen_app_ent34_c30, appStore.referencing('app_ent12', gen_app_ent34_c31, rid).length), _backChip(gen_app_ent34_c32, appStore.referencing('app_ent35', gen_app_ent34_c33, rid).length)]));
  }

  Widget _backChip(String label, int n) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
        decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(20)),
        child: Text('$label · $n', style: const TextStyle(color: DsTokens.muted, fontSize: 11.5, fontWeight: FontWeight.w700)),
      );


  String _csv() {
    final b = StringBuffer();
    b.writeln(const [gen_app_ent34_c9, gen_app_ent34_c10, gen_app_ent34_c11, gen_app_ent34_c12, gen_app_ent34_c13, gen_app_ent34_c14, gen_app_ent34_c15, gen_app_ent34_c16, gen_app_ent34_c17, gen_app_ent34_c18, gen_app_ent34_c19, gen_app_ent34_c20, gen_app_ent34_c21, gen_app_ent34_c22].map((h) => '"' + h.replaceAll('"', '""') + '"').join(','));
    for (final r in appStore.records('app_ent34')) {
      b.writeln([appStore.displayOf('app_ent11', r[gen_app_ent34_c9] ?? ''), appStore.displayOf('app_ent18', r[gen_app_ent34_c10] ?? ''), appStore.displayOf('app_ent15', r[gen_app_ent34_c11] ?? ''), appStore.displayOf('app_ent5', r[gen_app_ent34_c12] ?? ''), r[gen_app_ent34_c13] ?? '', r[gen_app_ent34_c14] ?? '', r[gen_app_ent34_c15] ?? '', r[gen_app_ent34_c16] ?? '', r[gen_app_ent34_c17] ?? '', r[gen_app_ent34_c18] ?? '', appStore.displayOf('app_ent37', r[gen_app_ent34_c19] ?? ''), r[gen_app_ent34_c20] ?? '', r[gen_app_ent34_c21] ?? '', r[gen_app_ent34_c22] ?? ''].map((v) => '"' + v.replaceAll('"', '""') + '"').join(','));
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
      title: gen_app_ent34_c0,
      subtitle: gen_app_ent34_c1,
      icon: gen_app_ent34_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent34_c3 : gen_app_ent34_c4, onTap: _save),
      children: [
        DsWorkflow(steps: const [gen_app_ent34_c24, gen_app_ent34_c25, gen_app_ent34_c26, gen_app_ent34_c27], current: 0),
        DsSection(title: gen_app_ent34_c5, children: [
          DsSelect(label: gen_app_ent34_c9, entity: 'app_ent11', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsSelect(label: gen_app_ent34_c10, entity: 'app_ent18', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsSelect(label: gen_app_ent34_c11, entity: 'app_ent15', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsSelect(label: gen_app_ent34_c12, entity: 'app_ent5', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsToggleTile(label: gen_app_ent34_c13, value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent34_c14, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsField(label: gen_app_ent34_c15, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsField(label: gen_app_ent34_c16, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsField(label: gen_app_ent34_c17, hint: '', value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
          DsField(label: gen_app_ent34_c18, hint: '', value: _v[9] ?? '', onChanged: (v) => setState(() => _v[9] = v)),
          DsSelect(label: gen_app_ent34_c19, entity: 'app_ent37', value: _v[10] ?? '', onChanged: (v) => setState(() => _v[10] = v)),
          DsField(label: gen_app_ent34_c20, hint: '', value: _v[11] ?? '', onChanged: (v) => setState(() => _v[11] = v)),
          DsDateField(label: gen_app_ent34_c21, value: _v[12] ?? '', onChanged: (v) => setState(() => _v[12] = v)),
          DsField(label: gen_app_ent34_c22, hint: '', value: _v[13] ?? '', onChanged: (v) => setState(() => _v[13] = v)),
          if ((_v[13] ?? '').trim().isNotEmpty) _live(gen_app_ent34_c23, advanceStatus((_v[13] ?? ''))),
        ]),
        DsSection(title: gen_app_ent34_c6, trailing: Row(mainAxisSize: MainAxisSize.min, children: [_viewBar(context), const SizedBox(width: 8), _csvBtn(context)]), children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final all = appStore.records('app_ent34');
              if (all.isEmpty) return const DsEmpty(label: gen_app_ent34_c7);
              final q = _q.trim().toLowerCase();
              final rs = q.isEmpty ? all : all.where((r) => r.entries.any((e) => !e.key.startsWith('__') && e.value.toLowerCase().contains(q))).toList();
              if (_view == 1) return DsBoard(stages: const [gen_app_ent34_c24, gen_app_ent34_c25, gen_app_ent34_c26, gen_app_ent34_c27], records: rs, stageOf: (r) => appStore.stageOf('app_ent34', r['__id'] ?? ''), titleOf: (r) => r[gen_app_ent34_c9] ?? '', onMove: (id, to) => appStore.setStage('app_ent34', id, to));
              if (_view == 2) return DsCalendar(records: rs, dateOf: (r) => r[gen_app_ent34_c21] ?? '', titleOf: (r) => r[gen_app_ent34_c9] ?? '');
              return Column(children: [
                DsSearch(value: _q, onChanged: (v) => setState(() => _q = v)),
                if (rs.isEmpty) const DsEmpty(label: gen_app_ent34_c8),
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
