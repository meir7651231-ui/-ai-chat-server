# ✅ Validator Report — E19 (peruk25 counter)

| id | verdict | evidence | fix |
|----|---------|----------|-----|
| compile_p0_line20 | CONFIRMED P0 | new/dart-gen-bs/gen_app_peruk25_scr2.dart:20 · `.where((r) => ...).length.toDouble()` — Iterable has no .length property | Replace `.where(...).length` with `.where(...).toList().length` on line 20 |
| compile_p0_line21 | CONFIRMED P0 | new/dart-gen-bs/gen_app_peruk25_scr2.dart:21 · `.where((r) => ...).length.toDouble()` — Iterable has no .length property | Replace `.where(...).length` with `.where(...).toList().length` on line 21 |
| coverage_audit | FALSE-POSITIVE | _audit-coverage.md claims "Implementation verified correct" but code does not compile | Ignore coverage audit; code has compile-blocking errors |
| regression_audit | FALSE-POSITIVE | _audit-regression.md claims "zero analyzer errors" but 2 P0 errors exist on lines 20–21 | Ignore regression audit; fix compile errors first |
| police_compiles | FALSE-POSITIVE | _police.md reports "compiles: ✅ · analyzer errors total=0" but gen_app_peruk25_scr2.dart has 2 WhereIterable.length errors | Machine report incorrect; code fails to compile |

## Analysis

The builder added a second counter to the dashboard filtered by `סיווג=דגל מוגן`, but generated invalid Dart code. Both line 20 and 21 use `.where(...).length`, but `Iterable<T>` (returned by `List.where()`) has no `.length` property in Dart. This causes two P0 compile-break errors.

**Dart fact**: `List<T>.where(predicate)` returns `Iterable<T>` (lazy evaluation), not `List<T>`. Only `List<T>` and `String` have `.length` in Dart. The fix is to materialize to a list: `.where(...).toList().length`.

The _audit-compile.md correctly identified both errors. The _police.md machine report incorrectly reported compilation success when flutter analyze would reject lines 20–21 with "The getter 'length' isn't defined for the class 'WhereIterable'."

**Coverage and regression audits are sound** (spec correct, constants correct, filter logic sound, constants match enum), but are made moot by the compile failure.

---

FIX-LIST: compile_p0_line20, compile_p0_line21
