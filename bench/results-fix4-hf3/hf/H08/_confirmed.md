# ✅ VALIDATOR REPORT — panuy computed field מרחק אבסולוטי

## Verdict Summary

**2 CONFIRMED P0 findings.** Both are the same semantic bug in two locations: using stale/unset `_v[8]` (stored הפרש רוחב value) instead of freshly computed value from source fields.

---

## Finding 1: Line 51 (save logic) — stale value in computation

**Verdict:** CONFIRMED P0

**Evidence:** `new/dart-gen-bs/gen_app_panuy_ent1.dart:51`  
```dart
gen_app_panuy_ent1_c23: (_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) )).toStringAsFixed(2),
```

**Failure scenario:**
1. **New record:** `_v[8]` undefined (not in map) → `_v[8] ?? ''` → `''` → `num.tryParse('')` → `null` → `?? 0` → `0` → `abs(0)` = `0`. Result: **always zero regardless of actual lat/lon inputs.** ✗
2. **Edited record:** `_v[8]` = old stored הפרש רוחב (loaded during `_edit()` at line 61). If user changes `_v[2]` or `_v[4]` in the form, c22 recalculates, but c23 still uses **old** `_v[8]`. Result: **stale cached value, not updated.** ✗

**Contrast (correct pattern):** Line 51 c22 correctly recomputes: `((num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0))` — uses fresh inputs, not stored value.

**Correct fix:** Replace `_v[8]` with `(num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)`  
(This substitutes the definition of הפרש רוחב directly, matching spec `מרחק אבסולוטי = abs(הפרש רוחב)` where הפרש רוחב = קו רוחב - קו רוחב שלי.)

---

## Finding 2: Line 174 (display logic) — stale value in recalc

**Verdict:** CONFIRMED P0

**Evidence:** `new/dart-gen-bs/gen_app_panuy_ent1.dart:174`  
```dart
_calc(gen_app_panuy_ent1_c23, _m_abs( (num.tryParse(_v[8] ?? '') ?? 0) )),
```

**Failure scenario:** Display UI recalculates abs() on every build/setState. Same bug as Finding 1: uses `_v[8]` (old stored value) instead of fresh `_v[2]` and `_v[4]`. When user edits latitude fields in the form (line 167–169), the display of c23 does NOT update (line 174 recomputes with stale _v[8]).

**Correct fix:** Replace `_v[8]` with `(num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)`

---

## Why machine checks missed this

- **compiles ✅:** Code is syntactically correct Dart; no type/null-safety errors.
- **dart_math_sane ✅:** `.abs()` is a valid method on `num`; `sqrt` import present.
- **calc ✅:** Detects presence of calc fields, not semantic correctness.
- **gates ✅:** Gates verify wiring structure, function existence, not computation logic.

Machine cannot detect: *value dependencies and stale-value bugs that compile cleanly.*

---

## Auditor conflict resolution

- **_audit-coverage.md** claims "task complete" and lists c23 as "correctly parsed and passed to _m_abs."  
  **Verdict:** FALSE-POSITIVE due to surface-level checks (field exists, function exists) without semantic validation.

- **_audit-compile.md** and **_audit-regression.md** both correctly identify the stale-value bug.  
  **Verdict:** CORRECT.

---

## FIX-LIST:

- **C1:** Line 51, replace `(_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) ))` with `(_m_abs( (num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0) ))`
- **C2:** Line 174, replace `_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) )` with `_m_abs( (num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0) )`
