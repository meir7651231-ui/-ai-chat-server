// ✨ חולל ע"י מנוע-ההרכבה (render-ds/detail) — בורר-רשומה ⇒ שדות + KPI-יחסים. אל תערוך ידנית.
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/callout.dart';
import '../dart-data-bs/auto/gen_app_rec3_content.dart';

class GenAppRec3Screen extends StatefulWidget {
  const GenAppRec3Screen({this.initialId, super.key});

  final String? initialId;   // רשומה-פתיחה מניווט (הקלקה על שורה); null ⇒ הראשונה.

  @override
  State<GenAppRec3Screen> createState() => _GenAppRec3ScreenState();
}

class _GenAppRec3ScreenState extends State<GenAppRec3Screen> {
  int? _sel;   // null ⇒ טרם-נבחר-ידנית (משתמשים ב-initialId).

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) {
          final recs = appStore.records('app_ent3');
          if (recs.isEmpty) return Center(child: Text(gen_app_rec3_c60));
          final i0 = _sel ?? (widget.initialId != null ? recs.indexWhere((r) => r['__id'] == widget.initialId) : 0);
          final i = (i0 < 0 ? 0 : i0).clamp(0, recs.length - 1);
          final r = recs[i];
          final id = r['__id'] ?? '';
          return ListView(
            padding: const EdgeInsets.only(bottom: 24, top: 8),
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: DropdownButton<int>(
                  value: i,
                  isExpanded: true,
                  items: [
                    for (var j = 0; j < recs.length; j++)
                      DropdownMenuItem(value: j, child: Text((recs[j][gen_app_rec3_c0] ?? '').isEmpty ? '#' + (j + 1).toString() : (recs[j][gen_app_rec3_c0] ?? ''))),
                  ],
                  onChanged: (v) { if (v != null) setState(() => _sel = v); },
                ),
              ),
              const SizedBox(height: 8),
              Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4), child: Callout(value: r[gen_app_rec3_c1] ?? '', label: gen_app_rec3_c2)),
              Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4), child: Callout(value: r[gen_app_rec3_c3] ?? '', label: gen_app_rec3_c4)),
              Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4), child: Callout(value: r[gen_app_rec3_c5] ?? '', label: gen_app_rec3_c6)),
              Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4), child: Callout(value: r[gen_app_rec3_c7] ?? '', label: gen_app_rec3_c8)),
              Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4), child: Callout(value: r[gen_app_rec3_c9] ?? '', label: gen_app_rec3_c10)),
              Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4), child: Callout(value: r[gen_app_rec3_c11] ?? '', label: gen_app_rec3_c12)),
              Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4), child: Callout(value: r[gen_app_rec3_c13] ?? '', label: gen_app_rec3_c14)),
              Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4), child: Callout(value: r[gen_app_rec3_c15] ?? '', label: gen_app_rec3_c16)),
              Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4), child: Callout(value: r[gen_app_rec3_c17] ?? '', label: gen_app_rec3_c18)),
              Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4), child: Callout(value: r[gen_app_rec3_c19] ?? '', label: gen_app_rec3_c20)),
              Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4), child: Callout(value: r[gen_app_rec3_c21] ?? '', label: gen_app_rec3_c22)),
              Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4), child: Callout(value: r[gen_app_rec3_c23] ?? '', label: gen_app_rec3_c24)),
              const SizedBox(height: 8),
              Padding(padding: const EdgeInsets.symmetric(horizontal: 12), child: Text(gen_app_rec3_c59, style: const TextStyle(fontWeight: FontWeight.w800))),
              Padding(
                padding: const EdgeInsets.all(12),
                child: Wrap(spacing: 10, runSpacing: 10, children: [
                Callout(value: appStore.countRef('app_ent1', gen_app_rec3_c25, id).toString(), label: gen_app_rec3_c26),
                Callout(value: appStore.countRef('app_ent6', gen_app_rec3_c27, id).toString(), label: gen_app_rec3_c28),
                Callout(value: appStore.countRef('app_ent7', gen_app_rec3_c29, id).toString(), label: gen_app_rec3_c30),
                Callout(value: appStore.countRef('app_ent8', gen_app_rec3_c31, id).toString(), label: gen_app_rec3_c32),
                Callout(value: appStore.countRef('app_ent9', gen_app_rec3_c33, id).toString(), label: gen_app_rec3_c34),
                Callout(value: appStore.countRef('app_ent11', gen_app_rec3_c35, id).toString(), label: gen_app_rec3_c36),
                Callout(value: appStore.countRef('app_ent14', gen_app_rec3_c37, id).toString(), label: gen_app_rec3_c38),
                Callout(value: appStore.countRef('app_ent17', gen_app_rec3_c39, id).toString(), label: gen_app_rec3_c40),
                Callout(value: appStore.countRef('app_ent18', gen_app_rec3_c41, id).toString(), label: gen_app_rec3_c42),
                Callout(value: appStore.countRef('app_ent19', gen_app_rec3_c43, id).toString(), label: gen_app_rec3_c44),
                Callout(value: appStore.countRef('app_ent20', gen_app_rec3_c45, id).toString(), label: gen_app_rec3_c46),
                Callout(value: appStore.countRef('app_ent21', gen_app_rec3_c47, id).toString(), label: gen_app_rec3_c48),
                Callout(value: appStore.countRef('app_ent24', gen_app_rec3_c49, id).toString(), label: gen_app_rec3_c50),
                Callout(value: appStore.countRef('app_ent26', gen_app_rec3_c51, id).toString(), label: gen_app_rec3_c52),
                Callout(value: appStore.countRef('app_ent27', gen_app_rec3_c53, id).toString(), label: gen_app_rec3_c54),
                Callout(value: appStore.countRef('app_ent28', gen_app_rec3_c55, id).toString(), label: gen_app_rec3_c56),
                Callout(value: appStore.countRef('app_ent29', gen_app_rec3_c57, id).toString(), label: gen_app_rec3_c58),
                ]),
              ),
            ],
          );
        },
      );
}
