// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_gentikim_ent1_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_search.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_table.dart';
import '../dart-ui-bs/ds/ds_store.dart';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class GenAppGentikimEnt1Screen extends StatefulWidget {
  const GenAppGentikimEnt1Screen({this.scopeField, this.scopeId, this.initial, this.editId, super.key});
  final String? editId;   // פתיחה ישר בעריכת-רשומה קיימת (מעמוד-התיק «ערוך»)

  final Map<String, String>? initial;   // G33 · מילוי-מראש מ«מה קרה?» (הכרעה-29): שדה ⇒ ערך, פעם אחת
  final String? scopeField;   // G26 · היקף-הורה (ניווט-מקשרים): שדה-הקשר + מזהה ⇒ הרשימה מסוננת לרשומת-ההורה והטופס ממולא-מראש
  final String? scopeId;

  @override
  State<GenAppGentikimEnt1Screen> createState() => _GenAppGentikimEnt1ScreenState();
}

class _GenAppGentikimEnt1ScreenState extends State<GenAppGentikimEnt1Screen> {
  static const List<String> _labelsAll = [gen_app_gentikim_ent1_c9, gen_app_gentikim_ent1_c10, gen_app_gentikim_ent1_c11];
  Map<int, String> _v = {};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת
  bool _initialUsed = false;
  void _prefill() { if (widget.scopeId != null) { final i = _labelsAll.indexOf(widget.scopeField ?? ''); if (i >= 0) _v[i] = widget.scopeId!; } if (widget.initial != null && !_initialUsed) { _initialUsed = true; widget.initial!.forEach((f, v) { final i = _labelsAll.indexOf(f); if (i >= 0 && v.trim().isNotEmpty) _v[i] = v; }); } }
  @override
  void initState() { super.initState(); _prefill(); if (widget.editId != null) { final r = appStore.byId('app_gentikim_ent1', widget.editId!); if (r != null) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted) _edit(r); }); } }
  String _q = '';    // מחרוזת-חיפוש (סינון-רשומות חי)
  int _view = 0;   // 0=רשימה · לוח · לוח-שנה · טבלה
  String? _err;      // שגיאת-ולידציה (שדות-חובה חסרים)


  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final miss = <String>[];
      if ((_v[0] ?? '').trim().isEmpty) miss.add('חסר ' + gen_app_gentikim_ent1_c9);
      
      
    if (miss.isNotEmpty) { setState(() => _err = miss.join(' · ')); return; }
    final map = <String, String>{gen_app_gentikim_ent1_c9: _v[0] ?? '', gen_app_gentikim_ent1_c10: _v[1] ?? '', gen_app_gentikim_ent1_c11: _v[2] ?? ''};
    if (_editId != null) {
      appStore.update('app_gentikim_ent1', _editId!, map);
    } else {
      appStore.add('app_gentikim_ent1', <String, String>{...map});
    }
    setState(() { _v = {}; _editId = null; _err = null; _prefill(); });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_gentikim_ent1_c9] ?? '', 1: r[gen_app_gentikim_ent1_c10] ?? '', 2: r[gen_app_gentikim_ent1_c11] ?? ''};
    });
  }

  Widget _viewBar(BuildContext context) {
    final lk = DsLook.of(context);
    const labels = ['☰ רשימה', '▦ טבלה'];
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
    return DsRecordCard(labels: const [gen_app_gentikim_ent1_c9, gen_app_gentikim_ent1_c10, gen_app_gentikim_ent1_c11], values: [r[gen_app_gentikim_ent1_c9] ?? '', r[gen_app_gentikim_ent1_c10] ?? '', r[gen_app_gentikim_ent1_c11] ?? ''], onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_gentikim_ent1', rid), footer: Wrap(spacing: 6, runSpacing: 6, children: [_backChip(gen_app_gentikim_ent1_c12, appStore.referencing('app_gentikim_ent2', gen_app_gentikim_ent1_c13, rid).length)]));
  }

  Widget _backChip(String label, int n) => Builder(builder: (context) { final lk = DsLook.of(context); return Container(
        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
        decoration: BoxDecoration(color: lk.chipBg, borderRadius: BorderRadius.circular(20)),
        child: Text('$label · $n', style: TextStyle(color: lk.muted, fontSize: 11.5, fontWeight: FontWeight.w700)),
      ); });


  String _csv() {
    final b = StringBuffer();
    b.writeln(const [gen_app_gentikim_ent1_c9, gen_app_gentikim_ent1_c10, gen_app_gentikim_ent1_c11].map((h) => '"' + h.replaceAll('"', '""') + '"').join(','));
    for (final r in appStore.records('app_gentikim_ent1')) {
      b.writeln([r[gen_app_gentikim_ent1_c9] ?? '', r[gen_app_gentikim_ent1_c10] ?? '', r[gen_app_gentikim_ent1_c11] ?? ''].map((v) => '"' + v.replaceAll('"', '""') + '"').join(','));
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
      title: gen_app_gentikim_ent1_c0,
      subtitle: gen_app_gentikim_ent1_c1,
      icon: gen_app_gentikim_ent1_c2,
      bottomBar: DsPrimaryButton(label: _editId == null ? gen_app_gentikim_ent1_c3 : gen_app_gentikim_ent1_c4, onTap: _save),
      children: [
        AnimatedBuilder(animation: appStore, builder: (context, _) => Padding(padding: const EdgeInsets.only(bottom: 12), child: Row(children: [Expanded(child: DsStat(label: gen_app_gentikim_ent1_c0, value: appStore.count('app_gentikim_ent1').toString(), sub: gen_app_gentikim_ent1_c14, glyph: gen_app_gentikim_ent1_c15))]))),
        if (_err != null) Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: lk.dangerSoft, borderRadius: BorderRadius.circular(lk.rSm), border: Border.all(color: lk.dangerLine)),
          child: Row(children: [Icon(Icons.error_outline, size: 16, color: lk.danger), const SizedBox(width: 8), Expanded(child: Text(_err!, style: TextStyle(color: lk.danger, fontSize: 13, fontWeight: FontWeight.w600)))]),
        ),
        DsSection(title: gen_app_gentikim_ent1_c5, children: [
          DsField(label: gen_app_gentikim_ent1_c9, hint: '', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_gentikim_ent1_c10, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsField(label: gen_app_gentikim_ent1_c11, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
        ]),
        DsSection(title: gen_app_gentikim_ent1_c6, trailing: Row(mainAxisSize: MainAxisSize.min, children: [_viewBar(context), const SizedBox(width: 8), _csvBtn(context)]), children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final all = (widget.scopeId == null ? appStore.records('app_gentikim_ent1') : appStore.records('app_gentikim_ent1').where((r) => (r[widget.scopeField ?? ''] ?? '') == widget.scopeId).toList());
              if (all.isEmpty) return const DsEmpty(label: gen_app_gentikim_ent1_c7);
              final q = _q.trim().toLowerCase();
              final rs = q.isEmpty ? all : all.where((r) => r.entries.any((e) => !e.key.startsWith('__') && e.value.toLowerCase().contains(q))).toList();
              if (_view == 1) return DsTable(labels: const [gen_app_gentikim_ent1_c9, gen_app_gentikim_ent1_c10, gen_app_gentikim_ent1_c11], rows: rs.map((r) => [r[gen_app_gentikim_ent1_c9] ?? '', r[gen_app_gentikim_ent1_c10] ?? '', r[gen_app_gentikim_ent1_c11] ?? '']).toList());
              return Column(children: [
                DsSearch(value: _q, onChanged: (v) => setState(() => _q = v)),
                if (rs.isEmpty) const DsEmpty(label: gen_app_gentikim_ent1_c8),
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
