# Audit: peruk12 price sort — task coverage

## Findings

**No defects found.**

## Coverage verified

**Sort implementation (gen_app_peruk12_px1.dart:25):**
- ✓ Table particle (px1) sorts by gen_app_peruk12_px1_c7 = 'מחיר' (price field from spec line 7)
- ✓ Ascending order: `nx.compareTo(ny)` returns -1 when nx < ny → a comes first → cheapest first
- ✓ Numeric comparison: `num.tryParse(x)` and `num.tryParse(y)` with null checks, then `.compareTo(ny)` on parsed num values (not text)
- ✓ Text fallback: if parse fails, reverts to `x.compareTo(y)` for non-numeric strings
- ✓ Empty handling: empty values moved to end (`return x.isEmpty ? 1 : -1`)

**Constant mapping (gen_app_peruk12_px1_content.dart):**
- ✓ c7 = 'מחיר' (sort key) — matches entity field in spec line 7
- ✓ Column display uses c8–c13 (לקוח, טלפון, קישור מודעה, מחיר, מה המוכר אמר, האם נסעת) — matches spec entity fields exactly
- ✓ Constants renumbered correctly when title constant added at c0

**Other surfaces:**
- ✓ Hub (gen_app_peruk12_hub.dart): no changes
- ✓ Entity screen (gen_app_peruk12_ent1.dart): no changes
- ✓ Report (gen_app_peruk12_rp1.dart): no changes
- ✓ byte_identical_others gate: all other app specs unchanged

**Compilation:**
- ✓ Dart analyze: 0 errors
- ✓ gates_pass: all police gates pass
- ✓ sort gate: px1 sorts once (as required)
- ✓ numeric gate: 2× numeric comparisons confirmed (parse check + compareTo on num)

**Spec compliance:**
- ✓ Spec line 10: `חלקיק תיק: [טבלה] | מיון: מחיר עולה` (sort price ascending) — implemented exactly
- ✓ Spec line 7: entity fields match table columns in order

## Conclusion

The task "make the cases table sorted by price מחיר, cheapest first, comparing as numbers (not as text). Don't break anything" is **fully implemented and correct**. No coverage gaps, no breaking changes, sort direction and numeric comparison both verified.
