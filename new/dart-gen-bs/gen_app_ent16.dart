// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent16_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_search.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_date_field.dart';
import '../dart-ui-bs/ds/ds_number_field.dart';
import '../dart-ui-bs/ds/ds_calendar.dart';
import '../dart-ui-bs/ds/ds_table.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/advance-status.dart';
import '../dart-maor/stage-index.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class GenAppEnt16Screen extends StatefulWidget {
  const GenAppEnt16Screen({super.key});

  @override
  State<GenAppEnt16Screen> createState() => _GenAppEnt16ScreenState();
}

class _GenAppEnt16ScreenState extends State<GenAppEnt16Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת
  String _q = '';    // מחרוזת-חיפוש (סינון-רשומות חי)
  int _view = 0;   // 0=רשימה · לוח · לוח-שנה · טבלה


  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent16_c9: _v[0] ?? '', gen_app_ent16_c10: _v[1] ?? '', gen_app_ent16_c11: _v[2] ?? '', gen_app_ent16_c12: _v[3] ?? '', gen_app_ent16_c14: _v[4] ?? '', gen_app_ent16_c15: _v[5] ?? '', gen_app_ent16_c16: _v[6] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent16', _editId!, map);
    } else {
      appStore.add('app_ent16', <String, String>{...map});
    }
    setState(() { _v = {}; _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent16_c9] ?? '', 1: r[gen_app_ent16_c10] ?? '', 2: r[gen_app_ent16_c11] ?? '', 3: r[gen_app_ent16_c12] ?? '', 4: r[gen_app_ent16_c14] ?? '', 5: r[gen_app_ent16_c15] ?? '', 6: r[gen_app_ent16_c16] ?? ''};
    });
  }

  Widget _viewBar(BuildContext context) {
    const labels = ['☰ רשימה', '📅 לוח-שנה', '▦ טבלה'];
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
    return DsRecordCard(labels: const [gen_app_ent16_c9, gen_app_ent16_c10, gen_app_ent16_c11, gen_app_ent16_c12, gen_app_ent16_c14, gen_app_ent16_c15, gen_app_ent16_c16], values: [r[gen_app_ent16_c9] ?? '', r[gen_app_ent16_c10] ?? '', r[gen_app_ent16_c11] ?? '', r[gen_app_ent16_c12] ?? '', r[gen_app_ent16_c14] ?? '', r[gen_app_ent16_c15] ?? '', r[gen_app_ent16_c16] ?? ''], onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent16', rid), footer: Wrap(spacing: 6, runSpacing: 6, children: [_backChip(gen_app_ent16_c18, appStore.referencing('app_ent25', gen_app_ent16_c19, rid).length)]));
  }

  Widget _backChip(String label, int n) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
        decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(20)),
        child: Text('$label · $n', style: const TextStyle(color: DsTokens.muted, fontSize: 11.5, fontWeight: FontWeight.w700)),
      );


  String _csv() {
    final b = StringBuffer();
    b.writeln(const [gen_app_ent16_c9, gen_app_ent16_c10, gen_app_ent16_c11, gen_app_ent16_c12, gen_app_ent16_c14, gen_app_ent16_c15, gen_app_ent16_c16].map((h) => '"' + h.replaceAll('"', '""') + '"').join(','));
    for (final r in appStore.records('app_ent16')) {
      b.writeln([r[gen_app_ent16_c9] ?? '', r[gen_app_ent16_c10] ?? '', r[gen_app_ent16_c11] ?? '', r[gen_app_ent16_c12] ?? '', r[gen_app_ent16_c14] ?? '', r[gen_app_ent16_c15] ?? '', r[gen_app_ent16_c16] ?? ''].map((v) => '"' + v.replaceAll('"', '""') + '"').join(','));
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
      title: gen_app_ent16_c0,
      subtitle: gen_app_ent16_c1,
      icon: gen_app_ent16_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent16_c3 : gen_app_ent16_c4, onTap: _save),
      children: [
        AnimatedBuilder(animation: appStore, builder: (context, _) => Padding(padding: const EdgeInsets.only(bottom: 12), child: Row(children: [Expanded(child: DsStat(label: gen_app_ent16_c0, value: appStore.count('app_ent16').toString(), sub: gen_app_ent16_c22, glyph: gen_app_ent16_c23)), const SizedBox(width: 10), Expanded(child: DsStat(label: gen_app_ent16_c11, value: appStore.sum('app_ent16', gen_app_ent16_c11).toStringAsFixed(0), sub: gen_app_ent16_c20, glyph: gen_app_ent16_c21))]))),
        DsSection(title: gen_app_ent16_c5, children: [
          DsField(label: gen_app_ent16_c9, hint: '', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_ent16_c10, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsNumberField(label: gen_app_ent16_c11, value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent16_c12, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          if ((_v[3] ?? '').trim().isNotEmpty) _live(gen_app_ent16_c13, stageIndex((_v[3] ?? '')).toString()),
          DsDateField(label: gen_app_ent16_c14, value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent16_c15, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsField(label: gen_app_ent16_c16, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          if ((_v[6] ?? '').trim().isNotEmpty) _live(gen_app_ent16_c17, advanceStatus((_v[6] ?? ''))),
        ]),
        DsSection(title: gen_app_ent16_c6, trailing: Row(mainAxisSize: MainAxisSize.min, children: [_viewBar(context), const SizedBox(width: 8), _csvBtn(context)]), children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final all = appStore.records('app_ent16');
              if (all.isEmpty) return const DsEmpty(label: gen_app_ent16_c7);
              final q = _q.trim().toLowerCase();
              final rs = q.isEmpty ? all : all.where((r) => r.entries.any((e) => !e.key.startsWith('__') && e.value.toLowerCase().contains(q))).toList();
              if (_view == 1) return DsCalendar(records: rs, dateOf: (r) => r[gen_app_ent16_c14] ?? '', titleOf: (r) => r[gen_app_ent16_c9] ?? '');
              if (_view == 2) return DsTable(labels: const [gen_app_ent16_c9, gen_app_ent16_c10, gen_app_ent16_c11, gen_app_ent16_c12, gen_app_ent16_c14, gen_app_ent16_c15, gen_app_ent16_c16], rows: rs.map((r) => [r[gen_app_ent16_c9] ?? '', r[gen_app_ent16_c10] ?? '', r[gen_app_ent16_c11] ?? '', r[gen_app_ent16_c12] ?? '', r[gen_app_ent16_c14] ?? '', r[gen_app_ent16_c15] ?? '', r[gen_app_ent16_c16] ?? '']).toList());
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
