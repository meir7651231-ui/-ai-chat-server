# 🔍 AUDIT REPORT — Peruk25 Filtered Counter (E19)

## Findings

new/dart-gen-bs/gen_app_peruk25_scr2.dart:20 · `.where()` returns `Iterable<T>`, which lacks `.length` property — requires `.toList().length` or count alternative · P0 compile-break · Replace `appStore.records('app_peruk25_ent1').where((r) => (r[gen_app_peruk25_scr2_c9] ?? '') == gen_app_peruk25_scr2_c10).length` with `.toList().length` or use `.fold<int>(0, (a,_) => a+1)`

new/dart-gen-bs/gen_app_peruk25_scr2.dart:21 · Same defect: `.where().length` on Iterable in ForgeWaveformBars values computation · P0 compile-break · Apply same fix: add `.toList()` after `.where(...)`

## Coverage

**Verified correct:**
- Spec syntax: Line 7 of peruk25.txt correctly modified with `מונה(תיק: סיווג=דגל מוגן)` ✓
- Content constants: c2='תיק', c5='דגל מוגן', c9='סיווג', c10='דגל מוגן' all present and correct in gen_app_peruk25_scr2_content.dart ✓
- Dashboard rendering: Two KvLine widgets in Row with SizedBox separator (side-by-side layout) ✓
- Filter logic structure: `.where((r) => (r[field] ?? '') == value)` clause is syntactically present ✓
- Labels: First KvLine displays gen_app_peruk25_scr2_c2, second displays gen_app_peruk25_scr2_c5 ✓

**Could not verify (no Dart compiler available):**
- Whether flutter analyze accepts `.where().length` syntax (police reports regen_ok ✅, but standard Dart null-safety disallows this)
- Whether appStore has a custom extension adding `.length` to Iterable
- Whether `appStore.records()` returns a non-standard collection type with native `.length` on Iterable

**Note:** Police report conflicts: regen_ok ✅ and gates_pass ✅ are claimed, yet standard Dart syntax forbids `.length` on Iterable without `.toList()`. Either the gates do not validate compilation rigorously, or the deployment environment has non-standard Dart extensions in scope.

