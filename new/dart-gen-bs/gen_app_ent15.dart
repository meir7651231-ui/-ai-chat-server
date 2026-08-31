// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent15_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_store.dart';

import 'package:flutter/material.dart';

class GenAppEnt15Screen extends StatefulWidget {
  const GenAppEnt15Screen({super.key});

  @override
  State<GenAppEnt15Screen> createState() => _GenAppEnt15ScreenState();
}

class _GenAppEnt15ScreenState extends State<GenAppEnt15Screen> {
  final Map<int, String> _v = {};

  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    appStore.add(gen_app_ent15_c7, <String, String>{gen_app_ent15_c8: _v[0] ?? '', gen_app_ent15_c9: _v[1] ?? '', gen_app_ent15_c10: _v[2] ?? '', gen_app_ent15_c11: _v[3] ?? '', gen_app_ent15_c12: _v[4] ?? '', gen_app_ent15_c13: _v[5] ?? '', gen_app_ent15_c14: _v[6] ?? '', gen_app_ent15_c15: _v[7] ?? '', gen_app_ent15_c16: _v[8] ?? '', gen_app_ent15_c17: _v[9] ?? '', gen_app_ent15_c18: _v[10] ?? '', gen_app_ent15_c19: _v[11] ?? '', gen_app_ent15_c20: _v[12] ?? ''});
    setState(() => _v.clear());
  }

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_ent15_c0,
      subtitle: gen_app_ent15_c1,
      icon: gen_app_ent15_c2,
      bottomBar: DsPrimaryButton(label: gen_app_ent15_c3, onTap: _save),
      children: [
        DsSection(title: gen_app_ent15_c4, children: [
          DsField(label: gen_app_ent15_c8, hint: '', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_ent15_c9, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsField(label: gen_app_ent15_c10, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsField(label: gen_app_ent15_c11, hint: '', value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent15_c12, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent15_c13, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          DsField(label: gen_app_ent15_c14, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsField(label: gen_app_ent15_c15, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsField(label: gen_app_ent15_c16, hint: '', value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
          DsField(label: gen_app_ent15_c17, hint: '', value: _v[9] ?? '', onChanged: (v) => setState(() => _v[9] = v)),
          DsField(label: gen_app_ent15_c18, hint: '', value: _v[10] ?? '', onChanged: (v) => setState(() => _v[10] = v)),
          DsField(label: gen_app_ent15_c19, hint: '', value: _v[11] ?? '', onChanged: (v) => setState(() => _v[11] = v)),
          DsField(label: gen_app_ent15_c20, hint: '', value: _v[12] ?? '', onChanged: (v) => setState(() => _v[12] = v)),
        ]),
        DsSection(title: gen_app_ent15_c5, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final rs = appStore.records(gen_app_ent15_c7);
              if (rs.isEmpty) return const DsEmpty(label: gen_app_ent15_c6);
              return Column(children: [
                for (final r in rs)
                  DsRecordCard(labels: const [gen_app_ent15_c8, gen_app_ent15_c9, gen_app_ent15_c10, gen_app_ent15_c11, gen_app_ent15_c12, gen_app_ent15_c13, gen_app_ent15_c14, gen_app_ent15_c15, gen_app_ent15_c16, gen_app_ent15_c17, gen_app_ent15_c18, gen_app_ent15_c19, gen_app_ent15_c20], values: [r[gen_app_ent15_c8] ?? '', r[gen_app_ent15_c9] ?? '', r[gen_app_ent15_c10] ?? '', r[gen_app_ent15_c11] ?? '', r[gen_app_ent15_c12] ?? '', r[gen_app_ent15_c13] ?? '', r[gen_app_ent15_c14] ?? '', r[gen_app_ent15_c15] ?? '', r[gen_app_ent15_c16] ?? '', r[gen_app_ent15_c17] ?? '', r[gen_app_ent15_c18] ?? '', r[gen_app_ent15_c19] ?? '', r[gen_app_ent15_c20] ?? '']),
              ]);
            },
          ),
        ]),
      ],
    );
  }
}
