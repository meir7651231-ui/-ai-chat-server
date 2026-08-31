// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent21_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_search.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_date_field.dart';
import '../dart-ui-bs/ds/ds_toggle_tile.dart';
import '../dart-ui-bs/ds/ds_multi_select.dart';
import '../dart-ui-bs/ds/ds_calendar.dart';
import '../dart-ui-bs/ds/ds_table.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/advance-status.dart';
import '../dart-maor/norm-email.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class GenAppEnt21Screen extends StatefulWidget {
  const GenAppEnt21Screen({super.key});

  @override
  State<GenAppEnt21Screen> createState() => _GenAppEnt21ScreenState();
}

class _GenAppEnt21ScreenState extends State<GenAppEnt21Screen> {
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת
  String _q = '';    // מחרוזת-חיפוש (סינון-רשומות חי)
  int _view = 0;   // 0=רשימה · לוח · לוח-שנה · טבלה


  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final map = <String, String>{gen_app_ent21_c9: _v[0] ?? '', gen_app_ent21_c10: _v[1] ?? '', gen_app_ent21_c11: _v[2] ?? '', gen_app_ent21_c12: _v[3] ?? '', gen_app_ent21_c13: _v[4] ?? '', gen_app_ent21_c15: _v[5] ?? '', gen_app_ent21_c16: _v[6] ?? '', gen_app_ent21_c17: _v[7] ?? '', gen_app_ent21_c18: _v[8] ?? '', gen_app_ent21_c19: _v[9] ?? '', gen_app_ent21_c20: _v[10] ?? '', gen_app_ent21_c21: _v[11] ?? '', gen_app_ent21_c22: _v[12] ?? '', gen_app_ent21_c23: _v[13] ?? '', gen_app_ent21_c24: _v[14] ?? '', gen_app_ent21_c25: _v[15] ?? '', gen_app_ent21_c26: _v[16] ?? '', gen_app_ent21_c27: _v[17] ?? '', gen_app_ent21_c28: _v[18] ?? '', gen_app_ent21_c29: _v[19] ?? '', gen_app_ent21_c30: _v[20] ?? ''};
    if (_editId != null) {
      appStore.update('app_ent21', _editId!, map);
    } else {
      appStore.add('app_ent21', <String, String>{...map});
    }
    setState(() { _v = {}; _editId = null; });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_ent21_c9] ?? '', 1: r[gen_app_ent21_c10] ?? '', 2: r[gen_app_ent21_c11] ?? '', 3: r[gen_app_ent21_c12] ?? '', 4: r[gen_app_ent21_c13] ?? '', 5: r[gen_app_ent21_c15] ?? '', 6: r[gen_app_ent21_c16] ?? '', 7: r[gen_app_ent21_c17] ?? '', 8: r[gen_app_ent21_c18] ?? '', 9: r[gen_app_ent21_c19] ?? '', 10: r[gen_app_ent21_c20] ?? '', 11: r[gen_app_ent21_c21] ?? '', 12: r[gen_app_ent21_c22] ?? '', 13: r[gen_app_ent21_c23] ?? '', 14: r[gen_app_ent21_c24] ?? '', 15: r[gen_app_ent21_c25] ?? '', 16: r[gen_app_ent21_c26] ?? '', 17: r[gen_app_ent21_c27] ?? '', 18: r[gen_app_ent21_c28] ?? '', 19: r[gen_app_ent21_c29] ?? '', 20: r[gen_app_ent21_c30] ?? ''};
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
    return DsRecordCard(labels: const [gen_app_ent21_c9, gen_app_ent21_c10, gen_app_ent21_c11, gen_app_ent21_c12, gen_app_ent21_c13, gen_app_ent21_c15, gen_app_ent21_c16, gen_app_ent21_c17, gen_app_ent21_c18, gen_app_ent21_c19, gen_app_ent21_c20, gen_app_ent21_c21, gen_app_ent21_c22, gen_app_ent21_c23, gen_app_ent21_c24, gen_app_ent21_c25, gen_app_ent21_c26, gen_app_ent21_c27, gen_app_ent21_c28, gen_app_ent21_c29, gen_app_ent21_c30], values: [r[gen_app_ent21_c9] ?? '', r[gen_app_ent21_c10] ?? '', r[gen_app_ent21_c11] ?? '', r[gen_app_ent21_c12] ?? '', r[gen_app_ent21_c13] ?? '', r[gen_app_ent21_c15] ?? '', r[gen_app_ent21_c16] ?? '', r[gen_app_ent21_c17] ?? '', appStore.displayList('app_ent18', r[gen_app_ent21_c18] ?? ''), appStore.displayList('app_ent14', r[gen_app_ent21_c19] ?? ''), appStore.displayList('app_ent15', r[gen_app_ent21_c20] ?? ''), r[gen_app_ent21_c21] ?? '', r[gen_app_ent21_c22] ?? '', r[gen_app_ent21_c23] ?? '', r[gen_app_ent21_c24] ?? '', r[gen_app_ent21_c25] ?? '', r[gen_app_ent21_c26] ?? '', r[gen_app_ent21_c27] ?? '', appStore.displayList('app_ent70', r[gen_app_ent21_c28] ?? ''), r[gen_app_ent21_c29] ?? '', r[gen_app_ent21_c30] ?? ''], onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_ent21', rid), footer: Wrap(spacing: 6, runSpacing: 6, children: [_backChip(gen_app_ent21_c32, appStore.referencing('app_ent22', gen_app_ent21_c33, rid).length), _backChip(gen_app_ent21_c34, appStore.referencing('app_ent23', gen_app_ent21_c35, rid).length), _backChip(gen_app_ent21_c36, appStore.referencing('app_ent24', gen_app_ent21_c37, rid).length), _backChip(gen_app_ent21_c38, appStore.referencing('app_ent25', gen_app_ent21_c39, rid).length), _backChip(gen_app_ent21_c40, appStore.referencing('app_ent49', gen_app_ent21_c41, rid).length), _backChip(gen_app_ent21_c42, appStore.referencing('app_ent70', gen_app_ent21_c43, rid).length)]));
  }

  Widget _backChip(String label, int n) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
        decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(20)),
        child: Text('$label · $n', style: const TextStyle(color: DsTokens.muted, fontSize: 11.5, fontWeight: FontWeight.w700)),
      );


  String _csv() {
    final b = StringBuffer();
    b.writeln(const [gen_app_ent21_c9, gen_app_ent21_c10, gen_app_ent21_c11, gen_app_ent21_c12, gen_app_ent21_c13, gen_app_ent21_c15, gen_app_ent21_c16, gen_app_ent21_c17, gen_app_ent21_c18, gen_app_ent21_c19, gen_app_ent21_c20, gen_app_ent21_c21, gen_app_ent21_c22, gen_app_ent21_c23, gen_app_ent21_c24, gen_app_ent21_c25, gen_app_ent21_c26, gen_app_ent21_c27, gen_app_ent21_c28, gen_app_ent21_c29, gen_app_ent21_c30].map((h) => '"' + h.replaceAll('"', '""') + '"').join(','));
    for (final r in appStore.records('app_ent21')) {
      b.writeln([r[gen_app_ent21_c9] ?? '', r[gen_app_ent21_c10] ?? '', r[gen_app_ent21_c11] ?? '', r[gen_app_ent21_c12] ?? '', r[gen_app_ent21_c13] ?? '', r[gen_app_ent21_c15] ?? '', r[gen_app_ent21_c16] ?? '', r[gen_app_ent21_c17] ?? '', appStore.displayList('app_ent18', r[gen_app_ent21_c18] ?? ''), appStore.displayList('app_ent14', r[gen_app_ent21_c19] ?? ''), appStore.displayList('app_ent15', r[gen_app_ent21_c20] ?? ''), r[gen_app_ent21_c21] ?? '', r[gen_app_ent21_c22] ?? '', r[gen_app_ent21_c23] ?? '', r[gen_app_ent21_c24] ?? '', r[gen_app_ent21_c25] ?? '', r[gen_app_ent21_c26] ?? '', r[gen_app_ent21_c27] ?? '', appStore.displayList('app_ent70', r[gen_app_ent21_c28] ?? ''), r[gen_app_ent21_c29] ?? '', r[gen_app_ent21_c30] ?? ''].map((v) => '"' + v.replaceAll('"', '""') + '"').join(','));
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
      title: gen_app_ent21_c0,
      subtitle: gen_app_ent21_c1,
      icon: gen_app_ent21_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_ent21_c3 : gen_app_ent21_c4, onTap: _save),
      children: [
        AnimatedBuilder(animation: appStore, builder: (context, _) => Padding(padding: const EdgeInsets.only(bottom: 12), child: Row(children: [Expanded(child: DsStat(label: gen_app_ent21_c0, value: appStore.count('app_ent21').toString(), sub: gen_app_ent21_c44, glyph: gen_app_ent21_c45))]))),
        DsSection(title: gen_app_ent21_c5, children: [
          DsField(label: gen_app_ent21_c9, hint: '', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_ent21_c10, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsField(label: gen_app_ent21_c11, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent21_c12, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent21_c13, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          if ((_v[4] ?? '').trim().isNotEmpty) _live(gen_app_ent21_c14, normEmail((_v[4] ?? ''))),
          DsField(label: gen_app_ent21_c15, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsDateField(label: gen_app_ent21_c16, value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsDateField(label: gen_app_ent21_c17, value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsMultiSelect(label: gen_app_ent21_c18, entity: 'app_ent18', value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
          DsMultiSelect(label: gen_app_ent21_c19, entity: 'app_ent14', value: _v[9] ?? '', onChanged: (v) => setState(() => _v[9] = v)),
          DsMultiSelect(label: gen_app_ent21_c20, entity: 'app_ent15', value: _v[10] ?? '', onChanged: (v) => setState(() => _v[10] = v)),
          DsField(label: gen_app_ent21_c21, hint: '', value: _v[11] ?? '', onChanged: (v) => setState(() => _v[11] = v)),
          DsField(label: gen_app_ent21_c22, hint: '', value: _v[12] ?? '', onChanged: (v) => setState(() => _v[12] = v)),
          DsField(label: gen_app_ent21_c23, hint: '', value: _v[13] ?? '', onChanged: (v) => setState(() => _v[13] = v)),
          DsField(label: gen_app_ent21_c24, hint: '', value: _v[14] ?? '', onChanged: (v) => setState(() => _v[14] = v)),
          DsField(label: gen_app_ent21_c25, hint: '', value: _v[15] ?? '', onChanged: (v) => setState(() => _v[15] = v)),
          DsField(label: gen_app_ent21_c26, hint: '', value: _v[16] ?? '', onChanged: (v) => setState(() => _v[16] = v)),
          DsToggleTile(label: gen_app_ent21_c27, value: _v[17] ?? '', onChanged: (v) => setState(() => _v[17] = v)),
          DsMultiSelect(label: gen_app_ent21_c28, entity: 'app_ent70', value: _v[18] ?? '', onChanged: (v) => setState(() => _v[18] = v)),
          DsField(label: gen_app_ent21_c29, hint: '', value: _v[19] ?? '', onChanged: (v) => setState(() => _v[19] = v)),
          DsField(label: gen_app_ent21_c30, hint: '', value: _v[20] ?? '', onChanged: (v) => setState(() => _v[20] = v)),
          if ((_v[20] ?? '').trim().isNotEmpty) _live(gen_app_ent21_c31, advanceStatus((_v[20] ?? ''))),
        ]),
        DsSection(title: gen_app_ent21_c6, trailing: Row(mainAxisSize: MainAxisSize.min, children: [_viewBar(context), const SizedBox(width: 8), _csvBtn(context)]), children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final all = appStore.records('app_ent21');
              if (all.isEmpty) return const DsEmpty(label: gen_app_ent21_c7);
              final q = _q.trim().toLowerCase();
              final rs = q.isEmpty ? all : all.where((r) => r.entries.any((e) => !e.key.startsWith('__') && e.value.toLowerCase().contains(q))).toList();
              if (_view == 1) return DsCalendar(records: rs, dateOf: (r) => r[gen_app_ent21_c16] ?? '', titleOf: (r) => r[gen_app_ent21_c9] ?? '');
              if (_view == 2) return DsTable(labels: const [gen_app_ent21_c9, gen_app_ent21_c10, gen_app_ent21_c11, gen_app_ent21_c12, gen_app_ent21_c13, gen_app_ent21_c15, gen_app_ent21_c16, gen_app_ent21_c17, gen_app_ent21_c18, gen_app_ent21_c19, gen_app_ent21_c20, gen_app_ent21_c21, gen_app_ent21_c22, gen_app_ent21_c23, gen_app_ent21_c24, gen_app_ent21_c25, gen_app_ent21_c26, gen_app_ent21_c27, gen_app_ent21_c28, gen_app_ent21_c29, gen_app_ent21_c30], rows: rs.map((r) => [r[gen_app_ent21_c9] ?? '', r[gen_app_ent21_c10] ?? '', r[gen_app_ent21_c11] ?? '', r[gen_app_ent21_c12] ?? '', r[gen_app_ent21_c13] ?? '', r[gen_app_ent21_c15] ?? '', r[gen_app_ent21_c16] ?? '', r[gen_app_ent21_c17] ?? '', appStore.displayList('app_ent18', r[gen_app_ent21_c18] ?? ''), appStore.displayList('app_ent14', r[gen_app_ent21_c19] ?? ''), appStore.displayList('app_ent15', r[gen_app_ent21_c20] ?? ''), r[gen_app_ent21_c21] ?? '', r[gen_app_ent21_c22] ?? '', r[gen_app_ent21_c23] ?? '', r[gen_app_ent21_c24] ?? '', r[gen_app_ent21_c25] ?? '', r[gen_app_ent21_c26] ?? '', r[gen_app_ent21_c27] ?? '', appStore.displayList('app_ent70', r[gen_app_ent21_c28] ?? ''), r[gen_app_ent21_c29] ?? '', r[gen_app_ent21_c30] ?? '']).toList());
              return Column(children: [
                DsSearch(value: _q, onChanged: (v) => setState(() => _q = v)),
                if (rs.isEmpty) const DsEmpty(label: gen_app_ent21_c8),
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
