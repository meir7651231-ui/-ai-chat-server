# Audit Coverage Report: פנויים לידי עכשיו (panuy) — קרוב field

## Task
Add to person entity a computed text field `קרוב` that shows `קרוב` when `מרחק בריבוע` < 100 and `רחוק` otherwise.

## Findings

new/dart-gen-bs/gen_app_panuy_ent1.dart:50 · Computed field `קרוב` saved as empty string instead of computed value · P1 · Save method should assign `(((num.tryParse(distanceSq) ?? 0) < 100) ? gen_app_panuy_ent1_c32 : gen_app_panuy_ent1_c33)` instead of `''`

new/dart-gen-bs/gen_app_panuy_ent1.dart:91 · Card display uses form state `_v[10]` and old saved value `_v[14]` instead of record's distance squared and literal text · P1 · Use `(((num.tryParse(r[gen_app_panuy_ent1_c24] ?? '') ?? 0) < 100) ? gen_app_panuy_ent1_c32 : gen_app_panuy_ent1_c33)` to show correct value from record

new/dart-gen-bs/gen_app_panuy_ent1.dart:99 · CSV export uses form state `_v[10]` and `_v[14]` instead of record values · P1 · Same fix as line 91 for CSV column

new/dart-gen-bs/gen_app_panuy_ent1.dart:178 · Form preview uses `_v[10]` which won't be populated when creating new records, and uses `_v[14]` instead of literal text · P1 · When creating: compute fresh from form fields; when editing: use computed result constant instead of `_v[14]`

new/dart-gen-bs/gen_app_panuy_ent1.dart:188 · Table grid display uses form state `_v[10]` and `_v[14]` instead of record's distance squared · P1 · Same fix as line 91 for grid column

## Coverage Check

**Entity list screen** (line 91 _card method): ✗ BROKEN — displays wrong value from form state instead of current record

**Particle table** (px1 line 35): ✗ BROKEN — attempts to read `r[c30]` but c30 is the field label, not a data value; depends on ent1 saving the computed field value (which it doesn't)

**Hub** (gen_app_panuy_hub.dart): ✓ CORRECT — only navigation, no data display

**Report** (gen_app_panuy_rec1.dart): NOT CHECKED — appears to be a separate view; field may not appear here

## Summary

**Task NOT DONE.** The conditional field `קרוב` is declared in spec and rendered in UI, but the computed logic is broken in 5 locations:
- The save method doesn't compute the value at all (saves empty string)
- The record display methods all read from form state instead of record data
- The form preview won't work correctly when creating new records

All 5 locations use `_v[10]` (form state) where they should use `r[gen_app_panuy_ent1_c24]` (record data) or freshly computed values. The field displays incorrect data or empty values across list, table, and CSV export.
