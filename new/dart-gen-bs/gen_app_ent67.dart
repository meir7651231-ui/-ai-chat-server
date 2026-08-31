// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent67_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';

import 'package:flutter/material.dart';

class GenAppEnt67Screen extends StatefulWidget {
  const GenAppEnt67Screen({super.key});

  @override
  State<GenAppEnt67Screen> createState() => _GenAppEnt67ScreenState();
}

class _GenAppEnt67ScreenState extends State<GenAppEnt67Screen> {
  final Map<int, String> _v = {};

  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    appStore.add(gen_app_ent67_c7, <String, String>{gen_app_ent67_c8: _v[0] ?? '', gen_app_ent67_c9: _v[1] ?? '', gen_app_ent67_c11: _v[2] ?? '', gen_app_ent67_c12: _v[3] ?? '', gen_app_ent67_c13: _v[4] ?? '', gen_app_ent67_c14: _v[5] ?? '', gen_app_ent67_c15: _v[6] ?? '', gen_app_ent67_c16: _v[7] ?? '', gen_app_ent67_c17: _v[8] ?? '', gen_app_ent67_c18: _v[9] ?? '', gen_app_ent67_c19: _v[10] ?? '', '__stage': '0'});
    setState(() => _v.clear());
  }

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_ent67_c0,
      subtitle: gen_app_ent67_c1,
      icon: gen_app_ent67_c2,
      bottomBar: DsPrimaryButton(label: gen_app_ent67_c3, onTap: _save),
      children: [
        DsWorkflow(steps: const [gen_app_ent67_c20, gen_app_ent67_c21, gen_app_ent67_c22, gen_app_ent67_c23], current: 0),
        DsSection(title: gen_app_ent67_c4, children: [
          DsField(label: gen_app_ent67_c8, hint: '', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsSelect(label: gen_app_ent67_c9, entity: gen_app_ent67_c10, value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsField(label: gen_app_ent67_c11, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent67_c12, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent67_c13, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent67_c14, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsField(label: gen_app_ent67_c15, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsField(label: gen_app_ent67_c16, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsField(label: gen_app_ent67_c17, hint: '', value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
          DsField(label: gen_app_ent67_c18, hint: '', value: _v[9] ?? '', onChanged: (v) => setState(() => _v[9] = v)),
          DsField(label: gen_app_ent67_c19, hint: '', value: _v[10] ?? '', onChanged: (v) => setState(() => _v[10] = v)),
        ]),
        DsSection(title: gen_app_ent67_c5, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final rs = appStore.records(gen_app_ent67_c7);
              if (rs.isEmpty) return const DsEmpty(label: gen_app_ent67_c6);
              return Column(children: [
                for (var i = 0; i < rs.length; i++)
                  DsRecordCard(labels: const [gen_app_ent67_c8, gen_app_ent67_c9, gen_app_ent67_c11, gen_app_ent67_c12, gen_app_ent67_c13, gen_app_ent67_c14, gen_app_ent67_c15, gen_app_ent67_c16, gen_app_ent67_c17, gen_app_ent67_c18, gen_app_ent67_c19], values: [rs[i][gen_app_ent67_c8] ?? '', rs[i][gen_app_ent67_c9] ?? '', rs[i][gen_app_ent67_c11] ?? '', rs[i][gen_app_ent67_c12] ?? '', rs[i][gen_app_ent67_c13] ?? '', rs[i][gen_app_ent67_c14] ?? '', rs[i][gen_app_ent67_c15] ?? '', rs[i][gen_app_ent67_c16] ?? '', rs[i][gen_app_ent67_c17] ?? '', rs[i][gen_app_ent67_c18] ?? '', rs[i][gen_app_ent67_c19] ?? ''], stage: (const [gen_app_ent67_c20, gen_app_ent67_c21, gen_app_ent67_c22, gen_app_ent67_c23])[appStore.stageOf(gen_app_ent67_c7, i)], stageDone: appStore.stageOf(gen_app_ent67_c7, i) >= 3, onAdvance: () => appStore.advance(gen_app_ent67_c7, i, 4)),
              ]);
            },
          ),
        ]),
      ],
    );
  }
}
