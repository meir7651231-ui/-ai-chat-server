# 🔍 Audit: sechirut תקרה נמוכה computed field

## Critical Findings

**gen_app_sechirut_ent1.dart:208** · min() uses wrong source values · **P1 wrong-result** · Use calculated c27/c28 values, not stored _v[10]/_v[11]

## Details

### Issue Summary
The computed field תקרה נמוכה (line 7 of sechirut.txt: `min(תקרה לפי 3 חודשים, תקרה לפי שליש)`) is calculated incorrectly on new record creation.

### Root Cause
In gen_app_sechirut_ent1.dart:
- **Line 54 (save):** `gen_app_sechirut_ent1_c29: (min( (num.tryParse(_v[10] ?? '') ?? 0) ,  (num.tryParse(_v[11] ?? '') ?? 0) )).toStringAsFixed(2)`
- **Line 208 (display):** `_calc(gen_app_sechirut_ent1_c29, min( (num.tryParse(_v[10] ?? '') ?? 0) ,  (num.tryParse(_v[11] ?? '') ?? 0) ))`

Both use `_v[10]` and `_v[11]`, which hold STORED values from the data store (empty on new records).

### Expected Behavior
- Line 206: c27 = שכירות * 3 (correctly uses _v[3])
- Line 207: c28 = שכירות * חודשים / 3 (correctly uses _v[3] and _v[4])
- Line 208: c29 should = min(c27, c28), but currently = min(_v[10], _v[11])

### Failure Scenario
Creating a new record with:
- שכירות = 6000
- חודשים = 36

Expected:
- c27 = 18,000 (6000 × 3)
- c28 = 72,000 (6000 × 36 ÷ 3)
- c29 = 18,000 (min of the two)

Actual:
- c27 = 18,000 ✓
- c28 = 72,000 ✓
- c29 = 0.00 ✗ (min of two empty strings parses to 0)

When editing the SAME record later, c29 displays correctly (18,000) because _v[10]/[11] are now populated from the store. This makes the bug hard to spot in manual testing.

### Fix
Replace `_v[10]` and `_v[11]` with direct calculations matching c27 and c28:
```dart
// Line 54 (save)
gen_app_sechirut_ent1_c29: (min(
  (num.tryParse(_v[3] ?? '') ?? 0) * 3,
  (num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3
)).toStringAsFixed(2)

// Line 208 (display)
_calc(gen_app_sechirut_ent1_c29, min(
  (num.tryParse(_v[3] ?? '') ?? 0) * 3,
  (num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3
))
```

---

## Verified Correct

✅ **Spec syntax**: sechirut.txt line 7 correctly defines תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)
✅ **Import**: dart:math is imported at line 11, min() function available
✅ **New field registered**: gen_app_sechirut_ent1_c29 added to _labelsAll and content constants
✅ **Field registration**: apps/sechirut.json includes new field with correct label תקרה נמוכה (line 125)
✅ **Display integration**: New field appears in _card() display (line 107), CSV export (lines 121, 123), and table view (line 220)
✅ **No orphans**: Only sechirut-related files changed; other apps (schoolos, studio, etc.) remain byte-identical
✅ **Compilation**: Flutter analyze returns 0 errors; Dart type-checks cleanly with dart:math::min
✅ **min() function usage**: Correctly imported and callable; no syntax errors in min(a, b) invocation

---

## Coverage

**Checked**: Generated Dart screen file (ent1.dart), content file, field registration, min() import, display/save logic flow, new field presence, app-wide isolation

**Could not check**: Runtime behavior (no Flutter runtime; audited Dart semantics only); whether user-facing value persists correctly in AppStore across save/load cycles (would require runtime verification)
