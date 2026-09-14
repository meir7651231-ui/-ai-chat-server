// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_gentikim_ent2_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_search.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_date_field.dart';
import '../dart-ui-bs/ds/ds_number_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_board.dart';
import '../dart-ui-bs/ds/ds_calendar.dart';
import '../dart-ui-bs/ds/ds_table.dart';
import '../dart-ui-bs/ds/ds_store.dart';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class GenAppGentikimEnt2Screen extends StatefulWidget {
  const GenAppGentikimEnt2Screen({this.scopeField, this.scopeId, this.initial, this.editId, super.key});
  final String? editId;   // פתיחה ישר בעריכת-רשומה קיימת (מעמוד-התיק «ערוך»)

  final Map<String, String>? initial;   // G33 · מילוי-מראש מ«מה קרה?» (הכרעה-29): שדה ⇒ ערך, פעם אחת
  final String? scopeField;   // G26 · היקף-הורה (ניווט-מקשרים): שדה-הקשר + מזהה ⇒ הרשימה מסוננת לרשומת-ההורה והטופס ממולא-מראש
  final String? scopeId;

  @override
  State<GenAppGentikimEnt2Screen> createState() => _GenAppGentikimEnt2ScreenState();
}

class _GenAppGentikimEnt2ScreenState extends State<GenAppGentikimEnt2Screen> {
  static const List<String> _labelsAll = [gen_app_gentikim_ent2_c9, gen_app_gentikim_ent2_c10, gen_app_gentikim_ent2_c11, gen_app_gentikim_ent2_c12];
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת
  bool _initialUsed = false;
  void _prefill() { if (widget.scopeId != null) { final i = _labelsAll.indexOf(widget.scopeField ?? ''); if (i >= 0) _v[i] = widget.scopeId!; } if (widget.initial != null && !_initialUsed) { _initialUsed = true; widget.initial!.forEach((f, v) { final i = _labelsAll.indexOf(f); if (i >= 0 && v.trim().isNotEmpty) _v[i] = v; }); } }
  @override
  void initState() { super.initState(); _prefill(); if (widget.editId != null) { final r = appStore.byId('app_gentikim_ent2', widget.editId!); if (r != null) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted) _edit(r); }); } }
  String _q = '';    // מחרוזת-חיפוש (סינון-רשומות חי)
  int _view = 0;   // 0=רשימה · לוח · לוח-שנה · טבלה
  String? _err;      // שגיאת-ולידציה (שדות-חובה חסרים)


  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final miss = <String>[];
      if ((_v[0] ?? '').trim().isEmpty) miss.add('חסר ' + gen_app_gentikim_ent2_c9);
      
      
    if (miss.isNotEmpty) { setState(() => _err = miss.join(' · ')); return; }
    final map = <String, String>{gen_app_gentikim_ent2_c9: _v[0] ?? '', gen_app_gentikim_ent2_c10: _v[1] ?? '', gen_app_gentikim_ent2_c11: _v[2] ?? '', gen_app_gentikim_ent2_c12: _v[3] ?? ''};
    if (_editId != null) {
      appStore.update('app_gentikim_ent2', _editId!, map);
    } else {
      appStore.add('app_gentikim_ent2', <String, String>{...map, '__stage': '0'});
    }
    setState(() { _v = {}; _editId = null; _err = null; _prefill(); });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_gentikim_ent2_c9] ?? '', 1: r[gen_app_gentikim_ent2_c10] ?? '', 2: r[gen_app_gentikim_ent2_c11] ?? '', 3: r[gen_app_gentikim_ent2_c12] ?? ''};
    });
  }

  Widget _viewBar(BuildContext context) {
    final lk = DsLook.of(context);
    const labels = ['☰ רשימה', '📋 לוח', '📅 לוח-שנה', '▦ טבלה'];
    return Row(mainAxisSize: MainAxisSize.min, children: [
      for (var i = 0; i < labels.length; i++)
        Padding(
          padding: const EdgeInsets.only(left: 6),
          child: Material(
            color: _view == i ? lk.accentSoft : (lk.chipBg),
            borderRadius: BorderRadius.circular(20),
            child: InkWell(
              borderRadius: BorderRadius.circular(20),
              onTap: () => setState(() => _view = i),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 6),
                child: Text(labels[i], style: TextStyle(color: _view == i ? lk.accentDark : lk.muted, fontSize: 12, fontWeight: FontWeight.w700)),
              ),
            ),
          ),
        ),
    ]);
  }

  Widget _card(Map<String, String> r) {
    final rid = r['__id'] ?? '';
    return DsRecordCard(labels: const [gen_app_gentikim_ent2_c9, gen_app_gentikim_ent2_c10, gen_app_gentikim_ent2_c11, gen_app_gentikim_ent2_c12], values: [appStore.displayOf('app_gentikim_ent1', r[gen_app_gentikim_ent2_c9] ?? ''), r[gen_app_gentikim_ent2_c10] ?? '', r[gen_app_gentikim_ent2_c11] ?? '', r[gen_app_gentikim_ent2_c12] ?? ''], stage: (const [gen_app_gentikim_ent2_c13, gen_app_gentikim_ent2_c14, gen_app_gentikim_ent2_c15])[appStore.stageOf('app_gentikim_ent2', rid)], stageDone: appStore.stageOf('app_gentikim_ent2', rid) >= 2, stages: const [gen_app_gentikim_ent2_c13, gen_app_gentikim_ent2_c14, gen_app_gentikim_ent2_c15], stageIndex: appStore.stageOf('app_gentikim_ent2', rid), onStage: (i) => appStore.setStage('app_gentikim_ent2', rid, i), onAdvance: () => appStore.advance('app_gentikim_ent2', rid, 3), onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_gentikim_ent2', rid));
  }


  String _csv() {
    final b = StringBuffer();
    b.writeln(const [gen_app_gentikim_ent2_c9, gen_app_gentikim_ent2_c10, gen_app_gentikim_ent2_c11, gen_app_gentikim_ent2_c12].map((h) => '"' + h.replaceAll('"', '""') + '"').join(','));
    for (final r in appStore.records('app_gentikim_ent2')) {
      b.writeln([appStore.displayOf('app_gentikim_ent1', r[gen_app_gentikim_ent2_c9] ?? ''), r[gen_app_gentikim_ent2_c10] ?? '', r[gen_app_gentikim_ent2_c11] ?? '', r[gen_app_gentikim_ent2_c12] ?? ''].map((v) => '"' + v.replaceAll('"', '""') + '"').join(','));
    }
    return b.toString();
  }

  Widget _csvBtn(BuildContext context) { final lk = DsLook.of(context); return Material(
        color: lk.chipBg,
        borderRadius: BorderRadius.circular(9),
        child: InkWell(
          borderRadius: BorderRadius.circular(9),
          onTap: () {
            Clipboard.setData(ClipboardData(text: _csv()));
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('הועתק כ-CSV'), duration: Duration(seconds: 2)));
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            child: Row(mainAxisSize: MainAxisSize.min, children: [
              Icon(Icons.copy_all_outlined, size: 15, color: lk.muted),
              const SizedBox(width: 5),
              Text('CSV', style: TextStyle(color: lk.muted, fontSize: 12, fontWeight: FontWeight.w700)),
            ]),
          ),
        ),
      ); }

  @override
  Widget build(BuildContext context) {
    final lk = DsLook.of(context);
    return DsScaffold(
      title: gen_app_gentikim_ent2_c0,
      subtitle: gen_app_gentikim_ent2_c1,
      icon: gen_app_gentikim_ent2_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_gentikim_ent2_c3 : gen_app_gentikim_ent2_c4, onTap: _save),
      children: [
        AnimatedBuilder(animation: appStore, builder: (context, _) => Padding(padding: const EdgeInsets.only(bottom: 12), child: Row(children: [Expanded(child: DsStat(label: gen_app_gentikim_ent2_c0, value: appStore.count('app_gentikim_ent2').toString(), sub: gen_app_gentikim_ent2_c18, glyph: gen_app_gentikim_ent2_c19)), const SizedBox(width: 10), Expanded(child: DsStat(label: gen_app_gentikim_ent2_c11, value: appStore.sum('app_gentikim_ent2', gen_app_gentikim_ent2_c11).toStringAsFixed(0), sub: gen_app_gentikim_ent2_c16, glyph: gen_app_gentikim_ent2_c17))]))),
        DsWorkflow(steps: const [gen_app_gentikim_ent2_c13, gen_app_gentikim_ent2_c14, gen_app_gentikim_ent2_c15], current: 0),
        if (_err != null) Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: lk.dangerSoft, borderRadius: BorderRadius.circular(lk.rSm), border: Border.all(color: lk.dangerLine)),
          child: Row(children: [Icon(Icons.error_outline, size: 16, color: lk.danger), const SizedBox(width: 8), Expanded(child: Text(_err!, style: TextStyle(color: lk.danger, fontSize: 13, fontWeight: FontWeight.w600)))]),
        ),
        DsSection(title: gen_app_gentikim_ent2_c5, children: [
          DsSelect(label: gen_app_gentikim_ent2_c9, entity: 'app_gentikim_ent1', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_gentikim_ent2_c10, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsNumberField(label: gen_app_gentikim_ent2_c11, value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsDateField(label: gen_app_gentikim_ent2_c12, value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
        ]),
        DsSection(title: gen_app_gentikim_ent2_c6, trailing: Row(mainAxisSize: MainAxisSize.min, children: [_viewBar(context), const SizedBox(width: 8), _csvBtn(context)]), children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final all = (widget.scopeId == null ? appStore.records('app_gentikim_ent2') : appStore.records('app_gentikim_ent2').where((r) => (r[widget.scopeField ?? ''] ?? '') == widget.scopeId).toList());
              if (all.isEmpty) return const DsEmpty(label: gen_app_gentikim_ent2_c7);
              final q = _q.trim().toLowerCase();
              final rs = q.isEmpty ? all : all.where((r) => r.entries.any((e) => !e.key.startsWith('__') && e.value.toLowerCase().contains(q))).toList();
              if (_view == 1) return DsBoard(stages: const [gen_app_gentikim_ent2_c13, gen_app_gentikim_ent2_c14, gen_app_gentikim_ent2_c15], records: rs, stageOf: (r) => appStore.stageOf('app_gentikim_ent2', r['__id'] ?? ''), titleOf: (r) => r[gen_app_gentikim_ent2_c9] ?? '', onMove: (id, to) => appStore.setStage('app_gentikim_ent2', id, to));
              if (_view == 2) return DsCalendar(records: rs, dateOf: (r) => r[gen_app_gentikim_ent2_c12] ?? '', titleOf: (r) => r[gen_app_gentikim_ent2_c9] ?? '');
              if (_view == 3) return DsTable(labels: const [gen_app_gentikim_ent2_c9, gen_app_gentikim_ent2_c10, gen_app_gentikim_ent2_c11, gen_app_gentikim_ent2_c12], rows: rs.map((r) => [appStore.displayOf('app_gentikim_ent1', r[gen_app_gentikim_ent2_c9] ?? ''), r[gen_app_gentikim_ent2_c10] ?? '', r[gen_app_gentikim_ent2_c11] ?? '', r[gen_app_gentikim_ent2_c12] ?? '']).toList());
              return Column(children: [
                DsSearch(value: _q, onChanged: (v) => setState(() => _q = v)),
                if (rs.isEmpty) const DsEmpty(label: gen_app_gentikim_ent2_c8),
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
