# 🔍 Auditor Report — panuy task (H08)

## Findings

**new/dart-gen-bs/gen_app_panuy_ent1.dart:51 · מרחק אבסולוטי computed from uninitialized _v[8] instead of from source fields; when creating new record, abs(0) always · P1 wrong result · compute abs((_v[2] - _v[4])) instead of abs(_v[8])**

**new/dart-gen-bs/gen_app_panuy_ent1.dart:174 · מרחק אבסולוטי display uses uninitialized _v[8]; shows 0 for new records · P1 wrong result · compute abs((_v[2] - _v[4])) instead of abs(_v[8])**

## Coverage

**Verified correct (traced logic for abs() implementation):**
- Wrapper function `_m_abs(num x)` defined correctly at line 17; calls native `.abs()` method on num (sound)
- null-safety: `num.tryParse()` returns `num?`, properly nullcoalesced with `?? 0`
- הפרש רוחב (c22) correctly computed as `_v[2] - _v[4]` at lines 51/173 (קו רוחב - קו רוחב שלי)
- User input fields `_v[0..7]` properly mapped: _v[2]=קו רוחב, _v[4]=קו רוחב שלי (source data available)

**Bug identified (logic trace):**
- Computed field מרחק אבסולוטי (c23, task requirement) defined in spec as `abs(הפרש רוחב)`
- Code at line 51/174 attempts `abs(_v[8])` where _v[8] maps to stored הפרש רוחב value
- _v[8] only populated when editing existing record (line 63 _edit method loads from storage)
- **When creating new record: _v[8] is undefined ⇒ _v[8] ?? '' ⇒ num.tryParse('') ⇒ null ⇒ ?? 0 ⇒ abs(0) = 0 (wrong)**
- Correct: must recompute from source: `abs((_v[2] ?? '') parsed - (_v[4] ?? '') parsed)` = `abs(קו רוחב - קו רוחב שלי)`
- Impacts: new record creation always saves מרחק אבסולוטי=0; editing record doesn't recalculate if user changes latitude values

---

**Compilation:** ✅ (no Dart syntax/null-safety errors; issue is logic/runtime)  
**Scope:** abs() field implementation (task H08: add מרחק אבסולוטי = abs(הפרש רוחב))  
**Police verdict alignment:** report says abs() used 1×, compiles ✅; does not catch logic bug (runtime-only)
