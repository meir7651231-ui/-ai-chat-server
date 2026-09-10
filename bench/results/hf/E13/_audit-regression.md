# Audit: State-Leakage & Regression (E13 peruk12)

## Findings

1. **new/dart-gen-bs/gen_app_ent1.dart:1–150 · CRITICAL: State-leakage to unrelated app** · P0 · Revert generator run and verify spec/app isolation
   - Entity ent1 changed completely outside peruk12 scope: 6 fields → 4 fields, validation removed, imports changed (ds_enum_field.dart → ds_date_field.dart), stage-index.dart → advance-status.dart, entire _save() logic rewritten
   - This is NOT a legitimate update to peruk12; it's collateral damage from a generator bug or incorrect spec processing
   - Task spec: "add to **case entity תיק** a numeric field קילומטראז' and a computed field מחיר לקמ" — no mention of ent1
   - Verified via byte_identical_others check in police report: FALSE (8 files changed outside peruk12 namespace)

2. **machtzev/generator/apps/peruk12.json:65 · WRONG: Field קילומטראז set as type "text" instead of "num"** · P1 · Change type to "num"
   - Computed field מחיר לקמ = מחיר / קילומטראז' requires numeric division, but קילומטראז is registered as text
   - Dart: `num / text` is nonsensical; the division will fail at runtime or produce garbage
   - Root cause: "קילומטראז" is not in spec-lang.data.json's typeNum list; parser defaults to text
   - Fix: Either (a) change field name to one recognized as numeric (e.g., "ק״מ"), or (b) add "קילומטראז" to typeNum in spec-lang.data.json

3. **new/dart-data-bs/auto/gen_app_peruk12_ent1_content.dart & new/dart-gen-bs/gen_app_peruk12_ent1.dart · MISSING: Computed field מחיר לקמ has no _calc() function** · P1 · Add _calc() generation for computed fields
   - Police report verdict: `calc | ❌ consts=1 calc=0` — one constant label but zero computed-field handlers
   - Content file shows c17 = 'מחיר לקמ', but the Dart screen gen_app_peruk12_ent1.dart has no logic to evaluate the formula
   - For paper skin, computed fields must either: (1) generate _calc() in edit form, or (2) pre-compute on save. Neither is present.
   - The field accepts the label but not the computation — user sees a blank cell for מחיר לקמ

4. **new/dart-data-bs/auto/gen_app_ent1_content.dart:1–15 · State-leakage spillover of ent1** · P0 · Same fix as finding #1
   - Constants redefined: c0 'חללית' → 'פריט', c1 '6 שדות' → '4 שדות', field set removed (c10–c27 deleted)
   - Not caused by peruk12 spec; confirms systematic generator failure affecting multiple apps

## Coverage

**Verified correct:**
- peruk12.json fields list: both new fields (קילומטראז and מחיר לקמ) are present and have correct labels
- Spec parse: spec-ds/peruk12.txt correctly updated with new fields and computed formula
- peruk12 namespace isolation: gen_app_peruk12_* files exist and contain peruk12-specific content (c9–c17 labels mapped correctly to תיק entity)
- No hand edits: CLAUDE.md compliance verified (render-ds auto-gen marker present)
- No Hebrew in engine: Verified no Hebrew text in machtzev/ itself

**Could not verify (Dart runtime behavior):**
- Whether num / text produces compile error or silent NaN (Dart typing + analyzer not available)
- Whether paper skin's render-ds actually calls _calc for computed fields (would need Flutter analyze/test)

## Verdict

**NOT DONE** — Task has three blockers:

1. **P0 regression**: Generator altered 8 files outside peruk12 (ent1, flags, hub, rec1, root, shell) with structural changes. This breaks those apps and indicates a systemic issue, not just a field-addition mistake.

2. **P1 type mismatch**: computed field formula `מחיר / קילומטראז'` requires קילומטראז to be numeric, but it's text. Division will fail or silently produce wrong results.

3. **P1 missing calc**: Computed field has no runtime evaluation logic. Even if type is fixed, the formula won't be evaluated during form edit or on save.

Recommendations:
- Investigate why generator touches unrelated apps (check specs tree, namespace isolation, app registry mutation)
- Fix field type by renaming to numeric keyword or expanding spec-lang.data.json typeNum
- Verify computed field implementation in render-ds (check if paper skin supports _calc wiring)
