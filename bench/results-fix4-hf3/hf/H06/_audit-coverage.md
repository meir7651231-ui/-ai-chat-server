# Audit: peruk12 price sort task coverage

## Findings
No defects found.

## Coverage verified
✅ **Spec conformance (peruk12.txt line 10):** Spec declares `חלקיק תיק: [טבלה] | מיון: מחיר עולה` (particle cases: table | sort: price ascending). Machine implements this in px1 particle.

✅ **Sort field correct (gen_app_peruk12_px1_content.dart line 9):** Sort uses `gen_app_peruk12_px1_c7 = 'מחיר'` (price), matching spec requirement.

✅ **Numeric comparison (gen_app_peruk12_px1.dart line 25):** Comparator uses `num.tryParse(x)` and `num.tryParse(y)` with `nx.compareTo(ny)` for numeric sort. Does not compare as text. Fallback to string comparison for unparseable values.

✅ **Ascending direction (line 25):** Logic returns `nx.compareTo(ny)` directly, which produces negative when a.price < b.price, ensuring a comes before b (ascending = cheapest first).

✅ **Empty handling (line 25):** Empty prices sorted to end (`return x.isEmpty ? 1 : -1` when one is empty).

✅ **Scope isolation:** Sort applied only to px1 particle screen (particles view). Entity screen (ent1.dart) table is unsorted, which is correct (sort not specified for entity screen). Home screen sorts by due date (separate concern).

✅ **No breakage:** Sort applied to `.toList()` copy of records; original data untouched. AnimatedBuilder re-sorts on each rebuild (intentional for data reactivity).

✅ **Machine validation:** Police report confirms `sort ✅ px1` and `numeric (info) ✅ 2×` and `compiles ✅`.

**Case table surfaces checked:** px1 particle screen table (sorted) ✓ · ent1 entity screen table (unsorted, correct) ✓ · home screen (no case table) ✓ · hub screen (navigation only, no rendering) ✓

**Result:** Task implementation is complete and correct. All specified surfaces updated.
