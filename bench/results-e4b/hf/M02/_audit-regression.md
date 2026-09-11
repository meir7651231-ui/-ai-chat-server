# 🔍 Audit: peruk12 בדיקה entity + dashboard counter

## Findings

**new/dart-gen-bs/gen_app_peruk12_scr3.dart:21** · Dashboard counter label incomplete · **P1 wrong result** · Change `gen_app_peruk12_scr3_c5` to `gen_app_peruk12_scr3_c6` for counter label. Currently shows 'לא' but should show 'בדיקה · לא' to describe what's being counted (בדיקה records where תקין=לא). The counter logic is correct (`appStore.records('app_peruk12_ent2').where((r) => (r[gen_app_peruk12_scr3_c9] ?? '') == gen_app_peruk12_scr3_c10)` correctly filters for תקין='לא'), but label is ambiguous to user.

**new/dart-gen-bs/gen_app_peruk12_scr3.dart:22** · Dashboard bars missing field labels · **P1 wrong result** · Change `fields: ['', '']` to `fields: [gen_app_peruk12_scr3_c2, gen_app_peruk12_scr3_c6]` (or similar content constants). Chart rendering won't have legend/axis labels, breaking visualization clarity. First bar shows תיק count, second bar shows בדיקה count where תקין=לא, but empty fields leave chart unlabeled.

## Verified correct

✅ **Entity structure**: בדיקה entity properly defined in peruk12.json with ent2 slug; fields mapped correctly in gen_app_peruk12_ent2_content.dart (c9=תיק link, c10=מה נבדק, c11=תקין enum).

✅ **Field validation**: gen_app_peruk12_ent2.dart correctly validates תיק (c9) and מה נבדק (c10) as required; תקין (c11) optional enum with ['כן', 'לא'].

✅ **Counter logic**: Line 21 counter correctly counts `appStore.records('app_peruk12_ent2').where((r) => (r['תקין'] ?? '') == 'לא').length` — proper syntax, correct entity, correct field filtering.

✅ **Particle table screen**: gen_app_peruk12_px2.dart properly generates table (ForgeDataGrid), add action (DsChipButton), empty state for בדיקה entity; scoped to parent תיק correctly.

✅ **No regressions**: Only peruk12.json, particle-plan-peruk12.json/md, LEARNINGS.md modified in diff; no other app specs touched; byte-identical check in police report confirms no unintended cross-app changes.

✅ **No orphans**: All gen_app_peruk12_*.dart files belong to peruk12 app (ent1 + ent2 + home/shell/root/dashboard/report/hub/px/flags/audit/behavior/main/settings).

✅ **Compilation**: Reported 0 analyzer errors in _police.md; code uses sound null safety (`.where()`, `?? ''` defaults).

✅ **No state-leakage**: No mutations to shared lists (gates.tsv, pins.sha256, apps/*.json for other apps); entity relation is clean link field on בדיקה → תיק.

## Coverage

Checked: label constants from content files, dashboard counter logic and syntax, entity/field definitions, particle generation, table/action/empty-state wiring, regression scope (diff limited to peruk12), compilation status, generated Dart null-safety patterns.

NOT checked: runtime behavior (would need Flutter emulator), CSS/theme rendering of empty chart labels, accessibility of label text.
