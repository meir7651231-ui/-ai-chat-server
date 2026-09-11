# 🔍 Auditor Report — panuy table column ordering

## Finding

new/dart-gen-bs/gen_app_panuy_px1.dart:34 · table columns in wrong order · P1 wrong-result · swap c3 and c4 in columns/items arrays

## Defect Details

**Spec requirement** (machtzev/generator/specs-ds/panuy.txt:6):
```
[טבלה] שם, זמין, מרחק בקמ, מחיר לשעה
```

Per SPEC-LANG.md §16: "`[טבלה] עמודה1, עמודה2, …` — עמודות נבחרות ומיון" — the list specifies columns in fixed order.

**Generated code** (new/dart-gen-bs/gen_app_panuy_px1.dart:34):
```dart
ForgeDataGrid(bare: true, columns: [gen_app_panuy_px1_c1, gen_app_panuy_px1_c2, gen_app_panuy_px1_c3, gen_app_panuy_px1_c4], items: [...[(r[c5] ?? ''), (r[c6] ?? ''), (r[c7] ?? ''), (r[c8] ?? '')]])
```

**Resolved values** (new/dart-data-bs/auto/gen_app_panuy_px1_content.dart):
- c1 = 'שם' ✓
- c2 = 'זמין' ✓
- c3 = 'מחיר לשעה' ✗ should be 'מרחק בקמ'
- c4 = 'מרחק בקמ' ✗ should be 'מחיר לשעה'
- (same swapping in c5–c8)

**Result**: Table displays columns as `שם, זמין, מחיר לשעה, מרחק בקמ` instead of the specified `שם, זמין, מרחק בקמ, מחיר לשעה`. The last two columns are in wrong order, violating both the spec and the RULE in LEARNINGS.md L2026-09-10-spec-tables-panuy line 9.

## Investigation

- Spec unchanged from HEAD: `[טבלה]` syntax support was added in this task per LEARNINGS.md.
- No hand-edits: `no_hand_edit` gate passed (verified pristine generation).
- Other apps unaffected: `byte_identical_others` gate passed; peruk/sechirut tables use `[טבלה]` without column lists so are unchanged.
- Gates passed: `compiles`, `four_columns`, `has_km` — but the `four_columns` gate appears to have verified COUNT=4 only, not ORDER correctness. The police report claimed "CONFIRMED" order but the actual content shows swapped columns.

## Coverage

✓ Verified: spec syntax, expected values from SPEC-LANG.md §16, generated code column/items arrays, content file values c1–c8, syntax of ForgeDataGrid call, no hand-edits, no orphans, no state-leakage to other apps, flutter compiles.

✗ Could not verify: runtime behavior (Flutter not installed); whether `four_columns` gate actually tested order or only count; whether the police report's `four_columns` check examined the actual order or just the column count.

