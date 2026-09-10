# 🔍 Audit Report: Sechirut min() Computed Field

## Finding

**gen_app_sechirut_ent1.dart:54 · min() computed field uses wrong field indices · P1 (wrong result) · Recalculate c29 directly from source fields _v[3] and _v[4], not from _v[10] and _v[11]**

**gen_app_sechirut_ent1.dart:208 · min() display calculation uses wrong field indices · P1 (wrong result) · Recalculate c29 directly from source fields _v[3] and _v[4], not from _v[10] and _v[11]**

## Detail

The computed field `תקרה נמוכה` (c29) is defined in the spec as: `min(תקרה לפי 3 חודשים, תקרה לפי שליש)`.

**Root cause:** The builder implemented c29 as `min(_v[10], _v[11])` where indices [10] and [11] refer to the STORED display values of the previously-computed fields c27 and c28. This fails because:

1. When **creating a new record**, _v[10] and _v[11] are never populated by user input—they are read-only display fields. Both evaluate to empty string → `0`, yielding `min(0, 0)` = "0.00" (wrong).

2. When **editing and changing source fields**, the display (line 208) shows the old stored values of _v[10] and _v[11] instead of recalculating from the live input _v[3] (שכירות) and _v[4] (חודשים).

**Correct fix:** Calculate c29 from source fields directly:
- Line 54: Replace `min( (num.tryParse(_v[10] ?? '') ?? 0) ,  (num.tryParse(_v[11] ?? '') ?? 0) )` with:
  ```
  min( ((num.tryParse(_v[3] ?? '') ?? 0) * 3) , ((num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3) )
  ```

- Line 208: Same replacement for the display _calc() call.

## Verification Coverage

✅ **Checked:**
- Generated Dart file structure and field indices (_labelsAll array lines 33)
- User input field population (_v[0..8] populated, _v[10..11] never populated for new records)
- min() function availability (dart:math imported line 11)
- Both save (line 54) and display (line 208) code paths

❌ **Could not check:**
- Runtime execution (Flutter/Dart not available; can only reason from language semantics)
- Whether existing stored records have valid c27/c28 values (would enable the bug to mask in edit mode)
- Test results that should exercise the new record path

## Severity Justification

**P1 (wrong result):** New records will always save `תקרה נמוכה = 0.00` regardless of input. Display shows hardcoded stored values instead of live calculation. Task requirement is broken for the core create-record flow.
