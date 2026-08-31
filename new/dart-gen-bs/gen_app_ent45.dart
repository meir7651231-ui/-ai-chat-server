// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent45_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/amount-in-words.dart';
import '../dart-maor/fmt-date.dart';
import 'package:flutter/material.dart';

class GenAppEnt45Screen extends StatefulWidget {
  const GenAppEnt45Screen({super.key});

  @override
  State<GenAppEnt45Screen> createState() => _GenAppEnt45ScreenState();
}

class _GenAppEnt45ScreenState extends State<GenAppEnt45Screen> {
  final Map<int, String> _v = {};

  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    appStore.add(gen_app_ent45_c7, <String, String>{gen_app_ent45_c8: _v[0] ?? '', gen_app_ent45_c9: _v[1] ?? '', gen_app_ent45_c11: _v[2] ?? '', gen_app_ent45_c13: _v[3] ?? '', gen_app_ent45_c15: _v[4] ?? '', gen_app_ent45_c17: _v[5] ?? '', gen_app_ent45_c18: _v[6] ?? '', gen_app_ent45_c20: _v[7] ?? '', gen_app_ent45_c21: _v[8] ?? '', gen_app_ent45_c23: _v[9] ?? '', gen_app_ent45_c25: _v[10] ?? '', gen_app_ent45_c26: _v[11] ?? '', gen_app_ent45_c28: _v[12] ?? '', '__stage': '0'});
    setState(() => _v.clear());
  }

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
      title: gen_app_ent45_c0,
      subtitle: gen_app_ent45_c1,
      icon: gen_app_ent45_c2,
      bottomBar: DsPrimaryButton(label: gen_app_ent45_c3, onTap: _save),
      children: [
        DsWorkflow(steps: const [gen_app_ent45_c29, gen_app_ent45_c30, gen_app_ent45_c31, gen_app_ent45_c32], current: 0),
        DsSection(title: gen_app_ent45_c4, children: [
          DsField(label: gen_app_ent45_c8, hint: '', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsSelect(label: gen_app_ent45_c9, entity: gen_app_ent45_c10, value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsSelect(label: gen_app_ent45_c11, entity: gen_app_ent45_c12, value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsSelect(label: gen_app_ent45_c13, entity: gen_app_ent45_c14, value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent45_c15, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          if ((_v[4] ?? '').trim().isNotEmpty) _live(gen_app_ent45_c16, amountInWords((_v[4] ?? ''))),
          DsField(label: gen_app_ent45_c17, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsSelect(label: gen_app_ent45_c18, entity: gen_app_ent45_c19, value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsField(label: gen_app_ent45_c20, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsField(label: gen_app_ent45_c21, hint: '', value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
          if ((_v[8] ?? '').trim().isNotEmpty) _live(gen_app_ent45_c22, fmtDate((_v[8] ?? ''))),
          DsField(label: gen_app_ent45_c23, hint: '', value: _v[9] ?? '', onChanged: (v) => setState(() => _v[9] = v)),
          if ((_v[9] ?? '').trim().isNotEmpty) _live(gen_app_ent45_c24, fmtDate((_v[9] ?? ''))),
          DsField(label: gen_app_ent45_c25, hint: '', value: _v[10] ?? '', onChanged: (v) => setState(() => _v[10] = v)),
          DsSelect(label: gen_app_ent45_c26, entity: gen_app_ent45_c27, value: _v[11] ?? '', onChanged: (v) => setState(() => _v[11] = v)),
          DsField(label: gen_app_ent45_c28, hint: '', value: _v[12] ?? '', onChanged: (v) => setState(() => _v[12] = v)),
        ]),
        DsSection(title: gen_app_ent45_c5, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final rs = appStore.records(gen_app_ent45_c7);
              if (rs.isEmpty) return const DsEmpty(label: gen_app_ent45_c6);
              return Column(children: [
                for (var i = 0; i < rs.length; i++)
                  DsRecordCard(labels: const [gen_app_ent45_c8, gen_app_ent45_c9, gen_app_ent45_c11, gen_app_ent45_c13, gen_app_ent45_c15, gen_app_ent45_c17, gen_app_ent45_c18, gen_app_ent45_c20, gen_app_ent45_c21, gen_app_ent45_c23, gen_app_ent45_c25, gen_app_ent45_c26, gen_app_ent45_c28], values: [rs[i][gen_app_ent45_c8] ?? '', rs[i][gen_app_ent45_c9] ?? '', rs[i][gen_app_ent45_c11] ?? '', rs[i][gen_app_ent45_c13] ?? '', rs[i][gen_app_ent45_c15] ?? '', rs[i][gen_app_ent45_c17] ?? '', rs[i][gen_app_ent45_c18] ?? '', rs[i][gen_app_ent45_c20] ?? '', rs[i][gen_app_ent45_c21] ?? '', rs[i][gen_app_ent45_c23] ?? '', rs[i][gen_app_ent45_c25] ?? '', rs[i][gen_app_ent45_c26] ?? '', rs[i][gen_app_ent45_c28] ?? ''], stage: (const [gen_app_ent45_c29, gen_app_ent45_c30, gen_app_ent45_c31, gen_app_ent45_c32])[appStore.stageOf(gen_app_ent45_c7, i)], stageDone: appStore.stageOf(gen_app_ent45_c7, i) >= 3, onAdvance: () => appStore.advance(gen_app_ent45_c7, i, 4)),
              ]);
            },
          ),
        ]),
      ],
    );
  }
}
