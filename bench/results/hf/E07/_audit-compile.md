# Auditor: compile-edge-crash lens — peruk21 counter

## Findings

new/dart-gen-bs/gen_app_peruk21_px1.dart:35 · `.where(...).length` on Iterable (no .toList()) — P0 compile-break · insert `.toList()` before `.length`: `.where((r) => ...).toList().length`

## Coverage

**Checked:**
- Counter particle wiring in px1.dart (line 35): expression uses `appStore.records('app_peruk21_ent1').where(...).length.toDouble().toStringAsFixed(0)`
- Dart API: `records()` returns `List<Map<String, String>>` (ds_store.dart:124). Calling `.where()` on a List returns `Iterable<T>`, which does NOT have `.length` property in Dart.
- Consistent pattern in codebase (schoolos_parents.dart lines 330, 577–578) also uses `.where(...).length` without `.toList()`, suggesting systemic issue or undeclared extension.
- Constants for counter (c79='דחופים', c81='סיווג', c82='הזמנה לוועדה') are correct and properly bound to filter logic.
- Null-safety on field access: `(r[gen_app_peruk21_px1_c81] ?? '')` correctly handles missing key with empty-string fallback, comparison to c82 is safe.
- No empty/missing values in counter expression; label and filter value both non-empty constants.

**Could not check:**
- Actual Dart compilation (Flutter/Dart not installed); verification by `flutter analyze` or `dart analyze` would confirm syntax error.
- Whether an extension method on `Iterable.length` exists in the project's dependencies (unlikely, not found in forge/ds libraries).
- Runtime behavior if code somehow compiles (e.g., via analyzer workaround).

## Verdict

The counter particle was added correctly per spec, but the generated Dart code has a **compile-time error**: `Iterable.where(...).length` is not valid Dart. The fix is mechanical: chain `.toList()` before `.length` to materialize the filtered collection.
