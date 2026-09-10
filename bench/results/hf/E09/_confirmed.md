# Validator Report — peruk25 E09

## Verified Findings

**C1** · FALSE-POSITIVE · `new/dart-gen-bs/gen_app_peruk25_ent1.dart:49` `gen_app_peruk25_ent1_c20: ((num.tryParse(_v[6] ?? '') ?? 0) * 12).toStringAsFixed(2)` · Computed value is calculated correctly before storage; no error in result.

**C2** · FALSE-POSITIVE · `new/dart-gen-bs/gen_app_peruk25_ent1.dart:61` `7: r[gen_app_peruk25_ent1_c20] ?? ''` · Loaded value is redundant but harmless; form always recalculates from fresh _v[6] on line 162, never uses _v[7].

**C3** · FALSE-POSITIVE · `new/dart-gen-bs/gen_app_peruk25_ent1.dart:90` `r[gen_app_peruk25_ent1_c20] ?? ''` · Card displays stored value which is current and correct at time of display; no external editing mechanism in app.

**C4** · FALSE-POSITIVE · `new/dart-gen-bs/gen_app_peruk25_ent1.dart:98` `r[gen_app_peruk25_ent1_c20] ?? ''` · CSV export displays stored value; consistent with card display and correct.

**C5** · FALSE-POSITIVE · `new/dart-gen-bs/gen_app_peruk25_ent1.dart:173` `r[gen_app_peruk25_ent1_c20] ?? ''` · Data grid displays stored value; consistent with other views.

**C6** · FALSE-POSITIVE · `machtzev/generator/apps/peruk25.json:85–88` field schema lacks computed marker · Schema does not require "computed" flag; generator stores all field values; no inconsistency introduced; result always correct when displayed.

## Why FALSE-POSITIVE

- **Functional correctness**: Computed value `סכום פיצויים * 12` is calculated correctly at save (line 49) and displayed correctly in form (line 162 recalculates fresh). Result is never incorrect.
- **No staleness path**: Spec and code provide no mechanism for external editing of סכום פיצויים outside the form. Therefore, stored c20 cannot become stale.
- **Form display is fresh**: Line 162 passes fresh computation to `_calc()`, not the loaded _v[7]; _v[7] is unused, not used for display.
- **Consistent behavior**: Card (line 90), CSV (line 98), grid (line 173) all show stored value at time of save, which is correct.

FIX-LIST: none
