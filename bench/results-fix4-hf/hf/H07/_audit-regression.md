# 🔍 Audit Report — H07 (sechirut.txt) · Regression & State-Leakage Check

## Findings: CLEAN

No defects found. All verification checks passed.

## Verification Coverage

✅ **Spec syntax:** Field `תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש)` correctly added to בטוחה entity (sechirut.txt:170)

✅ **Formula compilation:** Dart `Math.max()` correctly invoked (imported `dart:math` at gen_app_sechirut_ent2.dart:9); machine gates confirm `max(fn=true, method=false)` — function not method, ruling out false positive with Dart num API

✅ **Index mapping:** Field indices in _labelsAll (line 30) match formula inputs: _v[6]=c21 (תקרה לפי 3 חודשים), _v[7]=c23 (תקרה לפי שליש)

✅ **Computed field storage:** gen_app_sechirut_ent2_c24 correctly computed and persisted in _save() method (line 51): `(max((num.tryParse(_v[6] ?? '') ?? 0), (num.tryParse(_v[7] ?? '') ?? 0))).toStringAsFixed(2)`

✅ **UI display:** Computed value displayed live in _calc widget (line 179) with correct indices and Math.max() call

✅ **Card and table exports:** All 11 fields including new c24 present in _card() display (line 91-92), table generation (line 191), and CSV headers (line 97-98); read from stored records, no hardcoded formulas in display layer

✅ **No state leakage:** Machine report confirms `byte_identical_others=✅`; no other apps or non-sechirut files touched

✅ **No substring collision:** "תקרה לפי 3 חודשים" search in gen_app_sechirut_*.dart finds only comments and sechirut-specific content; no over-triggering in other spec entities

✅ **Existing field integrity:** Fields חורג מול 3 חודשים and חורג מול שליש remain unchanged (lines 180-181 show correct logic, unaffected by new field)

✅ **Machine gates:** All gates pass per _police.md: regen_ok, byte_identical_others, gates_pass, dart_math_sane, calc (consts=1 calc=1), max (fn=true)

---

**Conclusion:** Task correctly implemented. Formula references valid field indices. Dart syntax sound (num.tryParse returns num?; Math.max is top-level function). No regressions detected.
