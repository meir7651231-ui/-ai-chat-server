# 🔍 Audit: Column Order in Table — DEFECT FOUND

**Lens:** edge-crash + compile (Dart null-safety, method existence, nested parens, text-vs-number comparisons) + **task completion**

---

## Findings

**new/dart-data-bs/auto/gen_app_panuy_px1_content.dart:3–6 · Column header order wrong · P0 task-not-done · Swap c3↔c4**

Spec (panuy.txt:6) requires column order: `שם, זמין, מרחק בקמ, מחיר לשעה`

Generated content:
```dart
const String gen_app_panuy_px1_c1 = 'שם';            // ✓ position 1
const String gen_app_panuy_px1_c2 = 'זמין';         // ✓ position 2
const String gen_app_panuy_px1_c3 = 'מחיר לשעה';   // ✗ position 3 (should be c4)
const String gen_app_panuy_px1_c4 = 'מרחק בקמ';    // ✗ position 4 (should be c3)
```

Table actually renders as: `שם → זמין → מחיר לשעה → מרחק בקמ` (columns 3 and 4 swapped)

---

**new/dart-data-bs/auto/gen_app_panuy_px1_content.dart:7–10 · Column data order wrong · P0 task-not-done · Swap c7↔c8**

Same mismatch in data field mapping:
```dart
const String gen_app_panuy_px1_c5 = 'שם';            // ✓ position 1
const String gen_app_panuy_px1_c6 = 'זמין';         // ✓ position 2
const String gen_app_panuy_px1_c7 = 'מחיר לשעה';   // ✗ position 3 (should be c8)
const String gen_app_panuy_px1_c8 = 'מרחק בקמ';    // ✗ position 4 (should be c7)
```

On line 34 of px1.dart, the table uses these in order: `c5, c6, c7, c8` — all mapped to wrong fields.

---

## Verified Correct

✅ **Null-safety in numeric operations (lines 38, 39, 45 of px1.dart):** Pattern `(num.tryParse(value ?? '') ?? 0) op (num.tryParse(...) ?? 0)` is sound; `tryParse` returns `num?`, second `??` handles null. `.toStringAsFixed()` call is valid on `num`.

✅ **Null coalescing on record access (line 34, throughout px1.dart):** `(r[fieldKey] ?? '')` safely handles missing/null data.

✅ **Parenthesis nesting:** Balanced; no syntax errors in arithmetic/comparison expressions.

✅ **Compilation passes:** Police report confirms `compiles | ✅` with 0 analyzer errors.

✅ **Count of columns:** Police gate `four_columns | ✅ columns=4` confirmed; table has exactly 4 columns (not 5, not 3). **However, count test does not verify ORDER — which is wrong.**

---

## Coverage & Gaps

**Checked:**
- Column count: 4 (spec requires 4) ✓
- Column header order: spec order vs generated order ✗ (defect found)
- Column data order: spec order vs generated order ✗ (defect found)
- Null-safety in numeric casts and null coalescing ✓
- Dart method calls on `num` (all use `.toStringAsFixed()` which exists) ✓
- No division-by-zero or missing `sqrt()` calls that don't exist in dart:math ✓

**Could not check (Dart not installed):**
- Runtime behavior: whether table renders correctly despite wrong order
- Record type shape: assuming `appStore.records()` returns iterable of map-like objects

---

## Task Status: **NOT DONE**

Spec language `[טבלה] column1, column2, column3, column4` was meant to control both count AND order. Order is incorrect. Generator must reorder c3↔c4 and c7↔c8 (or use them in different order in the table render).
