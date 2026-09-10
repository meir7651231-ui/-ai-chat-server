# Auditor Review: panuy task (distance sqrt + sort nearest-first)

## Findings
**No findings** — implementation is sound.

## Verified Coverage

**Distance Computation (ent1.dart:50):**
- ✅ sqrt() correctly imported from dart:math (top-level function, not method)
- ✅ Applied to squared-distance field (_v[10] = gen_app_panuy_ent1_c24)
- ✅ Result formatted as `.toStringAsFixed(2)` (2 decimal places, numeric string)
- ✅ Stored with field name 'מרחק בקמ' (matches content definition ent1_content.dart:25)
- ✅ Secondary usage at ent1.dart:175 for live preview also uses sqrt correctly

**Sort Implementation (px1.dart:34):**
- ✅ Sorts by field gen_app_panuy_px1_c5 = 'מרחק בקמ' (confirmed in px1_content.dart:7)
- ✅ Sort applied via cascade: `.toList()..sort((a, b) {...})`
- ✅ Numeric comparison: `num.tryParse(x)`, `num.tryParse(y)`, then `nx.compareTo(ny)` when both parse
- ✅ Fallback to lexicographic if either fails to parse
- ✅ Empty-value handling: empty fields sort last (return x.isEmpty ? 1 : -1)
- ✅ Ascending order (nearest first): negative compareTo result sorts a before b when a < b ✓

**Type Safety:**
- ✅ num.tryParse() returns num? (nullable), checked before compareTo: `(nx != null && ny != null) ? nx.compareTo(ny) : ...`
- ✅ No null-safety violations in sort closure
- ✅ Record field access with null-coalescing: `a[...] ?? ''` is safe

**Field Consistency:**
- ✅ Squared distance computed at ent1.dart:50 (gen_app_panuy_ent1_c24 index 10)
- ✅ Square root applied to index 10 → stored at index 11 = gen_app_panuy_ent1_c25 = 'מרחק בקמ'
- ✅ Table particle (px1) references same field name 'מרחק בקמ' for sort

**Police Report Alignment:**
- ✅ sqrt gate: "import=true fn=true method=false" — confirmed top-level function usage
- ✅ sort_list gate: "✅ px1" — confirmed sort present and correct
- ✅ compiles gate: "analyzer errors total=0 in-app=0" — no compile errors

---

**Task Complete:** List displays nearest-first (ascending by distance in km), distance is sqrt(squared distance) formatted to 2 decimals. No regressions detected.
