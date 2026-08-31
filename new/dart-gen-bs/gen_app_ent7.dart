// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מסך-חי מחווט (טופס→קשרים→מסע→חנות→טבלה + לוגיקה). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_ent7_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_select.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-maor/norm-email.dart';
import 'package:flutter/material.dart';

class GenAppEnt7Screen extends StatefulWidget {
  const GenAppEnt7Screen({super.key});

  @override
  State<GenAppEnt7Screen> createState() => _GenAppEnt7ScreenState();
}

class _GenAppEnt7ScreenState extends State<GenAppEnt7Screen> {
  final Map<int, String> _v = {};

  void _save() {
    if (_v.values.where((x) => x.trim().isNotEmpty).isEmpty) return;
    appStore.add(gen_app_ent7_c7, <String, String>{gen_app_ent7_c8: _v[0] ?? '', gen_app_ent7_c9: _v[1] ?? '', gen_app_ent7_c10: _v[2] ?? '', gen_app_ent7_c11: _v[3] ?? '', gen_app_ent7_c13: _v[4] ?? '', gen_app_ent7_c14: _v[5] ?? '', gen_app_ent7_c16: _v[6] ?? '', gen_app_ent7_c17: _v[7] ?? '', gen_app_ent7_c18: _v[8] ?? '', gen_app_ent7_c20: _v[9] ?? '', gen_app_ent7_c22: _v[10] ?? '', gen_app_ent7_c24: _v[11] ?? '', gen_app_ent7_c26: _v[12] ?? '', gen_app_ent7_c27: _v[13] ?? '', gen_app_ent7_c28: _v[14] ?? '', gen_app_ent7_c29: _v[15] ?? '', gen_app_ent7_c30: _v[16] ?? '', '__stage': '0'});
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
      title: gen_app_ent7_c0,
      subtitle: gen_app_ent7_c1,
      icon: gen_app_ent7_c2,
      bottomBar: DsPrimaryButton(label: gen_app_ent7_c3, onTap: _save),
      children: [
        DsWorkflow(steps: const [gen_app_ent7_c31, gen_app_ent7_c32, gen_app_ent7_c33, gen_app_ent7_c34, gen_app_ent7_c35, gen_app_ent7_c36, gen_app_ent7_c37, gen_app_ent7_c38], current: 0),
        DsSection(title: gen_app_ent7_c4, children: [
          DsField(label: gen_app_ent7_c8, hint: '', value: _v[0] ?? '', onChanged: (v) => setState(() => _v[0] = v)),
          DsField(label: gen_app_ent7_c9, hint: '', value: _v[1] ?? '', onChanged: (v) => setState(() => _v[1] = v)),
          DsField(label: gen_app_ent7_c10, hint: '', value: _v[2] ?? '', onChanged: (v) => setState(() => _v[2] = v)),
          DsSelect(label: gen_app_ent7_c11, entity: gen_app_ent7_c12, value: _v[3] ?? '', onChanged: (v) => setState(() => _v[3] = v)),
          DsField(label: gen_app_ent7_c13, hint: '', value: _v[4] ?? '', onChanged: (v) => setState(() => _v[4] = v)),
          DsField(label: gen_app_ent7_c14, hint: '', value: _v[5] ?? '', onChanged: (v) => setState(() => _v[5] = v)),
          if ((_v[5] ?? '').trim().isNotEmpty) _live(gen_app_ent7_c15, normEmail((_v[5] ?? ''))),
          DsField(label: gen_app_ent7_c16, hint: '', value: _v[6] ?? '', onChanged: (v) => setState(() => _v[6] = v)),
          DsField(label: gen_app_ent7_c17, hint: '', value: _v[7] ?? '', onChanged: (v) => setState(() => _v[7] = v)),
          DsSelect(label: gen_app_ent7_c18, entity: gen_app_ent7_c19, value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v)),
          DsSelect(label: gen_app_ent7_c20, entity: gen_app_ent7_c21, value: _v[9] ?? '', onChanged: (v) => setState(() => _v[9] = v)),
          DsSelect(label: gen_app_ent7_c22, entity: gen_app_ent7_c23, value: _v[10] ?? '', onChanged: (v) => setState(() => _v[10] = v)),
          DsSelect(label: gen_app_ent7_c24, entity: gen_app_ent7_c25, value: _v[11] ?? '', onChanged: (v) => setState(() => _v[11] = v)),
          DsField(label: gen_app_ent7_c26, hint: '', value: _v[12] ?? '', onChanged: (v) => setState(() => _v[12] = v)),
          DsField(label: gen_app_ent7_c27, hint: '', value: _v[13] ?? '', onChanged: (v) => setState(() => _v[13] = v)),
          DsField(label: gen_app_ent7_c28, hint: '', value: _v[14] ?? '', onChanged: (v) => setState(() => _v[14] = v)),
          DsField(label: gen_app_ent7_c29, hint: '', value: _v[15] ?? '', onChanged: (v) => setState(() => _v[15] = v)),
          DsField(label: gen_app_ent7_c30, hint: '', value: _v[16] ?? '', onChanged: (v) => setState(() => _v[16] = v)),
        ]),
        DsSection(title: gen_app_ent7_c5, children: [
          AnimatedBuilder(
            animation: appStore,
            builder: (context, _) {
              final rs = appStore.records(gen_app_ent7_c7);
              if (rs.isEmpty) return const DsEmpty(label: gen_app_ent7_c6);
              return Column(children: [
                for (var i = 0; i < rs.length; i++)
                  DsRecordCard(labels: const [gen_app_ent7_c8, gen_app_ent7_c9, gen_app_ent7_c10, gen_app_ent7_c11, gen_app_ent7_c13, gen_app_ent7_c14, gen_app_ent7_c16, gen_app_ent7_c17, gen_app_ent7_c18, gen_app_ent7_c20, gen_app_ent7_c22, gen_app_ent7_c24, gen_app_ent7_c26, gen_app_ent7_c27, gen_app_ent7_c28, gen_app_ent7_c29, gen_app_ent7_c30], values: [rs[i][gen_app_ent7_c8] ?? '', rs[i][gen_app_ent7_c9] ?? '', rs[i][gen_app_ent7_c10] ?? '', rs[i][gen_app_ent7_c11] ?? '', rs[i][gen_app_ent7_c13] ?? '', rs[i][gen_app_ent7_c14] ?? '', rs[i][gen_app_ent7_c16] ?? '', rs[i][gen_app_ent7_c17] ?? '', rs[i][gen_app_ent7_c18] ?? '', rs[i][gen_app_ent7_c20] ?? '', rs[i][gen_app_ent7_c22] ?? '', rs[i][gen_app_ent7_c24] ?? '', rs[i][gen_app_ent7_c26] ?? '', rs[i][gen_app_ent7_c27] ?? '', rs[i][gen_app_ent7_c28] ?? '', rs[i][gen_app_ent7_c29] ?? '', rs[i][gen_app_ent7_c30] ?? ''], stage: (const [gen_app_ent7_c31, gen_app_ent7_c32, gen_app_ent7_c33, gen_app_ent7_c34, gen_app_ent7_c35, gen_app_ent7_c36, gen_app_ent7_c37, gen_app_ent7_c38])[appStore.stageOf(gen_app_ent7_c7, i)], stageDone: appStore.stageOf(gen_app_ent7_c7, i) >= 7, onAdvance: () => appStore.advance(gen_app_ent7_c7, i, 8)),
              ]);
            },
          ),
        ]),
      ],
    );
  }
}
