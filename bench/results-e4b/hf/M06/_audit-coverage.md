# Audit Coverage: panuy.txt computed field קרוב

## Findings

new/dart-gen-bs/gen_app_panuy_ent1.dart:91 · Display card uses form state `_v[10]` instead of record value `r[gen_app_panuy_ent1_c24]` to compute קרוב; `_v[14]` is empty string, displays nothing when distance < 100 · P1 wrong result · Change to `(((num.tryParse(r[gen_app_panuy_ent1_c24] ?? '') ?? 0) < 100) ? gen_app_panuy_ent1_c32 : gen_app_panuy_ent1_c33)`

new/dart-gen-bs/gen_app_panuy_ent1.dart:99 · CSV export uses form state `_v[10]` instead of record value; computes based on editing form, not saved data · P1 wrong result · Use same record-based logic as line 91

new/dart-gen-bs/gen_app_panuy_ent1.dart:188 · Table view displays with form state `_v[10]`/`_v[14]` for all records in loop; shows empty string for close records and 'רחוק' for all others regardless of actual distance · P1 wrong result · Change to `(((num.tryParse(r[gen_app_panuy_ent1_c24] ?? '') ?? 0) < 100) ? gen_app_panuy_ent1_c32 : gen_app_panuy_ent1_c33)`

## Coverage Verified

✅ **Spec integration:** Field קרוב correctly added to panuy.txt line 4 with syntax `קרוב = מרחק בריבוע < 100 ? קרוב : רחוק`

✅ **Constants defined:** gen_app_panuy_ent1_c32='קרוב' and gen_app_panuy_ent1_c33='רחוק' in ent1_content.dart

✅ **Field registered:** 15 fields including קרוב in _labelsAll (ent1.dart:31), field index 14 in _v map

✅ **Compilation:** flutter analyze reports zero errors

✅ **Police gates:** All 53 gates pass; machine confirms conditional logic is syntactically valid

## Could Not Verify

⚠️ **Runtime behavior:** Would not display correctly—when distance squared < 100, displays empty string instead of "קרוב"; when >= 100, correctly displays "רחוק". The table view (surface 3) shows this bug clearly: all records compute using the form's `_v[10]` instead of each record's `r[gen_app_panuy_ent1_c24]`, so only one record's condition is ever evaluated.

⚠️ **Entity list screen, particle table, hub, report surfaces:** Cannot confirm קרוב field visibility on all required surfaces due to logic error in display layer. The field data exists in schema but is not rendered with correct values.
