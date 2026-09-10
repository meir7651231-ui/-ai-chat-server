// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_panuy_ent1_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_search.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_enum_field.dart';
import '../dart-ui-bs/ds/ds_table.dart';
import 'dart:math';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/boq-line-amount.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../dart-forge-bs/header/header.dart'; // G12c · עור-forge במודול (skin.stat/hero) — אטומי-DS הוחלפו באטומי-forge עם fields; צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים (האטום לובש את החריץ)
import '../dart-forge-bs/input/input.dart'; // G12c · עור-forge במודול (skin.stat/hero) — אטומי-DS הוחלפו באטומי-forge עם fields; צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים (האטום לובש את החריץ)
import '../dart-forge-bs/spatial/spatial.dart'; // G12c · עור-forge במודול (skin.stat/hero) — אטומי-DS הוחלפו באטומי-forge עם fields; צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים (האטום לובש את החריץ)
import '../dart-forge-bs/action/action.dart'; // G12c · עור-forge במודול (skin.stat/hero) — אטומי-DS הוחלפו באטומי-forge עם fields; צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים (האטום לובש את החריץ)

class GenAppPanuyEnt1Screen extends StatefulWidget {
  const GenAppPanuyEnt1Screen({this.scopeField, this.scopeId, this.initial, this.editId, super.key});
  final String? editId;   // פתיחה ישר בעריכת-רשומה קיימת (מעמוד-התיק «ערוך»)

  final Map<String, String>? initial;   // G33 · מילוי-מראש מ«מה קרה?» (הכרעה-29): שדה ⇒ ערך, פעם אחת
  final String? scopeField;   // G26 · היקף-הורה (ניווט-מקשרים): שדה-הקשר + מזהה ⇒ הרשימה מסוננת לרשומת-ההורה והטופס ממולא-מראש
  final String? scopeId;

  @override
  State<GenAppPanuyEnt1Screen> createState() => _GenAppPanuyEnt1ScreenState();
}

class _GenAppPanuyEnt1ScreenState extends State<GenAppPanuyEnt1Screen> {
  static const List<String> _labelsAll = [gen_app_panuy_ent1_c9, gen_app_panuy_ent1_c10, gen_app_panuy_ent1_c13, gen_app_panuy_ent1_c14, gen_app_panuy_ent1_c15, gen_app_panuy_ent1_c17, gen_app_panuy_ent1_c19, gen_app_panuy_ent1_c20, gen_app_panuy_ent1_c22, gen_app_panuy_ent1_c23, gen_app_panuy_ent1_c24, gen_app_panuy_ent1_c25, gen_app_panuy_ent1_c26, gen_app_panuy_ent1_c27];
  Map<int, String> _v = {4: gen_app_panuy_ent1_c16, 5: gen_app_panuy_ent1_c18, 7: gen_app_panuy_ent1_c21};
  String? _editId;   // ריק = הוספה · מזהה = עריכת-רשומה קיימת
  bool _initialUsed = false;
  void _prefill() { if (widget.scopeId != null) { final i = _labelsAll.indexOf(widget.scopeField ?? ''); if (i >= 0) _v[i] = widget.scopeId!; } if (widget.initial != null && !_initialUsed) { _initialUsed = true; widget.initial!.forEach((f, v) { final i = _labelsAll.indexOf(f); if (i >= 0 && v.trim().isNotEmpty) _v[i] = v; }); } }
  @override
  void initState() { super.initState(); _prefill(); if (widget.editId != null) { final r = appStore.byId('app_panuy_ent1', widget.editId!); if (r != null) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted) _edit(r); }); } }
  String _q = '';    // מחרוזת-חיפוש (סינון-רשומות חי)
  int _view = 0;   // 0=רשימה · לוח · לוח-שנה · טבלה
  String? _err;      // שגיאת-ולידציה (שדות-חובה חסרים)


  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    final miss = <String>[];
      if ((_v[0] ?? '').trim().isEmpty) miss.add('חסר ' + gen_app_panuy_ent1_c9);
      
      
    if (miss.isNotEmpty) { setState(() => _err = miss.join(' · ')); return; }
    final map = <String, String>{gen_app_panuy_ent1_c9: _v[0] ?? '', gen_app_panuy_ent1_c10: _v[1] ?? '', gen_app_panuy_ent1_c13: _v[2] ?? '', gen_app_panuy_ent1_c14: _v[3] ?? '', gen_app_panuy_ent1_c15: _v[4] ?? '', gen_app_panuy_ent1_c17: _v[5] ?? '', gen_app_panuy_ent1_c19: _v[6] ?? '', gen_app_panuy_ent1_c20: _v[7] ?? '', gen_app_panuy_ent1_c22: ((num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0)).toStringAsFixed(2), gen_app_panuy_ent1_c23: ((num.tryParse(_v[3] ?? '') ?? 0)  -  (num.tryParse(_v[5] ?? '') ?? 0)).toStringAsFixed(2), gen_app_panuy_ent1_c24: (( (num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0) ) * ( (num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0) ) * 12321 + ( (num.tryParse(_v[3] ?? '') ?? 0)  -  (num.tryParse(_v[5] ?? '') ?? 0) ) * ( (num.tryParse(_v[3] ?? '') ?? 0)  -  (num.tryParse(_v[5] ?? '') ?? 0) ) * 8649).toStringAsFixed(2), gen_app_panuy_ent1_c25: (sqrt( (num.tryParse(_v[10] ?? '') ?? 0) )).toStringAsFixed(2), gen_app_panuy_ent1_c26: _v[12] ?? '', gen_app_panuy_ent1_c27: ''};
    if (_editId != null) {
      appStore.update('app_panuy_ent1', _editId!, map);
    } else {
      appStore.add('app_panuy_ent1', <String, String>{...map});
    }
    setState(() { _v = {4: gen_app_panuy_ent1_c16, 5: gen_app_panuy_ent1_c18, 7: gen_app_panuy_ent1_c21}; _editId = null; _err = null; _prefill(); });
  }

  void _edit(Map<String, String> r) {
    setState(() {
      _editId = r['__id'];
      _v = {0: r[gen_app_panuy_ent1_c9] ?? '', 1: r[gen_app_panuy_ent1_c10] ?? '', 2: r[gen_app_panuy_ent1_c13] ?? '', 3: r[gen_app_panuy_ent1_c14] ?? '', 4: r[gen_app_panuy_ent1_c15] ?? '', 5: r[gen_app_panuy_ent1_c17] ?? '', 6: r[gen_app_panuy_ent1_c19] ?? '', 7: r[gen_app_panuy_ent1_c20] ?? '', 8: r[gen_app_panuy_ent1_c22] ?? '', 9: r[gen_app_panuy_ent1_c23] ?? '', 10: r[gen_app_panuy_ent1_c24] ?? '', 11: r[gen_app_panuy_ent1_c25] ?? '', 12: r[gen_app_panuy_ent1_c26] ?? '', 13: r[gen_app_panuy_ent1_c27] ?? ''};
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
    return DsRecordCard(labels: const [gen_app_panuy_ent1_c9, gen_app_panuy_ent1_c10, gen_app_panuy_ent1_c13, gen_app_panuy_ent1_c14, gen_app_panuy_ent1_c15, gen_app_panuy_ent1_c17, gen_app_panuy_ent1_c19, gen_app_panuy_ent1_c20, gen_app_panuy_ent1_c22, gen_app_panuy_ent1_c23, gen_app_panuy_ent1_c24, gen_app_panuy_ent1_c25, gen_app_panuy_ent1_c26, gen_app_panuy_ent1_c27], values: [r[gen_app_panuy_ent1_c9] ?? '', r[gen_app_panuy_ent1_c10] ?? '', r[gen_app_panuy_ent1_c13] ?? '', r[gen_app_panuy_ent1_c14] ?? '', r[gen_app_panuy_ent1_c15] ?? '', r[gen_app_panuy_ent1_c17] ?? '', r[gen_app_panuy_ent1_c19] ?? '', r[gen_app_panuy_ent1_c20] ?? '', r[gen_app_panuy_ent1_c22] ?? '', r[gen_app_panuy_ent1_c23] ?? '', r[gen_app_panuy_ent1_c24] ?? '', r[gen_app_panuy_ent1_c25] ?? '', r[gen_app_panuy_ent1_c26] ?? '', boqLineAmount(<String, String>{gen_app_panuy_ent1_c30: (r[gen_app_panuy_ent1_c20] ?? ''), gen_app_panuy_ent1_c31: (r[gen_app_panuy_ent1_c19] ?? '')}).toString()], onEdit: () => _edit(r), onDelete: () => appStore.removeById('app_panuy_ent1', rid));
  }


  String _csv() {
    final b = StringBuffer();
    b.writeln(const [gen_app_panuy_ent1_c9, gen_app_panuy_ent1_c10, gen_app_panuy_ent1_c13, gen_app_panuy_ent1_c14, gen_app_panuy_ent1_c15, gen_app_panuy_ent1_c17, gen_app_panuy_ent1_c19, gen_app_panuy_ent1_c20, gen_app_panuy_ent1_c22, gen_app_panuy_ent1_c23, gen_app_panuy_ent1_c24, gen_app_panuy_ent1_c25, gen_app_panuy_ent1_c26, gen_app_panuy_ent1_c27].map((h) => '"' + h.replaceAll('"', '""') + '"').join(','));
    for (final r in appStore.records('app_panuy_ent1')) {
      b.writeln([r[gen_app_panuy_ent1_c9] ?? '', r[gen_app_panuy_ent1_c10] ?? '', r[gen_app_panuy_ent1_c13] ?? '', r[gen_app_panuy_ent1_c14] ?? '', r[gen_app_panuy_ent1_c15] ?? '', r[gen_app_panuy_ent1_c17] ?? '', r[gen_app_panuy_ent1_c19] ?? '', r[gen_app_panuy_ent1_c20] ?? '', r[gen_app_panuy_ent1_c22] ?? '', r[gen_app_panuy_ent1_c23] ?? '', r[gen_app_panuy_ent1_c24] ?? '', r[gen_app_panuy_ent1_c25] ?? '', r[gen_app_panuy_ent1_c26] ?? '', boqLineAmount(<String, String>{gen_app_panuy_ent1_c30: (r[gen_app_panuy_ent1_c20] ?? ''), gen_app_panuy_ent1_c31: (r[gen_app_panuy_ent1_c19] ?? '')}).toString()].map((v) => '"' + v.replaceAll('"', '""') + '"').join(','));
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

  Widget _calc(String label, num v) => Builder(builder: (context) { final lk = DsLook.of(context); return Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Container(
          padding: const EdgeInsets.all(13),
          decoration: BoxDecoration(color: lk.successSoft, borderRadius: BorderRadius.circular(lk.rSm)),
          child: Row(children: [
            Icon(Icons.calculate_outlined, size: 16, color: lk.success),
            const SizedBox(width: 8),
            Expanded(child: Text(label, style: TextStyle(color: lk.ink, fontSize: 13.5, fontWeight: FontWeight.w700))),
            Text(v.toStringAsFixed(2), style: TextStyle(color: lk.success, fontSize: 15.5, fontWeight: FontWeight.w800)),
          ]),
        ),
      ); });

  Widget _live(String label, String out) => Builder(builder: (context) { final lk = DsLook.of(context); return Padding(
        padding: const EdgeInsets.only(top: 2, bottom: 6),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(11),
          decoration: BoxDecoration(color: lk.accentSoft, borderRadius: BorderRadius.circular(lk.rSm)),
          child: Row(children: [
            Icon(Icons.bolt, size: 15, color: lk.accentDark),
            const SizedBox(width: 7),
            Expanded(child: Text('$label · $out', style: TextStyle(color: lk.accentDark, fontSize: 13, fontWeight: FontWeight.w700))),
          ]),
        ),
      ); });

  @override
  Widget build(BuildContext context) {
    final lk = DsLook.of(context);
    return DsScaffold(title: gen_app_panuy_ent1_c0, subtitle: gen_app_panuy_ent1_c1, icon: gen_app_panuy_ent1_c2, bottomBar: GestureDetector(behavior: HitTestBehavior.opaque, onTap: _save, child: ForgeToneButton(items: [[_editId == null ? gen_app_panuy_ent1_c3 : gen_app_panuy_ent1_c4]])), header: false, children: [ForgeCenteredPageHeader(fields: ['', gen_app_panuy_ent1_c0, gen_app_panuy_ent1_c1]), ...[
        AnimatedBuilder(animation: appStore, builder: (context, _) => Padding(padding: const EdgeInsets.only(bottom: 12), child: Row(children: [Expanded(child: DsStat(label: gen_app_panuy_ent1_c0, value: appStore.count('app_panuy_ent1').toString(), sub: gen_app_panuy_ent1_c32, glyph: gen_app_panuy_ent1_c33))]))),
        if (_err != null) Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: lk.dangerSoft, borderRadius: BorderRadius.circular(lk.rSm), border: Border.all(color: lk.dangerLine)),
          child: Row(children: [Icon(Icons.error_outline, size: 16, color: lk.danger), const SizedBox(width: 8), Expanded(child: Text(_err!, style: TextStyle(color: lk.danger, fontSize: 13, fontWeight: FontWeight.w600)))]),
        ),
        ForgeTitledSection(fields: [gen_app_panuy_ent1_c5, '', '', ''], child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [...[
          ForgeDsField(state: (_v[0] ?? '').toString().trim().isEmpty ? ForgeDsFieldState.empty : ForgeDsFieldState.filled, fields: [gen_app_panuy_ent1_c9, ''], control: DsField(label: gen_app_panuy_ent1_c9, hint: '', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v), bare: true)),
          ForgeDsEnumField(fields: [gen_app_panuy_ent1_c10], control: DsEnumField(label: gen_app_panuy_ent1_c10, options: const [gen_app_panuy_ent1_c11, gen_app_panuy_ent1_c12], value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v), bare: true)),
          ForgeDsField(state: (_v[2] ?? '').toString().trim().isEmpty ? ForgeDsFieldState.empty : ForgeDsFieldState.filled, fields: [gen_app_panuy_ent1_c13, ''], control: DsField(label: gen_app_panuy_ent1_c13, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v), bare: true)),
          ForgeDsField(state: (_v[3] ?? '').toString().trim().isEmpty ? ForgeDsFieldState.empty : ForgeDsFieldState.filled, fields: [gen_app_panuy_ent1_c14, ''], control: DsField(label: gen_app_panuy_ent1_c14, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v), bare: true)),
          ForgeDsField(state: (_v[4] ?? '').toString().trim().isEmpty ? ForgeDsFieldState.empty : ForgeDsFieldState.filled, fields: [gen_app_panuy_ent1_c15, ''], control: DsField(label: gen_app_panuy_ent1_c15, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v), bare: true)),
          ForgeDsField(state: (_v[5] ?? '').toString().trim().isEmpty ? ForgeDsFieldState.empty : ForgeDsFieldState.filled, fields: [gen_app_panuy_ent1_c17, ''], control: DsField(label: gen_app_panuy_ent1_c17, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v), bare: true)),
          ForgeDsField(state: (_v[6] ?? '').toString().trim().isEmpty ? ForgeDsFieldState.empty : ForgeDsFieldState.filled, fields: [gen_app_panuy_ent1_c19, ''], control: DsField(label: gen_app_panuy_ent1_c19, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v), bare: true)),
          ForgeDsField(state: (_v[7] ?? '').toString().trim().isEmpty ? ForgeDsFieldState.empty : ForgeDsFieldState.filled, fields: [gen_app_panuy_ent1_c20, ''], control: DsField(label: gen_app_panuy_ent1_c20, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v), bare: true)),
          _calc(gen_app_panuy_ent1_c22, (num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0)),
          _calc(gen_app_panuy_ent1_c23, (num.tryParse(_v[3] ?? '') ?? 0)  -  (num.tryParse(_v[5] ?? '') ?? 0)),
          _calc(gen_app_panuy_ent1_c24, ( (num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0) ) * ( (num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0) ) * 12321 + ( (num.tryParse(_v[3] ?? '') ?? 0)  -  (num.tryParse(_v[5] ?? '') ?? 0) ) * ( (num.tryParse(_v[3] ?? '') ?? 0)  -  (num.tryParse(_v[5] ?? '') ?? 0) ) * 8649),
          _calc(gen_app_panuy_ent1_c25, sqrt( (num.tryParse(_v[10] ?? '') ?? 0) )),
          ForgeDsField(state: (_v[12] ?? '').toString().trim().isEmpty ? ForgeDsFieldState.empty : ForgeDsFieldState.filled, fields: [gen_app_panuy_ent1_c26, ''], control: DsField(label: gen_app_panuy_ent1_c26, hint: '', value: _v[12] ?? '', onChanged: (v) => setState(() => _v[12] = v), bare: true)),
          if (true) _live(gen_app_panuy_ent1_c27, boqLineAmount(<String, String>{gen_app_panuy_ent1_c28: (_v[7] ?? ''), gen_app_panuy_ent1_c29: (_v[6] ?? '')}).toString()),
        ]])),
        ForgeTitledSection(fields: [gen_app_panuy_ent1_c6, '', '', ''], child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [Align(alignment: Alignment.centerLeft, child: Row(mainAxisSize: MainAxisSize.min, children: [_viewBar(context), const SizedBox(width: 8), _csvBtn(context)])), ...[
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final all = (widget.scopeId == null ? appStore.records('app_panuy_ent1') : appStore.records('app_panuy_ent1').where((r) => (r[widget.scopeField ?? ''] ?? '') == widget.scopeId).toList());
              if (all.isEmpty) return const DsEmpty(label: gen_app_panuy_ent1_c7);
              final q = _q.trim().toLowerCase();
              final rs = q.isEmpty ? all : all.where((r) => r.entries.any((e) => !e.key.startsWith('__') && e.value.toLowerCase().contains(q))).toList();
              if (_view == 1) return ForgeDataGrid(bare: true, columns: const [gen_app_panuy_ent1_c9, gen_app_panuy_ent1_c10, gen_app_panuy_ent1_c13, gen_app_panuy_ent1_c14, gen_app_panuy_ent1_c15, gen_app_panuy_ent1_c17, gen_app_panuy_ent1_c19, gen_app_panuy_ent1_c20, gen_app_panuy_ent1_c22, gen_app_panuy_ent1_c23, gen_app_panuy_ent1_c24, gen_app_panuy_ent1_c25, gen_app_panuy_ent1_c26, gen_app_panuy_ent1_c27], items: rs.map((r) => [r[gen_app_panuy_ent1_c9] ?? '', r[gen_app_panuy_ent1_c10] ?? '', r[gen_app_panuy_ent1_c13] ?? '', r[gen_app_panuy_ent1_c14] ?? '', r[gen_app_panuy_ent1_c15] ?? '', r[gen_app_panuy_ent1_c17] ?? '', r[gen_app_panuy_ent1_c19] ?? '', r[gen_app_panuy_ent1_c20] ?? '', r[gen_app_panuy_ent1_c22] ?? '', r[gen_app_panuy_ent1_c23] ?? '', r[gen_app_panuy_ent1_c24] ?? '', r[gen_app_panuy_ent1_c25] ?? '', r[gen_app_panuy_ent1_c26] ?? '', boqLineAmount(<String, String>{gen_app_panuy_ent1_c30: (r[gen_app_panuy_ent1_c20] ?? ''), gen_app_panuy_ent1_c31: (r[gen_app_panuy_ent1_c19] ?? '')}).toString()]).toList());
              return Column(children: [
                ForgeDsSearch(control: DsSearch(value: _q, onChanged: (v) => setState(() => _q = v), bare: true)),
                if (rs.isEmpty) const DsEmpty(label: gen_app_panuy_ent1_c8),
                for (var i = 0; i < rs.length; i++)
                  _card(rs[i]),
              ]);
            },
          ),
        ]])),
      ]]);
  }
}
