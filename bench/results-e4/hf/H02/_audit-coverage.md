# Audit: Cases Table Sorting by Rent (שכירות)

## Findings

No defects found. Implementation verified correct.

## Coverage verified

**Spec change (correct)**: `machtzev/generator/specs-ds/sechirut.txt` line 22 — added `| מיון: שכירות יורד` to table particle declaration. Parser correctly recognized descending sort on rent field.

**Field mapping (correct)**: `new/dart-data-bs/auto/gen_app_sechirut_px1_content.dart` line 21 — `gen_app_sechirut_px1_c19 = 'שכירות'` correctly maps the rent field for sorting.

**Sorting implementation (correct)**: `new/dart-gen-bs/gen_app_sechirut_px1.dart` line 34 — Table particle implements sort via:
- Extracts שכירות field: `a[gen_app_sechirut_px1_c19]`
- Handles empty values (moved to end): `if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1`
- Parses as numbers: `num.tryParse(x)`, then compares: `nx.compareTo(ny)` 
- Falls back to lexical: `x.compareTo(y)`
- **Descending (highest first)**: `return -c;` reverses comparison order

All Dart APIs used are correct (num.tryParse, .compareTo(), .toList()..sort()).

**No breaking changes**: Police report confirms `byte_identical_others ✅` — all other app outputs remain unchanged.

**Compilation**: Police report confirms `compiles ✅` with zero analyzer errors; zero hand-edits to generated files.

**Claims verified**: Machine confirmed all 5 claims:
- sort ✅ px1
- desc ✅ px1  
- byte_identical_others ✅
- no_hand_edit ✅
- compiles ✅

## Conclusion

Task complete. Cases table (תיק particle) sorts by שכירות descending. No task surface omitted: entity list screen (table with sort), particle table (sorted), hub (unaffected, byte-identical), report (unaffected, byte-identical). Nothing broken.
