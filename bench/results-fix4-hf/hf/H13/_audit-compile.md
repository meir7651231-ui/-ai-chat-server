# Audit Report: panuy app table columns (task H13)

## Findings

**new/dart-gen-bs/gen_app_panuy_ent1.dart:187** · ForgeDataGrid columns array has 14 items instead of 4 spec-declared columns · **P1 wrong result** · Reduce columns from [c9, c10, c13, c14, c15, c17, c19, c20, c22, c23, c24, c25, c26, c27] to [c9, c10, c25, c19] (שם, זמין, מרחק בקמ, מחיר לשעה in that order); also trim items rows to match 4-column projection

## Coverage

✓ Verified: machtzev/generator/specs-ds/panuy.txt line 6 declares `חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה` — exactly 4 columns specified in order

✓ Verified: Dart compile-safety: null-safety checks pass (num.tryParse returns num?, sqrt imported from dart:math, string fields safe with ?? defaults)

✓ Verified: Calculation logic safe (line 50 sqrt usage and line 175 both correct; math import present)

✓ Verified: particles.mjs(124–138) parses `[טבלה]` syntax and extracts column list into particle.kind.columns

✗ Defect confirmed: ForgeDataGrid call (line 187) hardcodes all 14 schema fields as columns, ignoring spec. Count: grep found 14 columns in the array (c9, c10, c13, c14, c15, c17, c19, c20, c22, c23, c24, c25, c26, c27).

✗ Defect confirmed: items row data (line 187, second half) also projects all 14 fields instead of just 4. Mismatched dimensions will cause widget rendering error if column count differs from data width.

Police report says "four_columns = 4" but actual generated code passes 14 columns—claim is contradicted by code inspection.

## Status

**Task NOT completed**: Spec file correctly specifies 4 columns, but render-ds.mjs ignores the particle's column list and always renders all schema fields. Generator must filter based on particle.columns before building labelsList and recValues.

