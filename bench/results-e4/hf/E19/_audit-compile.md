# 🔍 Audit Report — peruk25 conditional counter (E19)

## Findings

new/dart-gen-bs/gen_app_peruk25_scr2.dart:20 · `Iterable` has no `.length` property; `.where()` returns `Iterable<T>` not `List<T>` — must call `.toList()` before `.length` · P0 · Add `.toList()`: `appStore.records('app_peruk25_ent1').where((r) => (r[gen_app_peruk25_scr2_c9] ?? '') == gen_app_peruk25_scr2_c10).toList().length.toDouble().toStringAsFixed(0)`

new/dart-gen-bs/gen_app_peruk25_scr2.dart:21 · Same `.where().length` error on second counter in ForgeWaveformBars values array · P0 · Add `.toList()`: change `.where(...).length.toDouble()` to `.where(...).toList().length.toDouble()` (appears in both _vs array initialization and bar formula)

## Coverage

**Verified correct:**
- Spec modification (line 7 of peruk25.txt): syntax `מונה(תיק: סיווג=דגל מוגן)` follows established pattern found in ds_store.dart `.scoped()` and other references
- Content file (gen_app_peruk25_scr2_content.dart): constants correctly mapped — c9='סיווג', c10='דגל מוגן' matching enum values in spec line 6
- First counter via `appStore.count()` pattern: correct; uses `.toDouble().toStringAsFixed(0)`
- Null-coalescing on field access: `(r[fieldName] ?? '')` correctly handles missing/null field; comparison to string enum value 'דגל מוגן' is sound
- Text field names and labels in content: match spec and previous app patterns

**Could not check (tools available: read-only):**
- Whether police report's `compiles: ✅` reflects the actual generated code (code as written has 2x `.where().length` without `.toList()` — should fail Dart analyzer)
- Runtime behavior after adding `.toList()` (would need to build and test)
- Interaction with appStore state mutations during counter updates

## Verdict

**Task specification (add counter to dashboard) is implemented** in spec-lang syntax correctly, but **generated Dart code will not compile**. The rendering engine (render-ds) emitted `.where(...).length` pattern without the required `.toList()` bridge. Precedent for the correct pattern exists in same codebase (ds_store.dart:25 `.where(...).toList()`, line 305).

