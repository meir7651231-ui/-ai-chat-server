# Audit Report: peruk12 Price Sort Task

## Findings

gen_app_peruk12_ent1.dart:171 · Entity screen table view not sorted by price while particle table is sorted · P2 · Add `.sort()` to filter result on line 169 before mapping to ForgeDataGrid items, matching px1 pattern

## Coverage

**Verified correct:**
- Particle table (px1): Sorts by 'מחיר' field using numeric comparison with `num.tryParse()` on both values (line 25, gen_app_peruk12_px1.dart); ascending order (cheapest first) via `nx.compareTo(ny)` ✓
- Numeric comparison: Correctly uses `num.tryParse(x)` + `.compareTo()` for numeric values, falls back to `.compareTo()` for strings; empty values sorted to end ✓
- Spec compliance: Generator correctly parsed "| מיון: מחיר עולה" spec directive ✓

**Not checked:**
- Could not run app to verify visual sort behavior (Flutter/Dart not available)
- Could not verify machine test suite (police report says all gates passed, trusting its "sort | ✅ px1" and "numeric | ✅ 2×" verdicts)
- Hub and Report screens: No table views found, N/A

**Missing coverage:**
- Entity list screen (gen_app_peruk12_ent1.dart, _view==2): Table view displays unsorted records while main particle table (px1) is sorted by price. Both show same entity records, but ent1 table lacks sort logic despite sharing data source.
