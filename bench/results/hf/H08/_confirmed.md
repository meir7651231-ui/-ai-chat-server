# Validator Report — panuy app · computed field מרחק אבסולוטי

## Findings (ranked by severity)

**P1-save** · CONFIRMED · `new/dart-gen-bs/gen_app_panuy_ent1.dart:49` quoted `gen_app_panuy_ent1_c24: (((num.tryParse(_v[8] ?? '') ?? 0)).abs()).toStringAsFixed(2)` · computed field c24 (מרחק אבסולוטי) references uninitialized _v[8] (הפרש רוחב stored value) in save path; for new records _v[8] is empty, parses to 0, saves 0.00 instead of calculated abs(_v[2] - _v[4]); for edited records, persists stale stored value instead of recomputing from current form inputs · Fix: `gen_app_panuy_ent1_c24: (((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)).abs()).toStringAsFixed(2)`

**P1-display** · CONFIRMED · `new/dart-gen-bs/gen_app_panuy_ent1.dart:173` quoted `_calc(gen_app_panuy_ent1_c24, ((num.tryParse(_v[8] ?? '') ?? 0)).abs())` · same dependency bug in display path; for new records shows 0 instead of calculated value; for edited records, shows stale stored value if user changes _v[2] or _v[4] inputs; contrast line 171 which correctly renders c22 as `(num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)` from live inputs · Fix: `_calc(gen_app_panuy_ent1_c24, ((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)).abs())`

## Verification Summary

✅ **Spec correct**: machtzev/generator/specs-ds/panuy.txt line 4 properly defines `מרחק אבסולוטי = (הפרש רוחב).abs()` and הפרש רוחב correctly as `קו רוחב - קו רוחב שלי` (input fields _v[2] - _v[4])

✅ **Dart syntax valid**: `num.abs()` is a legitimate method on Dart `num` type; formula compiles

✅ **Root cause identified**: Generator did not recursively expand computed field dependency; instead of inlining `abs((_v[2] - _v[4]))`, it referenced the stored value _v[8] which is only populated when loading edited records, never for new records

✅ **Regression check**: No impact outside generated files; panuy is new app; sister computed fields c22 (הפרש רוחב) and c25 (מרחק בריבוע) correctly compute from source inputs; c23 (הפרש אורך) also correctly uses source fields

⚠️ **Severity**: Both are P1 WRONG RESULT — new records always save 0.00; edited records show stale values on display changes

## FIX-LIST:
1. Line 49: replace c24 computation with `(((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)).abs()).toStringAsFixed(2)`
2. Line 173: replace c24 display with `_calc(gen_app_panuy_ent1_c24, ((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)).abs())`
