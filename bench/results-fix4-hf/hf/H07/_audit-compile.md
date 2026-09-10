# Audit: sechirut — Computed Field תקרה מחייבת

## Findings
None. Implementation is sound.

## Verified correct (audit lens: compile-safety, edge-crash, null-handling)

**Formula implementation (תקרה מחייבת = max):**
- Line 51 (save path): `max( (num.tryParse(_v[6] ?? '') ?? 0) ,  (num.tryParse(_v[7] ?? '') ?? 0) )).toStringAsFixed(2)` — correctly references _v[6] (תקרה לפי חודשים/c21) and _v[7] (תקרה לפי שליש/c23); both parsed with null-safety; result converted to 2-decimal string
- Line 179 (display path): same formula fed to `_calc()` for UI display; numeric type preserved

**Null-safety:**
- All `num.tryParse()` calls followed by `?? 0` default; no null pointer risk
- Both ceiling inputs handled correctly for empty/non-numeric cases

**Dart method/function availability:**
- `max()` imported from `dart:math` (line 9); top-level function exists and takes `num` operands
- `.toStringAsFixed(2)` is valid `num` method; argument type (int literal 2) correct

**Operator precedence & parentheses:**
- All balanced: outer `(max(...))`, inner `max( (...) , (...) )`, tryParse wraps correct; no syntax issues

**Field indices in generated code:**
- `_labelsAll` (line 30) shows c21 at index 6, c23 at index 7, c24 at index 8
- Formula uses _v[6] and _v[7] — correct indices for the two ceiling fields
- c24 inserted between c23 and c25 without index collision

**Data flow:**
- c24 computed and stored on save (line 51); not hardcoded empty like c25/c28
- c24 retrieved from record on edit (line 63: _v[8] = r[gen_app_sechirut_ent2_c24])
- c24 displayed in card and table; label content correct

**Type consistency:**
- Input: num (from tryParse with fallback); calculation: num; output: string
- No text-vs-number comparison errors; all comparisons are num-to-num

**Coverage: Checked lines 51, 63, 92, 179, 191; verified no new breaking changes to existing field references or control flow.**
