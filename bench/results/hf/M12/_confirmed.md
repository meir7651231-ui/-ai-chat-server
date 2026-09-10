# Validation: peruk02 average deposit particle

## Verified Findings (Ranked by Severity)

**1-ent1-editable** · CONFIRMED · new/dart-gen-bs/gen_app_peruk02_ent1.dart:58 + 168 · `gen_app_peruk02_ent1_c21: _v[12] ?? ''` in save map; line 168 renders as `DsField(… onChanged: (v) => setState(…_v[12] = v)…)` — particle "ממוצע פיקדון" is user-editable when it should be read-only calculated value · Remove field from form (delete line 168) and save map (delete c21 from line 58); if shown in entity detail, use read-only KvLine with `appStore.avg('app_peruk02_ent1', gen_app_peruk02_ent1_c11)` · P1 wrong result

**2-px1-per-row** · CONFIRMED · new/dart-gen-bs/gen_app_peruk02_px1.dart:27 · column list includes `gen_app_peruk02_px1_c13` ('ממוצע פיקדון' label) and items iterate `(r[gen_app_peruk02_px1_c26] ?? '')` (value per record) — table shows average per-case row when it should be summary-only on board · Remove c13 from columns list and c26 from items mapping (lines 27); dashboard (scr3) already shows correct cross-case average · P1 wrong presentation

**3-scr3-label** · CONFIRMED · new/dart-gen-bs/gen_app_peruk02_scr3.dart:22 · `KvLine(label: gen_app_peruk02_scr3_c11, …)` where c11='סכום הפיקדון' (line 13 of gen_app_peruk02_scr3_content.dart) — dashboard metric label is field name instead of 'ממוצע פיקדון' · Change gen_app_peruk02_scr3_c11 in content file to 'ממוצע פיקדון' or use c12='ממוצע · תיק' · P1 confusing label / wrong result

**4-json-type** · CONFIRMED · machtzev/generator/apps/peruk02.json:110 · `"type": "text"` for field 'ממוצע פיקדון' which represents numeric average · Change `"type": "text"` to `"type": "num"` (or mark field as computed/derived) · P1 semantic type error

## Verification Summary

✅ Dashboard calculation (scr3.dart line 22) correctly calls `appStore.avg('app_peruk02_ent1', gen_app_peruk02_scr3_c14)` with field 'סכום הפיקדון' (numeric) — computation is sound.
✅ Police: compilation gates pass, regen successful, no Dart syntax errors.
✅ Spec addition correct: `ממוצע פיקדון = ממוצע(סכום הפיקדון)` on entity, `ממוצע(תיק.סכום הפיקדון)` on board syntax is valid.
✗ Derived field treated as editable user input (not computed-only).
✗ Field appears in wrong view layer (table) in wrong way (per-row instead of summary).
✗ Label inconsistency.
✗ Type semantic error.

## Gap Analysis

Task: "add to case screen a particle named ממוצע פיקדון showing average of סכום הפיקדון over all cases"

Interpretation: "case screen" = entity detail screen; "average over all cases" = cross-case aggregate (not per-case value). Particle should display as read-only metric on entity detail, cross-case average on board.

Current state: 
- ✓ Calculation works on board
- ✓ Field exists in schema
- ✗ Field is editable (should be read-only/computed)
- ✗ Field shows per-row in table (should not appear in table)
- ✗ Label mislabeled (should show "ממוצע פיקדון" not field name)
- ✗ Type is text not num

## FIX-LIST:
1-ent1-editable · 2-px1-per-row · 3-scr3-label · 4-json-type
