# ✅ Validator Report — sechirut תקרה מחייבת field (H07)

## Findings

CARD1 · verdict **CONFIRMED** · new/dart-gen-bs/gen_app_sechirut_ent2.dart:92 · Card values uses `_v[5]` (form state סך בטוחות), `_v[6]` (form state תקרה לפי חודשים), `_v[7]` (form state תקרה לפי שליש) instead of `r[gen_app_sechirut_ent2_c20]`, `r[gen_app_sechirut_ent2_c21]`, `r[gen_app_sechirut_ent2_c23]` from the record being displayed; comparisons for חורג fields will show wrong values during list view · Replace `(((num.tryParse(_v[5] ?? '') ?? 0) > (num.tryParse(_v[6] ?? '') ?? 0)) ? gen_app_sechirut_ent2_c26 : gen_app_sechirut_ent2_c27), (((num.tryParse(_v[5] ?? '') ?? 0) > (num.tryParse(_v[7] ?? '') ?? 0)) ? gen_app_sechirut_ent2_c29 : gen_app_sechirut_ent2_c30)` with `(((num.tryParse(r[gen_app_sechirut_ent2_c20] ?? '') ?? 0) > (num.tryParse(r[gen_app_sechirut_ent2_c21] ?? '') ?? 0)) ? gen_app_sechirut_ent2_c26 : gen_app_sechirut_ent2_c27), (((num.tryParse(r[gen_app_sechirut_ent2_c20] ?? '') ?? 0) > (num.tryParse(r[gen_app_sechirut_ent2_c23] ?? '') ?? 0)) ? gen_app_sechirut_ent2_c29 : gen_app_sechirut_ent2_c30)`

CSV1 · verdict **CONFIRMED** · new/dart-gen-bs/gen_app_sechirut_ent2.dart:100 · CSV export values inside `for (final r in appStore.records(...))` loop uses `_v[5]`, `_v[6]`, `_v[7]` instead of `r[gen_app_sechirut_ent2_c20]`, `r[gen_app_sechirut_ent2_c21]`, `r[gen_app_sechirut_ent2_c23]`; exported comparison columns will show same form value for all rows instead of per-record values · Replace same expressions as line 92 (using r instead of _v)

TABLE1 · verdict **CONFIRMED** · new/dart-gen-bs/gen_app_sechirut_ent2.dart:191 (table grid items) · Table view shows computed values using form state `_v[5]`, `_v[7]` instead of record values; same state-leakage logic error as line 92 · Replace `(((num.tryParse(_v[5] ?? '') ?? 0) > (num.tryParse(_v[7] ?? '') ?? 0)) ? gen_app_sechirut_ent2_c27 : gen_app_sechirut_ent2_c28)` in grid with `(((num.tryParse(r[gen_app_sechirut_ent2_c20] ?? '') ?? 0) > (num.tryParse(r[gen_app_sechirut_ent2_c23] ?? '') ?? 0)) ? gen_app_sechirut_ent2_c29 : gen_app_sechirut_ent2_c30)`

SPEC1 · verdict **CONFIRMED** · machtzev/generator/specs-ds/sechirut.txt:38 · Report "חישוב בטוחות" missing new field; currently reads `דוח תיק: חישוב בטוחות = בטוחה.תקרה לפי 3 חודשים, בטוחה.תקרה לפי שליש, בטוחה.חורג, בטוחה.מעל התקרה` but should include `בטוחה.תקרה מחייבת` · Update line 38 to: `דוח תיק: חישוב בטוחות = בטוחה.תקרה לפי 3 חודשים, בטוחה.תקרה לפי שליש, בטוחה.תקרה מחייבת, בטוחה.חורג, בטוחה.מעל התקרה`

## Verified Correct

✅ Spec line 8: בטוחה entity correctly defines new field `תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש)`
✅ Line 51 (_save): Computed field max() call is syntactically valid with correct Dart null-safety and imports
✅ Content file c24 constant defined for field label
✅ Form display (line 179) shows תקרה מחייבת as _calc() read-only widget with correct max() calculation
✅ All analyzer checks pass (0 errors); code compiles
✅ No regressions: byte_identical_others confirmed, only sechirut app entity 2 files modified

## Summary

Four confirmed P1 findings: three logic errors using form state (_v) instead of record values (r) when displaying cards, CSV, and table rows (wrong comparison results shown to users); one incomplete spec (report definition missing new field). All code compiles and syntax is valid, but runtime display will show incorrect status values.

FIX-LIST: CARD1, CSV1, TABLE1, SPEC1
