# Validator Report — panuy table columns

## Auditor Findings Verified

Both auditors (_audit-regression.md, _audit-coverage.md) reported the SAME bug: table columns c3 and c4 are swapped. I verified against the source bytes.

## Evidence

**Spec (machtzev/generator/specs-ds/panuy.txt:6):**
```
חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה
```
Required column order: 1=שם, 2=זמין, 3=מרחק בקמ, 4=מחיר לשעה

**Generated constants (new/dart-data-bs/auto/gen_app_panuy_px1_content.dart:3-10):**
```dart
const String gen_app_panuy_px1_c1 = 'שם';
const String gen_app_panuy_px1_c2 = 'זמין';
const String gen_app_panuy_px1_c3 = 'מחיר לשעה';    ← WRONG (spec says: מרחק בקמ)
const String gen_app_panuy_px1_c4 = 'מרחק בקמ';     ← WRONG (spec says: מחיר לשעה)
const String gen_app_panuy_px1_c5 = 'שם';
const String gen_app_panuy_px1_c6 = 'זמין';
const String gen_app_panuy_px1_c7 = 'מחיר לשעה';    ← WRONG (spec says: מרחק בקמ)
const String gen_app_panuy_px1_c8 = 'מרחק בקמ';     ← WRONG (spec says: מחיר לשעה)
```

**Usage (new/dart-gen-bs/gen_app_panuy_px1.dart:34):**
```dart
ForgeDataGrid(bare: true, columns: [gen_app_panuy_px1_c1, gen_app_panuy_px1_c2, gen_app_panuy_px1_c3, gen_app_panuy_px1_c4], 
  items: [for (final r in appStore.records('app_panuy_ent1')) [(r[gen_app_panuy_px1_c5] ?? ''), (r[gen_app_panuy_px1_c6] ?? ''), (r[gen_app_panuy_px1_c7] ?? ''), (r[gen_app_panuy_px1_c8] ?? '')]])
```

This renders columns as: שם, זמין, **מחיר לשעה**, **מרחק בקמ** — NOT the spec's required order.

**Comment confirms spec (gen_app_panuy_px1.dart:2):**
```dart
//   טבלה שם זמין מרחק בקמ מחיר לשעה = [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה
```

**Machine verdict conflict:** _police.md reports ✅ `four_columns | ✅ columns=4` and `has_km | ✅ 3×` but does NOT verify column ORDER. The checks only count columns and fields, not sequence.

## Safe-to-fix verification

- c3, c4, c7, c8 are ONLY used in gen_app_panuy_px1.dart:34 (no other files reference them)
- Constants c1, c2, c5, c6 are correct and should not change
- No side effects: byte_identical_others ✅ confirms all other apps unaffected
- No compilation issues if swapped: still 4 valid string constants

## Verdict

A1 · **CONFIRMED** · new/dart-data-bs/auto/gen_app_panuy_px1_content.dart:5-6 and 9-10 · c3 and c4 swapped, breaking spec column order שם, זמין, **מרחק בקמ**, **מחיר לשעה**

## Fix required

Swap c3 and c4 (lines 5-6); swap c7 and c8 (lines 9-10) in gen_app_panuy_px1_content.dart.

FIX-LIST: A1
