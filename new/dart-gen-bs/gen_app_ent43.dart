// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent43_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';

import 'package:flutter/material.dart';

class GenAppEnt43Screen extends StatefulWidget {
  const GenAppEnt43Screen({super.key});

  @override
  State<GenAppEnt43Screen> createState() => _GenAppEnt43ScreenState();
}

class _GenAppEnt43ScreenState extends State<GenAppEnt43Screen> {
  final Map<int, String> _v = {};

  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    appStore.add(gen_app_ent43_c7, <String, String>{gen_app_ent43_c8: _v[0] ?? '', gen_app_ent43_c10: _v[1] ?? '', gen_app_ent43_c11: _v[2] ?? '', gen_app_ent43_c12: _v[3] ?? '', gen_app_ent43_c13: _v[4] ?? '', gen_app_ent43_c14: _v[5] ?? '', gen_app_ent43_c15: _v[6] ?? '', gen_app_ent43_c16: _v[7] ?? '', gen_app_ent43_c18: _v[8] ?? ''});
    setState(() => _v.clear());
  }

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_ent43_c0,
      subtitle: gen_app_ent43_c1,
      icon: gen_app_ent43_c2,
      bottomBar: DsPrimaryButton(label: gen_app_ent43_c3, onTap: _save),
      children: [
        DsSection(title: gen_app_ent43_c4, children: [
          DsSelect(label: gen_app_ent43_c8, entity: gen_app_ent43_c9, value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_ent43_c10, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsField(label: gen_app_ent43_c11, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent43_c12, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent43_c13, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent43_c14, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsField(label: gen_app_ent43_c15, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsSelect(label: gen_app_ent43_c16, entity: gen_app_ent43_c17, value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsField(label: gen_app_ent43_c18, hint: '', value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
        ]),
        DsSection(title: gen_app_ent43_c5, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final rs = appStore.records(gen_app_ent43_c7);
              if (rs.isEmpty) return const DsEmpty(label: gen_app_ent43_c6);
              return Column(children: [
                for (var i = 0; i < rs.length; i++)
                  DsRecordCard(labels: const [gen_app_ent43_c8, gen_app_ent43_c10, gen_app_ent43_c11, gen_app_ent43_c12, gen_app_ent43_c13, gen_app_ent43_c14, gen_app_ent43_c15, gen_app_ent43_c16, gen_app_ent43_c18], values: [rs[i][gen_app_ent43_c8] ?? '', rs[i][gen_app_ent43_c10] ?? '', rs[i][gen_app_ent43_c11] ?? '', rs[i][gen_app_ent43_c12] ?? '', rs[i][gen_app_ent43_c13] ?? '', rs[i][gen_app_ent43_c14] ?? '', rs[i][gen_app_ent43_c15] ?? '', rs[i][gen_app_ent43_c16] ?? '', rs[i][gen_app_ent43_c18] ?? '']),
              ]);
            },
          ),
        ]),
      ],
    );
  }
}
