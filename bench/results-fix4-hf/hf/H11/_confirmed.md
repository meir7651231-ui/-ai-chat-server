# ✅ Validator Report: תקרה נמוכה Computed Field

## Findings

**Finding-1** · CONFIRMED · `new/dart-gen-bs/gen_app_sechirut_ent1.dart:54` computation uses stale indices `_v[10]`, `_v[11]` instead of fresh from inputs · `P0 wrong-result` · Replace `min( (num.tryParse(_v[10] ?? '') ?? 0) ,  (num.tryParse(_v[11] ?? '') ?? 0) )` with `min((num.tryParse(_v[3] ?? '') ?? 0) * 3, (num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3)`

**Finding-2** · CONFIRMED · `new/dart-gen-bs/gen_app_sechirut_ent1.dart:208` display uses same stale indices instead of fresh computation · `P0 wrong-result` · Replace `min( (num.tryParse(_v[10] ?? '') ?? 0) ,  (num.tryParse(_v[11] ?? '') ?? 0) )` with `min((num.tryParse(_v[3] ?? '') ?? 0) * 3, (num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3)`

## Verification

**Root cause:** The _labelsAll mapping (line 33) places indices:
- `_v[3]` = c12 = שכירות (input)
- `_v[4]` = c13 = חודשים (input)
- `_v[10]` = c27 = תקרה לפי 3 חודשים (saved/loaded value)
- `_v[11]` = c28 = תקרה לפי שליש (saved/loaded value)

The _edit function (line 66) loads previously-saved c27/c28 into _v[10]/_v[11]. When computing c29:
- **New record:** _v[10] and _v[11] are undefined → `min(0, 0) = 0` ✗
- **Edited record:** _v[10] and _v[11] contain old values → stale ceiling ✗

Correct pattern is visible in lines 205–207:
- Line 205: c26 = `_v[3] * 12` (salary * 12) ✓
- Line 206: c27 = `_v[3] * 3` (salary * 3) ✓
- Line 207: c28 = `_v[3] * _v[4] / 3` (salary * months / 3) ✓
- Line 208: c29 = `_v[10] * _v[11]` (stale saved values) ✗

**Spec compliance:** Line 7 of machtzev/generator/specs-ds/sechirut.txt correctly specifies:
`תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)`

Where תקרה לפי 3 חודשים = שכירות * 3 and תקרה לפי שליש = שכירות * חודשים / 3.

**Dart soundness:** Null-safety is correct in both formulas (`num.tryParse(...) ?? 0` handles empty fields). The `min()` function from `dart:math` (line 11 import) is correctly used as a top-level function, not a method.

**Police report discrepancy:** The `calc` and `min` gates confirm syntax validity but NOT semantic correctness. They verify `min()` is available and compiles, not that its arguments are fresh.

## Impact

- **New records:** 0 displayed instead of actual min(salary*3, salary*months/3)
- **Edited records:** Display and save use pre-edit ceilings, not recalculated ones
- **Business logic failure:** Core constraint checking (בטוחה entity references these fields) uses wrong ceiling values

FIX-LIST: Finding-1, Finding-2
