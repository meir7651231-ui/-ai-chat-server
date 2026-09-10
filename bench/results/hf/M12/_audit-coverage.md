# Audit Coverage Report: peruk02 average deposit particle

## Findings

new/dart-gen-bs/gen_app_peruk02_ent1.dart:58 · "ממוצע פיקדון" treated as editable field in save map, but should be read-only calculated value · P1 wrong result · Remove c21 from _labelsAll, remove c21 from save map on line 58, display it read-only using appStore.avg() if shown in entity detail

new/dart-gen-bs/gen_app_peruk02_px1.dart:27 · Table column c13 "ממוצע פיקדון" displays per-case value in each row, but average should be single summary metric, not repeated for each case · P1 wrong result · Remove c13 from table columns and items iteration; show summary average only in dashboard (scr3)

new/dart-data-bs/auto/gen_app_peruk02_scr3_content.dart:13 · Dashboard label for average is c11='סכום הפיקדון' (field name) when spec requires 'ממוצע פיקדון' · P2 minor · Change c11 to 'ממוצע פיקדון' or use alternative label constant with correct text

machtzev/generator/apps/peruk02.json:108-112 · Added "ממוצע פיקדון" as text field type in entity schema, but computed/derived fields should not be in schema as editable fields · P1 wrong result · Remove the field from JSON schema; it should be calculated only, never stored

## Verified Coverage

✓ **Task recognition**: Specification correctly updated in peruk02.txt with both `ממוצע פיקדון = ממוצע(סכום הפיקדון)` on entity and `ממוצע(תיק.סכום הפיקדון)` on board
✓ **Dashboard calculation**: gen_app_peruk02_scr3.dart line 22 correctly calls `appStore.avg('app_peruk02_ent1', 'סכום הפיקדון')` to compute cross-case average
✓ **Police report**: avg_code gate confirmed, regen succeeded
✗ **Derived field implementation**: Field is stored/editable (ent1, px1) instead of computed-only (should exist only in dashboard and entity detail read-only)
✗ **Label correctness**: Dashboard uses field name as label instead of "ממוצע פיקדון"

**Gap**: Task asks for "particle named ממוצע פיקדון" added to case screen. Currently ממוצע פיקדון appears as (1) editable field in entity form [wrong], (2) table column in case list [wrong], (3) calculated metric in board/dashboard [correct]. The particle should be readonly-display in entity detail, not editable in form or per-row in table.
