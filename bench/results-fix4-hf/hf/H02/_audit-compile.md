# Audit Report: Sechirut App Table Sort

## Findings

machtzev/LEARNINGS.md:10 · requirement mismatch · P1 wrong result · fix: change "צריכה מיון לפי שכירות (rent) עולה" to "צריכה מיון לפי שכירות (rent) יורד"

**Defect details:** The LEARNINGS entry documents the sort requirement as ascending (עולה), but the task specifies "sorted by rent שכירות, **highest first**". The generated spec and code correctly implement descending (יורד = down/high-to-low), contradicting the documented requirement. This creates confusion for future work: the LEARNINGS (which serves as the canonical requirement record) states ascending, but the implementation is descending.

The actual code in `new/dart-gen-bs/gen_app_sechirut_px1.dart:34` correctly implements descending sort via `return -c;` (negating the compareTo result), and the spec in `machtzev/generator/specs-ds/sechirut.txt:22` correctly says `| מיון: שכירות יורד`. But the LEARNINGS entry contradicts both.

---

## Verified Correct

- **Spec syntax**: `| מיון: שכירות יורד` is correct for table sort directive (particle-plan.json updated correctly)
- **Field identification**: Correctly sorts by 'שכירות' field (c19 in generated code)
- **Sort direction logic**: Uses `num.compareTo()` with negation (`-c`), producing descending order (highest-first) ✓
- **Null safety**: Proper handling of null values via `num.tryParse()` with null checks before `.compareTo()`
- **Empty values**: Correctly pushed to end of list (non-empty values come first)
- **Number parsing**: `num.tryParse(x)` returns `num?`, checked before use; falls back to string `.compareTo()` if parsing fails
- **Dart syntax**: Closure structure valid; inner block scope allowed; return statements from closure work correctly
- **Table implementation**: ForgeDataGrid correctly receives pre-sorted items from `.toList()..sort()`

**Coverage:** Read spec source, verified spec-lang syntax interpretation, traced generated sort lambda through 3 paths (numeric, string, empty), confirmed null safety at every dereference, checked Dart method availability (num.compareTo, String.compareTo exist).

**Could not check:** Runtime behavior (Dart/Flutter not available); actual rendering of sorted table in browser.
