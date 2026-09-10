# 🔍 AUDITOR LENS: compile + null-safety
**Task:** Peruk02 cases table sorted by תאריך מסירת מפתח (key-handover date), earliest first. Audit for edge-crash + compile defects.

---

## Findings

**gen_app_peruk02_px1.dart:27** · `num.tryParse()` non-existent Dart method · **P0 compile-break** · Replace `num.tryParse(x)` with `int.tryParse(x) ?? double.tryParse(x)` to get proper numeric type; `num` is abstract and has no static `tryParse()` method in Dart SDK.

**gen_app_peruk02_px1.dart:27** · `nx.compareTo(ny)` non-existent on `num` type · **P0 compile-break** · After null-check narrowing, `nx` and `ny` are type `num`, which does not define `.compareTo()` method; use comparison operators instead: `(nx < ny ? -1 : (nx > ny ? 1 : 0))`.

**gen_app_peruk02_px1.dart:27** · Sort logic for date field "תאריך מסירת מפתח" correctly identifies c13 (confirmed in px1_content.dart) but method calls are invalid. The field is stored as string (e.g., "1.8"); numeric parsing is correct strategy but implementation is broken.

---

## Coverage

**Checked:** Full sort comparator on line 27 of gen_app_peruk02_px1.dart (table rendering for entity app_peruk02_ent1); field mapping (c13 = 'תאריך מסירת מפתח' ✓); null safety on fallback comparisons; sort order logic (ascending/earliest-first logic is sound before method calls).

**Could not check:** Runtime behavior (Flutter/Dart not installed); whether machine's flutter analyze was run on the same binary as in repo (police report claims compiles ✅, but code contains clear compile-time errors).

**Null-safety:** Fallback path `x.compareTo(y)` is sound (both are `String`). Primary path broken.

---

## Verdict

**TASK NOT DONE.** The sort directive was added to spec (peruk02.txt) and machinery generated a table particle with sort logic, but the generated code will not compile. Two method-not-found errors on `num` type will cause `flutter analyze` to report errors. The claim "compiles ✅" contradicts the bytecode evidence.

### One-line fix for each:
1. `num.tryParse(x)` → `int.tryParse(x) ?? double.tryParse(x)`
2. `nx.compareTo(ny)` → `(nx < ny ? -1 : (nx > ny ? 1 : 0))`
