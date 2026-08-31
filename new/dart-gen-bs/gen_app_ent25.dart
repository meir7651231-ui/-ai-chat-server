// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent25_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';

import 'package:flutter/material.dart';

class GenAppEnt25Screen extends StatefulWidget {
  const GenAppEnt25Screen({super.key});

  @override
  State<GenAppEnt25Screen> createState() => _GenAppEnt25ScreenState();
}

class _GenAppEnt25ScreenState extends State<GenAppEnt25Screen> {
  final Map<int, String> _v = {};

  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    appStore.add(gen_app_ent25_c7, <String, String>{gen_app_ent25_c8: _v[0] ?? '', gen_app_ent25_c10: _v[1] ?? '', gen_app_ent25_c12: _v[2] ?? '', gen_app_ent25_c13: _v[3] ?? '', gen_app_ent25_c14: _v[4] ?? '', gen_app_ent25_c15: _v[5] ?? '', gen_app_ent25_c16: _v[6] ?? '', gen_app_ent25_c17: _v[7] ?? '', gen_app_ent25_c18: _v[8] ?? '', gen_app_ent25_c19: _v[9] ?? '', gen_app_ent25_c20: _v[10] ?? '', '__stage': '0'});
    setState(() => _v.clear());
  }

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_ent25_c0,
      subtitle: gen_app_ent25_c1,
      icon: gen_app_ent25_c2,
      bottomBar: DsPrimaryButton(label: gen_app_ent25_c3, onTap: _save),
      children: [
        DsWorkflow(steps: const [gen_app_ent25_c21, gen_app_ent25_c22], current: 0),
        DsSection(title: gen_app_ent25_c4, children: [
          DsSelect(label: gen_app_ent25_c8, entity: gen_app_ent25_c9, value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsSelect(label: gen_app_ent25_c10, entity: gen_app_ent25_c11, value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsField(label: gen_app_ent25_c12, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent25_c13, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent25_c14, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent25_c15, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsField(label: gen_app_ent25_c16, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsField(label: gen_app_ent25_c17, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsField(label: gen_app_ent25_c18, hint: '', value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
          DsField(label: gen_app_ent25_c19, hint: '', value: _v[9] ?? '', onChanged: (v) => setState(() => _v[9] = v)),
          DsField(label: gen_app_ent25_c20, hint: '', value: _v[10] ?? '', onChanged: (v) => setState(() => _v[10] = v)),
        ]),
        DsSection(title: gen_app_ent25_c5, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final rs = appStore.records(gen_app_ent25_c7);
              if (rs.isEmpty) return const DsEmpty(label: gen_app_ent25_c6);
              return Column(children: [
                for (var i = 0; i < rs.length; i++)
                  DsRecordCard(labels: const [gen_app_ent25_c8, gen_app_ent25_c10, gen_app_ent25_c12, gen_app_ent25_c13, gen_app_ent25_c14, gen_app_ent25_c15, gen_app_ent25_c16, gen_app_ent25_c17, gen_app_ent25_c18, gen_app_ent25_c19, gen_app_ent25_c20], values: [rs[i][gen_app_ent25_c8] ?? '', rs[i][gen_app_ent25_c10] ?? '', rs[i][gen_app_ent25_c12] ?? '', rs[i][gen_app_ent25_c13] ?? '', rs[i][gen_app_ent25_c14] ?? '', rs[i][gen_app_ent25_c15] ?? '', rs[i][gen_app_ent25_c16] ?? '', rs[i][gen_app_ent25_c17] ?? '', rs[i][gen_app_ent25_c18] ?? '', rs[i][gen_app_ent25_c19] ?? '', rs[i][gen_app_ent25_c20] ?? ''], stage: (const [gen_app_ent25_c21, gen_app_ent25_c22])[appStore.stageOf(gen_app_ent25_c7, i)], stageDone: appStore.stageOf(gen_app_ent25_c7, i) >= 1, onAdvance: () => appStore.advance(gen_app_ent25_c7, i, 2)),
              ]);
            },
          ),
        ]),
      ],
    );
  }
}
