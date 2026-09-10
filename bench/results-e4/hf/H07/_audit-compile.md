# 🔍 Audit: תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש)

## Findings
No findings. The computed field implementation is sound.

## Verified correct

**dart:math imports & max() function usage:**
- Line 9 of gen_app_sechirut_ent2.dart: `import 'dart:math';` ✓
- max() is a top-level function in dart:math, not a method on num ✓
- Signature: `T max<T extends num>(T a, T b)` returns T (here: num) ✓

**Null-safety analysis:**
- Line 51: `max( (num.tryParse(_v[6] ?? '') ?? 0) ,  (num.tryParse(_v[7] ?? '') ?? 0) )`
  - `_v[6]` is String?, `?? ''` makes it String, `num.tryParse(String)` returns num?, `?? 0` makes it num ✓
  - Same for `_v[7]` ✓
  - Both args to max() are num type ✓

**Formula correctness:**
- Spec line 8: `תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש)` 
- Implementation _v indices: _v[6] = c21 (תקרה לפי 3 חודשים), _v[7] = c23 (תקרה לפי שליש) ✓
- Computed on save (line 51) and displayed live (line 179) ✓
- Result formatted via `.toStringAsFixed(2)` for monetary display ✓

**Content constants:**
- gen_app_sechirut_ent2_content.dart line 26: `const String gen_app_sechirut_ent2_c24 = 'תקרה מחייבת';` ✓
- Field properly indexed in _labelsAll (line 30), _v slots (8 in _edit), and map keys (line 51) ✓

**Edge cases:**
- Empty values: both fields default to 0, max(0,0) = 0 ✓
- Type inference: max(num, num) → num; num.toStringAsFixed(int) → String ✓
- No arithmetic overflow risk (monetary values, human-scale numbers) ✓

**Flutter/Dart analyzer status:**
- Police report confirms: compiles=✅, no analyzer errors, max=✅ fn=true (function, not method)

---

Coverage: Null-safety · arithmetic correctness · Dart type system · import presence · formula logic · edge cases (empty/zero inputs) · display formatting. Could not check: app runtime behavior (no emulator/device), end-to-end UI flow.
