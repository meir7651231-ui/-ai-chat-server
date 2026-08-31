// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent49_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';

import 'package:flutter/material.dart';

class GenAppEnt49Screen extends StatefulWidget {
  const GenAppEnt49Screen({super.key});

  @override
  State<GenAppEnt49Screen> createState() => _GenAppEnt49ScreenState();
}

class _GenAppEnt49ScreenState extends State<GenAppEnt49Screen> {
  final Map<int, String> _v = {};

  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    appStore.add(gen_app_ent49_c7, <String, String>{gen_app_ent49_c8: _v[0] ?? '', gen_app_ent49_c10: _v[1] ?? '', gen_app_ent49_c12: _v[2] ?? '', gen_app_ent49_c14: _v[3] ?? '', gen_app_ent49_c15: _v[4] ?? '', gen_app_ent49_c16: _v[5] ?? '', gen_app_ent49_c17: _v[6] ?? ''});
    setState(() => _v.clear());
  }

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_ent49_c0,
      subtitle: gen_app_ent49_c1,
      icon: gen_app_ent49_c2,
      bottomBar: DsPrimaryButton(label: gen_app_ent49_c3, onTap: _save),
      children: [
        DsSection(title: gen_app_ent49_c4, children: [
          DsSelect(label: gen_app_ent49_c8, entity: gen_app_ent49_c9, value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsSelect(label: gen_app_ent49_c10, entity: gen_app_ent49_c11, value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsSelect(label: gen_app_ent49_c12, entity: gen_app_ent49_c13, value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent49_c14, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent49_c15, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent49_c16, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsField(label: gen_app_ent49_c17, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
        ]),
        DsSection(title: gen_app_ent49_c5, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final rs = appStore.records(gen_app_ent49_c7);
              if (rs.isEmpty) return const DsEmpty(label: gen_app_ent49_c6);
              return Column(children: [
                for (var i = 0; i < rs.length; i++)
                  DsRecordCard(labels: const [gen_app_ent49_c8, gen_app_ent49_c10, gen_app_ent49_c12, gen_app_ent49_c14, gen_app_ent49_c15, gen_app_ent49_c16, gen_app_ent49_c17], values: [rs[i][gen_app_ent49_c8] ?? '', rs[i][gen_app_ent49_c10] ?? '', rs[i][gen_app_ent49_c12] ?? '', rs[i][gen_app_ent49_c14] ?? '', rs[i][gen_app_ent49_c15] ?? '', rs[i][gen_app_ent49_c16] ?? '', rs[i][gen_app_ent49_c17] ?? '']),
              ]);
            },
          ),
        ]),
      ],
    );
  }
}
