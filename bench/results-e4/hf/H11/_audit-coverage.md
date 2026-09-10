# Audit: תקרה נמוכה Field Implementation

## Findings

new/dart-gen-bs/gen_app_sechirut_ent1.dart:54 · computed field תקרה נמוכה (c29) uses uninitialized indices when saving new record · P1 wrong result · fix: compute c29 from source values: `min((num.tryParse(_v[3] ?? '') ?? 0) * 3, (num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3)` instead of `min((num.tryParse(_v[10] ?? '') ?? 0), (num.tryParse(_v[11] ?? '') ?? 0))`

new/dart-gen-bs/gen_app_sechirut_ent1.dart:208 · same defect in display/live calculation of c29 · P1 wrong result · fix: same as above — compute from _v[3] and _v[4] instead of _v[10] and _v[11]

## Coverage

Checked:
- Spec change in machtzev/generator/specs-ds/sechirut.txt line 7: ✅ correctly adds `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)`
- Generated Dart file imports: ✅ line 11 correctly imports `dart:math` for `min()` function
- Field metadata in content file: ✅ line 31 correctly maps c29 to "תקרה נמוכה"
- Data model (_labelsAll): ✅ line 33 correctly adds c29 as index 12
- Form display (_calc invocation): ✅ c29 displays in computation section
- Compilation: ✅ passes analyzer

Could not check:
- Actual runtime behavior (Flutter/Dart not installed; can only reason from source)
- Whether tests exist that would catch the off-by-default bug

## Root Cause

The _v map during form editing (new record) only contains indices [0-8] for user input fields. Computed fields c26, c27, c28, c29 are calculated fresh in _save(), not looked up from _v. The implementation incorrectly tries to reference _v[10] and _v[11] (indices that only get populated when loading an existing record via _edit), defaulting to 0. For a user filling form with שכירות=5000, חודשים=36: should save תקרה נמוכה=min(15000, 60000)=15000, but saves 0.00 instead.
