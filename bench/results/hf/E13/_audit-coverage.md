# Audit: peruk12 task completion

## Findings

1. `machtzev/generator/apps/peruk12.json:65` · קילומטראז field is type "text" but task requires numeric field — קילומטראז must be recognized as numeric by the parser (add to spec-lang.data.json typeNum array or use type-inference that reaches num) · **P1 wrong result**

2. `new/dart-gen-bs/gen_app_peruk12_ent1.dart:160` · מחיר לקמ rendered as editable input field (ForgeDsField with onChanged) instead of computed/read-only display — should be `_calc(gen_app_peruk12_ent1_c17, (num.tryParse(_v[3] ?? '') ?? 0) / (num.tryParse(_v[4] ?? '') ?? 0))` matching panuy's pattern for computed fields · **P1 wrong result**

3. `new/dart-gen-bs/gen_app_peruk12_ent1.dart:48` · מחיר לקמ incorrectly saved as user input to store `gen_app_peruk12_ent1_c17: _v[7] ?? ''` instead of computed on save — formula `מחיר / קילומטראז'` is not being evaluated, should compute during `_save()` like panuy does · **P1 wrong result**

## Coverage verified

✅ Spec syntax: `peruk12.txt` line 7 correctly declares `קילומטראז'` and `מחיר לקמ = מחיר / קילומטראז'` in the entity definition.

✅ Field constants generated: Both field labels appear in `gen_app_peruk12_ent1_content.dart` as c14 (קילומטראז) and c17 (מחיר לקמ).

✅ Field count updated: `_labelsAll` array in `gen_app_peruk12_ent1.dart` now has 8 fields (was 6), field indices correctly mapped to UI controls.

❌ **Not verified (task incomplete):**
- קילומטראז not registered as numeric type in parser
- מחיר לקמ not implemented as computed field (read-only, formula-driven)
- Formula `מחיר / קילומטראז'` not evaluated in save logic

**Task status: NOT DONE** — Field coverage increased (8/8 fields present in label list and UI), but semantic correctness missing: both added fields have wrong types/treatment (text instead of num for קילומטראז, editable input instead of computed display for מחיר לקמ).
