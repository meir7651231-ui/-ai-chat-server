# 🔍 Auditor Report: sechirut תקרה מחייבת field

## Findings

new/dart-gen-bs/gen_app_sechirut_ent2.dart:92 · _card() uses _v[5], _v[6], _v[7] (form state) instead of r[] (record) for comparison calculations · P1 wrong-result · Replace (((num.tryParse(_v[5] ?? '') ?? 0) > (num.tryParse(_v[6] ?? '') ?? 0)) ? gen_app_sechirut_ent2_c26 : gen_app_sechirut_ent2_c27) with (((num.tryParse(r[gen_app_sechirut_ent2_c20] ?? '') ?? 0) > (num.tryParse(r[gen_app_sechirut_ent2_c21] ?? '') ?? 0)) ? gen_app_sechirut_ent2_c26 : gen_app_sechirut_ent2_c27); same for second comparison using _v[7]→r[c23]

new/dart-gen-bs/gen_app_sechirut_ent2.dart:100 · _csv() exports _v state instead of r (record) for comparison values · P1 wrong-result · Apply same fix as line 92: replace _v with r references

## Verified Correct

✅ Line 51: max() function call is syntactically valid—`max((num.tryParse(_v[6] ?? '') ?? 0), (num.tryParse(_v[7] ?? '') ?? 0))` compiles and uses builtin Dart max from dart:math

✅ Line 179: תקרה מחייבת calculation formula `max(_v[6], _v[7])` correctly references the two input ceiling fields (c21 תקרה לפי חודשים, c23 תקרה לפי שליש) by index and applies max(). Constant c24 label matches spec.

✅ Lines 176–179: Form UI properly displays תקרה לפי חודשים and תקרה לפי שליש as input fields, תקרה מחייבת as calculated (read-only) _calc display.

✅ Line 51 map creation: תקרה מחייבת stored as `(max(...)).toStringAsFixed(2)` with numeric safety (tryParse fallback to 0). All 11 entity fields present in _labelsAll array, indices correct.

✅ Dart analyzer errors: 0 in-app. No null-safety violations (all ?? 0 fallbacks in place).

## Coverage Summary

Checked: null-safety on max() call, formula indices for c21/c23→max calculation, field constant count (11 fields), label-to-constant mapping (c24 'תקרה מחייבת'), Dart ast syntax and imports. 

Not checked: runtime behavior of app (no Flutter env), whether CSV/card display actually crashes at runtime (likely not—code compiles), whether displayed values at runtime match expected results (logic assumed correct if syntax valid, but usage of _v in card/csv is logic error per above).

